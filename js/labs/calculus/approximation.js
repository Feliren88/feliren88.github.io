(function(){
  function value(kind,x){return kind==='exp'?Math.exp(x):kind==='log1p'?(x>-1?Math.log1p(x):null):kind==='convex'?x*x+x*x*x*x/4:kind==='concave'?-x*x:kind==='linear'?x:null;}
  function derivative(kind,x){return kind==='exp'?Math.exp(x):kind==='log1p'?(x>-1?1/(1+x):null):kind==='convex'?2*x+x*x*x:kind==='concave'?-2*x:kind==='linear'?1:null;}
  function curvature(kind,x){return kind==='convex'?2+3*x*x:kind==='concave'?-2:kind==='linear'?0:null;}
  function coefficients(kind,a,order){
    if(order<0||!Number.isInteger(order)||(kind!=='exp'&&kind!=='log1p')||(kind==='log1p'&&a<=-1))return null;
    var c=[value(kind,a)],factorial=1;
    for(var n=1;n<=order;n++){factorial*=n;c.push(kind==='exp'?Math.exp(a)/factorial:(n%2?1:-1)/(n*Math.pow(1+a,n)));}return c;
  }
  function taylor(kind,a,x,order){var c=coefficients(kind,a,order);if(!c)return null;var sum=0;for(var n=c.length-1;n>=0;n--)sum=sum*(x-a)+c[n];return sum;}
  function newton(kind,x,count){
    if(count<0||!Number.isInteger(count)||curvature(kind,x)===null)return null;
    var path=[x],stalled=false;
    for(var i=0;i<count;i++){var h=curvature(kind,x);if(h===0){stalled=true;break;}x-=derivative(kind,x)/h;path.push(x);}
    return{path:path,steps:path.length-1,stalled:stalled,reason:stalled?'Zero curvature':null};
  }
  function descent(kind,x,step,count){
    if(count<0||!Number.isInteger(count)||derivative(kind,x)===null)return null;
    var path=[x];for(var i=0;i<count;i++){x-=step*derivative(kind,x);path.push(x);}return{path:path,steps:count,stalled:false};
  }
  function differenceError(kind,x,h){
    var exact=derivative(kind,x);if(h<=0||exact===null||value(kind,x-h)===null||value(kind,x+h)===null)return null;
    var estimate=(value(kind,x+h)-value(kind,x-h))/(2*h);
    return{h:h,estimate:estimate,exact:exact,error:Math.abs(estimate-exact),rounded:x+h===x||x-h===x};
  }
  var M={value:value,derivative:derivative,curvature:curvature,taylor:taylor,coefficients:coefficients,newton:newton,descent:descent,differenceError:differenceError};
  if(typeof module==='object'&&module.exports){module.exports=M;return;}
  XP.lab('calculus/approximation',function(root,api){
    var el=XP.svgEl,fmt=XP.fmt,stage=root.querySelector('[data-stage]'),ctl=root.querySelector('[data-ctl]'),note=root.querySelector('[data-note]');
    var initial={view:'taylor',kind:'exp',a:0,x:1,order:1,surface:'convex',start:1,eta:0.1,count:1,exponent:4};
    var s=Object.assign({},initial),fraction=1,dragStart=null,motion={from:Object.assign({},s),to:Object.assign({},s)},dlg=XP.dialog(root);
    stage.innerHTML='<div data-view="taylor"><div data-exp></div><div data-log1p hidden></div></div><div data-view="newton" hidden><div data-objective></div><div data-paths></div><div data-step-size></div></div><div data-view="difference" hidden></div>';
    function plane(node,x,y,h,label){var p=XP.plane(node,{x:x,y:y,w:400,h:h,pad:28,label:label});p.grid.innerHTML=p.axes();return p;}
    var T={exp:plane(stage.querySelector('[data-exp]'),[-1,2.3],[-4,10],400,'Exponential curve and its Taylor polynomial; drag the expansion point or evaluation input'),
      log1p:plane(stage.querySelector('[data-log1p]'),[-1,2.3],[-4,3],400,'Logarithm curve, Taylor polynomial and the right convergence boundary')};
    var N=plane(stage.querySelector('[data-objective]'),[-1.9,1.9],[-3.5,6],330,'Objective, local quadratic, Newton vertex and gradient descent step');
    var C=plane(stage.querySelector('[data-paths]'),[-0.6,8.6],[-2.2,2.2],230,'Input after each update; compare Newton and gradient descent');
    var E=plane(stage.querySelector('[data-step-size]'),[0,0.23],[-0.4,0.7],120,'Drag the gradient descent step size along this number line');
    var D=plane(stage.querySelector('[data-view="difference"]'),[-17,-0.3],[-19,2],400,'Logarithmic axes for finite difference step h and absolute derivative error');
    ctl.innerHTML='<button type="button" data-act="play">Play the change</button><label>Motion <input data-k="progress" type="range" min="0" max="1" step="0.01" value="1" aria-label="Scrub the recorded change"></label>'+ 
      '<label>View <select data-k="view"><option value="taylor">Taylor polynomial</option><option value="newton">Newton and descent</option><option value="difference">Numerical derivative error</option></select></label>'+ 
      '<label data-function-control>Function <select data-k="kind"><option value="exp">eˣ</option><option value="log1p">ln(1 + x)</option></select></label>'+ 
      '<label data-control="taylor">Order <input data-k="order" type="range" min="0" max="8" step="1" value="1" aria-label="Taylor polynomial order"></label>'+ 
      '<label data-control="newton" hidden>Objective <select data-k="surface"><option value="convex">Convex quartic</option><option value="concave">Negative square</option><option value="linear">x, zero curvature</option></select></label>'+
      '<label data-control="newton" hidden>Updates <input data-k="count" type="range" min="0" max="8" step="1" value="1" aria-label="Number of optimisation updates"></label>'+ 
      '<label data-control="difference" hidden>Step exponent <input data-k="exponent" type="range" min="1" max="16" step="1" value="4" aria-label="Negative base 10 exponent of h"></label>'+ 
      '<button type="button" data-zoom="taylor">Taylor terms, worked</button><button type="button" data-zoom="newton" hidden>Updates, worked</button><button type="button" data-zoom="difference" hidden>Difference, worked</button><button type="button" data-reset>Reset</button>';
    var progress=ctl.querySelector('[data-k="progress"]');
    function snapshot(){return Object.assign({},s);}
    function clamp(x,a,b){return Math.max(a,Math.min(b,x));}
    function normalise(next){var v=Object.assign(snapshot(),next);v.a=clamp(v.a,0,1);v.x=clamp(v.x,-0.75,2);v.start=clamp(v.start,-1.5,1.5);v.eta=clamp(v.eta,0.02,0.2);['order','count'].forEach(function(k){v[k]=Math.round(clamp(v[k],0,8));});v.exponent=Math.round(clamp(v.exponent,1,16));return v;}
    function interpolate(from,to,f){return normalise(XP.mix(from,to,XP.ease(f)));}
    function record(from,to,play){api.interrupt();motion={from:from,to:to};if(play)api.animate(from,to,750,function(st,f){s=interpolate(from,to,f);fraction=f;draw();},report);else{s=Object.assign({},to);fraction=1;draw();report();}}
    function change(next){api.interrupt();record(snapshot(),normalise(next),false);}
    function handle(p,config,key){var h=p.handle(config);h.el.setAttribute('data-handle',key);h.el.addEventListener('pointerdown',function(){dragStart=snapshot();});return h;}
    function move(next,done){api.interrupt();record(dragStart||snapshot(),normalise(next),false);if(done)dragStart=null;}
    var ha={},hx={};['exp','log1p'].forEach(function(k){
      ha[k]=handle(T[k],{x:0,y:value(k,0),snap:0.05,bounds:[[0,1],[-3,8]],cls:'is-q',part:'taylor',label:'Taylor expansion point',onMove:function(x,y,done){move({a:x},done);}},'expansion-'+k);
      hx[k]=handle(T[k],{x:1,y:value(k,1),snap:0.05,bounds:[[-0.75,2],[-3,8]],cls:'is-o',part:'error',label:'Taylor evaluation input',onMove:function(x,y,done){move({x:x},done);}},'evaluation-'+k);
    });
    var hn=handle(N,{x:1,y:1.25,snap:0.05,bounds:[[-1.5,1.5],[-2.3,3.6]],cls:'is-q',part:'newton',label:'Optimisation starting input',onMove:function(x,y,done){move({start:x},done);}},'start');
    var he=handle(E,{x:0.1,y:0,snap:0.01,bounds:[[0.02,0.2],[-0.1,0.1]],cls:'is-k',part:'descent',label:'Gradient descent step size',onMove:function(x,y,done){move({eta:x},done);}},'step-size');
    var hd=handle(D,{x:-4,y:-8.34,snap:1,bounds:[[-16,-1],[-18,1]],cls:'is-q',part:'difference',label:'Logarithmic finite difference step',onMove:function(x,y,done){move({exponent:-x},done);}},'difference-step');
    function text(p,x,y,words,part){var formulas={"Vertical axis log\u2081\u2080 absolute error": "lab/approximation/svg-0", "Horizontal axis log\u2081\u2080 h": "lab/approximation/svg-1"}; if(formulas[words]){return '<foreignObject x="'+(p.map.sx(x)-150)+'" y="'+(p.map.sy(y)-17)+'" width="300" height="44" data-part="'+part+'"><div xmlns="http://www.w3.org/1999/xhtml" style="text-align:center;font-size:13px">'+window.InterviewDisplayMath.html(formulas[words], undefined, true)+'</div></foreignObject>';} return el('text',{x:p.map.sx(x),y:p.map.sy(y),'text-anchor':'middle','data-part':part},XP.esc(words));}
    function line(p,pts,cls,part){return el('polyline',{points:p.pts(pts),'class':'pl-mark '+cls,'data-part':part});}
    function points(a,b,fn){var pts=[];for(var i=0;i<=100;i++){var x=a+(b-a)*i/100;pts.push([x,fn(x)]);}return pts;}
    function quadraticAt(x){var dx=x-s.start;return value(s.surface,s.start)+derivative(s.surface,s.start)*dx+curvature(s.surface,s.start)*dx*dx/2;}
    function taylorMarkup(){var p=T[s.kind],truePoints=points(-0.75,2,function(x){return value(s.kind,x);}),polyPoints=points(-0.75,2,function(x){return taylor(s.kind,s.a,x,s.order);});
      var between=points(s.a,s.x,function(x){return value(s.kind,x);}).concat(points(s.x,s.a,function(x){return taylor(s.kind,s.a,x,s.order);}));
      var h=el('polygon',{points:p.pts(between),'class':'pl-integral is-k','data-part':'error'})+line(p,truePoints,'pl-curve is-q','taylor')+line(p,polyPoints,'pl-curve is-o','taylor');
      if(s.kind==='log1p'){var boundary=1+2*s.a;if(boundary<=2)h+=line(p,[[boundary,-3.8],[boundary,2.25]],'pl-dash is-k','error');}
      h+=text(p,0.65,s.kind==='exp'?9:2.5,'Blue function · purple polynomial','taylor');p.plot.innerHTML=h;ha[s.kind].set(s.a,value(s.kind,s.a));hx[s.kind].set(s.x,value(s.kind,s.x));
    }
    function optimisationMarkup(n,g,first){var h=line(N,points(-1.7,1.7,function(x){return value(s.surface,x);}), 'pl-curve is-q','newton')+
      line(N,points(-1.7,1.7,quadraticAt),'pl-dash is-o','newton');
      if(!first.stalled){var nx=first.path[1];h+=N.dot(nx,quadraticAt(nx),5,'pl-mark pl-point is-o','newton')+line(N,[[nx,quadraticAt(nx)],[nx,value(s.surface,nx)]],'pl-dash is-o','newton');}
      var gx=s.start-s.eta*derivative(s.surface,s.start);h+=N.dot(gx,value(s.surface,gx),5,'pl-mark pl-point is-k','descent');
      h+=text(N,0,5.5,'Dashed local quadratic · purple vertex','newton')+text(N,0,4.9,'Coral gradient descent step','descent');N.plot.innerHTML=h;
      function path(q){return q.path.map(function(x,i){return[i,x];});}
      var ch=line(C,path(n),'pl-curve is-o','newton')+line(C,path(g),'pl-curve is-k','descent');
      n.path.forEach(function(x,i){ch+=C.dot(i,x,3,'pl-mark pl-point is-o','newton');});g.path.forEach(function(x,i){ch+=C.dot(i,x,3,'pl-mark pl-point is-k','descent');});
      ch+=text(C,4,1.95,'Input after each update','newton')+text(C,4,-1.95,'Updates 0 → 8','descent');C.plot.innerHTML=ch;
      E.plot.innerHTML=text(E,0.115,0.48,'Descent step size η','descent');hn.set(s.start,value(s.surface,s.start));he.set(s.eta,0);
    }
    function differenceMarkup(){var pts=[],h='';for(var e=1;e<=16;e++){var q=differenceError(s.kind,s.x,Math.pow(10,-e)),y=Math.log10(Math.max(q.error,1e-18));pts.push([-e,y]);h+=D.dot(-e,y,3,'pl-mark pl-point is-o','difference');}
      h+=line(D,pts,'pl-curve is-o','difference')+text(D,-8.5,0.8,'Vertical axis log₁₀ absolute error','difference')+text(D,-8.5,-18.1,'Horizontal axis log₁₀ h','difference');
      [-16,-12,-8,-4,-1].forEach(function(x){h+=text(D,x,-16.6,String(x),'difference');});[-12,-8,-4,0].forEach(function(y){h+=text(D,-16.3,y,String(y),'difference');});D.plot.innerHTML=h;
      var q=differenceError(s.kind,s.x,Math.pow(10,-s.exponent));hd.set(-s.exponent,Math.log10(Math.max(q.error,1e-18)));
    }
    function errorText(x){return x!==0&&x<0.001?x.toExponential(3):x;}
    function draw(){var n=newton(s.surface,s.start,s.count),g=descent(s.surface,s.start,s.eta,s.count),first=newton(s.surface,s.start,1),nx=first.stalled?null:first.path[1],gx=s.start-s.eta*derivative(s.surface,s.start);
      var approx=taylor(s.kind,s.a,s.x,s.order),exact=value(s.kind,s.x),err=Math.abs(approx-exact),q=differenceError(s.kind,s.x,Math.pow(10,-s.exponent));
      if(s.view==='difference'){approx=q.estimate;exact=q.exact;err=q.error;}else if(s.view==='newton')approx=exact=err='Not evaluated';
      api.values({a:s.a,x:s.x,order:String(s.order),approximation:approx,exact:exact,error:typeof err==='number'?errorText(err):err,start:s.start,startValue:value(s.surface,s.start),eta:s.eta,
        newtonNext:s.view==='newton'?(nx===null?'Unavailable':nx):'Not evaluated',newtonAfter:nx===null?'Unavailable':value(s.surface,nx),descentNext:gx,newtonSteps:String(n.steps),descentSteps:String(g.steps),newtonEnd:n.path[n.path.length-1],descentEnd:g.path[g.path.length-1],h:Math.pow(10,-s.exponent).toExponential(1)},4);
      root.querySelector('[data-formula]').innerHTML=s.view==='newton'?(s.surface==='convex'?window.InterviewDisplayMath.html("lab/approximation/convex", undefined, true):s.surface==='concave'?window.InterviewDisplayMath.html("lab/approximation/concave", undefined, true):window.InterviewDisplayMath.html("lab/approximation/linear", undefined, true)):s.view==='taylor'?(s.kind==='exp'?window.InterviewDisplayMath.html("lab/approximation/exp-taylor", {order:s.order}, true):window.InterviewDisplayMath.html("lab/approximation/log-taylor", {order:s.order}, true)):(s.kind==='exp'?window.InterviewDisplayMath.html("lab/approximation/exp-difference", undefined, true):window.InterviewDisplayMath.html("lab/approximation/log-difference", undefined, true));
      stage.querySelectorAll('[data-view]').forEach(function(e){e.hidden=e.getAttribute('data-view')!==s.view;});stage.querySelector('[data-exp]').hidden=s.kind!=='exp';stage.querySelector('[data-log1p]').hidden=s.kind!=='log1p';
      root.querySelector('[data-taylor-readout]').hidden=s.view!=='taylor';root.querySelectorAll('[data-approximation-readout]').forEach(function(e){e.hidden=s.view==='newton';});
      root.querySelectorAll('[data-newton-readout]').forEach(function(e){e.hidden=s.view!=='newton';});root.querySelector('[data-difference-readout]').hidden=s.view!=='difference';
      ctl.querySelector('[data-function-control]').hidden=s.view==='newton';ctl.querySelectorAll('[data-control]').forEach(function(e){e.hidden=e.getAttribute('data-control')!==s.view;});
      ctl.querySelectorAll('[data-zoom]').forEach(function(e){e.hidden=e.getAttribute('data-zoom')!==s.view;});['view','kind','order','surface','count','exponent'].forEach(function(k){ctl.querySelector('[data-k="'+k+'"]').value=s[k];});progress.value=fraction;
      if(s.view==='taylor')taylorMarkup();else if(s.view==='newton')optimisationMarkup(n,g,first);else differenceMarkup();
      note.textContent=s.view==='taylor'?(s.kind==='exp'?'A Taylor polynomial matches derivatives at the expansion point. Nearby, extra terms usually improve the fit. The shaded gap shows the approximation error.':
        'The convergence radius gives the interval where increasing order approaches the function. Here, |x − a| < 1 + a lies inside it. '+(Math.abs(Math.abs(s.x-s.a)-(1+s.a))<1e-10?'The input is on the positive boundary. Here, the alternating series converges, although convergence is slower.':Math.abs(s.x-s.a)>1+s.a?'The chosen input lies outside that interval. Therefore, additional terms can worsen the error.':'The selected input lies inside that interval.')+' The plot clips polynomial heights beyond its vertical range.'):
        s.view==='newton'?(first.stalled?'Zero curvature leaves no quadratic vertex. Therefore, Newton cannot divide by f″, and its update is unavailable.':s.surface==='concave'?'Negative curvature makes the local parabola open downward. Therefore, its vertex is a maximum, and Newton moves uphill.':'Newton moves to the local quadratic’s vertex. Meanwhile, gradient descent scales the slope by its step size.')+(g.path.some(function(x){return Math.abs(x)>2.2;})?' The descent path continues beyond the pictured input range.':''):
        'A central difference estimates slope using values on both sides of x. Large h leaves approximation error; tiny h loses digits through subtraction. '+(q.rounded?'Here, rounding erased the input change.':'')+' Zero error, if observed, appears at the plot floor, ten to the power minus eighteen.';
    }
    function report(){api.say(note.textContent);}
    function table(head,rows){return'<div class="lab-calculus-table"><table class="xp-table lab-table"><thead><tr>'+head.map(function(x){return'<th scope="col">'+x+'</th>';}).join('')+'</tr></thead><tbody>'+rows.map(function(row){return'<tr>'+row.map(function(x){return'<td>'+x+'</td>';}).join('')+'</tr>';}).join('')+'</tbody></table></div>';}
    function zoom(which,button){
      if(which==='taylor'){var c=coefficients(s.kind,s.a,s.order),rows=c.map(function(v,i){return[i,fmt(v,6),fmt(v*Math.pow(s.x-s.a,i),6)];});
        dlg.open('Taylor terms, worked',('<p>The coefficient '+window.InterviewDisplayMath.html("lab/approximation/worked-1", undefined, true)+' is the nth derivative at a divided by n!. Accordingly, each term contributes '+window.InterviewDisplayMath.html("lab/approximation/worked-0", undefined, true)+'.</p>')+table(['Order n','Coefficient','Current term'],rows)+
          table(['Quantity','Current value'],[['Expansion a',fmt(s.a,6)],['Input x',fmt(s.x,6)],['Polynomial',fmt(taylor(s.kind,s.a,s.x,s.order),6)],['Exact function',fmt(value(s.kind,s.x),6)]])+'<p>For ln(1 + x), the radius is 1 + a. However, a finite polynomial remains evaluable outside that radius without guaranteeing convergence.</p>',button);
      }else if(which==='newton'){var n=newton(s.surface,s.start,s.count),g=descent(s.surface,s.start,s.eta,s.count),rows=[];for(var i=0;i<=s.count;i++)rows.push([i,i<n.path.length?fmt(n.path[i],6):'Stalled',fmt(g.path[i],6)]);
        var h=curvature(s.surface,s.start),next=h===0?'Unavailable':fmt(s.start-derivative(s.surface,s.start)/h,6);
        dlg.open('Optimisation updates, worked',('<p>Newton uses '+window.InterviewDisplayMath.html("lab/approximation/extra-0", undefined, true)+'. Meanwhile, gradient descent uses '+window.InterviewDisplayMath.html("lab/approximation/extra-1", undefined, true)+', with step size η.</p>')+table(['First-step quantity','Current value'],[['Start',fmt(s.start,6)],['Slope',fmt(derivative(s.surface,s.start),6)],['Curvature',fmt(h,6)],['Newton candidate',next],['Descent step size',fmt(s.eta,6)]])+table(['Update','Newton input','Descent input'],rows)+
          '<p>Positive curvature gives a local quadratic minimum. However, negative curvature gives a maximum, while zero curvature makes division undefined.</p>',button);
      }else{var h=Math.pow(10,-s.exponent),q=differenceError(s.kind,s.x,h);
        dlg.open('Numerical derivative, worked','<p>The central difference subtracts f(x − h) from f(x + h), then divides by 2h. However, floating-point arithmetic stores rounded values with finite precision.</p>'+table(['Quantity','Current value'],[['x',fmt(s.x,6)],['h',h.toExponential(3)],['f(x + h)',value(s.kind,s.x+h).toPrecision(17)],['f(x − h)',value(s.kind,s.x-h).toPrecision(17)],['Difference estimate',q.estimate.toPrecision(17)],['Exact derivative',q.exact.toPrecision(17)],['Absolute error',q.error.toExponential(6)],['Input perturbation rounded away',q.rounded?'Yes':'No']])+ '<p>Reducing h first decreases approximation error. After that, subtraction and division can magnify rounding error, so smaller h can become less accurate.</p>',button);
      }
    }
    ctl.addEventListener('input',function(e){var k=e.target.getAttribute('data-k');if(k==='progress'){var requested=+e.target.value;api.interrupt();fraction=requested;s=interpolate(motion.from,motion.to,requested);draw();report();}else if(['order','count','exponent'].indexOf(k)>=0){var next={};next[k]=+e.target.value;change(next);}});
    ctl.addEventListener('change',function(e){var k=e.target.getAttribute('data-k');if(['view','kind','surface'].indexOf(k)<0)return;var value=e.target.value,next={};next[k]=value;change(next);});
    ctl.addEventListener('click',function(e){var b=e.target.closest('button');if(!b)return;api.interrupt();if(b.hasAttribute('data-zoom'))return zoom(b.getAttribute('data-zoom'),b);if(b.hasAttribute('data-reset'))return record(snapshot(),Object.assign({},initial),false);
      if(b.getAttribute('data-act')==='play'){var from=snapshot(),to=snapshot();if(s.view==='taylor'){from.order=Math.min(s.order,1);to.order=8;}else if(s.view==='newton'){from.count=0;to.count=8;}else{from.exponent=1;to.exponent=16;}record(from,to,true);}});
    var PAGES=[
      {t:'Match a slope near the centre',parts:['taylor','error'],state:{},body:'<p>A Taylor polynomial matches derivatives at an expansion point. For eˣ around 0, the linear polynomial gives 2 at x = 1, approximately 0.7183 below e.</p>'},
      {t:'Add the curvature term',parts:['taylor','error'],state:{order:2},body:('<p>The quadratic term adds '+window.InterviewDisplayMath.html("lab/approximation/worked-3", undefined, true)+' to 1 + x. Therefore, the approximation at x = 1 rises to 2.5, reducing absolute error to 0.2183.</p>')},
      {t:'Retain more local information',parts:['taylor','error'],state:{order:6},body:'<p>Order 6 retains derivatives through the sixth derivative. Consequently, the approximation at x = 1 is 2.718056, with absolute error approximately 0.000226.</p>'},
      {t:'Establish the convergence interval',parts:['taylor','error'],state:{kind:'log1p',x:0.5,order:4},body:'<p>The convergence radius bounds where adding Taylor terms approaches the function. For ln(1 + x) around 0, x = 0.5 lies inside radius 1.</p>'},
      {t:'Evaluate beyond that interval',parts:['taylor','error'],state:{kind:'log1p',x:1.5,order:8},body:'<p>At x = 1.5, order 8 gives −0.9081 against ln(2.5) ≈ 0.9163. Accordingly, its error exceeds order 4’s error because this input lies outside radius 1.</p>'},
      {t:'Move to the local vertex',parts:['newton','descent'],state:{view:'newton'},body:('<p>For '+window.InterviewDisplayMath.html("lab/approximation/worked-2", undefined, true)+' at x = 1, slope 3 and curvature 5 give Newton input 0.4. Meanwhile, descent with step size 0.1 moves to 0.7.</p>')},
      {t:'Compare successive updates',parts:['newton','descent'],state:{view:'newton',count:8},body:'<p>Both paths now contain 8 updates from the same starting point. Here, Newton approaches 0 sooner by dividing each slope by the current curvature.</p>'},
      {t:'Let negative curvature point uphill',parts:['newton','descent'],state:{view:'newton',surface:'concave'},body:('<p>For '+window.InterviewDisplayMath.html("lab/approximation/worked-4", undefined, true)+' at x = 1, Newton moves to 0. However, the objective rises from −1 to 0 because the local vertex is a maximum.</p>')},
      {t:'Leave zero curvature unresolved',parts:['newton','descent'],state:{view:'newton',surface:'linear'},body:'<p>For f(x) = x, the slope is 1 and curvature is 0. Therefore, Newton has no finite quadratic vertex and its update remains unavailable.</p>'},
      {t:'Balance approximation and rounding',parts:['difference'],state:{view:'difference'},body:'<p>A central difference uses values at x − h and x + h to estimate slope. However, tiny h can lose digits when nearly equal values are subtracted.</p>'}
    ];
    draw();report();XP.guide(root.querySelector('[data-guide-box]'),PAGES,function(p,i,redraw){if(!p){api.focus([]);return;}if(!redraw){api.interrupt();var to=Object.assign({},initial,p.state),from=snapshot();['view','kind','surface'].forEach(function(k){from[k]=to[k];});record(normalise(from),to,true);}api.focus(p.parts);});
  });
})();
