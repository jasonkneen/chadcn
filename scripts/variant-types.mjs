import ts from './typescript.mjs';

// Isolated declaration emit cannot infer cva calls. Preserve their literal variant schema.
export function variantTypes(context) {
  const f = context.factory;
  return source => {
    const imports = new Set();
    for (const statement of source.statements) {
      if (!ts.isImportDeclaration(statement) || statement.moduleSpecifier.text !== 'class-variance-authority') continue;
      const bindings = statement.importClause?.namedBindings;
      if (bindings && ts.isNamedImports(bindings)) for (const item of bindings.elements) {
        if ((item.propertyName ?? item.name).text === 'cva') imports.add(item.name.text);
      }
    }
    const nameOf = node => ts.isIdentifier(node) || ts.isStringLiteral(node) || ts.isNumericLiteral(node) ? node.text : null;
    const visitor = node => {
      if (ts.isVariableDeclaration(node) && !node.type && node.initializer && ts.isCallExpression(node.initializer) && ts.isIdentifier(node.initializer.expression) && imports.has(node.initializer.expression.text)) {
        const config = node.initializer.arguments[1];
        const variants = config && ts.isObjectLiteralExpression(config) && config.properties.find(p => ts.isPropertyAssignment(p) && nameOf(p.name) === 'variants');
        if (variants && ts.isObjectLiteralExpression(variants.initializer)) {
          const fields = [];
          for (const variant of variants.initializer.properties) {
            if (!ts.isPropertyAssignment(variant) || nameOf(variant.name) === null || !ts.isObjectLiteralExpression(variant.initializer)) return node;
            const values = [];
            for (const value of variant.initializer.properties) {
              if (!ts.isPropertyAssignment(value) || nameOf(value.name) === null) return node;
              const key = nameOf(value.name);
              values.push(key === 'true' || key === 'false' ? 'boolean' : JSON.stringify(key));
            }
            fields.push(`${JSON.stringify(nameOf(variant.name))}?: ${[...new Set(values), 'null', 'undefined'].join(' | ')}`);
          }
          const declaration = ts.createSourceFile('variant.ts', `type V = (props?: {${fields.join(';')}} & import("class-variance-authority/types").ClassProp) => string`, ts.ScriptTarget.Latest, true);
          const synthesize = child => {
            ts.setTextRange(child, { pos: -1, end: -1 });
            ts.forEachChild(child, synthesize);
          };
          synthesize(declaration.statements[0].type);
          return f.updateVariableDeclaration(node, node.name, node.exclamationToken, declaration.statements[0].type, node.initializer);
        }
      }
      return ts.visitEachChild(node, visitor, context);
    };
    return ts.visitNode(source, visitor);
  };
}
