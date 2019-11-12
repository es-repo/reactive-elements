elem("div").state($, (e, v) => {
  if (typeof v === "string") e.setAttribute("style", v);else Object.keys(v).forEach(i => e.style[i] = v[i]);
});