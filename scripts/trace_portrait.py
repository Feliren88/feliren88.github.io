#!/usr/bin/env python3
"""Draw the line-art portrait on the record scene from assets/img/profile.webp.

    python3 scripts/trace_portrait.py           # print the markup
    python3 scripts/trace_portrait.py --write   # patch it into essay-motion.js

Requires: pillow, numpy, scikit-image, scipy, opencv-contrib-python. The 68-point
landmark model downloads on first run into scripts/.portrait-cache/ (gitignored).

The opening beat of the `record` scene used to show four cards reading 7 papers,
1 patent, 12 awards and 5+ years. Every one of those numbers already appears in the
stat strip immediately above the scene, so the beat opened by repeating what the
reader had just read. It draws Vicky instead.

THE FACE IS DRAWN FROM LANDMARKS, NOT TRACED FROM SHADOW.

This is the whole point and it was learned the hard way. Contour tracing finds the
boundary of a dark region, so an eye becomes a closed loop around its shadow, which
on screen is not an eye but a hollow socket; a nose becomes a ring; a cheek shadow
becomes a rim. Two rounds of tuning thresholds produced faces that were accurate and
frightening, because outline drawing has no way to say "slightly darker" - a line is
a line - so every soft shadow it finds becomes hard anatomy.

A person sketching a face does not outline shadows. They put down one stroke per
feature: an almond for an eye, a single arc for a brow, a couple of marks for the
nose, a curve for the lip seam, one line for the jaw. So the features here come from
a 68-point landmark fit, and each is emitted as the stroke a person would draw. That
is ten strokes for the whole portrait, and it reads as a face because it is built
like one.

Only the parts where a contour IS the right answer are still traced: the silhouette
of the head and shoulders, and the hairline. Those are real edges, not shadows.

The result is checked by eye. Re-run it after replacing the photo and look at the
output before committing.
"""
import json
import urllib.request
import numpy as np
import cv2
from PIL import Image, ImageFilter
from skimage import measure, morphology

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

# No interior hair texture. Those ridges are tonal too, and as outline they turned the
# hair into a mass of separate lobes rather than hair.

"""
The face, from a 68-point landmark fit rather than from tone.

`face` is no longer a mask at all. Each entry below is one stroke a person drawing
this face would actually make, in the iBUG-68 index order the fitter returns:

    2..14    the jaw, from below one ear round the chin to the other. Without it the
             lower face has no edge of its own and reads as an empty balloon inside
             the hair silhouette.
    17..21   one brow, 22..26 the other. One arc each, not an outline of the hair.
    36..41   an eye as a closed almond, 42..47 the other. He is smiling broadly, so
             these come out as thin lenses, which is what a smiling eye looks like.
    31..35   the base of the nose only. Minimal portraits leave the bridge out; drawn,
             it becomes a line down the middle of the face and reads as a seam.
    48,60..64,54  the seam between the lips, which is the line that carries a smile.
    48,59..55,54  the lower lip under it.

The eye rings are the only closed paths. Everything else is open, because a person
lifts the pen at the end of a brow rather than drawing back along it.
"""
CASCADE = ('https://raw.githubusercontent.com/opencv/opencv/4.x/data/haarcascades/'
           'haarcascade_frontalface_alt2.xml')
LBF = ('https://raw.githubusercontent.com/kurnianggoro/GSOC2017/master/data/lbfmodel.yaml')
CACHE = os.path.join(ROOT, 'scripts', '.portrait-cache')
os.makedirs(CACHE, exist_ok=True)

def cached(url, name):
    path = os.path.join(CACHE, name)
    if not os.path.exists(path):
        print(f'  fetching {name}...', file=sys.stderr)
        urllib.request.urlretrieve(url, path)
    return path

