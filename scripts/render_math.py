#!/usr/bin/env python3
"""Render the maths on /interview/ and enforce one notation across every track.

Source of truth is the `math:` block on each module in _data/interview.yml.
Each block holds LaTeX. This script converts it to MathML and writes
_data/interview_math.yml, which _layouts/syllabus.html reads.

    pip install pyyaml latex2mathml
    python3 scripts/render_math.py           # regenerate
    python3 scripts/render_math.py --check   # fail if stale or inconsistent

Why MathML rather than a rendering library. The interview pages carry reading
controls that scale every size on the page, and a light and a dark theme.
MathML is text: it inherits the font size, so it grows with `--rd-scale`, it
takes `currentColor`, so it follows the theme, and a screen reader reads it as
an equation. A pre-rendered image does none of those, and KaTeX would ship its
own fonts that fight the page's.

CANON is why the notation holds together. A symbol listed there means one thing
on all twenty-six tracks. A module that re-glosses a canon symbol with
different words fails the check, and so does an equation using a symbol nobody
defined. Consistency is therefore a property the build enforces, not a habit
the author has to remember across 160 modules.
"""

import argparse
import os
import re
import sys

try:
    import yaml
except ImportError:
    sys.exit("needs pyyaml: pip install pyyaml latex2mathml")

try:
    from latex2mathml.converter import convert as tex_to_mathml
except ImportError:
    sys.exit("needs latex2mathml: pip install pyyaml latex2mathml")

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, "_data", "interview.yml")
OUT = os.path.join(ROOT, "_data", "interview_math.yml")


# ════════════════════════════════════════════════════════════════════
# The canonical notation.
#
# Grouped for the legend the reader sees. `sym` is LaTeX, `is` is the
# gloss, and the gloss is binding: a module may re-list a canon symbol
# for convenience, but only with the same words.
# ════════════════════════════════════════════════════════════════════

