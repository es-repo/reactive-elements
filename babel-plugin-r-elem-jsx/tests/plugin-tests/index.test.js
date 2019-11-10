const path = require('path');
const pluginTester = require('babel-plugin-tester');
const pluginRelemJsx = require('../../src/index.js');

pluginTester({
  plugin: pluginRelemJsx,
  fixtures: path.join(__dirname, 'fixtures')
})