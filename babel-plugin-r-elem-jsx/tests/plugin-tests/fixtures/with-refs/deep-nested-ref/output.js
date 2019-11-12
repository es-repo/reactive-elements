(function () {
  const ref = [];
  ref["field"] = elem("input");
  return elem("div").child(elem("div").child(elem("span").child(ref["field"], elem("p").child("Hello"))), elem("span").state(ref.field.input$, (e, v) => {
    e.innerText = v;
  }));
})();