/** Success & Failure: interactive decision router and reading progress. */
(function () {
  'use strict';

  var actions = {
    scale: { title: 'Scale', icon: 'sf-scale', reason: 'The objective still matters, the strategy has repeated evidence, and the larger bet remains survivable and sustainable.' },
    maintain: { title: 'Maintain', icon: 'sf-maintain', reason: 'The current exposure remains useful, but the evidence or available capacity does not support a larger commitment yet.' },
    adapt: { title: 'Adapt', icon: 'sf-adapt', reason: 'Keep the objective. Change the strategy, channel, timing, partner, positioning, or arena before spending another attempt.' },
    pause: { title: 'Pause', icon: 'sf-pause', reason: 'The objective may still be sound, but readiness or external conditions are weak. Preserve the option and build what is missing.' },
    hedge: { title: 'Hedge', icon: 'sf-hedge', reason: 'Useful exposure remains, but uncertainty and downside are both meaningful. Limit concentration while evidence develops.' },
    exit: { title: 'Exit', icon: 'sf-exit', reason: 'The future result is no longer worth wanting. Past investment does not create a claim on future time, money, or identity.' }
  };

  var questions = {
    goal: { title: 'If this works as designed, do you still want the result?', note: 'Judge the life and obligations created by success, not the status attached to it.', yes: 'conditions', no: 'exit' },
    conditions: { title: 'Do current conditions and your readiness support another move?', note: 'Consider energy, timing, information, resources, and the surrounding environment.', yes: 'strategy', no: 'pause' },
    strategy: { title: 'Is there evidence that the present strategy is sound?', note: 'A valuable objective does not make its current route correct.', yes: 'repeatable', no: 'adapt' },
    repeatable: { title: 'Has the result repeated under meaningfully independent conditions?', note: 'One result is data. Repetition is stronger evidence of a mechanism.', yes: 'capacity', no: 'downside' },
    capacity: { title: 'Can a larger version survive failure and fit available capacity?', note: 'Check concentration, fixed obligations, energy, reversibility, and what scale displaces.', yes: 'scale', no: 'maintain' },
    downside: { title: 'Would another attempt create meaningful downside or concentration?', note: 'Uncertainty alone does not require delay. Uncertainty combined with damage requires protection.', yes: 'hedge', no: 'maintain' }
  };

  function icon(id) {
    return '<svg class="sf-i" viewBox="0 0 24 24" aria-hidden="true"><use href="#' + id + '"/></svg>';
  }

  function initRouter() {
    var host = document.getElementById('sf-router');
    if (!host) return;
    var stage = document.getElementById('sf-router-stage');
    var controls = document.getElementById('sf-router-actions');
    var result = document.getElementById('sf-router-result');
    var stepLabel = document.getElementById('sf-router-step');
    var bar = document.getElementById('sf-router-bar');
    var history = [];

    function showQuestion(key) {
      var q = questions[key];
      history.push(key);
      result.hidden = true;
      stage.hidden = false;
      controls.hidden = false;
      stepLabel.textContent = 'Question ' + history.length + ' of 5';
      bar.style.width = Math.min(100, history.length * 20) + '%';
      stage.innerHTML = '<h3>' + q.title + '</h3><p>' + q.note + '</p>';
      controls.innerHTML = '<button class="sf-choice" type="button" data-next="' + q.yes + '">Yes</button>' +
        '<button class="sf-choice" type="button" data-next="' + q.no + '">No</button>' +
        (history.length > 1 ? '<button class="sf-choice" type="button" data-back="true">Back</button>' : '');
    }

    function showResult(key) {
      var a = actions[key];
      stage.hidden = true;
      controls.hidden = true;
      result.hidden = false;
      stepLabel.textContent = 'Recommended response';
      bar.style.width = '100%';
      result.innerHTML = '<div class="sf-result-head">' + icon(a.icon) + '<h3>' + a.title + '</h3></div>' +
        '<p class="sf-result-reason">' + a.reason + '</p>' +
        '<button class="sf-restart" type="button">Start again</button>';
    }

    controls.addEventListener('click', function (event) {
      var button = event.target.closest('button');
      if (!button) return;
      if (button.hasAttribute('data-back')) {
        history.pop();
        var previous = history.pop() || 'goal';
        showQuestion(previous);
        return;
      }
      var next = button.getAttribute('data-next');
      if (questions[next]) showQuestion(next);
      else showResult(next);
    });
    result.addEventListener('click', function (event) {
      if (!event.target.closest('.sf-restart')) return;
      history = [];
      showQuestion('goal');
    });
    showQuestion('goal');
  }

  function initProgress() {
    var fill = document.getElementById('sf-progress-fill');
    if (!fill) return;
    function update() {
      var max = document.documentElement.scrollHeight - window.innerHeight;
      fill.style.width = (max > 0 ? Math.min(100, window.scrollY / max * 100) : 0) + '%';
    }
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
  }

  function init() {
    try { initRouter(); } catch (error) { /* The static action key remains usable. */ }
    try { initProgress(); } catch (error) { /* Reading remains unaffected. */ }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
}());
