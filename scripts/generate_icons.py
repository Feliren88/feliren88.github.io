#!/usr/bin/env python3
"""Generate the interview icon set.

Single source of truth for 24 icons. Emits four things from the one ICONS list,
so the standalone files and the sprite can never drift apart:

    icons/<name>.svg          standalone, self-contained, currentColor
    icons/preview.html        visual review at 1x, 2x, and on dark
    icons/style-spec.json     the style contract
    _includes/interview-icons.html   <symbol> sprite the site actually uses

Style is the "Clean" preset: 24px grid, 1.5px stroke, round caps and joins,
2px padding, so every path lives inside coordinates 2-22.

The standalone files carry the stroke attributes on each root <svg>, which is
what makes them portable. The sprite sets the same three values once on `.ivi`
in css/interview.css instead, because a <symbol> has no root of its own. Both
routes have to agree; check_bounds() and the preview page are how you tell.

Run:  python3 scripts/generate_icons.py
"""

import json
import os
import re

GRID = 24
STROKE = 1.5
CAP = "round"
JOIN = "round"
RADIUS = 2
PADDING = 2
DATE = "2026-08-29"

HERE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ICON_DIR = os.path.join(HERE, "icons")
SPRITE = os.path.join(HERE, "_includes", "interview-icons.html")

