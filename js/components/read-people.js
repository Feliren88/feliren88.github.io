(function(){
  var $=function(s,r){return (r||document).querySelector(s)}, $$=function(s,r){return Array.from((r||document).querySelectorAll(s))};
  var evidence=[
    ['Level 1 · weakest','One gesture can mean many things. Record it without naming a cause.'],
    ['Level 2 · tentative','Several changes pointing together justify a working hypothesis.'],
    ['Level 3 · useful','A change from this person’s normal behaviour deserves attention.'],
    ['Level 4 · strong','The same pattern across topics or settings supports a trait-level reading.'],
    ['Level 5 · strongest','Watch what happens when honesty, loyalty, competence, or courage costs something.']
  ];
  $$('.rp-evidence-scale button').forEach(function(b){b.addEventListener('click',function(){var n=+b.dataset.level-1;$$('.rp-evidence-scale button').forEach(function(x){x.classList.remove('is-on')});b.classList.add('is-on');$('#rp-evidence-read').innerHTML='<span>'+evidence[n][0]+'</span><p>'+evidence[n][1]+'</p>'})});
  var probs={a:34,b:33,c:33}, updates={reschedule:[18,67,15],vague:[44,12,44],pressure:[8,86,6],reset:[34,33,33]};
  function probability(k){var v=updates[k];['a','b','c'].forEach(function(x,i){$('#rp-h'+x).textContent=v[i]+'%';$('#rp-b'+x).style.width=v[i]+'%'});probs={a:v[0],b:v[1],c:v[2]}}
  $$('.rp-evidence-buttons button').forEach(function(b){b.addEventListener('click',function(){probability(b.dataset.evidence)})});probability('reset');
  var states={
    power:['Power lowers the cost of showing existing tendencies.',['shares credit','protects juniors','accepts dissent','owns failure','uses discretion']],
    stress:['Pressure exposes how someone usually regulates themselves.',['controls','withdraws','blames','collaborates','becomes more precise']],
    failure:['Failure shows how someone protects their ego and whether they learn.',['denies','repairs','asks for feedback','changes method','updates without collapse']],
    success:['Success changes status and options. Watch what follows.',['shares credit','rewards support','inflates risk','forgets contributors','becomes generous']],
    boundary:['A polite no exposes assumptions about entitlement.',['accepts','pressures','guilts','punishes','keeps negotiating']]
  };
  function showState(k){var d=states[k];$('#rp-state-panel').innerHTML='<h3>'+d[0]+'</h3><p>Observe the pattern. One reaction remains a clue, not a verdict.</p><ul>'+d[1].map(function(x){return '<li>'+x+'</li>'}).join('')+'</ul>'}
  $$('.rp-state-tabs button').forEach(function(b){b.addEventListener('click',function(){$$('.rp-state-tabs button').forEach(function(x){x.setAttribute('aria-selected','false')});b.setAttribute('aria-selected','true');showState(b.dataset.state)})});showState('power');
  var room={formal:'A holds the title. Titles do not guarantee real influence.',expert:'B gets attention when technical uncertainty appears.',informal:'The room checks C before it reacts. C has informal approval power.',connector:'D repairs tension and carries information between groups.',performer:'E draws attention, though attention and authority are different.'};
  $$('.rp-room button').forEach(function(b){b.addEventListener('click',function(){$$('.rp-room button').forEach(function(x){x.classList.remove('is-on')});b.classList.add('is-on');$('#rp-room-read').textContent=room[b.dataset.role]})});$$('.rp-room button')[2].classList.add('is-on');
  var stakes=$('#rp-stakes'), stakeCopy=['A casual conversation can rest on light evidence.','A small commitment needs one clean follow-through.','Meaningful responsibility needs repeated evidence across contexts.','A close relationship needs evidence through stress, repair, and boundaries.','Control of major assets needs long observation and independent checks.'];
  function setStake(){var n=+stakes.value;$('#rp-threshold-fill').style.width=(n*20)+'%';$('#rp-threshold-copy').textContent=stakeCopy[n-1]} stakes.addEventListener('input',setStake);setStake();
  var fields=$$('.rp-journal textarea');fields.forEach(function(f,i){var key='rp:journal:'+i;try{f.value=localStorage.getItem(key)||''}catch(e){}f.addEventListener('input',function(){try{localStorage.setItem(key,f.value)}catch(e){}})});
  var confidence=$('.rp-journal input[type=range]'), output=$('.rp-journal output');confidence.addEventListener('input',function(){output.value=confidence.value+'%'});
  var refSearch=$('#rp-ref-search'), refFilter='all', refCards=$$('.rp-ref-grid details');
  function filterReference(){var q=(refSearch.value||'').trim().toLowerCase(),visible=0;refCards.forEach(function(card){var tags=card.dataset.tags||'',text=card.textContent.toLowerCase(),show=(refFilter==='all'||tags.split(' ').indexOf(refFilter)>-1)&&(!q||text.indexOf(q)>-1);card.hidden=!show;if(show)visible++});$('#rp-ref-count').textContent=visible}
  refSearch.addEventListener('input',filterReference);$$('.rp-ref-filters button').forEach(function(b){b.addEventListener('click',function(){$$('.rp-ref-filters button').forEach(function(x){x.classList.remove('is-on')});b.classList.add('is-on');refFilter=b.dataset.refFilter;filterReference()})});filterReference();
  function progress(){var h=document.documentElement, max=h.scrollHeight-h.clientHeight, pct=max?100*h.scrollTop/max:0;$('#rp-progress-fill').style.width=pct+'%';var y=h.scrollTop+150,current='observe';$$('.rp-part,.rp-hero').forEach(function(s){if(s.offsetTop<=y)current=s.id});$$('.rp-rail a').forEach(function(a){a.classList.toggle('is-current',a.getAttribute('href')==='#'+current)})}
  document.addEventListener('scroll',progress,{passive:true});progress();
})();
