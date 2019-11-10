const reduceWhiteSpaces = require("../../src/helper.js").reduceWhiteSpaces;

const inputAndExpected = [
  ["", ""],
  [" ", " "],
  ["  ", "  "],
  ["\n", ""],
  ["  \n", ""],
  ["Hello", "Hello"],
  ["  \nHello ", "Hello"],
  ["Hello World", "Hello World"],
  ["Hello  World", "Hello  World"],
  ["Hello\nWorld", "Hello World"],
  ["Hello\n\nWorld", "Hello World"],
  ["Hello \n  \n World", "Hello World"],
  [" Hello\nWorld", " Hello World"],
  [" Hello \nWorld", " Hello World"],
  ["  Hello  \nWorld ", "  Hello World"],
  ["  Hello  \n World ", "  Hello World"],
];

test('', () => {
  for (const i of inputAndExpected)
    expect(reduceWhiteSpaces(i[0])).toBe(i[1]);
});