# (name, group, one-line note on what it depicts, [elements])
#
# Names for the eighteen track icons match the topic ids in _data/interview.yml
# on purpose. That lets the templates resolve an icon with {{ topic.id }} and no
# lookup table, which is worth more than naming each one after its shape.
ICONS = [
    # ── Tracks ──────────────────────────────────────────────────────────
    ("bayesian-statistics", "tracks", "A wide prior and a narrow posterior over one baseline", [
        '<path d="M3 19h18"/>',
        '<path d="M3 19C6.6 19 5.4 12 9 12C12.6 12 11.4 19 15 19"/>',
        '<path d="M9 19C12.6 19 11.4 6 15 6C18.6 6 17.4 19 21 19"/>',
    ]),
    ("linear-algebra", "tracks", "A grid with one basis vector landing somewhere new", [
        '<path d="M3.5 20.5V6M3.5 20.5H18"/>',
        '<path d="M3.5 20.5L11 13"/>',
        '<path d="M3.5 20.5L20 16.5"/>',
        '<path d="M9 14.6L11 13L11.9 15.2" fill="currentColor" stroke="none"/>',
        '<path d="M18.1 15.2L20 16.5L18.6 18.4" fill="currentColor" stroke="none"/>',
    ]),
    ("calculus", "tracks", "A curve with the tangent line touching it at one point", [
        '<path d="M3.5 19.5C8 19.5 9.5 5 20.5 5"/>',
        '<path d="M6 20.5L17 9.5"/>',
        '<circle cx="11.5" cy="15" r="1.6" fill="currentColor"/>',
    ]),
    ("frequentist-statistics", "tracks", "One sampling distribution with both tails marked off", [
        '<path d="M3 19h18"/>',
        '<path d="M3 19C8.4 19 6.6 7 12 7C17.4 7 15.6 19 21 19"/>',
        '<path d="M6.5 19v-3.4M17.5 19v-3.4"/>',
    ]),
    ("machine-learning", "tracks", "Scattered observations with a line fitted through them", [
        '<path d="M3.5 18.5L20.5 6.5"/>',
        '<circle cx="6.5" cy="14.5" r="1.2" fill="currentColor"/>',
        '<circle cx="10" cy="15.5" r="1.2" fill="currentColor"/>',
        '<circle cx="14" cy="9.5" r="1.2" fill="currentColor"/>',
        '<circle cx="17.5" cy="10" r="1.2" fill="currentColor"/>',
    ]),
    ("deep-learning", "tracks", "Three layers narrowing to a single output", [
        '<path d="M6.5 8.5L10.5 6M6.5 8.5L10.5 11.5M6.5 15.5L10.5 12.5M6.5 15.5L10.5 18'
        'M13.5 6L17.5 11.5M13.5 12h4M13.5 18L17.5 12.5"/>',
        '<circle cx="5" cy="8.5" r="1.5"/>',
        '<circle cx="5" cy="15.5" r="1.5"/>',
        '<circle cx="12" cy="5.5" r="1.5"/>',
        '<circle cx="12" cy="12" r="1.5"/>',
        '<circle cx="12" cy="18.5" r="1.5"/>',
        '<circle cx="19" cy="12" r="1.5"/>',
    ]),
    ("transformers", "tracks", "A token row with two attention arcs reaching back", [
        '<path d="M20.5 17Q12.25 1 4 17M20.5 17Q15 7 9.5 17"/>',
        '<circle cx="4" cy="18.5" r="1.2" fill="currentColor"/>',
        '<circle cx="9.5" cy="18.5" r="1.2" fill="currentColor"/>',
        '<circle cx="15" cy="18.5" r="1.2" fill="currentColor"/>',
        '<circle cx="20.5" cy="18.5" r="1.2" fill="currentColor"/>',
    ]),
    ("llm-training", "tracks", "A corpus feeding weights into a model block", [
        '<path d="M3 8.5h5M3 12h5M3 15.5h5"/>',
        '<path d="M9.5 12h3M11.5 10.5L13 12L11.5 13.5"/>',
        '<rect x="13.5" y="6.5" width="8" height="11" rx="2"/>',
        '<path d="M16 10.5h3M16 13.5h3"/>',
    ]),
    # Ticks through the text lines read as slider controls, not tokens. A boxed
    # span inside running text does not have that collision.
    ("nlp", "tracks", "One token picked out of running text", [
        '<path d="M4 7.5h16M4 12h4M14 12h6M4 16.5h13"/>',
        '<rect x="8.5" y="9.75" width="4.5" height="4.5" rx="1.25"/>',
    ]),
    ("computer-vision", "tracks", "A detection frame closing around one object", [
        '<path d="M3 8V5a2 2 0 012-2h3M16 3h3a2 2 0 012 2v3M21 16v3a2 2 0 01-2 2h-3'
        'M8 21H5a2 2 0 01-2-2v-3"/>',
        '<circle cx="12" cy="12" r="3.5"/>',
    ]),
    ("multimodality", "tracks", "Two modalities overlapping into shared ground", [
        '<rect x="3.5" y="6.5" width="11" height="11" rx="2"/>',
        '<circle cx="15.5" cy="12" r="5.5"/>',
    ]),
    ("uncertainty-quantification", "tracks", "Two estimates, one held much less tightly", [
        '<path d="M8 5v14M5.5 5h5M5.5 19h5M17 9v6M14.5 9h5M14.5 15h5"/>',
        '<circle cx="8" cy="12" r="1.8" fill="currentColor"/>',
        '<circle cx="17" cy="12" r="1.8" fill="currentColor"/>',
    ]),
    # Three dots in a triangle inside a circle read as a face. An L-shaped trace
    # between two nodes reads as circuitry and has no such pareidolia.
    ("mechanistic-interpretability", "tracks", "A lens held over a circuit inside the model", [
        '<circle cx="10.5" cy="10.5" r="7.5"/>',
        '<path d="M15.9 15.9L21 21"/>',
        '<path d="M6.5 13h2.5V8.5h5"/>',
        '<circle cx="6.5" cy="13" r="1.1" fill="currentColor"/>',
        '<circle cx="14" cy="8.5" r="1.1" fill="currentColor"/>',
    ]),
    ("ai-safety", "tracks", "A shield with a gate across it", [
        '<path d="M12 2.5l7.5 3.3v5c0 5.1-3.1 8.5-7.5 11.2-4.4-2.7-7.5-6.1-7.5-11.2v-5L12 2.5z"/>',
        '<path d="M7.5 12h9M7.5 12v2.2M16.5 12v2.2"/>',
    ]),
    ("machine-learning-research", "tracks", "A paper carrying a result", [
        '<path d="M6 3h7l5 5v12a1.5 1.5 0 01-1.5 1.5H6A1.5 1.5 0 014.5 20V4.5A1.5 1.5 0 016 3z"/>',
        '<path d="M13 3v5h5"/>',
        '<path d="M7.5 17.5l2.5-3 2 2 3.5-5"/>',
    ]),
    ("prompt-engineering", "tracks", "An input box holding a caret and a written line", [
        '<rect x="3" y="5.5" width="18" height="13" rx="2"/>',
        '<path d="M7 9.5L10 12L7 14.5M12.5 14.5h5"/>',
    ]),
    # The head has to sit on the arc's tangent or it reads as a stray tick. This
    # is the standard rotate construction, where the bracket ends the sweep.
    ("agentic-ai", "tracks", "A loop that stops at a tool on every pass", [
        '<path d="M20 12a8 8 0 1 1-8-8c2.24 0 4.38 0.94 5.9 2.59L20 8.5"/>',
        '<path d="M20 4.5v4h-4"/>',
        '<rect x="10.3" y="18.3" width="3.4" height="3.4" rx="0.8" fill="currentColor"/>',
    ]),
    ("mlops", "tracks", "A deployed model with its heartbeat running through it", [
        '<rect x="3" y="7" width="18" height="10" rx="2"/>',
        '<path d="M6 12h2.5l1.5-3 2 6 1.5-3H18"/>',
    ]),
    ("data-engineering", "tracks", "Layered storage the pipeline writes through", [
        '<path d="M4 6c0-1.66 3.58-3 8-3s8 1.34 8 3-3.58 3-8 3-8-1.34-8-3z"/>',
        '<path d="M20 6v6c0 1.66-3.58 3-8 3s-8-1.34-8-3V6"/>',
        '<path d="M20 12v6c0 1.66-3.58 3-8 3s-8-1.34-8-3v-6"/>',
    ]),
    ("network-and-security", "tracks", "A link between two hosts with a lock on it", [
        '<rect x="8.5" y="10.5" width="7" height="7" rx="1.75"/>',
        '<path d="M10.25 10.5V9a1.75 1.75 0 013.5 0v1.5"/>',
        '<path d="M5 14h3.5M15.5 14h3.5"/>',
        '<circle cx="3.5" cy="14" r="1.5"/>',
        '<circle cx="20.5" cy="14" r="1.5"/>',
    ]),

    # ── Interview UI ────────────────────────────────────────────────────
    ("check-circle", "ui", "Mark a module revised", [
        '<circle cx="12" cy="12" r="9"/>',
        '<polyline points="8 12 11 15 16 9"/>',
    ]),
    ("shuffle", "ui", "Reorder the cold questions", [
        '<path d="M3 7h3.2c1.3 0 2.5.6 3.2 1.7l3.2 4.6c.7 1.1 1.9 1.7 3.2 1.7H21"/>',
        '<path d="M3 17h3.2c1.3 0 2.5-.6 3.2-1.7l3.2-4.6c.7-1.1 1.9-1.7 3.2-1.7H21"/>',
        '<path d="M18 4l3 3-3 3M18 14l3 3-3 3"/>',
    ]),
    ("arrow-left", "ui", "Previous", [
        '<path d="M20 12H4M10 6l-6 6 6 6"/>',
    ]),
    ("arrow-right", "ui", "Next", [
        '<path d="M4 12h16M14 6l6 6-6 6"/>',
    ]),
    ("rotate-ccw", "ui", "Reset progress on this track", [
        '<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 00-6.74 2.74L3 8"/>',
        '<path d="M3 3v5h5"/>',
    ]),
    ("layers", "ui", "All eighteen tracks", [
        '<path d="M12 2.5L21.5 7L12 11.5L2.5 7Z"/>',
        '<path d="M2.5 16.5L12 21L21.5 16.5"/>',
        '<path d="M2.5 11.75L12 16.25L21.5 11.75"/>',
    ]),
]