CANON = [
    ("Objects you feed in and get out", [
        (r"x", "one input, a single example"),
        (r"y", "the true answer for that input"),
        (r"\hat{y}", "the answer the model gives"),
        (r"z", "a hidden representation, an input after some processing"),
        (r"t", "a step, in time or in a sequence"),
        (r"k", "an index over classes or over neighbours"),
        (r"i", "an index over examples"),
        (r"j", "a second index, used when two run at once"),
        (r"n", "a count of things"),
        (r"N", "the number of examples in a set"),
        (r"d", "the number of components in a vector"),
        (r"K", "the number of classes"),
    ]),
    ("Sets and data", [
        (r"D", "a dataset, the pairs of input and answer you hold"),
        (r"\mathcal{X}", "the space every input lives in"),
        (r"\mathcal{Y}", "the space every answer lives in"),
        (r"\mathcal{D}", "the distribution the data is drawn from"),
        (r"\mathbb{R}", "the real numbers"),
        (r"\mathbb{R}^{d}", "the space of vectors with d real components"),
        (r"\in", "is a member of"),
        (r"\subseteq", "is contained in"),
        (r"\sim", "is drawn from"),
        (r"|D|", "how many items D holds"),
    ]),
    ("Probability", [
        (r"p", "a probability, or a density"),
        (r"p(x)", "how likely input x is"),
        (r"p(y \mid x)", "how likely answer y is once you know x"),
        (r"\mid", "given, read the right side as already known"),
        (r"\theta", "the parameters, the numbers the model learns"),
        (r"\pi", "a policy, what an agent does in a state"),
        (r"\mathbb{E}", "the average over everything the distribution can produce"),
        (r"\mathrm{Var}", "how spread out a quantity is"),
        (r"\mathcal{N}", "the normal distribution"),
        (r"\mu", "a mean"),
        (r"\sigma", "a standard deviation, the usual size of a deviation"),
        (r"\sigma^{2}", "a variance, the square of the standard deviation"),
    ]),
    ("Learning", [
        (r"f", "the model, the function turning an input into an answer"),
        (r"f_{\theta}", "the model with its parameters written in"),
        (r"\mathcal{L}", "the loss, the number training pushes down"),
        (r"\ell", "the loss on one example"),
        (r"R", "the risk, the loss averaged over the distribution"),
        (r"\hat{R}", "the empirical risk, the loss averaged over the data you have"),
        (r"\eta", "the learning rate, the size of a step"),
        (r"\nabla", "the gradient, the direction of steepest increase"),
        (r"\lambda", "a knob trading one term of an objective against another"),
        (r"\alpha", "an error rate you choose in advance"),
        (r"\epsilon", "a small allowance"),
        (r"w", "a weight vector, the coefficients a linear model learns"),
        (r"\gamma", "a discount, how much a reward later is worth now"),
        (r"L", "the number of layers"),
        (r"T", "the length of a sequence"),
    ]),
    ("Testing a claim", [
        (r"H_{0}", "the null hypothesis, the claim on trial"),
        (r"H_{1}", "the alternative, what you would conclude instead"),
        (r"\beta", "the chance of missing a real effect"),
        (r"Z", "a statistic in units of its own standard error"),
        (r"\mathrm{SE}", "the standard error, how much an estimate moves between samples"),
    ]),
    ("Vectors and matrices", [
        (r"v", "a vector, a list of numbers with a direction"),
        (r"A", "a matrix, a table of numbers acting on vectors"),
        (r"A^{\top}", "the transpose, rows and columns swapped"),
        (r"A^{-1}", "the inverse, the matrix undoing A"),
        (r"\det", "the determinant, the factor by which area or volume scales"),
        (r"\|v\|", "the length of v"),
        (r"\langle u, v \rangle", "the inner product of u and v"),
        (r"I", "the identity matrix, the one that changes nothing"),
        (r"\otimes", "an outer product"),
    ]),
    ("Reading the symbols", [
        (r"\sum", "add up every term"),
        (r"\prod", "multiply every term"),
        (r"\int", "add up over a continuum"),
        (r"\arg\max", "the input achieving the largest value"),
        (r"\arg\min", "the input achieving the smallest value"),
        (r"\propto", "equal up to a constant factor"),
        (r"\approx", "approximately equal"),
        (r"\to", "goes to, or maps to"),
        (r"\forall", "for every"),
        (r"\exists", "there is at least one"),
        (r"\coloneqq", "is defined to be"),
    ]),
]

CANON_GLOSS = {}
for _grp, _items in CANON:
    for _s, _g in _items:
        CANON_GLOSS[_s] = _g


# ════════════════════════════════════════════════════════════════════
# Symbol extraction.
#
# Used to prove no equation contains a symbol the reader was never
# given. Anything a mathematician reads as structure rather than as a
# name is skipped: operators, delimiters, spacing, and named functions.
# ════════════════════════════════════════════════════════════════════

