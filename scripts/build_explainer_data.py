#!/usr/bin/env python3
"""Build the data files behind the explainers on /transformers/ and /image-generation/.

Both come from Polo Club of Data Science projects released under the MIT licence:

  Transformer Explainer  https://github.com/poloclub/transformer-explainer
  Diffusion Explainer    https://github.com/poloclub/diffusion-explainer
  CNN Explainer          https://github.com/poloclub/cnn-explainer

Clone them anywhere and pass their paths:

  python3 scripts/build_explainer_data.py \
      --transformer-explainer ../transformer-explainer \
      --diffusion-explainer ../diffusion-explainer

Outputs, all owned by this script (a hand edit is lost on the next run):

  assets/data/gpt2-traces.json          real GPT-2 (small) attention and logits
  assets/img/diffusion/<p>-<g>.webp     one sprite of refining frames per prompt and guidance
  assets/img/diffusion/<p>-<g>-z.webp   the matching latent sprite
  assets/data/diffusion-frames.json     prompts, guidance values, timesteps, sprite geometry
  assets/data/tiny-vgg.bin              CNN Explainer's trained Tiny VGG weights, unchanged
  assets/data/tiny-vgg.json             layer shapes, byte offsets, class names, sample pixels

Needs node on PATH for the traces and Pillow for the sprites.
"""
import argparse
import json
import math
import os
import subprocess
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA = os.path.join(ROOT, 'assets', 'data')
IMG = os.path.join(ROOT, 'assets', 'img', 'diffusion')

TOP = 50          # candidates kept with their token strings
BIN = 0.05        # width of the histogram bins that stand in for the other ~50k logits


def load_example(repo, i):
    """The examples are ES modules; node turns one into JSON."""
    path = os.path.join(repo, 'src', 'constants', 'examples', f'ex{i}.js')
    code = f"import('{path}').then(m => process.stdout.write(JSON.stringify(m.ex{i})))"
    out = subprocess.run(['node', '-e', code], check=True, capture_output=True, text=True).stdout
    return json.loads(out)


def softmax_masked(row, upto):
    xs = row[:upto + 1]
    m = max(xs)
    e = [math.exp(x - m) for x in xs]
    s = sum(e)
    return [v / s for v in e]


def build_traces(repo):
    examples = []
    for i in range(5):
        ex = load_example(repo, i)
        n = len(ex['tokens'])
        out = ex['outputs']
        att = []
        worst = 0.0
        for b in range(12):
            heads = []
            for h in range(12):
                scaled = out[f'block_{b}_attn_head_{h}_attn_scaled']['data']
                raw = out[f'block_{b}_attn_head_{h}_attn']['data']
                soft = out[f'block_{b}_attn_head_{h}_attn_softmax']['data']
                flat = []
                for r in range(n):
                    # The scaled scores are the raw scores over sqrt(d_k) = 8.
                    assert abs(scaled[r][0] - raw[r][0] / 8) < 1e-4
                    flat.extend(round(scaled[r][c], 2) for c in range(r + 1))
                # The page recomputes softmax from the rounded scores. Check that
                # it still matches the model's own softmax.
                k = 0
                for r in range(n):
                    row = flat[k:k + r + 1]
                    k += r + 1
                    got = softmax_masked(row, r)
                    worst = max(worst, max(abs(a - b2) for a, b2 in zip(got, soft[r][:r + 1])))
                heads.append(flat)
            att.append(heads)
        assert worst < 0.01, f'example {i}: rounded softmax drifts by {worst}'

        logits = ex['logits']
        top = sorted(ex['probabilities'], key=lambda p: -p['logit'])[:TOP]
        top_ids = {p['tokenId'] for p in top}
        by_logit = sorted(range(len(logits)), key=lambda j: -logits[j])[:TOP]
        assert set(by_logit) == top_ids, f'example {i}: stored candidates are not the top {TOP}'
        rest = [logits[j] for j in range(len(logits)) if j not in top_ids]
        lo = math.floor(min(rest) / BIN) * BIN
        counts = {}
        for v in rest:
            k2 = int((v - lo) / BIN)
            counts[k2] = counts.get(k2, 0) + 1
        hist = [[k2, c] for k2, c in sorted(counts.items())]
        examples.append({
            'prompt': ex['prompt'],
            'tokens': ex['tokens'],
            'ids': ex['tokenIds'],
            'att': att,
            'top': [{'t': p['token'], 'id': p['tokenId'], 'l': round(p['logit'], 3)} for p in top],
            'rest': {'lo': round(lo, 3), 'w': BIN, 'bins': hist, 'n': len(rest)},
        })
        print(f'example {i}: {n} tokens, softmax drift {worst:.4f}, {len(hist)} tail bins')

    doc = {
        'source': 'GPT-2 (small) traces from Transformer Explainer, Polo Club of Data Science, MIT licence',
        'model': {'layers': 12, 'heads': 12, 'd_model': 768, 'd_head': 64, 'd_mlp': 3072, 'vocab': 50257, 'context': 1024},
        'examples': examples,
    }
    with open(os.path.join(DATA, 'gpt2-traces.json'), 'w') as f:
        json.dump(doc, f, separators=(',', ':'), ensure_ascii=False)


