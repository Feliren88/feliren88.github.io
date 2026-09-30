---
layout: page
title: Third-party notices
description: Licences for the model data used by the interview explainers.
permalink: /third-party-notices/
robots: noindex, nofollow
sitemap: false
---

The interview explainers ship data and model weights from the projects below.
Each is used under its licence, reproduced here as that licence requires. The
files are built by `scripts/build_explainer_data.py`.

| Files in this repository | Taken from | Licence |
|---|---|---|
| `assets/data/gpt2-traces.json` (GPT-2 small activations) | [Transformer Explainer](https://github.com/poloclub/transformer-explainer) | MIT |
| `assets/data/diffusion-frames.json`, `assets/img/diffusion/` (Stable Diffusion frames and noise predictions) | [Diffusion Explainer](https://github.com/poloclub/diffusion-explainer) | MIT |
| `assets/data/tiny-vgg.bin`, `assets/data/tiny-vgg.json` (trained weights and sample images) | [CNN Explainer](https://github.com/poloclub/cnn-explainer) | MIT |
| `assets/data/acl-map.json` (map positions, density and topic labels) | [WizMap](https://github.com/poloclub/wizmap) | MIT |

The paper titles in `assets/data/acl-map.json` come from the
[ACL Anthology](https://aclanthology.org/), whose materials are published under
the Creative Commons Attribution 4.0 International licence.

Layouts that follow GAN Lab (Apache 2.0), Interactive Classification (MIT),
Algorithm Visualizer (MIT) and the other projects credited on each page were
written for this site; no code or data from them is included.

---

## Transformer Explainer, Diffusion Explainer

MIT License

Copyright (c) 2022 Polo Club of Data Science

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

## CNN Explainer

MIT License

Copyright (c) 2020 Polo Club of Data Science

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

## WizMap

MIT License

Copyright (c) 2023, Jay Wang, Fred Hohman, Polo Chau

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