STRUCTURE = {
    # layout and spacing
    "frac", "dfrac", "tfrac", "sqrt", "left", "right", "big", "Big", "bigg", "Bigg",
    "quad", "qquad", "text", "mathrm", "operatorname", "mathbb", "mathcal", "mathbf",
    "hat", "bar", "tilde", "vec", "dot", "ddot", "overline", "underline", "overbrace",
    "widehat", "widetilde", "overrightarrow", "mathsf", "mathtt", "boldsymbol",
    "underbrace", "substack", "begin", "end", "array", "matrix", "pmatrix", "bmatrix",
    "cases", "displaystyle", "limits", "nolimits", "phantom", "hspace", ",", ";", ":",
    "!", " ", "\\",
    # relations and operators that are grammar, not names
    "cdot", "cdots", "dots", "ldots", "times", "div", "pm", "mp", "circ", "ast",
    "leq", "geq", "neq", "ll", "gg", "equiv", "cong", "simeq", "asymp",
    # The short spellings of the same three relations, plus the logical
    # connectives. `land`/`lor`/`lnot` were already here; `wedge`/`vee` are
    # the same operators under their other names, and `not` only ever
    # negates the relation after it.
    "ge", "le", "ne", "not", "wedge", "vee", "varnothing",
    "subset", "supset", "supseteq", "cup", "cap", "setminus", "emptyset",
    "land", "lor", "lnot", "neg", "implies", "iff", "Rightarrow", "Leftrightarrow",
    "rightarrow", "leftarrow", "mapsto", "longrightarrow", "uparrow", "downarrow",
    "Longrightarrow", "Longleftrightarrow", "longleftrightarrow", "leftrightarrow",
    "hookrightarrow", "nearrow", "searrow", "vdash", "models", "therefore",
    "partial", "infty", "prime", "star", "bullet", "oplus", "odot",
    "lfloor", "rfloor", "lceil", "rceil", "langle", "rangle", "|", "{", "}",
    "colon", "quad", "notin", "nmid", "perp", "parallel", "top", "bot",
    # named functions: standard reading, not a symbol needing a gloss
    "log", "ln", "exp", "sin", "cos", "tan", "min", "max", "sup", "inf",
    "lim", "det", "dim", "ker", "deg", "gcd", "mod", "bmod", "pmod",
    "arg", "argmax", "argmin", "Pr", "tr", "rank", "diag", "sign", "softmax",
    "xrightarrow", "xleftarrow", "textstyle", "scriptstyle", "underbrace",
    "overbrace", "stackrel", "overset", "underset", "binom", "choose",
}

# Single letters that are structure or standard function names when bare.
BARE_OK = set("edoO")  # e (Euler), d (differential), o and O (order of)

# `\mathbb{E}` is one name, not the command plus the letter E.
BLACKBOARD = re.compile(r"\\(?:mathbb|mathcal|mathbf|mathfrak)\s*\{([^{}]*)\}")
TOKEN = re.compile(r"\\[a-zA-Z]+|\\.|[A-Za-z]")


def symbols_in(tex):
    """Every name a reader could ask about, as it appears in the source."""
    found = []
    # \text{...} and friends hold words, which are read rather than glossed.
    tex = re.sub(r"\\(?:text|operatorname|mathrm)\s*\{[^{}]*\}", " ", tex)
    # `\begin{bmatrix}` names an environment; its letters are not symbols.
    tex = re.sub(r"\\(?:begin|end)\s*\{[^{}]*\}", " ", tex)
    # A letter inside a subscript or superscript is a label on the symbol it
    # decorates, not a symbol in its own right: the `h` in `\varkappa_{h}` is
    # part of the name "kernel height". The full decorated symbol is what the
    # `where` block glosses, so the parts are not asked for separately.
    for _ in range(3):
        tex = re.sub(r"[_^]\s*\{[^{}]*\}", " ", tex)
        tex = re.sub(r"[_^]\s*\\?[A-Za-z0-9]", " ", tex)
    # Lift blackboard and script names out whole before single letters are read.
    for m in BLACKBOARD.finditer(tex):
        found.append(m.group(0).replace(" ", ""))
    tex = BLACKBOARD.sub(" ", tex)
    for m in TOKEN.finditer(tex):
        tok = m.group(0)
        if tok.startswith("\\"):
            name = tok[1:]
            if name in STRUCTURE or not name.isalpha():
                continue
            found.append(tok)
        else:
            if tok in BARE_OK:
                continue
            found.append(tok)
    return found


DECOR = re.compile(r"\\(?:hat|bar|tilde|vec|dot|ddot|overline|widehat|widetilde)"
                   r"\s*\{([^{}]*)\}")


