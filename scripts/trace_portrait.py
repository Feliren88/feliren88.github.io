#!/usr/bin/env python3
"""Trace assets/img/profile.webp into the line-art portrait on the record scene.

    python3 scripts/trace_portrait.py          # print the markup
    python3 scripts/trace_portrait.py --write   # patch it into essay-motion.js

Requires: pillow, numpy, scikit-image, scipy.

The opening beat of the `record` scene used to show four cards reading 7 papers,
1 patent, 12 awards and 5+ years. Every one of those numbers already appears in the
stat strip immediately above the scene, so the beat opened by repeating what the
reader had just read. It draws Vicky instead.

Two things about the output are deliberate and easy to undo by accident:

STROKES, NOT FILLS. The scene animates with stroke-dashoffset, so the portrait has
to be strokes for the act to draw it on. A filled posterisation was tried first and
could not be animated at all; worse, it turned the lit face into a dark void, because
the shadowed side of the face crossed the tone threshold before the hair did.

REGION-AWARE THRESHOLDS. The face is traced on local contrast so the eyes, nostrils
and mouth survive; the shirt is traced on strong edges only so the batik does not
drown the drawing. One global threshold either loses the face or copies the fabric.

The result is checked by eye, not by assertion. Re-run it after replacing the photo
and look at the preview before committing: the tuning here is specific to this image.
"""
import json
import numpy as np
from PIL import Image, ImageFilter
from skimage import measure, filters, morphology

SRC = 'assets/img/profile.webp'
import sys, os
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, SRC)

im = Image.open(SRC).convert('RGBA')
a = np.array(im)
rgb, alpha = a[..., :3].astype(float), a[..., 3]
lum = rgb @ [0.2126, 0.7152, 0.0722]
sat = rgb.max(2) - rgb.min(2)

subject = (alpha > 128) & ((sat > 34) | (lum < 105))
lab = measure.label(subject)
sizes = np.bincount(lab.ravel()); sizes[0] = 0
subject = lab == sizes.argmax()
subject = morphology.remove_small_holes(subject, 4000)
subject = morphology.binary_closing(subject, morphology.disk(4))

# Head and shoulders only. The full seated figure left a large empty chest below the
# collar and scattered the batik motifs across it, and at that scale the face - the one
# part that has to be recognisably him - was small. Cropping to the shoulders roughly
# doubles the face and removes both problems.
ys, xs = np.nonzero(subject)
y0, x0 = ys.min() - 4, xs.min() - 4
y1 = 596                      # just below the shoulder line
x1 = xs.max() + 4
sub = subject[y0:y1, x0:x1]
L, S = lum[y0:y1, x0:x1], sat[y0:y1, x0:x1]
h, w = sub.shape

HAIR_BOT = 487 - y0
FACE_T, FACE_B, FACE_L, FACE_R = 197 - y0, 487 - y0, 323 - x0, 681 - x0

def blur(arr, r):
    return np.array(Image.fromarray(arr.astype(np.uint8)).filter(ImageFilter.GaussianBlur(r)), float)

def contours(mask, min_len, tol):
    m = np.pad(mask.astype(float), 1)
    out = []
    for c in measure.find_contours(m, 0.5):
        c = measure.approximate_polygon(c, tolerance=tol)
        if len(c) < 4:
            continue
        pts = [(px - 1, py - 1) for py, px in c]
        d = np.diff(np.array(pts), axis=0)
        length = float(np.hypot(d[:, 0], d[:, 1]).sum())
        if length >= min_len:
            out.append((length, pts))
    out.sort(key=lambda t: -t[0])
    return out

layers = {}

sil_mask = morphology.binary_opening(sub, morphology.disk(3))
sil = contours(sil_mask, 300, 2.2)[:1]
# Open at the bottom. Closed, the contour runs straight along the crop edge and that
# flat rule reads as a photograph with its corner cut off rather than a drawing. Cutting
# the run that hugs y = h leaves the shoulders trailing off, which is how a sketch ends.
BASE = 7.0
layers['silhouette'] = []
for _, p in sil:
    runs, cur = [], []
    for x, y in p:
        if y < h - BASE:
            cur.append((x, y))
        else:
            if len(cur) >= 4: runs.append(cur)
            cur = []
    if len(cur) >= 4: runs.append(cur)
    # The contour starts mid-outline, so the first and last runs are one stroke split
    # by the seam; rejoin them or the drawing has a gap at an arbitrary point.
    if len(runs) > 1 and p[0][1] < h - BASE and p[-1][1] < h - BASE:
        runs = [runs[-1] + runs[0]] + runs[1:-1]
    for r in runs:
        layers['silhouette'].append((r, False))

# Hair. Drawn as the HAIRLINE only, not a closed blob: its upper edge runs along the
# silhouette and drawing both put two strokes on the same line, which read as a
# printing error rather than a sketch. Points within DROP px of the silhouette are cut,
# leaving the arc across the forehead and down past the ear.
hair = sub.copy(); hair[HAIR_BOT:] = False
hair &= blur(L, 2) < 70
hair = morphology.remove_small_objects(hair, 900)
hair = morphology.binary_closing(hair, morphology.disk(5))
hair = morphology.remove_small_holes(hair, 2500)

