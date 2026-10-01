'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const file = path.join(__dirname, '../js/components/explainer-information.js');
assert.ok(fs.existsSync(file), 'Information theory numerical explorer must exist');
const M = require(file);
const close = (a,b) => assert.ok(Math.abs(a-b)<1e-10, `${a} differs from ${b}`);
close(M.entropy([0,1]),0);
close(M.entropy([.5,.5]),1);
close(M.entropy([.5,.25,.125,.125]),1.75);
close(M.kl([.5,.5],[.25,.75]), .20751874963942185);
assert.equal(M.kl([1,0],[0,1]), Infinity);
close(M.crossEntropy([.5,.5],[.25,.75]),1.207518749639422);
for (let i=0;i<=100;i++) {
  const p=i/100, q=(i+1)/102;
  close(M.crossEntropy([p,1-p],[q,1-q]),M.entropy([p,1-p])+M.kl([p,1-p],[q,1-q]));
  const joint=M.channel(p,.2);
  close(joint.flat().reduce((a,b)=>a+b),1);
  assert.ok(M.mutualInformation(joint)<=M.entropy([p,1-p])+1e-10);
}
close(M.mutualInformation(M.channel(.5,0)),1);
close(M.mutualInformation(M.channel(.5,.5)),0);
close(M.posterior(.5,3,1),27/43);
assert.deepEqual(M.huffman([.5,.25,.125,.125]).map(x=>x.length),[1,2,3,3]);
close(M.rateDistortion(0),1);
close(M.rateDistortion(.5),0);
assert.throws(()=>M.entropy([-.1,1.1]));
console.log('Information theory identities, boundary cases, channel, posterior, coding and distortion passed.');