PROMPTS = [
    ('castle', 'a castle by a sea'),
    ('castle-art', 'a castle by a sea, trending on artstation'),
]
GUIDANCE = ['0.0', '1.0', '7.0', '20.0']
SEED = 1
STEPS = list(range(0, 51, 2))   # 26 of the 51 refining frames
FRAME = 192
LATENT = 64


def build_diffusion(repo):
    from PIL import Image
    os.makedirs(IMG, exist_ok=True)
    assets = os.path.join(repo, 'assets')
    for slug, prompt in PROMPTS:
        for g in GUIDANCE:
            for kind, folder, size in (('', 'img', FRAME), ('-z', 'latent_viz', LATENT)):
                sheet = Image.new('RGB', (size * len(STEPS), size))
                for k, t in enumerate(STEPS):
                    im = Image.open(os.path.join(assets, folder, prompt, f'{SEED}_{g}_{t}.jpg')).convert('RGB')
                    sheet.paste(im.resize((size, size), Image.LANCZOS), (k * size, 0))
                name = f'{slug}-{g.split(".")[0]}{kind}.webp'
                sheet.save(os.path.join(IMG, name), 'WEBP', quality=60, method=6)
    for noise in ('noise_pred_text', 'noise_pred_empty', 'noise_pred_final'):
        im = Image.open(os.path.join(assets, 'noises', f'{noise}.jpg')).convert('RGB')
        im.save(os.path.join(IMG, noise.replace('_', '-') + '.webp'), 'WEBP', quality=75, method=6)
    doc = {
        'source': 'Stable Diffusion frames from Diffusion Explainer, Polo Club of Data Science, MIT licence',
        'seed': SEED,
        'steps': STEPS,
        'total_steps': 50,
        'frame': FRAME,
        'latent': LATENT,
        'guidance': [float(g) for g in GUIDANCE],
        'prompts': [{'slug': s, 'text': p} for s, p in PROMPTS],
    }
    with open(os.path.join(DATA, 'diffusion-frames.json'), 'w') as f:
        json.dump(doc, f, indent=1)
    print('diffusion sprites written to', os.path.relpath(IMG, ROOT))


CNN_SAMPLES = ['boat_1', 'bug_1', 'pizza_1', 'pepper_1', 'bus_1',
               'koala_1', 'espresso_1', 'panda_1', 'orange_1', 'car_1']


def build_cnn(repo):
    """Tiny VGG from CNN Explainer: copy the weights byte for byte and record
    where each tensor starts, plus the 64x64 sample images as raw RGB bytes so
    the page and the verifier read exactly the same pixels."""
    import base64
    import shutil
    from PIL import Image
    data = os.path.join(repo, 'public', 'assets', 'data')
    model = json.load(open(os.path.join(data, 'model.json')))
    shutil.copyfile(os.path.join(data, 'group1-shard1of1.bin'), os.path.join(DATA, 'tiny-vgg.bin'))
    layers, offset = [], 0
    for w in model['weightsManifest'][0]['weights']:
        size = 1
        for d in w['shape']:
            size *= d
        layers.append({'name': w['name'], 'shape': w['shape'], 'offset': offset, 'size': size})
        offset += size
    assert offset * 4 == os.path.getsize(os.path.join(DATA, 'tiny-vgg.bin')), 'weight manifest does not cover the file'
    config = open(os.path.join(repo, 'src', 'config.js')).read()
    classes = json.loads('[' + config.split('classLists: [')[1].split(']')[0].replace("'", '"') + ']')
    samples = []
    for name in CNN_SAMPLES:
        im = Image.open(os.path.join(repo, 'public', 'assets', 'img', name + '.jpeg')).convert('RGB')
        assert im.size == (64, 64)
        samples.append({'name': name, 'rgb': base64.b64encode(im.tobytes()).decode('ascii')})
    doc = {
        'source': 'Tiny VGG trained by CNN Explainer, Polo Club of Data Science, MIT licence',
        'input': [64, 64, 3], 'classes': classes, 'weights': layers, 'samples': samples,
    }
    with open(os.path.join(DATA, 'tiny-vgg.json'), 'w') as f:
        json.dump(doc, f, separators=(',', ':'))
    print(f'tiny vgg: {len(layers)} tensors, {offset} weights, {len(samples)} samples')


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--transformer-explainer')
    ap.add_argument('--diffusion-explainer')
    ap.add_argument('--cnn-explainer')
    a = ap.parse_args()
    if not (a.transformer_explainer or a.diffusion_explainer or a.cnn_explainer):
        ap.error('pass at least one repository path')
    os.makedirs(DATA, exist_ok=True)
    if a.transformer_explainer:
        build_traces(a.transformer_explainer)
    if a.diffusion_explainer:
        build_diffusion(a.diffusion_explainer)
    if a.cnn_explainer:
        build_cnn(a.cnn_explainer)


if __name__ == '__main__':
    sys.exit(main())
