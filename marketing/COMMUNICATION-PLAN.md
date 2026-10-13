# alpha-metrics.ai: communication and content plan

Channels: LinkedIn, SEO, SEA (paid search and paid social), GEO (generative engine
optimisation: being cited by ChatGPT, Perplexity, Gemini, Copilot, Google AI Overviews).
Horizon: 12 months, with a detailed first 90 days.
Automation: Claude Code agents and skills in `.claude/`, run by hand or weekly from
GitHub Actions (see section 9).

---

## 0. Gates before any money is spent

These come from the repo itself. Advertising a site that fails them is a legal and
reputational risk, not just a missed optimisation.

| # | Gate | Why | Owner |
|---|---|---|---|
| G1 | Complete the red fields in `impressum.html` and `datenschutz.html`, lawyer review | ECG, UGB, MedienG require them; ads send traffic to a page that is legally incomplete | Founder + lawyer |
| G2 | Decide how to measure ads **without breaking "no cookies, no analytics"** | The site's CSP and privacy promise forbid the Google tag and LinkedIn Insight Tag. See 6.4 for a cookieless design | Founder |
| G3 | German version of the site (`/de/`) with `hreflang` | DACH buyers search in German; the site is English only, so it cannot rank for "Marktforschung Wien" | Web |
| G4 | Do **not** merge `marketing/` or `.claude/` into `main` of this repo as is | The repo is public and GitHub Pages serves `main` from the root with `.nojekyll`, so every file, including this plan and all drafts, becomes a public URL on alpha-metrics.ai. Move marketing ops to a private repo (recommended) or switch Pages to an Actions deploy that uploads only site files | Founder |
| G5 | Confirm the six Standards describe actual practice | Every piece of content leans on them; UWG §2 makes misleading claims actionable | Founder |

---

## 1. Positioning

**One line.** Market research for DACH brands that tells you what the sample can carry.

**The gap we occupy.** Large institutes (e.g. full-service panels and omnibus providers)
sell scale; DIY survey tools sell speed; AI "synthetic respondent" vendors sell price.
None of them lead with *statistical honesty*: intervals, bases, design effects,
"association is not effect". That is alpha-metrics.ai's defensible territory, and it is
credible because the founder is an academic quantitative researcher
("Where science meets business").

**Proof we already own.** The ZINTO showcase (synthetic, labelled), the six Standards,
the demo dashboard, re-runnable scripts. These are content assets, not just page sections.

**The .ai question.** The domain invites the question "is this AI research?". Answer it
on purpose, in content: *we use AI to speed up instrument checks, coding and reporting;
we never use it to invent respondents.* This turns a possible confusion into a
differentiator in the 2026 debate about synthetic samples.

## 2. Audiences

| Segment | Who | What they need to hear | Where they are |
|---|---|---|---|
| A. Brand and marketing leads, mid-size DACH consumer brands (FMCG, retail, D2C, food, drinks) | Head of Marketing, Brand Manager, CMO at 50 to 2,000 staff | "Is my awareness gain real?" "Where in the funnel do we lose people?" | LinkedIn, Google (German), trade media (HORIZONT, Werbeplanung.at, Lebensmittel Zeitung) |
| B. In-house insights / market research managers | Market Insights Manager, Head of CMI | Rigour, transparent method, re-runnable scripts, a second opinion on supplier data | LinkedIn, VMÖ / ESOMAR / BVM / marktforschung.de |
| C. Agencies (media, creative, brand consultancies) | Strategy Director, Planning lead | A white-label research partner for pitches and campaign effect studies | LinkedIn, personal network |
| D. Founders / start-ups before launch or funding | Founder, CEO | A defensible baseline for investors; affordable scope | LinkedIn, Google, AI assistants ("how to measure brand awareness") |

Primary for year 1: **A and C** (budget holders, shortest path to revenue). B builds
credibility and referrals; D is opportunistic and mainly reached via SEO/GEO.

## 3. Messaging pillars

| Pillar | Core message | Proof point | Example angles |
|---|---|---|---|
| P1 What the sample can carry | A precise number on a thin base is a risk to your decision | Standards 01, 02, 04 | "Your 3-point awareness gain has an interval of ±4", "n=30 is a floor, not a target" |
| P2 Funnel truth | Find the gate where you lose people, then act on that gate | ZINTO funnel: consideration is the bottleneck | Awareness vs consideration; "the brand converts once considered" |
| P3 Method change is not growth | Tracking breaks when the question changes; we separate real change from method effect | ZINTO 2022 vs 2026 adjustment | How to switch survey vendors without losing your trend line |
| P4 DACH is three markets | Compare, don't pool | Standard 05, AT vs DE showcase | Why your German result does not transfer to Austria |
| P5 AI in research, honestly | AI speeds up the work; it does not replace respondents | Own pipeline; academic literature | Synthetic respondents: what the evidence says |

