(function () {
  'use strict';
  function one(selector) { return document.querySelector(selector); }
  function all(selector) { return Array.prototype.slice.call(document.querySelectorAll(selector)); }

  function progress() {
    var fill = one('#sl-progress-fill');
    if (!fill) return;
    function paint() {
      var root = document.documentElement;
      var max = root.scrollHeight - innerHeight;
      fill.style.width = (max > 0 ? scrollY / max * 100 : 0) + '%';
    }
    addEventListener('scroll', paint, { passive: true }); paint();
  }

  function rail() {
    var links = all('.sl-rail a');
    if (!links.length) return;
    var sections = links.map(function (link) { return one(link.getAttribute('href')); }).filter(Boolean);
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        links.forEach(function (link) { link.classList.toggle('is-active', link.getAttribute('href') === '#' + entry.target.id); });
      });
    }, { rootMargin: '-30% 0px -60% 0px' });
    sections.forEach(function (section) { observer.observe(section); });
  }

  function governor() {
    var input = one('#sl-governor'), map = one('.sl-control-map');
    if (!input || !map) return;
    function paint() {
      var value = +input.value;
      var shadow = map.querySelector('.sl-control-outcomes .is-shadow');
      var safe = map.querySelector('.sl-control-outcomes .is-safe');
      map.style.setProperty('--sl-govern', value / 100);
      map.style.setProperty('--sl-flow-y', (35 + value * .3) + '%');
      map.style.setProperty('--sl-ring', (value / 100) + 'rem');
      map.dataset.governor = value < 34 ? 'absent' : value < 68 ? 'negotiated' : 'active';
      shadow.style.opacity = Math.max(.18, 1 - value / 115);
      safe.style.opacity = Math.max(.18, .18 + value / 100);
      if (value < 34) {
        one('#sl-governor-state').textContent = 'capacity without protection';
        one('#sl-governor-copy').textContent = 'Discipline and resilience are routing demand straight into endurance. Other people receive the output; you inherit the cost.';
      } else if (value < 68) {
        one('#sl-governor-state').textContent = 'negotiated effort';
        one('#sl-governor-copy').textContent = 'Limits have entered the system, though pressure can still override them. Name the conditions under which your yes expires.';
      } else {
        one('#sl-governor-state').textContent = 'chosen contribution';
        one('#sl-governor-copy').textContent = 'Your strengths remain available while consent, health, exit power, and recovery constrain how much the system may take.';
      }
    }
    input.addEventListener('input', paint); paint();
  }

  function consent() {
    var demand = one('#sl-demand'), willing = one('#sl-consent');
    if (!demand || !willing) return;
    function paint() {
      var d = +demand.value, w = +willing.value, gap = d - w;
      one('#sl-load').style.height = (3 + d * .1) + 'rem';
      one('#sl-boundary').style.bottom = (4 + w * .1) + 'rem';
      one('#sl-load-label').textContent = d > 76 ? 'heavy demand' : d > 45 ? 'substantial demand' : 'bounded demand';
      var status = one('#sl-consent-status'), copy = one('#sl-consent-copy');
      if (gap > 18) { status.textContent = 'Capacity is being mistaken for permission.'; copy.textContent = 'The demand exceeds what you consent to give. Surviving it would not make the arrangement acceptable.'; }
      else if (gap > 0) { status.textContent = 'Renegotiate the load.'; copy.textContent = 'The gap is small enough to discuss, but large enough to become resentment if it stays unnamed.'; }
      else { status.textContent = 'The load fits the consent.'; copy.textContent = 'The work may still be difficult, but its cost has been chosen rather than silently assigned.'; }
    }
    demand.addEventListener('input', paint); willing.addEventListener('input', paint); paint();
  }

  function trial() {
    var button = one('#sl-achieve'), reset = one('#sl-trial-reset'), bars = one('#sl-trial-bars');
    if (!button || !reset || !bars) return;
    var rounds = 0;
    function paint() {
      var out = '', max = 7;
      for (var i = 0; i < rounds; i++) {
        var h = 45 + i * 18;
        out += '<rect class="sl-trial-bar" x="' + (70 + i * 78) + '" y="' + (220 - h) + '" width="48" height="' + h + '" rx="3"/>';
      }
      bars.innerHTML = out;
      var y = Math.max(30, 92 - rounds * 8);
      one('#sl-standard').setAttribute('y1', y); one('#sl-standard').setAttribute('y2', y);
      one('#sl-standard-label').setAttribute('y', y - 10);
      one('#sl-standard-label').textContent = rounds ? 'new definition of enough' : 'enough';
      var validation = rounds ? Math.max(10, 76 - rounds * 10) : 0;
      one('.sl-validation').style.setProperty('--validation', validation + '%');
      var answer = one('#sl-trial-answer');
      if (!rounds) answer.textContent = 'Before the first achievement, the mind promises that success will make you feel worthy.';
      else if (rounds < 3) answer.textContent = 'The result brought relief, but the standard moved before worth felt secure.';
      else answer.textContent = 'After ' + rounds + ' achievements, the record improved while the internal trial continued.';
    }
    button.addEventListener('click', function () { rounds = Math.min(7, rounds + 1); paint(); });
    reset.addEventListener('click', function () { rounds = 0; paint(); }); paint();
  }

  function cage() {
    var reward = one('#sl-reward'), protect = one('#sl-protect'), bars = one('#sl-cage-bars');
    if (!reward || !protect || !bars) return;
    for (var i = 0; i < 11; i++) bars.appendChild(document.createElement('i'));
    function paint() {
      var r = +reward.value, on = protect.getAttribute('aria-pressed') === 'true';
      var freedom = on ? Math.max(62, 100 - r * .22) : Math.max(8, 100 - r * .88);
      one('#sl-reward-bar').style.width = r + '%'; one('#sl-freedom-bar').style.width = freedom + '%';
      all('#sl-cage-bars i').forEach(function (bar, index) { bar.style.opacity = index < Math.round(r / 10) ? (on ? .22 : .82) : .05; });
      var answer = one('#sl-cage-answer');
      answer.textContent = on ? 'Keep raising the rewards only while exit power, health, and choice remain intact.' : (r > 68 ? 'The rewards now finance the reason leaving feels impossible.' : 'Visible reward is rising faster than the freedom needed to choose it again.');
    }
    reward.addEventListener('input', paint); protect.addEventListener('click', function () { protect.setAttribute('aria-pressed', protect.getAttribute('aria-pressed') === 'true' ? 'false' : 'true'); paint(); }); paint();
  }

  var STRENGTHS = [
    ['Intelligence','Rationalises self-neglect','Creates better choices'],['Discipline','Endures unhealthy situations','Builds work worth sustaining'],['Responsibility','Carries everyone','Chooses worthy obligations'],['Ambition','Never feels enough','Pursues mastery worth having'],['Independence','Becomes emotionally isolated','Protects healthy autonomy'],['Adaptability','Normalises bad environments','Changes course without normalising harm'],['Loyalty','Stays too long','Commits deeply with boundaries'],['Strategic thinking','Overthinks life','Turns strategy toward deliberate choices'],['Competence','Becomes exploited','Gains authority and ownership'],['Resilience','Tolerates unnecessary pain','Recovers and redirects'],['High standards','Becomes perfectionism','Produces excellence'],['Self-control','Suppresses needs','Names needs before acting']
  ];
  function strengths() {
    var host = one('#sl-strength-list'); if (!host) return;
    host.innerHTML = STRENGTHS.map(function (row, i) { return '<button type="button" role="option" data-i="' + i + '">' + row[0] + '</button>'; }).join('');
    var buttons = all('#sl-strength-list button');
    function choose(i) {
      var row = STRENGTHS[i];
      buttons.forEach(function (button, index) { var on = index === i; button.classList.toggle('is-on', on); button.setAttribute('aria-selected', on ? 'true' : 'false'); });
      one('#sl-strength-name').textContent = row[0]; one('#sl-strength-shadow').textContent = row[1]; one('#sl-strength-safe').textContent = row[2];
    }
    buttons.forEach(function (button) { button.addEventListener('click', function () { choose(+button.dataset.i); }); button.addEventListener('mouseenter', function () { choose(+button.dataset.i); }); }); choose(0);
  }

  function timing() {
    var input = one('#sl-speak'); if (!input) return;
    var points = [];
    for (var i = 0; i <= 20; i++) { var x = 44 + i / 20 * 636, y = 220 - Math.pow(i / 20, 2.35) * 184; points.push([x, y]); }
    var line = points.map(function (p, i) { return (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1); }).join('');
    one('#sl-damage-line').setAttribute('d', line); one('#sl-damage-area').setAttribute('d', line + 'L680 220L44 220Z');
    function paint() {
      var t = +input.value / 100, x = 44 + t * 636, y = 220 - Math.pow(t, 2.35) * 184, cost = Math.round(Math.pow(t, 2.35) * 100);
      one('#sl-speak-line').setAttribute('x1', x); one('#sl-speak-line').setAttribute('x2', x); one('#sl-speak-dot').setAttribute('cx', x); one('#sl-speak-dot').setAttribute('cy', y); one('#sl-timing-cost').textContent = cost;
      one('#sl-timing-answer').textContent = t < .35 ? 'The issue is still small enough to describe without building a case. Speaking now keeps private interpretations from hardening.' : t < .7 ? 'Interpretation has begun hardening around the facts. The conversation now carries more history than the original issue.' : 'The decision may look sudden from outside because the entire argument happened privately first.';
    }
    input.addEventListener('input', paint); paint();
  }

  var SCENARIOS = {
    work:{inherits:'health, options, and professional identity',refuse:'Refuse permanent emergency as the normal operating model.',protect:'Protect sleep, portable skill, reputation, and enough runway to leave.',say:'“This load is not sustainable under the current authority and resources.”',choose:'Choose work that deserves your capacity instead of consuming it.'},
    relationship:{inherits:'trust, attachment patterns, and accumulated silence',refuse:'Refuse reciprocity that exists only when you overgive.',protect:'Protect honesty, autonomy, dignity, and the ability to repair conflict.',say:'“This is what I need, and I need to know whether it can exist here.”',choose:'Choose repair when it is mutual; choose departure when self-erasure is the price.'},
    approval:{inherits:'a life optimised for other people’s reactions',refuse:'Refuse applause as the final authority on a private life.',protect:'Protect the judgment that can hear advice without surrendering the decision.',say:'“I understand the disappointment. This is still my decision.”',choose:'Choose what fits your life, even when the impressive option is easier to explain.'},
    sunk:{inherits:'the future cost of defending a past decision',refuse:'Refuse to spend more of your future only to justify what has already been spent.',protect:'Protect remaining time, capital, health, and the option to redirect.',say:'“The original investment is gone. I am deciding from today forward.”',choose:'Choose using future value and cost, not the emotional weight of history.'}
  };
  function trustee() {
    var scenario = 'work', direction = '';
    var scenarioButtons = all('#sl-scenarios button'), directionButtons = all('#sl-compass button[data-direction]');
    function paint() {
      scenarioButtons.forEach(function (button) { button.classList.toggle('is-on', button.dataset.scenario === scenario); });
      directionButtons.forEach(function (button) { button.classList.toggle('is-on', button.dataset.direction === direction); });
      one('#sl-future-inherits').textContent = SCENARIOS[scenario].inherits;
      one('#sl-compass-answer').textContent = direction ? SCENARIOS[scenario][direction] : 'Choose one direction from which to protect the future stakeholder.';
    }
    scenarioButtons.forEach(function (button) { button.addEventListener('click', function () { scenario = button.dataset.scenario; direction = ''; paint(); }); });
    directionButtons.forEach(function (button) { button.addEventListener('click', function () { direction = button.dataset.direction; paint(); }); }); paint();
  }

  function init() { progress(); rail(); governor(); consent(); trial(); cage(); strengths(); timing(); trustee(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
}());