bgr = cv2.imread(SRC, cv2.IMREAD_COLOR)
gray = cv2.cvtColor(bgr, cv2.COLOR_BGR2GRAY)
boxes = cv2.CascadeClassifier(cached(CASCADE, 'haarcascade.xml')).detectMultiScale(
    gray, 1.1, 5, minSize=(120, 120))
if not len(boxes):
    raise SystemExit('no face found in ' + SRC)
fitter = cv2.face.createFacemarkLBF()
fitter.loadModel(cached(LBF, 'lbfmodel.yaml'))
ok, marks = fitter.fit(gray, np.array(boxes))
if not ok:
    raise SystemExit('landmark fit failed')
P = np.asarray(marks[0]).reshape(-1, 2) - np.array([x0, y0])   # into crop coordinates

def stroke(idx, close=False):
    return ([(float(P[i][0]), float(P[i][1])) for i in idx], close)

def eye(idx):
    """An eye as a lens plus an iris, which is what makes it read as an eye.

    Two corrections to the raw fit. It under-opens lids - these come back at an
    aspect of 0.21 and 0.26 where an open eye is nearer 0.35 - so the lens is
    stretched about its own centre line until it is, which matches the photograph.
    And the iris is added, because a lens on its own is a closed eye however wide it
    is drawn, and a face with two closed eyes is asleep rather than smiling.

    The iris is a ring rather than a dot so the act can draw it on like every other
    stroke; at this size, with the lid crossing it, it reads as a pupil.
    """
    pts = np.array([P[i] for i in idx], float)
    cy = pts[:, 1].mean()
    OPEN = 1.45
    pts[:, 1] = cy + (pts[:, 1] - cy) * OPEN
    lens = [(float(x), float(y)) for x, y in pts]
    cx = pts[:, 0].mean()
    r = min((pts[:, 1].max() - pts[:, 1].min()) * 0.46,
            (pts[:, 0].max() - pts[:, 0].min()) * 0.17)
    ring = [(float(cx + r * np.cos(t)), float(cy + r * np.sin(t)))
            for t in np.linspace(0, 2 * np.pi, 10, endpoint=False)]
    return [(lens, True), (ring, True)]

layers['features'] = [
    stroke(range(2, 15)),                       # jaw and chin
    stroke(range(17, 22)),                      # brow
    stroke(range(22, 27)),                      # brow
    *eye(range(36, 42)),                        # eye: lens + iris
    *eye(range(42, 48)),                        # eye: lens + iris
    stroke(range(31, 36)),                      # nose base
    stroke([48, 60, 61, 62, 63, 64, 54]),       # lip seam
    stroke([48, 59, 58, 57, 56, 55, 54]),       # lower lip
]

# No cloth layer. Traced, the batik gave one motif and the collar gave two short arcs
# detached from every other line, reading as specks dropped beside the figure. What
# they were meant to convey - that there is a collar and a shoulder - the silhouette
# and the jaw already carry.

# The scene viewBox is "40 54 680 322" and the caption sits at y=344, so the portrait
# gets y 66..324. Height is the binding constraint; the width follows the crop.
# The portrait is allowed out of both ends of the viewBox.
#
# The canvas sits in a grid row 706px tall but the SVG is width-constrained, so at the
# viewBox's 680:322 it renders only 386px and the row carries about 320px of unused
# slack. `.em-narrative-canvas svg` already sets `overflow: visible`, so drawing past
# either edge is not clipped - it simply uses space the layout was wasting.
#
# The vertical position is set by the copy beside it rather than by the viewBox: the
# portrait's centre lines up with the centre of the headline column, because the two
# are read as a pair and a drawing sitting higher than the words it belongs to looks
# unmoored. That puts it low enough that the caption has to come down with it, which
# is why CAPTION_Y is here and not the 344 the other six beats use.
BOX_Y, BOX_H = 38.0, 364.0
CAPTION_Y = 428.0
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
markup = ''.join(frag) + f'<text x="375" y="{CAPTION_Y:.0f}">{CAPTION}</text>'

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
