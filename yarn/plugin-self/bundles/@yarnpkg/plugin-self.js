/* eslint-disable */
//prettier-ignore
module.exports = {
name: "@yarnpkg/plugin-self",
factory: function (require) {
"use strict";var plugin=(()=>{var e=Object.defineProperty;var c=Object.getOwnPropertyDescriptor;var f=Object.getOwnPropertyNames;var g=Object.prototype.hasOwnProperty;var x=(t,r,o)=>r in t?e(t,r,{enumerable:!0,configurable:!0,writable:!0,value:o}):t[r]=o;var a=(t=>typeof require<"u"?require:typeof Proxy<"u"?new Proxy(t,{get:(r,o)=>(typeof require<"u"?require:r)[o]}):t)(function(t){if(typeof require<"u")return require.apply(this,arguments);throw new Error('Dynamic require of "'+t+'" is not supported')});var d=(t,r)=>{for(var o in r)e(t,o,{get:r[o],enumerable:!0})},h=(t,r,o,n)=>{if(r&&typeof r=="object"||typeof r=="function")for(let i of f(r))!g.call(t,i)&&i!==o&&e(t,i,{get:()=>r[i],enumerable:!(n=c(r,i))||n.enumerable});return t};var v=t=>h(e({},"__esModule",{value:!0}),t);var m=(t,r,o)=>(x(t,typeof r!="symbol"?r+"":r,o),o);var y={};d(y,{SelfUpdateCommand:()=>s,default:()=>u});var p=a("@yarnpkg/cli"),l=a("clipanion");var s=class extends p.BaseCommand{version=l.Option.String({required:!1});async execute(){await this.cli.run(["set","version",`https://github.com/LIMPIX31/tools/raw/${this.version??"master"}/yarn/cli/bundles/yarn.js`])}};m(s,"paths",[["self","update"]]);var u={commands:[s]};return v(y);})();
return plugin;
}
};
