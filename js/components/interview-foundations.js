/* Small calculations connect mathematical notation to implementation. */
(function () {
  'use strict';
  function normalise(theta) {
    var w=Math.exp(theta),z=1+w,p=w/z;
    return {z:z,weights:[1,w],probabilities:[1-p,p],mean:p};
  }
  function nll(theta, observedMean) {return Math.log(normalise(theta).z)-observedMean*theta;}
  function gradients(w,x) {return {input:w*w*x,parameter:w*x*x};}
  function langevin(x,h,noise) {return (1-h)*x+Math.sqrt(2*h)*noise;}
  function stationaryVariance(h) {return 1/(1-h/2);}
  function tensor(batch,reduction) {
    return {input:[batch,1,28,28],conv:[batch,4,14,14],flat:[batch,784],reduction:reduction==='sum'?2*batch:2};
  }
  var calculations={normalise:normalise,nll:nll,gradients:gradients,langevin:langevin,stationaryVariance:stationaryVariance,tensor:tensor};
  if(typeof module==='object' && module.exports){module.exports=calculations;return;}
  function fmt(x){return x.toFixed(3);}
  function safe(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}
  function box(label,value){return '<div class="ivf-box"><span>'+safe(label)+'</span><strong>'+safe(value)+'</strong></div>';}
  function mathBox(label,key,values){return '<div class="ivf-box"><span>'+safe(label)+'</span><div class="ivm-render">'+window.InterviewDisplayMath.html(key,values)+'</div></div>';}
  function bar(label,value,max){return '<div class="ivf-bar"><span>'+safe(label)+'</span><div><i style="width:'+Math.max(0,Math.min(100,100*value/max))+'%"></i></div><output>'+fmt(value)+'</output></div>';}
  // Fixed, seeded standard-normal draws keep the illustration reproducible.
  function noiseSequence(){
    var seed=9271;
    function uniform(){seed=(1664525*seed+1013904223)>>>0;return (seed+0.5)/4294967296;}
    return Array.from({length:20},function(){return Math.sqrt(-2*Math.log(uniform()))*Math.cos(2*Math.PI*uniform());});
  }
  var noises=noiseSequence();
  document.querySelectorAll('[data-foundation]').forEach(function(root){
    var data=JSON.parse(root.querySelector('.ivf-data').textContent),control=root.querySelector('[data-value]');
    var diagram=root.querySelector('.ivf-diagram'),rows=root.querySelectorAll('.ivf-derivation li');
    function state(){
      var value=control.tagName==='SELECT'?control.value:+control.value;
      var m=normalise(typeof value==='number'?value:0),texts=data.steps.map(function(s){return s.read;}),frames=[];
      root.querySelector('[data-value-label]').textContent=typeof value==='number'?String(value):'';
      switch(data.kind){
        case 'notation':
          var variable=value;
          frames=[box('Integration variable',variable)+box('Endpoint x','2'),
            mathBox('Same integral','foundation/notation/integral-'+variable),
            box('Fixed parameter θ','3')+mathBox('Function value','foundation/notation/value'),
            mathBox('Vary x, fix θ','foundation/notation/input-gradient')+mathBox('Vary θ, fix x','foundation/notation/parameter-gradient')];
          texts[1]='Using '+variable+' consistently gives the same integral, 8/3. The argument x remains the endpoint.';
          texts[3]+=' The input derivative equals 12; the parameter derivative equals 8/3.';
          break;
        case 'normalise':
          frames=[box('Score of outcome 0','0')+box('Score of outcome 1',String(value)),
            bar('Weight 0',1,Math.max(1,m.weights[1]))+bar('Weight 1',m.weights[1],Math.max(1,m.weights[1]))+box('Total Zθ',fmt(m.z)),
            bar('Probability 0',m.probabilities[0],1)+bar('Probability 1',m.mean,1)+box('Sum','1'),
            mathBox('Weighted average','foundation/normalise/average',{zero:fmt(m.probabilities[0]),one:fmt(m.mean),mean:fmt(m.mean)})];
          texts[1]+=' With θ = '+value+', the total is approximately '+fmt(m.z)+'.';
          texts[2]+=' Outcome 1 has probability approximately '+fmt(m.mean)+'.';
          texts[3]+=' The average equals approximately '+fmt(m.mean)+'.';
          break;
        case 'normaliser-gradient':
          frames=[box('Normaliser Zθ',fmt(m.z)),box('Derivative of Zθ',fmt(m.weights[1])),
            mathBox('Divide by the normaliser','foundation/normaliser-gradient/ratio',{weight:fmt(m.weights[1]),total:fmt(m.z)}),
            bar('Model weight for a = 1',m.mean,1)+box('Derivative and average',fmt(m.mean))];
          texts[3]+=' At θ = '+value+', both equal approximately '+fmt(m.mean)+'.';
          break;
        case 'likelihood':
          var gradient=m.mean-0.8,updated=value-0.1*gradient;
          frames=[box('Log normaliser',fmt(Math.log(m.z))),box('Observed average','8/10 = 0.8')+box('Average NLL',fmt(nll(value,0.8))),
            bar('Data average',0.8,1)+bar('Model average',m.mean,1)+box('Model minus data',fmt(gradient)),
            box('Learning rate η','0.1')+box('Updated θ',fmt(updated))+box('Updated model average',fmt(normalise(updated).mean))];
          texts[2]+=' Here, the gradient is approximately '+fmt(gradient)+'.';
          texts[3]='With learning rate 0.1, subtract the gradient times 0.1. Then θ becomes approximately '+fmt(updated)+'.';
          break;
        case 'langevin':
          var descent=[3],chain=[3];
          noises.forEach(function(noise){descent.push((1-value)*descent[descent.length-1]);chain.push(langevin(chain[chain.length-1],value,noise));});
          function trace(noisy){
            var series=noisy?[descent,chain]:[descent],max=Math.max(3,Math.max.apply(null,chain.map(Math.abs)));
            var svg='<svg viewBox="0 0 600 240" role="img" aria-label="'+(noisy?'Deterministic descent and one illustrative noisy path':'Deterministic descent path')+'"><line class="ivf-axis" x1="40" y1="120" x2="570" y2="120"/>';
            series.forEach(function(xs,i){svg+='<polyline class="ivf-path '+(i?'ivf-noisy':'')+'" points="'+xs.map(function(x,k){return (40+26*k)+','+(120-90*x/max);}).join(' ')+'"/>';});
            return svg+'<text x="40" y="225">Step 0</text><text x="490" y="225">Step 20</text></svg>'+box('Descent final x',fmt(descent[20]))+(noisy?box('Noisy path final x',fmt(chain[20])):'');
          }
          frames=[box('Start x₀','3')+box('Target variance','1'),trace(false),trace(true),
            bar('Target variance',1,2)+bar('Stationary chain variance',stationaryVariance(value),2)];
          texts[2]+=' The accent-coloured path shows 20 steps from one fixed noise sequence; the muted path shows descent.';
          texts[3]+=' At h = '+value+', stationary variance is approximately '+fmt(stationaryVariance(value))+'.';
          break;
        case 'autograd':
          var input=value==='Input x',chosen=input?'x':'w',other=input?'w':'x',g=gradients(2,3),derivative=input?g.input:g.parameter;
          frames=[box('Forward path','x = 3 → y = 2x = 6 → L = 18'),
            mathBox('Chosen gradient','foundation/autograd/'+(input?'input':'parameter')+'-gradient'),
            '<pre><code>'+safe('import torch\nx = torch.tensor(3.0)\nw = torch.tensor(2.0)\n'+chosen+'.requires_grad_(True)\n'+other+'.requires_grad_(False)\ny = w * x\nloss = y.square() / 2\nloss.backward()')+'</code></pre>',
            '<pre><code>'+safe('with torch.no_grad():\n    '+chosen+' -= 0.01 * '+chosen+'.grad\n'+chosen+'.grad = None')+'</code></pre>'+box('Updated '+chosen,fmt((input?3:2)-0.01*derivative))];
          texts[1]+=' Selecting '+chosen+' gives gradient '+derivative+'.';
          texts[2]='Track '+chosen+' and freeze '+other+'. Backward calculates the chosen gradient without updating either value.';
          texts[3]+=' Here, the update changes '+chosen+' to '+fmt((input?3:2)-0.01*derivative)+'.';
          break;
        case 'tensor':
          var shapes=tensor(value,'sum');
          frames=[box('Input shape','['+shapes.input.join(', ')+']'),box('Convolution output','['+shapes.conv.join(', ')+']'),
            box('Flattened features','['+shapes.flat.join(', ')+']')+box('One score per image','['+value+', 1] → ['+value+']'),
            box('Sum of illustrative scores',String(shapes.reduction))+box('Mean of illustrative scores','2')];
          texts[0]+=' The batch currently contains '+value+' image'+(value===1?'':'s')+'.';
          texts[3]+=' With B = '+value+', the sum is '+shapes.reduction+' and the mean is 2.';
          break;
      }
      return {frames:frames,texts:texts};
    }
    var player=window.InterviewNarrative.mount(root.querySelector('.ivf-player'),{
      steps:data.steps.map(function(_,i){return function(){return state().texts[i];};}),
      draw:function(at){
        var s=state();diagram.innerHTML=s.frames[at];
        diagram.setAttribute('aria-label',data.title+'. '+s.texts[at]);
        rows.forEach(function(row,i){row.classList.toggle('is-current',i===at);});
      }
    });
    root.querySelector('.ivf-interactive').hidden=false;
    control.addEventListener(control.tagName==='SELECT'?'change':'input',function(){player.refresh();});
  });
}());
