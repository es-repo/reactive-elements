!function(t,e){"object"==typeof exports&&"object"==typeof module?module.exports=e(require("rxjs"),require("rxjs/operators")):"function"==typeof define&&define.amd?define(["rxjs","rxjs/operators"],e):"object"==typeof exports?exports["r-elem"]=e(require("rxjs"),require("rxjs/operators")):t["r-elem"]=e(t.rxjs,t.rxjs.operators)}(window,(function(t,e){return function(t){var e={};function r(n){if(e[n])return e[n].exports;var o=e[n]={i:n,l:!1,exports:{}};return t[n].call(o.exports,o,o.exports,r),o.l=!0,o.exports}return r.m=t,r.c=e,r.d=function(t,e,n){r.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:n})},r.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},r.t=function(t,e){if(1&e&&(t=r(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var n=Object.create(null);if(r.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var o in t)r.d(n,o,function(e){return t[e]}.bind(null,o));return n},r.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return r.d(e,"a",e),e},r.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},r.p="",r(r.s=2)}([function(e,r){e.exports=t},function(t,r){t.exports=e},function(t,e,r){"use strict";r.r(e),r.d(e,"default",(function(){return u}));var n=r(0),o=r(1);function i(t){return function(t){if(Array.isArray(t)){for(var e=0,r=new Array(t.length);e<t.length;e++)r[e]=t[e];return r}}(t)||function(t){if(Symbol.iterator in Object(t)||"[object Arguments]"===Object.prototype.toString.call(t))return Array.from(t)}(t)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance")}()}function u(t){var e=t instanceof HTMLElement?t:document.createElement(t),r={},u=[],a=[];return new Proxy({el:e,set:function(t){return t(e),this},state:function(t,e){return Object(n.isObservable)(t)?(e=e||function(){},u.push({state$:t,bind:e})):this.set((function(r){return e(r,t)})),this},event:function(t){for(var e=this,r=arguments.length,o=new Array(r>1?r-1:0),u=1;u<r;u++)o[u-1]=arguments[u];var c=o.map((function(t){return"function"==typeof t?t(e):t}));return this[t+"$"]=n.merge.apply(void 0,i(c)),this},slot:function(t,n){var o=this;return r[t]=n.el,e.appendChild(n.el),this[t+"Child"]=function(){for(var e=arguments.length,r=new Array(e),n=0;n<e;n++)r[n]=arguments[n];return o.slotChild.apply(o,[t].concat(r))},this},child:function(){for(var t=arguments.length,e=new Array(t),r=0;r<t;r++)e[r]=arguments[r];return this.slotChild.apply(this,[void 0].concat(e))},slotChild:function(t){for(var n=r[t]||e,o=arguments.length,i=new Array(o>1?o-1:0),u=1;u<o;u++)i[u-1]=arguments[u];return i.flat().filter((function(t){return null!=t&&""!==t})).forEach((function(t){c(t)?t.parent(n):n.appendChild(document.createTextNode(t.toString()))})),this},childMap:function(t,e,r){return this.slotChildMap(void 0,t,e,r)},slotChildMap:function(t,n,o,i){var u=r[t]||e,c=[];return n.subscribe((function(t){for(var e=0;e<t.length;e++)void 0===c[e]&&(c[e]=i(),o(c[e].asObservable(),e).state(c[e]).parent(u)),c[e].next(t[e]);for(var r=t.length;r<c.length;r++)c[r].complete();c.length=t.length})),this},parent:function(t){if(0===u.length)return t.appendChild(e),this;var r=u.map((function(t){return t.state$}));return Object(n.race)(r).pipe(Object(o.take)(1)).subscribe((function(){return t.appendChild(e)})),Object(n.forkJoin)(r).subscribe(null,null,(function(){t.removeChild(e),a.forEach((function(t){return t.unsubscribe()}))})),u.forEach((function(t){return t.state$.subscribe((function(r){return t.bind(e,r)}))})),this}},{get:function(t,e){if(e.endsWith("$")&&void 0===t[e]){var r=e.substring(0,e.length-1),i=Object(n.fromEvent)(t.el,r);i.preventDefault=function(){return i.pipe(Object(o.tap)((function(t){return t.preventDefault()})))};var u=i.subscribe;i.subscribe=function(){var t=u.apply(i,arguments);return a.push(t),t},t[e]=i}return t[e]}})}function c(t){return void 0!==t.parent&&void 0!==t.state}}])}));