const assert = require('node:assert/strict');
const mc = require('../js/components/metacognition.js');

// Calibration summary.
assert.deepEqual(mc.summarise([]), { n: 0, meanConfidence: 0, hitRate: 0, gap: 0, verdict: 'none' });
const over = mc.summarise([
  { confidence: 90, correct: true }, { confidence: 90, correct: false }, { confidence: 90, correct: false },
  { confidence: 80, correct: true }, { confidence: 100, correct: false }
]);
assert.deepEqual(over, { n: 5, meanConfidence: 90, hitRate: 40, gap: 50, verdict: 'over' });
const under = mc.summarise([
  { confidence: 60, correct: true }, { confidence: 60, correct: true }, { confidence: 50, correct: true },
  { confidence: 70, correct: true }, { confidence: 60, correct: false }
]);
assert.equal(under.gap, -20);
assert.equal(under.verdict, 'under');
const edge = mc.summarise([
  { confidence: 90, correct: true }, { confidence: 90, correct: true }, { confidence: 90, correct: true },
  { confidence: 90, correct: true }, { confidence: 90, correct: false }
]);
assert.equal(edge.gap, 10, 'a gap of exactly 10 points');
assert.equal(edge.verdict, 'close', 'a gap of exactly 10 points counts as close');

// Calibration copy.
assert.equal(mc.verdictText(mc.summarise([])), 'Your average confidence and hit rate appear here after each claim.');
assert.equal(mc.verdictText({ n: 2, meanConfidence: 90, hitRate: 50, gap: 40, verdict: 'over' }), 'Average confidence 90%. Correct 50%.');
assert.equal(mc.verdictText({ n: 5, meanConfidence: 90, hitRate: 60, gap: 30, verdict: 'over' }),
  'Average confidence 90%. Correct 60%. You were 30 points more confident than accurate. Next round, lower the number on claims you cannot trace.');
assert.equal(mc.verdictText({ n: 5, meanConfidence: 60, hitRate: 80, gap: -20, verdict: 'under' }),
  'Average confidence 60%. Correct 80%. You were 20 points less confident than accurate. You knew more than you claimed.');
assert.equal(mc.verdictText({ n: 5, meanConfidence: 80, hitRate: 80, gap: 0, verdict: 'close' }),
  'Average confidence 80%. Correct 80%. Your confidence and your accuracy were within 10 points of each other.');

// The five claims are checkable and balanced enough to score.
assert.equal(mc.CLAIMS.length, 5);
for (const claim of mc.CLAIMS) {
  assert.equal(typeof claim.answer, 'boolean');
  assert.ok(claim.text.length > 10 && claim.note.length > 10);
}
assert.deepEqual(mc.CLAIMS.map(c => c.answer), [true, false, true, false, true]);

// The reliance simulation: same accuracy, different confidence.
const A = mc.ASSISTANT;
assert.equal(A.correct.length, 20);
assert.equal(A.correct.filter(Boolean).length, 14);
assert.ok(A.tracks.length === 20 && A.flat.length === 20 && A.flat.every(c => c === 95));
const t80 = mc.simulate(A.tracks, A.correct, 80);
assert.deepEqual([t80.acceptedRight, t80.acceptedWrong, t80.checked], [13, 1, 6]);
const t85 = mc.simulate(A.tracks, A.correct, 85);
assert.deepEqual([t85.acceptedRight, t85.acceptedWrong, t85.checked], [12, 1, 7], 'the threshold is inclusive');
const f80 = mc.simulate(A.flat, A.correct, 80);
assert.deepEqual([f80.acceptedRight, f80.acceptedWrong, f80.checked], [14, 6, 0]);
const f100 = mc.simulate(A.flat, A.correct, 100);
assert.deepEqual([f100.acceptedRight, f100.acceptedWrong, f100.checked], [0, 0, 20]);
assert.ok(t80.cells.every(cell => cell.accepted === (cell.confidence >= 80)));

// Reliance copy, including singular and plural.
assert.equal(mc.arbitrationText('tracks', t80, 80), 'Its confidence carries information. At 80%, I check 6 answers and accept 1 wrong answer.');
assert.equal(mc.arbitrationText('tracks', mc.simulate(A.tracks, A.correct, 50), 50), 'Its confidence carries information. At 50%, I check 0 answers and accept 6 wrong answers.');
assert.equal(mc.arbitrationText('flat', f80, 80), 'Its confidence never moves. My threshold can only accept all 20 answers or check all 20. Right now I accept every answer, including 6 wrong ones.');
assert.equal(mc.arbitrationText('flat', f100, 100), 'Its confidence never moves. My threshold can only accept all 20 answers or check all 20. Right now I check every answer myself.');

// The fluency check reply.
assert.equal(mc.checkReply(80, true),
  'Right. The paragraph describes the effect and never gives the reason. You rated your ability to explain it at 80%, so the smooth writing supplied part of that feeling. Molecules are far smaller than light’s wavelength. They act like tiny antennas that re-radiate the light. Shorter waves get re-radiated far more strongly, roughly with the fourth power of frequency.');
assert.ok(mc.checkReply(40, false).startsWith('The paragraph never gives the reason. It only says that short waves scatter more. You rated your ability to explain it at 40%, which matches what the paragraph gave you.'));

// Offload choices.
assert.equal(mc.TASKS.length, 6);
assert.ok(mc.TASKS.every(t => ['hand', 'along', 'keep'].includes(t.pick)));
assert.equal(mc.offloadReply(mc.TASKS[0], 'hand'), 'Same as mine. It needs doing, and I learn little from doing it again.');
assert.equal(mc.offloadReply(mc.TASKS[0], 'keep'), 'I would hand it over. It needs doing, and I learn little from doing it again.');
assert.equal(mc.offloadReply(mc.TASKS[3], 'hand'), 'I would keep it. The struggle is the lesson. I ask it for hints and write the fix myself.');

// Phases.
assert.deepEqual(Object.keys(mc.PHASES), ['before', 'during', 'after']);
assert.deepEqual(Object.values(mc.PHASES).map(p => p.title), ['Plan', 'Monitor', 'Evaluate']);

console.log('Checked the metacognition logic.');
