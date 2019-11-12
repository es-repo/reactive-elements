(function () {
  const ref = [];
  ref[1 + 4] = elem("input");
  ref["a" + "b"] = elem("input");
  return elem("div").child(ref[1 + 4].state(ref[5].input$, (e, v) => {
    e.attr = v;
  }), ref["a" + "b"].state(ref["ab"].input$, (e, v) => {
    e.attr = v;
  }));
})();