Tone: precise, calm, sceptical of hype, never smug. Every statistic carries its base.
Full rules in `marketing/brand-voice.md`; the `claim-checker` agent enforces them.

## 4. LinkedIn

### 4.1 Set-up
- **Founder profile is the primary channel**, company page the secondary one. Personal
  posts typically reach far more people than company-page posts; the company page exists
  for credibility, ads and the `sameAs` entity link.
- Founder headline (suggestion): *Founder alpha-metrics.ai · Market research for DACH
  brands · Senior Lecturer in International Business*. Featured section: showcase,
  demo dashboard, one flagship article.
- Company page: complete all fields, German and English descriptions, the same NAP
  (name, address, phone) as the Impressum and schema.org block, custom button
  "Kontakt" to `/#contact` with UTM.

### 4.2 Rhythm (founder profile)
| Day | Format | Pillar mix |
|---|---|---|
| Tue | Text + one chart (from ZINTO or own pulse study) | P1, P2, P3 |
| Thu | Short opinion / myth-buster, text only, or document (PDF carousel) every 2nd week | P4, P5 |
| Monthly | LinkedIn newsletter "Was die Stichprobe trägt" (DE) / long article | rotating |
| Daily, 20 min | Substantive comments on 5 to 10 posts of target accounts and DACH marketing voices | — |

Language: alternate DE and EN; DE for segments A and C, EN for method pieces that also
serve the international research community. Never post the same text twice in two
languages on the same day.

### 4.3 Formats that fit this brand
- **"One chart, one lesson"**: a ZINTO chart with its interval, and what a marketer
  would wrongly conclude without it.
- **"Wrong vs. right" pairs**: two sentences describing the same finding, one
  overclaiming, one honest.
- **Carousels**: "6 questions to ask your research supplier", "Brand funnel in 7 slides".
- **Teaching moments**: the founder explains a concept from the lecture hall for managers
  (design effect, Holm correction) in 150 words.
- **Pulse results** (see 8): original DACH data, the strongest format for reach and for GEO.

### 4.4 Paid LinkedIn (after G2)
- **Thought Leader Ads** boosting the founder's best organic posts (the post with the
  highest engagement rate of the month).
- **Document Ads** for the lead magnet (checklist PDF), lead gen form natively on
  LinkedIn, so no site tracking is needed.
- Targeting: AT first, then DE/CH; job functions Marketing, Product, Research; seniority
  Manager+; company size 51 to 5,000; industries Food & Beverage, Consumer Goods, Retail,
  Advertising Services. Also a matched list of 200 to 500 named target accounts.
- Budget: start at about EUR 30 per day for 6 weeks, judge on cost per qualified lead,
  not CTR. (Verify current minimums and auction prices in Campaign Manager.)

## 5. SEO

### 5.1 Site structure (needed; today the site is one page)
```
/                        EN home (exists)
/de/                     DE home (new, primary for DACH)
/de/leistungen/brand-tracking/
/de/leistungen/fragebogen-programmierung/
/de/leistungen/treiberanalyse/
/de/leistungen/dashboards/
/de/wissen/              insights hub (articles, glossary)
/de/wissen/glossar/      definitions: Konfidenzintervall, Designeffekt, Gewichtung …
/de/studien/             own pulse studies with downloadable tables
/en/insights/            EN articles (method pieces)
```
Each service page: one intent, one H1, a ZINTO example, FAQ block with `FAQPage`
schema, CTA. Add every URL to `sitemap.xml` with `hreflang` pairs.

### 5.2 Keyword clusters
Full list with intent and target page: `marketing/keywords.csv`. Volumes are deliberately
**not** filled in: validate in Google Keyword Planner / Search Console before
prioritising. Clusters:

1. **Local commercial**: Marktforschung Wien, Marktforschungsinstitut Österreich,
   Marktforschung Agentur Wien, Marktforschung beauftragen.
2. **Service**: Brand Tracking, Markenbekanntheit messen, Markenfunnel Analyse,
   Konsumentenbefragung durchführen lassen, Fragebogen programmieren lassen,
   Treiberanalyse, Online-Umfrage Agentur.
