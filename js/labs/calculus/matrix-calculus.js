(function(){
  function softmax(logits){
    if(!logits.length||!logits.every(Number.isFinite))return null;
    var max=Math.max.apply(Math,logits),e=logits.map(function(x){return Math.exp(x-max);}),sum=e.reduce(function(a,b){return a+b;},0);
    return e.map(function(x){return x/sum;});
  }
  function layer(W,x,b,label){
    if(!W.length||b.length!==W.length||!Number.isInteger(label)||label<0||label>=W.length||!x.every(Number.isFinite)||!b.every(Number.isFinite)||!W.every(function(row){return row.length===x.length&&row.every(Number.isFinite);}))return null;
    var logits=W.map(function(row,i){return row.reduce(function(sum,v,j){return sum+v*x[j];},b[i]);}),p=softmax(logits);
    if(!p)return null;
    var max=Math.max.apply(Math,logits),sum=logits.reduce(function(acc,v){return acc+Math.exp(v-max);},0),loss=max-logits[label]+Math.log(sum);
    var delta=p.map(function(v,i){return v-(i===label?1:0);}),dW=delta.map(function(d){return x.map(function(v){return d*v;});});
    var dx=x.map(function(v,j){return W.reduce(function(sum,row,i){return sum+row[j]*delta[i];},0);});
    return{logits:logits,p:p,loss:loss,delta:delta,dW:dW,dx:dx,db:delta.slice()};
  }
  function quadratic(A,w){
    var Aw=A.map(function(row){return row.reduce(function(sum,v,j){return sum+v*w[j];},0);});
    var gradient=w.map(function(v,i){return w.reduce(function(sum,x,j){return sum+(A[i][j]+A[j][i])*x;},0);});
    return{value:w.reduce(function(sum,v,i){return sum+v*Aw[i];},0),gradient:gradient,shortcut:Aw.map(function(v){return 2*v;})};
  }
  function shapes(inputs,outputs,layout,mistake){
    if(!Number.isInteger(inputs)||!Number.isInteger(outputs)||inputs<1||outputs<1||(layout!=='numerator'&&layout!=='denominator'))return null;
    var numerator=layout==='numerator',W=[outputs,inputs],WT=[inputs,outputs],delta=numerator?[1,outputs]:[outputs,1];
    var left=numerator?delta:(mistake?W:WT),right=numerator?(mistake?WT:W):delta;
    return{W:W,x:[inputs,1],b:[outputs,1],logits:[outputs,1],jacobian:numerator?W:WT,delta:delta,dx:numerator?[1,inputs]:[inputs,1],dW:W,
      left:left,right:right,valid:left[1]===right[0],result:[left[0],right[1]],mistake:!!mistake};
  }
  var M={softmax:softmax,layer:layer,quadratic:quadratic,shapes:shapes};
  if(typeof module==='object'&&module.exports){module.exports=M;return;}
  XP.lab('calculus/matrix-calculus',function(root,api){
    var el=XP.svgEl,fmt=XP.fmt,stage=root.querySelector('[data-stage]'),ctl=root.querySelector('[data-ctl]'),note=root.querySelector('[data-note]');
    var initial={view:'layer',weights:[1,0,0,1,1,1],bias:[0,0,0],label:2,selected:2,wentry:5,inputs:2,outputs:3,layout:'denominator',mistake:false,A:[1,2,0,2],w:[1,0.5],aentry:1,symmetry:'free',reveal:1};
    function copy(v){var out=Object.assign({},v);['weights','bias','A','w'].forEach(function(k){out[k]=v[k].slice();});return out;}
    var s=copy(initial),fraction=1,dragStart=null,motion={from:copy(s),to:copy(s)},dlg=XP.dialog(root);
    stage.innerHTML='<div data-view="layer"><div data-forward></div><div data-logits></div><div data-probabilities></div><div data-reverse></div><div data-weight-plane></div></div>'+ 
      '<div data-view="shapes" hidden><div data-shapes></div><p data-mismatch></p></div><div data-view="quadratic" hidden><div data-matrix></div><div data-surface></div><div data-gradient-plane></div><div data-entry-plane></div></div>';
    function plane(node,x,y,h,label){var p=XP.plane(node,{x:x,y:y,w:400,h:h,pad:26,label:label});p.grid.innerHTML=p.axes();return p;}
    var L=plane(stage.querySelector('[data-logits]'),[0.3,3.7],[-11,11],300,'Drag each class logit vertically; changing a logit changes its bias');
    var B=plane(stage.querySelector('[data-probabilities]'),[0.3,3.7],[-1.35,1.45],270,'Probability bars above zero and predicted minus label bars on either side of zero');
    var W=plane(stage.querySelector('[data-weight-plane]'),[-2.3,2.3],[-0.4,0.7],120,'Drag the selected weight entry along this number line');
    var S=plane(stage.querySelector('[data-surface]'),[-2.5,2.5],[-1.6,2.8],300,'Projected quadratic surface, computed from the current matrix A');
    var P=plane(stage.querySelector('[data-gradient-plane]'),[-2,2],[-2,2],340,'Drag w to compare the true quadratic gradient and the shortcut 2Aw');
    var A=plane(stage.querySelector('[data-entry-plane]'),[-2.3,2.3],[-0.4,0.7],120,'Drag the selected entry of matrix A');
    function entries(n){var h='';for(var i=0;i<n;i++)h+='<option value="'+i+'">'+(Math.floor(i/2)+1)+', '+(i%2+1)+'</option>';return h;}
    ctl.innerHTML='<button type="button" data-act="play">Play the change</button><label>Motion <input data-k="progress" type="range" min="0" max="1" step="0.01" value="1" aria-label="Scrub the recorded change"></label>'+ 
      '<label>View <select data-k="view"><option value="layer">Layer and gradients</option><option value="shapes">Derivative shapes</option><option value="quadratic">Quadratic form</option></select></label>'+ 
      '<label data-control="layer">True class <select data-k="label"><option value="0">1</option><option value="1">2</option><option value="2" selected>3</option></select></label>'+ 
      '<label data-control="layer">Inspect class <select data-k="selected"><option value="0">1</option><option value="1">2</option><option value="2" selected>3</option></select></label>'+ 
      '<label data-control="layer">W row, column <select data-k="wentry">'+entries(6)+'</select></label>'+ 
      '<label data-control="shapes" hidden>Inputs <input data-k="inputs" type="range" min="1" max="4" step="1" value="2" aria-label="Number of layer inputs in the shapes example"></label>'+ 
      '<label data-control="shapes" hidden>Outputs <input data-k="outputs" type="range" min="1" max="4" step="1" value="3" aria-label="Number of layer outputs in the shapes example"></label>'+ 
      '<label data-control="shapes" hidden>Layout <select data-k="layout"><option value="denominator">Denominator, column gradients</option><option value="numerator">Numerator, row gradients</option></select></label>'+ 
      '<label data-control="shapes" hidden><input data-k="mistake" type="checkbox">Use the wrong transpose</label>'+ 
      '<label data-control="quadratic" hidden>A row, column <select data-k="aentry">'+entries(4)+'</select></label>'+ 
      '<label data-control="quadratic" hidden>Matrix <select data-k="symmetry"><option value="free">Free entries</option><option value="symmetric">Enforce symmetry</option></select></label>'+ 
      '<button type="button" data-zoom="layer">Weight gradient, worked</button><button type="button" data-zoom="shapes" hidden>Shapes, worked</button><button type="button" data-zoom="quadratic" hidden>Quadratic, worked</button><button type="button" data-reset>Reset</button>';
    var progress=ctl.querySelector('[data-k="progress"]');
    function snapshot(){return copy(s);}
    function matrix(){return[s.weights.slice(0,2),s.weights.slice(2,4),s.weights.slice(4,6)];}
    function quadraticMatrix(){return[s.A.slice(0,2),s.A.slice(2,4)];}
    function clamp(x,a,b){return Math.max(a,Math.min(b,x));}
    function normalise(next){var v=Object.assign(snapshot(),next);v.weights=v.weights.map(function(x){return clamp(x,-2,2);});v.bias=v.bias.map(function(x){return clamp(x,-4,4);});v.A=v.A.map(function(x){return clamp(x,-2,2);});v.w=v.w.map(function(x){return clamp(x,-1.5,1.5);});
      if(v.symmetry==='symmetric')v.A[1]=v.A[2]=(v.A[1]+v.A[2])/2;
      ['inputs','outputs'].forEach(function(k){v[k]=Math.round(clamp(v[k],1,4));});[['label',2],['selected',2],['wentry',5],['aentry',3]].forEach(function(entry){v[entry[0]]=Math.round(clamp(v[entry[0]],0,entry[1]));});v.reveal=clamp(v.reveal,0,1);return v;}
    function interpolate(from,to,f){return normalise(XP.mix(from,to,XP.ease(f)));}
    function record(from,to,play){api.interrupt();motion={from:copy(from),to:copy(to)};if(play)api.animate(from,to,800,function(st,f){s=interpolate(from,to,f);fraction=f;draw();},report);else{s=copy(to);fraction=1;draw();report();}}
    function change(next){api.interrupt();record(snapshot(),normalise(next),false);}
    function handle(p,config,key){var h=p.handle(config);h.el.setAttribute('data-handle',key);h.el.addEventListener('pointerdown',function(){dragStart=snapshot();});return h;}
    function move(next,done){api.interrupt();record(dragStart||snapshot(),normalise(next),false);if(done)dragStart=null;}
    var logits=[];for(var k=0;k<3;k++)(function(i){logits[i]=handle(L,{x:i+1,y:i+1,snap:0.1,bounds:[[i+1,i+1],[-10,10]],cls:'is-q',part:'forward',label:'Raw score for class '+(i+1),onMove:function(x,y,done){var b=s.bias.slice(),row=matrix()[i];b[i]=y-row[0]-2*row[1];move({bias:b},done);}},'logit-'+i);})(k);
    var hw=handle(W,{x:1,y:0,snap:0.05,bounds:[[-2,2],[-0.1,0.1]],cls:'is-q',part:'weights',label:'Selected weight entry',onMove:function(x,y,done){var v=s.weights.slice();v[s.wentry]=x;move({weights:v},done);}},'weight');
    var hp=handle(P,{x:1,y:0.5,snap:0.05,bounds:[[-1.5,1.5],[-1.5,1.5]],cls:'is-q',part:'quadratic',label:'Quadratic input vector w',onMove:function(x,y,done){move({w:[x,y]},done);}},'quadratic-point');
    var ha=handle(A,{x:2,y:0,snap:0.05,bounds:[[-2,2],[-0.1,0.1]],cls:'is-q',part:'quadratic',label:'Selected matrix A entry',onMove:function(x,y,done){var v=s.A.slice();v[s.aentry]=x;if(s.symmetry==='symmetric'&&(s.aentry===1||s.aentry===2))v[3-s.aentry]=x;move({A:v},done);}},'quadratic-entry');
    function text(p,x,y,words,part){var formulas={"Height w\u1d40Aw": "lab/matrix-calculus/svg-0"}; if(formulas[words]){return '<foreignObject x="'+(p.map.sx(x)-150)+'" y="'+(p.map.sy(y)-17)+'" width="300" height="44" data-part="'+part+'"><div xmlns="http://www.w3.org/1999/xhtml" style="text-align:center;font-size:13px">'+window.InterviewDisplayMath.html(formulas[words], undefined, true)+'</div></foreignObject>';} return el('text',{x:p.map.sx(x),y:p.map.sy(y),'text-anchor':'middle','data-part':part},XP.esc(words));}
    function line(p,pts,cls,part){return el('polyline',{points:p.pts(pts),'class':'pl-mark '+cls,'data-part':part});}
    function block(title,rows,part,selected){var columns=rows[0].length;return'<section class="lab-matrix-block" data-part="'+part+'"><h4>'+title+' · '+rows.length+' × '+columns+'</h4><div class="lab-shape-cells" style="--columns:'+columns+'">'+rows.map(function(row,i){return row.map(function(v,j){return'<span'+(selected===i*columns+j?' class="is-active"':'')+'>'+(typeof v==='number'?XP.esc(fmt(v,2)):v)+'</span>';}).join('');}).join('')+'</div></section>';}
    function column(xs){return xs.map(function(x){return[x];});}
    function bar(p,x,y,width,cls,part){return el('rect',{x:p.map.sx(x-width/2),y:p.map.sy(Math.max(0,y)),width:p.map.sx(width)-p.map.sx(0),height:Math.abs(p.map.sy(y)-p.map.sy(0)),'class':'pl-integral '+cls,'data-part':part});}
    function layerMarkup(q){
      stage.querySelector('[data-forward]').innerHTML='<h4 class="lab-matrix-heading">Forward values, z = Wx + b</h4><div class="lab-matrix-grid">'+block('W',matrix(),'weights',s.wentry)+block('x',[[1],[2]],'forward')+block('b',column(s.bias),'forward')+block('z',column(q.logits),'forward')+'</div>';
      var h=text(L,2,9.5,'Raw scores z · drag vertically','forward');q.logits.forEach(function(z,i){h+=bar(L,i+1,z,0.3,'is-q','forward');logits[i].set(i+1,z);});L.plot.innerHTML=h;
      var bars=text(B,2,1.22,'Purple p · coral predicted − label','probability');for(var i=0;i<3;i++){bars+=bar(B,i+0.82,q.p[i],0.23,'is-o','probability')+bar(B,i+1.18,q.delta[i],0.23,'is-k','reverse')+text(B,i+1,-1.17,'Class '+(i+1),'probability');}B.plot.innerHTML=bars;
      stage.querySelector('[data-reverse]').innerHTML='<h4 class="lab-matrix-heading">Backward gradients, δ = p − y</h4><div class="lab-matrix-grid">'+block('δ',column(q.delta),'reverse')+block(window.InterviewDisplayMath.html("lab/matrix-calculus/block-0", undefined, true),column(q.db),'reverse')+block(window.InterviewDisplayMath.html("lab/matrix-calculus/block-1", undefined, true),q.dW,'weights',s.wentry)+block(window.InterviewDisplayMath.html("lab/matrix-calculus/block-2", undefined, true),column(q.dx),'reverse')+'</div><p class="lab-matrix-pass" data-part="reverse">Recorded pass '+Math.round(s.reveal*100)+'%</p>';
      W.plot.innerHTML=text(W,0,0.48,'Selected W['+(Math.floor(s.wentry/2)+1)+', '+(s.wentry%2+1)+']','weights');hw.set(s.weights[s.wentry],0);
    }
    function symbols(rows,columns,name){var out=[];for(var i=0;i<rows;i++){var row=[];for(var j=0;j<columns;j++)row.push(window.InterviewDisplayMath.html('lab/matrix-calculus/symbol-'+name,{row:i+1,column:j+1},true));out.push(row);}return out;}
    function shapesMarkup(){var q=shapes(s.inputs,s.outputs,s.layout,s.mistake),leftName=s.layout==='numerator'?window.InterviewDisplayMath.html("lab/matrix-calculus/transpose-delta", undefined, true):s.mistake?'W':window.InterviewDisplayMath.html("lab/matrix-calculus/transpose-W", undefined, true),rightName=s.layout==='numerator'?(s.mistake?window.InterviewDisplayMath.html("lab/matrix-calculus/transpose-W", undefined, true):'W'):'δ';
      stage.querySelector('[data-shapes]').innerHTML='<h4 class="lab-matrix-heading">Forward product and vector Jacobian</h4><div class="lab-matrix-grid">'+block('W',symbols(s.outputs,s.inputs,'W'),'shapes')+block('x',symbols(s.inputs,1,'x'),'shapes')+block('z',symbols(s.outputs,1,'z'),'shapes')+block('J',symbols(q.jacobian[0],q.jacobian[1],'J'),'shapes')+'</div>'+ 
        '<h4 class="lab-matrix-heading">Reverse product '+leftName+' × '+rightName+'</h4><div class="lab-matrix-grid">'+block(leftName,symbols(q.left[0],q.left[1],'u'),'shapes')+block(rightName,symbols(q.right[0],q.right[1],'v'),'shapes')+(q.valid?block('Product',symbols(q.result[0],q.result[1],'r'),'shapes'):'')+block('Weight gradient array',symbols(s.outputs,s.inputs,'g'),'shapes')+'</div>';
      var mismatch=stage.querySelector('[data-mismatch]');mismatch.setAttribute('data-valid',String(q.valid));mismatch.textContent=q.valid?(s.mistake?'Dimensions are compatible because W is square. However, the transpose choice remains wrong.':'The inner dimensions both equal '+q.left[1]+'. Therefore, the reverse product has shape '+q.result[0]+' × '+q.result[1]+'.'):
        'The inner dimensions differ, '+q.left[1]+' ≠ '+q.right[0]+'. Therefore, the selected product is undefined.';
    }
    function project(x,y){return[x-0.55*y,0.35*y+0.12*quadratic(quadraticMatrix(),[x,y]).value];}
    function quadraticMarkup(q){stage.querySelector('[data-matrix]').innerHTML=block('A',quadraticMatrix(),'quadratic',s.aentry);
      var h='';for(var t=-1.5;t<=1.51;t+=0.3)for(var axis=0;axis<2;axis++){var pts=[];for(var j=0;j<=40;j++){var x=axis?t:-1.5+3*j/40,y=axis?-1.5+3*j/40:t;pts.push(project(x,y));}h+=line(S,pts,'pl-contour','quadratic');}
      var p=project(s.w[0],s.w[1]);h+=S.dot(p[0],p[1],5,'pl-mark pl-point is-q','quadratic')+text(S,0,2.5,'Height wᵀAw','quadratic');S.plot.innerHTML=h;
      var marks='';[[q.gradient,'is-o','gradient'],[q.shortcut,'is-k','shortcut']].forEach(function(v){var norm=Math.hypot(v[0][0],v[0][1]);if(norm)marks+=P.arrow(s.w[0],s.w[1],s.w[0]+0.65*v[0][0]/norm,s.w[1]+0.65*v[0][1]/norm,v[1],v[2]);});
      marks+=text(P,0,1.75,'Purple full gradient · coral 2Aw','gradient')+text(P,0,-1.75,'Directions scaled to equal length','gradient');P.plot.innerHTML=marks;
      A.plot.innerHTML=text(A,0,0.48,'Selected A['+(Math.floor(s.aentry/2)+1)+', '+(s.aentry%2+1)+']','quadratic');hp.set(s.w[0],s.w[1]);ha.set(s.A[s.aentry],0);
    }
    function draw(){var q=layer(matrix(),[1,2],s.bias,s.label),quad=quadratic(quadraticMatrix(),s.w),row=Math.floor(s.wentry/2),col=s.wentry%2;
      api.values({selectedClass:String(s.selected+1),selectedLogit:q.logits[s.selected],probability:s.view==='layer'?q.p[s.selected]:'Not evaluated',delta:s.view==='layer'?q.delta[s.selected]:'Not evaluated',loss:s.view==='layer'?q.loss:'Not evaluated',
        weightEntry:s.weights[s.wentry],weightGradient:q.dW[row][col],dx0:q.dx[0],dx1:q.dx[1],wx:s.w[0],wy:s.w[1],quadraticValue:quad.value,gx:quad.gradient[0],gy:quad.gradient[1],shortcutX:quad.shortcut[0],shortcutY:quad.shortcut[1],matrixEntry:s.A[s.aentry]},4);
      root.querySelector('[data-formula]').innerHTML=s.view==='layer'?window.InterviewDisplayMath.html("lab/matrix-calculus/layer", {class:s.label+1}, true):s.view==='shapes'?window.InterviewDisplayMath.html("lab/matrix-calculus/shapes", {layout:s.layout}, true):window.InterviewDisplayMath.html("lab/matrix-calculus/quadratic", undefined, true);
      stage.querySelectorAll('[data-view]').forEach(function(e){e.hidden=e.getAttribute('data-view')!==s.view;});root.querySelectorAll('[data-layer-readout]').forEach(function(e){e.hidden=s.view!=='layer';});root.querySelectorAll('[data-quadratic-readout]').forEach(function(e){e.hidden=s.view!=='quadratic';});
      ctl.querySelectorAll('[data-control]').forEach(function(e){e.hidden=e.getAttribute('data-control')!==s.view;});ctl.querySelectorAll('[data-zoom]').forEach(function(e){e.hidden=e.getAttribute('data-zoom')!==s.view;});
      ['view','label','selected','wentry','inputs','outputs','layout','aentry','symmetry'].forEach(function(k){ctl.querySelector('[data-k="'+k+'"]').value=s[k];});ctl.querySelector('[data-k="mistake"]').checked=s.mistake;progress.value=fraction;
      if(s.view==='layer')layerMarkup(q);else if(s.view==='shapes')shapesMarkup();else quadraticMarkup(quad);
      note.textContent=s.view==='layer'?'Softmax converts raw scores into probabilities that sum to 1. Cross entropy measures −log probability of the true class. After that, δ = p − y sends derivatives backwards. Dragging scores changes bias offsets, bounded between −4 and 4.':
        s.view==='shapes'?(s.layout==='denominator'?'Denominator layout stores scalar-by-vector derivatives as columns. Therefore, the transpose of W multiplies the score gradient.':'Numerator layout stores scalar-by-vector derivatives as rows. Therefore, the transposed score gradient multiplies W.')+' The weight gradient array keeps one derivative for each W entry. Shape compatibility alone does not prove an expression correct.':
        'The full gradient adds A and its transpose before multiplying w. Only symmetric A permits the shortcut 2Aw. '+(s.symmetry==='symmetric'?'Symmetry links both off-diagonal entries when you drag either entry. ':'Free mode lets you change each matrix entry independently. ')+(Math.hypot.apply(Math,quad.gradient)<1e-10?'The full gradient is 0 at this point. ':'')+'The arrows show directions at equal display length, while the readout gives their components.';
    }
    function report(){api.say(note.textContent);}
    function table(head,rows){return'<div class="lab-calculus-table"><table class="xp-table lab-table"><thead><tr>'+head.map(function(v){return'<th scope="col">'+v+'</th>';}).join('')+'</tr></thead><tbody>'+rows.map(function(row){return'<tr>'+row.map(function(v){return'<td>'+v+'</td>';}).join('')+'</tr>';}).join('')+'</tbody></table></div>';}
    function zoom(which,button){
      if(which==='layer'){var q=layer(matrix(),[1,2],s.bias,s.label),rows=[];for(var i=0;i<3;i++)for(var j=0;j<2;j++)rows.push([(i+1)+', '+(j+1),fmt(q.delta[i],6)+' × '+[1,2][j],fmt(q.dW[i][j],6)]);
        var max=Math.max.apply(Math,q.logits),sum=q.logits.reduce(function(a,z){return a+Math.exp(z-max);},0);
        dlg.open('Weight gradients, worked','<p>Each weight multiplies one input before reaching its class score. Therefore, its loss derivative is that input times the class score’s derivative δ.</p>'+table(['W row, column',(''+window.InterviewDisplayMath.html("lab/matrix-calculus/worked-0", undefined, true)+''),'Weight derivative'],rows)+
          table(['Stable loss quantity','Current value'],[['Largest logit m',fmt(max,6)],['Shifted exponential sum',fmt(sum,6)],[('Loss m − '+window.InterviewDisplayMath.html("lab/matrix-calculus/worked-7", undefined, true)+' + log sum'),fmt(q.loss,6)],[('Input gradient '+window.InterviewDisplayMath.html("lab/matrix-calculus/worked-1", undefined, true)+''),q.dx.map(function(v){return fmt(v,6);}).join(', ')]])+'<p>Subtracting the largest score keeps every exponent nonpositive. Moreover, computing loss from shifted scores avoids taking the logarithm of an underflowed probability.</p>',button);
      }else if(which==='shapes'){var q=shapes(s.inputs,s.outputs,s.layout,s.mistake);
        dlg.open('Derivative shapes, worked','<p>Numerator layout places output components in Jacobian rows. Conversely, denominator layout places them in columns, transposing the vector Jacobian.</p>'+table(['Quantity','Shape'],[['W',q.W.join(' × ')],['Vector Jacobian',q.jacobian.join(' × ')],['Left reverse factor',q.left.join(' × ')],['Right reverse factor',q.right.join(' × ')],['Intended input derivative',q.dx.join(' × ')],['Weight gradient array',q.dW.join(' × ')]])+'<p>Matrix multiplication requires matching inner dimensions. However, square matrices can hide a wrong transpose, so checking dimensions alone cannot establish the derivative.</p>',button);
      }else{var q=quadratic(quadraticMatrix(),s.w),a=quadraticMatrix(),sum=a.map(function(row,i){return row.map(function(v,j){return v+a[j][i];});});
        dlg.open('Quadratic gradient, worked',('<p>Differentiating either copy of w contributes a matrix term. Therefore, the full gradient is '+window.InterviewDisplayMath.html("lab/matrix-calculus/worked-4", undefined, true)+'.</p>')+table(['Quantity','Current value'],[['A',a.map(function(row){return '['+row.map(function(v){return fmt(v,6);}).join(', ')+']';}).join(' ')],[(''+window.InterviewDisplayMath.html("lab/matrix-calculus/worked-3", undefined, true)+''),sum.map(function(row){return '['+row.map(function(v){return fmt(v,6);}).join(', ')+']';}).join(' ')],['w',s.w.map(function(v){return fmt(v,6);}).join(', ')],['Quadratic value',fmt(q.value,6)],['Full gradient',q.gradient.map(function(v){return fmt(v,6);}).join(', ')],['Shortcut 2Aw',q.shortcut.map(function(v){return fmt(v,6);}).join(', ')]])+('<p>When A is symmetric, '+window.InterviewDisplayMath.html("lab/matrix-calculus/worked-5", undefined, true)+' and the expression becomes 2Aw. Otherwise, this shortcut can give the wrong direction.</p>'),button);
      }
    }
    ctl.addEventListener('input',function(e){var k=e.target.getAttribute('data-k');if(k==='progress'){var requested=+e.target.value;api.interrupt();fraction=requested;s=interpolate(motion.from,motion.to,requested);draw();report();}else if(k==='inputs'||k==='outputs'){var next={};next[k]=+e.target.value;change(next);}});
    ctl.addEventListener('change',function(e){var k=e.target.getAttribute('data-k');if(['view','label','selected','wentry','layout','mistake','aentry','symmetry'].indexOf(k)<0)return;var value=k==='mistake'?e.target.checked:['label','selected','wentry','aentry'].indexOf(k)>=0?+e.target.value:e.target.value,next={};next[k]=value;change(next);});
    ctl.addEventListener('click',function(e){var b=e.target.closest('button');if(!b)return;api.interrupt();if(b.hasAttribute('data-zoom'))return zoom(b.getAttribute('data-zoom'),b);if(b.hasAttribute('data-reset'))return record(snapshot(),copy(initial),false);
      if(b.getAttribute('data-act')==='play'){var from=snapshot(),to=snapshot();if(s.view==='layer'){from.bias=matrix().map(function(row){return clamp(-row[0]-2*row[1],-4,4);});from.reveal=0;to.reveal=1;}else if(s.view==='shapes'){from.inputs=from.outputs=1;}else from.w=[0,0];record(from,to,true);}});
    var PAGES=[
      {t:'Calculate a class probability',parts:['forward','probability'],state:{},body:'<p>With x = (1, 2), this layer gives raw scores (1, 2, 3). Softmax converts them into probabilities. Then true class 3 has probability 0.6652 and loss 0.4076.</p>'},
      {t:'Raise one raw score',parts:['forward','probability'],state:{bias:[0,0,1]},body:'<p>Raising class 3’s raw score from 3 to 4 increases its probability to 0.8438. Consequently, its cross entropy loss drops to 0.1698.</p>'},
      {t:'Compare prediction with the label',parts:['probability','reverse'],state:{label:0},body:'<p>The label vector has 1 at the true class and 0 elsewhere. With true class 1, class 3’s score derivative is its probability, 0.6652.</p>'},
      {t:'Build the weight gradient',parts:['reverse','weights'],state:{wentry:5},body:('<p>Each weight derivative multiplies its class score’s derivative by its input value. Therefore, '+window.InterviewDisplayMath.html("lab/matrix-calculus/worked-6", undefined, true)+' = −0.334759 × 2 ≈ −0.669518.</p>')},
      {t:'Send derivatives to the input',parts:['reverse','weights'],state:{},body:('<p>The input gradient sums contributions from every class through '+window.InterviewDisplayMath.html("lab/matrix-calculus/worked-1", undefined, true)+'. Accordingly, its components are approximately −0.2447 and −0.0900, matching the input’s 2 entries.</p>')},
      {t:'Arrange vector derivatives as columns',parts:['shapes'],state:{view:'shapes'},body:('<p>Denominator layout arranges scalar-by-vector derivatives as columns. Therefore, '+window.InterviewDisplayMath.html("lab/matrix-calculus/extra-0", undefined, true)+' has shape 2 × 3 and multiplies the 3 × 1 score gradient.</p>')},
      {t:'Transpose the vector convention',parts:['shapes'],state:{view:'shapes',layout:'numerator'},body:'<p>Numerator layout arranges those derivatives as rows. Accordingly, the 1 × 3 score gradient multiplies W, giving a 1 × 2 input derivative.</p>'},
      {t:'Expose an incompatible product',parts:['shapes'],state:{view:'shapes',mistake:true},body:('<p>Using W instead of '+window.InterviewDisplayMath.html("lab/matrix-calculus/extra-0", undefined, true)+' tries multiplying shapes 3 × 2 and 3 × 1. Therefore, inner dimensions 2 and 3 disagree, making this product undefined.</p>')},
      {t:'Differentiate both copies of w',parts:['quadratic','gradient','shortcut'],state:{view:'quadratic'},body:'<p>For the displayed nonsymmetric A and w = (1, 0.5), the quadratic value is 2.5. However, the full gradient (3, 4) differs from shortcut 2Aw = (4, 2).</p>'},
      {t:'Recover the symmetric shortcut',parts:['quadratic','gradient','shortcut'],state:{view:'quadratic',symmetry:'symmetric',A:[1,1,1,2]},body:'<p>For symmetric A, its transpose equals A. Therefore, the full gradient becomes 2Aw. Both arrows now represent components (3, 4).</p>'}
    ];
    draw();report();XP.guide(root.querySelector('[data-guide-box]'),PAGES,function(p,i,redraw){if(!p){api.focus([]);return;}if(!redraw){api.interrupt();var to=normalise(Object.assign(copy(initial),p.state)),from=snapshot();['view','layout','mistake','symmetry'].forEach(function(k){from[k]=to[k];});from=normalise(from);s=copy(from);draw();record(from,to,true);}api.focus(p.parts);});
  });
})();
