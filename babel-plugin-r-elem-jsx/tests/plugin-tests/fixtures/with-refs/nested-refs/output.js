(function () {
  const ref = [];
  ref["link"] = elem("a");
  ref["field"] = elem("input");
  return elem("div").child(elem("div").child(elem("span").child(ref["link"].child(elem("span").child("Hello"), ref["field"], elem("p").state(ref.field.input$, (e, v) => {
    e.innerText = v;
  })))), elem("span").state(ref.field.input$, (e, v) => {
    e.innerText = v;
  }), elem("span").state(ref.link.click$, (e, v) => {
    e.innerText = v;
  }));
})();