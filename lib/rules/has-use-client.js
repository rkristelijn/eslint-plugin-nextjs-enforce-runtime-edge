module.exports = function hasUseClientDirective(body) {
  return body.some(
    (statement) =>
      statement.type === 'ExpressionStatement' && statement.expression.type === 'Literal' && statement.expression.value === 'use client'
  );
};
