(function(){'use strict';
  function all(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s));}
  function esc(s){return String(s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
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


  /* ── What the feeling does when it is not acted on ───────
     Two shapes over the same axis. Acting on the urge cuts the curve short
     and the next arrival starts higher. Staying with it lets one wave finish.
     The curves show a direction, not measured values. */
  function curveViz(){
    var svg=document.getElementById('ue-curve'); if(!svg) return;
    var range=document.getElementById('ue-curve-range');
    var modes=document.getElementById('ue-curve-modes');
    var X0=46,X1=502,YT=22,YB=188;
    var mode='relieve';
    function px(t){ return X0+t*(X1-X0); }
    function py(v){ return YB-v*(YB-YT); }

    /* three arrivals, each cut off by the relief move and starting higher */
    function relieve(t){
      var seg=[[0,0.30,0.72],[0.34,0.64,0.86],[0.68,1.0,0.97]];
      for(var k=0;k<seg.length;k++){
        var a=seg[k][0], b=seg[k][1], peak=seg[k][2];
        if(t>=a&&t<=b){
          var u=(t-a)/(b-a);
          return u<0.72 ? peak*Math.pow(u/0.72,0.75) : peak*(1-(u-0.72)/0.28)*0.9;
        }
      }
      return 0.05;
    }
    /* one arrival: rises, peaks, and comes down without being solved */
    function stay(t){
      return 0.95*Math.exp(-Math.pow((t-0.26)/0.20,2))
           + 0.30*Math.exp(-Math.pow((t-0.62)/0.26,2))
           + 0.04;
    }
    function fn(t){ return Math.min(1,(mode==='relieve'?relieve(t):stay(t))); }

    function d(){
      var out='';
      for(var i=0;i<=180;i++){ var t=i/180; out+=(i?'L':'M')+px(t).toFixed(1)+' '+py(fn(t)).toFixed(1); }
      return out;
    }
    var line=document.getElementById('ue-curve-line');
    var band=document.getElementById('ue-curve-band');
    var marks=document.getElementById('ue-curve-marks');

    function redraw(){
      if(line) line.setAttribute('d',d());
      if(band) band.setAttribute('d',d()+'L'+px(1).toFixed(1)+' '+YB+'L'+X0+' '+YB+'Z');
      if(marks){
        marks.innerHTML='';
        if(mode==='relieve'){
          [0.30,0.64].forEach(function(t){
            marks.innerHTML+='<line class="cut" x1="'+px(t).toFixed(1)+'" y1="'+YT+'" x2="'+px(t).toFixed(1)+'" y2="'+YB+'"/>'
              +'<text class="cutlab" x="'+(px(t)+5).toFixed(1)+'" y="'+(YT+12)+'">relief move</text>';
          });
        }
      }
      paint();
    }

    function paint(){
      var t=+range.value/100, v=fn(t), x=px(t);
      var scrub=document.getElementById('ue-curve-scrub');
      if(scrub){ scrub.setAttribute('x1',x); scrub.setAttribute('x2',x); }
      var dot=document.getElementById('ue-curve-dot');
      if(dot){ dot.setAttribute('cx',x); dot.setAttribute('cy',py(v)); }
      var el=document.getElementById('ue-curve-t');
      if(el) el.textContent=Math.round(t*40)+' min';
      var lv=document.getElementById('ue-curve-v');
      if(lv) lv.textContent = v>0.75?'near the peak':v>0.45?'high':v>0.2?'settling':'low';
      var say=document.getElementById('ue-curve-say');
      if(say){
        say.textContent = mode==='relieve'
          ? 'Each relief move ends that wave early. The next one starts higher, and the gap between them gets shorter.'
          : 'One wave, allowed to finish. Nothing was solved and it came down anyway. The relief move ends the wave before you get to see that.';
      }
    }

    if(modes){
      modes.addEventListener('click',function(e){
        var b=e.target.closest('button[data-mode]'); if(!b) return;
        mode=b.dataset.mode;
        all('#ue-curve-modes button').forEach(function(x){ x.classList.toggle('is-on',x===b); });
        svg.dataset.mode=mode;
        redraw();
      });
    }
    if(range) range.addEventListener('input',paint);
    svg.dataset.mode=mode;
    redraw();
  }

  /* ── The wheel ───────────────────────────────────────────
     Three rings drawn from _data/emotion_wheel.yml. Selecting any segment
     shows that family's three parts: what it points at, what it urges, and
     one action that does not wait for the feeling to stop. */
  /* ── The wheel, in two views ─────────────────────────────
     Both come from published work and neither is a summary of the other.

     Categories: the 27 emotion categories Cowen and Keltner recovered from
     self-report, drawn as one ring. Their finding is that the categories are
     bridged by continuous gradients, so the ring is coloured as a sweep rather
     than as blocks, and neighbours are seated to follow the gradients the paper
     names wherever a circle allows it.

     Axes: the Geneva Emotion Wheel, twenty families placed by valence across
     and control up, cutting four quadrants.

     `def` lines describe each term. `urge` and `counter` are this page's own
     frame, and the panel labels them so. */
  function wheel(){
    var host=document.getElementById('ue-wheel'); if(!host) return;
    var el=document.getElementById('ue-wheel-data'); if(!el) return;
    var DATA; try{ DATA=JSON.parse(el.textContent); }catch(e){ return; }
    var cats=(DATA&&DATA.categories)||[];
    var gew=(DATA&&DATA.gew)||null;
    if(!cats.length) return;

    var read=document.getElementById('ue-wheel-read');
    var NS='http://www.w3.org/2000/svg';
    var CX=319,CY=319,TAU=Math.PI*2;
    var fitQueue=[];
    var view='cats';

    function pt(r,a){ return [CX+r*Math.cos(a), CY+r*Math.sin(a)]; }
    function arc(r0,r1,a0,a1){
      var p0=pt(r1,a0),p1=pt(r1,a1),p2=pt(r0,a1),p3=pt(r0,a0);
      var big=(a1-a0)>Math.PI?1:0;
      return 'M'+p0[0].toFixed(2)+' '+p0[1].toFixed(2)+
             'A'+r1+' '+r1+' 0 '+big+' 1 '+p1[0].toFixed(2)+' '+p1[1].toFixed(2)+
             'L'+p2[0].toFixed(2)+' '+p2[1].toFixed(2)+
             'A'+r0+' '+r0+' 0 '+big+' 0 '+p3[0].toFixed(2)+' '+p3[1].toFixed(2)+'Z';
    }
    function mk(name,attrs,text){
      var e=document.createElementNS(NS,name);
      Object.keys(attrs).forEach(function(k){ e.setAttribute(k,attrs[k]); });
      if(text!=null) e.textContent=text;
      return e;
    }

    /* A wedge is widest across its arc and deepest along its radius. Radial
       labels take the depth; the rotation decides which way the glyphs run, so
       both halves anchor at "start" and read into the band. */
    function label(txt,r,a,cls,size,room){
      var p=pt(r,a), deg=((a*180/Math.PI)%360+360)%360, flip=(deg>90&&deg<270);
      var t=mk('text',{x:p[0].toFixed(1),y:p[1].toFixed(1),class:cls,
        'text-anchor':'start','dominant-baseline':'middle','font-size':size,
        transform:'rotate('+(flip?deg+180:deg).toFixed(1)+' '+p[0].toFixed(1)+' '+p[1].toFixed(1)+')'}, txt);
      t.dataset.room=room.toFixed(1); t.dataset.size=size;
      fitQueue.push(t);
      return t;
    }
    function radialR(r0,r1,a){
      var deg=((a*180/Math.PI)%360+360)%360;
      return (deg>90&&deg<270) ? r1-6 : r0+6;
    }
    /* Guessed font metrics are what put words outside their bands before. Ask
       the browser: measure, shrink to fit, and condense only as a last resort. */
    function fitLabels(){
      fitQueue.forEach(function(t){
        var room=+t.dataset.room, size=+t.dataset.size, w;
        try{ w=t.getComputedTextLength(); }catch(e){ return; }
        if(!w||w<=room) return;
        t.setAttribute('font-size',Math.max(size*0.7,size*room/w).toFixed(2));
        try{ w=t.getComputedTextLength(); }catch(e){ return; }
        if(w>room){ t.setAttribute('textLength',room.toFixed(1)); t.setAttribute('lengthAdjust','spacingAndGlyphs'); }
      });
      fitQueue.length=0;
    }

    var hubT,hubS;
    function hub(r,title,sub){
      var g=mk('g',{class:'ue-hub'});
      g.appendChild(mk('circle',{cx:CX,cy:CY,r:r,class:'ue-hub-c'}));
      hubT=mk('text',{x:CX,y:CY-6,class:'ue-hub-t','text-anchor':'middle','font-size':20});
      hubT.textContent=title;
      hubS=mk('text',{x:CX,y:CY+16,class:'ue-hub-s','text-anchor':'middle','font-size':12});
      hubS.textContent=sub;
      g.appendChild(hubT); g.appendChild(hubS);
      host.appendChild(g);
    }

    function panel(d){
      if(!read) return;
      read.innerHTML=
        '<p class="ue-wheel-word" style="--h:'+(d.hue||200)+'">'+esc(d.name)+
          '<span>'+esc(d.trail)+'</span></p>'+
        '<p class="ue-wheel-def">'+esc(d.def||'')+'</p>'+
        (d.urge||d.counter ?
          '<dl class="ue-wheel-parts">'+
            (d.urge?'<div><dt>What it urges</dt><dd>'+esc(d.urge)+'</dd></div>':'')+
            (d.counter?'<div class="do"><dt>One action that does not wait for it to stop</dt><dd>'+esc(d.counter)+'</dd></div>':'')+
          '</dl>'+
          '<p class="ue-wheel-scope">The definition is the researchers’ category. These two lines are this page’s own reading, not a finding.</p>'
          : '')+
        (d.near&&d.near.length ?
          '<p class="ue-wheel-near">The study reports a smooth gradient between this and '+
            esc(d.near.join(', '))+'.</p>' : '');
    }
    function clearPanel(hint){
      if(read) read.innerHTML='<p class="ue-wheel-hint"><svg class="ue-i"><use href="#ue-eye"/></svg> '+hint+'</p>';
      if(hubT){ hubT.textContent='Which one?'; hubS.textContent='pick a word'; }
      Array.prototype.slice.call(host.querySelectorAll('.ue-seg')).forEach(function(x){ x.classList.remove('is-on'); });
    }

    function select(p,d){
      Array.prototype.slice.call(host.querySelectorAll('.ue-seg')).forEach(function(x){ x.classList.remove('is-on'); });
      p.classList.add('is-on');
      if(hubT){ hubT.textContent=d.name; hubS.textContent=d.trail; }
      panel(d);
    }

    /* ── View one: the 27 categories ── */
    function buildCats(){
      /* Band depth is set by the longest name, "Aesthetic appreciation". */
      var R0=132,R1=312, n=cats.length, seg=TAU/n, start=-Math.PI/2-seg/2;
      cats.forEach(function(c,i){
        var a0=start+i*seg, a1=a0+seg;
        var hue=Math.round((200+i*(330/n))%360);
        var p=mk('path',{d:arc(R0,R1,a0,a1),class:'ue-seg ue-seg-cat',style:'--h:'+hue,
          tabindex:'0',role:'button','aria-label':c.name+'. '+(c.def||'')});
        var d={name:c.name,trail:'category '+(i+1)+' of '+n,def:c.def,urge:c.urge,
               counter:c.counter,near:c.near||[],hue:hue};
        p.addEventListener('click',function(){ select(p,d); });
        p.addEventListener('keydown',function(e){
          if(e.key==='Enter'||e.key===' '){ e.preventDefault(); select(p,d); }
        });
        host.appendChild(p);
        host.appendChild(label(c.name,radialR(R0,R1,(a0+a1)/2),(a0+a1)/2,'ue-wt ue-wt-cat',12,R1-R0-14));
      });
      hub(R0-8,'Which one?','pick a word');
    }

    /* ── View two: valence across, control up ── */
    function buildAxes(){
      if(!gew) return;
      var R0=120,R1=300, fams=gew.families||[], n=fams.length, seg=TAU/n;
      var QH={ph:44,pl:150,nl:214,nh:8};
      /* The instrument's own spoke order: down the right from just past the top,
         then on round and up the left. */
      var start=-Math.PI/2+seg/2;

      /* quadrant backing, drawn first so the spokes sit over it */
      [['ph',-Math.PI/2,0],['pl',0,Math.PI/2],['nl',Math.PI/2,Math.PI],['nh',Math.PI,Math.PI*1.5]]
        .forEach(function(q){
          host.appendChild(mk('path',{d:arc(0,R1+16,q[1],q[2]),class:'ue-quad ue-quad-'+q[0],
            style:'--h:'+QH[q[0]]}));
        });

      fams.forEach(function(f,i){
        var a0=start+i*seg, a1=a0+seg, hue=QH[f.q]||200;
        var p=mk('path',{d:arc(R0,R1,a0,a1),class:'ue-seg ue-seg-gew',style:'--h:'+hue,
          tabindex:'0',role:'button','aria-label':f.name+'. '+(f.def||'')});
        var q=(gew.quadrants||[]).filter(function(x){ return x.key===f.q; })[0]||{};
        var d={name:f.name,trail:q.axes||'',def:f.def,hue:hue,
               urge:null,counter:null,near:null};
        p.addEventListener('click',function(){
          select(p,d);
          if(read) read.insertAdjacentHTML('beforeend',
            '<p class="ue-wheel-quad"><b>'+esc(q.short||'')+'</b> '+esc(q.body||'')+'</p>');
        });
        p.addEventListener('keydown',function(e){
          if(e.key==='Enter'||e.key===' '){ e.preventDefault(); p.dispatchEvent(new MouseEvent('click')); }
        });
        host.appendChild(p);
        host.appendChild(label(f.name,radialR(R0,R1,(a0+a1)/2),(a0+a1)/2,'ue-wt ue-wt-cat',12,R1-R0-14));
      });

      /* the two axes and their ends */
      host.appendChild(mk('line',{x1:CX-R1-14,y1:CY,x2:CX+R1+14,y2:CY,class:'ue-axis'}));
      host.appendChild(mk('line',{x1:CX,y1:CY-R1-14,x2:CX,y2:CY+R1+14,class:'ue-axis'}));
      [[CX-R1-6,CY-8,'start','Unpleasant'],[CX+R1+6,CY-8,'end','Pleasant'],
       [CX+6,CY-R1-6,'start','High control'],[CX+6,CY+R1+16,'start','Low control']]
        .forEach(function(t){
          host.appendChild(mk('text',{x:t[0],y:t[1],'text-anchor':t[2],class:'ue-axlab','font-size':13},t[3]));
        });
      /* quadrant names, this page's shorthand */
      (gew.quadrants||[]).forEach(function(q){
        var pos={ph:[CX+R1*0.62,CY-R1*0.62],pl:[CX+R1*0.62,CY+R1*0.62],
                 nl:[CX-R1*0.62,CY+R1*0.62],nh:[CX-R1*0.62,CY-R1*0.62]}[q.key];
        if(!pos) return;
        host.appendChild(mk('text',{x:pos[0],y:pos[1],'text-anchor':'middle',
          class:'ue-qlab','font-size':13,style:'--h:'+QH[q.key]},q.short));
      });
      hub(R0-8,'Which one?','pick a word');
    }

    function render(){
      host.innerHTML='';
      fitQueue.length=0;
      if(view==='cats'){ buildCats(); clearPanel('Select any category. Twenty-seven, from self-report.'); }
      else { buildAxes(); clearPanel('Select any family. Placed by valence across and control up.'); }
      host.dataset.view=view;
      fitLabels();
      if(document.fonts&&document.fonts.ready&&document.fonts.ready.then){
        document.fonts.ready.then(function(){
          Array.prototype.slice.call(host.querySelectorAll('.ue-wt')).forEach(function(t){
            t.removeAttribute('textLength'); t.removeAttribute('lengthAdjust');
            t.setAttribute('font-size',t.dataset.size);
            fitQueue.push(t);
          });
          fitLabels();
        });
      }
    }

    var tabs=document.getElementById('ue-wheel-views');
    if(tabs){
      tabs.addEventListener('click',function(e){
        var b=e.target.closest('button[data-view]'); if(!b) return;
        view=b.dataset.view;
        all('#ue-wheel-views button').forEach(function(x){
          var on=x===b;
          x.classList.toggle('is-on',on);
          x.setAttribute('aria-pressed',on?'true':'false');
        });
        var src=document.getElementById('ue-wheel-cite');
        if(src) src.dataset.view=view;
        render();
      });
    }
    var cl=document.getElementById('ue-wheel-clear');
    if(cl) cl.addEventListener('click',function(){
      clearPanel(view==='cats'?'Select any category. Twenty-seven, from self-report.'
                              :'Select any family. Placed by valence across and control up.');
    });

    render();
  }

  /* ── Which band, and what fits it ────────────────────────
     Named plainly. The middle band is the only one where a considered
     decision belongs; the other two get a physical move first. */
  function bands(){
    var wrap=document.getElementById('ue-bands'); if(!wrap) return;
    var read=document.getElementById('ue-band-read');
    var mark=document.getElementById('ue-band-mark');
    var COPY={
      over:{t:'Too switched on',
        p:'Speed is up, the body is loud, and everything feels like it must be settled now. A decision made here is really the alarm choosing.',
        a:'Lower the speed first. Cold, movement, a longer out-breath. Then come back to the question.'},
      mid:{t:'Able to choose',
        p:'You can feel something and still steer. This is the only band where a considered decision belongs.',
        a:'Do the thing you chose. Practice counts here, with the feeling still present.'},
      under:{t:'Switched off',
        p:'Flat, foggy, far away. Nothing feels urgent because nothing feels like much at all.',
        a:'Raise the signal gently. Stand, cold water, light, one small physical task. Do not decide anything large from here.'}
    };
    var POS={over:'16%',mid:'50%',under:'84%'};
    function show(k){
      all('#ue-bands button').forEach(function(b){ b.classList.toggle('is-on',b.dataset.band===k); });
      if(mark) mark.style.left=POS[k];
      var c=COPY[k];
      if(read&&c) read.innerHTML='<p class="t">'+esc(c.t)+'</p><p>'+esc(c.p)+'</p><p class="do">'+esc(c.a)+'</p>';
    }
    wrap.addEventListener('click',function(e){
      var b=e.target.closest('button[data-band]'); if(b) show(b.dataset.band);
    });
    show('mid');
  }

  /* ── Plan one rung, then log what happened ───────────────
     Records what was practised and the two difficulty readings, so the record
     is of behaviour rather than of whether it felt better. Local only. */
  function planner(){
    var root=document.getElementById('ue-planner'); if(!root) return;
    var what=document.getElementById('ue-plan-what');
    var skip=document.getElementById('ue-plan-skip');
    var before=document.getElementById('ue-plan-before');
    var after=document.getElementById('ue-plan-after');
    var out=document.getElementById('ue-plan-out');
    var logEl=document.getElementById('ue-plan-log');
    var KEY='ue:log';
    var rows=[];
    try{ rows=JSON.parse(localStorage.getItem(KEY)||'[]')||[]; }catch(e){ rows=[]; }

    function nums(){
      var b=document.getElementById('ue-plan-before-v');
      var a=document.getElementById('ue-plan-after-v');
      if(b) b.textContent=before.value;
      if(a) a.textContent=after.value;
      if(out){
        var d=+before.value-+after.value;
        out.innerHTML = !what.value.trim()
          ? 'Name the uncertainty above, then log the round.'
          : d>0 ? 'It came down <b>'+d+'</b> without the relief move.'
          : d===0 ? 'It stayed level. The round counts anyway, because you did it with the feeling present.'
          : 'It rose. That happens. What you did is the record here, not where the number landed.';
      }
    }
    function paint(){
      if(!logEl) return;
      logEl.innerHTML = !rows.length ? '' :
        '<p class="k">Rounds logged</p>'+rows.map(function(r,ix){
          return '<div class="ue-plan-row"><span class="w">'+esc(r.what)+'</span>'+
            (r.skip?'<span class="s">not doing: '+esc(r.skip)+'</span>':'')+
            '<span class="n">'+r.before+' &rarr; '+r.after+'</span>'+
            '<button type="button" data-del="'+ix+'" aria-label="Remove this round">&times;</button></div>';
        }).join('');
    }
    function save(){ try{ localStorage.setItem(KEY,JSON.stringify(rows)); }catch(e){} }

    [before,after].forEach(function(r){ if(r) r.addEventListener('input',nums); });
    if(what) what.addEventListener('input',nums);

    var addButton=document.getElementById('ue-plan-add');
    if(addButton){
      addButton.addEventListener('click',function(){
        if(!what.value.trim()){ what.focus(); return; }
        rows.unshift({what:what.value.trim(),skip:skip.value.trim(),
          before:+before.value,after:+after.value});
        rows=rows.slice(0,12);
        save(); paint();
        what.value=''; skip.value='';
        nums();
      });
    }
    if(logEl){
      logEl.addEventListener('click',function(e){
        var d=e.target.closest('button[data-del]'); if(!d) return;
        rows.splice(+d.dataset.del,1); save(); paint();
      });
    }
    var clear=document.getElementById('ue-plan-clear');
    if(clear) clear.addEventListener('click',function(){ rows=[]; save(); paint(); });

    nums(); paint();
  }

  [curveViz,wheel,bands,planner].forEach(function(fn){
    try{ fn(); }catch(e){ /* one widget must not take the page down */ }
  });

})();
