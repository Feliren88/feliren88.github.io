(function () {
  function objective(kind, x, y) {
    var sx = kind === 'maximum' ? -1 : 1, sy = kind === 'maximum' || kind === 'saddle' ? -1 : 1;
    return {value: kind === 'flat' ? x*x*x*x+y*y : sx*x*x+sy*y*y,
      gradient: [kind === 'flat' ? 4*x*x*x : 2*sx*x, 2*sy*y],
      hessian: [[kind === 'flat' ? 12*x*x : 2*sx, 0], [0, 2*sy]]};
  }
  function classify(values) {
    var positive = values.some(function(v){return v>1e-10;}), negative = values.some(function(v){return v<-1e-10;});
    if (positive && negative) return 'saddle';
    if (values.some(function(v){return Math.abs(v)<=1e-10;})) return 'inconclusive';
    return positive ? 'minimum' : 'maximum';
  }
  function eigenvalues(matrix) {
    var a=matrix.map(function(row){return row.slice();}),n=a.length;
    for(var step=0;step<200*n*n;step++) {
      var p=0,q=0,largest=0;
      for(var i=0;i<n;i++)for(var j=i+1;j<n;j++)if(Math.abs(a[i][j])>largest){largest=Math.abs(a[i][j]);p=i;q=j;}
      if(largest<1e-12)break;
      var tau=(a[q][q]-a[p][p])/(2*a[p][q]);
      var t=(tau>=0?1:-1)/(Math.abs(tau)+Math.sqrt(1+tau*tau)),c=1/Math.sqrt(1+t*t),s=t*c;
      var off=a[p][q];a[p][p]-=t*off;a[q][q]+=t*off;a[p][q]=a[q][p]=0;
      for(var k=0;k<n;k++)if(k!==p&&k!==q){
        var u=a[k][p],v=a[k][q];a[k][p]=a[p][k]=c*u-s*v;a[k][q]=a[q][k]=s*u+c*v;
      }
    }
    return a.map(function(row,i){return row[i];}).sort(function(x,y){return x-y;});
  }
  function stationary(kind) {
    var state=objective(kind,0,0);state.point=[0,0];state.eigenvalues=eigenvalues(state.hessian);state.type=classify(state.eigenvalues);return state;
  }
  function constrained(theta) {
    var x=theta,y=1-theta,g=[2*x,4*y];
    return {point:[x,y],value:x*x+2*y*y,objectiveGradient:g,constraintGradient:[1,1],
      tangentRate:g[0]-g[1],multiplier:(g[0]+g[1])/2};
  }
  function independentSigns(d) {return Math.pow(2,-d);}
  function curvatureSample(d,count,seed) {
    var state=seed>>>0,matrices=[],values=[],positive=0;
    function uniform(){state=(Math.imul(1664525,state)+1013904223)>>>0;return(state+0.5)/4294967296;}
    function normal(){var u=uniform(),v=uniform();return Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*v);}
    for(var sample=0;sample<count;sample++) {
      var G=[],H=[];
      for(var i=0;i<d;i++){G[i]=[];for(var j=0;j<d;j++)G[i][j]=normal();}
      for(var r=0;r<d;r++){H[r]=[];for(var col=0;col<d;col++)H[r][col]=(G[r][col]+G[col][r])/2;}
      var eig=eigenvalues(H);if(eig.every(function(v){return v>0;}))positive++;
      matrices.push(H);values.push(eig);
    }
    return {d:d,count:count,seed:seed,matrices:matrices,eigenvalues:values,positive:positive,fraction:count?positive/count:0};
  }
  function chord(kind,axis,a,b,t) {
    function f(x){return objective(kind,axis==='x'?x:0,axis==='y'?x:0).value;}
    var x=(1-t)*a+t*b,prediction=(1-t)*f(a)+t*f(b),value=f(x);
    return {x:x,value:value,prediction:prediction,gap:prediction-value};
  }
  var M={objective:objective,stationary:stationary,classify:classify,constrained:constrained,
    curvatureSample:curvatureSample,independentSigns:independentSigns,eigenvalues:eigenvalues,chord:chord};
  if(typeof module==='object'&&module.exports){module.exports=M;return;}
  XP.lab('calculus/optimisation-conditions',function(root,api){
    var el=XP.svgEl,fmt=XP.fmt,stage=root.querySelector('[data-stage]'),ctl=root.querySelector('[data-ctl]'),note=root.querySelector('[data-note]');
    var initial={view:'surface',kind:'minimum',x:0,y:0,reveal:1,axis:'x',a:-1,b:1,t:0.5,theta:0.5,d:3};
    var s=Object.assign({},initial),fraction=1,dragStart=null,motion={from:Object.assign({},s),to:Object.assign({},s)};
    var samples=[];for(var d=1;d<=6;d++)samples[d]=curvatureSample(d,512,41);
    stage.innerHTML='<div data-surface><div data-landscape></div><div data-point-plane></div></div><div data-chord hidden></div><div data-constraint hidden></div><div data-experiment hidden></div>';
    var boxes={};['surface','chord','constraint','experiment'].forEach(function(k){boxes[k]=stage.querySelector('[data-'+k+']');});
    var S=XP.plane(boxes.surface.querySelector('[data-landscape]'),{x:[-2.4,2.4],y:[-1.4,1.4],w:400,h:300,pad:20,label:'The selected surface, projected into 3 dimensions, with signed curvature sections'});
    var P=XP.plane(boxes.surface.querySelector('[data-point-plane]'),{x:[-1.6,1.6],y:[-1.6,1.6],w:400,h:300,pad:24,label:'Drag the input point to compare gradient and curvature'});
    var C=XP.plane(boxes.chord,{x:[-1.35,1.35],y:[-1.8,1.8],w:400,h:400,pad:26,label:'A curve compared with the straight chord joining 2 points'});
    var L=XP.plane(boxes.constraint,{x:[-0.6,1.8],y:[-0.6,1.8],w:400,h:400,pad:26,label:'Objective contours, the constraint x plus y equals 1, and their gradient arrows'});
    var E=XP.plane(boxes.experiment,{x:[0.4,6.6],y:[-0.1,0.7],w:400,h:330,pad:26,label:'Measured all-positive fraction and independent sign estimate across dimensions 1 to 6'});
    var dlg=XP.dialog(root);
    ctl.innerHTML='<button type="button" data-act="play">Play the change</button><label>Motion <input data-k="progress" type="range" min="0" max="1" step="0.01" value="1" aria-label="Scrub the recorded change"></label>'+
      '<label>View <select data-k="view"><option value="surface">Surface and curvature</option><option value="chord">Convex chord test</option><option value="constraint">Linear constraint</option><option value="experiment">Random curvature experiment</option></select></label>'+
      '<label data-kind-label>Surface <select data-k="kind"><option value="minimum">Upward bowl</option><option value="maximum">Downward bowl</option><option value="saddle">Saddle</option><option value="flat">Flat quartic bowl</option></select></label>'+
      '<label data-axis-label hidden>Slice <select data-k="axis"><option value="x">Along x, y = 0</option><option value="y">Along y, x = 0</option></select></label>'+
      '<label data-t-label hidden>Fraction along chord <input data-k="t" type="range" min="0" max="1" step="0.01" value="0.5" aria-label="Position between the chord endpoints"></label>'+
      '<label data-d-label hidden>Dimension d <input data-k="d" type="range" min="1" max="6" step="1" value="3" aria-label="Matrix dimension"></label>'+
      '<button type="button" data-zoom="hessian">Hessian, worked</button><button type="button" data-zoom="chord" hidden>Chord, worked</button>'+
      '<button type="button" data-zoom="constraint" hidden>Constraint, worked</button><button type="button" data-zoom="experiment" hidden>Experiment, worked</button><button type="button" data-reset>Reset</button>';
    var progress=ctl.querySelector('[data-k="progress"]');
    function snapshot(){return Object.assign({},s);}
    function clamp(x,a,b){return Math.max(a,Math.min(b,x));}
    function normalise(next){var v=Object.assign(snapshot(),next);v.x=clamp(v.x,-1.1,1.1);v.y=clamp(v.y,-1.1,1.1);v.theta=clamp(v.theta,-0.2,1.2);v.a=clamp(v.a,-1.1,1.1);v.b=clamp(v.b,-1.1,1.1);v.d=Math.round(clamp(v.d,1,6));return v;}
    function interpolate(from,to,f){var v=XP.mix(from,to,XP.ease(f));v.d=f<0.5?from.d:to.d;return v;}
    function record(from,to,play){api.interrupt();motion={from:from,to:to};if(play)api.animate(from,to,800,function(st,f){s=interpolate(from,to,f);fraction=f;draw();},report);else{s=Object.assign({},to);fraction=1;draw();report();}}
    function change(next){api.interrupt();record(snapshot(),normalise(next),false);}
    function handle(plane,config,key){
      var h=plane.handle(config);h.el.setAttribute('data-handle',key);h.el.addEventListener('pointerdown',function(){dragStart=snapshot();});return h;
    }
    function move(next,done){api.interrupt();record(dragStart||snapshot(),normalise(next),false);if(done)dragStart=null;}
    var hp=handle(P,{x:0,y:0,snap:0.05,bounds:[[-1.1,1.1],[-1.1,1.1]],cls:'is-q',part:'point',label:'Input point',onMove:function(x,y,done){move({x:x,y:y},done);}},'point');
    function endpoint(key){return handle(C,{x:s[key],y:1,snap:0.05,bounds:[[-1.1,1.1],[-1.6,1.6]],cls:'is-q',part:'chord',label:'Chord endpoint '+key,onMove:function(x,y,done){var next={};next[key]=x;move(next,done);}},key);}
    var ha=endpoint('a'),hb=endpoint('b');
    var hl=handle(L,{x:0.5,y:0.5,snap:0.01,bounds:[[-0.2,1.2],[-0.2,1.2]],cls:'is-q',part:'constraint',label:'Point on x plus y equals 1',onMove:function(x,y,done){move({theta:(x+1-y)/2},done);}},'constraint');
    var he=handle(E,{x:3,y:0.03125,snap:1,bounds:[[1,6],[0,0.65]],cls:'is-q',part:'sample',label:'Selected matrix dimension',onMove:function(x,y,done){move({d:Math.round(x)},done);}},'dimension');
    function text(plane,x,y,words,part){var formulas={"Contours of x\u00b2 + 2y\u00b2": "lab/optimisation-conditions/svg-0", "Solid measured \u00b7 dashed 2\u207b\u1d48": "lab/optimisation-conditions/svg-1"}; if(formulas[words]){return '<foreignObject x="'+(plane.map.sx(x)-150)+'" y="'+(plane.map.sy(y)-17)+'" width="300" height="44" data-part="'+part+'"><div xmlns="http://www.w3.org/1999/xhtml" style="text-align:center;font-size:13px">'+window.InterviewDisplayMath.html(formulas[words], undefined, true)+'</div></foreignObject>';} return el('text',{x:plane.map.sx(x),y:plane.map.sy(y),'text-anchor':'middle','data-part':part},XP.esc(words));}
    function path(plane,points,cls,part){return el('polyline',{points:plane.pts(points),'class':'pl-mark '+cls,'data-part':part});}
    function project(x,y,z){return[x-0.55*y,0.35*y+0.2*z];}
    function curvatureClass(v){return v<-1e-10?'is-k':v>1e-10?'is-o':'is-zero';}
    function surfaceMarkup(){
      var h='';
      for(var k=-1;k<=1.01;k+=0.2)for(var axis=0;axis<2;axis++){
        var points=[];for(var j=0;j<=30;j++){var x=axis?k:-1+j/15,y=axis?-1+j/15:k;points.push(project(x,y,objective(s.kind,x,y).value));}
        h+=path(S,points,'pl-contour','surface');
      }
      var q=objective(s.kind,s.x,s.y);
      for(var dim=0;dim<2;dim++){
        var section=[];for(var i=0;i<=40;i++){var u=-s.reveal+i/20*s.reveal,x=dim?s.x:clamp(s.x+u,-1.1,1.1),y=dim?clamp(s.y+u,-1.1,1.1):s.y;section.push(project(x,y,objective(s.kind,x,y).value));}
        h+=path(S,section,'pl-curve '+curvatureClass(q.hessian[dim][dim]),'curvature');
      }
      var v=project(s.x,s.y,q.value);h+=S.dot(v[0],v[1],6,'pl-mark pl-point is-q','point');
      h+=text(S,0,1.18,'Height f(x, y)','surface');
      h+=text(S,0,-1.02,'Purple positive · coral negative','curvature')+text(S,0,-1.23,'Grey means zero curvature','curvature');
      return h;
    }
    function pointMarkup(){
      var q=objective(s.kind,s.x,s.y),norm=Math.hypot(q.gradient[0],q.gradient[1]),h='';
      if(norm)h+=P.arrow(s.x,s.y,s.x+0.4*q.gradient[0]/norm,s.y+0.4*q.gradient[1]/norm,'is-q','gradient');
      h+=P.arrow(s.x,s.y,s.x+0.4*s.reveal,s.y,curvatureClass(q.hessian[0][0]),'curvature');
      h+=P.arrow(s.x,s.y,s.x,s.y+0.4*s.reveal,curvatureClass(q.hessian[1][1]),'curvature');
      return h+text(P,0,1.4,'Input plane · drag the point','point');
    }
    function slice(x){return objective(s.kind,s.axis==='x'?x:0,s.axis==='y'?x:0).value;}
    function chordMarkup(){
      var points=[];for(var i=0;i<=80;i++){var x=-1.1+i/80*2.2;points.push([x,slice(x)]);}
      var q=chord(s.kind,s.axis,s.a,s.b,s.t);
      return path(C,points,'pl-curve is-o','curve')+path(C,[[s.a,slice(s.a)],[s.b,slice(s.b)]],'pl-curve is-q','chord')+
        path(C,[[q.x,q.value],[q.x,q.prediction]],'pl-dash is-k','chord')+C.dot(q.x,q.value,5,'pl-mark pl-point is-o','chord')+
        C.dot(q.x,q.prediction,5,'pl-mark pl-point is-q','chord')+text(C,0,1.6,s.axis==='x'?'Slice along x, y = 0':'Slice along y, x = 0','chord')+
        text(C,0,1.4,'Straight chord and curved slice','chord');
    }
    function constraintMarkup(){
      var h='';[2/3,0.75,1,1.5,2,3].forEach(function(level){var points=[];for(var i=0;i<=100;i++){var t=i/100*2*Math.PI;points.push([Math.sqrt(level)*Math.cos(t),Math.sqrt(level/2)*Math.sin(t)]);}h+=path(L,points,'pl-contour','objective');});
      var q=constrained(s.theta),p=q.point,g=q.objectiveGradient;
      h+=path(L,[[-0.4,1.4],[1.4,-0.4]],'pl-curve is-q','constraint');
      h+=L.arrow(p[0],p[1],p[0]+0.18*g[0],p[1]+0.18*g[1],'is-o','objective');
      h+=L.arrow(p[0],p[1],p[0]+0.18*q.multiplier,p[1]+0.18*q.multiplier,'is-k pl-dash','normal');
      h+=L.dot(2/3,1/3,4,'pl-mark pl-point is-o','objective');
      h+=text(L,0.6,1.58,'Contours of x² + 2y²','objective');
      h+=text(L,0.6,-0.42,'Purple ∇f · coral scaled normal','normal');return h;
    }
    function shown(){return Math.max(1,Math.round(512*s.reveal));}
    function prefix(d){var n=shown(),positive=0;for(var i=0;i<n;i++)if(samples[d].eigenvalues[i].every(function(v){return v>0;}))positive++;return{count:n,positive:positive,fraction:positive/n};}
    function experimentMarkup(){
      var actual=[],estimate=[],h='';for(var d=1;d<=6;d++){var q=prefix(d);actual.push([d,q.fraction]);estimate.push([d,independentSigns(d)]);h+=text(E,d,-0.065,String(d),'dimensions');}
      h+=path(E,actual,'pl-curve is-o','sample')+path(E,estimate,'pl-dash is-k','estimate');
      actual.forEach(function(p){h+=E.dot(p[0],p[1],4,'pl-mark pl-point is-o','sample');});
      estimate.forEach(function(p){h+=E.dot(p[0],p[1],4,'pl-mark pl-point is-k','estimate');});
      h+=text(E,3.5,0.64,'Fraction with all eigenvalues positive','sample');
      h+=text(E,3.5,0.57,'Solid measured · dashed 2⁻ᵈ','estimate');return h;
    }
    var formulas={minimum:'f(x, y) = x² + y²',maximum:'f(x, y) = −x² − y²',saddle:'f(x, y) = x² − y²',flat:'f(x, y) = x⁴ + y²'};
    function draw(){
      var q=objective(s.kind,s.x,s.y),eig=eigenvalues(q.hessian),gn=Math.hypot(q.gradient[0],q.gradient[1]),c=constrained(s.theta),ch=chord(s.kind,s.axis,s.a,s.b,s.t),sample=prefix(s.d);
      var liveGradient=gn,liveCurvature=eig[0];
      if(s.view==='constraint'){liveGradient=Math.hypot.apply(Math,c.objectiveGradient);liveCurvature=2;}
      else if(s.view==='chord'){
        var slicePoint=objective(s.kind,s.axis==='x'?ch.x:0,s.axis==='y'?ch.x:0);
        liveGradient=Math.hypot.apply(Math,slicePoint.gradient);liveCurvature=eigenvalues(slicePoint.hessian)[0];
      }else if(s.view==='experiment'){liveGradient=liveCurvature='Not evaluated';}
      api.values({x:s.x,y:s.y,fx:q.value,stationaryGradient:liveGradient,smallestCurvature:liveCurvature,chordValue:ch.value,chordPrediction:ch.prediction,chordGap:ch.gap,
        theta:s.theta,constraintY:c.point[1],objectiveValue:c.value,tangentRate:Math.abs(c.tangentRate)<1e-10?0:c.tangentRate,multiplier:c.multiplier,
        d:String(s.d),positiveCount:String(sample.positive),sampleCount:String(sample.count),sampleFraction:sample.fraction,signEstimate:independentSigns(s.d)},4);
      var type=gn<1e-10?classify(eig):'not stationary';root.querySelector('[data-classification]').textContent=type[0].toUpperCase()+type.slice(1);
      root.querySelector('[data-formula]').innerHTML=window.InterviewDisplayMath.html('lab/optimisation-conditions/'+(s.view==='constraint'?'constraint':s.view==='experiment'?'experiment':s.kind), undefined, true);
      ['surface','chord','constraint','experiment'].forEach(function(k){boxes[k].hidden=s.view!==k;root.querySelector('[data-'+k+'-eq]').hidden=s.view!==k;ctl.querySelector('[data-zoom="'+(k==='surface'?'hessian':k)+'"]').hidden=s.view!==k;});
      ctl.querySelector('[data-kind-label]').hidden=s.view!=='surface'&&s.view!=='chord';
      ['axis','t'].forEach(function(k){ctl.querySelector('[data-'+k+'-label]').hidden=s.view!=='chord';});ctl.querySelector('[data-d-label]').hidden=s.view!=='experiment';
      ['view','kind','axis','t','d'].forEach(function(k){ctl.querySelector('[data-k="'+k+'"]').value=s[k];});progress.value=fraction;
      S.plot.innerHTML=surfaceMarkup();P.grid.innerHTML=P.axes();P.plot.innerHTML=pointMarkup();C.grid.innerHTML=C.axes();C.plot.innerHTML=chordMarkup();
      L.grid.innerHTML=L.axes();L.plot.innerHTML=constraintMarkup();E.grid.innerHTML=E.axes();E.plot.innerHTML=experimentMarkup();
      hp.set(s.x,s.y);ha.set(s.a,slice(s.a));hb.set(s.b,slice(s.b));hl.set(c.point[0],c.point[1]);he.set(s.d,sample.fraction);
      note.textContent=s.view==='surface'?(gn<1e-10?(type==='inconclusive'?'A zero curvature leaves this Hessian test inconclusive. Here, the fourth power still rises away from the origin.':'The gradient is 0 at the origin. Therefore, the signed curvatures classify this stationary point as a '+type+'.'):
        'The gradient has length '+fmt(gn,4)+'. Therefore, this selected point is not stationary; the curvature test alone cannot classify it.'):
        s.view==='chord'?(ch.gap>=-1e-10?'The curve lies at or below this chord point. However, convexity requires this inequality for every pair of points.':'The curve lies above this chord point. Therefore, this slice fails the convexity test.'):
        s.view==='constraint'?'The constraint gradient gives the normal direction, perpendicular to the line. Along the line, increasing x decreases y equally. Accordingly, the derivative along that change is '+fmt(c.tangentRate,4)+'.':
        'The sample uses '+sample.count+' matrices per dimension and seed 41. '+(sample.positive===0?'However, zero observed successes does not prove that positive curvature is impossible.':'The measured fraction describes this Gaussian matrix model; critical points of a chosen loss can follow another distribution.');
    }
    function report(){api.say(note.textContent);}
    function table(head,rows){return'<div class="lab-calculus-table"><table class="xp-table lab-table"><thead><tr>'+head.map(function(v){return'<th scope="col">'+v+'</th>';}).join('')+'</tr></thead><tbody>'+rows.map(function(row){return'<tr>'+row.map(function(v){return'<td>'+v+'</td>';}).join('')+'</tr>';}).join('')+'</tbody></table></div>';}
    function zoom(which,button){
      if(which==='hessian'){
        var q=objective(s.kind,s.x,s.y),e=eigenvalues(q.hessian),gn=Math.hypot.apply(Math,q.gradient);
        dlg.open('Hessian, worked','<p>The Hessian contains second derivatives at the selected point. Accordingly, its eigenvalues measure curvature along its principal directions.</p>'+table(['Quantity','Current value'],[
          ['Gradient',q.gradient.map(function(v){return fmt(v,4);}).join(', ')],['Hessian',q.hessian.map(function(row){return '['+row.map(function(v){return fmt(v,4);}).join(', ')+']';}).join(' ')],['Eigenvalues',e.map(function(v){return fmt(v,4);}).join(', ')],['Stationary classification',gn<1e-10?classify(e):'Not stationary']])+
          (s.kind==='flat'?('<p>At the origin, zero curvature makes the Hessian test inconclusive. However, the fourth power '+window.InterviewDisplayMath.html("lab/optimisation-conditions/worked-6", undefined, true)+' rises on both sides, so this function still has a minimum.</p>'):'<p>First check that the gradient is 0. After that, positive curvatures imply a strict local minimum. Conversely, negative curvatures imply a maximum, while mixed signs imply a saddle.</p>'),button);
      }else if(which==='chord'){
        var c=chord(s.kind,s.axis,s.a,s.b,s.t);
        dlg.open('Chord, worked','<p>A chord joins 2 points on the curve with a straight line. For a convex function, every intermediate curve value lies at or below that line.</p>'+table(['Quantity','Current value'],[
          ['Endpoints',fmt(s.a,4)+', '+fmt(s.b,4)],['Fraction t',fmt(s.t,4)],['Input (1 − t)a + tb',fmt(c.x,4)],['Curve value',fmt(c.value,4)],['Chord (1 − t)f(a) + tf(b)',fmt(c.prediction,4)],['Chord − curve',fmt(c.gap,4)]])+
          '<p>A nonnegative gap passes this comparison. However, a single passing comparison does not establish convexity across the domain.</p>',button);
      }else if(which==='constraint'){
        var q=constrained(s.theta);
        dlg.open('Constraint, worked',('<p>The constraint forces y = 1 − x. Therefore, the objective becomes '+window.InterviewDisplayMath.html("lab/optimisation-conditions/worked-0", undefined, true)+', with derivative 6x − 4.</p><p>The constraint gradient is perpendicular to the line. Accordingly, projecting ∇f onto ∇g gives the current normal ratio ϖ.</p>')+table(['Quantity','Current value'],[
          ['Point',q.point.map(function(v){return fmt(v,4);}).join(', ')],['Objective gradient ∇f',q.objectiveGradient.map(function(v){return fmt(v,4);}).join(', ')],['Constraint gradient ∇g','1, 1'],['Tangent derivative',fmt(q.tangentRate,4)],['Normal ratio',fmt(q.multiplier,4)]])+
          '<p>The minimum occurs at x = 2/3, y = 1/3. There, ∇f = (4/3, 4/3) = (4/3)∇g and f = 2/3.</p>',button);
      }else{
        var rows=[];for(var d=1;d<=6;d++){var sample=prefix(d);rows.push([d,sample.positive+' / '+sample.count,fmt(sample.fraction,4),fmt(independentSigns(d),4)]);}
        dlg.open('Random curvature, worked',('<p>Positive definite means every eigenvalue is positive. The Gaussian entries have mean 0 and standard deviation 1. After that, '+window.InterviewDisplayMath.html("lab/optimisation-conditions/extra-0", undefined, true)+' symmetrises each matrix.</p>')+
          '<p>Seed 41 fixes '+shown()+(' sampled matrices per dimension. Accordingly, the table separates their measured fractions from '+window.InterviewDisplayMath.html("lab/optimisation-conditions/extra-1", undefined, true)+', which assumes independent signs with positive probability 1/2.</p>')+table(['d','All positive','Measured',(''+window.InterviewDisplayMath.html("lab/optimisation-conditions/extra-1", undefined, true)+'')],rows)+
          table(['First matrix, selected d','Eigenvalues'],[[s.d,samples[s.d].eigenvalues[0].map(function(v){return fmt(v,4);}).join(', ')]])+
          '<p>The Gaussian matrix model determines these results. Therefore, the table alone does not determine the frequency of minima in a chosen loss.</p>',button);
      }
    }
    ctl.addEventListener('input',function(e){var k=e.target.getAttribute('data-k');if(k==='progress'){var requested=+e.target.value;api.interrupt();fraction=requested;s=interpolate(motion.from,motion.to,requested);draw();report();}else if(k==='t'||k==='d'){var next={};next[k]=+e.target.value;change(next);}});
    ctl.addEventListener('change',function(e){var k=e.target.getAttribute('data-k');if(['view','kind','axis'].indexOf(k)<0)return;var value=e.target.value,next={};next[k]=value;if(k==='view')next.reveal=1;change(next);});
    ctl.addEventListener('click',function(e){var b=e.target.closest('button');if(!b)return;api.interrupt();if(b.hasAttribute('data-zoom'))return zoom(b.getAttribute('data-zoom'),b);if(b.hasAttribute('data-reset'))return record(snapshot(),Object.assign({},initial),false);
      if(b.getAttribute('data-act')==='play'){var from=snapshot(),to=snapshot();if(s.view==='surface'){from.reveal=0;to.reveal=1;to.x=to.y=0;}else if(s.view==='chord'){from.t=0;to.t=1;}else if(s.view==='constraint')to.theta=2/3;else{from.reveal=0;to.reveal=1;}record(from,to,true);}});
    var PAGES=[
      {t:'Start at a minimum',parts:['surface','curvature','point'],state:{view:'surface'},body:('<p>At the origin, '+window.InterviewDisplayMath.html("lab/optimisation-conditions/worked-1", undefined, true)+' has gradient 0, making it a stationary point. Since both curvatures are 2, this point is a minimum.</p>')},
      {t:'Reverse both curvatures',parts:['surface','curvature','point'],state:{kind:'maximum'},body:('<p>The Hessian’s eigenvalues, its principal curvatures, are −2 and −2. Therefore, '+window.InterviewDisplayMath.html("lab/optimisation-conditions/worked-2", undefined, true)+' has a maximum at the origin despite gradient 0.</p>')},
      {t:'Mix upward and downward bends',parts:['surface','curvature','point'],state:{kind:'saddle'},body:('<p>For '+window.InterviewDisplayMath.html("lab/optimisation-conditions/worked-3", undefined, true)+', one direction rises while the other falls. Consequently, curvatures 2 and −2 identify the origin as a saddle.</p>')},
      {t:'Leave zero curvature unresolved',parts:['surface','curvature','point'],state:{kind:'flat'},body:('<p>For '+window.InterviewDisplayMath.html("lab/optimisation-conditions/worked-4", undefined, true)+', the Hessian has curvatures 0 and 2 at the origin. Therefore, this test is inconclusive; inspecting '+window.InterviewDisplayMath.html("lab/optimisation-conditions/worked-6", undefined, true)+' reveals the minimum.</p>')},
      {t:'Compare a curve with its chord',parts:['curve','chord'],state:{view:'chord'},body:'<p>A convex curve lies at or below every chord joining 2 of its points. Here, the square function has midpoint 0 below the chord height 1.</p>'},
      {t:'Check another direction',parts:['curve','chord'],state:{view:'chord',kind:'saddle',axis:'y'},body:('<p>The saddle’s y slice is '+window.InterviewDisplayMath.html("lab/optimisation-conditions/worked-5", undefined, true)+', with midpoint height 0 above the chord at −1. Therefore, this direction fails the convexity inequality.</p>')},
      {t:'Move along a constraint',parts:['constraint','objective','normal'],state:{view:'constraint'},body:'<p>With x + y = 1, the point (0.5, 0.5) gives objective 0.75. Along the constraint, its derivative is −1, so increasing x initially reduces the objective.</p>'},
      {t:'Align the gradients',parts:['constraint','objective','normal'],state:{view:'constraint',theta:2/3},body:'<p>At (2/3, 1/3), the tangent derivative is 0 and ∇f = (4/3)∇g. Accordingly, 4/3 is the Lagrange multiplier, the ratio between these aligned gradients.</p>'},
      {t:'Measure random curvatures',parts:['sample','estimate','dimensions'],state:{view:'experiment',d:3},body:('<p>Among 512 sampled Gaussian matrices with 3 dimensions, 16 have all eigenvalues positive. However, '+window.InterviewDisplayMath.html("lab/optimisation-conditions/worked-7", undefined, true)+' = 1/8 assumes independent curvature signs; the measured fraction is 1/32.</p>')}
    ];
    draw();report();XP.guide(root.querySelector('[data-guide-box]'),PAGES,function(p,i,redraw){if(!p){api.focus([]);return;}if(!redraw){api.interrupt();record(snapshot(),Object.assign({},initial,p.state),true);}api.focus(p.parts);});
  });
})();
