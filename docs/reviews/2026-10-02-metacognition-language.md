# Metacognition language review

The rewrite uses British English and keeps the author’s first-person voice. It aims to help readers with no research background understand the article and exercises. Therefore, it explains the remaining technical terms through the examples that use them.

The full article is in [_pages/metacognition.md](../../_pages/metacognition.md). Moreover, [metacognition.js](../../js/components/metacognition.js) contains the exercise instructions, answers, and feedback. The revision also updates the scroll story, the Writings preview, and the page summary in llms.txt.

## Editing passes

Slop or Not Pro was unavailable. Therefore, the humanizer ran all 5 passes without detector scores or measured reading grades.

| Pass | AI score | Reading grade | Work completed |
|---|---|---|---|
| Baseline | N/A | N/A | Read the article, exercises, and scroll story. |
| 1 | N/A | N/A | Replaced decorative phrasing and abstract labels with clear actions. |
| 2 | N/A | N/A | Kept British spelling and the author’s direct voice. |
| 3 | N/A | N/A | Shortened sentences and explained unfamiliar ideas where readers need them. |
| 4 | N/A | N/A | Checked punctuation, sentence openings, and remaining vague wording. |
| 5 | N/A | N/A | Reviewed examples, source coverage, transitions, and rendered exercises. |

## What changed

The navigation now uses words such as “Confidence”, “Trust”, and “Tasks”. Similarly, the diagram labels describe doing a task and checking my thinking.

The confidence section explains that repeated “80% sure” answers should be right about 8 times in 10. Moreover, the exercises use clear instructions such as “Let AI do it” and “Do it myself”.

The reading exercise now asks whether the paragraph explains a missing step. Moreover, every answer option responds directly to that yes-or-no question. Its feedback invites the reader to compare their confidence with their explanation. Therefore, it avoids claiming that one answer reveals why the reader felt confident.

The medical chart explains the bowel examination and the growths it measures. Moreover, the research summaries distinguish an observed change from proof of its cause.

All 8 sections remain, along with the 9 guide references and 7 cited studies. The study titles, links, statistics, exercise answers, and scoring calculations remain intact.

## Validation

The Jekyll build and SEO audit passed with 0 flagged pages. Moreover, the full test suite passed using the temporary Python environment. The existing JavaScript checks passed after their copy assertions were updated.

All 14 browser checks passed. Moreover, previews at 1280px and 400px showed no horizontal overflow or cramped labels. The visual review covered the hero, confidence exercise, and trust simulation.
