/* Select a project's contribution and the open question it motivates. */
(function () {
  var explorer = document.querySelector('[data-research-connections]');
  if (!explorer) return;
  var controls = explorer.querySelector('[data-research-controls]');
  var buttons = explorer.querySelectorAll('[data-research-choice]');
  var panels = explorer.querySelectorAll('[data-research-connection]');
  var questions = document.querySelectorAll('.rd-card');

  function select(key) {
    var panel = Array.from(panels).find(function (item) {
      return item.dataset.researchConnection === key;
    });
    if (!panel) return;
    panels.forEach(function (item) { item.hidden = item !== panel; });
    buttons.forEach(function (button) {
      button.setAttribute('aria-pressed', String(button.dataset.researchChoice === key));
    });
    questions.forEach(function (question) {
      question.classList.toggle('is-connected', question.id === panel.dataset.question);
    });
  }

  buttons.forEach(function (button) {
    button.addEventListener('click', function () { select(button.dataset.researchChoice); });
  });
  document.querySelectorAll('[data-research-trace]').forEach(function (link) {
    link.addEventListener('click', function () { select(link.dataset.researchTrace); });
  });
  function selectHash() {
    var prefix = '#connection-';
    if (window.location.hash.indexOf(prefix) === 0) {
      select(window.location.hash.slice(prefix.length));
    }
  }
  window.addEventListener('hashchange', selectHash);
  if (buttons.length) {
    select(buttons[0].dataset.researchChoice);
    selectHash();
    controls.hidden = false;
  }
})();
