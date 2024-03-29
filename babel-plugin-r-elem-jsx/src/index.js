const SyntaxJSX = require("@babel/plugin-syntax-jsx/").default;
const reduceWhiteSpaces = require("./helper").reduceWhiteSpaces;

module.exports = babel => {

  const { types: t } = babel;

  function childCallExpression(sourceExpr, node, refs) {

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
            case "JSXElement": return elemExpression(n, refs);
            case "JSXText": return t.stringLiteral(reduceWhiteSpaces(n.value));
            case "JSXExpressionContainer": return n.expression;
            default: throw new Error(`Unsupported JSX child node type: ${n.type}`);
          };
        }));
  }

  function attributeAssignmentExpression(attrName, attrValue) {
    return attrName === "style"
      ? styleAttributeAssignmentExpression(attrValue)
      : t.expressionStatement(
        t.assignmentExpression(
          "=",
          t.memberExpression(
            t.identifier("e"),
            t.identifier(attrName)
          ),
          t.isJSXExpressionContainer(attrValue)
            ? attrValue.expression
            : (attrValue === null ? t.booleanLiteral(true) : attrValue))
      );
  }

  function styleAttributeAssignmentExpression(attrValue) {
    if (t.isStringLiteral(attrValue)) { 
      return setStyleAttributeExpression(attrValue);
    }

    let expr = setStyleAttributeConditionallyExpression(
      t.isJSXExpressionContainer(attrValue)
        ? attrValue.expression
        : attrValue
    );

    if (t.isJSXExpressionContainer(attrValue)) {
      expr = t.expressionStatement(
        t.callExpression(
          t.functionExpression(null, [t.identifier("v")],
            t.blockStatement([
              expr
            ])),
          [attrValue.expression]
        ));
    }

    return expr;
  }

  function setStyleAttributeConditionallyExpression(){
    return t.ifStatement(

      t.binaryExpression(
        "===",
        t.unaryExpression(
          "typeof",
          t.identifier("v")),
        t.stringLiteral("string")),

      setStyleAttributeExpression(t.identifier("v")),

      t.expressionStatement(
        t.callExpression(
          t.memberExpression(
            t.callExpression(
              t.memberExpression(
                t.identifier("Object"),
                t.identifier("keys")),
              [t.identifier("v")]
            ),
            t.identifier("forEach")
          ),
          [
            t.arrowFunctionExpression(
              [t.identifier("i")],
              t.assignmentExpression("=",
                t.memberExpression(
                  t.memberExpression(
                    t.identifier("e"),
                    t.identifier("style")
                  ),
                  t.identifier("i"),
                  true
                ),
                t.memberExpression(
                  t.identifier("v"),
                  t.identifier("i"),
                  true
                ))
            )
          ]
        )
      )
    )
  }

  function setStyleAttributeExpression(attrValue) {
    return t.expressionStatement(
      t.callExpression(
        t.memberExpression(
          t.identifier("e"),
          t.identifier("setAttribute")
        ),
        [
          t.stringLiteral("style"),
          attrValue
        ]));
  }

  function setCallExpression(sourceExpr, node) {

    const nonStatefulAttributes = a => !(a.name.name.startsWith("$"));
    const nonEventAttributes = a => !(a.name.name.endsWith("$"));
    const nonRefAttribute = a => a.name.name !== "ref";
    const filteredAttrs = node.openingElement.attributes
      .filter(nonStatefulAttributes)
      .filter(nonEventAttributes)
      .filter(nonRefAttribute);

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
            attributeAssignmentExpression(
              attr.name.name,
              attr.value)
          ))
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
                attributeAssignmentExpression(
                  attrName(attr),
                  t.identifier("v"))
              ]))
        ]
      ), sourceExpr);
  }

  function eventCallExpression(sourceExpr, node) {

    const eventAttributes = a => a.name.name.endsWith("$");
    const jsxExpressionValueAttributes = a => t.isJSXExpressionContainer(a.value);
    const filteredAttrs = node.openingElement.attributes
      .filter(eventAttributes)
      .filter(jsxExpressionValueAttributes);

    const eventName = a => a.name.name;

    return filteredAttrs.reduce((acc, attr) =>
      t.callExpression(
        t.memberExpression(
          acc,
          t.identifier('event')
        ),
        [
          t.stringLiteral(eventName(attr)),
          attr.value.expression
        ]
      ), sourceExpr);
  }

  function elemExpression(node, refs) {

    const tag = node.openingElement.name.name;

    let expr = t.callExpression(
      t.identifier('elem'),
      [t.stringLiteral(tag)]
    );

    const refAttr = node.openingElement.attributes
      .filter(a => a.name.name === "ref")[0];

    if (refAttr !== undefined) {
      const ref = t.isJSXExpressionContainer(refAttr.value)
        ? refAttr.value.expression
        : refAttr.value;

      refs.push({ ref, expr });
      expr = t.memberExpression(
        t.identifier("ref"),
        ref,
        true);
    }

    expr = setCallExpression(expr, node);
    expr = stateCallExpression(expr, node);
    expr = eventCallExpression(expr, node);
    expr = childCallExpression(expr, node, refs);

    // TODO: class attribute
    // TODO: isJSXSpreadAttribute
    // TODO: support kebab case attributes, like "data-value"

    // TODO: in lib, add child with primitive arguments, like "string", "int", "boolean"

    return expr;
  }

  return {
    name: "ast-transform",
    inherits: SyntaxJSX,
    visitor: {
      JSXElement: path => {
        const refs = [];
        let expr = elemExpression(path.node, refs);

        if (refs.length > 0) {
          expr = t.callExpression(
            t.functionExpression(
              null,
              [],
              t.blockStatement(
                [
                  t.variableDeclaration(
                    "const",
                    [
                      t.variableDeclarator(
                        t.identifier("ref"),
                        t.arrayExpression([])
                      )
                    ]),

                  ...refs
                    .map(r => t.expressionStatement(
                      t.assignmentExpression(
                        "=",
                        t.memberExpression(
                          t.identifier("ref"),
                          r.ref,
                          true
                        ),
                        r.expr)
                    )),
                  t.returnStatement(expr)
                ]
              )),
            []);
        }

        path.replaceWith(expr)
      },
      Program: {
        exit: path => {
        }
      }
    }
  };
};