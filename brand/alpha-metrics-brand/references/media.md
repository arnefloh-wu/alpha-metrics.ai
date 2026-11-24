# Recipes per medium

Contents: Slides · Documents · Dashboards · Blog posts and web pages · Social and small graphics · Email signature

## Slides

16:9. Build with `am.pptx_new()` and the `slide_*` helpers, or reproduce these layouts in other tools.

- **Title slide**: navy `#0d1828` background, dark logo top left, serif title (40–44 pt) in off-white
  `#f2f1ec`, subtitle in light blue `#9cc3f3`, date or tagline small and grey at the bottom.
- **Section divider**: page `#fbfaf8`, short highlight-blue rule, uppercase kicker ("PART 2"), serif title.
- **Content slides**: page `#fbfaf8`; headline in the serif (26–30 pt) that states the message as a full
  sentence; body in the sans at 18–20 pt; at most five bullets of one line each. Footer: mark, name, source
  line, slide number. Keep a 0.6 in margin.
- **Numbers**: `slide_kpis` — up to four white cards, big serif value in brand blue, label above, interval or
  base below.
- **Charts**: one chart per slide, made with `use_matplotlib()` (transparent background), the headline says
  the finding, the source line carries the base. An optional takeaway column on the right.
- **Closing**: navy, the mark, a short line ("Thank you", "Questions"), contact in light blue.
- Put details the presenter needs in speaker notes (`notes=`), not on the slide.
- One idea per slide. If a slide needs more than ~40 words, split it.

## Documents (reports, proposals, letters, one-pagers)

Build with `am.docx_new()`; restyle existing ones with `am.docx_apply(doc)`.

- A4, margins 2.3 cm left/right. Logo (light version, ~6 mm tall) top left in the header. Footer:
  `alpha-metrics.ai · Vienna · info@alpha-metrics.ai` and page number, grey 8 pt.
- Title: serif 28 pt ink; subtitle sans 13 pt grey. H1: serif 18 pt brand blue. H2: serif 14 pt ink.
  H3: sans 11.5 pt bold. Body: Segoe UI 10.5 pt, line spacing 1.25.
- Tables: no vertical lines; bold header with a dark rule underneath; hairlines between rows; numbers right
  aligned; a caption line with base and source below (`am.docx_table(..., note=...)`).
- Charts at full text width (16 cm), PNG at 220 dpi from `use_matplotlib()`.
- Cover page for longer reports: tagline logo, title, subtitle, client name, date; plenty of white space.
- Letters: `am.docx_letter(...)` — logo top left, sender block small and grey top right, recipient, date,
  subject in bold, body, signature. Keep to one page.
- PDF delivery: convert from Word; check that fonts embedded (Palatino Linotype, Segoe UI).

## Dashboards

- Use `assets/brand.css` (light by default, dark via `prefers-color-scheme` or `data-theme="dark"`).
- Header: logo (swap light/dark with `.logo-light` / `.logo-dark`), dashboard title in the serif.
- KPI row: `.card .kpi` with label, big serif value, interval and base (`.ci`, `.base`); deltas with
  `.delta-up` / `.delta-down` and a sign (+6 pp / −4 pp).
- Charts: light and dark versions as for blog posts (below) if the dashboard supports dark mode.
- Charts: highlight blue for the focal series, grey for others, ramp for ordered categories, gridlines
  `--grid`, tooltips on a card background. Every chart has a one-line source/base under it.
- Filters as quiet controls (tint background, hairline border); never more than one accent colour.
- Label synthetic or demo data visibly ("Fictional brand · synthetic data" chip).
- Python dashboards (Streamlit, Dash, plotly): `am.plotly_template()`; set the app's primary colour to
  `#1c5cab`, background `#fbfaf8`, text `#0e1a2b`, font "Segoe UI, Inter, system-ui, sans-serif".

## Blog posts and web pages

- Use `brand.css`; wrap the article in `.prose` (max ~720 px). Kicker above the H1 (category · date),
  lede paragraph in `.lede`, H2s in the serif, pull quotes as `blockquote` (blue left rule, serif).
- One hero chart or image, not a stock photo. Figures with `figcaption` carrying base and source (so
  leave `am.source` out of the PNG).
- Dark mode: render the chart twice (`use_matplotlib()` and `use_matplotlib(dark=True)`) and show the
  right one with the same classes the logo uses, which follow both the system setting and a forced
  `data-theme`:
  `<img class="logo-light" src="chart.png" alt="…"><img class="logo-dark" src="chart-dark.png" alt="">`
- End with a short "What this means for you" and a quiet call to action (a `.btn` linking to contact).
- Meta/OG image: 1200 × 630, navy background `#0d1828`, dark logo top left, serif headline in off-white,
  one highlight-blue element (like the site's social card).

## Social and small graphics

- LinkedIn post image 1200 × 1200 or 1200 × 627: page or navy background, serif headline (the number or
  finding), one simple chart in the house style, mark bottom right, base line in small grey.
- Profile picture: `alpha-metrics-mark-512.png`.
- Banner (1584 × 396): navy, dark tagline logo left, plenty of space.

## Email signature

```
Arne Floh
alpha-metrics.ai · Market research · Vienna
info@alpha-metrics.ai · alpha-metrics.ai
```
Plain text or with the mark (`alpha-metrics-mark-512.png` at 32 px). No quotes, no banners.
