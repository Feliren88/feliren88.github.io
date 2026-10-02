/* Finite illustrative models. All explorer quantities are measured in bits. */
(function () {
  'use strict';
  function validate(p) {
    if (!Array.isArray(p) || !p.length || p.some(function (x) { return !Number.isFinite(x) || x < 0; }) ||
        Math.abs(p.reduce(function (a,b) { return a+b; },0)-1)>1e-9) throw new RangeError('Probabilities must be nonnegative and sum to 1.');
  }
  function entropy(p) {
    validate(p);
    return p.reduce(function (s,x) { return s-(x ? x*Math.log2(x) : 0); },0);
  }
  function crossEntropy(p,q) {
    validate(p); validate(q);
    if (p.length!==q.length) throw new RangeError('Distributions need matching outcomes.');
    return p.reduce(function(s,x,i) { return s-(x ? x*Math.log2(q[i]) : 0); },0);
  }
  function kl(p,q) { return crossEntropy(p,q)-entropy(p); }
  function channel(p,e) {
    validate([p,1-p]); validate([e,1-e]);
    return [[(1-p)*(1-e),(1-p)*e],[p*e,p*(1-e)]];
  }
  function mutualInformation(joint) {
    validate(joint.flat());
    var rows=joint.map(function(r) { return r.reduce(function(a,b) { return a+b; },0); });
    var cols=joint[0].map(function(_,i) { return joint.reduce(function(s,r) { return s+r[i]; },0); });
    return entropy(rows)+entropy(cols)-entropy(joint.flat());
  }
  function posterior(prior,heads,tails) {
    var a=(1-prior)*Math.pow(.5,heads+tails);
    var b=prior*Math.pow(.75,heads)*Math.pow(.25,tails);
    return b/(a+b);
  }
  function huffman(p) {
    validate(p);
    var nodes=p.map(function(v,i) { return {weight:v,index:i}; });
    while(nodes.length>1) {
      nodes.sort(function(a,b) { return a.weight-b.weight || (a.index||0)-(b.index||0); });
      var a=nodes.shift(), b=nodes.shift();
      nodes.push({weight:a.weight+b.weight,left:a,right:b});
    }
    var words=[];
    function visit(n,word) {
      if(n.index!==undefined) words[n.index]=word || '0';
      else { visit(n.left,word+'0'); visit(n.right,word+'1'); }
    }
    visit(nodes[0],''); return words;
  }
  function rateDistortion(d) {
    if (d<0 || d>1) throw new RangeError('Distortion must lie between 0 and 1.');
    return d>=.5 ? 0 : 1-entropy([d,1-d]);
  }
  var M={entropy:entropy,crossEntropy:crossEntropy,kl:kl,channel:channel,mutualInformation:mutualInformation,posterior:posterior,huffman:huffman,rateDistortion:rateDistortion};
  if(typeof module!=='undefined' && module.exports) module.exports=M;
  if(typeof window!=='undefined') window.InformationMath=M;
  if(typeof document==='undefined') return;
  var root=document.querySelector('[data-information-explorer]');
  if(!root) return;
  var $=function(s) { return root.querySelector(s); };
  var mode='entropy', state={}, frame=null, previous=0, elapsed=0;
  var defaults={entropy:{p:.5},fitting:{p:.7,q:.3},channel:{p:.5,e:.1},bayes:{prior:.5,heads:3,tails:1},coding:{mix:0},distortion:{d:.1}};
  var controls={entropy:[['p','Probability of heads',0,1,.01]],fitting:[['p','Data probability P(heads)',0,1,.01],['q','Model probability Q(heads)',0,1,.01]],channel:[['p','Input probability of 1',0,1,.01],['e','Probability of a flipped bit',0,.5,.01]],bayes:[['prior','Prior weight for heads probability 3/4',.01,.99,.01],['heads','Observed heads',0,12,1],['tails','Observed tails',0,12,1]],coding:[['mix','Blend towards equal symbol probabilities',0,1,.01]],distortion:[['d','Allowed average bit error',0,.5,.01]]};
  function f(v) { return Number.isFinite(v) ? v.toFixed(3) : '∞'; }
  function text(x,y,s,anchor) { return '<text x="'+x+'" y="'+y+'" text-anchor="'+(anchor||'start')+'">'+s+'</text>'; }
  function line(x,y,a,b,cls) { return '<line class="'+(cls||'it-axis')+'" x1="'+x+'" y1="'+y+'" x2="'+a+'" y2="'+b+'"/>'; }
  function bar(x,y,w,h,cls) { return '<rect class="'+(cls||'it-bar')+'" x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" rx="3"/>'; }
  function bars(values,labels,x,width) {
    var s=line(x,255,x+width,255), step=width/values.length;
    values.forEach(function(v,i) {
      var cx=x+i*step+step/2;
      s+=bar(cx-25,255-v*180,50,v*180)+text(cx,285,labels[i],'middle')+text(cx,Math.max(45,245-v*180),f(v),'middle');
    }); return s;
  }
  function curve(fn,value,x,y,w,h,xmax,label) {
    var path='';
    for(var i=0;i<=100;i++) { var u=i/100; path+=(i?'L':'M')+(x+u*w)+','+(y-fn(u*xmax)*h); }
    return line(x,y,x+w,y)+line(x,y,x,y-h)+'<path class="it-curve" d="'+path+'"/>'+
      '<circle class="it-point" cx="'+(x+value/xmax*w)+'" cy="'+(y-fn(value)*h)+'" r="6"/>'+text(x,y+25,'0')+text(x+w,y+25,String(xmax),'end')+text(x+w/2,y+50,label,'middle')+text(x-10,y-h+5,'1','end');
  }
  function card(label,value) { return '<div><span>'+label+'</span><strong>'+value+'</strong></div>'; }
  function setCopy(heading,explanation,formula,note,worked) {
    $('[data-it-heading]').textContent=heading;
    $('[data-it-explanation]').textContent=explanation;
    $('[data-it-formula]').textContent=formula;
    $('[data-it-note]').textContent=note;
    $('[data-it-worked]').innerHTML=worked.map(function(p) { return '<p>'+p+'</p>'; }).join('');
  }
  function redraw(announce) {
    var s='', cards='', description='';
    controls[mode].forEach(function(c) {
      var input=$('#it-'+c[0]); input.value=state[c[0]];
      $('#it-value-'+c[0]).textContent=c[4]===1 ? state[c[0]] : f(state[c[0]]);
    });
    if(mode==='entropy') {
      var p=state.p, h=entropy([p,1-p]);
      s=text(160,28,'Outcome probabilities','middle')+bars([p,1-p],['Heads','Tails'],30,270)+text(495,28,'Binary entropy in bits','middle')+curve(function(u){return entropy([u,1-u]);},p,370,245,270,180,1,'Probability of heads');
      cards=card('Entropy',f(h)+' bits')+card('Heads surprise',f(-Math.log2(p))+' bits')+card('Tails surprise',f(-Math.log2(1-p))+' bits');
      setCopy('Expected surprise','Weight each outcome surprise by its probability. Then add the contributions.','H = −p log₂ p − (1−p) log₂(1−p) = '+f(h)+' bits.','At either endpoint, entropy is zero. A zero-probability outcome has infinite surprise but contributes zero expected surprise.',[
        'Assume heads probability '+f(p)+' and tails probability '+f(1-p)+'.',
        'The weighted heads contribution equals '+f(p===0?0:-p*Math.log2(p))+' bits. The tails contribution equals '+f(p===1?0:-(1-p)*Math.log2(1-p))+' bits.',
        'Therefore, their sum equals '+f(h)+' bits per toss.'
      ]);
      description='Heads probability '+f(p)+'. Binary entropy '+f(h)+' bits.';
    } else if(mode==='fitting') {
      var P=[state.p,1-state.p], Q=[state.q,1-state.q], H=entropy(P), CE=crossEntropy(P,Q), KL=kl(P,Q);
      s=text(160,28,'Data probabilities P','middle')+bars(P,['Heads','Tails'],30,270)+text(495,28,'Model probabilities Q','middle')+bars(Q,['Heads','Tails'],360,270);
      cards=card('Data entropy',f(H)+' bits')+card('Cross-entropy',f(CE)+' bits')+card('KL divergence',f(KL)+' bits');
      setCopy('Fit the model distribution','Hold the data distribution fixed. Then move the model probability towards the data probability.','H(P,Q) = H(P) + KL(P ∥ Q) = '+f(H)+' + '+f(KL)+' bits.','If the model assigns zero probability to a possible data outcome, its cross-entropy is infinite.',[
        'The heads log-loss contribution is '+f(P[0]===0?0:-P[0]*Math.log2(Q[0]))+' bits.',
        'The tails contribution is '+f(P[1]===0?0:-P[1]*Math.log2(Q[1]))+' bits. Therefore, expected model loss equals '+f(CE)+' bits.',
        'Subtract data entropy '+f(H)+' to obtain KL divergence '+f(KL)+' bits.'
      ]);
      description='Data heads probability '+f(state.p)+'. Model heads probability '+f(state.q)+'. Cross-entropy '+f(CE)+' bits.';
    } else if(mode==='channel') {
      var joint=channel(state.p,state.e), mi=mutualInformation(joint), inputH=entropy([state.p,1-state.p]), rem=inputH-mi;
      s=text(125,30,'Input U','middle')+text(355,30,'Joint probabilities','middle')+text(570,30,'Observed V','middle');
      [0,1].forEach(function(i) {
        s+='<circle class="it-node" cx="110" cy="'+(100+i*145)+'" r="25"/>'+text(110,105+i*145,i,'middle');
        s+='<circle class="it-node" cx="575" cy="'+(100+i*145)+'" r="25"/>'+text(575,105+i*145,i,'middle');
        [0,1].forEach(function(j) {
          var y=65+i*105+j*42;
          s+=line(140,100+i*145,250,y,'it-wire')+line(410,y,545,100+j*145,'it-wire');
          s+=bar(250,y-14,160*joint[i][j],25)+text(330,y+5,'P('+i+','+j+') = '+f(joint[i][j]),'middle');
        });
      });
      cards=card('Input entropy',f(inputH)+' bits')+card('Remaining entropy',f(rem)+' bits')+card('Mutual information',f(mi)+' bits');
      setCopy('Information through a noisy channel','Each bit flips independently with the selected error probability. More flips reduce information for this fixed input distribution.','I(U;V) = H(U) − H(U | V) = '+f(mi)+' bits.','At flip probability 0.5, the output is independent of the input. This experiment uses a binary symmetric channel.',[
        'For input 1, the probabilities of output 0 and output 1 are '+f(state.e)+' and '+f(1-state.e)+'.',
        'Multiply these conditional probabilities by input probabilities to obtain the 4 displayed joint probabilities.',
        'Calculate each marginal by summing the joint table. Then H(U) + H(V) − H(U,V) equals '+f(mi)+' bits.'
      ]);
      description='Flip probability '+f(state.e)+'. Mutual information '+f(mi)+' bits.';
    } else if(mode==='bayes') {
      var post=posterior(state.prior,state.heads,state.tails), gain=kl([post,1-post],[state.prior,1-state.prior]);
      s=text(170,28,'Prior model weights','middle')+bars([1-state.prior,state.prior],['Coin 1/2','Coin 3/4'],30,270)+text(500,28,'Posterior model weights','middle')+bars([1-post,post],['Coin 1/2','Coin 3/4'],360,270);
      cards=card('Posterior weight for 3/4',f(post))+card('Information gain',f(gain)+' bits')+card('Posterior entropy',f(entropy([post,1-post]))+' bits');
      var la=Math.pow(.5,state.heads+state.tails), lb=Math.pow(.75,state.heads)*Math.pow(.25,state.tails), wa=(1-state.prior)*la, wb=state.prior*lb;
      setCopy('Update 2 candidate coin models','Assume the coin has heads probability 1/2 or 3/4. Tosses are independent given the candidate model.','Posterior weight for 3/4 = prior × likelihood / total weight = '+f(post)+'.','The candidate model is chosen for illustration. Realised posterior entropy can increase after observing evidence.',[
        'For '+state.heads+' heads and '+state.tails+' tails, sequence likelihoods are '+la.toPrecision(5)+' and '+lb.toPrecision(5)+'.',
        'Multiply by prior weights to obtain '+wa.toPrecision(5)+' and '+wb.toPrecision(5)+'.',
        'Then divide the second weight by their sum. The posterior weight equals '+f(post)+'.',
        'Finally, posterior-to-prior KL equals '+f(gain)+' bits. These likelihoods describe a specified sequence.'
      ]);
      description='Observed '+state.heads+' heads and '+state.tails+' tails. Posterior weight for heads probability 3/4 equals '+f(post)+'.';
    } else if(mode==='coding') {
      var base=[.5,.25,.125,.125], probs=base.map(function(v){return v*(1-state.mix)+.25*state.mix;}), words=huffman(probs), mean=probs.reduce(function(v,p,i){return v+p*words[i].length;},0), sourceH=entropy(probs);
      s=text(30,28,'Symbol')+text(170,28,'Probability')+text(410,28,'Huffman code')+text(600,28,'Bits');
      probs.forEach(function(p,i) { var y=75+i*60; s+=text(40,y,'ABCD'[i])+bar(140,y-20,p*420,26)+text(365,y,f(p),'end')+text(450,y,words[i])+text(620,y,words[i].length,'end'); });
      cards=card('Source entropy',f(sourceH)+' bits')+card('Mean code length',f(mean)+' bits')+card('Excess code length',f(mean-sourceH)+' bits');
      setCopy('Build a lossless prefix code','Huffman coding repeatedly merges the 2 smallest probability weights. Following left and right edges gives each binary codeword.','Mean length = Σ probability × codeword length = '+f(mean)+' bits per symbol.','No codeword begins another codeword. Code lengths can change abruptly as probabilities cross a merge boundary.',[
        'Assume the 4 symbol probabilities displayed above. Then merge the 2 least probable nodes until 1 root remains.',
        'Assign 0 to each left edge and 1 to each right edge. Reading paths gives the displayed codewords.',
        'The weighted lengths are '+probs.map(function(p,i){return f(p)+' × '+words[i].length;}).join(' + ')+'. Their sum is '+f(mean)+' bits.',
        'The entropy lower bound is '+f(sourceH)+' bits. Fractional ideal lengths need block coding or an alternative coding scheme.'
      ]);
      description='Source entropy '+f(sourceH)+'. Mean Huffman code length '+f(mean)+' bits per symbol.';
    } else {
      var d=state.d, rate=rateDistortion(d);
      s=text(325,28,'Fair binary source with Hamming distortion','middle')+curve(rateDistortion,d,80,250,510,185,.5,'Allowed average fraction of incorrect bits');
      cards=card('Allowed distortion',f(d))+card('Minimum rate',f(rate)+' bits')+card('Binary entropy of error',f(entropy([d,1-d]))+' bits');
      setCopy('Trade reconstruction accuracy for rate','Assume independent fair binary source symbols. Hamming distortion assigns 1 to an incorrect bit and 0 otherwise.','R(D) = 1 − H₂(D) = '+f(rate)+' bits per symbol, for 0 ≤ D ≤ 0.5.','The curve describes the asymptotic minimum rate under expected distortion. It does not guarantee an error fraction for every sequence.',[
        'A fair binary source has entropy 1 bit. For allowed distortion '+f(d)+', binary error entropy equals '+f(entropy([d,1-d]))+' bits.',
        'Subtract this entropy from 1 to obtain rate '+f(rate)+' bits per source symbol.',
        'At distortion 0, transmit all source information. At distortion 0.5, a fixed reconstruction can satisfy the average-error budget.'
      ]);
      description='Allowed distortion '+f(d)+'. Minimum rate '+f(rate)+' bits per symbol.';
    }
    window.InterviewDisplayMath.set($('[data-it-formula]'),'explorer/'+mode,{h:f(h),H:f(H),KL:f(KL),mi:f(mi),wa:wa===undefined?'':wa.toPrecision(5),wb:wb===undefined?'':wb.toPrecision(5),post:f(post),mean:f(mean),rate:f(rate)});
    $('[data-it-drawing]').innerHTML=s;
    $('[data-it-readouts]').innerHTML=cards;
    $('#it-svg-desc').textContent=description;
    if(announce) $('[data-it-status]').textContent=description;
  }
  function stop() {
    if(frame!==null) cancelAnimationFrame(frame);
    frame=null; previous=0; elapsed=0;
    $('[data-it-play]').textContent='Play'; $('[data-it-play]').setAttribute('aria-pressed','false');
  }
  function advance() {
    var key={entropy:'p',fitting:'q',channel:'e',bayes:'heads',coding:'mix',distortion:'d'}[mode];
    var c=controls[mode].filter(function(v){return v[0]===key;})[0];
    state[key]=Number((state[key]>=c[3] ? c[2] : Math.min(c[3],state[key]+c[4])).toFixed(2));
    redraw(false);
  }
  function tick(now) {
    if(previous) elapsed+=Math.min(now-previous,250);
    previous=now;
    if(elapsed>=120/Number($('#it-speed').value)) { elapsed=0; advance(); }
    frame=requestAnimationFrame(tick);
  }
  function choose(next) {
    stop(); mode=next; state=Object.assign({},defaults[mode]);
    root.querySelectorAll('[data-mode]').forEach(function(b){ b.setAttribute('aria-pressed',String(b.dataset.mode===mode)); });
    $('[data-it-controls]').innerHTML=controls[mode].map(function(c){return '<label for="it-'+c[0]+'">'+c[1]+' <output id="it-value-'+c[0]+'"></output><input id="it-'+c[0]+'" type="range" min="'+c[2]+'" max="'+c[3]+'" step="'+c[4]+'" value="'+state[c[0]]+'"/></label>';}).join('');
    controls[mode].forEach(function(c) { $('#it-'+c[0]).addEventListener('input',function(){stop();state[c[0]]=Number(this.value);redraw(true);}); });
    redraw(true);
  }
  root.querySelectorAll('[data-mode]').forEach(function(b){b.addEventListener('click',function(){choose(b.dataset.mode);});});
  $('[data-it-play]').addEventListener('click',function(){
    if(frame!==null) { stop(); redraw(true); }
    else { this.textContent='Pause';this.setAttribute('aria-pressed','true');frame=requestAnimationFrame(tick);$('[data-it-status]').textContent='Animation playing. Pause to inspect the current calculation.'; }
  });
  $('[data-it-step]').addEventListener('click',function(){stop();advance();redraw(true);});
  $('[data-it-reset]').addEventListener('click',function(){choose(mode);});
  document.addEventListener('visibilitychange',function(){if(document.hidden) stop();});
  choose(mode);
}());
