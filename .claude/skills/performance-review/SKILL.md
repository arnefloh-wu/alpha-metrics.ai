---
name: performance-review
description: Monthly marketing performance review for alpha-metrics.ai from exported CSVs (LinkedIn analytics, Google/Microsoft Ads, Search Console, lead sheet, GEO log). Computes the KPIs in the communication plan, separates signal from noise, and proposes next month's changes to the content calendar and budgets.
---

# Performance review

Inputs: CSV/XLSX exports placed in `marketing/reports/<yyyy-mm>/` (LinkedIn posts and
followers, Google Ads campaigns + search terms, Microsoft Ads, Search Console queries
and pages, `leads.csv` with date, source, utm_campaign, qualified yes/no, stage).

1. Inventory the files and state which KPIs from plan section 11 can and cannot be
   computed this month.
2. Compute per KPI: value, previous month, target. Use Python (pandas) via Bash.
3. Be honest about uncertainty: for rates, give Wilson 95% intervals and the base;
   do not declare a winner between posts, ads or keywords on small bases; with a few
   leads a month, look at the direction over three months, not one.
4. Content: top and bottom 3 LinkedIn posts by engagement rate and by profile visits;
   pillar and format averages with n.
5. Paid: cost per qualified lead per campaign; wasted spend on irrelevant terms;
   kill/keep proposals per ad group.
6. SEO/GEO: queries gaining impressions, pages close to top 10 (positions 8-20),
   GEO mention rate trend.
7. Write `marketing/reports/<yyyy-mm>-review.md`: one-paragraph summary, KPI table,
   five recommended changes, and the exact edits proposed to
   `marketing/content-calendar.csv` (do not apply them without the user's OK).

The `marketing:performance-report` skill can render a stakeholder version afterwards.
