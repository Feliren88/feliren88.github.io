/* Lesson experiments use finite, explicitly chosen models. Information uses bits unless labelled otherwise. */
(function () {
  'use strict';
  var B=typeof module!=='undefined' && module.exports ? require('./explainer-information.js') : window.InformationMath;
  var binary=function(p){return [p,1-p];}, H=function(p){return B.entropy(binary(p));};
  function nll(heads,tails,p) { return (heads ? -heads*Math.log2(p) : 0)+(tails ? -tails*Math.log2(1-p) : 0); }
  function elbo(q) {
    var reconstruction=q*Math.log2(.8)+(1-q)*Math.log2(.2);
    var penalty=B.kl(binary(q),[.5,.5]);
    return {reconstruction:reconstruction,penalty:penalty,bound:reconstruction-penalty,gap:B.kl(binary(q),[.8,.2]),evidence:-1};
  }
  function cascade(a,b) { var e=a+b-2*a*b;return {flip:e,before:1-H(a),after:1-H(e)}; }
  function bottleneck(e,r,rho) {
    var target=1-H(e), input=target+r;
    return {input:input,target:target,objective:input-rho*target};
  }
  function uncertainty(p1,p2,w) {
    var mean=w*p1+(1-w)*p2, aleatoric=w*H(p1)+(1-w)*H(p2), predictive=H(mean);
    return {mean:mean,predictive:predictive,aleatoric:aleatoric,epistemic:predictive-aleatoric};
  }
  function js(p,q) { var m=p.map(function(v,i){return (v+q[i])/2;});return (B.kl(p,m)+B.kl(q,m))/2; }
  function expectedGain(prior) {
    var chance=(1-prior)*.5+prior*.75;
    var heads=B.posterior(prior,1,0), tails=B.posterior(prior,0,1);
    return chance*B.kl(binary(heads),binary(prior))+(1-chance)*B.kl(binary(tails),binary(prior));
  }
  function fisher(p,delta) { var F=1/(p*(1-p));return {information:F,quadratic:.5*delta*delta*F,exact:B.kl(binary(p),binary(p+delta))*Math.LN2}; }
  function bound(n,bits) { return Math.sqrt(.5*bits*Math.LN2/n); }
  function f(v) {return Number.isFinite(v)?v.toFixed(4):'∞';}
  function result(rows,plot,formula,worked) {return {rows:rows,plot:plot,formula:formula,worked:worked};}
  function barPlot(values,labels,max){return {kind:'bars',values:values,labels:labels,max:max||1};}
  function curvePlot(fn,x,min,max,ymax,label){return {kind:'curve',fn:fn,x:x,min:min,max:max,ymax:ymax,label:label};}
  var experiments=[
    {title:'Reweight the possible outcomes',initial:{p:.9},controls:[['p','Rain probability',0,1,.01]],
      assumption:'Assume 2 outcomes, rain and dry. Their probabilities must sum to 1.',
      operation:'Change the rain probability. Then compare the 2 outcome weights and their entropy.',
      calculate:function(s){return result([['Rain probability',s.p],['Dry probability',1-s.p],['Entropy in bits',H(s.p)]],barPlot(binary(s.p),['Rain','Dry']),
        'P(rain) + P(dry) = '+f(s.p)+' + '+f(1-s.p)+' = 1.',
        ['Assign rain weight '+f(s.p)+'. Then assign the remaining weight '+f(1-s.p)+' to dry.', 'The 2 probabilities sum to 1. Their entropy equals '+f(H(s.p))+' bits.']);}},
    {title:'Watch surprise grow as an event becomes rarer',initial:{p:.25},controls:[['p','Event probability',.01,1,.01]],
      assumption:'Assume the event has a positive probability. Logarithms use base 2.',
      operation:'Reduce the event probability. Then watch its surprise increase along the logarithmic curve.',
      calculate:function(s){return result([['Event probability',s.p],['Surprise in bits',-Math.log2(s.p)]],curvePlot(function(p){return -Math.log2(p);},s.p,.01,1,7,'Event probability'),
        'Surprise = −log₂('+f(s.p)+') = '+f(-Math.log2(s.p))+' bits.',
        ['Read the assigned event probability '+f(s.p)+'.','Then take its base-2 logarithm and change its sign. The result equals '+f(-Math.log2(s.p))+' bits.']);}},
    {title:'Build entropy from its weighted contributions',initial:{p:.5},controls:[['p','First outcome probability',0,1,.01]],
      assumption:'Assume a binary variable. A zero-probability outcome contributes zero expected surprise.',
      operation:'Multiply each outcome surprise by its probability. Then add the 2 contributions.',
      calculate:function(s){var a=s.p?-s.p*Math.log2(s.p):0,b=s.p===1?0:-(1-s.p)*Math.log2(1-s.p);return result([['First contribution in bits',a],['Second contribution in bits',b],['Entropy in bits',a+b]],barPlot([a,b,a+b],['First','Second','Sum']),
        'H = '+f(a)+' + '+f(b)+' = '+f(a+b)+' bits.',
        ['The first weighted contribution equals '+f(a)+' bits. The second equals '+f(b)+' bits.','Therefore, expected surprise equals their sum, '+f(a+b)+' bits.']);}},
    {title:'Condition a joint probability table',initial:{p:.5,a:.9,b:.2},controls:[['p','P(input = 1)',0,1,.01],['a','P(label = 1 | input = 1)',0,1,.01],['b','P(label = 1 | input = 0)',0,1,.01]],
      assumption:'Choose an input probability and a label probability within each input group.',
      operation:'Reweight the groups. Then compare overall label uncertainty with uncertainty remaining inside each group.',
      calculate:function(s){var joint=[[(1-s.p)*(1-s.b),(1-s.p)*s.b],[s.p*(1-s.a),s.p*s.a]],label=s.p*s.a+(1-s.p)*s.b,conditional=s.p*H(s.a)+(1-s.p)*H(s.b);return result([['Label entropy in bits',H(label)],['Conditional entropy in bits',conditional],['Joint entropy in bits',B.entropy(joint.flat())]],{kind:'joint',joint:joint},
        'H(input, label) = '+f(H(s.p))+' + '+f(conditional)+' = '+f(B.entropy(joint.flat()))+' bits.',
        ['Multiply each conditional label probability by the corresponding input probability to fill the joint table.','Then average group entropies. The conditional entropy equals '+f(s.p)+' × '+f(H(s.a))+' + '+f(1-s.p)+' × '+f(H(s.b))+'.']);}},
    {title:'Compare KL divergence in both directions',initial:{p:.8,q:.3},controls:[['p','P(first outcome)',.01,.99,.01],['q','Q(first outcome)',.01,.99,.01]],
      assumption:'Assume both binary distributions assign positive probability to each outcome.',
      operation:'Move either probability. Then compare divergences weighted by P and by Q.',
      calculate:function(s){var forward=B.kl(binary(s.p),binary(s.q)),reverse=B.kl(binary(s.q),binary(s.p));return result([['KL(P ∥ Q) in bits',forward],['KL(Q ∥ P) in bits',reverse]],barPlot([forward,reverse],['P to Q','Q to P'],7),
        'KL(P ∥ Q) = '+f(forward)+' bits. KL(Q ∥ P) = '+f(reverse)+' bits.',
        ['The forward divergence weights log probability ratios by P. Its value equals '+f(forward)+' bits.','The reverse divergence weights the reversed ratios by Q. Its value equals '+f(reverse)+' bits.']);}},
    {title:'Fit a coin model to observed tosses',animate:'q',initial:{heads:7,tails:3,q:.3},controls:[['heads','Observed heads',1,20,1],['tails','Observed tails',1,20,1],['q','Model heads probability',.01,.99,.01]],
      assumption:'Assume independent tosses with a shared unknown heads probability. Both observed counts are positive.',
      operation:'Move the model probability along the loss curve. Its minimum follows the observed heads fraction.',
      calculate:function(s){var total=s.heads+s.tails,mle=s.heads/total,loss=nll(s.heads,s.tails,s.q)/total;return result([['Fitted heads probability',mle],['Mean log-loss in bits',loss],['Minimum mean loss in bits',H(mle)]],curvePlot(function(q){return nll(s.heads,s.tails,q)/total;},s.q,.01,.99,7,'Model heads probability'),
        'MLE = '+s.heads+' / ('+s.heads+' + '+s.tails+') = '+f(mle)+'. Current average loss = '+f(loss)+' bits.',
        ['The sequence negative log-likelihood equals −'+s.heads+' log₂(q) − '+s.tails+' log₂(1−q).','Divide its current value '+f(nll(s.heads,s.tails,s.q))+' by '+total+' tosses to obtain '+f(loss)+' bits.','Differentiating this loss gives its minimum at the observed heads fraction '+f(mle)+'.']);}},
    {title:'Send a bit through 2 noisy stages',initial:{a:.1,b:.2},controls:[['a','First-stage flip probability',0,.5,.01],['b','Second-stage flip probability',0,.5,.01]],
      assumption:'Assume a fair input bit and independent flips in each stage. The chain is input to middle to output.',
      operation:'Increase second-stage noise. Then watch information about the original input decrease.',
      calculate:function(s){var v=cascade(s.a,s.b);return result([['First-stage information in bits',v.before],['Final information in bits',v.after],['Combined flip probability',v.flip]],{kind:'pipeline',values:[1,v.before,v.after],labels:['Input','Middle','Output']},
        'Combined flip probability = a + b − 2ab = '+f(v.flip)+'. I(input; output) = '+f(v.after)+' bits.',
        ['A final bit flips when exactly 1 stage flips it. Add a(1−b) and (1−a)b.','The resulting error probability equals '+f(v.flip)+'. Therefore, output information equals 1 − H₂(error).','The final information '+f(v.after)+' cannot exceed the first-stage information '+f(v.before)+' bits.']);}},
    {title:'Change the source and rebuild its prefix code',initial:{mix:0},controls:[['mix','Blend towards equally likely symbols',0,1,.01]],
      assumption:'Blend the chosen probabilities [1/2, 1/4, 1/8, 1/8] towards [1/4, 1/4, 1/4, 1/4].',
      operation:'Rebuild the Huffman tree as probabilities change. Then compare its mean length with entropy.',
      calculate:function(s){var p=[.5,.25,.125,.125].map(function(v){return v*(1-s.mix)+.25*s.mix;}),words=B.huffman(p),mean=p.reduce(function(v,x,i){return v+x*words[i].length;},0);return result([['Source entropy in bits',B.entropy(p)],['Mean code length in bits',mean]],{kind:'codes',probabilities:p,words:words},
        'Mean length = '+p.map(function(v,i){return f(v)+' × '+words[i].length;}).join(' + ')+' = '+f(mean)+' bits.',
        ['Merge the 2 smallest probability weights, then repeat until 1 root remains.','Read the displayed paths as codewords. Their probability-weighted mean length equals '+f(mean)+' bits.','The source entropy equals '+f(B.entropy(p))+' bits. Each codeword is an integer-length binary description.']);}},
    {title:'Update coin weights and measure the next observation',initial:{prior:.5,heads:3,tails:1},controls:[['prior','Prior weight for coin 3/4',.01,.99,.01],['heads','Observed heads',0,12,1],['tails','Observed tails',0,12,1]],animate:'heads',
      assumption:'The 2 candidate coins have heads probabilities 1/2 and 3/4. Tosses are independent given the candidate.',
      operation:'Add observed heads or tails. Then compare realised information gain with expected gain from 1 further toss.',
      calculate:function(s){var post=B.posterior(s.prior,s.heads,s.tails),gain=B.kl(binary(post),binary(s.prior)),next=expectedGain(post);return result([['Posterior weight for 3/4',post],['Realised gain in bits',gain],['Next-toss expected gain in bits',next]],barPlot([s.prior,post],['Prior 3/4','Posterior 3/4']),
        'Posterior(3/4) = '+f(post)+'. Expected information gain from 1 further toss = '+f(next)+' bits.',
        ['Multiply the 2 prior weights by their sequence likelihoods. Then divide by the total weight.','The posterior weight for coin 3/4 equals '+f(post)+'. Posterior-to-prior KL equals '+f(gain)+' bits.','For the next toss, average its possible posterior KL values using posterior-predictive heads and tails probabilities.']);}},
    {title:'Close the variational posterior gap',initial:{q:.5},controls:[['q','Approximate posterior weight q(z = 1)',.01,.99,.01]],
      assumption:'Assume prior weights [1/2, 1/2] and observed-event likelihoods [0.8, 0.2] for latent states [1, 0].',
      operation:'Move q towards the exact posterior weight 0.8. Then watch the ELBO approach log evidence.',
      calculate:function(s){var v=elbo(s.q);return result([['Reconstruction term in bits',v.reconstruction],['Prior KL in bits',v.penalty],['ELBO in bits',v.bound],['Posterior gap in bits',v.gap]],{kind:'signed',values:[v.reconstruction,-v.penalty,v.bound,v.evidence],labels:['Reconstruction','Minus prior KL','ELBO','Log evidence'],min:-5,max:1},
        'Log evidence = ELBO + posterior KL = '+f(v.bound)+' + '+f(v.gap)+' = −1 bit.',
        ['Evidence equals 0.5 × 0.8 + 0.5 × 0.2 = 0.5. Its base-2 logarithm equals −1.','The exact posterior weight for latent state 1 equals 0.5 × 0.8 / 0.5 = 0.8.','The reconstruction average equals '+f(v.reconstruction)+'. Subtract prior KL '+f(v.penalty)+' to obtain ELBO '+f(v.bound)+'.','Posterior KL equals '+f(v.gap)+'. Adding it to the ELBO recovers log evidence.']);}},
    {title:'Discard nuisance information without changing the target',initial:{e:.1,r:.8,rho:2},controls:[['e','Target-bit flip probability',0,.5,.01],['r','Probability of retaining the nuisance bit',0,1,.01],['rho','Target-information reward',0,4,.1]],animate:'r',
      assumption:'The input contains independent fair target and nuisance bits. The encoder flips target bits and randomly erases nuisance.',
      operation:'Reduce nuisance retention while holding target noise fixed. Then watch input information decrease without losing target information.',
      calculate:function(s){var v=bottleneck(s.e,s.r,s.rho);return result([['Input information in bits',v.input],['Target information in bits',v.target],['Bottleneck objective',v.objective]],barPlot([v.target,s.r,v.input],['Target','Nuisance','Total retained'],2),
        'I(input; code) − ρ I(code; target) = '+f(v.input)+' − '+f(s.rho)+' × '+f(v.target)+' = '+f(v.objective)+'.',
        ['The noisy target contributes 1 − H₂('+f(s.e)+') = '+f(v.target)+' bits.','The independent nuisance bit contributes '+f(s.r)+' bits through its erasure channel.','Therefore, total input information equals '+f(v.input)+' bits. Subtract the weighted target reward to obtain '+f(v.objective)+'.']);}},
    {title:'Separate model disagreement from observation noise',initial:{p1:.1,p2:.9,w:.5,frequency:.8},controls:[['p1','Model 1 positive-label probability',0,1,.01],['p2','Model 2 positive-label probability',0,1,.01],['w','Posterior weight for model 1',0,1,.01],['frequency','Illustrative observed positive-label frequency',0,1,.01]],
      assumption:'Assume 2 candidate classifiers with posterior weights w and 1−w at a fixed input.',
      operation:'Compare their average prediction with their individual uncertainties. Then compare predicted and observed positive-label frequencies.',
      calculate:function(s){var v=uncertainty(s.p1,s.p2,s.w);return result([['Predictive entropy in bits',v.predictive],['Aleatoric term in bits',v.aleatoric],['Epistemic term in bits',v.epistemic],['Predicted positive-label probability',v.mean],['Observed-minus-predicted frequency',s.frequency-v.mean]],barPlot([v.aleatoric,v.epistemic,v.predictive],['Aleatoric','Epistemic','Total']),
        'Predictive entropy = '+f(v.aleatoric)+' + '+f(v.epistemic)+' = '+f(v.predictive)+' bits.',
        ['The weighted positive-label probability equals '+f(s.w)+' × '+f(s.p1)+' + '+f(1-s.w)+' × '+f(s.p2)+' = '+f(v.mean)+'.','Average individual model entropies to obtain '+f(v.aleatoric)+' bits. Subtract this from predictive entropy to obtain '+f(v.epistemic)+' bits.','The chosen observed frequency '+f(s.frequency)+' differs from predicted frequency by '+f(Math.abs(s.frequency-v.mean))+'.','This single group illustrates a calibration comparison. It cannot establish calibration across inputs or quantify sampling error.']);}},
    {title:'Change the assumptions entering a generalisation bound',initial:{n:128,bits:16},controls:[['n','Independent training examples',16,512,16],['bits','Assumed dataset-model mutual information in bits',0,64,1]],
      assumption:'Assume independent identically distributed examples and loss in [0,1]. Its uniform sub-Gaussian scale can be 1/2.',
      operation:'Increase sample size or reduce assumed information. Then compare the resulting upper bound on the absolute expected gap.',
      calculate:function(s){var v=bound(s.n,s.bits);return result([['Assumed information in nats',s.bits*Math.LN2],['Absolute expected-gap bound',v],['Training examples',s.n]],curvePlot(function(n){return bound(n,s.bits);},s.n,16,512,1.2,'Training sample size'),
        'Bound = √(2 × (1/2)² × '+f(s.bits*Math.LN2)+' / '+s.n+') = '+f(v)+'.',
        ['Convert the assumed information '+s.bits+' bits to '+f(s.bits*Math.LN2)+' nats.','Substitute this value and sample size '+s.n+' into the theorem to obtain '+f(v)+'.','This is an assumed-information calculation. It does not estimate dataset-model information or measure a trained model’s actual gap.']);}},
    {title:'Compare lossy rate with continuous entropy under scaling',initial:{d:.1,scale:1},controls:[['d','Allowed binary distortion',0,.5,.01],['scale','Width of an illustrative uniform density',.25,4,.05]],
      assumption:'The rate curve uses independent fair bits with Hamming distortion. The separate density is uniform on [0, scale].',
      operation:'Increase tolerated bit errors to reduce rate. Then change the continuous scale to see its effect on differential entropy.',
      calculate:function(s){return result([['Minimum rate in bits',B.rateDistortion(s.d)],['Density height',1/s.scale],['Differential entropy in bits',Math.log2(s.scale)]],curvePlot(B.rateDistortion,s.d,0,.5,1,'Allowed average bit error'),
        'R(D) = 1 − H₂(D) = '+f(B.rateDistortion(s.d))+' bits. h(uniform) = log₂(scale) = '+f(Math.log2(s.scale))+' bits.',
        ['For distortion '+f(s.d)+', error entropy equals '+f(H(s.d))+' bits. Subtract it from 1.','The continuous uniform density has height '+f(1/s.scale)+' and width '+f(s.scale)+'. Their product equals 1.','Its differential entropy equals log₂(width). Therefore, shrinking width below 1 makes this quantity negative.']);}},
    {title:'Compare token loss, perplexity and Jensen-Shannon divergence',initial:{p:.7,q:.3},controls:[['p','Data frequency of token A',.01,.99,.01],['q','Model probability of token A',.01,.99,.01]],
      assumption:'Assume 2 tokens with fixed data frequencies P. The model uses the same probabilities at every position.',
      operation:'Move model probabilities towards data frequencies. Then compare token cross-entropy, perplexity and distribution divergence.',
      calculate:function(s){var ce=B.crossEntropy(binary(s.p),binary(s.q)),div=js(binary(s.p),binary(s.q));return result([['Mean token loss in bits',ce],['Perplexity',Math.pow(2,ce)],['JS divergence in bits',div]],barPlot(binary(s.q),['Model token A','Model token B']),
        'Perplexity = 2^(mean token loss) = 2^'+f(ce)+' = '+f(Math.pow(2,ce))+'.',
        ['Data-weighted negative log model probabilities give mean token loss '+f(ce)+' bits.','Exponentiate with base 2 because the loss uses bits. The result is '+f(Math.pow(2,ce))+'.','Compare each distribution with the equal mixture and average both KL values. JS divergence equals '+f(div)+' bits.']);}},
    {title:'Compare exact KL with its local Fisher approximation',initial:{p:.5,delta:.05},controls:[['p','Starting Bernoulli parameter',.1,.7,.01],['delta','Parameter displacement',-.08,.2,.01]],animate:'delta',
      assumption:'Assume a Bernoulli model with interior probabilities. This experiment uses natural logarithms and reports KL in nats.',
      operation:'Reduce the displacement towards zero. Then compare exact KL with the quadratic Fisher approximation.',
      calculate:function(s){var v=fisher(s.p,s.delta);return result([['Fisher information',v.information],['Exact KL in nats',v.exact],['Quadratic approximation in nats',v.quadratic]],curvePlot(function(d){return fisher(s.p,d).exact;},s.delta,-.08,.2,.7,'Parameter displacement'),
        'F(θ) = 1 / [θ(1−θ)] = '+f(v.information)+'. Local KL ≈ ½ δ² F(θ) = '+f(v.quadratic)+' nats.',
        ['The starting probability is '+f(s.p)+'. The comparison model probability is '+f(s.p+s.delta)+'.','The heads score equals 1/θ. Meanwhile, the tails score equals −1/(1−θ). Their expected squares sum to '+f(v.information)+'.','Exact KL equals '+f(v.exact)+' nats. Its quadratic approximation equals '+f(v.quadratic)+' nats.','The absolute approximation error is '+f(Math.abs(v.exact-v.quadratic))+' nats. The approximation concerns small displacements.']);}}
  ];
  var M={nll:nll,elbo:elbo,cascade:cascade,bottleneck:bottleneck,uncertainty:uncertainty,js:js,expectedGain:expectedGain,fisher:fisher,bound:bound,experiments:experiments};
  if(typeof module!=='undefined' && module.exports){module.exports=M;return;}
  if(!document.querySelector('.syl-page[data-topic="information-theory"]'))return;
  function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
  function text(x,y,value,anchor){return '<text x="'+x+'" y="'+y+'" text-anchor="'+(anchor||'start')+'">'+esc(value)+'</text>';}
  function svgLine(x,y,a,b,cls){return '<line class="'+(cls||'it-axis')+'" x1="'+x+'" y1="'+y+'" x2="'+a+'" y2="'+b+'"/>';}
  function plot(p,control){
    var svg='';
    if(p.kind==='bars'){
      svg+=svgLine(45,255,640,255);
      p.values.forEach(function(v,i){var x=90+i*540/p.values.length,h=v/p.max*190;svg+='<rect class="it-bar" x="'+x+'" y="'+(255-h)+'" width="70" height="'+Math.max(0,h)+'" rx="4"/>'+text(x+35,Math.max(35,240-h),f(v),'middle')+text(x+35,283,p.labels[i],'middle');});
    }else if(p.kind==='curve'){
      var path='';
      for(var i=0;i<=100;i++){var x=p.min+(p.max-p.min)*i/100,y=p.fn(x);path+=(i?'L':'M')+(65+i*5.55)+','+(255-y/p.ymax*190);}
      svg+=svgLine(65,255,620,255)+svgLine(65,255,65,65)+'<path class="it-curve" d="'+path+'"/>';
      svg+='<circle class="it-point it-lesson-handle" data-handle tabindex="0" role="slider" aria-label="'+esc(control[1])+'" aria-valuemin="'+control[2]+'" aria-valuemax="'+control[3]+'" aria-valuenow="'+p.x+'" cx="'+(65+(p.x-p.min)/(p.max-p.min)*555)+'" cy="'+(255-p.fn(p.x)/p.ymax*190)+'" r="8"/>';
      svg+=text(65,280,p.min)+text(620,280,p.max,'end')+text(340,307,p.label,'middle')+text(55,255,'0','end')+text(55,70,p.ymax,'end');
    }else if(p.kind==='joint'){
      svg+=text(140,65,'Input / Label')+text(340,65,'Label 0','middle')+text(495,65,'Label 1','middle');
      p.joint.forEach(function(row,i){svg+=text(140,125+i*100,'Input '+i);row.forEach(function(v,j){svg+='<rect x="'+(275+j*155)+'" y="'+(90+i*100)+'" width="125" height="80" class="it-joint-cell" style="fill-opacity:'+(v*.28+.05)+'"/>'+text(338+j*155,140+i*100,f(v),'middle');});});
    }else if(p.kind==='pipeline'){
      p.values.forEach(function(v,i){var x=50+i*210;svg+='<rect class="it-node" x="'+x+'" y="90" width="160" height="130" rx="10"/>'+text(x+80,130,p.labels[i],'middle')+text(x+80,175,f(v)+' bits','middle');if(i<2)svg+=svgLine(x+165,155,x+205,155,'it-wire');});
    }else if(p.kind==='codes'){
      svg+=text(70,40,'Symbol')+text(235,40,'Probability')+text(470,40,'Prefix code');
      p.probabilities.forEach(function(v,i){var y=85+i*55;svg+=text(80,y,'ABCD'[i])+'<rect class="it-bar" x="215" y="'+(y-20)+'" width="'+(v*300)+'" height="25" rx="3"/>'+text(410,y,f(v),'end')+text(505,y,p.words[i].split('').join(' '),'middle');});
    }else if(p.kind==='signed'){
      var zero=65+p.max/(p.max-p.min)*190;svg+=svgLine(45,zero,640,zero);
      p.values.forEach(function(v,i){var x=65+i*145,position=65+(p.max-v)/(p.max-p.min)*190;svg+='<rect class="it-bar" x="'+x+'" y="'+Math.min(position,zero)+'" width="65" height="'+Math.abs(position-zero)+'" rx="3"/>'+text(x+32,position+20,f(v),'middle')+text(x+32,292,p.labels[i],'middle');});
    }
    return svg;
  }
  function mount(module,index){
    var e=experiments[index],root=document.createElement('section'),id='it-lesson-'+index;
    root.className='xp it-explorer it-lesson';root.dataset.lesson=index;root.setAttribute('aria-labelledby',id+'-title');
    root.innerHTML='<header class="xp-head"><span class="syl-phase">Try the calculation</span><h3 id="'+id+'-title">'+esc(e.title)+'</h3><p>'+esc(e.assumption)+'</p></header>'+
      '<div class="it-controls">'+e.controls.map(function(c){return '<label for="'+id+'-'+c[0]+'">'+esc(c[1])+' <output data-value="'+c[0]+'"></output><input data-control="'+c[0]+'" id="'+id+'-'+c[0]+'" type="range" min="'+c[2]+'" max="'+c[3]+'" step="'+c[4]+'" value="'+e.initial[c[0]]+'"/></label>';}).join('')+'</div>'+
      '<div class="it-transport" role="group" aria-label="Lesson animation controls"><button type="button" data-play aria-pressed="false">Play a change</button><button type="button" data-step>Step</button><button type="button" data-reset>Reset</button><label for="'+id+'-speed">Speed</label><select id="'+id+'-speed" data-speed><option value="1">Normal</option><option value="0.5">Slow</option><option value="2">Fast</option></select></div>'+
      '<label class="it-lesson-timeline" for="'+id+'-timeline">Scrub the recorded change <output data-progress-value>0%</output><input id="'+id+'-timeline" type="range" data-progress min="0" max="1" step="0.01" value="0"/></label>'+
      '<p class="it-lesson-drag" data-drag-note hidden>Drag the plotted point, or focus it and use the arrow keys.</p>'+
      '<div class="it-stage" tabindex="0" role="region" aria-label="Scrollable lesson diagram"><svg data-svg viewBox="0 0 680 330" role="group" aria-labelledby="'+id+'-svg-title '+id+'-svg-desc"><title id="'+id+'-svg-title">'+esc(e.title)+'</title><desc id="'+id+'-svg-desc"></desc><g data-drawing></g></svg></div>'+
      '<div class="it-readouts" data-readouts></div><div class="it-calculation"><p data-equation class="it-formula"></p><p>Displayed values are rounded to 4 decimal places.</p><div class="it-lesson-guide" role="group" aria-label="Calculation walkthrough"><button type="button" data-guide="0" aria-pressed="true">1. Inputs</button><button type="button" data-guide="1" aria-pressed="false">2. Calculate</button><button type="button" data-guide="2" aria-pressed="false">3. Interpret</button></div><p data-caption></p><details><summary>Work through the current numbers</summary><div data-worked></div></details></div><output class="it-status" data-status aria-live="polite"></output>';
    var slot=module.querySelector('.syl-viz');slot.insertAdjacentElement('afterend',root);
    var $=function(sel){return root.querySelector(sel);},state=Object.assign({},e.initial),guide=0,phase=0,raf=null,last=null;
    var primary=e.animate||e.controls[0][0],control=e.controls.filter(function(c){return c[0]===primary;})[0],motion={};
    function record(){motion.from=state[primary];motion.to=state[primary]===control[3]?control[2]:control[3];phase=0;}
    function stop(){if(raf!==null)cancelAnimationFrame(raf);raf=null;last=null;$('[data-play]').textContent='Play a change';$('[data-play]').setAttribute('aria-pressed','false');}
    function draw(announce){
      var r=e.calculate(state),focused=document.activeElement===$('[data-handle]');
      $('[data-drawing]').innerHTML=plot(r.plot,control);$('[data-drag-note]').hidden=r.plot.kind!=='curve';
      $('[data-readouts]').innerHTML=r.rows.map(function(row){return '<div><span>'+esc(row[0])+'</span><strong>'+f(row[1])+'</strong></div>';}).join('');
      var values={};r.rows.forEach(function(row,i){values['r'+i]=f(row[1]);});Object.keys(state).forEach(function(key){values[key]=f(state[key]);});window.InterviewDisplayMath.set($('[data-equation]'),'lesson/'+index,values);$('[data-worked]').innerHTML=r.worked.map(function(w){return '<p>'+esc(w)+'</p>';}).join('');
      $('[data-caption]').textContent=guide===0?e.assumption:guide===1?e.operation:r.worked[r.worked.length-1];
      $('#'+id+'-svg-desc').textContent=r.formula;
      e.controls.forEach(function(c){$('[data-control="'+c[0]+'"]').value=state[c[0]];$('[data-value="'+c[0]+'"]').textContent=c[4]===1?state[c[0]]:f(state[c[0]]);});
      $('[data-progress]').value=phase;$('[data-progress-value]').textContent=Math.round(phase*100)+'%';
      if(announce)$('[data-status]').textContent=r.formula;
      var handle=$('[data-handle]');
      if(handle && !dragging){
        var viewport=$('.it-stage'),box=viewport.getBoundingClientRect(),point=handle.getBoundingClientRect();
        if(point.left<box.left+16 || point.right>box.right-16)viewport.scrollLeft+=(point.left+point.width/2)-(box.left+box.width/2);
      }
      if(focused && handle)handle.focus({preventScroll:true});
    }
    function scrub(value,announce){phase=Math.max(0,Math.min(1,value));var v=motion.from+(motion.to-motion.from)*phase;state[primary]=Number((Math.round((v-control[2])/control[4])*control[4]+control[2]).toFixed(5));draw(announce);}
    function tick(now){if(last!==null)scrub(phase+Math.min(100,now-last)/5000*Number($('[data-speed]').value),false);last=now;if(phase>=1){stop();draw(true);}else raf=requestAnimationFrame(tick);}
    root.addEventListener('input',function(event){var key=event.target.dataset.control;if(key){stop();state[key]=Number(event.target.value);record();draw(true);}else if(event.target.hasAttribute('data-progress')){stop();scrub(Number(event.target.value),true);}});
    root.addEventListener('click',function(event){var button=event.target.closest('button');if(!button)return;
      if(button.hasAttribute('data-play')){if(raf!==null){stop();draw(true);}else{if(phase>=1){record();}button.textContent='Pause';button.setAttribute('aria-pressed','true');$('[data-status]').textContent='Animation playing. Pause or scrub to inspect the current calculation.';raf=requestAnimationFrame(tick);}}
      else if(button.hasAttribute('data-step')){stop();if(phase>=1)record();scrub(phase+.05,true);}
      else if(button.hasAttribute('data-reset')){stop();state=Object.assign({},e.initial);record();draw(true);}
      else if(button.hasAttribute('data-guide')){guide=Number(button.dataset.guide);root.querySelectorAll('[data-guide]').forEach(function(b){b.setAttribute('aria-pressed',String(Number(b.dataset.guide)===guide));});draw(false);}
    });
    var dragging=false,svg=$('[data-svg]');
    function setPoint(clientX,clientY){var r=e.calculate(state);if(r.plot.kind!=='curve')return;var point=new DOMPoint(clientX,clientY).matrixTransform(svg.getScreenCTM().inverse()),p=r.plot;
      var value=p.min+(point.x-65)/555*(p.max-p.min);value=Math.min(control[3],Math.max(control[2],value));state[primary]=Number((Math.round((value-control[2])/control[4])*control[4]+control[2]).toFixed(4));record();draw(true);
    }
    svg.addEventListener('pointerdown',function(event){if(!event.target.hasAttribute('data-handle'))return;event.preventDefault();stop();dragging=true;svg.setPointerCapture(event.pointerId);setPoint(event.clientX,event.clientY);});
    svg.addEventListener('pointermove',function(event){if(dragging)setPoint(event.clientX,event.clientY);});
    svg.addEventListener('pointerup',function(){dragging=false;});svg.addEventListener('pointercancel',function(){dragging=false;});
    svg.addEventListener('keydown',function(event){if(!event.target.hasAttribute('data-handle'))return;var keys=['ArrowLeft','ArrowDown','ArrowRight','ArrowUp','Home','End'];if(keys.indexOf(event.key)<0)return;event.preventDefault();stop();var v=state[primary];
      if(event.key==='Home')v=control[2];else if(event.key==='End')v=control[3];else v+=(event.key==='ArrowLeft'||event.key==='ArrowDown'?-1:1)*control[4]*(event.shiftKey?10:1);
      state[primary]=Number(Math.min(control[3],Math.max(control[2],v)).toFixed(5));record();draw(true);
    });
    document.addEventListener('visibilitychange',function(){if(document.hidden)stop();});
    if('IntersectionObserver' in window){var observer=new IntersectionObserver(function(entries){if(!entries[0].isIntersecting)stop();});observer.observe(root);}
    record();draw(false);
  }
  document.querySelectorAll('.syl-module').forEach(function(module,index){if(experiments[index])mount(module,index);});
}());
