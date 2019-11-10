elem("div").set(function (e) {
  e.innerText = "3";
});
elem("div").set(function (e) {
  e.innerText = "a" + "b";
});
elem("div").set(function (e) {
  e.innerText = 5;
});
elem("div").set(function (e) {
  e.disabled = true;
});
elem("a").set(function (e) {
  e.innerText = 5;
  e.href = "_blank";
});