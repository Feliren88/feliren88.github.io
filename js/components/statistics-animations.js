/* Finite worked examples accompany the existing statistics lesson diagrams. */
(function () {
  'use strict';
  var page=document.querySelector('.syl-page'),topic=page && page.dataset.topic;
  if(topic!=='bayesian-statistics' && topic!=='frequentist-statistics')return;
  function F(title,labels,values,scale,summary){return {title:title,labels:labels,values:values,scale:scale,summary:summary||''};}
  function kl(p,q){return p.reduce(function(s,v,i){return s+(v?v*Math.log2(v/q[i]):0);},0);}
  var likelihood=[.2,.5,.8].map(function(p){return p*p*(1-p);}),total=likelihood.reduce(function(a,b){return a+b;},0);
  var se=Math.sqrt(.2*.8/100+.3*.7/100);
  var tracks={
    'bayesian-statistics':[
      {title:'Update a probability with observed evidence',steps:[
        'Assume a claim has prior probability 0.3. Its alternative therefore has probability 0.7.',
        'The observed evidence has likelihood 0.8 under the claim and 0.2 under its alternative.',
        'Multiply prior probabilities by likelihoods. The resulting weights are 0.24 and 0.14.',
        'Divide each weight by their sum, 0.38. The posterior claim probability equals 0.632, rounded.'],frames:[
        F('Prior probability',['Claim','Alternative'],[.3,.7],1),F('Evidence likelihood',['Claim','Alternative'],[.8,.2],1),
        F('Unnormalised weight',['Claim','Alternative'],[.24,.14],.4,'0.3 × 0.8 = 0.24; 0.7 × 0.2 = 0.14'),
        F('Posterior probability',['Claim','Alternative'],[.24/.38,.14/.38],1,'0.24 / 0.38 ≈ 0.632')]},
      {title:'Compare priors after the same observations',steps:[
        'Choose beta priors with parameters (1, 1), (2, 2) and (8, 2). Their means are 0.5, 0.5 and 0.8.',
        'Assume trials are independent given one shared success probability. Observe 8 successes and 2 failures. Add 8 to each prior’s first parameter.',
        'Then add 2 to each second parameter. The posterior parameter pairs are (9, 3), (10, 4) and (16, 4).',
        'A beta distribution’s mean divides its first parameter by the sum of both parameters. Posterior means differ because the priors differ.'],frames:[
        F('Prior mean',['Beta(1,1)','Beta(2,2)','Beta(8,2)'],[.5,.5,.8],1),
        F('Success parameter after data',['Prior 1','Prior 2','Prior 3'],[9,10,16],20),
        F('Failure parameter after data',['Prior 1','Prior 2','Prior 3'],[3,4,4],5),
        F('Posterior mean',['Beta(9,3)','Beta(10,4)','Beta(16,4)'],[9/12,10/14,16/20],1)]},
      {title:'Normalise a posterior on a finite grid',steps:[
        'Restrict the possible success probabilities to 0.2, 0.5 and 0.8. Assign each equal prior probability.',
        'Assume trials are independent given their shared probability p. Observe the ordered sequence success, success, failure. Calculate the likelihood at each grid point using the displayed expression.',
        'The likelihoods sum to 0.285. Equal prior weights cancel when we normalise.',
        'Divide each likelihood by 0.285. This gives the exact posterior for this chosen finite model.'],frames:[
        F('Prior mass',['p = 0.2','p = 0.5','p = 0.8'],[1/3,1/3,1/3],1),
        F('Sequence likelihood',['p = 0.2','p = 0.5','p = 0.8'],likelihood,.15),
        F('Weights before normalisation',['p = 0.2','p = 0.5','p = 0.8'],likelihood,.15,'Normalising sum = 0.285'),
        F('Posterior mass',['p = 0.2','p = 0.5','p = 0.8'],likelihood.map(function(v){return v/total;}),1)]},
      {title:'Pool noisy group estimates towards a shared mean',steps:[
        'Assume group parameters have a normal prior with mean 10 and variance 1.',
        'Observe group estimates 6, 10 and 14. Each estimate has known normal observation variance 4.',
        'The displayed posterior weight on each observation equals 0.2. The shared prior receives weight 0.8.',
        'Calculate 0.2 × observation + 0.8 × 10. The posterior means become 9.2, 10 and 10.8.'],frames:[
        F('Shared prior mean',['Group 1','Group 2','Group 3'],[10,10,10],15),
        F('Observed group estimates',['Group 1','Group 2','Group 3'],[6,10,14],15),
        F('Posterior mixing weights',['Observation','Shared prior'],[.2,.8],1),
        F('Partially pooled means',['Group 1','Group 2','Group 3'],[9.2,10,10.8],15)]},
      {title:'Predict new observations from a posterior',steps:[
        'Choose a uniform beta prior, Beta(1,1), for a coin’s success probability. Assume tosses are independent given this shared probability.',
        'Observe 4 successes and 1 failure. The posterior is Beta(5,2), with mean approximately 0.714.',
        'Predict 2 future tosses by averaging their probabilities over this posterior. Sharing the uncertain parameter makes the tosses dependent after averaging.',
        'The predictive counts 0, 1 and 2 have probabilities given by the displayed fractions. Compare replicated observations with actual observations to assess the model.'],frames:[
        F('Prior parameters',['Success parameter','Failure parameter'],[1,1],7),
        F('Posterior parameters',['Success parameter','Failure parameter'],[5,2],7,'Posterior mean = 5 / 7 ≈ 0.714'),
        F('Predictive probability',['0 successes','1 success','2 successes'],[6/56,20/56,30/56],1),
        F('Predictive probability',['0 successes','1 success','2 successes'],[6/56,20/56,30/56],1,'Probabilities sum to 1; model fit needs checking')]},
      {title:'Reduce approximation error in a variational posterior',steps:[
        'Assume an exactly known two-state posterior [0.8, 0.2] for this illustration.',
        'Approximate it with [0.5, 0.5]. The KL divergence from approximation to posterior is 0.322 bits, rounded.',
        'Move the approximation to [0.7, 0.3]. Its KL divergence falls to 0.041 bits.',
        'Matching [0.8, 0.2] gives zero KL. If log evidence is −1 bit, the ELBO equals −1 minus this KL.'],frames:[
        F('Exact posterior',['State A','State B'],[.8,.2],1),
        F('Approximation',['State A','State B'],[.5,.5],1,'KL ≈ '+kl([.5,.5],[.8,.2]).toFixed(3)+' bits'),
        F('Improved approximation',['State A','State B'],[.7,.3],1,'KL ≈ '+kl([.7,.3],[.8,.2]).toFixed(3)+' bits'),
        F('KL in bits',['Initial','Improved','Exact'],[kl([.5,.5],[.8,.2]),kl([.7,.3],[.8,.2]),0],.4,'ELBO values ≈ −1.322, −1.041, −1 bits')]}
    ],
    'frequentist-statistics':[
      {title:'Distinguish one estimate from its sampling distribution',steps:[
        'Assume 2 independent Bernoulli observations, each with success probability 0.5.',
        'One possible sample is [0,1]. Its sample mean equals 0.5.',
        'Across repeated samples, the possible means are 0, 0.5 and 1. Their probabilities are 0.25, 0.5 and 0.25.',
        'The expected sample mean is 0.5 and its variance is 0.125. Unbiasedness concerns repeated samples.'],frames:[
        F('Population probabilities',['Failure','Success'],[.5,.5],1),F('One observed sample',['Observation 1','Observation 2'],[0,1],1,'Sample mean = 0.5'),
        F('Sampling mass',['Mean 0','Mean 0.5','Mean 1'],[.25,.5,.25],1),F('Estimator properties',['Expected mean','Variance'],[.5,.125],1)]},
      {title:'Find the Bernoulli maximum-likelihood estimate',steps:[
        'Observe 3 successes and 1 failure in 4 independent Bernoulli trials with the same probability p.',
        'Calculate this ordered sample’s likelihood using the displayed expression. Compare p = 0.25, 0.5 and 0.75.',
        'The likelihood is largest at p = 0.75 among these candidates.',
        'For an interior maximum, differentiate the log likelihood. Setting the displayed derivative to zero gives a success probability of 0.75.'],frames:[
        F('Observed counts',['Successes','Failures'],[3,1],4),
        F('Sequence likelihood',['p = 0.25','p = 0.5','p = 0.75'],[.25**3*.75,.5**4,.75**3*.25],.12),
        F('Best candidate',['p = 0.75'],[.75**3*.25],.12),F('Fitted probabilities',['Success','Failure'],[.75,.25],1,'MLE = 3 / 4 = 0.75')]},
      {title:'Construct a normal interval with known variance',steps:[
        'Assume 16 independent normal observations with known standard deviation 2. The observed mean is 10.',
        'The displayed standard error calculation gives 0.5.',
        'Use the normal multiplier 1.96. The margin equals 1.96 × 0.5 = 0.98.',
        'The interval is [9.02, 10.98]. Under these assumptions, this procedure covers the fixed population mean about 95% of the time.'],frames:[
        F('Inputs',['Observed mean','Known deviation'],[10,2],12),F('Standard error',['2 / √16'],[.5],1),
        F('Interval margin',['1.96 × 0.5'],[.98],1),F('Interval endpoints',['Lower','Sample mean','Upper'],[9.02,10,10.98],12)]},
      {title:'Calculate a two-sided normal-test p-value',steps:[
        'Test a null population mean of 10 using 16 independent normal observations with known standard deviation 2.',
        'An observed mean of 11 gives a standardised distance of 2, as the displayed calculation shows.',
        'Under the null, the standardised mean follows a standard normal distribution. Count both tails beyond ±2.',
        'The two-sided p-value is approximately 0.0455. It is a tail probability under the null, without assigning a probability to the null claim.'],frames:[
        F('Comparison',['Null mean','Observed mean'],[10,11],12),F('Standardised distance',['Observed z'],[2],3),
        F('Null tail probabilities',['Left tail','Right tail'],[.02275013,.02275013],.05),F('Two-sided p-value',['Both tails'],[.04550026],.05)]},
      {title:'See why repeated testing changes error rates',steps:[
        'Assume 20 independent tests, all with true null hypotheses. Each test rejects incorrectly with probability 0.05.',
        'The expected number of false rejections is 20 × 0.05 = 1.',
        'The displayed probability of at least 1 false rejection is approximately 0.642.',
        'A Bonferroni threshold of 0.0025 bounds the probability of any false rejection by 0.05. This bound also allows dependent tests.'],frames:[
        F('Per-test error probability',['Uncorrected threshold'],[.05],.06),F('Expected false rejections',['20 × 0.05'],[1],2),
        F('Chance of any false rejection',['Independent tests'],[1-.95**20],1),F('Per-test threshold',['Original','Bonferroni'],[.05,.0025],.06,'Family error is bounded by 20 × 0.0025 = 0.05')]},
      {title:'Estimate an effect in a randomised A/B experiment',steps:[
        'Assume independent, randomly assigned groups of 100 people each. Group A has 20 successes; group B has 30.',
        'The observed success rates are 0.2 and 0.3. The estimated difference B−A equals 0.1.',
        'The displayed unpooled standard error is approximately 0.0608.',
        'The displayed normal interval is approximately [−0.019, 0.219]. The approximation assumes independent observations and sufficiently large counts.'],frames:[
        F('Observed successes',['A','B'],[20,30],40),F('Success rates',['A','B'],[.2,.3],1),
        F('Effect and standard error',['Difference B−A','Standard error'],[.1,se],.25),
        F('Approximate interval',['Lower','Difference','Upper'],[.1-1.96*se,.1,.1+1.96*se],.25)]},
      {title:'Compare crude and adjusted group averages',steps:[
        'Assume severe cases make up 80% of the treatment group and 20% of the comparison group.',
        'Within severe cases, success rates are 0.4 versus 0.3. Within mild cases, they are 0.8 versus 0.7.',
        'Weight by each group’s observed severity mix. The crude rates become 0.48 and 0.62.',
        'Equal severity weights give adjusted rates 0.6 and 0.5. For a causal interpretation, no unmeasured cause may affect both treatment choice and outcome. Both treatments must also be possible within each group, with consistent treatment definitions.'],frames:[
        F('Fraction of severe cases',['Treatment','Comparison'],[.8,.2],1),
        F('Within-group success rate',['Severe treatment','Severe comparison','Mild treatment','Mild comparison'],[.4,.3,.8,.7],1),
        F('Crude success rate',['Treatment','Comparison'],[.8*.4+.2*.8,.2*.3+.8*.7],1),
        F('Equal-weight adjusted rate',['Treatment','Comparison'],[.5*.4+.5*.8,.5*.3+.5*.7],1,'Adjusted difference = 0.1; assumptions matter')]},
      {title:'Fit a line and inspect its residuals',steps:[
        'Use the chosen points (1,2), (2,2) and (3,5). The average x is 2 and average y is 3.',
        'Multiply centred x and y pairs and add them to obtain 3. The sum of squared centred x values is 2.',
        'The fitted slope equals 1.5. The intercept equals 3 − 1.5×2 = 0.',
        'Predictions are 1.5, 3 and 4.5. Observed minus predicted values give residuals 0.5, −1 and 0.5. Their pattern needs checking before inference.'],frames:[
        F('Observed y',['x = 1','x = 2','x = 3'],[2,2,5],6),F('Centred sums',['Cross-product sum','Squared-x sum'],[3,2],4),
        F('Fitted y',['x = 1','x = 2','x = 3'],[1.5,3,4.5],6,'Fitted line y = 1.5 x'),
        F('Residuals',['x = 1','x = 2','x = 3'],[.5,-1,.5],1.5,'Squared residuals sum to 1.5')]}
    ]
  };
  function text(x,y,s){if(s==='2 / √16')return '<foreignObject x="'+x+'" y="'+(y-23)+'" width="150" height="45"><div xmlns="http://www.w3.org/1999/xhtml" style="font-size:14px">'+window.InterviewDisplayMath.html('statistics/frequentist-statistics/se-label',undefined,true)+'</div></foreignObject>';return '<text x="'+x+'" y="'+y+'">'+s+'</text>';}
  page.querySelectorAll('.syl-module').forEach(function(module,index){
    var model=tracks[topic][index],section=document.createElement('section');
    section.className='ue-animation statistics-animation';section.setAttribute('aria-label',model.title);
    section.innerHTML='<h3></h3><p class="ue-assumption">This example uses chosen numbers. Displayed decimals are rounded.</p>'+ 
      '<div class="ue-chart" tabindex="0" role="region" aria-label="Worked calculation. Scroll sideways if needed."><svg viewBox="0 0 620 340" role="img"></svg></div><p class="statistics-equation" style="overflow-x:auto;padding-block:.4rem"></p><div class="statistics-narrative"></div>';
    window.InterviewDisplayMath.set(section.querySelector('.statistics-equation'),'statistics/'+topic+'/'+index);
    section.querySelector('h3').textContent=model.title;module.querySelector('.syl-viz').insertAdjacentElement('afterend',section);
    window.InterviewNarrative.mount(section.querySelector('.statistics-narrative'),{steps:model.steps,draw:function(at){
      var frame=model.frames[at],signed=frame.values.some(function(v){return v<0;}),base=signed?380:210,width=signed?110:280;
      var svg=section.querySelector('svg'),s=text(25,30,frame.title);
      frame.values.forEach(function(value,i){var y=55+i*47,w=Math.abs(value)/frame.scale*width;
        s+=text(25,y+18,frame.labels[i])+'<rect x="'+(value<0?base-w:base)+'" y="'+y+'" width="'+w+'" height="25"/>'+text(510,y+18,value.toFixed(3));});
      if(signed)s+='<path class="ue-axis" d="M'+base+' 45V250"/>'+text(base-4,270,'0');
      s+=text(25,310,frame.summary);svg.innerHTML=s;svg.setAttribute('aria-label',model.title+'. '+model.steps[at]);
    }});
  });
}());
