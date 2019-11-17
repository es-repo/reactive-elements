const babel = require('@babel/core');
const preset = require('.');
const assert = require('assert');

const { code } = babel.transformSync('const v = <div a b={2} />;', {
	presets: [
		preset
	],
	babelrc: false,
	compact: true
});

assert.equal(code, 'const v=elem("div").set(e=>{e.a=true;e.b=2;});');
console.log('passed');