3. **Problem / informational** (hub content): gestützte vs. ungestützte Bekanntheit,
   Stichprobengröße berechnen Marktforschung, Konfidenzintervall Umfrage, Gewichtung
   Umfrage Designeffekt, Brand Funnel KPIs, Trackingstudie Methodenwechsel.
4. **AI and research** (EN + DE): synthetic respondents, KI in der Marktforschung,
   LLM survey research validity.

### 5.3 Content production
- 2 hub articles per month (1 DE, 1 EN alternating; DE priority), 1,200 to 2,000 words,
  each with an original chart, a definition box in the first 100 words, and FAQs.
- Every article reuses into 2 to 3 LinkedIn posts (see calendar).
- Technical: Search Console and Bing Webmaster Tools verified; `Article`, `Person`
  (founder, with university profile, ORCID, Google Scholar in `sameAs`),
  `Organization`, `FAQPage`, `Dataset` (for pulse studies) structured data; internal
  links from every article to one service page.

### 5.4 Off-page and authority
- Directories with consistent NAP: Google Business Profile (Vienna), WKO Firmen A-Z,
  Herold, marktforschung.de Dienstleisterverzeichnis, GreenBook, ESOMAR directory
  (if member).
- Memberships to consider: VMÖ (Verband der Marktforscher Österreichs), ESOMAR.
- Digital PR from pulse studies: pitch results to Werbeplanung.at, HORIZONT Österreich,
  derStandard, Die Presse, Leadersnet, plus academic channels (university news).
- Guest lectures and conference talks (Marktforschungsgipfel, Research & Results,
  VMÖ events) with a link back to the study page.

## 6. SEA (Google Ads, Microsoft Ads)

### 6.1 Structure
| Campaign | Ad groups | Match | Geo | Start budget |
|---|---|---|---|---|
| S1 Brand | alpha-metrics, alpha metrics marktforschung | exact | AT, DE, CH | EUR 3/day |
| S2 Marktforschung Wien | Marktforschung Wien, Institut, Agentur | exact + phrase | Vienna + 40 km, then AT | EUR 25/day |
| S3 Brand tracking | Brand Tracking, Markenbekanntheit messen, Markenfunnel | phrase | AT, then DE | EUR 15/day |
| S4 Umfrage beauftragen | Konsumentenbefragung, Online-Umfrage Agentur, Fragebogen programmieren | phrase | AT | EUR 10/day |

About EUR 1,600 per month at start. Treat this as a test budget: after 8 weeks keep only
ad groups with leads at an acceptable cost. Mirror S2 and S3 to Microsoft Ads (small,
B2B-heavy audience, cheap; also feeds Bing, which matters for Copilot and ChatGPT search).

### 6.2 Negative keywords (critical in this category)
"Umfrage" and "Marktforschung" attract **people who want to earn money by taking
surveys**, students and job seekers. Shared negative list from day one:
`bezahlte umfragen, geld verdienen, umfragen teilnehmen, umfrage teilnehmen, gutschein,
gewinnspiel, nebenjob, job, jobs, stellen, karriere, praktikum, gehalt, ausbildung,
studium, bachelorarbeit, masterarbeit, seminararbeit, kostenlos, gratis, vorlage,
muster, pdf, definition, beispiel, google forms, surveymonkey, umfrage erstellen app`.
Review the search terms report weekly (the `search-ads` skill does this from an export).

