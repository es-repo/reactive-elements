(function () {
  const ref = [];
  ref["field"] = elem("input");
  return elem("div").state(ref.field.input$, (e, v) => {
    e.attr = v;
  }).child(ref["field"]);
})();