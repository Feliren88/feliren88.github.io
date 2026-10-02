/* Replay the lesson's authored diagrams with synchronised captions and speech. */
(function () {
  'use strict';
  var supported=['llm-training','nlp','multimodality','embedding','edge-ai','agentic-ai','mlops','data-engineering','mechanistic-interpretability','ai-safety'];
  function init(){
    var page=document.querySelector('.syl-page');
    if(!page || supported.indexOf(page.dataset.topic)<0)return;
    page.querySelectorAll('.syl-module').forEach(function(module){
      var diagram=module.querySelector('.syl-viz'),old=diagram && diagram.querySelector('.ivp');
      if(!old)return;
      var buttons=Array.prototype.slice.call(old.querySelectorAll('.ivp-step'));
      var steps=buttons.map(function(button){return button.querySelector('.ivp-t').textContent;});
      if(steps.length<2)return;
      var heading=module.querySelector('.syl-module-name').textContent;
      var section=document.createElement('section');section.className='ivn-module-animation';section.setAttribute('aria-label',heading+' animated walkthrough');
      diagram.insertAdjacentElement('beforebegin',section);section.appendChild(diagram);
      old.hidden=true;old.style.display='none';
      var drawing=diagram.querySelector('.ivz');
      drawing.classList.add('ivn-animated-viz');drawing.setAttribute('role','group');
      var narrator=document.createElement('div');narrator.className='ivn-module-player';section.appendChild(narrator);
      window.InterviewNarrative.mount(narrator,{steps:steps,draw:function(at){
        buttons[at].click();drawing.setAttribute('aria-label',heading+'. '+steps[at]);
      }});
    });
    // The track's detailed scene uses its own drawing functions and full captions.
    var flagship=page.querySelector('.an-host');
    if(flagship){
      var buttons=Array.prototype.slice.call(flagship.querySelectorAll('.an-stepbtn'));
      var status=flagship.querySelector('.an-say'),steps=[];
      buttons.forEach(function(button){button.click();steps.push(status.textContent);});
      if(steps.length){
        flagship.querySelector('.an-steps').style.display='none';
        flagship.querySelector('.an-ctl').style.display='none';status.style.display='none';
        flagship.classList.add('ivn-track-animation');
        var narrator=document.createElement('div');narrator.className='ivn-track-player';flagship.querySelector('.an').appendChild(narrator);
        window.InterviewNarrative.mount(narrator,{steps:steps,draw:function(at){buttons[at].click();}});
        flagship.addEventListener('keydown',function(event){
          if(event.key!=='ArrowRight' && event.key!=='ArrowLeft')return;
          // Keep the legacy scene handler from advancing without its new caption.
          event.stopImmediatePropagation();
          if(!event.target.matches('input, select')){
            event.preventDefault();narrator.querySelector(event.key==='ArrowRight'?'[data-next]':'[data-prev]').click();
          }
        },true);
      }
    }
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
}());
