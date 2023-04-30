/* eslint-disable */
//prettier-ignore
module.exports = {
name: "@yarnpkg/plugin-tspace",
factory: function (require) {
"use strict";var plugin=(()=>{var m=Object.defineProperty;var y=Object.getOwnPropertyDescriptor;var P=Object.getOwnPropertyNames;var j=Object.prototype.hasOwnProperty;var k=(o,t,s)=>t in o?m(o,t,{enumerable:!0,configurable:!0,writable:!0,value:s}):o[t]=s;var f=(o=>typeof require<"u"?require:typeof Proxy<"u"?new Proxy(o,{get:(t,s)=>(typeof require<"u"?require:t)[s]}):o)(function(o){if(typeof require<"u")return require.apply(this,arguments);throw new Error('Dynamic require of "'+o+'" is not supported')});var E=(o,t)=>{for(var s in t)m(o,s,{get:t[s],enumerable:!0})},O=(o,t,s,a)=>{if(t&&typeof t=="object"||typeof t=="function")for(let i of P(t))!j.call(o,i)&&i!==s&&m(o,i,{get:()=>t[i],enumerable:!(a=y(t,i))||a.enumerable});return o};var $=o=>O(m({},"__esModule",{value:!0}),o);var h=(o,t,s)=>(k(o,typeof t!="symbol"?t+"":t,s),s);var M={};E(M,{TspaceCommand:()=>r,default:()=>g});var w=f("@yarnpkg/cli"),e=f("@yarnpkg/core"),d=f("fs/promises"),x=f("path");var r=class extends w.BaseCommand{async execute(){let t=await e.Configuration.find(this.context.cwd,this.context.plugins),{project:s}=await e.Project.find(t,this.context.cwd),a=(0,x.join)(this.context.cwd,"tsconfig.json");return(await e.StreamReport.start({stdout:this.context.stdout,configuration:t},async l=>{await l.startTimerPromise("Update tsconfig workspaces",async()=>{try{let n=await(0,d.readFile)(a,"utf8").then(JSON.parse);n.compilerOptions.paths={};let N=n.compilerOptions.paths;s.workspaces.filter(p=>p.cwd!==this.context.cwd).forEach(({relativeCwd:p,manifest:{name:c}})=>{if(c){let u=c.scope?`@${c.scope}/${c.name}`:c.name;l.reportInfo(e.MessageName.UNNAMED,`Link ${u} -> ${p}`),N[u]=[p]}}),await(0,d.writeFile)(a,JSON.stringify(n,null,2)+`
`)}catch(n){l.reportError(e.MessageName.UNNAMED,n.message)}})})).exitCode()}};h(r,"paths",[["tspace"]]);var g={commands:[r]};return $(M);})();
return plugin;
}
};
