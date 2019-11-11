elem("div").set(e => {
  e.innerText = "3";
});
elem("div").set(e => {
  e.innerText = "a" + "b";
});
elem("div").set(e => {
  e.innerText = 5;
});
elem("div").set(e => {
  e.disabled = true;
});
elem("a").set(e => {
  e.innerText = 5;
  e.href = "_blank";
});