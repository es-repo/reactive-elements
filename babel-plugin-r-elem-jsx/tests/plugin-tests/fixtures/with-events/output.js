(function () {
  const ref = [];
  ref["btn1"] = elem("button");
  ref["btn2"] = elem("button");
  return elem("div").event("button1Click$", ref.btn1.click$).event("button2Click$", ref.btn2.click$).child(ref["btn1"], ref["btn2"], elem("span"));
})();