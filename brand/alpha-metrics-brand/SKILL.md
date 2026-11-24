---
name: alpha-metrics-brand
description: The alpha-metrics.ai visual identity and house style — logo files, colours, fonts, chart style, layout and writing voice — with ready helpers for Word, PowerPoint, matplotlib/plotly and HTML. Use this skill whenever you make anything for or about alpha-metrics.ai (the Vienna market-research consultancy) or for Arne Floh's consulting work - reports, proposals, letters, one-pagers, slide decks, dashboards, charts, blog posts, LinkedIn graphics, web pages, email signatures - even when the user just says "in our design", "on-brand", "with our logo", "in the alpha-metrics style" or "make it look like the website", and also when restyling an existing document or deck to match the brand.
---

# alpha-metrics.ai brand

alpha-metrics.ai is a market-research consultancy in Vienna ("Where science meets business"). The look is
**calm, editorial and precise**: warm off-white pages, a deep blue, a serif for headlines, a plain sans for
everything else, and charts that highlight one thing in blue and leave the rest grey. Nothing shouts. The
credibility comes from clear numbers with their uncertainty shown, not from decoration.

Everything you need is in this folder:

| Path | What it is |
|---|---|
| `assets/logo/` | Logo files, SVG and PNG (see "Logo" below) |
| `assets/tokens.json` | Every colour, font and contact detail, machine-readable |
| `assets/brand.css` | Tokens + base styles for HTML (light and dark), ready to paste |
| `scripts/am_brand.py` | Python helpers: chart style, Word documents, PowerPoint decks |
| `references/voice.md` | Writing voice and how to report numbers. Read it before writing copy |
| `references/media.md` | Detailed recipes per medium (slides, documents, dashboards, blog, social) |

Read `references/media.md` for the medium you are producing before you start. It is short and saves rework.

## Logo

The logo is a rounded **dark-blue tile with a white α**, followed by the lowercase wordmark
**alpha-metrics.ai** in a bold serif. Always write the name in lowercase, with the `.ai`.

| Need | File (`assets/logo/`) |
|---|---|
| Light background (default) | `alpha-metrics-logo.svg` / `alpha-metrics-logo-1200.png` |
| Dark background | `alpha-metrics-logo-dark.svg` / `-logo-dark-1200.png` (light-blue tile, dark α, light-blue wordmark) |
| Small square spaces: favicon, avatar, slide footer | `alpha-metrics-mark.svg` / `-mark-512.png`, dark: `-mark-dark` |
| Title page, cover, closing slide | `alpha-metrics-tagline.svg` (wordmark + "Where science meets business"), dark: `-tagline-dark` |
| On photos or coloured fills | `alpha-metrics-white.svg` / `-white-1200.png` |
| One-colour print, fax, stamp | `alpha-metrics-ink.svg` / `-ink-1200.png` |

Rules, and why: keep clear space of at least one tile-width around the logo so it reads as a sign, not as
text; never stretch, recolour, outline, add shadows or rebuild it from a font (the letters are outlines of a
specific serif); use the dark version on anything darker than mid-grey. Minimum size: 20 px / 6 mm tall for
the full logo, 16 px for the mark. Prefer SVG in HTML; use PNG in Office files (python-docx and python-pptx
cannot place SVG).

## Colour

Light (default) — from `tokens.json` → `colors.light`:

| Role | Hex | Use |
|---|---|---|
| Brand blue | `#104281` | Logo, H1 in documents, big numbers, the darkest ramp step |
| Action blue | `#1c5cab` | Links, buttons |
| Highlight | `#2a78d6` | The one series or bar you want the reader to look at; accent rules |
| Context grey | `#8f8d86` | All other series |
| Ink | `#0e1a2b` | Headings and main text |
| Ink 2 / Ink 3 | `#475467` / `#5c6679` | Body copy / captions, labels, sources |
| Page / card / tint | `#fbfaf8` / `#ffffff` / `#f3f1ec` | Backgrounds, panels |
| Hairline / grid | `#e3e1db` | Borders, rules, gridlines |
| Ordered ramp | `#86b6ef #5598e7 #2a78d6 #1c5cab #104281` | Ordered categories (low → high, funnel stages, Likert) |
| Good / bad | `#0ca30c` / `#d03b3b` | Signed changes only; never as decoration |

Dark (dark slides, dark-mode dashboards): page `#121211`, title slides `#0d1828` (navy), ink `#f2f1ec`,
brand `#9cc3f3`, highlight `#3987e5`, context grey `#7f7e77`; full set in `tokens.json` → `colors.dark`.

Blue is the only brand hue. Keep a page mostly neutral and let blue mark what matters; a page that is blue
everywhere loses the signal. Do not introduce new accent colours (no orange, purple, teal). If a client's
own colours are needed in a chart (e.g. competitor brands), that is a client deliverable — say so and agree
the palette rather than mixing it into the house style.

## Type

| Role | Office (Word, PowerPoint) | Google Docs / Slides | Web (CSS stack in `brand.css`) |
|---|---|---|---|
| Headlines, titles, big numbers | **Palatino Linotype**, bold | Gelasio | Iowan Old Style → Palatino → Georgia |
| Body, labels, tables, charts | **Segoe UI** | Inter | system-ui → Segoe UI → Roboto → Arial |

