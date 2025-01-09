const rule = require('./lib/rules/enforce-runtime-edge');
const RuleTester = require('eslint-rule-tester');
const ruleTester = new RuleTester();

ruleTester.run('enforce-runtime-edge', rule, {
  valid: [
    {
      filename: 'src/app/myfile.js',
      code: `export const runtime = "edge";`,
    },
    {
      filename: 'src/app/otherfile.js',
      code: `// Some valid file`,
    },
  ],

  invalid: [
    {
      filename: 'src/app/myfile.js',
      code: `// No runtime declaration`,
      errors: [{ message: 'Expected export const runtime = "edge"; in app folder' }],
      output: `export const runtime = "edge";\n\n// No runtime declaration`, // Expected fixed code
    },
  ],
});
