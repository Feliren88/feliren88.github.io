# Generated data files

Two data files are computed, not written. Hand edits to either are lost on the
next run of the script that owns it.

| Data file | Owned by | Verify with |
|---|---|---|
| `_data/game_theory.yml` | `scripts/solve_games.py` (source: `scripts/games.json`) | `python3 scripts/solve_games.py --check` |
| `_data/stoic.yml` | quotes lifted from public-domain sources | `python3 scripts/verify_stoic_quotes.py` |

## Computing a claim rather than asserting it (`/game-theory/`)

`_data/game_theory.yml` is **generated**. Do not hand-edit the `solved:` blocks.

Every Nash equilibrium, dominant strategy and Pareto-efficient cell shown on
that page is computed by `scripts/solve_games.py` from the payoff matrix
displayed next to it. Edit `scripts/games.json`, then:

```bash
python3 scripts/solve_games.py           # regenerate the data file
python3 scripts/solve_games.py --check   # fail if the data file is stale
```

The reason is the same as the Stoic page. Recalling that Chicken has two pure
equilibria off the diagonal, or that Stag Hunt has none off it, is easy to get
backwards, and a wrong equilibrium is a wrong claim about how a real situation
resolves. Deriving it from the numbers on screen makes the two impossible to
disagree.

Everything in the data file comes from `games.json`, not only the games:
`levers`, `laws`, `dashboard`, `classifier`, `five`, `domains`, `regimes` and
`readiness` are all emitted by the same script. **A hand edit to
`_data/game_theory.yml` is lost on the next run.** To add a field, add it to
`games.json` *and* to the matching `L.append(...)` in `solve_games.py`, then
re-run. Every section now carries a distinct `icon:` per row on that route.

`/game-theory/` also draws each game as a 2x2 shape map (`shapes()` in
`js/components/game-theory.js`). It reads only the computed `solved` block, so
the picture cannot disagree with the matrix beside it. Check it against the
solver's own summary table after changing a payoff:

```bash
python3 scripts/solve_games.py --check
```

Note the **underscore** in the filename. Liquid parses `site.data.game-theory`
as a subtraction, so a hyphenated data file is read unpredictably. Data files
consumed by Liquid need underscores.

Maths on the page is hand-marked-up HTML rather than a rendering library:
`.gt-eq` for display equations, `.m` for inline symbols, `.frac` for stacked
fractions. Keep variables italic and operators upright, which is what
`.m .op` handles.

## Quoting a primary source (`/stoic/`)

`_data/stoic.yml` is **generated**. Do not hand-write or hand-edit a `quote`.

Every quotation is a contiguous verbatim span lifted programmatically from a
public-domain source text:

| Work | Translation | Source |
|---|---|---|
| Meditations | George Long | `classics.mit.edu/Antoninus/meditations.mb.txt` |
| Enchiridion | Elizabeth Carter | `classics.mit.edu/Epictetus/epicench.1b.txt` |

This matters because the best-known Stoic lines in circulation are usually a
different translator's wording, a paraphrase, or an invention. Writing them from
memory produces confident misattribution. Two examples caught during the build:
"the impediment to action advances action" is Hays and appears nowhere in Long,
and the closing passage of Meditations book 12 is absent from the MIT edition
entirely, so the entry citing it was dropped rather than sourced elsewhere.

`situation`, `take` and `search` are original commentary or derived keywords and
are safe to edit. After any change to the data file, run:

```bash
python3 scripts/verify_stoic_quotes.py
```

It fetches both sources, rebuilds the index, and fails on any quote that is not
a verbatim span of the stated book or chapter. It allows exactly two
normalisations, neither of which changes a word: translator apparatus removed
(bracketed Greek, footnote markers, editorial parentheses), and truncation
punctuation, where a span cut at a clause boundary may end in a full stop and
capitalise its first letter. Source texts cache to `scripts/.stoic-cache/`,
which is gitignored.

Refs are `book.section` for the Meditations and a bare chapter number for the
Enchiridion.

