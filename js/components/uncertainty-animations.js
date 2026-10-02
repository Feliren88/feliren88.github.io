/* Worked examples for the nine uncertainty lessons. All numbers are illustrative. */
(function () {
  'use strict';
  var hostPage=document.querySelector('.syl-page[data-topic="uncertainty-estimation"]');
  if(!hostPage)return;
  function entropy(p){return p.reduce(function(s,v){return s+(v ? -v*Math.log2(v) : 0);},0);}
  function calibrated(z,t){var p=z.map(function(x){return Math.exp(x/t);}),sum=p.reduce(function(a,b){return a+b;},0);return p.map(function(x){return x/sum;});}
  var models=[
    {title:'Calculate expected surprise',labels:['A','B','C'],values:[.8,.1,.1],
      steps:['Begin with chosen class probabilities 0.8, 0.1 and 0.1. They sum to 1.',
        'A rare observation gives more surprise. Calculate each possible class’s surprise with the displayed logarithm.',
        'Multiply each surprise by its class probability. Then add the contributions.',
        'The average equals '+entropy([.8,.1,.1]).toFixed(3)+' bits. This measures model uncertainty, without establishing correctness.'],
      frames:[['Probability',[.8,.1,.1],1],['Surprise in bits',[ -Math.log2(.8), -Math.log2(.1), -Math.log2(.1)],4],['Contribution in bits',[ -.8*Math.log2(.8), -.1*Math.log2(.1), -.1*Math.log2(.1)],.5],['Total entropy in bits',[entropy([.8,.1,.1])],1.5]]},
    {title:'Separate noise from model disagreement',labels:['Model 1','Model 2'],values:[.1,.9],
      steps:['Assume 2 equally weighted models predict class A with probabilities 0.1 and 0.9.',
        'Each model has binary entropy '+entropy([.1,.9]).toFixed(3)+' bits. Average these entropies to represent observation uncertainty.',
        'The mixture predicts A with probability 0.5. Therefore, its predictive entropy equals 1 bit.',
        'Subtract average model entropy from mixture entropy. Disagreement contributes '+(1-entropy([.1,.9])).toFixed(3)+' bits under this illustrative posterior.'],
      frames:[['Probability of A',[.1,.9],1],['Within-model entropy',[entropy([.1,.9]),entropy([.1,.9])],1],['Mixture entropy',[1],1],['Entropy decomposition',[entropy([.1,.9]),1-entropy([.1,.9])],1]],finalLabels:['Observation','Disagreement']},
    {title:'Keep a range of plausible probabilities',labels:['Model 1','Model 2','Model 3'],values:[.2,.5,.8],
      steps:['Assume 3 plausible models assign an event probabilities 0.2, 0.5 and 0.8.',
        'These models define different distributions. No averaging weights have been specified.',
        'Take the smallest event probability as the lower bound. Here, it equals 0.2.',
        'Take the largest as the upper bound, 0.8. Therefore, retain the interval [0.2, 0.8].'],
      frames:[['Event probability',[.2,.5,.8],1],['Plausible probabilities',[.2,.5,.8],1],['Lower bound',[.2],1],['Lower and upper bounds',[.2,.8],1]],finalLabels:['Lower','Upper']},
    {title:'Build a reliability diagram from counts',kind:'calibration',
      steps:['Assume 3 illustrative confidence groups contain 10 predictions each. Their mean confidences are 0.6, 0.8 and 0.9.',
        'Count correct predictions in each group. The chosen counts are 5, 6 and 7.',
        'Divide each count by 10. Plot observed accuracies 0.5, 0.6 and 0.7 against confidence.',
        'All points lie below equal confidence and accuracy. The displayed weighted absolute gap is approximately 0.167.']},
    {title:'Change confidence with temperature',labels:['A','B','C'],
      steps:['Begin with illustrative model scores 2, 1 and 0. Exponentiate and normalise to obtain probabilities.',
        'At temperature 1, the probabilities are '+calibrated([2,1,0],1).map(function(x){return x.toFixed(3);}).join(', ')+'.',
        'Divide each score by temperature 2 before normalising. The largest class probability decreases.',
        'The new probabilities are '+calibrated([2,1,0],2).map(function(x){return x.toFixed(3);}).join(', ')+'. A stays top-ranked; improved calibration requires held-out evidence.'],
      frames:[['Model scores',[2,1,0],2],['Probability at T = 1',calibrated([2,1,0],1),1],['Scores divided by 2',[1,.5,0],2],['Probability at T = 2',calibrated([2,1,0],2),1]]},
    {title:'Construct a conformal prediction set',kind:'conformal',
      steps:['Use 9 illustrative held-out scores, sorted from 0.05 to 0.9. Each score equals 1 minus the true-label probability.',
        'Allow the correct label to fall outside the set with probability at most α = 0.2. The displayed ceiling calculation gives required rank 8.',
        'The eighth score equals 0.75. Use this value as the inclusion threshold.',
        'New class probabilities 0.5, 0.3 and 0.2 give scores 0.5, 0.7 and 0.8. Include A and B. Assume calibration and test scores are exchangeable. Their joint distribution stays unchanged when their order changes. Then coverage is at least 80%, averaged over calibration and test draws.']},
    {title:'Combine predictions from an ensemble',labels:['Model 1','Model 2','Model 3'],
      steps:['Assume 3 equally weighted models predict class A with probabilities 0.2, 0.5 and 0.8.',
        'Add their probabilities, then divide by 3. The ensemble probability of A equals 0.5.',
        'Average individual binary entropies. The result equals '+((2*entropy([.2,.8])+1)/3).toFixed(3)+' bits.',
        'The ensemble entropy is 1 bit. The difference '+(1-(2*entropy([.2,.8])+1)/3).toFixed(3)+' bits measures disagreement; its reliability still needs evaluation.'],
      frames:[['Probability of A',[.2,.5,.8],1],['Ensemble probabilities',[.5,.5],1],['Individual entropies',[entropy([.2,.8]),1,entropy([.2,.8])],1],['Entropy decomposition',[(2*entropy([.2,.8])+1)/3,1-(2*entropy([.2,.8])+1)/3],1]],finalLabels:['Within models','Disagreement']},
    {title:'Trade answer coverage against observed error',kind:'selection',
      steps:['Begin with 6 illustrative predictions. The confidence scores range from 0.55 to 0.95.',
        'Answer all 6. Two are wrong, so observed error is approximately 0.333 and coverage is 1.',
        'Require confidence at least 0.8. Retain 3 predictions and defer the remaining 3.',
        'All 3 retained predictions are correct in this example. Coverage equals 0.5; observed error is 0. Other datasets can behave differently.']},
    {title:'Compare token uncertainty with factual evidence',labels:['Token A','Token B'],
      steps:['Assume a language model assigns next-token probabilities 0.8 and 0.2.',
        'Calculate expected token surprise. The entropy equals '+entropy([.8,.2]).toFixed(3)+' bits.',
        'For comparison, equal probabilities 0.5 and 0.5 give 1 bit of entropy.',
        'Lower entropy means a more concentrated token distribution. Check a generated claim against evidence separately.'],
      frames:[['Next-token probability',[.8,.2],1],['Weighted surprise',[-.8*Math.log2(.8),-.2*Math.log2(.2)],1],['Equal-token probability',[.5,.5],1],['Token entropy in bits',[entropy([.8,.2]),1],1]],finalLabels:['Concentrated','Equal']}
  ];
  function txt(x,y,s){return '<text x="'+x+'" y="'+y+'">'+s+'</text>';}
  function bars(frame,labels){
    var s=txt(30,28,frame[0]);
    frame[1].forEach(function(v,i){var y=50+i*48;
      s+=txt(30,y+18,labels[i]||'Total')+'<rect x="180" y="'+y+'" width="'+(Math.max(0,v)/frame[2]*260)+'" height="25" />'+txt(450,y+18,v.toFixed(3));});return s;
  }
  function render(m,at){
    if(m.frames){var labels=at===3 && m.finalLabels ? m.finalLabels : m.labels;
      if(m.title==='Calculate expected surprise' && at===3)labels=['Total'];
      if(m.title==='Separate noise from model disagreement' && at===2)labels=['Mixture'];
      if(m.title==='Keep a range of plausible probabilities' && at===2)labels=['Lower'];
      if(m.title==='Combine predictions from an ensemble' && at===1)labels=['Class A','Class B'];
      var drawing=bars(m.frames[at],labels);
      if(m.title==='Combine predictions from an ensemble' && at===2)
        drawing+=txt(30,245,'Mean entropy = '+((2*entropy([.2,.8])+1)/3).toFixed(3)+' bits');
      if(m.title==='Compare token uncertainty with factual evidence' && at===1)
        drawing+=txt(30,200,'Total entropy = '+entropy([.8,.2]).toFixed(3)+' bits');
      return drawing;}
    var s='';
    if(m.kind==='calibration'){
      s='<path class="ue-axis" d="M55 25V230H280"/>'+txt(95,260,'Confidence')+txt(30,233,'0')+txt(255,250,'1')+txt(30,35,'1')+txt(310,35,'Confidence 0.6, 0.8, 0.9');
      if(at>=1)s+=txt(310,70,'Accuracy 5/10, 6/10, 7/10');
      if(at>=2){s+='<path class="ue-reference" d="M55 230L255 30"/>';
        [.6,.8,.9].forEach(function(c,i){var acc=[.5,.6,.7][i];s+='<circle cx="'+(55+200*c)+'" cy="'+(230-200*acc)+'" r="7"/>';});}
      if(at>=3)s+=txt(310,120,'Mean gap ≈ 0.167');
      return s;
    }
    if(m.kind==='conformal'){
      var scores=[.05,.1,.15,.2,.25,.3,.6,.75,.9];
      s=txt(25,30,'Sorted calibration scores');scores.forEach(function(v,i){var x=25+i*55;
        s+='<rect x="'+x+'" y="'+(180-v*120)+'" width="32" height="'+(v*120)+'" class="'+(at>=1&&i===7?'ue-selected':'')+'"/>'+txt(x,205,v.toFixed(2));});
      if(at>=1)s+=txt(25,240,'Rank 8 of 9');if(at>=2)s+=txt(240,240,'Threshold = 0.75');
      if(at>=3)s+=txt(25,285,'New scores 0.5, 0.7, 0.8 → Set {A, B}');return s;
    }
    var confidences=[.95,.9,.8,.7,.6,.55],right=[true,true,true,false,true,false];
    s=txt(25,30,'Illustrative predictions');confidences.forEach(function(c,i){var x=30+i*85;
      s+='<g class="'+(at>=2&&c<.8?'ue-deferred':'')+'"><circle cx="'+(x+15)+'" cy="90" r="17" class="'+(right[i]?'':'ue-error')+'"/>'+txt(x,140,c.toFixed(2));
      if(at>=1)s+=txt(x,180,right[i]?'Right':'Wrong');s+='</g>';});
    if(at>=2)s+=txt(30,225,'Answer when confidence ≥ 0.8');
    if(at>=3)s+=txt(30,270,'Coverage = 0.5; observed error = 0');return s;
  }
  hostPage.querySelectorAll('.syl-module').forEach(function(module,i){
    var m=models[i],section=document.createElement('section');section.className='ue-animation';
    section.setAttribute('aria-label',m.title);
    section.innerHTML='<h3></h3><p class="ue-assumption">This worked example uses chosen numbers to show each calculation.</p>'+ 
      '<div class="ue-chart" tabindex="0" role="region" aria-label="Worked diagram. Scroll sideways if needed."><svg viewBox="0 0 560 310" role="img"></svg></div><p class="uncertainty-equation" style="overflow-x:auto;padding-block:.4rem"></p><div class="ue-narrative"></div>';
    var equation=section.querySelector('.uncertainty-equation');
    if([0,3,5,7].indexOf(i)>=0)window.InterviewDisplayMath.set(equation,'statistics/uncertainty-estimation/'+i);else equation.hidden=true;
    section.querySelector('h3').textContent=m.title;
    var svg=section.querySelector('svg');
    module.querySelector('.syl-viz').insertAdjacentElement('afterend',section);
    window.InterviewNarrative.mount(section.querySelector('.ue-narrative'),{steps:m.steps,draw:function(at){
      svg.innerHTML=render(m,at);svg.setAttribute('aria-label',m.title+'. '+m.steps[at]);
    }});
  });
}());
