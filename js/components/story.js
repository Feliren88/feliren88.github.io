(function(){'use strict';
  var bar=document.getElementById('ms-progress-fill');
  var links=Array.prototype.slice.call(document.querySelectorAll('#ms-rail a'));
  var acts=Array.prototype.slice.call(document.querySelectorAll('.ms-act'));
  var ticking=false;
  function paint(){
    var h=document.documentElement.scrollHeight-window.innerHeight;
    if(bar)bar.style.width=(h>0?Math.max(0,Math.min(100,window.scrollY/h*100)):0)+'%';
    var line=window.innerHeight*.38,current=acts[0];
    acts.forEach(function(a){if(a.getBoundingClientRect().top<=line)current=a;});
    links.forEach(function(l){var on=current&&l.dataset.act===current.dataset.act;l.classList.toggle('is-on',on);if(on)l.setAttribute('aria-current','step');else l.removeAttribute('aria-current');});
    ticking=false;
  }
  addEventListener('scroll',function(){if(!ticking){ticking=true;requestAnimationFrame(paint);}},{passive:true});paint();
  if('IntersectionObserver' in window){
    var observer=new IntersectionObserver(function(entries){entries.forEach(function(entry){if(entry.isIntersecting){entry.target.classList.add('is-seen');observer.unobserve(entry.target);}});},{threshold:.18});
    Array.prototype.forEach.call(document.querySelectorAll('.ms-scene'),function(scene){observer.observe(scene);});
  }else{
    Array.prototype.forEach.call(document.querySelectorAll('.ms-scene'),function(scene){scene.classList.add('is-seen');});
  }
})();
