---
name: search-ads
description: Build or review alpha-metrics.ai paid search. Modes "build <ad group>" creates RSA headlines, descriptions, assets and an Ads Editor CSV; "review-negatives <export.csv>" classifies a Google/Microsoft Ads search-terms export and proposes negatives; "linkedin <objective>" drafts LinkedIn ad copy and targeting.
---

# Search ads

Delegate the work to the `ads-strategist` subagent with the mode and inputs below,
then send its output to `claim-checker`.

## build <ad group>
- Ad groups and budgets: plan section 6.1. Keywords: `marketing/keywords.csv`.
- Verify character limits with a script, for example:
  `python3 -c "import csv,sys;[print(len(c),c) for r in csv.reader(open(sys.argv[1])) for c in r[3:22]]" file.csv`
- Output `marketing/drafts/ads/<adgroup>.md` and `<adgroup>.csv`.

## review-negatives <export.csv>
- Input: a search-terms report exported from Google or Microsoft Ads, saved under
  `marketing/reports/`.
- Output: `marketing/reports/negatives-<date>.md` with three tables (add as negative,
  add as keyword, watch) and a copy-paste negative list. Report the share of spend on
  irrelevant terms (KPI target below 15%).

## linkedin <objective>
- Objectives: thought-leader (boost a named post), document (lead magnet), retarget
  (only if gate G2 allows it). Output targeting, copy, budget, kill/keep rule.

Never log in to or change live ad accounts.
