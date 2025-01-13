const hasUseClientDirective = require('./has-use-client');

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Enforce export const runtime = "edge"; in app folder to avoid build warnings https://app.clickup.com/t/86973rq7n',
      category: 'Best Practices',
      recommended: false,
    },
    fixable: 'code', // Indicates this rule is autofixable
    messages: {
      enforceRuntimeEdge: 'Expected export const runtime = "edge"; in app folder',
    },
    schema: [], // No options
  },
  create(context) {
    return {
      Program(node) {
        const filename = context.getFilename();
        const isAppFile = filename.includes('/src/app/'); // Customize as needed
        if (!isAppFile) return;

        console.log(`Processing file: ${filename}`);

        if (hasUseClientDirective(node.body)) {
          return;
        }

        // Check if runtime is already declared as "edge"
        const hasRuntimeEdge = node.body.some((statement) => {
          return (
            statement.type === 'ExportNamedDeclaration' &&
            statement.declaration &&
            statement.declaration.type === 'VariableDeclaration' &&
            statement.declaration.declarations[0].id.name === 'runtime' &&
            statement.declaration.declarations[0].init.value === 'edge'
          );
        });

        if (hasRuntimeEdge) {
          console.log(`'runtime = "edge";' already declared in file: ${filename}`);
        }

        if (!hasRuntimeEdge) {
          context.report({
            node,
            messageId: 'enforceRuntimeEdge',
            fix(fixer) {
              const sourceCode = context.getSourceCode();
              const body = sourceCode.ast.body;

              // Short-circuit if 'use client'; directive is present
              if (hasUseClientDirective(body)) {
                return null;
              }

              // Find imports at the top of the file
              const importStatements = body.filter((statement) => statement.type === 'ImportDeclaration');
              const lastImport = importStatements[importStatements.length - 1];

              // Check if the runtime variable is already declared at the correct position
              const hasRuntimeDeclarationAtTop = body.find(
                (statement, idx) =>
                  idx > (lastImport ? lastImport.range[1] : 0) &&
                  statement.type === 'ExportNamedDeclaration' &&
                  statement.declaration &&
                  statement.declaration?.declarations?.[0]?.id?.name === 'runtime' &&
                  statement.declaration.declarations[0].init?.value === 'edge'
              );

              if (hasRuntimeDeclarationAtTop) {
                return null; // Already correct placement, no fix needed
              }

              // Create the export declaration to insert
              const exportDeclaration = 'export const runtime = "edge";\n\n';

              // Insert the export declaration after the last import statement
              if (lastImport) {
                console.log(`Inserting 'runtime = "edge";' after the last import in file: ${filename}`);
                return fixer.insertTextAfter(lastImport, `\n\n${exportDeclaration}`);
              } else {
                console.log(`Inserting 'runtime = "edge";' at the top of the file: ${filename}`);
                return fixer.insertTextBefore(body[0], `${exportDeclaration}`);
              }
            },
          });
        }
      },
    };
  },
};