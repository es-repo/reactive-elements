elem("div").state("3", function (e, v) {
  e.innerText = v;
});
elem("div").state(1 + 3, function (e, v) {
  e.innerText = v;
});
elem("div").state(interval(1000), function (e, v) {
  e.innerText = v;
});
elem("a").state(interval(100), function (e, v) {
  e.innerText = v;
}).state($, function (e, v) {
  e.href = v;
});