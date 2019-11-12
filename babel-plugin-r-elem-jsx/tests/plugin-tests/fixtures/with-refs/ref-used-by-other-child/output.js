(function () {
  const ref = [];
  ref["field"] = elem("input");
  return elem("div").child(ref["field"], elem("span").state(ref.field.input$, (e, v) => {
    e.innerText = v;
  }));
})();