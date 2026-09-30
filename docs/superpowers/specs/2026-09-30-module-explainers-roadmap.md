# Module explainers: roadmap for every track

Date: 2026-09-30.

Every module on every interview track gets its own explainer: 31 tracks and 214 modules. Each batch below gets its own spec, following the rules in `2026-09-30-module-explainers-maths-design.md`: layout, grammar, testing and the slider rule. Each spec is then split into 1 plan per track.

## Order

| Batch | Tracks | Modules | References to draw on |
| --- | --- | --- | --- |
| 1, maths | Linear Algebra 7, Calculus 7, Mathematics 10, Mathematical Proof 7, Bayesian Statistics 6, Frequentist Statistics 8 | 45 | 3Blue1Brown, visualize-it |
| 2, machine learning core | Machine Learning 7, Deep Learning 7, Uncertainty Estimation 9 | 23 | WebSHAP, TimberTrek, Interactive Classification, GAN Lab, visualize-it |
| 3a, language models | Transformers 6, LLM Training 6, Natural Language Processing 7, Embeddings 7 | 26 | Transformer Explainer, Dodrio, UniPO, WizMap |
| 3b, vision and generation | Computer Vision 7, Multimodality 7, Image Generation 7 | 21 | CNN Explainer, Diffusion Explainer |
| 4, computer science | Computer Science 7, Operating Systems 6, Databases 6, Computer Networks 6, Network and Security 7 | 32 | algorithm-visualizer, rebuilt in Python; os_dbms; networks-foundation |
| 5, systems | MLOps 7, Data Engineering 7, Edge AI 7, Agentic AI 7, Design Patterns and Refactoring 6 | 34 | refactoring.guru, Supernova |
| 6, judgement | Mechanistic Interpretability 6, AI Safety 7, Machine Learning Research 7, North Star Metrics 6, Prompt Engineering 7 | 33 | Argo Scholar, future.com's North Star Metrics |
| | **Total** | **214** | |

## Also outstanding, placed in the batches above

- **Grad School**, a new track built from awesome-grad-school, with every link clickable. It joins batch 6, and its modules get explainers when the track is written.
- **The older canvas explainers**, for statistics tests, design patterns and North Star Metrics. They are rebuilt in the module style within their own batch: 1, 5 and 6.
- **The Curvenote article style for /writings.** It is separate from the interview pages, so it gets its own spec.

## Rules that carry across every batch

- Every module's explainer sits inside the module, at the depth of the GPT-2 and CNN explainers.
- An explainer opens on page 1 of its guide.
- A slider exists only for a quantity with no handle and no other control.
- A playground that repeats its module's explainer is removed, and its live equation stays.
- Each batch passes `verify_labs.py`, `check_labs.py`, `check_chart_bounds.py`, `make check` and a no-ai-slop pass before the next begins.
