# Marketing operations

| File | Purpose |
|---|---|
| `COMMUNICATION-PLAN.md` | Strategy, channels (LinkedIn, SEO, SEA, GEO), roadmap, KPIs, budget, governance |
| `brand-voice.md` | Voice and claim rules used by all agents |
| `content-calendar.csv` | Weeks 1-13, every planned piece |
| `keywords.csv` | Keyword clusters and target pages (volumes to be validated) |
| `geo-prompts.csv` | Fixed prompt set for the monthly AI-visibility check |
| `utm-convention.md` | Link tagging rules |
| `llms.txt.draft` | Draft for `/llms.txt`, publish once the `/de/` pages exist |
| `drafts/`, `reports/` | Agent output, reviewed by a person before anything is published |

Automation lives in `.claude/agents/`, `.claude/skills/` and
`.github/workflows/content-sprint.yml`.

Quick start in Claude Code, from the repository root:

```
/content-sprint                       # next week's drafts, checked
/linkedin-post de carousel Designeffekt
/seo-article markenbekanntheit messen
/search-ads build "S3 Brand tracking"
/geo-monitor
/performance-review
```

**Do not merge this folder into `main` of the public site repository**: GitHub Pages
would publish every file. See gate G4 in the plan.
