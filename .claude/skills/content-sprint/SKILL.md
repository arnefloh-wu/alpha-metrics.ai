---
name: content-sprint
description: Run the weekly alpha-metrics.ai content sprint. Plans the coming week from the content calendar, drafts LinkedIn posts, articles and ad copy with the content subagents, checks every draft with claim-checker, and writes a review summary. Use when asked to "run the content sprint", "prepare next week's content", or from the scheduled GitHub Action.
---

# Content sprint

Argument (optional): an ISO week like `2026-W44`. Default: the week after today.

1. **Set up.** Compute year and week number. Create `marketing/drafts/<yyyy>-kw<ww>/`.
   If it already contains drafts, stop and report instead of overwriting.
2. **Plan.** Delegate to the `content-strategist` subagent: "Write briefs for
   <week>." Wait for `briefs.md`.
3. **Draft in parallel.** For each brief, delegate by channel, all in one message so
   they run concurrently:
   - linkedin, linkedin-ads → `linkedin-writer`
   - site (article, service page, glossary, study page) → `seo-writer`
   - sea, linkedin-ads targeting → `ads-strategist`
   Pass the brief text and the output path.
4. **Check.** Delegate all new draft files to `claim-checker` in one call. Save its
   report as `review.md` in the week folder.
5. **One fix round.** For each RED or AMBER finding, send the finding back to the
   writer that produced the draft and ask for a corrected version in place. Do not run
   the checker a third time; list anything still open.
6. **Summarise** in `marketing/drafts/<yyyy>-kw<ww>/README.md`:
   - table: id, channel, date, file, verdict
   - founder to-dos (approve, choose hook, attach visual, publish where)
   - open questions from the strategist
   - what was not produced and why

Never publish, post or call ad-platform APIs. The output of this skill is files for
human review.
