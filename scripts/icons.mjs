import ts from './typescript.mjs';

// Materialize the Lucide choice using the same placeholder contract as shadcn's CLI.
export function materializeIcons(code, file) {
 const ast=ts.createSourceFile(file,code,ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX);
 const icons=new Set();
 const libraries=new Set(['lucide','tabler','hugeicons','phosphor','remixicon']);
 const transformed=ts.transform(ast,[context=>node=>{
  const f=context.factory;
  function visitor(n){
   if(ts.isJsxSelfClosingElement(n)&&ts.isIdentifier(n.tagName)&&n.tagName.text==='IconPlaceholder'){
    const attr=n.attributes.properties.find(a=>ts.isJsxAttribute(a)&&a.name.text==='lucide');
    if(!attr?.initializer||!ts.isStringLiteral(attr.initializer)) return n;
    const name=attr.initializer.text;
    if(!/^[A-Za-z_$][\w$]*$/.test(name)) throw new Error(`Invalid icon identifier in ${file}`);
    icons.add(name);
    return f.updateJsxSelfClosingElement(n,f.createIdentifier(`Chadcn${name}`),n.typeArguments,f.createJsxAttributes(n.attributes.properties.filter(a=>!ts.isJsxAttribute(a)||!libraries.has(a.name.text))));
   }
   return ts.visitEachChild(n,visitor,context);
  }
  return ts.visitNode(node,visitor);
 }]);
 let result=transformed.transformed[0];
 if(!icons.size){transformed.dispose();return code;}
 // Retain imports if an unsupported placeholder remains; dependency validation will report it.
 let remaining=false;
 function detect(n){if(ts.isJsxSelfClosingElement(n)&&ts.isIdentifier(n.tagName)&&n.tagName.text==='IconPlaceholder')remaining=true;ts.forEachChild(n,detect)}
 detect(result);
 const statements=result.statements.filter(s=>remaining||!ts.isImportDeclaration(s)||!ts.isStringLiteral(s.moduleSpecifier)||!s.moduleSpecifier.text.endsWith('/icon-placeholder'));
 const declaration=ts.factory.createImportDeclaration(undefined,ts.factory.createImportClause(false,undefined,ts.factory.createNamedImports([...icons].sort().map(name=>ts.factory.createImportSpecifier(false,ts.factory.createIdentifier(name),ts.factory.createIdentifier(`Chadcn${name}`))))),ts.factory.createStringLiteral('lucide-react'));
 // Keep use-client directives before imports.
 const directiveEnd=statements.findIndex(s=>!ts.isExpressionStatement(s)||!ts.isStringLiteral(s.expression));
 statements.splice(directiveEnd<0?statements.length:directiveEnd,0,declaration);
 result=ts.factory.updateSourceFile(result,statements);
 const printed=ts.createPrinter().printFile(result);transformed.dispose();return printed;
}