### 6.3 Ads
Responsive search ads, 15 headlines and 4 descriptions per ad group, generated by the
`search-ads` skill and checked by `claim-checker`. Rules: no superlatives ("bestes
Institut") without proof (UWG), every number true, landing page = the matching
German service page, not the English home page.

### 6.4 Measurement without cookies (gate G2)
Recommended design, consistent with the site's privacy promise:
1. Every ad and post link carries UTM parameters (convention in
   `marketing/utm-convention.md`).
2. A small same-origin script (allowed by the current CSP) copies `utm_*` and the
   Google click ID (`gclid`) from the URL into hidden fields of the contact form, without
   storing anything in the browser.
3. Formspree delivers them with the message. Qualified leads are logged in a sheet and
   uploaded as **offline conversions** to Google Ads (gclid) and as LinkedIn Conversions
   API events, or simply evaluated by hand at this volume.
4. Update `datenschutz.html` to name this processing (click IDs are personal data under
   the GDPR when combined with a contact request). Lawyer check.

What this gives up: view-through conversions, remarketing audiences and automated
bidding on on-site behaviour. At a B2B lead volume of a few per month, that loss is
small; the privacy promise is a selling point to the research-buyer audience.

## 7. GEO (generative engine optimisation)

Goal: when a DACH marketer asks an AI assistant "Welche Marktforschung in Wien für
Brand Tracking?" or "how do I know if my awareness increase is real?", alpha-metrics.ai
is named or cited.

**What drives citation** (current understanding; this field moves fast, so the monthly
monitor in 7.3 is the real test):
1. Being a clear, consistent **entity**: same name, description, location and founder
   across site schema, LinkedIn, Google Business Profile, directories.
2. **Citable passages**: short, self-contained definitions and numeric statements with
   a source, near the top of a page.
3. **Original data** that others quote (pulse studies), because assistants prefer
   primary sources.
4. **Third-party mentions** in trade media, directories, university pages, podcasts.
5. **Crawl access** for AI crawlers, and Bing indexing (ChatGPT search and Copilot rely
   on it).

### 7.1 Technical actions
- Keep `robots.txt` open (it is). Decide explicitly on `Google-Extended`,
  `GPTBot`, `ClaudeBot`, `PerplexityBot`: recommended "allow" for a firm that wants to
  be cited.
- Add `/llms.txt` (draft in `marketing/llms.txt.draft`, copy to the site root when the
  `/de/` pages exist).
- Structured data as in 5.3; `Person` entity for the founder with academic `sameAs`.
- Bing Webmaster Tools + IndexNow on publish.

### 7.2 Content actions
- A glossary with 30 definitions (DE and EN), each answer in the first sentence.
- "Was die Stichprobe trägt" study pages with a summary table and a citation line
  ("Quelle: alpha-metrics.ai DACH Brand Pulse, n=…, Feldzeit …").
- Comparison pages that assistants like to synthesise: "Brand tracking vs. ad-hoc
  study", "Online panel vs. synthetic respondents".

### 7.3 Monitoring
The `geo-monitor` skill keeps a fixed set of 20 prompts (`marketing/geo-prompts.csv`).
Once a month they are run in ChatGPT, Perplexity, Gemini, Copilot and Claude (by hand
or via each provider's API if keys are configured), and results are logged:
mentioned yes/no, cited URL, competitors named, sentiment. KPI: share of prompts with a
mention or citation.

## 8. Flagship asset: the DACH Brand Pulse

A short quarterly online survey (n of about 500 to 1,000 per country, panel-fielded,
10 minutes) on a topical marketing question, analysed with the same Standards.
Results become: one study page (SEO/GEO), one press release, a LinkedIn carousel, a
newsletter issue, a webinar. It is the single best way to create the original data that
journalists, LinkedIn and AI assistants cite. Panel cost needs quotes (budget line
below is a placeholder). Topics for the first four waves:
1. Q1: Which brands do Austrians trust with their data? (awareness + trust funnel)
2. Q2: Price vs. brand: switching intent in groceries AT vs DE
3. Q3: Do consumers notice AI-generated advertising, and does it matter?
4. Q4: Christmas consideration sets: retail brand funnel AT/DE/CH

## 9. Automation with Claude

### 9.1 Principle
Claude drafts, checks and reports; **a human approves and publishes**. Nothing is posted
to LinkedIn or pushed live to Google Ads automatically. Reasons: UWG liability for
claims, the brand's promise of precision, and LinkedIn's API terms for automated
posting.

### 9.2 Components (in this repo)
| Type | Name | Job |
|---|---|---|
| Agent | `content-strategist` | Picks the week's topics from the calendar, keywords and recent performance; writes briefs |
| Agent | `linkedin-writer` | Drafts founder posts, carousels, newsletter issues in DE/EN |
| Agent | `seo-writer` | Drafts hub articles and service pages with FAQ and schema |
| Agent | `ads-strategist` | Google/Microsoft RSA copy, LinkedIn ad copy, negative keyword reviews, Ads Editor CSV |
| Agent | `geo-auditor` | Audits pages for entity consistency, citable passages, schema, llms.txt |
| Agent | `claim-checker` | Read-only reviewer: statistics, brand voice, UWG, GDPR, synthetic-data labels. Every draft passes it |
| Skill | `/content-sprint` | Weekly pipeline: strategist → writers → claim-checker → drafts folder + summary |
| Skill | `/linkedin-post` | One post on demand from a topic, chart or article |
| Skill | `/seo-article` | One article on demand from a keyword |
| Skill | `/search-ads` | RSA sets, negatives from a search-terms export |
| Skill | `/geo-monitor` | Monthly AI-visibility check and log |
| Skill | `/performance-review` | Monthly report from exported LinkedIn/Ads/Search Console CSVs |
| Workflow | `.github/workflows/content-sprint.yml` | Runs `/content-sprint` every Monday 06:00 Vienna and opens a pull request with the drafts |

The installed **marketing plugin** skills complement these: `marketing:seo-audit`,
`marketing:campaign-plan`, `marketing:brand-review`, `marketing:email-sequence`,
`marketing:performance-report`.

### 9.3 Weekly loop
```
Mon 06:00  GitHub Action runs /content-sprint  → PR "Content sprint KW xx"
Mon        Founder reviews PR (15-30 min), edits, merges into the marketing repo
Tue/Thu    Founder posts on LinkedIn (native scheduler or Buffer); comments 20 min/day
Biweekly   Article published on /de/wissen/ → IndexNow
Weekly     Export Ads search terms → /search-ads review-negatives
Monthly    /geo-monitor, /performance-review → plan adjustments
```

### 9.4 Optional connectors
Zapier (configured in this account, but it failed to connect in this session), Notion,
Google Sheets and Gmail are available as MCP connectors in Claude. Useful extensions:
log leads to a Google Sheet, push approved posts to Buffer via Zapier, put the calendar
in Notion. Add them once the manual loop works.

## 10. 90-day roadmap

| Weeks | Focus | Deliverables |
|---|---|---|
| 1-2 | Gates and foundations | G1-G5 resolved; LinkedIn profiles finished; Search Console, Bing WMT, Google Business Profile; UTM convention; private marketing repo |
| 3-4 | German site core | `/de/` home + 4 service pages + glossary (10 terms); schema; llms.txt; first 2 hub articles |
| 3-12 | LinkedIn organic | 2 posts/week, daily commenting, newsletter from week 6 |
| 5 | SEA launch | S1-S4 live with negatives; measurement per 6.4 |
| 6 | Lead magnet | "12 Fragen an Ihren Marktforschungs-Dienstleister" checklist (PDF) |
| 7 | LinkedIn ads | Thought Leader + Document Ads, AT |
| 8 | First review | Kill or keep ad groups; GEO baseline; content performance |
| 6-12 | Pulse study #1 | Questionnaire, field, analysis, study page, press release, webinar (week 12) |

Content calendar for weeks 1-13: `marketing/content-calendar.csv`.

## 11. KPIs and targets

Targets are starting hypotheses for a new domain with no history; reset them after the
week-8 review using real baselines.

| Level | KPI | Source | 90-day target |
|---|---|---|---|
| Business | Qualified conversations (call booked with fitting company) | Form + CRM sheet | 8 |
| Business | Proposals sent / won | CRM sheet | 4 / 1 |
| LinkedIn | Founder followers in target segments | LinkedIn analytics | +400 |
| LinkedIn | Median engagement rate per post | LinkedIn analytics | > 3% |
| SEO | Non-brand clicks per month (DE pages) | Search Console | 150 by month 3 |
| SEO | Top-10 rankings for cluster 1-2 keywords | Search Console | 5 |
| SEA | Cost per qualified lead | Ads + CRM | < EUR 250 (test) |
| SEA | Share of irrelevant search terms | Search terms report | < 15% after week 4 |
| GEO | Prompts with mention/citation | geo-monitor log | baseline, then +25% |
| Authority | Referring domains / trade-media mentions | Search Console, manual | 10 / 2 |

## 12. Budget (first 3 months, indicative)

| Item | Per month | Note |
|---|---|---|
| Google Ads + Microsoft Ads | EUR 1,600 | test budget, cut after week 8 |
| LinkedIn Ads (from week 7) | EUR 900 | |
| Claude API for automation | low double digits | depends on runs and model; check Anthropic console |
| Pulse study panel cost | placeholder EUR 3,000-6,000 per wave | get panel quotes |
| Design (carousels, PDF) | own time / Canva | |
| Memberships (VMÖ, ESOMAR) | per fee schedule | optional, check |

## 13. Governance and risk

- **Two-person rule light**: nothing is published that `claim-checker` flagged red;
  the founder signs off everything.
- **Synthetic data**: every ZINTO figure, in every format, is labelled "fiktive Marke,
  synthetische Daten / fictional brand, synthetic data".
- **Client data**: never in content without written permission (README rule).
- **UWG**: no unprovable superlatives; comparative statements only verifiable ones.
- **GDPR**: no tracking pixels without a decision under G2; LinkedIn lead-gen forms
  name alpha-metrics.ai as controller and link the privacy notice.
- **AI disclosure**: content is drafted with AI support and edited by a person; say so
  where a platform or client asks.
