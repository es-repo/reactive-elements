const SyntaxJSX = require("@babel/plugin-syntax-jsx/").default;
const reduceWhiteSpaces = require("./helper").reduceWhiteSpaces;

module.exports = babel => {

  const { types: t } = babel;

  function childCallExpression(sourceExpr, node) {

    const noWhiteSpaceTextNodeFilter = n => !(t.isJSXText(n) && n.value.trim() === "");
    const noEmptyExpressionNodeFilter = n => !(t.isJSXExpressionContainer(n) && t.isJSXEmptyExpression(n.expression));

    const filteredChildren = node.children
      .filter(noWhiteSpaceTextNodeFilter)
      .filter(noEmptyExpressionNodeFilter);

    if (filteredChildren.length === 0) {
      return sourceExpr;
    }

    return t.callExpression(
      t.memberExpression(
        sourceExpr,
        t.identifier('child')
      ),
      filteredChildren.map(
        n => {
          switch (n.type) {
            case "JSXElement": return elemExpression(n);
            case "JSXText": return t.stringLiteral(reduceWhiteSpaces(n.value));
            case "JSXExpressionContainer": return n.expression;
            default: throw new Error(`Unsupported JSX child node type: ${n.type}`);
          };
        }));
  }

  function setCallExpression(sourceExpr, node) {

    const nonStatefulAttributes = a => !(a.name.name.startsWith("$"));
    const filteredAttrs = node.openingElement.attributes
      .filter(nonStatefulAttributes);

    if (filteredAttrs.length === 0) {
      return sourceExpr;
    }

    return t.callExpression(
      t.memberExpression(
        sourceExpr,
        t.identifier('set')
      ),
      [t.arrowFunctionExpression(
        [t.identifier("e")],
        t.blockStatement(
          filteredAttrs.map(attr =>
            t.expressionStatement(
              t.assignmentExpression(
                "=",
                t.memberExpression(
                  t.identifier("e"),
                  t.identifier(attr.name.name)
                ),
                t.isJSXExpressionContainer(attr.value)
                  ? attr.value.expression
                  : (attr.value === null ? t.booleanLiteral(true) : attr.value))
            ))
        )
      )]
    );
  }

  function stateCallExpression(sourceExpr, node) {

    const statefulAttributes = a => a.name.name.startsWith("$");
    const filteredAttrs = node.openingElement.attributes
      .filter(statefulAttributes);

    const attrName = a => a.name.name.slice(1);

    return filteredAttrs.reduce((acc, attr) =>
      t.callExpression(
        t.memberExpression(
          acc,
          t.identifier('state')
        ),
        [
          t.isJSXExpressionContainer(attr.value)
            ? attr.value.expression
            : (attr.value === null ? t.booleanLiteral(true) : attr.value),

          t.arrowFunctionExpression(
            [
              t.identifier("e"),
              t.identifier("v"),
            ],
            t.blockStatement(
              [
                t.expressionStatement(
                  t.assignmentExpression(
                    "=",
                    t.memberExpression(
                      t.identifier("e"),
                      t.identifier(attrName(attr))
                    ),
                    t.identifier("v")
                  ))
              ]))
        ]
      ), sourceExpr);
  }

  function elemExpression(node) {

    const tag = node.openingElement.name.name;

    let expr = t.callExpression(
      t.identifier('elem'),
      [t.stringLiteral(tag)]
    )

    expr = setCallExpression(expr, node);
    expr = stateCallExpression(expr, node);
    expr = childCallExpression(expr, node);
    // TODO: style attribute
    // TODO: class attribute
    // TODO: isJSXSpreadAttribute
    //
    // TODO: ref attribute
    //   - ref must be unique 
    //   - ref must be string
    //   - one ref per element

    // TODO: event accessing
    // TODO: event creating
    // TODO: change stateful attributes from "name$" to "$name"

    // TODO: in lib, add child with primitive arguments, like "string", "int", "boolean"

    return expr;
  }

  return {
    name: "ast-transform",
    inherits: SyntaxJSX,
    visitor: {
      JSXElement: path => {
        path.replaceWith(elemExpression(path.node))
      },
      Program: {
        exit: path => {
        }
      }
    }
  };
};