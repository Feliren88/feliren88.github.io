(function(){
  var $=function(s,r){return (r||document).querySelector(s)}, $$=function(s,r){return Array.from((r||document).querySelectorAll(s))};
  var evidence=[
    ['Level 1 · weakest','One gesture can mean many things. Record it without naming a cause.'],
    ['Level 2 · possible','Several changes pointing the same way support a first explanation.'],
    ['Level 3 · useful','A change from this person’s usual behaviour deserves attention.'],
    ['Level 4 · strong','The same pattern across topics or settings may reveal part of their character.'],
    ['Level 5 · strongest','Watch what happens when honesty, loyalty, competence, or courage costs something.']
  ];
  $$('.rp-evidence-scale button').forEach(function(b){b.addEventListener('click',function(){var n=+b.dataset.level-1;$$('.rp-evidence-scale button').forEach(function(x){x.classList.remove('is-on')});b.classList.add('is-on');$('#rp-evidence-read').innerHTML='<span>'+evidence[n][0]+'</span><p>'+evidence[n][1]+'</p>'})});
  var probs={a:34,b:33,c:33}, updates={reschedule:[18,67,15],vague:[44,12,44],pressure:[8,86,6],reset:[34,33,33]};
  function probability(k){var v=updates[k];['a','b','c'].forEach(function(x,i){$('#rp-h'+x).textContent=v[i]+'%';$('#rp-b'+x).style.width=v[i]+'%'});probs={a:v[0],b:v[1],c:v[2]}}
  $$('.rp-evidence-buttons button').forEach(function(b){b.addEventListener('click',function(){probability(b.dataset.evidence)})});probability('reset');
  var states={
    power:['Power makes it easier to show habits that were already there.',['shares credit','protects junior staff','accepts disagreement','owns failure','handles private information with care']],
    stress:['Pressure shows how someone usually copes.',['controls','withdraws','blames','works with others','becomes more precise']],
    failure:['Failure shows how someone protects their pride and whether they learn.',['denies','repairs','asks for feedback','changes method','changes their mind without falling apart']],
    success:['Success changes status and options. Watch what follows.',['shares credit','rewards support','inflates risk','forgets contributors','becomes generous']],
    boundary:['A polite no shows whether someone feels entitled to your yes.',['accepts','pressures','uses guilt','punishes','keeps negotiating']]
  };
  function showState(k){var d=states[k];$('#rp-state-panel').innerHTML='<h3>'+d[0]+'</h3><p>Observe the pattern. One reaction remains a clue, not a verdict.</p><ul>'+d[1].map(function(x){return '<li>'+x+'</li>'}).join('')+'</ul>'}
  $$('.rp-state-tabs button').forEach(function(b){b.addEventListener('click',function(){$$('.rp-state-tabs button').forEach(function(x){x.setAttribute('aria-selected','false')});b.setAttribute('aria-selected','true');showState(b.dataset.state)})});showState('power');
  var room={formal:'A holds the title. A title does not guarantee real influence.',expert:'People turn to B when they are unsure about a technical issue.',informal:'The room checks C before it reacts. C has influence without a formal title.',connector:'D eases tension and carries information between groups.',performer:'E draws attention, but attention is not the same as authority.'};
  $$('.rp-room button').forEach(function(b){b.addEventListener('click',function(){$$('.rp-room button').forEach(function(x){x.classList.remove('is-on')});b.classList.add('is-on');$('#rp-room-read').textContent=room[b.dataset.role]})});$$('.rp-room button')[2].classList.add('is-on');
  var stakes=$('#rp-stakes'), stakeCopy=['A casual conversation can rest on light evidence.','A small commitment needs one clean follow-through.','Meaningful responsibility needs repeated evidence across contexts.','A close relationship needs evidence through stress, repair, and boundaries.','Control of major assets needs long observation and independent checks.'];
  function setStake(){var n=+stakes.value;$('#rp-threshold-fill').style.width=(n*20)+'%';$('#rp-threshold-copy').textContent=stakeCopy[n-1]} stakes.addEventListener('input',setStake);setStake();
  var fields=$$('.rp-journal textarea');fields.forEach(function(f,i){var key='rp:journal:'+i;try{f.value=localStorage.getItem(key)||''}catch(e){}f.addEventListener('input',function(){try{localStorage.setItem(key,f.value)}catch(e){}})});
  var confidence=$('.rp-journal input[type=range]'), output=$('.rp-journal output');confidence.addEventListener('input',function(){output.value=confidence.value+'%'});
  var refSearch=$('#rp-ref-search'), refFilter='all', refCards=$$('.rp-ref-grid details');
  var refVizTypes=('facets model ladder baseline context actions pull shield spotlight compare target loss balance signals face gaze voice pause pronouns detail '+
    'audiences hierarchy pressure repair success apology boundary exchange curiosity gossip humour status proof calm care trust judgement climb loyalty integrity '+
    'trap praise rush bond followup bargain leader team room gaze proximity silence mismatch question verify update fork fork state capacity impact ownership levels observe baseline predict journal motives question story history group contexts bias feedback sequence drill screen interview bargain child mirror empathy perspective game record partner forecast decision stakes ladder systems hunch caution structure compassion sequence dimensions predict unknown').split(' ');
  var vizFamilies={
    facets:'nodes',model:'nodes',context:'orbit',audiences:'people',team:'people',room:'people',group:'people',dimensions:'nodes',
    ladder:'steps',hierarchy:'steps',climb:'steps',levels:'steps',stakes:'steps',
    baseline:'chart',pressure:'chart',forecast:'chart',predict:'chart',update:'chart',feedback:'chart',
    actions:'compare',compare:'compare',balance:'compare',proof:'compare',judgement:'compare',capacity:'compare',impact:'compare',mismatch:'compare',state:'compare',
    pull:'target',spotlight:'target',target:'target',detail:'target',focus:'target',motives:'target',
    shield:'boundary',loss:'boundary',boundary:'boundary',trust:'boundary',integrity:'boundary',caution:'boundary',
    signals:'wave',voice:'wave',pause:'wave',silence:'wave',hunch:'wave',
    face:'person',gaze:'person',status:'person',calm:'person',leader:'person',child:'person',mirror:'person',empathy:'person',perspective:'person',
    pronouns:'speech',question:'speech',story:'speech',gossip:'speech',humour:'speech',praise:'speech',interview:'speech',
    exchange:'exchange',care:'exchange',loyalty:'exchange',bond:'exchange',followup:'exchange',partner:'exchange',compassion:'exchange',
    repair:'path',success:'path',apology:'path',rush:'path',sequence:'path',drill:'path',history:'path',record:'path',
    curiosity:'fork',fork:'fork',verify:'fork',bias:'fork',decision:'fork',unknown:'fork',
    trap:'tangle',ownership:'tangle',systems:'tangle',structure:'tangle',
    bargain:'arrows',game:'arrows',manipulation:'arrows',flattery:'arrows',
    screen:'frame',observe:'frame',journal:'frame',contexts:'frame',program:'frame'
  };
  function refViz(type,n){
    var family=vizFamilies[type]||type, a=n%3, common='viewBox="0 0 144 64" aria-hidden="true" focusable="false"';
    var seed=(n+1)*7919, points=[];for(var j=0;j<6;j++){seed=(seed*48271)%2147483647;points.push((18+j*22)+','+(53-(seed%9)))}
    var signature='<polyline class="signature" points="'+points.join(' ')+'"/><circle class="signature-dot" cx="'+(18+(n%6)*22)+'" cy="'+(53-(seed%9))+'" r="2.5"/>';
    var svg={
      nodes:'<circle cx="25" cy="32" r="8"/><circle class="hot" cx="72" cy="16" r="6"/><circle class="cool" cx="113" cy="37" r="9"/><path d="M33 30 66 18M78 19l27 15M34 35l70 2"/>',
      orbit:'<circle cx="72" cy="32" r="9"/><ellipse class="dash" cx="72" cy="32" rx="49" ry="22"/><circle class="hot fill" cx="'+(27+a*5)+'" cy="32" r="4"/><circle class="cool fill" cx="114" cy="21" r="4"/>',
      people:'<circle cx="72" cy="15" r="6"/><path d="M62 49V31q0-9 10-9t10 9v18M23 46V35q0-7 7-7t7 7v11M107 46V35q0-7 7-7t7 7v11"/><path class="dash" d="M38 35 61 28M83 28l23 7"/>',
      steps:'<path d="M18 51h27V39h27V27h27V15h27"/><circle class="hot fill" cx="'+(45+a*27)+'" cy="'+(39-a*12)+'" r="5"/>',
      chart:'<path d="M16 49h113M24 16v33"/><path class="cool" d="m25 42 25-3 22-15 24 6 27-17"/><path class="dash" d="M72 12v39"/><circle class="hot fill" cx="72" cy="24" r="4"/>',
      compare:'<circle cx="39" cy="31" r="18"/><circle class="cool" cx="105" cy="31" r="18"/><path class="hot" d="M58 31h28"/><circle class="hot fill" cx="72" cy="31" r="4"/>',
      target:'<circle cx="72" cy="32" r="23"/><circle cx="72" cy="32" r="12"/><circle class="hot fill" cx="72" cy="32" r="4"/><path class="cool" d="m18 49 31-12"/>',
      boundary:'<circle cx="45" cy="32" r="9"/><circle class="cool" cx="105" cy="32" r="9"/><path class="hot" d="M72 10v44"/><path class="dash" d="M55 32h10M79 32h16"/>',
      wave:'<path d="M14 32h18l7-14 12 30 13-25 12 18 10-9h44"/><circle class="hot fill" cx="'+(51+a*13)+'" cy="'+(48-a*7)+'" r="4"/>',
      person:'<circle cx="72" cy="16" r="8"/><path d="M57 53V35q0-11 15-11t15 11v18"/><path class="cool" d="M18 31h27M99 31h27"/><circle class="hot fill" cx="'+(30+a*42)+'" cy="31" r="4"/>',
      speech:'<path d="M20 13h78q13 0 13 13t-13 13H62L48 52V39H20Q7 39 7 26t13-13Z"/><circle class="hot fill" cx="39" cy="26" r="3"/><circle cx="58" cy="26" r="3"/><circle class="cool fill" cx="77" cy="26" r="3"/>',
      exchange:'<circle cx="27" cy="32" r="9"/><circle cx="117" cy="32" r="9"/><path class="hot" d="m41 23 23-9 8 5M103 41l-23 9-8-5"/><path class="cool" d="M42 32h60"/>',
      path:'<circle cx="18" cy="42" r="5"/><circle class="hot fill" cx="126" cy="18" r="5"/><path class="cool" d="M23 42c25 0 18-25 43-25s23 30 55 3"/><path class="dash" d="M23 51h98"/>',
      fork:'<path d="M18 32h35M53 32c20 0 14-18 34-18h38M53 32c20 0 14 18 34 18h38"/><circle class="hot fill" cx="53" cy="32" r="4"/><circle class="cool fill" cx="125" cy="14" r="4"/>',
      tangle:'<circle cx="35" cy="32" r="9"/><path class="hot" d="M49 32c12-25 39 25 51 0s31 8 13 18M49 32c17 17 30-20 48 0"/><circle class="cool" cx="121" cy="32" r="9"/>',
      arrows:'<circle cx="32" cy="32" r="9"/><circle cx="112" cy="32" r="9"/><path class="hot" d="m47 23 42-10 9 5M97 43 55 53l-9-5"/><path class="dash" d="M47 32h50"/>',
      frame:'<rect x="19" y="10" width="106" height="44" rx="5"/><circle cx="50" cy="32" r="7"/><circle class="hot fill" cx="76" cy="24" r="4"/><circle class="cool fill" cx="99" cy="39" r="5"/><path class="dash" d="M33 46 110 17"/>'
    }[family];
    return '<span class="rp-ref-viz" data-viz="'+type+'-'+(n+1)+'"><svg '+common+'>'+svg+signature+'</svg></span>';
  }
  refCards.forEach(function(card,i){var summary=$('summary',card),title=$('summary span',card),type=refVizTypes[i]||'unknown';summary.insertAdjacentHTML('afterbegin',refViz(type,i));card.dataset.viz=type+'-'+(i+1);if(title)summary.setAttribute('aria-label',(i+1)+'. '+title.textContent)});
  function filterReference(){var q=(refSearch.value||'').trim().toLowerCase(),visible=0;refCards.forEach(function(card){var tags=card.dataset.tags||'',text=card.textContent.toLowerCase(),show=(refFilter==='all'||tags.split(' ').indexOf(refFilter)>-1)&&(!q||text.indexOf(q)>-1);card.hidden=!show;if(show)visible++});$('#rp-ref-count').textContent=visible}
  refSearch.addEventListener('input',filterReference);$$('.rp-ref-filters button').forEach(function(b){b.addEventListener('click',function(){$$('.rp-ref-filters button').forEach(function(x){x.classList.remove('is-on')});b.classList.add('is-on');refFilter=b.dataset.refFilter;filterReference()})});filterReference();
  function progress(){var h=document.documentElement, max=h.scrollHeight-h.clientHeight, pct=max?100*h.scrollTop/max:0;$('#rp-progress-fill').style.width=pct+'%';var y=h.scrollTop+150,current='observe';$$('.rp-part,.rp-hero').forEach(function(s){if(s.offsetTop<=y)current=s.id});$$('.rp-rail a').forEach(function(a){a.classList.toggle('is-current',a.getAttribute('href')==='#'+current)})}
  document.addEventListener('scroll',progress,{passive:true});progress();
})();
