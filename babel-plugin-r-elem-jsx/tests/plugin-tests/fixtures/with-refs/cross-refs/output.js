(function () {
  const ref = [];
  ref["field1"] = elem("input");
  ref["field2"] = elem("input");
  return elem("div").child(ref["field1"].state(ref.field2.input$, (e, v) => {
    e.attr = v;
  }), ref["field2"].state(ref.field1.input$, (e, v) => {
    e.attr = v;
  }));
})();