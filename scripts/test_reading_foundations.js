'use strict';
const assert = require('node:assert/strict');
const f = require('../js/components/interview-foundations.js');
const close = (a,b,tol=1e-8) => assert.ok(Math.abs(a-b)<tol, `${a} differs from ${b}`);
for (const theta of [-2,0,0.7,2]) {
  const m=f.normalise(theta);
  close(m.probabilities.reduce((a,b)=>a+b),1);
  const h=1e-5;
  close((Math.log(f.normalise(theta+h).z)-Math.log(f.normalise(theta-h).z))/(2*h),m.mean,1e-7);
  const target=0.8;
  close((f.nll(theta+h,target)-f.nll(theta-h,target))/(2*h),m.mean-target,1e-7);
}
close(f.normalise(0).z,2);
close(f.normalise(0).probabilities[1],0.5);
const g=f.gradients(2,3);
close(g.input,12);close(g.parameter,18);
// A one-step normal update has mean (1-h)x and conditional variance 2h.
close(f.langevin(3,0.1,0),2.7);
close(f.langevin(3,0.1,1)-f.langevin(3,0.1,0),Math.sqrt(0.2));
close(f.stationaryVariance(0.5),4/3);
for (const batch of [1,2,8]) {
  const shape=f.tensor(batch,'sum');
  assert.deepEqual(shape.input,[batch,1,28,28]);
  assert.deepEqual(shape.conv,[batch,4,14,14]);
  assert.deepEqual(shape.flat,[batch,784]);
  close(shape.reduction,2*batch);
  close(f.tensor(batch,'mean').reduction,2);
}
console.log('Reading foundation calculations passed, including independent finite-difference checks.');
