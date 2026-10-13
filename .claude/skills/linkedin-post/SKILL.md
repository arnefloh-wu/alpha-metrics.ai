---
name: linkedin-post
description: Draft one LinkedIn post (or carousel / newsletter issue) for the alpha-metrics.ai founder from a topic, a chart, an article or a URL, in German or English, checked against the brand voice. Use for ad-hoc posts outside the weekly sprint, e.g. "/linkedin-post de carousel on design effects".
---

# LinkedIn post

Arguments: free text. Parse language (de/en, default de), format (post, carousel,
newsletter, comment; default post) and the topic or source.

1. If the source is a URL or file, read it and extract the one idea worth posting.
   If it is someone else's post or study, the angle is what it means for a DACH brand
   team, with a link to the original.
2. Map the idea to a pillar P1-P5 in `marketing/COMMUNICATION-PLAN.md`.
3. Delegate drafting to the `linkedin-writer` subagent with a mini brief (message,
   proof + source, language, format, CTA). Output path:
   `marketing/drafts/adhoc/<yyyy-mm-dd>-<slug>.md`.
4. Delegate the file to `claim-checker`. If RED, fix once with the writer.
5. Show the user the final post text inline, the 3 alternative hooks, and the
   checker verdict.
