(function () {
  function surface(x, y) { return x*x + 2*y*y + 0.2*x*y; }
  function gradient(x, y) { return [2*x + 0.2*y, 4*y + 0.2*x]; }
  function hessian() { return [[2, 0.2], [0.2, 4]]; }
  function mapping(x, y) { return [x + 0.2*y*y, y + 0.2*x*x]; }
  function jacobian(x, y) { return [[1, 0.4*y], [0.4*x, 1]]; }
  function directional(x, y, theta) {
    var g = gradient(x, y); return g[0]*Math.cos(theta) + g[1]*Math.sin(theta);
  }
  function shapes(d, m) { return {gradient: [d, 1], jacobian: [m, d], hessian: [d, d]}; }
  function eigenSystem() {
    var theta = 0.5 * Math.atan2(0.4, -2), radius = Math.sqrt(1.04);
    return {values: [3-radius, 3+radius], vectors: [[-Math.sin(theta), Math.cos(theta)], [Math.cos(theta), Math.sin(theta)]]};
  }
  var M = {surface: surface, gradient: gradient, hessian: hessian, mapping: mapping,
    jacobian: jacobian, directional: directional, shapes: shapes, eigenSystem: eigenSystem};
  if (typeof module === 'object' && module.exports) { module.exports = M; return; }
  XP.lab('calculus/gradients-jacobians-hessians', function (root, api) {
    var el = XP.svgEl, fmt = XP.fmt, stage = root.querySelector('[data-stage]');
    var ctl = root.querySelector('[data-ctl]'), note = root.querySelector('[data-note]'), eig = eigenSystem();
    var initial = {view:'contours', x:1, y:0.5, theta:0, epsilon:0.5, warp:1, axes:1, d:3, m:2, reveal:1};
    var s = Object.assign({},initial), fraction = 1, dragStart = null;
    var motion = {from:Object.assign({},s),to:Object.assign({},s)};
    stage.innerHTML = '<div data-contours><div data-plane></div><div data-cosine></div></div>' +
      '<div data-mapping hidden><div data-grid></div><div data-local></div></div><div data-curvature hidden></div><div data-shapes hidden></div>';
    var contourBox = stage.querySelector('[data-contours]'), mapBox = stage.querySelector('[data-mapping]');
    var curvatureBox = stage.querySelector('[data-curvature]'), shapeBox = stage.querySelector('[data-shapes]');
    var P = XP.plane(contourBox.querySelector('[data-plane]'),{x:[-2.8,2.8],y:[-2.8,2.8],w:400,h:400,pad:28,label:'Contours, gradient arrows and a unit direction at the selected point'});
    var C = XP.plane(contourBox.querySelector('[data-cosine]'),{x:[-0.25,2*Math.PI+0.25],y:[-8,8],w:400,h:200,pad:28,label:'Directional rate against the angle measured from the x axis'});
    var Q = XP.plane(mapBox.querySelector('[data-grid]'),{x:[-2.8,3.4],y:[-2.8,3.4],w:400,h:400,pad:28,label:'A nonlinear map bends a grid and a small square'});
    var R = XP.plane(mapBox.querySelector('[data-local]'),{x:[-0.8,2.2],y:[-0.8,2.2],w:400,h:400,pad:28,label:'Mapped displacements divided by the square size, compared with the Jacobian'});
    var T = XP.plane(curvatureBox,{x:[-2.8,2.8],y:[-2.8,2.8],w:400,h:400,pad:28,label:'Quadratic contours and the Hessian eigenvectors'});
    var dlg = XP.dialog(root);
    ctl.innerHTML = '<button type="button" data-act="play">Play the change</button>' +
      '<label>Motion <input data-k="progress" type="range" min="0" max="1" step="0.01" value="1" aria-label="Scrub the recorded change"></label>' +
      '<label>View <select data-k="view"><option value="contours">Contours and direction</option><option value="mapping">Grid and local map</option><option value="curvature">Curvature</option><option value="shapes">Shape comparison</option></select></label>' +
      '<label data-epsilon-label hidden>Square size ε <input data-k="epsilon" type="range" min="0.05" max="0.6" step="0.01" value="0.5" aria-label="Input square size"></label>' +
      '<label data-d-label hidden>Inputs d <input data-k="d" type="range" min="1" max="6" step="1" value="3" aria-label="Number of inputs"></label>' +
      '<label data-m-label hidden>Outputs m <input data-k="m" type="range" min="1" max="6" step="1" value="2" aria-label="Number of outputs"></label>' +
      '<button type="button" data-zoom="partials">Partials, worked</button><button type="button" data-zoom="jacobian" hidden>Jacobian, worked</button>' +
      '<button type="button" data-zoom="curvature" hidden>Curvature, worked</button><button type="button" data-zoom="shapes" hidden>Shapes, worked</button><button type="button" data-reset>Reset</button>';
    var progress = ctl.querySelector('[data-k="progress"]'), viewInput = ctl.querySelector('[data-k="view"]');
    function snapshot() { return Object.assign({},s); }
    function clamp(x,lo,hi) { return Math.max(lo,Math.min(hi,x)); }
    function normalise(next) {
      var t = Object.assign(snapshot(),next);
      t.x = clamp(t.x,-1.5,1.5); t.y = clamp(t.y,-1.5,1.5); t.epsilon = clamp(t.epsilon,0.05,0.6);
      t.d = Math.round(clamp(t.d,1,6)); t.m = Math.round(clamp(t.m,1,6)); return t;
    }
    function interpolate(from,to,f) {
      var t = XP.mix(from,to,XP.ease(f)); t.d = f < 0.5 ? from.d : to.d; t.m = f < 0.5 ? from.m : to.m; return t;
    }
    function record(from,to,play) {
      api.interrupt(); motion = {from:from,to:to};
      if(play) api.animate(from,to,750,function(st,f){s=interpolate(from,to,f);fraction=f;draw();},report);
      else {s=Object.assign({},to);fraction=1;draw();report();}
    }
    function change(next) {api.interrupt();record(snapshot(),normalise(next),false);}
    function pointHandle(plane) {
      var h = plane.handle({x:s.x,y:s.y,snap:0.05,bounds:[[-1.5,1.5],[-1.5,1.5]],cls:'is-q',part:'point',label:'Input point',
        onMove:function(x,y,done){api.interrupt();record(dragStart||snapshot(),normalise({x:x,y:y}),false);if(done)dragStart=null;}});
      h.el.setAttribute('data-handle','point'); h.el.addEventListener('pointerdown',function(){dragStart=snapshot();}); return h;
    }
    var hp = pointHandle(P), hmap = pointHandle(Q);
    var hu = P.handle({x:s.x+1,y:s.y,snap:0.05,bounds:[[-2.6,2.6],[-2.6,2.6]],cls:'is-k',part:'direction',label:'Unit direction',
      onMove:function(x,y,done){
        api.interrupt(); var dx=x-s.x,dy=y-s.y;
        if(Math.hypot(dx,dy)>1e-8) record(dragStart||snapshot(),normalise({theta:Math.atan2(dy,dx)}),false);
        if(done)dragStart=null;
      }});
    hu.el.setAttribute('data-handle','direction'); hu.el.addEventListener('pointerdown',function(){dragStart=snapshot();});
    function text(plane,x,y,words,part) {return el('text',{x:plane.map.sx(x),y:plane.map.sy(y),'text-anchor':'middle','data-part':part},XP.esc(words));}
    function path(plane,points,cls,part,closed) {
      return el(closed?'polygon':'polyline',{points:plane.pts(points),'class':'pl-mark '+cls,'data-part':part});
    }
    function ellipse(level) {
      var points=[];
      for(var i=0;i<=100;i++) {
        var theta=i/100*2*Math.PI,a=Math.sqrt(2*level/eig.values[0])*Math.cos(theta),b=Math.sqrt(2*level/eig.values[1])*Math.sin(theta);
        points.push([a*eig.vectors[0][0]+b*eig.vectors[1][0],a*eig.vectors[0][1]+b*eig.vectors[1][1]]);
      }
      return points;
    }
    function contours(plane,part) {return [0.5,1,2,4,8].map(function(level){return path(plane,ellipse(level),'pl-contour',part,false);}).join('');}
    function contourMarkup() {
      var h=contours(P,'contours'), g=gradient(s.x,s.y), norm=Math.hypot(g[0],g[1]);
      for(var x=-2;x<=2;x+=0.5) for(var y=-2;y<=2;y+=0.5) {
        var v=gradient(x,y),n=Math.hypot(v[0],v[1]);
        if(n)h+=P.arrow(x,y,x+0.22*v[0]/n,y+0.22*v[1]/n,'is-o','field');
      }
      if(norm) h+=P.arrow(s.x,s.y,s.x+0.85*g[0]/norm,s.y+0.85*g[1]/norm,'is-o','gradient');
      h+=el('circle',{cx:P.map.sx(s.x),cy:P.map.sy(s.y),r:Math.abs(P.map.sx(1)-P.map.sx(0)),'class':'pl-dash pl-mark is-k','data-part':'direction'});
      h+=P.arrow(s.x,s.y,s.x+Math.cos(s.theta),s.y+Math.sin(s.theta),'is-k','direction');
      h+=text(P,0,2.55,'Arrows show directions','gradient');
      return h;
    }
    function cosineMarkup() {
      var points=[];
      for(var i=0;i<=120;i++){var theta=i/120*2*Math.PI;points.push([theta,directional(s.x,s.y,theta)]);}
      var angle=((s.theta%(2*Math.PI))+2*Math.PI)%(2*Math.PI);
      return path(C,points,'pl-curve is-o','cosine',false)+C.dot(angle,directional(s.x,s.y,s.theta),6,'pl-mark pl-point is-k','direction')+
        text(C,Math.PI,6.6,'Rate against angle from x axis','cosine')+text(C,0,-6.5,'0','cosine')+text(C,Math.PI,-6.5,'π','cosine')+text(C,2*Math.PI,-6.5,'2π','cosine');
    }
    function currentMap(x,y) {return [x+0.2*s.warp*y*y,y+0.2*s.warp*x*x];}
    function currentJacobian() {return [[1,0.4*s.warp*s.y],[0.4*s.warp*s.x,1]];}
    function squarePoints() {
      var points=[];
      [[0,0,1,0],[1,0,1,1],[1,1,0,1],[0,1,0,0]].forEach(function(edge){
        for(var i=0;i<16;i++){var t=i/16;points.push([edge[0]+t*(edge[2]-edge[0]),edge[1]+t*(edge[3]-edge[1])]);}
      });
      points.push([0,0]);return points;
    }
    function mappedPatch(local,linear) {
      var origin=currentMap(s.x,s.y),J=currentJacobian();
      return squarePoints().map(function(v){
        if(linear)return [J[0][0]*v[0]+J[0][1]*v[1],J[1][0]*v[0]+J[1][1]*v[1]];
        var q=currentMap(s.x+s.epsilon*v[0],s.y+s.epsilon*v[1]);
        return local?[(q[0]-origin[0])/s.epsilon,(q[1]-origin[1])/s.epsilon]:q;
      });
    }
    function patchError() {
      var actual=mappedPatch(true,false),linear=mappedPatch(true,true),max=0;
      for(var i=0;i<actual.length;i++)max=Math.max(max,s.epsilon*Math.hypot(actual[i][0]-linear[i][0],actual[i][1]-linear[i][1]));
      return max;
    }
    function mapMarkup() {
      var grid=XP.gridSegments([-2,2],[-2,2],0.5,currentMap,0);
      var h='<g class="pl-warp-grid pl-mark is-o" data-part="mapping">'+grid.map(function(line){return el('polyline',{points:Q.pts(line)});}).join('')+'</g>';
      var q=currentMap(s.x,s.y);
      h+=path(Q,squarePoints().map(function(v){return[s.x+s.epsilon*v[0],s.y+s.epsilon*v[1]];}),'pl-dash is-k','local',false);
      h+=path(Q,mappedPatch(false,false),'pl-curve is-o','local',false)+Q.arrow(s.x,s.y,q[0],q[1],'is-o','mapping')+
        Q.dot(q[0],q[1],5,'pl-mark pl-point is-o','mapping');
      h+=text(Q,0.3,3.05,'Map the [−2, 2] input grid','mapping'); return h;
    }
    function localMarkup() {
      return path(R,mappedPatch(true,false),'pl-curve is-o','local',false)+path(R,mappedPatch(true,true),'pl-dash is-k','local',false)+
        text(R,0.7,1.95,'Displacement ÷ ε','local')+text(R,0.7,-0.55,'Solid map · dashed Jacobian','local');
    }
    function curvatureMarkup() {
      var h=contours(T,'curvature');
      eig.vectors.forEach(function(v,i){
        var length=2*s.axes;
        h+=T.arrow(-length*v[0],-length*v[1],length*v[0],length*v[1],i?'is-k':'is-o','axes');
      });
      h+=text(T,0,2.55,'Height after removing local slope','curvature');
      h+=text(T,0,-2.55,'Curvatures '+fmt(eig.values[0],4)+' and '+fmt(eig.values[1],4),'axes'); return h;
    }
    function shapeMarkup() {
      var dims=shapes(s.d,s.m),h='<p class="lab-note" data-part="dimensions">Compare '+s.d+' inputs and '+s.m+' outputs.</p>';
      [['gradient','∇f'],['jacobian','J'],['hessian','H']].forEach(function(item){
        var shape=dims[item[0]],cells=shape[0]*shape[1],active=Math.min(cells-1,Math.floor(s.reveal*cells));
        h+='<section class="lab-derivative-shape" data-part="shapes" data-shape="'+item[0]+'" data-rows="'+shape[0]+'" data-cols="'+shape[1]+'"><h4>'+item[1]+' '+shape.join(' × ')+'</h4>'+
          '<div class="lab-shape-cells" style="--columns:'+shape[1]+'">';
        for(var i=0;i<cells;i++)h+='<span'+(i===active?' class="is-active"':'')+'>'+item[1]+'<sub>'+ (Math.floor(i/shape[1])+1) + (shape[1]>1?','+(i%shape[1]+1):'') +'</sub></span>';
        h+='</div></section>';
      });return h;
    }
    window.InterviewDisplayMath.set(root.querySelector('[data-surface-formula]'),'lab/gradients-jacobians-hessians/initial-0');
    window.InterviewDisplayMath.set(root.querySelector('[data-map-formula]'),'lab/gradients-jacobians-hessians/initial-1');
    function draw() {
      var g=gradient(s.x,s.y),q=currentMap(s.x,s.y),dims=shapes(s.d,s.m),rate=directional(s.x,s.y,s.theta);
      api.values({x:s.x,y:s.y,fx:surface(s.x,s.y),gx:g[0],gy:g[1],directionalRate:rate,angle:s.theta*180/Math.PI,
        mapX:q[0],mapY:q[1],epsilon:s.epsilon,patchError:patchError(),curvatureLow:eig.values[0],curvatureHigh:eig.values[1],
        d:String(s.d),m:String(s.m),gradientShape:dims.gradient.join(' × '),jacobianShape:dims.jacobian.join(' × '),hessianShape:dims.hessian.join(' × ')},4);
      contourBox.hidden=s.view!=='contours';mapBox.hidden=s.view!=='mapping';curvatureBox.hidden=s.view!=='curvature';shapeBox.hidden=s.view!=='shapes';
      root.querySelector('[data-surface-formula]').hidden=s.view!=='contours'&&s.view!=='curvature';
      root.querySelector('[data-map-formula]').hidden=s.view!=='mapping';
      ['contour','mapping','curvature','shapes'].forEach(function(key){root.querySelector('[data-'+key+'-eq]').hidden=s.view!==(key==='contour'?'contours':key);});
      ctl.querySelector('[data-epsilon-label]').hidden=s.view!=='mapping';
      ['d','m'].forEach(function(k){ctl.querySelector('[data-'+k+'-label]').hidden=s.view!=='shapes';ctl.querySelector('[data-k="'+k+'"]').value=s[k];});
      ['partials','jacobian','curvature','shapes'].forEach(function(k){ctl.querySelector('[data-zoom="'+k+'"]').hidden=s.view!==({partials:'contours',jacobian:'mapping',curvature:'curvature',shapes:'shapes'})[k];});
      viewInput.value=s.view;progress.value=fraction;ctl.querySelector('[data-k="epsilon"]').value=s.epsilon;
      P.grid.innerHTML=P.axes();P.plot.innerHTML=contourMarkup();C.grid.innerHTML=C.axes();C.plot.innerHTML=cosineMarkup();
      Q.grid.innerHTML=Q.gridMarkup(null,0.5)+Q.axes();Q.plot.innerHTML=mapMarkup();R.grid.innerHTML=R.axes();R.plot.innerHTML=localMarkup();
      T.grid.innerHTML=T.axes();T.plot.innerHTML=curvatureMarkup();shapeBox.innerHTML=shapeMarkup();
      hp.set(s.x,s.y);hmap.set(s.x,s.y);hu.set(s.x+Math.cos(s.theta),s.y+Math.sin(s.theta));
      hu.el.setAttribute('aria-label','Unit direction at '+fmt(s.theta*180/Math.PI,1)+' degrees. Arrow keys turn it.');
      note.textContent=s.view==='contours'?(Math.hypot(g[0],g[1])<1e-8?'Every direction has rate 0 at this point. Therefore, the gradient selects no preferred direction.':
        'The gradient collects rates '+fmt(g[0],4)+' and '+fmt(g[1],4)+'. Accordingly, the chosen unit direction gives rate '+fmt(rate,4)+'.'):
        s.view==='mapping'?'The grid spans −2 to 2 on each input axis. Moreover, both local pictures use the current '+fmt(100*s.warp,0)+'% map.':
        s.view==='curvature'?'The Hessian measures how slopes change. Accordingly, its eigenvalues give curvature along the 2 marked directions.':
        'Each Jacobian row belongs to an output, and each column belongs to an input. Therefore, this comparison uses '+s.m+' rows and '+s.d+' columns.';
    }
    function report(){api.say(note.textContent);}
    function precise(x){return x<0?'−'+(-x).toFixed(4):x.toFixed(4);}
    function table(head,rows){return '<div class="lab-calculus-table"><table class="xp-table lab-table"><thead><tr>'+head.map(function(v){return'<th scope="col">'+v+'</th>';}).join('')+'</tr></thead><tbody>'+rows.map(function(row){return'<tr>'+row.map(function(v){return'<td>'+v+'</td>';}).join('')+'</tr>';}).join('')+'</tbody></table></div>';}
    function zoom(which,button){
      var g=gradient(s.x,s.y),J=currentJacobian(),h=1e-5;
      if(which==='partials')dlg.open('Partials, worked','<p>A partial derivative changes 1 input while holding the other fixed. Accordingly, a central difference compares outputs on either side of that input.</p>'+
        ('<p>Here, '+window.InterviewDisplayMath.html("lab/gradients-jacobians-hessians/worked-0", undefined, true)+' = 2 × ')+precise(s.x)+' + 0.2 × '+precise(s.y)+' = '+precise(g[0])+('. Similarly, '+window.InterviewDisplayMath.html("lab/gradients-jacobians-hessians/worked-1", undefined, true)+' = 4 × ')+precise(s.y)+' + 0.2 × '+precise(s.x)+' = '+precise(g[1])+'.</p>'+table(['Quantity','Derivative','Central difference'],[
        [(''+window.InterviewDisplayMath.html("lab/gradients-jacobians-hessians/worked-0", undefined, true)+''),precise(g[0]),precise((surface(s.x+h,s.y)-surface(s.x-h,s.y))/(2*h))],
        [(''+window.InterviewDisplayMath.html("lab/gradients-jacobians-hessians/worked-1", undefined, true)+''),precise(g[1]),precise((surface(s.x,s.y+h)-surface(s.x,s.y-h))/(2*h))],
        ['Unit direction',[Math.cos(s.theta),Math.sin(s.theta)].map(precise).join(', '),'Length 1'],
        ['Gradient · direction',precise(directional(s.x,s.y,s.theta)),'Rate along this direction']]),button);
      else if(which==='jacobian'){
        var rows=[];
        for(var i=0;i<2;i++)for(var j=0;j<2;j++){
          var lo=[s.x,s.y],hi=[s.x,s.y];lo[j]-=h;hi[j]+=h;
          rows.push([window.InterviewDisplayMath.html("lab/gradients-jacobians-hessians/jacobian-entry", {row:i+1,column:j+1}, true),precise(J[i][j]),precise((currentMap(hi[0],hi[1])[i]-currentMap(lo[0],lo[1])[i])/(2*h))]);
        }
        dlg.open('Jacobian, worked','<p>The Jacobian collects each output’s derivative for each input. To check the current '+fmt(100*s.warp,0)+'% map, central differences compare nearby outputs around each input.</p>'+table(['Entry','Derivative','Central difference'],rows)+
          '<p>The square’s largest boundary error is '+precise(patchError())+'. After dividing displacement by ε, that error becomes '+precise(patchError()/s.epsilon)+'.</p>',button);
      }else if(which==='curvature')dlg.open('Curvature, worked',('<p>The local quadratic height is '+window.InterviewDisplayMath.html("lab/gradients-jacobians-hessians/worked-2", undefined, true)+' after subtracting the tangent prediction. Here, H is constant at every point.</p>')+table(['Direction','Unit vector','Curvature'],eig.vectors.map(function(v,i){return[i+1,v.map(precise).join(', '),precise(eig.values[i])];}))+
        '<p>Multiplying H by each listed vector gives its curvature times that vector. Moreover, both positive curvatures bend the quadratic upwards.</p>',button);
      else dlg.open('Shapes, worked','<p>This comparison uses '+s.d+' inputs and '+s.m+' outputs. Accordingly, J has '+s.m+' rows and '+s.d+' columns.</p>'+table(['Object','Shape','Entries'],[
        ['Gradient of 1 scalar output',s.d+' × 1',s.d],['Jacobian of all outputs',s.m+' × '+s.d,s.m*s.d],['Hessian of 1 scalar output',s.d+' × '+s.d,s.d*s.d]])+
        '<p>For several outputs, each scalar output has its own Hessian. Therefore, the displayed H belongs to 1 chosen output.</p>',button);
    }
    ctl.addEventListener('input',function(e){
      var key=e.target.getAttribute('data-k');
      if(key==='progress'){var requested=+e.target.value;api.interrupt();fraction=requested;s=interpolate(motion.from,motion.to,requested);draw();report();}
      else if(['epsilon','d','m'].indexOf(key)>=0){var next={};next[key]=+e.target.value;change(next);}
    });
    ctl.addEventListener('change',function(e){if(e.target===viewInput){var value=viewInput.value;change({view:value,warp:1,axes:1,reveal:1});}});
    ctl.addEventListener('click',function(e){
      var b=e.target.closest('button');if(!b)return;api.interrupt();
      if(b.hasAttribute('data-zoom'))return zoom(b.getAttribute('data-zoom'),b);
      if(b.hasAttribute('data-reset'))return record(snapshot(),Object.assign({},initial),false);
      if(b.getAttribute('data-act')==='play'){
        var from=snapshot(),to=snapshot();
        if(s.view==='contours')to.theta=from.theta+2*Math.PI;
        else if(s.view==='mapping'){from.warp=0;to.warp=1;}
        else if(s.view==='curvature'){from.axes=0;to.axes=1;}
        else{from.reveal=0;to.reveal=1;}
        record(from,to,true);
      }
    });
    var phi=Math.atan2(2.2,2.1),PAGES=[
      {t:'Collect 2 input rates',parts:['point','gradient'],state:{view:'contours'},body:'<p>At (1, 0.5), the x rate is 2.1 and the y rate is 2.2. Together, these partial derivatives form the gradient (2.1, 2.2).</p>'},
      {t:'Cross curves of equal height',parts:['contours','field','gradient','point'],state:{view:'contours'},body:'<p>The curves join points with equal output values, forming contours. Accordingly, each gradient arrow crosses its contour at right angles.</p>'},
      {t:'Choose the fastest direction',parts:['gradient','direction','cosine','point'],state:{view:'contours',theta:phi},body:'<p>The unit direction is an arrow of length 1 around the point. Therefore, facing along the gradient gives the largest rate, about 3.0414.</p>'},
      {t:'Move along the contour',parts:['gradient','direction','cosine','contours'],state:{view:'contours',theta:phi+Math.PI/2},body:'<p>A perpendicular direction has rate 0 at this point. Consequently, the curve crosses 0 when the direction turns 90° from the gradient.</p>'},
      {t:'Map 2 inputs to 2 outputs',parts:['point','mapping','local'],state:{view:'mapping',warp:1},body:'<p>The map sends (1, 0.5) to (1.05, 0.7). It also bends the square’s edges. The Jacobian lists each output’s derivatives for both inputs to describe these local changes.</p>'},
      {t:'Shrink the local square',parts:['mapping','local','point'],state:{view:'mapping',epsilon:0.05},body:'<p>The dashed parallelogram predicts how the Jacobian moves a square of size ε. As ε shrinks, it follows the solid mapped boundary more closely.</p>'},
      {t:'Measure changes in slope',parts:['curvature','axes'],state:{view:'curvature'},body:'<p>The Hessian collects how each partial derivative changes with either input. Here, curvatures 1.9802 and 4.0198 belong to the marked directions.</p>'},
      {t:'A point with no slope',parts:['gradient','direction','cosine','point','contours'],state:{view:'contours',x:0,y:0},body:'<p>At (0, 0), both partial derivatives vanish. Therefore, every direction has rate 0, although the Hessian still records upward curvature.</p>'},
      {t:'Check rows and columns',parts:['dimensions','shapes'],state:{view:'shapes',d:3,m:2},body:'<p>For 3 inputs and 2 outputs, the Jacobian has 2 rows and 3 columns. Meanwhile, each scalar output has a length 3 gradient and a 3 × 3 Hessian.</p>'}
    ];
    draw();report();
    XP.guide(root.querySelector('[data-guide-box]'),PAGES,function(p,i,redraw){if(!p){api.focus([]);return;}if(!redraw){api.interrupt();record(snapshot(),Object.assign({},initial,p.state),true);}api.focus(p.parts);});
  });
})();
