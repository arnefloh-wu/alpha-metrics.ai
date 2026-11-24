# AI advertising effectiveness research toolkit

Reusable template for comparing two advertising messages using aggregate ad-day reporting. Independent consulting, not an official platform integration.

## Protocol (complete before launch)

- Decision, market, campaign eligibility and client approval.
- Primary hypothesis: difference in CTR between A and B; headline as the manipulated factor.
- Confirm whether native randomized allocation is actually available. If not, label the study quasi-experimental.
- Fix the campaign objective, creative assets other than headline, contextual hints, schedule, budget split and stopping rule. Disable automatic creative changes if supported. Record all deviations.
- Assess power under explicit CPM and baseline CTR assumptions; avoid treating impressions as independent users.
- Primary outcome: clicks / impressions. Secondary: CPC and CPM; conversions and revenue only if valid tracking is available.
- Preserve original exports securely outside this public repository. Normalize daily reports into the schema below; never commit client data, identifiers, credentials or unapproved case studies.

## Run the synthetic example

From this directory, with R installed:

```sh
Rscript analyse.R synthetic_daily.csv output
```

The CSV is fabricated and is not a platform benchmark. The script produces a daily CSV, treatment summary, text model report and a PNG comparison chart. It uses base R only. For real data, map exported field names explicitly to the normalized schema and use a private working directory. Do not add real input or outputs to the repository.

| Column | Meaning |
|---|---|
| day | Reporting date or fixed test-day identifier |
| treatment | A or B |
| impressions | Non-negative integer |
| clicks | Non-negative integer, no greater than impressions for this model |
| spend_eur | Non-negative media spend in EUR |

One row per treatment and day; check missing days and mismatched reporting time zones. If platform click definitions do not support a binary impression outcome, do not use the binomial model.

## Interpretation

Report counts, spend, CTR, absolute difference, relative uplift and delivery imbalance. Wilson intervals and grouped logistic regression are nominal independent-impression calculations, not user-level inference. Day-adjusted models are sensitivity checks, not a substitute for randomization. No verified randomization means the analysis cannot establish a causal effect; repeated impressions and algorithmic selection may invalidate nominal p-values and intervals. A conversion rate among clickers is conditional on a post-exposure event. Keep organic AI visibility research separate from paid placements.