ROOT_ATTRS = (
    'xmlns="http://www.w3.org/2000/svg" width="{g}" height="{g}" viewBox="0 0 {g} {g}" '
    'fill="none" stroke="currentColor" stroke-width="{s}" '
    'stroke-linecap="{c}" stroke-linejoin="{j}"'
).format(g=GRID, s=STROKE, c=CAP, j=JOIN)


def body(elements, indent="  "):
    return "\n".join(indent + e for e in elements)


def standalone(elements):
    return '<svg %s>\n%s\n</svg>\n' % (ROOT_ATTRS, body(elements))


# SVG allows numbers to run together with no separator ("4.38.94" is 4.38 then
# .94), so a leading-dot form has to be its own alternative. Without it the
# checker reads that pair as 4.38 and 94 and reports a false out-of-range.
NUM = re.compile(r"-?(?:\d+\.\d+|\.\d+|\d+)")


def check(name, elements):
    """Catch the two mistakes that make a set look amateur: a coordinate outside
    the padding zone, and precision beyond two decimals.

    This reads every number in the markup, including radii and arc flags, so it
    is deliberately loose on the low end. It is a tripwire for a stray 26 or a
    0.333333, not a geometry proof. Curve control points are allowed outside the
    box, since the rendered curve stays well inside it."""
    problems = []
    joined = " ".join(elements)
    for tok in NUM.findall(joined):
        if "." in tok and len(tok.split(".")[1]) > 2:
            problems.append("precision %s" % tok)
        v = float(tok)
        if v > GRID + 2 or v < -(GRID / 2):
            problems.append("out of range %s" % tok)
    if 'stroke="#' in joined or 'fill="#' in joined:
        problems.append("hard-coded colour")
    if "transform=" in joined:
        problems.append("transform")
    if re.search(r'\sid="|\sclass="', joined):
        problems.append("id or class")
    return problems


