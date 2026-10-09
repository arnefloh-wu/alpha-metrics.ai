# alpha-metrics.ai

Website of alpha-metrics.ai, a market research practice in Vienna: brand tracking,
consumer surveys and decision-ready analytics for brands in Austria and the DACH
region. Live at [alpha-metrics.ai](https://alpha-metrics.ai).

The site is static: plain HTML, CSS and JavaScript, no build step, no dependencies.

## Structure

| Path | What it is |
|---|---|
| `index.html` | The single page: services, approach, showcase, standards, about, contact |
| `css/site.css` | Styles, with validated light and dark colour tokens |
| `js/charts.js` | The showcase charts (plain DOM, tooltips, table views) |
| `js/data.js` | Figures for the charts. **Generated**, do not edit by hand |
| `js/site.js` | Menu, theme toggle, scroll reveal, contact form |
| `js/theme-init.js` | Restores the saved theme before first paint |
| `showcase/dashboard.html` | Demo dashboard, German interface. **Generated** |
| `impressum.html`, `datenschutz.html` | Legal pages (drafts, see below) |
| `assets/logo/` | The logo: wordmark in dark blue, light blue, white and one colour, plus a lockup with the line "Where science meets business". **Generated** |
| `tools/` | Scripts that regenerate `js/data.js`, the demo dashboard and the logo files (`make_logo.py`) |
| `CNAME`, `.nojekyll`, `robots.txt`, `sitemap.xml`, `404.html` | Hosting files |

## The showcase is synthetic

The showcase case study uses **ZINTO, a fictional brand, and synthetic data**. The
figures were generated and then analysed with the same pipeline that is used for real
studies, so the page can show the whole workflow without exposing a client. Every
chart is labelled accordingly. Do not replace these figures with real client results
without the client's written permission.

To regenerate the figures, run the case-study builder of the research pipeline, then:

```
python3 tools/make_data.py <builder output folder>
python3 tools/make_demo_dashboard.py <builder output folder>
```

Both scripts stop with an error if an expected figure or phrase is missing, instead of
publishing something half right.

## Design notes

- **Charts.** Emphasis charts use one accent against neutral grey. Ordered categories
  (funnel stages, age bands) use a one-hue ramp. All ramps were checked with the
  data-visualisation palette validator in light and dark mode, and text and mark
  contrast was computed, not judged by eye. Every chart has a table view.
- **Privacy by construction.** No cookies, no analytics, no third-party fonts, scripts or
  images. A Content-Security-Policy meta tag enforces this; the only allowed outside
  request is the contact form post to Formspree. System fonts are used throughout.
- **Accessibility.** Skip link, semantic headings, keyboard-focusable chart marks with
  the same tooltip as hover, reduced-motion support, light and dark themes.

## Hosting (GitHub Pages)

1. Repository **Settings, Pages**: deploy from branch `main`, folder `/ (root)`.
2. The `CNAME` file keeps the custom domain `alpha-metrics.ai`. Tick *Enforce HTTPS*.
3. DNS at the domain provider:
   - Apex `alpha-metrics.ai`: four `A` records `185.199.108.153`, `185.199.109.153`,
     `185.199.110.153`, `185.199.111.153`.
   - `www`: a `CNAME` record pointing to `arnefloh-wu.github.io`.

## Before the site is promoted

- Complete the red fields in `impressum.html` and `datenschutz.html` and have a lawyer
  review both. Austrian law requires an Impressum on a commercial website.
- Confirm the data processing agreement with Formspree and name the DNS provider in the
  privacy notice if it processes visitor data.
- Read the six rules in the Standards section and confirm that they describe how the
  company actually works. They are promises to clients.
