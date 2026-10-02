/** Metacognition: checks for confidence, reliance, and what to hand over. */
(function () {
  'use strict';

  var CLAIMS = [
    { text: 'Sunlight takes about 8 minutes to reach Earth.', answer: true, note: 'It takes about 8 minutes and 20 seconds on average.' },
    { text: 'The Great Wall of China is visible to the naked eye from the Moon.', answer: false, note: 'At that distance it is far too narrow to see with the naked eye.' },
    { text: 'An octopus has 3 hearts.', answer: true, note: 'One heart pumps blood around the body, and 2 more pump it through the gills.' },
    { text: 'The summit of Mount Everest is the point on Earth farthest from its centre.', answer: false, note: 'That point is the summit of Chimborazo in Ecuador. Earth bulges at the equator, which lifts it further out.' },
    { text: 'Botanically, a banana is a berry.', answer: true, note: 'It grows from a single flower with one ovary, which is how botanists define a berry.' }
  ];

  // 20 made-up answers, 14 right. Both assistants are equally accurate; only
  // what their confidence says about each answer differs.
  var ASSISTANT = {
    correct: [true, true, false, true, true, true, false, true, true, true, false, true, true, true, false, true, false, true, true, false],
    tracks: [95, 90, 60, 88, 97, 85, 70, 92, 70, 93, 55, 91, 86, 99, 85, 89, 65, 94, 80, 60],
    flat: [95, 95, 95, 95, 95, 95, 95, 95, 95, 95, 95, 95, 95, 95, 95, 95, 95, 95, 95, 95]
  };

  var PHASES = {
    before: { title: 'Plan', questions: ['What is the goal, and what would a good answer look like?', 'What do I already know about this?', 'Which part must I do myself to learn it?'] },
    during: { title: 'Monitor', questions: ['Can I explain the last step without looking?', 'How sure am I, as a number?', 'Does this read easily because I understand it, or because it is well written?'] },
    after: { title: 'Evaluate', questions: ['Which of my predictions missed?', 'What did the tool do that I want to learn to do?', 'What will I change next time?'] }
  };

  var TASKS = [
    { text: 'Format a reference list', pick: 'hand', why: 'It needs doing, and I learn little from doing it again.' },
    { text: 'Draft a routine status email', pick: 'hand', why: 'The stakes are low, the result is easy to check, and I know what good looks like.' },
    { text: 'Summarise 10 papers I must cite', pick: 'along', why: 'It can find and sort them. I read the passages I will rely on.' },
    { text: 'Debug code in a language I am learning', pick: 'keep', why: 'The struggle is the lesson. I ask it for hints and write the fix myself.' },
    { text: 'Choose between 2 job offers', pick: 'keep', why: 'It can suggest questions. The weighing depends on things only I know.' },
    { text: 'Review a model’s output for errors', pick: 'along', why: 'It can flag candidates. Deciding what counts as an error is the skill I want to keep.' }
  ];
  var VERBS = { hand: 'hand it over', along: 'work alongside it', keep: 'keep it' };

  function round1(x) { return Math.round(x * 10) / 10; }
  function plural(n, word) { return n + ' ' + word + (n === 1 ? '' : 's'); }

  function summarise(rounds) {
    var n = rounds.length;
    if (!n) return { n: 0, meanConfidence: 0, hitRate: 0, gap: 0, verdict: 'none' };
    var confidence = 0, hits = 0;
    rounds.forEach(function (r) { confidence += r.confidence; if (r.correct) hits++; });
    var meanConfidence = round1(confidence / n), hitRate = round1(hits / n * 100), gap = round1(meanConfidence - hitRate);
    return { n: n, meanConfidence: meanConfidence, hitRate: hitRate, gap: gap, verdict: gap > 10 ? 'over' : gap < -10 ? 'under' : 'close' };
  }

  function verdictText(s) {
    if (!s.n) return 'Your average confidence and hit rate appear here after each claim.';
    var line = 'Average confidence ' + s.meanConfidence + '%. Correct ' + s.hitRate + '%.';
    if (s.n < CLAIMS.length) return line;
    if (s.verdict === 'over') return line + ' You were ' + s.gap + ' points more confident than accurate. Next round, lower the number on claims you cannot trace.';
    if (s.verdict === 'under') return line + ' You were ' + (-s.gap) + ' points less confident than accurate. You knew more than you claimed.';
    return line + ' Your confidence and your accuracy were within 10 points of each other.';
  }

  function simulate(confidences, correct, threshold) {
    var out = { cells: [], acceptedRight: 0, acceptedWrong: 0, checked: 0 };
    confidences.forEach(function (confidence, i) {
      var accepted = confidence >= threshold;
      out.cells.push({ confidence: confidence, correct: correct[i], accepted: accepted });
      if (!accepted) out.checked++;
      else if (correct[i]) out.acceptedRight++;
      else out.acceptedWrong++;
    });
    return out;
  }

  function arbitrationText(kind, r, threshold) {
    if (kind === 'flat') {
      return 'Its confidence never moves. My threshold can only accept all 20 answers or check all 20.' +
        (r.checked ? ' Right now I check every answer myself.' : ' Right now I accept every answer, including ' + plural(r.acceptedWrong, 'wrong one') + '.');
    }
    return 'Its confidence carries information. At ' + threshold + '%, I check ' + plural(r.checked, 'answer') +
      ' and accept ' + plural(r.acceptedWrong, 'wrong answer') + '.';
  }

  function checkReply(rating, correct) {
    return (correct ? 'Right. The paragraph describes the effect and never gives the reason.' :
      'The paragraph never gives the reason. It only says that short waves scatter more.') +
      ' You rated your ability to explain it at ' + rating + '%' +
      (rating >= 70 ? ', so the smooth writing supplied part of that feeling.' : ', which matches what the paragraph gave you.') +
      ' Molecules are far smaller than light’s wavelength. They act like tiny antennas that re-radiate the light.' +
      ' Shorter waves get re-radiated far more strongly, roughly with the fourth power of frequency.';
  }

  function offloadReply(task, choice) {
    return (choice === task.pick ? 'Same as mine. ' : 'I would ' + VERBS[task.pick] + '. ') + task.why;
  }

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
      CLAIMS: CLAIMS, ASSISTANT: ASSISTANT, PHASES: PHASES, TASKS: TASKS,
      summarise: summarise, simulate: simulate, verdictText: verdictText,
      checkReply: checkReply, arbitrationText: arbitrationText, offloadReply: offloadReply
    };
    return;
  }
  if (typeof document === 'undefined') return;
}());
