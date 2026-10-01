(function () {
  function integrand(kind,x) {
    if(kind==='square')return x*x;
    if(kind==='sine')return Math.sin(x);
    if(kind==='uniform')return x>=0&&x<=1?x*x:0;
    if(kind==='exponential')return x>=0?x*Math.exp(-x):0;
    return null;
  }
  function primitive(kind,x) {
    if(kind==='square')return x*x*x/3;
    if(kind==='sine')return 1-Math.cos(x);
    if(kind==='uniform'){var v=Math.max(0,Math.min(1,x));return v*v*v/3;}
    if(kind==='exponential')return x<=0?0:x===Infinity?1:1-(x+1)*Math.exp(-x);
    return null;
  }
  function integral(kind,a,b){return primitive(kind,b)-primitive(kind,a);}
  function accumulation(kind,x){return integral(kind,0,x);}
  function riemann(kind,a,b,n) {
    if(n<1||n!==Math.floor(n))return null;
    var width=(b-a)/n,rectangles=[],sum=0;
    for(var i=0;i<n;i++){
      var x=a+(i+0.5)*width,height=integrand(kind,x),area=height*width;
      rectangles.push({a:a+i*width,b:a+(i+1)*width,x:x,height:height,area:area});sum+=area;
    }
    return{value:sum,width:width,n:n,rectangles:rectangles};
  }
  function expectation(kind){return kind==='uniform'?1/3:kind==='exponential'?1:null;}
  function monteCarlo(kind,n,seed) {
    if(n<1||n!==Math.floor(n)||(kind!=='uniform'&&kind!=='exponential'))return null;
    var state=seed>>>0,samples=[],values=[],mean=0,m2=0;
    for(var i=0;i<n;i++){
      state=(Math.imul(1664525,state)+1013904223)>>>0;
      var u=(state+0.5)/4294967296,x=kind==='uniform'?u:-Math.log1p(-u),v=kind==='uniform'?x*x:x;
      samples.push(x);values.push(v);var delta=v-mean;mean+=delta/(i+1);m2+=delta*(v-mean);
    }
    return{samples:samples,values:values,estimate:mean,se:n>1?Math.sqrt(Math.max(0,m2)/(n-1)/n):null,exact:expectation(kind)};
  }
  function transformedDensity(y,scale){return scale<=0?null:y>=0&&y<=scale?1/scale:0;}
  var M={integrand:integrand,riemann:riemann,integral:integral,accumulation:accumulation,
    expectation:expectation,monteCarlo:monteCarlo,transformedDensity:transformedDensity};
  if(typeof module==='object'&&module.exports){module.exports=M;return;}
  XP.lab('calculus/integration',function(root,api){
    var el=XP.svgEl,fmt=XP.fmt,stage=root.querySelector('[data-stage]'),ctl=root.querySelector('[data-ctl]'),note=root.querySelector('[data-note]');
    var initial={view:'area',kind:'square',b:1,n:4,distribution:'uniform',count:32,scale:1,blend:1};
    var s=Object.assign({},initial),fraction=1,dragStart=null,motion={from:Object.assign({},s),to:Object.assign({},s)};
    stage.innerHTML='<div data-view="area"><div data-square><div data-curve></div><div data-accumulation></div></div><div data-sine hidden><div data-curve></div><div data-accumulation></div></div></div>'+ 
      '<div data-view="weights" hidden><div data-uniform></div><div data-exponential hidden></div></div>'+ 
      '<div data-view="sampling" hidden><div data-means></div><div data-uniform-samples></div><div data-exponential-samples hidden></div></div><div data-view="scale" hidden></div>';
    var planes={},areas={},weights={},strips={};
    function plane(node,x,y,h,label){var p=XP.plane(node,{x:x,y:y,w:400,h:h,pad:26,label:label});p.grid.innerHTML=p.axes();return p;}
    ['square','sine'].forEach(function(k){var box=stage.querySelector('[data-'+k+']'),end=k==='square'?2:2*Math.PI;
      areas[k]={curve:plane(box.querySelector('[data-curve]'),[-0.15,end+0.25],k==='square'?[-0.6,4.6]:[-1.5,1.5],300,'Midpoint rectangles under '+(k==='square'?'x squared':'sine')+'; drag the integration endpoint'),
        accumulated:plane(box.querySelector('[data-accumulation]'),[-0.15,end+0.25],[-0.3,k==='square'?3.1:2.4],250,'Accumulated signed area from 0 to the selected endpoint')};
    });
    weights.uniform=plane(stage.querySelector('[data-uniform]'),[-0.12,1.15],[-0.15,1.4],350,'Uniform density and x squared weighted by that density');
    weights.exponential=plane(stage.querySelector('[data-exponential]'),[-0.3,6.5],[-0.15,1.4],350,'Exponential density and x times that density, pictured up to 6');
    planes.means=plane(stage.querySelector('[data-means]'),[-20,530],[-0.15,1.3],300,'Seeded running sample mean with an estimated standard error band');
    strips.uniform=plane(stage.querySelector('[data-uniform-samples]'),[-20,530],[-0.15,1.3],180,'Individual squared uniform samples');
    strips.exponential=plane(stage.querySelector('[data-exponential-samples]'),[-20,530],[-0.8,8.8],180,'Individual exponential samples');
    planes.scale=plane(stage.querySelector('[data-view="scale"]'),[-0.2,3.4],[-0.3,4.6],400,'A scaled uniform density; drag its top right corner to stretch its support');
    var prefixes={},samples={};['uniform','exponential'].forEach(function(k){prefixes[k]=[];for(var n=1;n<=500;n++){var q=monteCarlo(k,n,43);prefixes[k][n]={estimate:q.estimate,se:q.se};if(n===500)samples[k]=q.values;}});
    var dlg=XP.dialog(root);
    ctl.innerHTML='<button type="button" data-act="play">Play the change</button><label>Motion <input data-k="progress" type="range" min="0" max="1" step="0.01" value="1" aria-label="Scrub the recorded change"></label>'+ 
      '<label>View <select data-k="view"><option value="area">Area and accumulation</option><option value="weights">Probability weights</option><option value="sampling">Sample average</option><option value="scale">Scaled density</option></select></label>'+ 
      '<label data-control="area">Curve <select data-k="kind"><option value="square">x²</option><option value="sine">sin x</option></select></label>'+ 
      '<label data-control="area">Rectangles <input data-k="n" type="range" min="1" max="64" step="1" value="4" aria-label="Number of midpoint rectangles"></label>'+ 
      '<label data-distribution-control hidden>Distribution <select data-k="distribution"><option value="uniform">Uniform on [0, 1]</option><option value="exponential">Exponential, rate 1</option></select></label>'+ 
      '<label data-control="sampling" hidden>Samples <input data-k="count" type="range" min="1" max="500" step="1" value="32" aria-label="Number of seeded samples"></label>'+ 
      '<button type="button" data-zoom="area">Area, worked</button><button type="button" data-zoom="weights" hidden>Weights, worked</button>'+ 
      '<button type="button" data-zoom="sampling" hidden>Sampling, worked</button><button type="button" data-zoom="scale" hidden>Scale, worked</button><button type="button" data-reset>Reset</button>';
    var progress=ctl.querySelector('[data-k="progress"]');
    function snapshot(){return Object.assign({},s);}
    function clamp(x,a,b){return Math.max(a,Math.min(b,x));}
    function normalise(next){var v=Object.assign(snapshot(),next);v.b=clamp(v.b,0,v.kind==='square'?2:2*Math.PI);v.n=Math.round(clamp(v.n,1,64));v.count=Math.round(clamp(v.count,1,500));v.scale=clamp(v.scale,0.25,3);v.blend=clamp(v.blend,0,1);return v;}
    function interpolate(from,to,f){return normalise(XP.mix(from,to,XP.ease(f)));}
    function record(from,to,play){api.interrupt();motion={from:from,to:to};if(play)api.animate(from,to,750,function(st,f){s=interpolate(from,to,f);fraction=f;draw();},report);else{s=Object.assign({},to);fraction=1;draw();report();}}
    function change(next){api.interrupt();record(snapshot(),normalise(next),false);}
    function handle(p,config,key){var h=p.handle(config);h.el.setAttribute('data-handle',key);h.el.addEventListener('pointerdown',function(){dragStart=snapshot();});return h;}
    function move(next,done){api.interrupt();record(dragStart||snapshot(),normalise(next),false);if(done)dragStart=null;}
    var ends={};['square','sine'].forEach(function(k){ends[k]=handle(areas[k].curve,{x:1,y:integrand(k,1),snap:0.05,bounds:[[0,k==='square'?2:2*Math.PI],k==='square'?[0,4]:[-1,1]],cls:'is-q',part:'rectangles',label:'Integration endpoint for '+k,onMove:function(x,y,done){move({b:x},done);}},k+'-endpoint');});
    var hc=handle(planes.means,{x:32,y:0.2732,snap:1,bounds:[[1,500],[0,1.2]],cls:'is-q',part:'sampling',label:'Selected sample count',onMove:function(x,y,done){move({count:x},done);}},'sample-count');
    var hs=handle(planes.scale,{x:1,y:1,snap:0.05,bounds:[[0.25,3],[0,4]],cls:'is-q',part:'scale',label:'Width of scaled uniform density',onMove:function(x,y,done){move({scale:x},done);}},'scale');
    function text(p,x,y,words,part){return el('text',{x:p.map.sx(x),y:p.map.sy(y),'text-anchor':'middle','data-part':part},XP.esc(words));}
    function line(p,points,cls,part){return el('polyline',{points:p.pts(points),'class':'pl-mark '+cls,'data-part':part});}
    function points(end,fn){var out=[];for(var i=0;i<=100;i++){var x=end*i/100;out.push([x,fn(x)]);}return out;}
    function shade(p,pts,cls,part){return el('polygon',{points:p.pts([[pts[0][0],0]].concat(pts,[[pts[pts.length-1][0],0]])),'class':'pl-integral '+cls,'data-part':part});}
    function areaMarkup(k){var p=areas[k].curve,a=areas[k].accumulated,end=k==='square'?2:2*Math.PI,r=riemann(k,0,s.b,s.n),h='';
      r.rectangles.forEach(function(v){h+=shade(p,[[v.a,v.height],[v.b,v.height]],v.height<0?'is-k':'is-o','rectangles');});
      h+=line(p,points(end,function(x){return integrand(k,x);}), 'pl-curve is-q','rectangles');
      h+=text(p,end/2,k==='square'?4.35:1.28,'Midpoint rectangles · drag b','rectangles');p.plot.innerHTML=h;
      var value=accumulation(k,s.b),slope=integrand(k,s.b),lo=Math.max(0,s.b-0.25),hi=Math.min(end,s.b+0.25);
      a.plot.innerHTML=line(a,points(end,function(x){return accumulation(k,x);}), 'pl-curve is-o','accumulation')+
        line(a,[[lo,value+(lo-s.b)*slope],[hi,value+(hi-s.b)*slope]],'pl-curve is-k','accumulation')+a.dot(s.b,value,5,'pl-mark pl-point is-o','accumulation')+
        text(a,end/2,k==='square'?2.95:2.25,'Accumulated area A(b), slope f(b)','accumulation');ends[k].set(s.b,integrand(k,s.b));
    }
    function weightsMarkup(k){var p=weights[k],end=k==='uniform'?1:6;
      function density(x){return k==='uniform'?1:Math.exp(-x);}
      p.plot.innerHTML=shade(p,points(end*s.blend,function(x){return integrand(k,x);}), 'is-o','weights')+
        line(p,points(end,density),'pl-curve is-q','weights')+line(p,points(end,function(x){return integrand(k,x);}), 'pl-curve is-o','weights')+
        text(p,end/2,1.25,'Blue density · purple weighted value','weights');
    }
    function samplingMarkup(){var p=planes.means,q=prefixes[s.distribution],means=[],upper=[],lower=[],h='';
      for(var n=1;n<=s.count;n++){means.push([n,q[n].estimate]);if(n>1){upper.push([n,q[n].estimate+q[n].se]);lower.push([n,q[n].estimate-q[n].se]);}}
      h+=el('polygon',{points:p.pts(upper.concat(lower.reverse())),'class':'pl-integral is-o','data-part':'sampling','data-band':'','data-available':String(s.count>1)});
      h+=line(p,[[0,expectation(s.distribution)],[500,expectation(s.distribution)]],'pl-dash is-k','sampling')+line(p,means,'pl-curve is-o','sampling')+
        text(p,250,1.2,'Mean ± estimated SE · dashed exact','sampling')+text(p,250,-0.09,'Sample count, seed 43','sampling');p.plot.innerHTML=h;
      var strip=strips[s.distribution],h2='';for(var i=0;i<s.count;i++)h2+=strip.dot(i+1,samples[s.distribution][i],2,'pl-mark pl-point is-q','samples');
      h2+=text(strip,250,s.distribution==='uniform'?1.18:8.1,'Individual sampled values g(x)','samples');strip.plot.innerHTML=h2;hc.set(s.count,q[s.count].estimate);
    }
    function scaleMarkup(){var p=planes.scale,height=1/s.scale;p.plot.innerHTML=shade(p,[[0,height],[s.scale,height]],'is-o','scale')+
      text(p,1.6,4.32,'Width × height = 1','scale')+text(p,s.scale/2,height+0.18,'1 / '+fmt(s.scale,2),'scale');hs.set(s.scale,height);}
    function draw(){
      var r=riemann(s.kind,0,s.b,s.n),area=integral(s.kind,0,s.b),target=expectation(s.distribution),q=prefixes[s.distribution][s.count],est='Not sampled',se='Not sampled';
      if(s.view==='weights')area=integral(s.distribution,0,(s.distribution==='uniform'?1:6)*s.blend);
      else if(s.view==='sampling'){area=target;est=q.estimate;se=q.se===null?'Unavailable':q.se;}
      else if(s.view==='scale')area=1;
      var positive=s.kind==='square'?integral('square',0,s.b):integral('sine',0,Math.min(s.b,Math.PI)),negative=s.kind==='sine'&&s.b>Math.PI?-integral('sine',Math.PI,s.b):0;
      api.values({area:Math.abs(area)<1e-12?0:area,sum:r.value,b:s.b,n:String(s.n),count:String(s.count),fx:integrand(s.kind,s.b),positiveArea:positive,negativeArea:negative,targetArea:target,tail:target-integral(s.distribution,0,s.distribution==='uniform'?1:6),estimate:est,se:se,scale:s.scale,densityHeight:1/s.scale},4);
      root.querySelector('[data-formula]').textContent=s.view==='area'?(s.kind==='square'?'f(x) = x²':'f(x) = sin x')+', A(b) = ∫₀ᵇ f(x) dx':
        s.view==='scale'?'Y = aX, X uniform on [0, 1], pY(y) = 1/a on [0, a]':s.distribution==='uniform'?'X uniform on [0, 1], g(x) = x², E[g(X)] = 1/3':'X exponential with rate 1, g(x) = x, E[X] = 1';
      stage.querySelectorAll('[data-view]').forEach(function(e){e.hidden=e.getAttribute('data-view')!==s.view;});
      stage.querySelector('[data-square]').hidden=s.kind!=='square';stage.querySelector('[data-sine]').hidden=s.kind!=='sine';
      stage.querySelector('[data-uniform]').hidden=s.distribution!=='uniform';stage.querySelector('[data-exponential]').hidden=s.distribution!=='exponential';
      stage.querySelector('[data-uniform-samples]').hidden=s.distribution!=='uniform';stage.querySelector('[data-exponential-samples]').hidden=s.distribution!=='exponential';
      root.querySelectorAll('[data-area-readout]').forEach(function(e){e.hidden=s.view!=='area';});root.querySelector('[data-signed-readout]').hidden=s.view!=='area'||s.kind!=='sine';
      ['weights','sampling','scale'].forEach(function(k){root.querySelector('[data-'+k+'-readout]').hidden=s.view!==k;});
      ctl.querySelectorAll('[data-control]').forEach(function(e){e.hidden=e.getAttribute('data-control')!==s.view;});ctl.querySelector('[data-distribution-control]').hidden=s.view!=='weights'&&s.view!=='sampling';
      ctl.querySelectorAll('[data-zoom]').forEach(function(e){e.hidden=e.getAttribute('data-zoom')!==s.view;});['view','kind','n','distribution','count'].forEach(function(k){ctl.querySelector('[data-k="'+k+'"]').value=s[k];});progress.value=fraction;
      if(s.view==='area')areaMarkup(s.kind);else if(s.view==='weights')weightsMarkup(s.distribution);else if(s.view==='sampling')samplingMarkup();else scaleMarkup();
      note.textContent=s.view==='area'?(s.b===0?'The empty interval has area 0. Increase its endpoint to accumulate contributions.':s.kind==='sine'?'Above-axis contributions add area; below-axis contributions subtract it. Therefore, a full sine cycle has signed area 0.':'Each rectangle uses the function value at its midpoint. As rectangles narrow, their sum approaches the integral. The accumulated area’s slope equals the endpoint’s function value.'):
        s.view==='weights'?(s.distribution==='uniform'?'Probability density weights each possible function value. Here, integrating x² over the uniform support gives the expectation 1/3.':'The density is e⁻ˣ for x ≥ 0. However, this picture ends at 6. The omitted weighted tail is '+fmt(7*Math.exp(-6),4)+', so the full expectation remains 1.'):
        s.view==='sampling'?(s.count===1?'With one sample, the mean is available. However, estimating variation requires at least 2 samples, so the SE band is unavailable.':'Monte Carlo estimates an expectation by averaging independent sampled values. The standard error estimates the mean’s typical sampling variation. Accordingly, the band shows ±1 estimated SE, without guaranteeing coverage.'):
        'Scaling X by a stretches its support from [0, 1] to [0, a]. Accordingly, dividing density height by a keeps width × height equal to 1.';
    }
    function report(){api.say(note.textContent);}
    function table(rows){return'<div class="lab-calculus-table"><table class="xp-table lab-table"><thead><tr><th scope="col">Quantity</th><th scope="col">Current value</th></tr></thead><tbody>'+rows.map(function(row){return'<tr><th scope="row">'+row[0]+'</th><td>'+row[1]+'</td></tr>';}).join('')+'</tbody></table></div>';}
    function zoom(which,button){
      if(which==='area'){var r=riemann(s.kind,0,s.b,s.n),rows=r.rectangles.slice(0,8).map(function(v,i){return['Rectangle '+(i+1),'Midpoint '+fmt(v.x,6)+', height '+fmt(v.height,6)+', area '+fmt(v.area,6)];});
        dlg.open('Area, worked','<p>Each midpoint rectangle contributes width × function height. After that, adding signed contributions estimates the integral.</p>'+table([['Width b / n',fmt(r.width,6)],['Rectangle count',s.n],['Midpoint sum',fmt(r.value,6)],['Exact integral',fmt(integral(s.kind,0,s.b),6)],['Accumulation slope f(b)',fmt(integrand(s.kind,s.b),6)]])+table(rows)+'<p>The table lists the first '+rows.length+' rectangles. All '+s.n+' rectangles contribute to the sum.</p>',button);
      }else if(which==='weights'){var end=(s.distribution==='uniform'?1:6)*s.blend;
        dlg.open('Probability weights, worked','<p>An expectation integrates a function against its probability density. Therefore, the purple curve multiplies g(x) by p(x).</p>'+table([['Function g(x)',s.distribution==='uniform'?'x²':'x'],['Density on its support',s.distribution==='uniform'?'1 on [0, 1]':'e⁻ˣ on x ≥ 0'],['Shaded endpoint',fmt(end,6)],['Shaded integral',fmt(integral(s.distribution,0,end),6)],['Full expectation',fmt(expectation(s.distribution),6)],['Unshaded weighted tail',fmt(expectation(s.distribution)-integral(s.distribution,0,end),6)]])+'<p>The full expectation includes contributions beyond the shaded endpoint. In particular, the exponential support continues without a finite upper endpoint.</p>',button);
      }else if(which==='sampling'){var q=monteCarlo(s.distribution,s.count,43),variance=q.se===null?null:q.se*q.se*s.count;
        dlg.open('Sample average, worked','<p>Seed 43 fixes this reproducible sample sequence. The sample variance divides squared deviations from the mean by n − 1. After that, SE = √(sample variance / n).</p>'+table([['Sample count',s.count],['Sample mean',fmt(q.estimate,6)],['Sample variance',variance===null?'Unavailable':fmt(variance,6)],['Estimated SE',q.se===null?'Unavailable':fmt(q.se,6)],['Exact expectation',fmt(q.exact,6)],['First sampled g(x)',fmt(q.values[0],6)]])+'<p>For independent samples with finite variance, typical error scales as 1/√n. However, one realised estimate can fluctuate as samples accumulate.</p>',button);
      }else dlg.open('Scaled density, worked','<p>The transformation Y = aX stretches every interval by a. Therefore, density divides by a to preserve probability.</p>'+table([['Scale a',fmt(s.scale,6)],['Density height 1/a',fmt(1/s.scale,6)],['Support width',fmt(s.scale,6)],['Integral a × (1/a)',fmt(1,6)]])+'<p>The scale stays positive, between 0.25 and 3. Accordingly, this scene always represents a continuous uniform density.</p>',button);
    }
    ctl.addEventListener('input',function(e){var k=e.target.getAttribute('data-k');if(k==='progress'){var requested=+e.target.value;api.interrupt();fraction=requested;s=interpolate(motion.from,motion.to,requested);draw();report();}else if(k==='n'||k==='count'){var next={};next[k]=+e.target.value;change(next);}});
    ctl.addEventListener('change',function(e){var k=e.target.getAttribute('data-k');if(['view','kind','distribution'].indexOf(k)<0)return;var value=e.target.value,next={};next[k]=value;next.blend=1;change(next);});
    ctl.addEventListener('click',function(e){var b=e.target.closest('button');if(!b)return;api.interrupt();if(b.hasAttribute('data-zoom'))return zoom(b.getAttribute('data-zoom'),b);if(b.hasAttribute('data-reset'))return record(snapshot(),Object.assign({},initial),false);
      if(b.getAttribute('data-act')==='play'){var from=snapshot(),to=snapshot();if(s.view==='area'){from.b=0;from.n=4;to.n=64;if(to.b===0)to.b=1;}else if(s.view==='weights'){from.blend=0;to.blend=1;}else if(s.view==='sampling'){from.count=1;to.count=500;}else{from.scale=0.5;to.scale=2;}record(from,to,true);}});
    var PAGES=[
      {t:'Add midpoint rectangles',parts:['rectangles','accumulation'],state:{},body:'<p>From 0 to 1, 4 midpoint rectangles under x² sum to 0.328125. However, the exact integral is 1/3, approximately 0.333333.</p>'},
      {t:'Refine the approximation',parts:['rectangles','accumulation'],state:{n:64},body:'<p>Increasing the rectangle count to 64 reduces the midpoint error. Consequently, the sum approaches 1/3 as each rectangle narrows.</p>'},
      {t:'Read accumulation as a function',parts:['rectangles','accumulation'],state:{b:2,n:64},body:'<p>The accumulated area A(b) records the integral from 0 to b. At b = 2, A = 8/3 and its slope is f(2) = 4.</p>'},
      {t:'Subtract below-axis contributions',parts:['rectangles','accumulation'],state:{kind:'sine',b:2*Math.PI,n:64},body:'<p>Over a full sine cycle, above-axis area is 2 and below-axis magnitude is 2. Therefore, their signed contributions cancel, giving integral 0.</p>'},
      {t:'Weight values by probability',parts:['weights'],state:{view:'weights'},body:'<p>A uniform density assigns height 1 across [0, 1]. Therefore, integrating the weighted value x² gives its expectation, 1/3.</p>'},
      {t:'Account for the omitted tail',parts:['weights'],state:{view:'weights',distribution:'exponential'},body:'<p>An exponential variable with rate 1 has mean 1. However, this picture stops at 6, leaving weighted tail area approximately 0.0174.</p>'},
      {t:'Average sampled values',parts:['sampling','samples'],state:{view:'sampling'},body:'<p>Monte Carlo replaces integration with a sample average. Here, 32 seeded uniform samples give mean 0.2732 and estimated standard error 0.0488.</p>'},
      {t:'Increase the sample count',parts:['sampling','samples'],state:{view:'sampling',count:500},body:'<p>With 500 samples, the mean is 0.3384 and estimated standard error is 0.0132. For independent samples with finite variance, typical error scales as 1/√n.</p>'},
      {t:'Leave one-sample variation undefined',parts:['sampling','samples'],state:{view:'sampling',count:1},body:'<p>One sample gives a mean, but cannot estimate variation around that mean. Accordingly, the estimated standard error and its band remain unavailable.</p>'},
      {t:'Preserve probability under scaling',parts:['scale'],state:{view:'scale',scale:2},body:'<p>For Y = 2X, the uniform support stretches from width 1 to width 2. Accordingly, density halves to 0.5 and total probability remains 1.</p>'}
    ];
    draw();report();XP.guide(root.querySelector('[data-guide-box]'),PAGES,function(p,i,redraw){if(!p){api.focus([]);return;}if(!redraw){api.interrupt();var to=Object.assign({},initial,p.state),from=snapshot();['view','kind','distribution'].forEach(function(k){from[k]=to[k];});from=normalise(from);record(from,to,true);}api.focus(p.parts);});
  });
})();
