/* A caption and a drawing advance together; audio starts only on request. */
(function () {
  'use strict';
  function mount(host, options) {
    var at = 0, timer = null, speaking = false;
    var steps = options.steps;
    host.innerHTML = '<ol class="ivn-steps"></ol><p class="ivn-say" role="status" aria-live="polite"></p>' +
      '<div class="ivn-controls"><button type="button" data-prev>Previous</button><button type="button" data-next>Next</button>' +
      '<button type="button" data-play aria-pressed="false">Play</button><button type="button" data-reset>Reset</button>' +
      '<label>Step<input data-scrub type="range" min="0" max="'+(steps.length-1)+'" value="0"></label>' +
      '<label>Speed<select data-speed><option value="4000">Slow</option><option value="2400" selected>Normal</option><option value="1200">Fast</option></select></label>' +
      '<button type="button" data-listen>Listen to this step</button><output data-count></output></div>';
    var list = host.querySelector('.ivn-steps'), say = host.querySelector('.ivn-say');
    var play = host.querySelector('[data-play]'), scrub = host.querySelector('[data-scrub]');
    steps.forEach(function (_, i) {
      var item = document.createElement('li'), button = document.createElement('button');
      button.type = 'button'; button.dataset.step = i;
      button.addEventListener('click', function () { pause(); go(i); });
      item.appendChild(button); list.appendChild(item);
    });
    function caption(i) { return typeof steps[i] === 'function' ? steps[i]() : steps[i]; }
    function pause() {
      clearTimeout(timer); timer = null; play.textContent = 'Play'; play.setAttribute('aria-pressed','false');
      if (speaking) { window.speechSynthesis.cancel(); speaking = false; }
    }
    function go(i) {
      at = Math.max(0, Math.min(steps.length-1, i));
      list.querySelectorAll('button').forEach(function (button, n) {
        button.textContent = (n+1)+'. '+caption(n);
        button.setAttribute('aria-current', n===at ? 'step' : 'false');
      });
      say.textContent = caption(at); scrub.value = at;
      host.querySelector('[data-count]').textContent = (at+1)+' / '+steps.length;
      host.querySelector('[data-prev]').disabled = at===0;
      host.querySelector('[data-next]').disabled = at===steps.length-1;
      options.draw(at);
    }
    function schedule() {
      timer = setTimeout(function () {
        if (document.hidden || !host.getBoundingClientRect().height) { pause(); return; }
        go(at+1);
        if (at===steps.length-1) pause(); else schedule();
      }, +host.querySelector('[data-speed]').value);
    }
    play.addEventListener('click', function () {
      if (timer!==null) { pause(); return; }
      if (at===steps.length-1) go(0);
      play.textContent='Pause'; play.setAttribute('aria-pressed','true'); schedule();
    });
    host.querySelector('[data-prev]').addEventListener('click',function(){pause();go(at-1);});
    host.querySelector('[data-next]').addEventListener('click',function(){pause();go(at+1);});
    host.querySelector('[data-reset]').addEventListener('click',function(){pause();go(0);});
    scrub.addEventListener('input',function(){pause();go(+scrub.value);});
    host.querySelector('[data-speed]').addEventListener('change',function(){if(timer!==null){clearTimeout(timer);schedule();}});
    var listen=host.querySelector('[data-listen]');
    if (!('speechSynthesis' in window)) listen.hidden=true;
    else listen.addEventListener('click',function(){
      pause(); var speech=new SpeechSynthesisUtterance(caption(at)); speech.lang='en-GB';
      speaking=true; speech.onend=function(){speaking=false;}; window.speechSynthesis.speak(speech);
    });
    document.addEventListener('visibilitychange',function(){if(document.hidden)pause();});
    if ('IntersectionObserver' in window) new IntersectionObserver(function(entries){
      if(!entries[0].isIntersecting)pause();
    }).observe(host.closest('.ue-animation, .ivd-panel, .ivn-module-animation, .an-host') || host);
    go(0);
    return {refresh:function(){pause();go(at);},reset:function(){pause();go(0);}};
  }
  window.InterviewNarrative={mount:mount};
}());
