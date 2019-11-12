(function () {
  const ref = [];
  ref["field"] = elem("input");
  return elem("div").child(ref["field"].state(ref.field.input$, (e, v) => {
    e.attr = v;
  }));
})();