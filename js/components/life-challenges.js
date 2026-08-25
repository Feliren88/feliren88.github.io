/** Life Challenges — interactive models for difficulty, uncertainty, and agency. */
(function () {
  'use strict';

  var $ = function (id) { return document.getElementById(id); };

  function buildHero() {
    var field = $('lc-raw-field');
    if (!field) return;
    ['failure', 'delay', 'pressure', 'friction', 'uncertainty'].forEach(function (label, index) {
      var item = document.createElement('i');
      item.textContent = label;
      item.style.setProperty('--i', index);
      field.appendChild(item);
    });
  }

  function initProgress() {
    var fill = $('lc-progress-fill');
    var links = Array.prototype.slice.call(document.querySelectorAll('.lc-rail a'));
    var sections = links.map(function (link) { return document.querySelector(link.getAttribute('href')); });
    function update() {
      var root = document.documentElement;
      var max = root.scrollHeight - window.innerHeight;
      if (fill) fill.style.width = (max > 0 ? window.scrollY / max * 100 : 0) + '%';
      var active = 0;
      sections.forEach(function (section, index) {
        if (section && section.getBoundingClientRect().top < window.innerHeight * 0.45) active = index;
      });
      links.forEach(function (link, index) { link.classList.toggle('is-active', index === active); });
    }
    update();
    window.addEventListener('scroll', update, { passive: true });
  }

  function initConversion() {
    var ids = ['challenge', 'support', 'recovery', 'agency'];
    var controls = {};
    ids.forEach(function (id) { controls[id] = $('lc-' + id); });
    if (!controls.challenge) return;
    function update() {
      var challenge = +controls.challenge.value;
      var support = +controls.support.value;
      var recovery = +controls.recovery.value;
      var agency = +controls.agency.value;
      ids.forEach(function (id) { $('lc-' + id + '-value').textContent = controls[id].value; });
      var resources = support * .28 + recovery * .42 + agency * .3;
      var growth = Math.max(0, Math.min(100, challenge * .55 + resources * .62 - Math.max(0, challenge - resources) * .9));
      var strain = challenge - resources;
      var state;
      var copy;
      if (challenge < 25) {
        state = 'underload';
        copy = 'The system is safe and has little reason to adapt. Add a worthwhile stretch instead of manufacturing pain.';
      } else if (strain > 34) {
        state = 'overload';
        copy = 'Demand has outrun support, recovery, and control. Reduce the load or restore those protections before calling this growth.';
      } else if (strain > 12) {
        state = 'fragile stretch';
        copy = 'Learning is possible with a thin margin. More recovery or a real choice about the load would make the lesson safer.';
      } else {
        state = 'development';
        copy = 'The challenge is large enough to teach and supported enough to survive. This is where strain can become usable capacity.';
      }
      $('lc-conversion-result').textContent = state;
      $('lc-conversion-copy').textContent = copy;
      $('lc-vessel').querySelector('span').style.height = Math.max(12, growth) + '%';
      $('lc-vessel').querySelector('i').style.bottom = Math.min(94, challenge) + '%';
    }
    ids.forEach(function (id) { controls[id].addEventListener('input', update); });
    update();
  }

  function initComfort() {
    var moments = [
      { label: 'Pressure', title: 'A hard day does not need a life lesson.', now: 'Reduce the load enough to sleep, eat, think, and ask for help. Capacity cannot recover while every resource remains committed.', later: 'When the pressure falls, record which responsibility lacked authority, support, or a boundary.' },
      { label: 'Failure', title: 'A bad result is not a final account of you.', now: 'Stabilize the practical damage. You can postpone the story about what this says about your character.', later: 'Find where your model first parted from reality. Keep the information without turning the result into an identity.' },
      { label: 'Delay', title: 'Waiting can hurt even when the work is sound.', now: 'The effort and hope were real. You do not have to call the delay a gift while you are living through it.', later: 'Use the extra time where it improves readiness: skill, runway, evidence, relationships, or the structure beneath the outcome.' },
      { label: 'Loss', title: 'Some pain has no useful fix.', now: 'Stay near people who can share the weight without rushing you toward an explanation. Presence is enough for now.', later: 'Meaning may come through changed priorities, deeper care, or what you choose to protect. It does not have to justify what was lost.' },
      { label: 'Reinvention', title: 'You can be between identities without being lost.', now: 'Keep ordinary routines and close relationships while the next direction remains unproven. You still exist without the old role.', later: 'Build one small artifact in the new direction. Evidence can gradually replace the story you no longer believe.' }
    ];
    var picker = $('lc-comfort-picker');
    var slider = $('lc-distance');
    var stage = $('lc-comfort-stage');
    if (!picker || !slider || !stage) return;
    var selected = 0;

    function update() {
      var item = moments[selected];
      var distance = +slider.value;
      var phase = distance < 34 ? 'stabilize first' : distance < 68 ? 'regain room' : 'reflect when ready';
      stage.style.setProperty('--distance', distance + '%');
      stage.dataset.phase = distance < 34 ? 'now' : distance < 68 ? 'middle' : 'later';
      $('lc-comfort-word').textContent = item.label.toLowerCase();
      $('lc-comfort-phase').textContent = phase;
      $('lc-comfort-title').textContent = item.title;
      $('lc-comfort-now').textContent = item.now;
      $('lc-comfort-later').textContent = item.later;
    }

    moments.forEach(function (item, index) {
      var button = document.createElement('button');
      button.type = 'button';
      button.setAttribute('role', 'option');
      button.textContent = item.label;
      button.addEventListener('click', function () {
        selected = index;
        Array.prototype.forEach.call(picker.children, function (child, childIndex) {
          child.classList.toggle('is-active', childIndex === index);
          child.setAttribute('aria-selected', childIndex === index ? 'true' : 'false');
        });
        update();
      });
      picker.appendChild(button);
    });
    picker.children[0].classList.add('is-active');
    picker.children[0].setAttribute('aria-selected', 'true');
    slider.addEventListener('input', update);
    update();
  }

  function initDiagnosis() {
    var data = [
      { label: 'Skill gap', title: 'The task exceeds your current skill.', copy: 'The goal may still fit. The missing piece is competence you can name and practice.', action: 'Shrink the task and train the missing move.' },
      { label: 'Bad strategy', title: 'Effort is feeding the wrong mechanism.', copy: 'More force will repeat the result. Change the route before increasing the effort.', action: 'Run a smaller test with a different method.' },
      { label: 'Wrong environment', title: 'The system punishes the work you value.', copy: 'A hostile incentive structure can make sound judgment look ineffective. Endurance will not repair every institution.', action: 'Test the same strength in a better setting.' },
      { label: 'Wrong timing', title: 'Readiness and opportunity have not met.', copy: 'The idea can be sound while the conditions remain weak. Delay may protect the work instead of denying it.', action: 'Define the signal that would justify another attempt.' },
      { label: 'Wrong relationship', title: 'Repair is not reciprocal.', copy: 'Conflict can deepen trust when both people repair. One person carrying the whole repair process is different.', action: 'Ask for one observable act of reciprocity.' },
      { label: 'Wrong goal', title: 'The path exposed a borrowed desire.', copy: 'Difficulty often separates the work itself from the status, approval, or identity attached to it.', action: 'Name what you would still want without applause.' }
    ];
    var picker = $('lc-obstacle-picker');
    if (!picker) return;
    function select(index) {
      var item = data[index];
      Array.prototype.forEach.call(picker.children, function (button, i) {
        button.classList.toggle('is-active', i === index);
        button.setAttribute('aria-selected', i === index ? 'true' : 'false');
      });
      $('lc-diagnosis-title').textContent = item.title;
      $('lc-diagnosis-copy').textContent = item.copy;
      $('lc-diagnosis-action').textContent = item.action;
    }
    data.forEach(function (item, index) {
      var button = document.createElement('button');
      button.type = 'button';
      button.setAttribute('role', 'option');
      button.textContent = item.label;
      button.addEventListener('click', function () { select(index); });
      picker.appendChild(button);
    });
    select(0);
  }

  function initFutureMap() {
    var svg = $('lc-future-svg');
    var slider = $('lc-certainty');
    if (!svg || !slider) return;
    var nodes = [
      [90, 215, 'now', 0], [245, 90, 'stay', 1], [245, 215, 'test', 1], [245, 340, 'leave', 1],
      [450, 45, 'mastery', 2], [450, 125, 'stability', 2], [450, 185, 'evidence', 2], [450, 245, 'revision', 2], [450, 305, 'freedom', 2], [450, 385, 'reinvention', 2],
      [690, 35, 'teach', 3], [690, 90, 'lead', 3], [690, 145, 'belong', 3], [690, 200, 'build', 3], [690, 255, 'discover', 3], [690, 310, 'own', 3], [690, 365, 'begin again', 3]
    ];
    var links = [[0,1],[0,2],[0,3],[1,4],[1,5],[2,6],[2,7],[3,8],[3,9],[4,10],[4,11],[5,12],[6,13],[7,14],[8,15],[9,16]];
    var nodeGroup = $('lc-future-nodes');
    var linkGroup = $('lc-future-links');
    nodes.forEach(function (node, index) {
      var group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      group.dataset.depth = node[3];
      group.dataset.index = index;
      var circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('cx', node[0]); circle.setAttribute('cy', node[1]); circle.setAttribute('r', node[3] === 0 ? 18 : 11);
      var text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('x', node[0]); text.setAttribute('y', node[1] + (node[3] === 0 ? 38 : 28)); text.textContent = node[2];
      group.appendChild(circle); group.appendChild(text); nodeGroup.appendChild(group);
    });
    links.forEach(function (link) {
      var a = nodes[link[0]]; var b = nodes[link[1]];
      var line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', a[0]); line.setAttribute('y1', a[1]); line.setAttribute('x2', b[0]); line.setAttribute('y2', b[1]);
      line.dataset.depth = b[3]; linkGroup.appendChild(line);
    });
    function update() {
      var certainty = +slider.value;
      var visibleDepth = certainty > 78 ? 1 : certainty > 48 ? 2 : 3;
      var visibleNodes = nodes.filter(function (node) { return node[3] <= visibleDepth; }).length;
      Array.prototype.forEach.call(svg.querySelectorAll('[data-depth]'), function (item) {
        var visible = +item.dataset.depth <= visibleDepth;
        item.style.opacity = visible ? '1' : '.06';
        item.style.pointerEvents = visible ? 'auto' : 'none';
      });
      $('lc-door-count').textContent = visibleNodes - 1 + ' futures visible';
      $('lc-uncertainty-copy').textContent = visibleDepth === 1
        ? 'The demand for guarantees has collapsed the map to three familiar choices.'
        : visibleDepth === 2
          ? 'Some exploration remains. Distant possibilities disappear before evidence can reach them.'
          : 'Low certainty keeps discovery, reinvention, ownership, and new work available while the evidence develops.';
    }
    slider.addEventListener('input', update); update();
  }

  function initPressure() {
    var slider = $('lc-pressure');
    if (!slider) return;
    function pointAt(value) {
      var x = 55 + value * 6.5;
      var y;
      if (value <= 58) y = 276 - 195 * Math.pow(value / 58, 1.65);
      else y = 81 + 191 * Math.pow((value - 58) / 42, 1.55);
      return [x, y];
    }
    function update() {
      var value = +slider.value; var point = pointAt(value); var state; var copy;
      $('lc-pressure-guide').setAttribute('x1', point[0]); $('lc-pressure-guide').setAttribute('x2', point[0]);
      $('lc-pressure-dot').setAttribute('cx', point[0]); $('lc-pressure-dot').setAttribute('cy', point[1]);
      if (value < 25) { state = 'underload'; copy = 'Comfort protects energy while asking for little adaptation at this level.'; }
      else if (value < 70) { state = 'useful stretch'; copy = 'Demand and recovery can coexist here. The challenge produces feedback without consuming the whole system.'; }
      else { state = 'destructive overload'; copy = 'Pressure is now reducing the capacity needed to learn. Recovery and control must rise, or the load must fall.'; }
      $('lc-pressure-state').textContent = state; $('lc-pressure-copy').textContent = copy;
    }
    slider.addEventListener('input', update); update();
  }

  function initGame() {
    var scenarios = [
      { tag: 'career', title: 'Your role pays well and consumes every exit route.', copy: 'Responsibility grows each quarter while ownership, energy, and decision power shrink.', actions: [
        ['Carry more', -1, 'More endurance deepens the dependence. Capability has turned into permanent availability.'],
        ['Negotiate terms', 2, 'A deadline, decision rights, and ownership test whether the role can become inhabitable.'],
        ['Leave tomorrow', 0, 'Leaving may be right. Panic has skipped the work of making the downside survivable.'] ] },
      { tag: 'failure', title: 'A project you led fails in public.', copy: 'The result is bad. Your mind wants to make it a verdict about who you are.', actions: [
        ['Hide the evidence', -1, 'Protecting identity wastes the clearest information the project produced.'],
        ['Run a postmortem', 2, 'Separating mechanism from identity turns the result into a better model.'],
        ['Start a bigger bet', -1, 'Escalation tries to erase shame with another outcome. It compounds the risk.'] ] },
      { tag: 'relationship', title: 'The same conflict returns after several honest conversations.', copy: 'You keep repairing. The other person keeps promising.', actions: [
        ['Explain it better', 0, 'Clarity cannot substitute for reciprocity. The pattern already contains behavioral evidence.'],
        ['Set an observable boundary', 2, 'A boundary makes the required change and consequence visible.'],
        ['Pretend it is fine', -1, 'Silence transfers the entire cost to your future self.'] ] },
      { tag: 'uncertainty', title: 'Two paths fit your values. Neither comes with a guarantee.', copy: 'More thinking now produces discomfort without adding evidence.', actions: [
        ['Wait for certainty', -1, 'The unavailable guarantee has become a condition for action.'],
        ['Choose a reversible test', 2, 'A small commitment buys information without pretending the unknowns are gone.'],
        ['Ask everyone', 0, 'Advice can add evidence. It cannot remove your responsibility for the choice.'] ] },
      { tag: 'reinvention', title: 'Your old identity no longer fits, and the new one is unproven.', copy: 'Staying preserves recognition. Experimenting risks becoming a beginner again.', actions: [
        ['Protect the title', -1, 'A familiar identity can become a cage when it outranks the life beneath it.'],
        ['Build one artifact', 2, 'An artifact tests the new direction without demanding a complete reinvention story.'],
        ['Announce the new self', 0, 'A declaration creates pressure before the work has produced evidence.'] ] }
    ];
    var index = 0; var score = 0; var answered = false;
    function render() {
      var item = scenarios[index]; answered = false;
      $('lc-game-round').textContent = 'scenario ' + (index + 1) + ' of ' + scenarios.length;
      $('lc-game-score').textContent = score + ' agency'; $('lc-game-tag').textContent = item.tag;
      $('lc-game-title').textContent = item.title; $('lc-game-copy').textContent = item.copy;
      $('lc-game-feedback').textContent = ''; $('lc-game-next').classList.remove('is-visible');
      var actions = $('lc-game-actions'); actions.innerHTML = '';
      item.actions.forEach(function (action) {
        var button = document.createElement('button'); button.type = 'button'; button.textContent = action[0];
        button.addEventListener('click', function () {
          if (answered) return; answered = true; score += action[1];
          $('lc-game-score').textContent = score + ' agency'; $('lc-game-feedback').textContent = action[2];
          Array.prototype.forEach.call(actions.children, function (child) { child.disabled = true; });
          $('lc-game-next').textContent = index === scenarios.length - 1 ? 'Play again' : 'Next scenario';
          $('lc-game-next').classList.add('is-visible');
        }); actions.appendChild(button);
      });
    }
    $('lc-game-next').addEventListener('click', function () {
      if (index === scenarios.length - 1) { index = 0; score = 0; } else index += 1;
      render();
    }); render();
  }

  function initArchitecture() {
    var data = [
      ['rescue', 'Solve the immediate break.', 'At first, competence means carrying the problem through. Necessary work can still become a trap when every success earns another rescue.', '<path d="M35 108L78 65L108 95L165 38"/><path d="M143 38H165V60"/>'],
      ['pattern', 'Find what keeps repeating.', 'A second failure gives you a comparison. Examine the conditions, incentives, and decisions that produced both.', '<circle cx="65" cy="80" r="28"/><circle cx="120" cy="80" r="28"/><circle cx="175" cy="80" r="28"/><path d="M93 80H92M148 80H147"/>'],
      ['architecture', 'Change the system that creates the break.', 'Move upstream. Redesign the rule, incentive, handoff, or boundary so good outcomes require less heroism.', '<path d="M35 125V75L75 45L115 75V125Z"/><path d="M115 125V62L155 32L198 62V125"/><path d="M72 125V92H94V125M150 82H175"/>'],
      ['method', 'Make the knowledge portable.', 'Write the checklist, model, standard, or tool. Private pattern recognition becomes useful beyond the person who earned it.', '<path d="M52 30H173V132H52Z"/><path d="M75 58H150M75 80H150M75 102H128"/><path d="M186 48V145H70"/>'],
      ['release', 'Build something that can survive your absence.', 'A mature system preserves the lesson, works without constant rescue, and returns your attention.', '<circle cx="120" cy="82" r="42"/><path d="M120 40V18M120 146V124M78 82H55M185 82H162"/><path d="M102 82L115 95L143 65"/>']
    ];
    var buttons = Array.prototype.slice.call(document.querySelectorAll('#lc-arch-track button'));
    function select(index) {
      var item = data[index];
      buttons.forEach(function (button, i) { button.classList.toggle('is-active', i === index); });
      $('lc-arch-number').textContent = '0' + (index + 1); $('lc-arch-label').textContent = item[0];
      $('lc-arch-title').textContent = item[1]; $('lc-arch-copy').textContent = item[2]; $('lc-arch-art').innerHTML = item[3];
    }
    buttons.forEach(function (button, index) { button.addEventListener('click', function () { select(index); }); });
    select(0);
  }

  function init() {
    buildHero(); initProgress(); initConversion(); initComfort(); initDiagnosis(); initFutureMap(); initPressure(); initGame(); initArchitecture();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
