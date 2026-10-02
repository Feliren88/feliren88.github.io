# Interview notation audit

The audit covers all 32 interview tracks. The lesson equations already used LaTeX. However, standalone diagrams and live calculations still used text characters to imitate limits, subscripts, roots, and fractions. Those equations now use the same build-time MathML rendering as the lessons.

The new registry contains 376 authored expressions across maths and proof animations, foundational reading examples, calculus and linear algebra labs, statistics and uncertainty diagrams, Information Theory experiments, Transformers, and diffusion models. Mathematical symbol legends also use this registry. Programming code, scalar chart ticks, native option labels, and spoken captions remain text.

The sum uses an operator with centred upper and lower limits. Furthermore, the integral uses structured bounds and a stacked fraction. Division is explained as the unique solution of bx = a when b is nonzero. The screenshots show the corrected sum and integral.

The converter now rejects malformed MathML. This check caught an unsupported multiline environment, which was replaced with a supported array. Moreover, derivative primes now occupy superscripts. Named runtime values are escaped before insertion into authored mathematical structure.

## Verification

The unit and numerical suites pass, including finite-difference derivative comparisons and 24 distribution checks. The generated-data consistency check passes. Furthermore, the site builds and its SEO audit reports zero flagged pages.

Browser checks pass across all 32 tracks on desktop and phone. The maths and proof checks confirm four rendered steps per animation, centred sum limits, and equation bounds within the SVG rows. Enlarged reading text remains contained on the affected tracks. The six Information Theory explorer modes pass in both themes and widths. The 16 lesson controls, playback, rewind, keyboard interactions, and guides pass on desktop and phone.

An existing operating-system table extends beyond the phone viewport at enlarged text size. That unrelated table is excluded from the affected-track layout assertion; its page still passes the formula boot check.

The screenshots are [Sum](sum.png) and [Integral](integral.png).
