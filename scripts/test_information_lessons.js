'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const file=require('node:path').join(__dirname,'../js/components/information-lessons.js');
assert.ok(fs.existsSync(file),'Each information theory lesson needs its own numerical experiment');
const M=require(file);
const close=(a,b)=>assert.ok(Math.abs(a-b)<1e-10,`${a} differs from ${b}`);
close(M.nll(3,1,.75),-3*Math.log2(.75)-Math.log2(.25));
close(M.nll(0,4,0),0);
assert.equal(M.nll(1,0,0),Infinity);
close(M.elbo(.8).gap,0);
close(M.elbo(.8).bound,-1);
for(let i=1;i<100;i++){
 const q=i/100,v=M.elbo(q);
 close(v.bound+v.gap,v.evidence);
 assert.ok(v.gap>=-1e-12);
 const e=i/200,c=M.cascade(.1,e);
 assert.ok(c.after<=c.before+1e-12);
 const u=M.uncertainty(q,1-q,.5);
 close(u.predictive,u.aleatoric+u.epistemic);
 assert.ok(u.epistemic>=-1e-12);
}
close(M.bottleneck(0,0,2).objective,-1);
close(M.bottleneck(0,1,2).objective,0);
close(M.uncertainty(.5,.5,.5).epistemic,0);
close(M.uncertainty(0,1,.5).epistemic,1);
close(M.js([1,0],[0,1]),1);
close(M.js([.5,.5],[.5,.5]),0);
close(M.expectedGain(.5),.0487949406953985);
close(M.fisher(.5,.01).quadratic,.0002);
close(M.bound(128,32),Math.sqrt(Math.log(2)/8));
assert.equal(M.experiments.length,16);
M.experiments.forEach((e,i)=>{
 const s=Object.assign({},e.initial);
 const result=e.calculate(s);
 assert.ok(result.rows.length>=2,`Module ${i} has readouts`);
 assert.ok(result.worked.length>=2,`Module ${i} has worked steps`);
 for(const c of e.controls){for(const value of [c[2],c[3]]){
  s[c[0]]=value;
  const r=e.calculate(s);
  assert.ok(!r.rows.some(row=>Number.isNaN(row[1])),`Module ${i} boundary ${c[0]}`);
 }}
});
console.log('All 16 lesson models, posterior gain, ELBO, bottleneck, uncertainty, JS, bounds and geometry passed.');
