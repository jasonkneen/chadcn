import fs from 'node:fs/promises';
import path from 'node:path';
import ts from './typescript.mjs';
import { exists, inside, readJSON, digest, writeJSON } from './lib.mjs';
import { materializeIcons } from './icons.mjs';
import { variantTypes } from './variant-types.mjs';

const sourceExtensions = ['','.tsx','.ts','.jsx','.js','.mjs','.json','.css','/index.tsx','/index.ts','/index.jsx','/index.js'];
const jsPath = p => p.replace(/\.(tsx?|jsx)$/, '.js');
const barePackage = spec => spec.startsWith('@') ? spec.split('/').slice(0,2).join('/') : spec.split('/')[0];
export async function resolveFile(base) {
  for (const ext of sourceExtensions) {
    const candidate = base + ext;
    if ((await fs.stat(candidate).catch(() => null))?.isFile()) return candidate;
  }
  return null;
}
export async function buildSourcePackage(source, items, output) {
  const sourceRoot = path.resolve(source.path, source.root);
  const packageName = `@chadcn/upstream-${source.id}`;
  const modules = new Map();
  const visiting = new Set();
  const dependencies = { react: '^19.2.0', 'react-dom': '^19.2.0' };
  const problems = [];
  const manifests = new Map();
  async function versionFor(name, file) {
    let dir = path.dirname(file);
    while (inside(source.path, dir)) {
      if (!manifests.has(dir)) manifests.set(dir, await readJSON(path.join(dir,'package.json')).catch(() => ({})));
      const m = manifests.get(dir);
      const version = m.dependencies?.[name] ?? m.peerDependencies?.[name] ?? m.devDependencies?.[name];
      if (version && !version.startsWith('workspace:')) return version;
      if (version?.startsWith('workspace:')) {
        const workspace = await readJSON(path.join(source.path,'packages',name.split('/').at(-1),'package.json')).catch(()=>null);
        if (workspace?.name===name && workspace.version && workspace.version!=='0.0.0' && !workspace.private) return workspace.version;
      }
      if (dir === source.path) break;
      dir = path.dirname(dir);
    }
    return null;
  }
  async function visit(file) {
    if (modules.has(file) || visiting.has(file)) return;
    if (!inside(sourceRoot,file)) throw new Error(`Source escapes its package: ${file}`);
    visiting.add(file);
    const bytes = await fs.readFile(file);
    const relative = path.relative(sourceRoot,file).split(path.sep).join('/');
    const record = { path: relative, hash: digest(bytes), imports: [], errors: [] };
    modules.set(file,record);
    const outputPath = path.join(output,'src',jsPath(relative));
    await fs.mkdir(path.dirname(outputPath),{recursive:true});
    if (!/\.[cm]?[jt]sx?$/.test(file)) {
      await fs.writeFile(outputPath, bytes);
      visiting.delete(file);
      return;
    }
    const code = source.icons === 'lucide' ? materializeIcons(bytes.toString('utf8'),file) : bytes.toString('utf8');
    const ast = ts.createSourceFile(file,code,ts.ScriptTarget.Latest,true,file.endsWith('x') ? ts.ScriptKind.TSX : ts.ScriptKind.TS);
    const literals = [];
    function scan(node) {
      if ((ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) && node.moduleSpecifier) literals.push(node.moduleSpecifier);
      if (ts.isCallExpression(node) && (node.expression.kind === ts.SyntaxKind.ImportKeyword || node.expression.getText(ast) === 'require') && node.arguments.length && ts.isStringLiteral(node.arguments[0])) literals.push(node.arguments[0]);
      ts.forEachChild(node,scan);
    }
    scan(ast);
    const importPositions = new Set(literals.map(n=>`${n.pos}:${n.end}`));
    const replacements = new Map();
    for (const literal of literals) {
      const spec = literal.text;
      let candidate;
      if (spec.startsWith('.')) candidate = path.resolve(path.dirname(file),spec);
      else {
        const alias = Object.keys(source.aliases ?? {}).sort((a,b) => b.length-a.length).find(a => spec.startsWith(a));
        if (alias) candidate = path.resolve(sourceRoot,source.aliases[alias],spec.slice(alias.length));
      }
      if (candidate) {
        const resolved = await resolveFile(candidate);
        if (!resolved || !inside(sourceRoot,resolved)) {
          const error = `Unresolved local import ${spec} in ${relative}`;
          record.errors.push(error); problems.push(error); continue;
        }
        record.imports.push(resolved);
        await visit(resolved);
        let target = path.relative(path.dirname(file),resolved).split(path.sep).join('/');
        if (!target.startsWith('.')) target = './'+target;
        replacements.set(spec,jsPath(target));
      } else if (!spec.startsWith('node:')) {
        const name = barePackage(spec);
        const version = await versionFor(name,file);
        if (version) dependencies[name] ??= version;
        else {
          const error = `No upstream dependency version for ${name} in ${relative}`;
          record.errors.push(error); problems.push(error);
        }
      }
    }
    const transformer = context => node => {
      const visitor = n => ts.isStringLiteral(n) && importPositions.has(`${n.pos}:${n.end}`) && replacements.has(n.text)
        ? context.factory.createStringLiteral(replacements.get(n.text))
        : ts.visitEachChild(n,visitor,context);
      return ts.visitNode(node,visitor);
    };
    const compiled = ts.transpileModule(code,{ fileName:file, compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ESNext,jsx:ts.JsxEmit.ReactJSX}, transformers:{before:[transformer]},reportDiagnostics:true });
    for (const diagnostic of compiled.diagnostics ?? []) {
      if (diagnostic.category === ts.DiagnosticCategory.Error) {
        const error = `${relative}: ${ts.flattenDiagnosticMessageText(diagnostic.messageText,' ')}`;
        record.errors.push(error); problems.push(error);
      }
    }
    await fs.writeFile(outputPath,compiled.outputText);
    const transformedTypes = ts.transform(ast,[transformer,variantTypes]);
    const declaration = ts.transpileDeclaration(ts.createPrinter().printFile(transformedTypes.transformed[0]),{fileName:file,compilerOptions:{jsx:ts.JsxEmit.ReactJSX},reportDiagnostics:false});
    transformedTypes.dispose();
    await fs.writeFile(outputPath.replace(/\.[cm]?js$/,'.d.ts'),declaration.outputText);
    visiting.delete(file);
  }
  const exports = {};
  for (const [name, asset] of Object.entries(source.assets ?? {})) {
    const absolute = path.resolve(source.path, asset);
    if (!inside(source.path, absolute)) throw new Error(`Asset escapes its checkout: ${asset}`);
    const bytes = await fs.readFile(absolute);
    const target = `assets/${name}`;
    if (!inside(path.join(output, 'assets'), path.resolve(output, target))) throw new Error(`Invalid asset export: ${name}`);
    await fs.mkdir(path.dirname(path.join(output, target)), { recursive: true });
    await fs.writeFile(path.join(output, target), bytes);
    modules.set(absolute, { path: path.relative(sourceRoot, absolute), hash: digest(bytes), imports: [], errors: [] });
    exports[`./${name}`] = `./${target}`;
  }
  for (const item of items) {
    item.entries = [];
    for (const file of item.files ?? []) {
      if (!/\.[jt]sx?$/.test(file.path)) continue;
      const absolute = path.resolve(sourceRoot,file.path);
      if (!inside(sourceRoot,absolute) || !(await exists(absolute))) {
        item.errors ??= []; item.errors.push(`Missing upstream file: ${file.path}`); continue;
      }
      await visit(absolute);
      const exportName = item.entries.length ? `${item.name}/${file.path.replace(/\.[^.]+$/,'')}` : item.name;
      const key = `./${exportName}`;
      if (exports[key] && exports[key] !== `./src/${jsPath(file.path)}`) throw new Error(`Duplicate export ${key}`);
      exports[key] = `./src/${jsPath(file.path)}`;
      item.entries.push({ import: `${packageName}/${exportName}`, file: file.path });
    }
  }
  function collectErrors(file,seen = new Set()) {
    if (seen.has(file)) return [];
    seen.add(file);
    const module = modules.get(file);
    return module ? [...module.errors,...module.imports.flatMap(p => collectErrors(p,seen))] : [];
  }
  for (const item of items) {
    item.errors = [...new Set([...(item.errors ?? []), ...item.entries.flatMap(e => collectErrors(path.resolve(sourceRoot,e.file)))])];
    item.status = item.errors.length ? 'needs-adapter' : item.entries.length ? 'packaged' : 'metadata-only';
    item.package = packageName;
    delete item.files;
  }
  const licenseFiles = (await fs.readdir(source.path)).filter(n=>/^licen[sc]e|^notice/i.test(n));
  for (const license of licenseFiles) if ((await fs.stat(path.join(source.path,license))).isFile()) await fs.copyFile(path.join(source.path,license),path.join(output,license));
  await writeJSON(path.join(output,'package.json'),{name:packageName,version:'0.0.0',private:true,type:'module',description:`Generated dependency adapter for ${source.repository}. Do not edit.`,repository:source.repository,exports,dependencies,sideEffects:['**/*.css']});
  await writeJSON(path.join(output,'provenance.json'),{source:source.id,repository:source.repository,modules:[...modules.values()].map(({path,hash})=>({path,hash})),problems:[...new Set(problems)]});
  return {items,modules:modules.size,problems:[...new Set(problems)],dependencies};
}