def head(sym):
    r"""The name a symbol is built on, with decoration and arguments removed.

    `\hat{\Delta}` is built on `\Delta`, `\bar{Y}_{\mathrm{treat}}` on `Y`, and
    `p(y \mid x)` on `p`. Used so a gloss covers the forms of its own symbol
    without having to list each one.
    """
    prev = None
    while prev != sym:
        prev = sym
        sym = DECOR.sub(r"\1", sym).strip()
    m = re.match(r"\\?[A-Za-z]+", sym)
    return m.group(0) if m else sym


def canon_key(sym):
    r"""Match a used symbol against the canon, ignoring decoration.

    `p(y \mid x)` in the canon should cover a bare `p`, and `A^{\top}` should
    cover `A`. A subscripted canon entry does not: `H_{0}` is the null
    hypothesis, and that says nothing about what a bare `H` means.
    """
    if sym in CANON_GLOSS:
        return sym
    for k in CANON_GLOSS:
        if "_" in k:
            continue
        if head(k) == sym:
            return k
    return None


# ════════════════════════════════════════════════════════════════════
# Conversion
# ════════════════════════════════════════════════════════════════════

# latex2mathml emits a few relations as <mi>, which makes a browser set them
# as italic letters with no operator spacing: `x ~ p` comes out looking like a
# variable named tilde. Relations belong in <mo>, so they are moved back.
AS_OPERATOR = [
    "&#x0007E;", "&#x0223C;",              # \sim
    "&#x027F9;", "&#x027FA;",              # \Longrightarrow, \Longleftrightarrow
    "&#x027F6;", "&#x027F5;",              # \longrightarrow, \longleftarrow
    "&#x02192;", "&#x02190;", "&#x021A6;",  # \to, \leftarrow, \mapsto
    "&#x021D2;", "&#x021D4;",              # \Rightarrow, \Leftrightarrow
    "&#x02261;", "&#x0225C;", "&#x02254;",  # \equiv, \triangleq, \coloneqq
    "&#x000AC;",                            # \lnot
    "&#x02200;", "&#x02203;",              # \forall, \exists
    "&#x022A2;", "&#x022A8;",              # \vdash, \models
    "&#x000D7;", "&#x000B7;",              # \times, \cdot
]
SIM_FIX = {"&#x0007E;": "&#x0223C;"}

# A circumflex over a symbol is an accent, so MathML should say so. Without
# `accent="true"` the browser sets it at full size and leaves operator spacing
# around it, which reads as a caret sitting beside the letter rather than a hat
# on top of it, and `stretchy` on an accent widens it to the base.
ACCENT = re.compile(r'<mover>((?:(?!<mover\b).)*?)'
                    r'<mo stretchy="false">&#x0005E;</mo></mover>')


def mathml(tex, display=False):
    out = tex_to_mathml(tex)
    for ch in AS_OPERATOR:
        out = out.replace("<mi>%s</mi>" % ch,
                          "<mo>%s</mo>" % SIM_FIX.get(ch, ch))
    # An upright differential: \mathrm{d} loses its variant on a single letter.
    out = out.replace("<mi>&#x00064;</mi><mi>&#x003B8;</mi>",
                      '<mi mathvariant="normal">&#x00064;</mi><mi>&#x003B8;</mi>')
    # A hat over a single letter is centred on that letter. Wrapped in an
    # <mrow> the accent is centred on the row instead, which puts it visibly
    # off to one side on `\hat{y}` and `\hat{R}`.
    out = re.sub(r"(<mover[^>]*>)<mrow>(<m[in][^>]*>[^<]*</m[in]>)</mrow>",
                 r"\1\2", out)
    out = re.sub(r"(<munder[^>]*>)<mrow>(<m[in][^>]*>[^<]*</m[in]>)</mrow>",
                 r"\1\2", out)
    out = ACCENT.sub(r'<mover accent="true">\1<mo>&#x0005E;</mo></mover>', out)
    if display:
        out = out.replace('display="inline"', 'display="block"', 1)
    return out


