/* eslint-disable */
//prettier-ignore
module.exports = {
name: "@yarnpkg/plugin-tspace",
factory: function (require) {
"use strict";var plugin=(()=>{var l=Object.defineProperty;var k=Object.getOwnPropertyDescriptor;var P=Object.getOwnPropertyNames;var S=Object.prototype.hasOwnProperty;var j=(o,t,s)=>t in o?l(o,t,{enumerable:!0,configurable:!0,writable:!0,value:s}):o[t]=s;var p=(o=>typeof require<"u"?require:typeof Proxy<"u"?new Proxy(o,{get:(t,s)=>(typeof require<"u"?require:t)[s]}):o)(function(o){if(typeof require<"u")return require.apply(this,arguments);throw new Error('Dynamic require of "'+o+'" is not supported')});var E=(o,t)=>{for(var s in t)l(o,s,{get:t[s],enumerable:!0})},$=(o,t,s,e)=>{if(t&&typeof t=="object"||typeof t=="function")for(let r of P(t))!S.call(o,r)&&r!==s&&l(o,r,{get:()=>t[r],enumerable:!(e=k(t,r))||e.enumerable});return o};var C=o=>$(l({},"__esModule",{value:!0}),o);var w=(o,t,s)=>(j(o,typeof t!="symbol"?t+"":t,s),s);var J={};E(J,{TspaceCommand:()=>a,default:()=>y});var h=p("@yarnpkg/cli"),i=p("@yarnpkg/core"),m=p("fs/promises"),x=p("fs"),N=p("path");var g={compilerOptions:{paths:{}}};var a=class extends h.BaseCommand{async execute(){let t=await i.Configuration.find(this.context.cwd,this.context.plugins),{project:s}=await i.Project.find(t,this.context.cwd),e=(0,N.join)(this.context.cwd,"tsconfig.workspaces.json");return(await i.StreamReport.start({stdout:this.context.stdout,configuration:t},async d=>{await d.startTimerPromise("Update tsconfig workspaces",async()=>{try{(0,x.existsSync)(e)||await(0,m.writeFile)(e,JSON.stringify(g,null,2));let n=await(0,m.readFile)(e,"utf8").then(JSON.parse);n.compilerOptions.paths={};let O=n.compilerOptions.paths;s.workspaces.filter(f=>f.cwd!==this.context.cwd).forEach(({relativeCwd:f,manifest:{name:c}})=>{if(c){let u=c.scope?`@${c.scope}/${c.name}`:c.name;d.reportInfo(i.MessageName.UNNAMED,`Link ${u} -> ${f}`),O[u]=[f]}}),await(0,m.writeFile)(e,JSON.stringify(n,null,2))}catch(n){d.reportError(i.MessageName.UNNAMED,n.message)}})})).exitCode()}};w(a,"paths",[["tspace"]]);var y={commands:[a]};return C(J);})();
return plugin;
}
};
