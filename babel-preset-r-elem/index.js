module.exports = function(context, options = {}) {
  return {
    plugins: [
      [
        require("babel-plugin-r-elem-jsx"), {}
      ]
    ]
  };
};