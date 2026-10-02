# Narrated model and systems walkthroughs

This change reuses authored captions and binds each to its existing drawing state.
The adapter upgrades each lesson and opening scene with shared playback and narration controls.
Therefore, the review checks the control integration and preserves the existing lesson claims.

| Track | Lesson walkthroughs | Opening scenes |
| --- | --- | --- |
| LLM Training | 6 | 1 |
| NLP | 7 | 1 |
| Multimodality | 7 | 1 |
| Embeddings | 7 | 1 |
| Edge AI | 7 | 1 |
| Agents | 7 | 1 |
| MLOps | 7 | 1 |
| Data Engineering | 7 | 1 |
| Mechanistic Interpretability | 6 | 1 |
| AI Safety | 7 | 1 |

The player provides clickable captions, timed playback, previous and next steps, scrubbing, speed and reset.
Moreover, spoken narration starts only when the learner requests it.
Leaving the viewport or hiding the page stops playback.
Reduced-motion settings retain the content and remove the added fade animation.

An independent review requested preserving accessible diagram labels.
The adapter uses group semantics and retains the diagram's labelled descendants.
Furthermore, the opening scene's keyboard handler routes through the new controls to keep captions synchronised.
Native slider and select keys retain their browser behaviour.

The state comparison ignores empty class attributes introduced by the existing renderer.
It still compares every substantive drawing attribute, caption and selected step after backward scrubbing.
The existing module prose has not been reclassified as newly reviewed.
No detector score or measured readability grade is claimed.

The build, SEO audit, prose audit and project tests passed.
Moreover, browser checks passed for all 68 lessons and 10 opening scenes at 1400px and 390px in both themes.
These checks include forward and backward steps, timed playback, reset, keyboard scrubbing and enlarged text.
Phone screenshots and accessibility snapshots also confirmed the labelled diagram contents.
