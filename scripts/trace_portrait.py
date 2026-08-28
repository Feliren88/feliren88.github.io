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

# Texture inside the hair mass. The hairline alone leaves the head an empty outline,
# which is the single biggest reason a traced portrait reads as a template: real hair
# has direction. These are the darkest interior ridges, opened along the silhouette
# like the hairline so they do not double the head's edge.
tex = hair & (blur(L, 1.2) - blur(L, 9) < -6)
tex = morphology.remove_small_objects(tex, 90)
for _, p in contours(tex, 60, 1.5)[:8]:
    for run in split_open(p):
        d = np.diff(np.array(run), axis=0)
        if np.hypot(d[:, 0], d[:, 1]).sum() > 34:
            layers['hair'].append((run, False))

# Face features: local contrast inside the face box only.
face = np.zeros_like(sub); face[FACE_T:FACE_B, FACE_L:FACE_R] = True
face &= sub & ~hair
"""
Two contrast bands, not one, because one cannot get more detail out of this image.

At a single band the face had the eyes, nose and mouth and little else, and read as a
generic face rather than his. Lowering the threshold does not help: it merges adjacent
features into larger blobs, so the contour count peaks around -11 and *falls* below it
(measured: 22 contours at -11, 15 at -9, 12 at -7). What the face was missing was not
darker detail but finer detail.

So a second, tighter band runs alongside the first. The coarse one finds the features,
the fine one finds the transitions the coarse one steps over: the crease beside the
smile, the fold of the ear, the shadow along the jaw. Together they roughly halve the
line spacing - 28 contours and 606 points against 15 and 408 - which is what makes it
read as him. Pushing the fine band past about -3 starts drawing the skin's own grain.
"""
coarse = blur(L, 1.6) - blur(L, 14)
fine = blur(L, 1.0) - blur(L, 6)
feat = (face & (coarse < -11)) | (face & (fine < -4))
feat = morphology.binary_closing(morphology.remove_small_objects(feat, 20), morphology.disk(1))
layers['features'] = [(p, True) for _, p in contours(feat, 18, 1.15)[:34]]

# Collar and shoulder structure: strong edges only, no fabric pattern. Also opened
# where it hugs the silhouette, for the same doubling reason as the hair.
edge = filters.sobel(blur(L, 3.0))
# Collar and shoulders only, not the whole shirt. Lower down, the strongest edges are
# the batik itself, and those come out as short arcs detached from every other line in
# the drawing: at this size they read as specks dropped beside the figure. The band
# below the chin and above the crop holds the collar and the shoulder seam, which are
# structure worth drawing.
body = sub.copy(); body[:HAIR_BOT] = False
body[HAIR_BOT + int((h - HAIR_BOT) * 0.58):] = False
strong = body & (edge > np.percentile(edge[body], 86))
strong = morphology.binary_closing(morphology.remove_small_objects(strong, 130), morphology.disk(3))
layers['shirt'] = []
for _, p in contours(strong, 90, 2.2)[:10]:
    for run in split_open(p):
        d = np.diff(np.array(run), axis=0)
        # Long runs only. The collar and the shoulder seam are worth drawing; the
        # short isolated arcs the same threshold finds in the batik are not, and at
        # this size they read as specks floating beside the figure rather than cloth.
        if np.hypot(d[:, 0], d[:, 1]).sum() > 60:
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
# Neither cloth layer survives review. The batik yields one motif, and the collar band
# yields two short arcs that sit detached from every other line in the drawing and read
# as specks dropped beside the figure. What they were meant to convey - that there is a
# collar and a shoulder - the silhouette and the jaw and neck lines already carry.
layers.pop('batik', None)
layers.pop('shirt', None)

# The scene viewBox is "40 54 680 322" and the caption sits at y=344, so the portrait
# gets y 66..324. Height is the binding constraint; the width follows the crop.
# Height is the binding constraint, not width: the portrait is a 1.29 landscape in a
# viewBox 2.11 times wider than it is tall, so it can never fill the canvas sideways.
# It takes everything between the top of the viewBox and the caption baseline instead,
# leaving only enough clearance for the caption's ascenders.
BOX_Y, BOX_H = 50.0, 282.0
sc = BOX_H / h
BOX_W = w * sc
BOX_X = 380.0 - BOX_W / 2          # centred on the viewBox, which spans 40..720

def to_path(pts, close):
    """Polyline -> smooth cubic Bezier, via Catmull-Rom.

    This is the difference between a drawing and a machine trace. `find_contours`
    walks the pixel grid and `approximate_polygon` then cuts corners off it, so the
    raw output is a chain of short straight segments meeting at visible angles. At
    2x on a retina screen every one of those kinks reads, and the portrait looks
    plotted rather than drawn. Catmull-Rom passes through every original point, so
    the likeness is untouched; it only replaces the corner between two segments with
    the curve a pen would have made.

    TENSION is the standard 1/6. Higher overshoots on tight features like the
    nostrils and turns them into loops.
    """
    o = [(BOX_X + x * sc, BOX_Y + y * sc) for x, y in pts]
    if len(o) < 3:
        return 'M' + ' '.join(f'{x:.1f} {y:.1f}' for x, y in o) + ('Z' if close else '')

    TENSION = 1.0 / 6.0
    n = len(o)

    def at(i):
        if close:
            return o[i % n]
        return o[min(max(i, 0), n - 1)]

    d = [f'M{o[0][0]:.1f} {o[0][1]:.1f}']
    last = n if close else n - 1
    for i in range(last):
        p0, p1, p2, p3 = at(i - 1), at(i), at(i + 1), at(i + 2)
        c1 = (p1[0] + (p2[0] - p0[0]) * TENSION, p1[1] + (p2[1] - p0[1]) * TENSION)
        c2 = (p2[0] - (p3[0] - p1[0]) * TENSION, p2[1] - (p3[1] - p1[1]) * TENSION)
        d.append(f'C{c1[0]:.1f} {c1[1]:.1f} {c2[0]:.1f} {c2[1]:.1f} {p2[0]:.1f} {p2[1]:.1f}')
    return ''.join(d) + ('Z' if close else '')

CLASSES = [('silhouette', 'em-vf-body'), ('hair', 'em-vf-hair'), ('features', 'em-vf-face')]
# Two groups, not one. The outer is a direct child of the frame, so it picks up the
# arrival opacity and translate the scene gives every child; the inner carries the
# ambient breath. Animating the outer one instead would silently drop that translate,
# because a running animation beats a normal declaration.
frag = ['<g class="em-vf-sketch"><g class="em-vf-breathe">']
for key, cls in CLASSES:
    for pts, close in layers.get(key, []):
        frag.append(f'<path class="em-vf-line {cls}" d="{to_path(pts, close)}"/>')
frag.append('</g></g>')
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
