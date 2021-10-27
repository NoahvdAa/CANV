!function(e){var r={};function n(s){if(r[s])return r[s].exports;var t=r[s]={i:s,l:!1,exports:{}};return e[s].call(t.exports,t,t.exports,n),t.l=!0,t.exports}n.m=e,n.c=r,n.d=function(e,r,s){n.o(e,r)||Object.defineProperty(e,r,{enumerable:!0,get:s})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,r){if(1&r&&(e=n(e)),8&r)return e;if(4&r&&"object"==typeof e&&e&&e.__esModule)return e;var s=Object.create(null);if(n.r(s),Object.defineProperty(s,"default",{enumerable:!0,value:e}),2&r&&"string"!=typeof e)for(var t in e)n.d(s,t,function(r){return e[r]}.bind(null,t));return s},n.n=function(e){var r=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(r,"a",r),r},n.o=function(e,r){return Object.prototype.hasOwnProperty.call(e,r)},n.p="",n(n.s=1)}([function(e,r){e.exports={Router:({base:e="",routes:r=[]}={})=>({__proto__:new Proxy({},{get:(n,s,t)=>(n,...a)=>r.push([s.toUpperCase(),RegExp(`^${(e+n).replace(/(\/?)\*/g,"($1.*)?").replace(/\/$/,"").replace(/:(\w+)(\?)?(\.)?/g,"$2(?<$1>[^/]+)$2$3").replace(/\.(?=[\w(])/,"\\.")}/*$`),a])&&t}),routes:r,async handle(e,...n){let s,t,a=new URL(e.url);for(var[o,i,c]of(e.query=Object.fromEntries(a.searchParams),r))if((o===e.method||"ALL"===o)&&(t=a.pathname.match(i)))for(var u of(e.params=t.groups,c))if(void 0!==(s=await u(e.proxy||e,...n)))return s}})}},function(e,r,n){"use strict";n.r(r);var s=n(0);const t={"Access-Control-Allow-Origin":"*","Content-type":"application/json"},a=Object(s.Router)();a.get("/canvas",async()=>{const e=await CANVAS.get("canvas");return new Response(e,{headers:t})}),a.get("/canvas/:id",async({params:e})=>{const{id:r}=e;if(isNaN(r)||r<0||r>9999)return new Response(JSON.stringify({success:!1,error:"Invalid ID"}),{headers:t});const n=JSON.parse(await CANVAS.get("canvas"))[r];return new Response(JSON.stringify(n),{headers:t})}),a.post("/canvas/bulk",async e=>{const r=await e.json();if("object"!=typeof r||!r.length)return new Response(JSON.stringify({success:!1,error:"Invalid request"}),{headers:t});const n=JSON.parse(await CANVAS.get("canvas"));for(const e of r){if(2!==e.length)return new Response(JSON.stringify({success:!1,error:"Invalid request"}),{headers:t});const r=e[0],s=e[1];if(isNaN(r)||r<0||r>9999)return new Response(JSON.stringify({success:!1,error:"Invalid ID"}),{headers:t});if(isNaN(s)||s<0||s>15)return new Response(JSON.stringify({success:!1,error:"Invalid color"}),{headers:t});n[r]=[parseInt(s),(new Date).getTime()]}return await CANVAS.put("canvas",JSON.stringify(n)),new Response(JSON.stringify({success:!0}),{headers:t})}),a.post("/canvas/:id",async e=>{const{id:r}=e.params;if(isNaN(r)||r<0||r>9999)return new Response(JSON.stringify({success:!1,error:"Invalid ID"}),{headers:t});const n=await e.json(),{color:s}=n;if(isNaN(s)||s<0||s>15)return new Response(JSON.stringify({success:!1,error:"Invalid color"}),{headers:t});const a=JSON.parse(await CANVAS.get("canvas"));return a[r]=[parseInt(s),(new Date).getTime()],await CANVAS.put("canvas",JSON.stringify(a)),new Response(JSON.stringify({success:!0}),{headers:t})}),a.all("*",()=>new Response("404, not found!",{status:404})),addEventListener("fetch",e=>{e.respondWith(a.handle(e.request))})}]);