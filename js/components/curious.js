(function(){
  'use strict';
  var $=function(s,r){return(r||document).querySelector(s)}, $$=function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))};
  var fill=$('#cq-progress-fill'), rails=$$('.cq-rail a'), parts=rails.map(function(a){return $(a.getAttribute('href'))}).filter(Boolean);
  function onScroll(){var d=document.documentElement, max=d.scrollHeight-innerHeight; if(fill)fill.style.width=(max?d.scrollTop/max*100:0)+'%'; var y=scrollY+180,current=parts[0];parts.forEach(function(p){if(p.offsetTop<=y)current=p});rails.forEach(function(a){a.classList.toggle('is-current',current&&a.hash==='#'+current.id)})}
  addEventListener('scroll',onScroll,{passive:true});onScroll();

  var loop=$$('.cq-loop g[data-loop]'), loopN=0;if(loop.length&&!matchMedia('(prefers-reduced-motion: reduce)').matches){setInterval(function(){loop.forEach(function(g,i){g.classList.toggle('is-on',i===loopN)});loopN=(loopN+1)%loop.length},850)}
  var ladderCopy=[
    ['Start with observation.','“He is angry” is an interpretation. “His answers became shorter and his voice got louder” is something another person could verify.'],
    ['Give the claim a baseline.','“Sales are bad” means little without the plan, last month, competitors, or normal seasonality.'],
    ['Protect yourself from the first story.','A late reply may signal overload, uncertainty, forgetfulness, or low interest. Keep alternatives alive until evidence separates them.'],
    ['Let the belief take a risk.','If price causes churn, discounts should retain some customers. If discounts do nothing, investigate onboarding, value, or fit.'],
    ['Search the negative space.','Who left before complaining? Which data was never collected? Who stays quiet because dissent carries a cost?'],
    ['Create information through action.','Try a small pricing test, short project, or changed condition. Reversible action often teaches faster than debate.']
  ];
  var ladderRead=$('#cq-ladder-read');$$('#cq-ladder button').forEach(function(b){b.addEventListener('click',function(){var n=+b.dataset.step;$$('#cq-ladder button').forEach(function(x){x.classList.toggle('is-active',x===b)});ladderRead.innerHTML='<b>'+ladderCopy[n][0]+'</b><p>'+ladderCopy[n][1]+'</p>'})});
  $$('#cq-inverter button').forEach(function(b){b.addEventListener('click',function(){b.setAttribute('aria-pressed',b.getAttribute('aria-pressed')!=='true')})});

  var hypothesis=$('#cq-hypothesis');$('#cq-build-test').addEventListener('click',function(){var h=hypothesis.value.trim();if(!h){hypothesis.focus();return}$('#cq-expect').textContent='Write one observable result that should follow from this claim: “'+h+'”';$('#cq-falsify').textContent='Look for a result the explanation cannot comfortably explain away.';$('#cq-cheap').textContent='Change one condition, observe one behaviour, or seek one piece of disconfirming evidence.'});
  var zoomCopy={micro:'What did one person do, feel, expect, or avoid?',meso:'Which roles, incentives, relationships, or handoffs shaped the event?',macro:'Which market, institution, history, technology, or cultural norm set the conditions?'};
  $$('#cq-zoom-chart button').forEach(function(b){b.addEventListener('click',function(){$$('#cq-zoom-chart button').forEach(function(x){x.setAttribute('aria-pressed',x===b)});$('#cq-zoom-read').textContent=zoomCopy[b.dataset.zoom]})});

  var domains={
    self:['SELF','Break identity claims into trainable parts.','“I am terrible at networking.”','“Is the hard part initiating, entering a group, remembering names, or following up?”',['What happens immediately before the pattern?','What need am I trying to meet?','Which conditions make this easier?']],
    people:['PEOPLE','Replace the label with conditions.','“She is difficult.”','“When does working together become difficult, and what is she protecting?”',['What seems important to them?','How do they behave under pressure?','What would they consider fair?']],
    work:['WORK','Find the decision behind the task.','“We need to finish this report.”','“Who uses it, which decision does it support, and what happens if we stop?”',['Where does value come from?','What is the bottleneck?','What breaks at ten times the volume?']],
    world:['WORLD','Read the system around the event.','“This is how things are done.”','“Which history, incentive, constraint, or technology made this normal?”',['Who benefits?','Who changes behaviour next?','Which cost is hidden or delayed?']]
  };
  $$('#cq-domains button').forEach(function(b){b.addEventListener('click',function(){var d=domains[b.dataset.domain], stage=$('#cq-domain-stage');$$('#cq-domains button').forEach(function(x){x.setAttribute('aria-pressed',x===b)});stage.innerHTML='<p class="cq-domain-label">'+d[0]+'</p><h3>'+d[1]+'</h3><div class="cq-before-after"><p><span>CLOSED</span>'+d[2]+'</p><p><span>OPEN</span>'+d[3]+'</p></div><div class="cq-prompt-grid">'+d[4].map(function(x){return'<p>'+x+'</p>'}).join('')+'</div>'})});

  var balance=$('#cq-balance');function setBalance(){var v=+balance.value;$('#cq-explore-bar').style.width=v+'%';$('#cq-exploit-bar').style.width=(100-v)+'%';$('#cq-balance-value').textContent=v+' / '+(100-v);var title=v>68?'Fragmentation risk':v<25?'Stagnation risk':'Balanced inquiry';var copy=v>68?'You are opening more loops than you can close. Pick one thread and build.':v<25?'Execution is compounding, but the field may be narrowing. Protect some room for surprise.':'Keep enough range to discover, then stay long enough for the work to compound.';$('#cq-balance-title').textContent=title;$('#cq-balance-text').textContent=copy}balance.addEventListener('input',setBalance);setBalance();
  $$('.cq-stop-choice button').forEach(function(b){b.addEventListener('click',function(){$$('.cq-stop-choice button').forEach(function(x){x.classList.toggle('is-active',x===b)});$('#cq-stop-read').textContent=b.dataset.stop==='yes'?'Keep investigating, but name the missing evidence and set a deadline.':'Act on the best current model. Let the result create the next information.'})});

  var storage='curious-question-queue-v1', queue=[];try{queue=JSON.parse(localStorage.getItem(storage)||'[]')}catch(e){}var list=$('#cq-queue-list');function renderQueue(){if(!queue.length){list.innerHTML='<p class="cq-empty">No questions yet. Add the one that keeps returning.</p>';return}list.innerHTML=queue.map(function(q,i){return'<div class="cq-queue-item"><span>'+q.p+'</span><p>'+q.t.replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})+'</p><button type="button" data-remove="'+i+'" aria-label="Remove question">×</button></div>'}).join('');$$('[data-remove]',list).forEach(function(b){b.addEventListener('click',function(){queue.splice(+b.dataset.remove,1);save()})})}function save(){try{localStorage.setItem(storage,JSON.stringify(queue))}catch(e){}renderQueue()}$('#cq-question-form').addEventListener('submit',function(e){e.preventDefault();var input=$('#cq-question'),t=input.value.trim();if(!t)return;queue.unshift({t:t,p:$('#cq-priority').value});queue=queue.slice(0,20);input.value='';save()});renderQueue();
})();