# ════════════════════════════════════════════════════════════════════
# Colour-linking a symbol to its legend.
#
# MLU-Explain's central trick is that a term in the equation, the word
# for it in the prose, and the thing it controls in the figure all carry
# one colour. Doing that needs each occurrence of a symbol inside the
# equation to be findable, so every leaf of the equation belonging to a
# glossed symbol is tagged with that symbol's index here, at build time.
#
# Tagging leaves rather than wrapping them in a new element matters: the
# MathML tree stays exactly as the converter produced it, so nothing
# about the layout changes and no browser has to guess at a repair.
# ════════════════════════════════════════════════════════════════════

LEAF = re.compile(r"<(mi|mn|mo)\b([^>]*)>(.*?)</\1>", re.S)


def leaves(ml):
    return [(m.start(), m.end(), m.group(1), m.group(2), m.group(3))
            for m in LEAF.finditer(ml)]


def tag_symbols(eq_ml, sym_mls):
    """Mark every leaf of `eq_ml` that belongs to a glossed symbol.

    Longer symbols are matched first so `p(y | x)` claims its own leaves
    before a bare `p` can take the first of them.
    """
    eq_leaves = leaves(eq_ml)
    if not eq_leaves:
        return eq_ml
    eq_text = [lf[4] for lf in eq_leaves]
    # A glyph can belong to more than one glossed symbol: the theta inside
    # `p(θ | D)` is also the theta on its own. `data-s` is the most specific
    # owner and decides the colour; `data-owns` lists every owner, so
    # pointing at any of them lights the glyph.
    owner = [None] * len(eq_leaves)
    owns = [set() for _ in eq_leaves]

    order = sorted(range(len(sym_mls)),
                   key=lambda i: -len(leaves(sym_mls[i])))
    for si in order:
        want = [lf[4] for lf in leaves(sym_mls[si])]
        if not want:
            continue
        span = len(want)
        for start in range(len(eq_text) - span + 1):
            if eq_text[start:start + span] != want:
                continue
            for k in range(span):
                owns[start + k].add(si)
                if owner[start + k] is None:
                    owner[start + k] = si

    # Rewrite from the end so earlier offsets stay valid.
    out = eq_ml
    for idx in range(len(eq_leaves) - 1, -1, -1):
        si = owner[idx]
        if si is None:
            continue
        s, e, tag, attrs, body = eq_leaves[idx]
        new = ('<%s%s class="ivm-s" data-s="%d" data-owns="%s">%s</%s>'
               % (tag, attrs, si,
                  " ".join(str(o) for o in sorted(owns[idx])), body, tag))
        out = out[:s] + new + out[e:]
    return out


