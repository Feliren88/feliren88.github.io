(function(){'use strict';
  function all(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s));}
  var bar=document.getElementById('ue-progress-fill');
  if(bar){var busy=false,paint=function(){var h=document.documentElement.scrollHeight-innerHeight;bar.style.width=(h>0?Math.min(100,scrollY/h*100):0)+'%';busy=false;};addEventListener('scroll',function(){if(!busy){busy=true;requestAnimationFrame(paint);}},{passive:true});paint();}
  var loopCopy=['An unknown appears. The mind may treat not knowing as a problem by itself.','Possibility becomes danger before the evidence has changed.','The body and mind demand an answer on the alarm system\'s timetable.','Checking, reviewing, asking again, analysing, or avoiding buys relief.','Relief rewards the move. The next alarm arrives with more authority.'];
  all('#ue-loop button').forEach(function(b){b.addEventListener('click',function(){all('#ue-loop button').forEach(function(x){x.classList.remove('is-on');});b.classList.add('is-on');document.getElementById('ue-loop-read').textContent=loopCopy[+b.dataset.step];});});
  all('#ue-oern button').forEach(function(b){b.addEventListener('click',function(){all('#ue-oern button').forEach(function(x){x.classList.remove('is-on');});b.classList.add('is-on');document.getElementById('ue-oern-read').textContent=b.dataset.copy;});});
  all('#ue-budget button').forEach(function(b){b.addEventListener('click',function(){all('#ue-budget button').forEach(function(x){x.classList.remove('is-on');});b.classList.add('is-on');document.getElementById('ue-budget-read').textContent=b.dataset.answer;});});
  all('#ue-decision button').forEach(function(b){b.addEventListener('click',function(){document.getElementById('ue-decision-out').textContent=b.dataset.decision==='evidence'?'Reconsideration may be rational. Ask whether the new evidence changes the expected outcome.':'Do not reopen the decision automatically. A changed feeling is not a changed fact.';});});
  var route=all('.ue-route span'),groups=[['trap','moves'],['games'],['training','state'],['budget','decisions','practice','support','reset']];
  if(route.length&&'IntersectionObserver' in window){var io=new IntersectionObserver(function(entries){entries.forEach(function(e){if(!e.isIntersecting)return;var ix=groups.findIndex(function(g){return g.indexOf(e.target.id)>-1;});if(ix<0)return;route.forEach(function(s,i){s.classList.toggle('is-current',i===ix);});});},{rootMargin:'-18% 0px -65% 0px'});groups.reduce(function(a,g){return a.concat(g);},[]).forEach(function(id){var el=document.getElementById(id);if(el)io.observe(el);});}

  /* ── Running total, round by round ───────────────────────
     Draws the trade the payoff cards already state: Strategy C pays +5 now
     then −2 in every later round, Strategy U pays −4 now then +8 later. The
     numbers are the card's own, and they show a direction, not a measurement. */
  function rounds(){
    var svg=document.getElementById('ue-rounds'); if(!svg) return;
    var range=document.getElementById('ue-rounds-range');
    var X0=46,X1=500,Y0=16,Y1=186,ZERO=120,N=8;
    function cum(first,rest,k){ return first+rest*(k-1); }
    var vals=[];
    for(var k=1;k<=N;k++) vals.push([cum(5,-2,k),cum(-4,8,k)]);
    var lo=Math.min.apply(null,vals.map(function(v){return Math.min(v[0],v[1]);}));
    var hi=Math.max.apply(null,vals.map(function(v){return Math.max(v[0],v[1]);}));
    function px(k){ return X0+(k-1)/(N-1)*(X1-X0); }
    function py(v){
      var top=Math.max(hi,1), bot=Math.min(lo,-1);
      return v>=0 ? ZERO-(v/top)*(ZERO-Y0) : ZERO+(v/bot)*(Y1-ZERO);
    }
    function path(idx){
      return vals.map(function(v,j){ return (j?'L':'M')+px(j+1).toFixed(1)+' '+py(v[idx]).toFixed(1); }).join('');
    }
    var lc=document.getElementById('ue-line-c'), lu=document.getElementById('ue-line-u');
    if(lc) lc.setAttribute('d',path(0));
    if(lu) lu.setAttribute('d',path(1));
    var labC=document.getElementById('ue-lab-c'), labU=document.getElementById('ue-lab-u');
    if(labC){ labC.setAttribute('x',px(N)); labC.setAttribute('y',py(vals[N-1][0])-10); labC.setAttribute('text-anchor','end'); }
    if(labU){ labU.setAttribute('x',px(N)); labU.setAttribute('y',py(vals[N-1][1])-10); labU.setAttribute('text-anchor','end'); }

    function paint(){
      var k=+range.value, v=vals[k-1];
      var x=px(k);
      var scrub=document.getElementById('ue-rounds-scrub');
      if(scrub){ scrub.setAttribute('x1',x); scrub.setAttribute('x2',x); }
      var dc=document.getElementById('ue-dot-c'), du=document.getElementById('ue-dot-u');
      if(dc){ dc.setAttribute('cx',x); dc.setAttribute('cy',py(v[0])); }
      if(du){ du.setAttribute('cx',x); du.setAttribute('cy',py(v[1])); }
      function fmt(x){ return (x>0?'+':x<0?'−':'')+Math.abs(x); }
      var n=document.getElementById('ue-rounds-n'); if(n) n.textContent=k;
      var c=document.getElementById('ue-rounds-c'); if(c) c.textContent=fmt(v[0]);
      var u=document.getElementById('ue-rounds-u'); if(u) u.textContent=fmt(v[1]);
      var say=document.getElementById('ue-rounds-say');
      if(say){
        say.textContent = v[1]>v[0]
          ? 'By round '+k+' the unresolved line is ahead and keeps climbing.'
          : (k===1 ? 'Round one is the only round where resolving looks better.'
                   : 'Still ahead for now. The lines cross once the later rounds arrive.');
      }
    }
    if(range){ range.addEventListener('input',paint); paint(); }
  }

  /* ── Where the lines cross ───────────────────────────────
     Value of more information falls as you gather; the cost of delay rises.
     The crossing is the decision point the inequality below already names. */
  function voi(){
    var svg=document.getElementById('ue-voi'); if(!svg) return;
    var X0=46,X1=500,Y0=22,Y1=180;
    function px(t){ return X0+t*(X1-X0); }
    function py(v){ return Y1-v*(Y1-Y0); }
    function info(t){ return Math.exp(-2.6*t); }
    function cost(t){ return 0.06+0.9*t*t; }   /* peaks below the top of the plot */
    function d(fn){
      var out='';
      for(var i=0;i<=60;i++){ var t=i/60; out+=(i?'L':'M')+px(t).toFixed(1)+' '+py(fn(t)).toFixed(1); }
      return out;
    }
    var a=document.getElementById('ue-voi-info'), b=document.getElementById('ue-voi-cost');
    if(a) a.setAttribute('d',d(info));
    if(b) b.setAttribute('d',d(cost));
    var lo=0,hi=1;
    for(var s=0;s<60;s++){ var m=(lo+hi)/2; if(info(m)>cost(m)) lo=m; else hi=m; }
    var t=(lo+hi)/2, cx=px(t), cy=py(info(t));
    var line=document.getElementById('ue-voi-cross');
    if(line){ line.setAttribute('x1',cx); line.setAttribute('x2',cx); line.setAttribute('y1',Y0); line.setAttribute('y2',Y1); }
    var dot=document.getElementById('ue-voi-dot');
    if(dot){ dot.setAttribute('cx',cx); dot.setAttribute('cy',cy); }
    var dec=document.getElementById('ue-voi-decide');
    if(dec){ dec.setAttribute('x',cx+8); dec.setAttribute('y',Y0+14); }
    var li=document.getElementById('ue-voi-lab-i');
    if(li){ li.setAttribute('x',px(0.06)); li.setAttribute('y',py(info(0.06))-10); }
    var lc=document.getElementById('ue-voi-lab-c');
    if(lc){ lc.setAttribute('x',px(0.96)); lc.setAttribute('y',py(cost(0.96))-10); lc.setAttribute('text-anchor','end'); }
  }

  /* ── Two small trackers ──────────────────────────────────
     Both are local storage only, and both count behaviour rather than mood,
     which is the measure this page keeps pointing at. */
  function tracker(sel, btnSel, key, numId, fillId, resetId, onClass){
    var rows=all(sel); if(!rows.length) return;
    var num=document.getElementById(numId), fill=document.getElementById(fillId),
        reset=document.getElementById(resetId), state={};
    try{ state=JSON.parse(localStorage.getItem(key)||'{}')||{}; }catch(e){ state={}; }
    function paint(){
      var n=0;
      rows.forEach(function(row,idx){
        var on=!!state[idx];
        row.classList.toggle(onClass,on);
        var b=row.querySelector(btnSel);
        if(b) b.setAttribute('aria-pressed',on?'true':'false');
        if(on) n++;
      });
      if(num) num.textContent=n;
      if(fill) fill.style.width=(n/rows.length*100)+'%';
      try{ localStorage.setItem(key,JSON.stringify(state)); }catch(e){}
    }
    rows.forEach(function(row,idx){
      var b=row.querySelector(btnSel); if(!b) return;
      b.addEventListener('click',function(){
        if(state[idx]) delete state[idx]; else state[idx]=1;
        paint();
      });
    });
    if(reset) reset.addEventListener('click',function(){ state={}; paint(); });
    paint();
  }

  /* Protocol steps become tickable without touching their copy. */
  function protocolTicks(){
    all('.ue-protocol li[data-step]').forEach(function(li){
      if(li.querySelector('.ue-step-tick')) return;
      var b=document.createElement('button');
      b.type='button'; b.className='ue-step-tick'; b.setAttribute('aria-pressed','false');
      b.setAttribute('aria-label','Mark step '+li.dataset.step+' as run');
      b.innerHTML='<svg class="ue-i"><use href="#ue-check"/></svg>';
      li.appendChild(b);
    });
    tracker('.ue-protocol li[data-step]','.ue-step-tick','ue:steps','ue-step-n','ue-step-fill','ue-step-reset','is-run');
  }

  function rungTicks(){
    tracker('.ue-rung','.ue-rung-tick','ue:rungs','ue-rung-n','ue-rung-fill','ue-rung-reset','is-held');
  }

  [rounds,voi,protocolTicks,rungTicks].forEach(function(fn){
    try{ fn(); }catch(e){ /* one widget must not take the page down */ }
  });

})();
