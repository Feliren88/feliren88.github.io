(function () {
  'use strict';

  function all(selector, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(selector));
  }

  var probeLab = document.getElementById('heron-probe-lab');
  if (probeLab) {
    var probes = {
      naive: {
        auc: 93.7, tpr: 71.0, fpr: 3.1,
        read: 'The naive probe looks perfect on the easy comparison, but catches only 71.0% of the held-out attack family once harmless prefixed prompts are included.'
      },
      aware: {
        auc: 99.8, tpr: 98.8, fpr: 2.9,
        read: 'Control-aware training separates attacks from harmless prefixed prompts and catches 98.8% of the held-out attack family while keeping the benign-pool false-positive rate at 2.9%.'
      }
    };

    function paintProbe(name) {
      var state = probes[name];
      all('[data-heron-probe]', probeLab).forEach(function (button) {
        var active = button.getAttribute('data-heron-probe') === name;
        button.classList.toggle('is-active', active);
        button.setAttribute('aria-pressed', active ? 'true' : 'false');
      });
      ['auc', 'tpr', 'fpr'].forEach(function (metric) {
        probeLab.querySelector('[data-heron-value="' + metric + '"]').textContent = state[metric].toFixed(1) + '%';
        probeLab.querySelector('[data-heron-bar="' + metric + '"]').style.width = (metric === 'fpr' ? state[metric] * 10 : state[metric]) + '%';
      });
      document.getElementById('heron-probe-read').textContent = state.read;
    }

    all('[data-heron-probe]', probeLab).forEach(function (button) {
      button.addEventListener('click', function () { paintProbe(button.getAttribute('data-heron-probe')); });
    });
    paintProbe('naive');
  }

  var layerLab = document.getElementById('heron-layer-lab');
  if (layerLab) {
    var layers = {
      '0': { name: 'Embedding layer 0', auc: '0.500', note: 'Chance: the signal is not linearly available here.', read: 'At layer 0, last-token AUC is 0.500: chance.' },
      '4': { name: 'Early-middle layers 4–7', auc: '1.000', note: 'Peak held-out AUC in the layer sweep.', read: 'The last-token signal peaks at 1.000 around layers 4–7. Goal-override intent is most linearly available in these early-middle layers.' },
      '12': { name: 'Pre-registered layer 12', auc: '0.992', note: 'Value on the layer-sweep split.', read: 'The pre-registered layer 12 reaches 0.992 on the sweep split and 0.998 ± 0.003 across the separate 10-seed evaluation.' },
      '24': { name: 'Final layer 24', auc: '≈0.977', note: 'The signal remains strong but has decayed.', read: 'By layer 24, last-token AUC has decayed to approximately 0.977. The signal remains strong, but its clearest linear form appeared earlier.' }
    };

    all('[data-heron-layer]', layerLab).forEach(function (button) {
      button.addEventListener('click', function () {
        var key = button.getAttribute('data-heron-layer');
        var state = layers[key];
        all('[data-heron-layer]', layerLab).forEach(function (item) {
          var active = item === button;
          item.classList.toggle('is-active', active);
          item.setAttribute('aria-pressed', active ? 'true' : 'false');
        });
        document.getElementById('heron-layer-name').textContent = state.name;
        document.getElementById('heron-layer-auc').textContent = state.auc;
        document.getElementById('heron-layer-note').textContent = state.note;
        document.getElementById('heron-layer-read').textContent = state.read;
      });
    });
  }

  var calibrationLab = document.getElementById('heron-calibration-lab');
  if (calibrationLab) {
    var grid = document.getElementById('heron-cal-grid');
    for (var index = 0; index < 100; index += 1) {
      var cell = document.createElement('i');
      cell.setAttribute('aria-hidden', 'true');
      grid.appendChild(cell);
    }
    var calibration = {
      prefix: {
        alarms: 26, suffixFpr: '25.8%', poolFpr: 'Not reported', suffixTpr: '100.0%',
        read: 'The detector ranks suffix attacks well, but the prefix-only threshold misclassifies 25.8% of harmless suffix-form prompts. The false-positive guarantee does not cover a benign form absent from calibration.'
      },
      mixed: {
        alarms: 9, suffixFpr: '8.7%', poolFpr: '4.5%', suffixTpr: '99.5%',
        read: 'Adding suffix-form benign traffic changes only the calibration pool. Suffix-form false alarms fall to 8.7%, the combined benign pool reaches 4.5%, and suffix-attack TPR remains 99.5%.'
      }
    };

    function paintCalibration(name) {
      var state = calibration[name];
      all('[data-heron-cal]', calibrationLab).forEach(function (button) {
        var active = button.getAttribute('data-heron-cal') === name;
        button.classList.toggle('is-active', active);
        button.setAttribute('aria-pressed', active ? 'true' : 'false');
      });
      all('i', grid).forEach(function (cell, index) { cell.classList.toggle('is-alarm', index < state.alarms); });
      document.getElementById('heron-suffix-fpr').textContent = state.suffixFpr;
      document.getElementById('heron-pool-fpr').textContent = state.poolFpr;
      document.getElementById('heron-suffix-tpr').textContent = state.suffixTpr;
      document.getElementById('heron-cal-read').textContent = state.read;
    }

    all('[data-heron-cal]', calibrationLab).forEach(function (button) {
      button.addEventListener('click', function () { paintCalibration(button.getAttribute('data-heron-cal')); });
    });
    paintCalibration('prefix');
  }
}());
