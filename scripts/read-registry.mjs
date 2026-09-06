import fs from 'node:fs/promises';
import path from 'node:path';
import ts from './typescript.mjs';
import { walk } from './lib.mjs';

// Parse static declarations without executing code from an upstream repository.
function literal(node) {
  if (ts.isStringLiteral(node)||ts.isNoSubstitutionTemplateLiteral(node)) return node.text;
  if (ts.isNumericLiteral(node)) return Number(node.text);
  if (node.kind===ts.SyntaxKind.TrueKeyword) return true;
  if (node.kind===ts.SyntaxKind.FalseKeyword) return false;
  if (node.kind===ts.SyntaxKind.NullKeyword) return null;
  if (ts.isAsExpression(node)||ts.isSatisfiesExpression(node)) return literal(node.expression);
  if (ts.isArrayLiteralExpression(node)) return node.elements.map(literal);
  if (ts.isObjectLiteralExpression(node)) return Object.fromEntries(node.properties.map(prop=>{
    if (!ts.isPropertyAssignment(prop)) throw new Error('Non-static registry property');
    return [prop.name.text,literal(prop.initializer)];
  }));
  throw new Error(`Non-static registry expression: ${ts.SyntaxKind[node.kind]}`);
}
export async function readRegistryTree(source) {
  const directory=path.join(source.path,source.root,source.entryRoot);
  const items=[];
  for (const file of (await walk(directory)).filter(p=>p.endsWith('/_registry.ts'))) {
    const ast=ts.createSourceFile(file,await fs.readFile(file,'utf8'),ts.ScriptTarget.Latest,true);
    for (const statement of ast.statements) {
      if (!ts.isVariableStatement(statement)) continue;
      for (const declaration of statement.declarationList.declarations) {
        if (!declaration.initializer || !ts.isArrayLiteralExpression(declaration.initializer)) continue;
        for (const node of declaration.initializer.elements) {
          const item=literal(node);
          items.push({...item,files:(item.files??[]).map(file=>({...file,path:`${source.entryRoot}/${file.path}`}))});
        }
      }
    }
  }
  return items;
}
