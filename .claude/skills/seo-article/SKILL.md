---
name: seo-article
description: Research and draft one SEO and GEO optimised article, service page or glossary entry for alpha-metrics.ai from a target keyword, with meta data, FAQ and JSON-LD. Use for "/seo-article markenbekanntheit messen" or "write the brand tracking service page".
---

# SEO article

Argument: target keyword, optionally page type (article | service | glossary | study).

1. Find the keyword in `marketing/keywords.csv`; if missing, add a row with cluster,
   intent and a proposed target page, and tell the user.
2. SERP check: WebSearch the keyword (German, Austria). Note the intent, the content
   types ranking, the questions they answer and what they miss. Keep 5 lines of notes.
3. Delegate to `seo-writer` with keyword, page type, SERP notes and output path
   `marketing/drafts/adhoc/<slug>.md`.
4. Delegate to `geo-auditor` for checks 2 and 3 of its checklist on the draft only,
   and to `claim-checker`. Run both in one message.
5. Apply one fix round with `seo-writer`. Report: title, description, word count,
   verdicts, and 2-3 LinkedIn post angles that reuse the article.

Publishing (manual, after approval): convert to HTML in the site's style under the
slug, add it to `sitemap.xml` with hreflang, submit via IndexNow / Search Console.
