(function () {
  'use strict';

  var example = document.querySelector('[data-about-decisions]');
  if (!example) return;

  var controls = example.querySelector('[data-about-controls]');
  var buttons = Array.from(example.querySelectorAll('[data-about-choice]'));
  var outcomes = Array.from(example.querySelectorAll('[data-about-outcome]'));
  var nextLabels = example.querySelectorAll('[data-about-next]');

  function selectChoice(choice) {
    var selected = outcomes.find(function (outcome) {
      return outcome.dataset.aboutOutcome === choice;
    });
    if (!selected) return;

    outcomes.forEach(function (outcome) {
      outcome.hidden = outcome !== selected;
    });
    buttons.forEach(function (button) {
      button.setAttribute('aria-pressed', String(button.dataset.aboutChoice === choice));
    });
    nextLabels.forEach(function (label) {
      label.textContent = selected.dataset.nextLabel;
    });
  }

  buttons.forEach(function (button) {
    button.addEventListener('click', function () {
      selectChoice(button.dataset.aboutChoice);
    });
  });
  selectChoice('act');
  controls.hidden = false;
})();