Sentence case for every heading and title ("How one brand turns awareness into purchase", not Title Case).
Small caps-like kickers are uppercase sans with wide letter-spacing (`MARKET RESEARCH · VIENNA`). Use
tabular figures for numbers in tables. Never load Google Fonts on a web page for the house style — the site
deliberately uses system fonts.

## Charts (the most recognisable part of the style)

1. **Title = the finding**, as a sentence, in the serif ("ZINTO trails the category leader by 15 points").
   The subtitle says exactly what is measured and in what unit.
2. **Highlight one thing**: the focal brand/series in highlight blue `#2a78d6`, everything else context grey.
   Use `am.focus(labels, "ZINTO")`. For ordered categories use the blue ramp (`am.palette(n)`).
3. **Show uncertainty**: confidence intervals as thin dark error bars (`error_kw=am.err_kw()`) or a light
   band; state the level (95%).
4. **Always a base line**: `Base: all respondents, Austria, n = 1,003. Source: …`. Put it in exactly one
   place: inside the PNG with `am.source` for standalone images and documents without captions; in the
   slide's source footer on slides; in the `figcaption` on web pages. Never twice.
5. **Don't repeat the headline.** On a slide (or under a heading) that already states the finding, call
   `am.title(ax, None, "what is measured")` so the chart carries only the measure line.
6. Minimal ink: no top/right/left spines, light gridlines on the value axis only, no 3D, no pie charts with
   more than three slices, direct labels instead of legends where possible. Horizontal bars for brand lists,
   sorted by value unless the order means something.
7. Axis labels state the full measure ("Share of aware respondents who noticed the brand there, multiple
   answers"), and percentages carry `%`; changes are in "pp" (percentage points), with a real minus sign `−`.

```python
import sys; sys.dont_write_bytecode = True; sys.path.insert(0, "<this skill>/scripts")
import am_brand as am
import matplotlib.pyplot as plt
am.use_matplotlib()                      # transparent PNG, house fonts and colours
fig, ax = plt.subplots()
ax.barh(labels, values, xerr=ci, color=am.focus(labels, "ZINTO"), error_kw=am.err_kw())
am.title(ax, "ZINTO is known by fewer than half of Austrians", "Aided awareness, % of respondents, 95% CI")
am.source(ax, "Base: all respondents, n = 1,003.")
fig.savefig("awareness.png")
```

Charts are transparent with dark text, so they suit light pages and slides. For a dark slide or a
dark-mode web page, render a second version with `am.use_matplotlib(dark=True)` (see `media.md`, Dashboards
and Blog, for swapping light/dark images).

For plotly: `am.plotly_template()` registers and activates the `alpha_metrics` template. For HTML/JS charts,
read the colours from the CSS variables in `brand.css` (`--mark`, `--mark-dim`, `--ramp-1…5`, `--grid`).

## Working with the helpers

`scripts/am_brand.py` builds the house layouts so you do not redraw them each time:

- **Word**: `am.docx_new(title, subtitle)` → A4, house fonts and colours, logo in the header, footer with name,
  city, email and page number. `am.docx_letter(recipient, subject, paragraphs)` for letters.
  `am.docx_table(doc, rows, num_cols=(1, 2), widths_cm=[...])` for tables, `am.docx_apply(doc)` to restyle
  an existing document.
- **PowerPoint** (16:9): `am.pptx_new()`, then `slide_title`, `slide_section`, `slide_content`,
  `slide_kpis`, `slide_chart`, `slide_closing`. Each content slide gets the mark, the name, an optional
  source line and the slide number in the footer.
- **Charts**: `use_matplotlib`, `title`, `source`, `focus`, `palette`, `err_kw`, `plotly_template`.
- `am.logo(kind, dark)` returns the right logo path; `am.C`, `am.D` are the colour dicts.

Install what you need (`pip install python-docx python-pptx matplotlib`). If the helpers do not fit — another
language, Google Slides, Canva, Figma — apply the same tokens by hand from `tokens.json`. If you are working
with a `docx`, `pptx` or `xlsx` skill, use that skill for the file mechanics and this one for the look.

Import with `sys.dont_write_bytecode = True` (as above) so Python does not write a `__pycache__` folder
into the skill.

Fonts: Palatino Linotype and Segoe UI ship with Windows and Office. On machines without them (Linux
containers, some Macs) previews and charts fall back to a similar serif and Inter/Arial; serifs may run wider,
so leave headline room. The delivered .docx/.pptx still name the house fonts and look right on the
recipient's Windows/Office machine. Say so when you hand over files rendered without the real fonts.

After building any visual file, render it (e.g. LibreOffice → PDF → PNG) and look at it before handing it
over: check that text does not overflow, the logo is the right version for the background, and charts are sharp.

## Before you hand anything over

- Name written `alpha-metrics.ai` (lowercase), logo version matches the background, clear space respected.
- Only blue + neutrals; highlight used for one thing per chart/slide.
- Serif for headlines, sans for everything else, sentence case.
- Every number that comes from a sample has its base (n) and, where it matters, its interval.
- Copy follows `references/voice.md`: plain, specific, British spelling, no hype.
- Footer/contact details: info@alpha-metrics.ai · alpha-metrics.ai · Vienna.
