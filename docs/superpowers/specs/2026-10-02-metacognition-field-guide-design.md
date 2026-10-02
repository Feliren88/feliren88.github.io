# Metacognition field guide: design

Date: 2026-10-02. Path: architectural (new page, new scene, new component).

## Intent

**What Vicky asked for.** A 13th entry under "Field guides and personal notes" on
`/writings/`, titled "Metacognition". It must be built from nine named sources, carry
strong narrative illustrations like the other writings and the interview lessons, and
use visuals to transfer a belief to a visual learner.

**Approval record.** Vicky started this with `/goal` and told the session not to pause
for answers. Each approval gate in the brainstorming, spec and plan stages is therefore
recorded here as a decision with its reason, instead of a reply. Anything Vicky would
reasonably want to veto is listed under "Decisions to revisit".

**The belief the page must transfer.** Metacognition decides whether AI makes my
thinking sharper or duller, and it is trainable in minutes: say how sure I am, check,
and adjust. Every section proves one link in that chain with a visual the reader
operates, rather than a paragraph they accept.

**Why it belongs on this site.** Vicky's research asks when a model should act, defer,
or gather evidence. Metacognition is the same question asked of a person: monitoring is
the confidence estimate, control is the decision to act, check, or ask. The page says
so once, in first person, and otherwise stays practical.

## Sources and what each contributes

| Source | Used for |
|---|---|
| Hyper Island (2026), metacognition as an AI leadership skill | Leader practices: direct attention with purpose, model conscious AI use, create space for reflection. "When we let AI collapse the struggle, we risk collapsing the learning itself." |
| CSIRO Collaborative Intelligence, metacognitive thinking in an AI-enabled workforce (IEEE CAI 2024) | Four features of human-AI work that demand metacognition: our heuristics mispredict AI, AI struggles with novel ill-defined problems, no natural reciprocal feedback, AI cannot do the metacognition for us |
| Singh, Taneja, Guan, Ghosh, *Protecting Human Cognition in the Age of AI* (CHI 2025 workshop, arXiv 2502.12447) | Dewey's prerequisites for reflective thought that instant answers skip: perplexity, suspended judgement, persistent consideration |
| A Human Edge, human capability in the AI era | Attention as a trainable skill; flow conditions (clear goals, present feedback, challenge just beyond ability) as the practice design |
| Mason, Sidra, Reeson, Paris (CSIRO), *Times Higher Education* (2023) | Arbitration: weigh my strengths and limits against the AI's; anchoring and halo effect |
| Lee, Pruitt, Zhou, Du, Odegaard, *PNAS Nexus* 4(5) pgaf133 (2025) | High AI confidence raises trust even when the AI is wrong; AI should report metacognitive sensitivity; Bahrami et al. (2010) confidence sharing |
| Abrams, *Monitor on Psychology* 57(5) (2026) | Lee H.P. et al. (CHI 2025, 319 knowledge workers); Sun et al. (JAP 2025, 250 employees); Budzyń et al. (Lancet G&H 2025, 28.4% to 22.4%); Gerlich's answer-first prompting; Cukurova's task analysis |
| Lim, *DeBiasMe* (AIREASONING-2025 workshop, arXiv 2504.16770) | Deliberate friction at two stages: the prompt (input) and the response (output); anchoring and confirmation bias |
| edtechdev AIED wiki, Metacognition concept | Knowledge versus regulation; plan, monitor, evaluate; fluency illusion; primary studies below |

Primary studies the page states numbers from, each verified against the primary text:

- Kosmyna et al. (2025), arXiv 2506.08872, not peer reviewed: 15 of 18 LLM-group
  writers could not quote their own essay, against 2 of 18 in each other group.
- Ngai & Gilbert (2026), *Cognitive Research: Principles and Implications* 11:21:
  5 practice trials of prediction plus feedback improved calibration (N = 164, 416);
  prediction alone did not.
- Ren (2026), *Frontiers in Psychology*, 10.3389/fpsyg.2026.1926110: 342 undergraduates;
  incorrect-advice acceptance 62.4% with open ChatGPT, 39.7% with a reflection prompt.
- Budzyń et al. (2025), *Lancet Gastroenterology & Hepatology*: detection without AI fell
  from 28.4% to 22.4% after AI was introduced.

Secondhand claims are excluded: the Hyper Island survey statistics, A Human Edge's
uncited statistics, and wiki-only findings without a checked primary source.

## Approaches considered

