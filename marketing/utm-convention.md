# UTM convention

All lower case, hyphens, no spaces. Build links with this pattern:

`https://alpha-metrics.ai/de/<page>/?utm_source=<source>&utm_medium=<medium>&utm_campaign=<campaign>&utm_content=<content>`

| Parameter | Values |
|---|---|
| utm_source | linkedin, google, bing, newsletter, pr-<outlet>, directory-<name> |
| utm_medium | organic-social, paid-social, cpc, email, referral |
| utm_campaign | <yyyy>-q<n>-<topic>, e.g. 2026-q4-brand-tracking, 2027-q1-pulse-1 |
| utm_content | post-<yyyymmdd>, rsa-<adgroup>, tla-<post-id>, doc-<asset> |

Google Ads: set the tracking template once at account level
`{lpurl}?utm_source=google&utm_medium=cpc&utm_campaign={_campaign}&utm_content={adgroupid}`
and keep auto-tagging on so `gclid` is appended (captured by the form, see plan 6.4).