from scipy import ndimage
sil_dist = ndimage.distance_transform_edt(~morphology.binary_dilation(
    np.pad(sil_mask, 1) ^ morphology.binary_erosion(np.pad(sil_mask, 1), morphology.disk(1)),
    morphology.disk(1)))[1:-1, 1:-1]
DROP = 11.0

def split_open(pts):
    """Drop points sitting on the silhouette; return the surviving runs."""
    keep = [sil_dist[min(h - 1, max(0, int(round(y)))), min(w - 1, max(0, int(round(x))))] > DROP
            for x, y in pts]
    runs, cur = [], []
    for k, p in zip(keep, pts):
        if k:
            cur.append(p)
        else:
            if len(cur) >= 5: runs.append(cur)
            cur = []
    if len(cur) >= 5: runs.append(cur)
    return runs

layers['hair'] = []
for _, p in contours(hair, 200, 2.0)[:2]:
    for run in split_open(p):
        d = np.diff(np.array(run), axis=0)
        if np.hypot(d[:, 0], d[:, 1]).sum() > 40:
            layers['hair'].append((run, False))

# Face features: local contrast inside the face box only.
face = np.zeros_like(sub); face[FACE_T:FACE_B, FACE_L:FACE_R] = True
face &= sub & ~hair
local = blur(L, 1.6) - blur(L, 14)
feat = morphology.binary_closing(
    morphology.remove_small_objects(face & (local < -13), 60), morphology.disk(2))
layers['features'] = [(p, True) for _, p in contours(feat, 45, 1.3)[:14]]

# Collar and shoulder structure: strong edges only, no fabric pattern. Also opened
# where it hugs the silhouette, for the same doubling reason as the hair.
edge = filters.sobel(blur(L, 3.0))
body = sub.copy(); body[:HAIR_BOT] = False
strong = body & (edge > np.percentile(edge[body], 92))
strong = morphology.binary_closing(morphology.remove_small_objects(strong, 240), morphology.disk(3))
layers['shirt'] = []
for _, p in contours(strong, 170, 3.0)[:8]:
    for run in split_open(p):
        d = np.diff(np.array(run), axis=0)
        if np.hypot(d[:, 0], d[:, 1]).sum() > 55:
            layers['shirt'].append((run, False))

# Batik, as texture rather than transcription. Kept only where it is large and well
# inside the shirt, so motifs do not float against the silhouette edge, and thinned to
# the few biggest so the shirt reads as patterned without being copied.
inner = ndimage.distance_transform_edt(body) > 16
motif = morphology.binary_opening(
    morphology.remove_small_objects(body & inner & (blur(S, 2) > 92), 420), morphology.disk(3))
layers['batik'] = [(p, True) for _, p in contours(motif, 120, 3.2)[:6]]

# Only these two layers are used. The shirt band comes out empty at this crop and a
# single batik motif reads as noise rather than texture, so both are dropped.
layers.pop('shirt', None)
layers.pop('batik', None)

# The scene viewBox is "40 54 680 322" and the caption sits at y=344, so the portrait
# gets y 66..324. Height is the binding constraint; the width follows the crop.
BOX_Y, BOX_H = 66.0, 258.0
sc = BOX_H / h
BOX_W = w * sc
BOX_X = 380.0 - BOX_W / 2          # centred on the viewBox, which spans 40..720

def to_path(pts, close):
    o = [(BOX_X + x * sc, BOX_Y + y * sc) for x, y in pts]
    return 'M' + ' '.join(f'{x:.1f} {y:.1f}' for x, y in o) + ('Z' if close else '')

CLASSES = [('silhouette', 'em-vf-body'), ('hair', 'em-vf-hair'), ('features', 'em-vf-face')]
frag = ['<g class="em-vf-sketch">']
for key, cls in CLASSES:
    for pts, close in layers.get(key, []):
        frag.append(f'<path class="em-vf-line {cls}" d="{to_path(pts, close)}"/>')
frag.append('</g>')
CAPTION = 'Vicky leads AI research across industry, public services, and international teams.'
markup = ''.join(frag) + f'<text x="375" y="344">{CAPTION}</text>'

for k, v in layers.items():
    print(f'  {k:11s} {len(v)} paths', file=sys.stderr)
print(f'  portrait {BOX_W:.0f}x{BOX_H:.0f} at x {BOX_X:.0f}, y {BOX_Y:.0f}', file=sys.stderr)

if '--write' in sys.argv:
    js = os.path.join(ROOT, 'js/components/essay-motion.js')
    s = open(js).read()
    a = s.index('record: {', s.index('var stories = {'))
    b = s.index("'<g class=\"em-vf-sketch\"", a)
    c = s.index("',\n", b)
    open(js, 'w').write(s[:b] + "'" + markup + "'" + s[c + 1:])
    print(f'patched {js}', file=sys.stderr)
else:
    print(markup)
