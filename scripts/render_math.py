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
        (r"x", "One input example"),
        (r"y", "The true answer for this input"),
        (r"\hat{y}", "The answer predicted by the model"),
        (r"z", "A hidden representation, the numbers produced by an intermediate model step"),
        (r"t", "A time step or a position in a sequence"),
        (r"k", "An index identifying a class or a neighbour"),
        (r"i", "An index identifying an example"),
        (r"j", "A second index used alongside another index"),
        (r"n", "The number of items being counted"),
        (r"N", "The number of examples in a dataset"),
        (r"d", "The number of components in a vector"),
        (r"K", "The number of classes"),
    ]),
    ("Sets and data", [
        (r"D", "A dataset containing input and answer pairs"),
        (r"\mathcal{X}", "The set of possible inputs"),
        (r"\mathcal{Y}", "The set of possible answers"),
        (r"\mathcal{D}", "The probability distribution that generates the data"),
        (r"\mathbb{R}", "The real numbers"),
        (r"\mathbb{R}^{d}", "The set of vectors with d real-number components"),
        (r"\in", "Is a member of"),
        (r"\subseteq", "Is a subset of"),
        (r"\sim", "Is sampled from"),
        (r"|D|", "The number of items in D"),
    ]),
    ("Probability", [
        (r"p", "A probability or probability density"),
        (r"p(x)", "The probability or density assigned to input x"),
        (r"p(y \mid x)", "The probability or density of answer y given input x"),
        (r"\mid", "Given the information on the right of the symbol"),
        (r"\theta", "The model parameters, the numbers fitted or assigned to the model"),
        (r"\pi", "A policy, the rule an agent uses to choose actions in a state"),
        (r"\mathbb{E}", "The expected value, an average weighted by the probability distribution"),
        (r"\mathrm{Var}", "The variance, a measure of spread around the mean"),
        (r"\mathcal{N}", "The normal distribution"),
        (r"\mu", "A mean"),
        (r"\sigma", "A standard deviation, a measure of spread in the original units"),
        (r"\sigma^{2}", "A variance, equal to the square of the standard deviation"),
    ]),
    ("Learning", [
        (r"f", "The model, a function that maps an input to an answer"),
        (r"f_{\theta}", "The model with its parameters shown explicitly"),
        (r"\mathcal{L}", "The loss, a measure of error that training aims to reduce"),
        (r"\ell", "The loss for one example"),
        (r"R", "The risk, the average loss under the data distribution"),
        (r"\hat{R}", "The empirical risk, the average loss on the observed data"),
        (r"\eta", "The learning rate, which controls the size of a parameter update"),
        (r"\nabla", "The gradient, whose components are partial derivatives"),
        (r"\lambda", "A coefficient controlling the balance between terms in an objective"),
        (r"\alpha", "An error-rate threshold chosen before the test"),
        (r"\epsilon", "A small tolerance"),
        (r"w", "A weight vector, the coefficients of a linear model"),
        (r"\gamma", "A discount factor controlling the weight given to future rewards"),
        (r"L", "The number of layers"),
        (r"T", "The sequence length"),
    ]),
    ("Testing a claim", [
        (r"H_{0}", "The null hypothesis, the claim evaluated by a statistical test"),
        (r"H_{1}", "The alternative hypothesis, the claim compared with the null hypothesis"),
        (r"\beta", "The probability of failing to detect an effect under the specified alternative"),
        (r"Z", "A test statistic expressed in standard-error units"),
        (r"\mathrm{SE}", "The standard error, the standard deviation of an estimate across repeated samples"),
    ]),
    ("Vectors and matrices", [
        (r"v", "A vector, an ordered list of numbers"),
        (r"A", "A matrix, a rectangular array of numbers that can transform vectors"),
        (r"A^{\top}", "The transpose of A, obtained by swapping its rows and columns"),
        (r"A^{-1}", "The inverse of A, which reverses its transformation when an inverse exists"),
        (r"\det", "The determinant, which gives signed area or volume scaling"),
        (r"\|v\|", "The length of v"),
        (r"\langle u, v \rangle", "The inner product of u and v"),
        (r"I", "The identity matrix, which leaves a vector unchanged"),
        (r"\otimes", "An outer product, a matrix formed from pairwise products of two vectors"),
    ]),
    ("Reading the symbols", [
        (r"\sum", "Add the indicated terms"),
        (r"\prod", "Multiply the indicated terms"),
        (r"\int", "Integrate, accumulating values across a continuous range"),
        (r"\arg\max", "The input that achieves the largest value"),
        (r"\arg\min", "The input that achieves the smallest value"),
        (r"\propto", "Proportional to, or equal up to a constant factor"),
        (r"\approx", "Approximately equal to"),
        (r"\to", "Approaches, or maps to, depending on the expression"),
        (r"\forall", "For every"),
        (r"\exists", "There exists at least one"),
        (r"\coloneqq", "Is defined as"),
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


# latex2mathml passes a command it does not know straight through, so the
# reader gets the source printed at them. Two constructs hit that path often
# enough to be worth normalising before conversion rather than banning in the
# source, and both were reaching the published pages:
#
#   \big\{  \Big\|  and friends. The size prefix is dropped rather than turned
#   into \left...\right, because a lone \left with no matching \right is a hard
#   error, and an opening and a closing \big\| are the same string, so nothing
#   here can tell them apart. The delimiter renders at its natural size.
#
#   \arg\max and \arg\min. These are two commands, and \arg is the unknown one,
#   so the pair printed as a literal \argmax. The canon lists both, so the
#   notation legend was showing it too.
#   \text{is kept}. Newer latex2mathml drops the ASCII spaces inside \text{},
#   which silently welds the words together: `O(1) index` rendered as
#   `O(1)index`, and `item i is kept` as `item iiskept`. A literal non-breaking
#   space survives every version, so TEXT_SPACE below pins them rather than
#   leaving the spacing to whichever library version is installed.
PRE_FIX = [
    (re.compile(r"\\(?:bigg?|Bigg?)([lrm]?)(?=\\[{}|])"), ""),
    # Not \b for the tail: these are nearly always subscripted, and `_` counts
    # as a word character, so \b would never fire where it matters.
    (re.compile(r"\\arg\\(max|min)(?![A-Za-z])"), r"\\operatorname{arg\\,\1}"),
]


TEXT_SPACE = re.compile(r"\\text\s*\{([^{}]*)\}")


def mathml(tex, display=False):
    tex = TEXT_SPACE.sub(
        lambda m: "\\text{%s}" % m.group(1).replace(" ", "\u00a0"), tex)
    for pat, rep in PRE_FIX:
        tex = pat.sub(rep, tex)
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
    # The converter escapes the characters it emits itself, so the spaces
    # TEXT_SPACE injected are the only raw ones. Escape them to match.
    out = out.replace(" ", "&#x000A0;")
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
                if not mod.get("math_optional"):
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
                # The live line belongs to the equation. It may sit on the
                # equation itself (`live: {tex, slots}`), fed by a module
                # explainer, or on its playground (`livetex`, `liveslots`).
                play = eq.get("play") or {}
                src = eq.get("live") or {"tex": play.get("livetex"), "slots": play.get("liveslots")}
                if src.get("tex"):
                    try:
                        live = mathml(src["tex"], display=True)
                    except Exception as exc:
                        errors.append("BAD LIVETEX: %s [%d] %s" % (where, ei, exc))
                        continue
                    slots = src.get("slots") or []
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
