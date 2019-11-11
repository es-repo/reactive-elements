elem("div").state("3", (e, v) => {
  e.innerText = v;
});
elem("div").state(1 + 3, (e, v) => {
  e.innerText = v;
});
elem("div").state(interval(1000), (e, v) => {
  e.innerText = v;
});
elem("a").state(interval(100), (e, v) => {
  e.innerText = v;
}).state($, (e, v) => {
  e.href = v;
});