def write_standalone():
    os.makedirs(ICON_DIR, exist_ok=True)
    for name, _group, _note, els in ICONS:
        with open(os.path.join(ICON_DIR, name + ".svg"), "w") as f:
            f.write(standalone(els))


def write_spec():
    spec = {
        "name": "interview-icons",
        "preset": "clean",
        "grid": GRID,
        "strokeWidth": STROKE,
        "strokeLinecap": CAP,
        "strokeLinejoin": JOIN,
        "cornerRadius": RADIUS,
        "padding": PADDING,
        "opticalBalance": True,
        "iconCount": len(ICONS),
        "icons": [n for n, _g, _d, _e in ICONS],
        "generated": DATE,
        "notes": (
            "Track icon filenames match the topic ids in _data/interview.yml so "
            "templates resolve them with {{ topic.id }} and no lookup table. The "
            "sprite at _includes/interview-icons.html sets stroke-width, linecap "
            "and linejoin once on .ivi in css/interview.css rather than per icon."
        ),
    }
    with open(os.path.join(ICON_DIR, "style-spec.json"), "w") as f:
        json.dump(spec, f, indent=2)
        f.write("\n")


def write_preview():
    def cards(size):
        out = []
        for name, group, note, els in ICONS:
            svg = '<svg xmlns="http://www.w3.org/2000/svg" width="%d" height="%d" ' % (size, size)
            svg += 'viewBox="0 0 %d %d" fill="none" stroke="currentColor" ' % (GRID, GRID)
            svg += 'stroke-width="%s" stroke-linecap="%s" stroke-linejoin="%s">' % (STROKE, CAP, JOIN)
            svg += "".join(els) + "</svg>"
            out.append(
                '  <div class="icon-card">\n    %s\n    <span class="label">%s</span>\n'
                '    <span class="note">%s</span>\n  </div>' % (svg, name, note)
            )
        return "\n".join(out)

    html = PREVIEW.format(
        count=len(ICONS),
        grid=GRID,
        grid2=GRID * 2,
        stroke=STROKE,
        cap=CAP,
        join=JOIN,
        radius=RADIUS,
        padding=PADDING,
        date=DATE,
        native=cards(GRID),
        double=cards(GRID * 2),
    )
    with open(os.path.join(ICON_DIR, "preview.html"), "w") as f:
        f.write(html)


def write_sprite():
    parts = []
    last_group = None
    for name, group, note, els in ICONS:
        if group != last_group:
            title = "Interview tracks" if group == "tracks" else "Interview controls"
            parts.append("\n    <!-- %s -->" % title)
            last_group = group
        parts.append(
            '    <symbol id="ivi-%s" viewBox="0 0 %d %d">\n%s\n    </symbol>'
            % (name, GRID, GRID, body(els, "      "))
        )
    with open(SPRITE, "w") as f:
        f.write(SPRITE_HEAD)
        f.write("\n".join(parts))
        f.write(SPRITE_TAIL)


SPRITE_HEAD = """{%- comment -%}
Icon sprite for /interview/ and the eighteen syllabus pages.

GENERATED by scripts/generate_icons.py. Do not hand-edit: the same ICONS list
also produces icons/*.svg and icons/preview.html, and editing one copy silently
desynchronises the set. Change the script and re-run it.

Referenced as <svg class="ivi" viewBox="0 0 24 24"><use href="#ivi-name"/></svg>.
Track ids match the topic ids in _data/interview.yml, so a template resolves one
with {{ topic.id }} and needs no lookup table.

Stroke width, caps and joins are set once on .ivi in css/interview.css, because a
<symbol> has no root of its own to carry them. Shapes needing a solid fill carry
fill="currentColor" on the element, which wins over the .ivi rule.
{%- endcomment -%}
<svg class="ivi-sprite" width="0" height="0" aria-hidden="true" focusable="false" style="position:absolute;width:0;height:0;overflow:hidden">
  <defs>
"""

