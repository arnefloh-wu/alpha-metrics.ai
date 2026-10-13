---
name: geo-monitor
description: Monthly AI-visibility check for alpha-metrics.ai. Runs or prepares the fixed GEO prompt set across ChatGPT, Perplexity, Gemini, Copilot and Claude, logs mentions and citations, compares with last month, and runs a GEO/technical audit of the site. Use for "/geo-monitor" or "how visible are we in AI search?".
---

# GEO monitor

1. Delegate to `geo-auditor`: full audit of the live site files (`index.html`, `/de/`
   pages if present, `robots.txt`, `sitemap.xml`, `llms.txt`).
2. Prompt check with `marketing/geo-prompts.csv`:
   - If API keys for assistants are available as environment variables
     (e.g. `ANTHROPIC_API_KEY`, `OPENAI_API_KEY`, `PERPLEXITY_API_KEY`), the auditor may
     run the prompts through them with web search enabled and log the answers.
   - Otherwise create `marketing/reports/geo-sheet-<yyyy-mm>.csv` with one row per
     prompt and engine and empty result columns, and tell the user to run the prompts
     in a logged-out/private session and fill it in. Then re-run this skill with
     `ingest <file>` to append to `geo-log.csv`.
3. Report `marketing/reports/geo-<yyyy-mm>.md`: mention rate overall and by engine,
   language and segment; change vs last month (with the number of prompts, it is a
   small sample, so describe changes of one or two prompts as noise); competitors
   named most often; wrong facts about alpha-metrics.ai that need correcting at the
   source; top 5 fixes.
