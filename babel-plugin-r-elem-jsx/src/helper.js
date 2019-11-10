function rightTrim(s) {
  return s.replace(/\s+$/, "");
}

function reduceWhiteSpaces(s) {
  if (s.indexOf('\n') === -1)
    return s;

  const parts = s.split('\n');
  const reducedParts = parts
    .map((p, i) => i === 0 ? rightTrim(p) : p.trim())
    .filter(p => p.trim() !== "");
  return reducedParts.join(' ');
}

module.exports.reduceWhiteSpaces = reduceWhiteSpaces;