1. **Recommended and chosen: a field guide in the established long-form shape.** Page in
   `_pages/`, page-scoped CSS and JS, a new `motion_scene`, a rail, hero diagram and
   one operable visual per section. Matches the twelve existing guides, so it reads as
   part of the set and costs nothing new in infrastructure.
2. A data-driven page (`_data/metacognition.yml` plus an include). Rejected: only worth
   it when content is reused or generated. This copy is bespoke to its visuals.
3. Reusing the interview narrated player (`InterviewNarrative`). Rejected: it drags in
   the 3,000-line interview stylesheet. The scroll scene already gives the narrative.

## Page design

`/metacognition/`, prefix `mc-`, files `_pages/metacognition.md`,
`css/metacognition.css`, `js/components/metacognition.js`, scene key `metacognition`.
No browser storage: nothing on the page needs to persist.

Rail labels (no numbered counters, per CLAUDE.md): Layers, Illusion, Calibrate,
Arbitrate, Friction, Offload, Practice, Sources.

1. **Hero.** Headline in first person about checking understanding when the answer
   arrives fast. Animated inline SVG of two levels: the object level runs task to answer,
   an AI lane feeds answers in quickly, and the meta level watches it (monitor arrow up:
   "how sure am I?") and steers it (control arrow down: act, check, ask).
2. **Scroll scene** `metacognition`, 4 beats, a fictional vignette like `curiosity`:
   the draft read beautifully; one question from her manager and she could not say
   where a number came from; she wrote her own answer and confidence first; the
   confident sentence was the wrong one, and she keeps her own judgement now.
3. **Layers (`#layers`).** Knowledge versus regulation. A before, during, after
   timeline; choosing a phase shows its questions (plan, monitor, evaluate).
4. **Illusion (`#illusion`).** Two visuals. A 3 x 18 people grid from Kosmyna et al.
   that fills on view, labelled as a preprint. Then an "explain it back" check: read a
   fluent paragraph (why the sky is blue), rate your understanding, the paragraph
   hides, answer one question, compare the rating with the result.
5. **Calibrate (`#calibrate`).** Five true or false claims, each with a confidence
   slider from 50 to 100%. Feedback after each, then a chart of stated confidence
   against hit rate. Ngai & Gilbert give the reason for five rounds and for feedback.
6. **Arbitrate (`#arbitrate`).** A 20-answer simulation, labelled illustrative. Two
   assistants: one whose confidence tracks accuracy, one that always says 95%. The
   reader sets "accept when it says at least X%"; the grid shows wrong answers accepted
   and checks spent. Then the Ren result as two bars, 62.4% and 39.7%.
7. **Friction (`#friction`).** Two checkpoints on a prompt to response pipeline. Three
   leading prompts that flip to neutral ones on press. The answer-first order (think,
   answer, then ask the AI to critique) as a four-step strip.
8. **Offload (`#offload`).** Six tasks, each set to hand over, work alongside, or keep;
   the page explains its own suggestion. Budzyń's 28.4% to 22.4% as a falling bar.
9. **Practice (`#practice`).** Before, during, after cards for a five-minute loop; the
   three leader moves; a closing line.
10. **Sources (`#sources`).** All nine named sources and the four primary studies.

## Copy rules applied

CLAUDE.md writing rules: about 14 words a sentence, no em dashes, no negative contrast,
no structure announcements, British spelling, first person, numerals for quantities,
no invented numbers. Every number on the page traces to the table above, or is labelled
illustrative inside an interactive.

## Integration

- `/writings/`: a new card at the top of the field guides grid.
- `_data/navigation.yml`: `/metacognition` under Writings `owns`.
- `llms.txt`: one entry in Writings.
- `css/essay-motion.css`: `--em-accent` for the key in both themes, the light value solved
  to the dark value's contrast.
- `docs/essay-motion.md`: scene count and key list.
- Front matter: `date` and `last_modified_at` (article markup), `hide_title: true`.

## Testing

- `make build` and `make check` (zero flags).
- Playwright in dark, light, and 400px: no page errors; `.em-story` exists; every
  interactive responds; reduced motion leaves a static page.
- Prose checks: zero em dashes in the new page; average sentence length near 14.
- Every external URL in Sources returns 200.

## Decisions to revisit

- Card placement: first in the grid, as the newest guide.
- Scene accent: an orchid hue distinct from the fourteen existing scene accents.
- The sky paragraph and the five claims are general knowledge, chosen to be checkable.