def build(data, errors):
    eqs, syms, notation = {}, {}, []

    for grp, items in CANON:
        notation.append({
            "group": grp,
            "items": [{"tex": s, "ml": mathml(s), "is": g} for s, g in items],
        })

    for topic in data["topics"]:
        tid = topic["id"]
        for mi, mod in enumerate(topic["modules"]):
            where = "%s / %s" % (tid, mod["name"])
            blocks = mod.get("math")
            if not blocks:
                errors.append("NO MATH: %s" % where)
                continue
            # A gloss holds for the rest of its module. The reader meets the
            # equations in order, so redefining a symbol under each one would
            # be noise rather than help.
            seen = {}
            for ei, eq in enumerate(blocks):
                tex = eq.get("tex")
                if not tex:
                    errors.append("NO TEX: %s [%d]" % (where, ei))
                    continue
                if not eq.get("read"):
                    errors.append("NO READ: %s [%d]" % (where, ei))
                if not eq.get("name"):
                    errors.append("NO NAME: %s [%d]" % (where, ei))

                key = "%s/%d/%d" % (tid, mi, ei)
                try:
                    eqs[key] = mathml(tex, display=True)
                except Exception as exc:
                    errors.append("BAD TEX: %s [%d] %s" % (where, ei, exc))
                    continue

                local, sym_mls = {}, []
                for si, item in enumerate(eq.get("where") or []):
                    s, g = item.get("sym"), item.get("is")
                    if not s or not g:
                        errors.append("BAD WHERE: %s [%d]" % (where, ei))
                        continue
                    local[s] = g
                    seen[s] = g
                    ck = canon_key(s)
                    if ck and CANON_GLOSS[ck] != g:
                        errors.append(
                            "GLOSS CLASH: %s [%d] %s\n     canon: %s\n     here : %s"
                            % (where, ei, s, CANON_GLOSS[ck], g))
                    one = mathml(s)
                    sym_mls.append(one)
                    syms["%s/%d" % (key, si)] = one.replace(
                        "<math ", '<math class="ivm-s" data-s="%d" ' % si, 1)

                # Colour-link: the symbol in the equation and its legend entry
                # now share an index, so they can share a colour.
                if sym_mls:
                    eqs[key] = tag_symbols(eqs[key], sym_mls)

                # A live equation restates the same line with the reader's own
                # numbers in it, which is the move that makes a figure feel
                # like it is explaining rather than illustrating. Slots are
                # written as 9001, 9002 and so on, and named in order.
                play = eq.get("play") or {}
                if play.get("livetex"):
                    try:
                        live = mathml(play["livetex"], display=True)
                    except Exception as exc:
                        errors.append("BAD LIVETEX: %s [%d] %s" % (where, ei, exc))
                        continue
                    slots = play.get("liveslots") or []
                    for n, nm in enumerate(slots):
                        token = "<mn>%d</mn>" % (9001 + n)
                        if token not in live:
                            errors.append("LIVE SLOT %d unused: %s [%d]"
                                          % (9001 + n, where, ei))
                        live = live.replace(
                            token, '<mn data-live="%s">0</mn>' % nm)
                    eqs[key + "/live"] = live

                # Every symbol in the equation must be glossed somewhere.
                for s in symbols_in(tex):
                    if s in seen or canon_key(s):
                        continue
                    # A gloss covers the forms of its own symbol: a gloss for
                    # `\bar{Y}_{\mathrm{treat}}` answers a bare `Y`, and one for
                    # `\mathcal{I}(\theta)` answers `\mathcal{I}`.
                    if any(head(l) == s or l.startswith(s) for l in seen):
                        continue
                    errors.append("UNGLOSSED: %s [%d] symbol %s" % (where, ei, s))

    return {"notation": notation, "eq": eqs, "sym": syms}


HEADER = """# GENERATED by scripts/render_math.py. Do not hand-edit.
#
# Source of truth is the `math:` block on each module in _data/interview.yml.
# `eq` is keyed "<topic>/<module index>/<equation index>", `sym` adds the
# symbol index, and `notation` is the canonical legend every page renders.
"""


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--check", action="store_true",
                    help="fail if the output is stale or the notation clashes")
    args = ap.parse_args()

    with open(SRC) as fh:
        data = yaml.safe_load(fh)

    errors = []
    built = build(data, errors)

    if errors:
        print("%d problem(s):\n" % len(errors))
        for e in errors:
            print("  " + e)
        print("")

    text = HEADER + yaml.safe_dump(built, allow_unicode=True, sort_keys=True,
                                   default_flow_style=False, width=10**6)

    if args.check:
        current = open(OUT).read() if os.path.exists(OUT) else ""
        if current != text:
            print("STALE: %s does not match the source. Run without --check." % OUT)
            return 1
        if errors:
            return 1
        print("ok: %d equations across %d modules, notation consistent"
              % (len(built["eq"]), len({k.rsplit("/", 1)[0] for k in built["eq"]})))
        return 0

    with open(OUT, "w") as fh:
        fh.write(text)
    print("wrote %s: %d equations, %d symbols, %d notation groups"
          % (OUT, len(built["eq"]), len(built["sym"]), len(built["notation"])))
    return 1 if errors else 0


if __name__ == "__main__":
    sys.exit(main())
