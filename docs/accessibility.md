# Accessibility

The site targets WCAG 2.1 AA. The always-on rules are in `CLAUDE.md`; this file
records the detail and the one known outstanding defect.

The site targets WCAG 2.1 AA compliance. Key implementations:

- **Skip link**: `.skip-link` in `_layouts/default.html` — first focusable element, links to `#main-content` on `<main>`
- **Focus indicator**: Global `:focus-visible { outline: 2px solid var(--accent); outline-offset: 3px }` in `styles.css`
- **Button borders**: All interactive element borders use `--border-ui` (≥ 3:1 contrast ratio) not `--line`
- **Text contrast**: `--text` = 13.6:1, `--muted` = 6.75:1, `--accent` = 5.81:1 against `--bg`
- **Status messages**: `#project-count` uses `role="status" aria-live="polite"` in `publications.md`
- **Decorative images**: `aria-hidden="true"` on SVG backgrounds and canvas
- **Alt text**: All meaningful images have descriptive alt text
- **Filter groups**: All filter bars use `role="group"` + `aria-label`
- **Note blocks**: Use `role="note"` on `.note-block`

## Known: the document outline skips ranks on five pages

`/game-theory/`, `/high-agency/`, `/principles/`, `/stoic/` and `/small-talk/` jump
from h2 straight to h5 (h4 on small-talk), 53 headings in total. Screen-reader users
navigating by heading lose the nesting. It is a best-practice failure rather than a
2.1 AA one, which is why it is recorded rather than patched.

It is not a one-line fix, and a retag was attempted and reverted. Three things bite:

- `styles.css` resets `h1, h2, h3, strong` but not h4 to h6, so a heading promoted
  into that list silently gains `margin: 0`, Space Grotesk and `line-height: 1.1`.
- each page has a section-wide prose rule (`.gt-part h3`, `.ha-part h3`, `.sm-part h3`,
  `.ha-part h4`) that captures every component heading once the ranks move. Scoping
  those to `> h3` fixes it, and is a prerequisite for any retag.
- the stylesheets select these headings by element inside a class scope, roughly 15
  selectors, and `high-agency.js`, `small-talk.js` and `communication.js` emit some
  of them, so tag, rule and template have to move together.

Doing it properly means scoping the prose rules first, then renaming, then pinning
`line-height` and `font-family` per component, checking each against a baseline build
rather than by eye. A partial attempt left 226 headings rendering differently.