SPRITE_TAIL = """

  </defs>
</svg>
"""

PREVIEW = """<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Interview Icons — Set Preview</title>
<style>
  * {{ margin: 0; padding: 0; box-sizing: border-box; }}
  body {{
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
    padding: 2rem; max-width: 1200px; margin: 0 auto;
    color: #1a1a1a; background: #fafafa;
  }}
  h1 {{ font-size: 1.5rem; font-weight: 600; margin-bottom: 0.25rem; }}
  .subtitle {{ color: #666; font-size: 0.9rem; margin-bottom: 2rem; }}
  .spec {{
    background: #fff; border: 1px solid #e5e5e5; border-radius: 8px;
    padding: 1rem 1.25rem; margin-bottom: 2rem; font-size: 0.85rem; color: #444;
    display: flex; flex-wrap: wrap; gap: 0.5rem 1.5rem;
  }}
  .spec span {{ white-space: nowrap; }}
  .spec strong {{ color: #1a1a1a; }}
  h2 {{
    font-size: 1.1rem; font-weight: 600; margin: 2rem 0 1rem;
    padding-bottom: 0.5rem; border-bottom: 1px solid #e5e5e5;
  }}
  .grid {{ display: grid; grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); gap: 1rem; }}
  .icon-card {{
    display: flex; flex-direction: column; align-items: center; gap: 0.5rem;
    padding: 1rem 0.5rem; border-radius: 8px; background: #fff;
    border: 1px solid #e5e5e5; transition: border-color 0.15s;
  }}
  .icon-card:hover {{ border-color: #999; }}
  .icon-card svg {{ flex-shrink: 0; }}
  .icon-card .label {{ font-size: 0.7rem; color: #666; text-align: center; word-break: break-word; }}
  .icon-card .note {{ font-size: 0.62rem; color: #aaa; text-align: center; line-height: 1.3; }}
  .dark-section {{ background: #0b121c; border-radius: 12px; padding: 2rem; margin-top: 2rem; }}
  .dark-section h2 {{ color: #fff; border-bottom-color: #333; }}
  .dark-section .icon-card {{ background: #131c28; border-color: #2a3440; color: #d3dceb; }}
  .dark-section .icon-card:hover {{ border-color: #555; }}
  .dark-section .icon-card .label {{ color: #8b9db5; }}
  .dark-section .icon-card .note {{ color: #5c6a7d; }}
  .size-label {{
    font-size: 0.75rem; color: #999; font-weight: 500;
    text-transform: uppercase; letter-spacing: 0.05em;
  }}
</style>
</head>
<body>

<h1>Interview Icons</h1>
<p class="subtitle">{count} icons · clean style · generated {date}</p>

<div class="spec">
  <span><strong>Grid:</strong> {grid}px</span>
  <span><strong>Stroke:</strong> {stroke}px</span>
  <span><strong>Caps:</strong> {cap}</span>
  <span><strong>Joins:</strong> {join}</span>
  <span><strong>Corner radius:</strong> {radius}px</span>
  <span><strong>Padding:</strong> {padding}px</span>
</div>

<h2>Native Size <span class="size-label">({grid}px)</span></h2>
<div class="grid">
{native}
</div>

<h2>2× Size <span class="size-label">({grid2}px)</span></h2>
<div class="grid" style="grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));">
{double}
</div>

<div class="dark-section">
  <h2>Dark Background <span class="size-label">({grid2}px)</span></h2>
  <div class="grid" style="grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));">
{double}
  </div>
</div>

</body>
</html>
"""


def main():
    names = [n for n, _g, _d, _e in ICONS]
    assert len(names) == len(set(names)), "duplicate icon name"

    flagged = 0
    for name, _group, _note, els in ICONS:
        problems = check(name, els)
        if problems:
            flagged += 1
            print("  %-32s %s" % (name, ", ".join(problems)))

    write_standalone()
    write_spec()
    write_preview()
    write_sprite()
    print("%d icons -> icons/ and %s" % (len(ICONS), os.path.relpath(SPRITE, HERE)))
    print("icons with any flag: %d" % flagged)


if __name__ == "__main__":
    main()
