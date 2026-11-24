"""alpha-metrics.ai brand helpers for charts, Word documents and PowerPoint decks.

Import it from anywhere:

    import sys; sys.path.insert(0, "<skill folder>/scripts")
    import am_brand as am

Charts      am.use_matplotlib(), am.source(ax, "..."), am.plotly_template()
Word        doc = am.docx_new(); am.docx_table(doc, rows); doc.save(...)
            am.docx_apply(existing_doc) restyles a document you already have
PowerPoint  prs = am.pptx_new(); am.slide_title(prs, ...); am.slide_content(...)
            am.slide_chart(...), am.slide_kpis(...), am.slide_section(...),
            am.slide_closing(...); prs.save(...)

Each part imports its library only when used, so the chart helpers work
without python-docx and the other way round. Needs: matplotlib and/or plotly,
python-docx, python-pptx, as used.
"""
import json
from pathlib import Path

HERE = Path(__file__).resolve().parent
ASSETS = HERE.parent / "assets"
TOKENS = json.loads((ASSETS / "tokens.json").read_text(encoding="utf-8"))

C = TOKENS["colors"]["light"]          # colours for light backgrounds
D = TOKENS["colors"]["dark"]           # colours for dark backgrounds
RAMP = C["ramp"]                       # ordered categories, light to dark
SERIF = TOKENS["fonts"]["serif"]["office"]
SANS = TOKENS["fonts"]["sans"]["office"]
NAME, TAGLINE = TOKENS["name"], TOKENS["tagline"]
CONTACT = TOKENS["contact"]


def logo(kind="logo", dark=False, fmt="png"):
    """Path to a logo file. kind: logo | mark | wordmark | tagline | white | ink."""
    base = {"logo": "alpha-metrics-logo", "mark": "alpha-metrics-mark", "wordmark": "alpha-metrics",
            "tagline": "alpha-metrics-tagline", "white": "alpha-metrics-white", "ink": "alpha-metrics-ink"}[kind]
    if dark and kind in ("logo", "mark", "wordmark", "tagline"):
        base += "-dark"
    if fmt == "svg":
        return ASSETS / "logo" / (base + ".svg")
    size = "512" if kind == "mark" else "1200"
    return ASSETS / "logo" / ("%s-%s.png" % (base, size))


# ---------------------------------------------------------------- charts

def palette(n, dark=False):
    """n colours from the blue ramp for ORDERED categories (1 to 5)."""
    ramp = (D if dark else C)["ramp"]
    picks = {1: [2], 2: [0, 4], 3: [0, 2, 4], 4: [0, 1, 3, 4], 5: [0, 1, 2, 3, 4]}[n]
    return [ramp[i] for i in picks]


def focus(labels, highlight, dark=False):
    """One colour per label: the highlighted one(s) in brand blue, the rest grey."""
    t = D if dark else C
    hs = {highlight} if isinstance(highlight, str) else set(highlight)
    return [t["mark"] if l in hs else t["mark_dim"] for l in labels]


def use_matplotlib(dark=False, background=None):
    """Apply the house chart style to matplotlib (call before plotting).
    dark=True for dark slides or pages. background=None saves transparent PNGs."""
    import matplotlib as mpl
    t = D if dark else C
    bg = background or "none"          # transparent by default: sits on any page or slide
    mpl.rcParams.update({
        "font.family": "sans-serif",
        "font.sans-serif": [SANS, "Inter", "Helvetica Neue", "Arial", "DejaVu Sans"],
        "font.serif": [SERIF, "Palatino", "Book Antiqua", "Georgia", "DejaVu Serif"],
        "font.size": 10.5,
        "text.color": t["ink"],
        "axes.labelcolor": t["ink_2"],
        "axes.titlesize": 14, "axes.titleweight": "bold", "axes.titlelocation": "left",
        "axes.titlepad": 14, "axes.titlecolor": t["ink"],
        "axes.labelsize": 10,
        "axes.edgecolor": t["hair"],
        "axes.facecolor": bg, "figure.facecolor": bg, "savefig.facecolor": bg,
        "axes.spines.top": False, "axes.spines.right": False, "axes.spines.left": False,
        "axes.grid": True, "axes.grid.axis": "y", "axes.axisbelow": True,
        "grid.color": t["grid"], "grid.linewidth": 0.8,
        "xtick.color": t["ink_3"], "ytick.color": t["ink_3"],
        "xtick.major.size": 0, "ytick.major.size": 0,
        "axes.prop_cycle": mpl.cycler(color=[t["mark"], t["mark_dim"], t["ramp"][0], t["ink"], t["ramp"][4]]),
        "lines.linewidth": 2.2, "lines.solid_capstyle": "round",
        "patch.edgecolor": "none",
        "legend.frameon": False, "legend.fontsize": 9.5,
        "figure.dpi": 110, "savefig.dpi": 220, "savefig.bbox": "tight", "savefig.transparent": background is None,
        "errorbar.capsize": 0,
        "figure.figsize": (8, 4.5),
    })
    return t


def title(ax, text, subtitle=None):
    """Serif chart title that states the finding, with an optional grey subtitle."""
    import matplotlib as mpl
    ax.set_title("")
    ax.text(0, 1.12 if subtitle else 1.05, text, transform=ax.transAxes, ha="left", va="bottom",
            fontsize=15, fontweight="bold", family="serif", color=mpl.rcParams["text.color"])
    if subtitle:
        ax.text(0, 1.04, subtitle, transform=ax.transAxes, ha="left", va="bottom",
                fontsize=10, color=mpl.rcParams["xtick.color"])


def source(ax, text):
    """Grey source/base line under the chart, e.g. 'Base: all respondents, n = 1,003. Source: ...'."""
    import matplotlib as mpl
    ax.annotate(text, xy=(0, 0), xycoords="axes fraction", xytext=(0, -34), textcoords="offset points",
                ha="left", va="top", fontsize=8.5, color=mpl.rcParams["xtick.color"])


def plotly_template(dark=False, register=True):
    """A plotly template in the house style; registered as 'alpha_metrics' and made default."""
    t = D if dark else C
    tpl = {
        "layout": {
            "font": {"family": "Segoe UI, Inter, system-ui, Arial, sans-serif", "size": 13, "color": t["ink_2"]},
            "title": {"font": {"family": "Palatino Linotype, Palatino, Georgia, serif", "size": 20, "color": t["ink"]},
                      "x": 0, "xanchor": "left"},
            "paper_bgcolor": t["page"] if dark else "#ffffff",
            "plot_bgcolor": t["page"] if dark else "#ffffff",
            "colorway": [t["mark"], t["mark_dim"], t["ramp"][0], t["ink"], t["ramp"][4]],
            "xaxis": {"showgrid": False, "linecolor": t["hair"], "ticks": "", "tickcolor": t["hair"],
                      "tickfont": {"color": t["ink_3"]}, "zeroline": False},
            "yaxis": {"gridcolor": t["grid"], "zeroline": False, "ticks": "", "showline": False,
                      "tickfont": {"color": t["ink_3"]}},
            "legend": {"orientation": "h", "y": 1.08, "x": 0, "bgcolor": "rgba(0,0,0,0)"},
            "hoverlabel": {"bgcolor": t["card"], "bordercolor": t["hair"], "font": {"color": t["ink"]}},
            "margin": {"l": 60, "r": 24, "t": 72, "b": 60},
        }
    }
    if register:
        import plotly.io as pio
        import plotly.graph_objects as go
        pio.templates["alpha_metrics"] = go.layout.Template(tpl)
        pio.templates.default = "alpha_metrics"
    return tpl


# ---------------------------------------------------------------- Word

def _rgb(hexstr):
    from docx.shared import RGBColor
    return RGBColor.from_string(hexstr.lstrip("#").upper())


def _font(style, name, size=None, color=None, bold=None):
    from docx.oxml.ns import qn
    from docx.shared import Pt
    f = style.font
    f.name = name
    rpr = style.element.get_or_add_rPr()
    rfonts = rpr.find(qn("w:rFonts"))
    if rfonts is None:
        rfonts = rpr.makeelement(qn("w:rFonts"), {})
        rpr.append(rfonts)
    for a in ("w:ascii", "w:hAnsi", "w:cs", "w:eastAsia"):
        rfonts.set(qn(a), name)
    for a in ("w:asciiTheme", "w:hAnsiTheme", "w:cstheme", "w:eastAsiaTheme"):
        rfonts.attrib.pop(qn(a), None)
    if size: f.size = Pt(size)
    if color: f.color.rgb = _rgb(color)
    if bold is not None: f.bold = bold


def _page_field(paragraph):
    from docx.oxml import OxmlElement
    from docx.oxml.ns import qn
    run = paragraph.add_run()
    for kind, text in (("begin", None), (None, "PAGE"), ("end", None)):
        if kind:
            el = OxmlElement("w:fldChar"); el.set(qn("w:fldCharType"), kind)
        else:
            el = OxmlElement("w:instrText"); el.set(qn("xml:space"), "preserve"); el.text = text
        run._r.append(el)
    return run


def docx_apply(doc, header_logo=True, footer_text=None):
    """Restyle a python-docx Document in the house style: fonts, colours, A4, header, footer."""
    from docx.shared import Pt, Cm
    from docx.enum.text import WD_ALIGN_PARAGRAPH
    st = doc.styles
    _font(st["Normal"], SANS, 10.5, C["ink"])
    pf = st["Normal"].paragraph_format
    pf.space_after = Pt(6); pf.line_spacing = 1.25
    for name, size, color, before in (("Title", 28, C["ink"], 0), ("Subtitle", 13, C["ink_3"], 0),
                                      ("Heading 1", 18, C["brand"], 18), ("Heading 2", 14, C["ink"], 14),
                                      ("Heading 3", 11.5, C["ink"], 10)):
        try:
            s = st[name]
        except KeyError:
            continue
        serif = name in ("Title", "Heading 1", "Heading 2")
        _font(s, SERIF if serif else SANS, size, color, bold=name not in ("Subtitle",))
        s.font.italic = False
        s.paragraph_format.space_before = Pt(before)
        s.paragraph_format.space_after = Pt(6)
        s.paragraph_format.keep_with_next = True
        if name == "Title":   # drop Word's default border under the title
            ppr = s.element.get_or_add_pPr()
            for b in ppr.findall('{http://schemas.openxmlformats.org/wordprocessingml/2006/main}pBdr'):
                ppr.remove(b)
    for name in ("Caption", "Quote", "Intense Quote", "List Bullet", "List Number"):
        try:
            _font(st[name], SANS, 9 if name == "Caption" else 10.5, C["ink_3"] if name == "Caption" else C["ink"],
                  bold=False)
            st[name].font.italic = False
        except KeyError:
            pass
    for sec in doc.sections:
        sec.page_width, sec.page_height = Cm(21), Cm(29.7)
        sec.left_margin = sec.right_margin = Cm(2.3)
        sec.top_margin, sec.bottom_margin = Cm(2.6), Cm(2.2)
        sec.header_distance, sec.footer_distance = Cm(1.1), Cm(1.0)
        if header_logo:
            hp = sec.header.paragraphs[0]
            if not hp.runs:
                hp.add_run().add_picture(str(logo("logo")), height=Cm(0.6))
        fp = sec.footer.paragraphs[0]
        if not fp.runs:
            fp.alignment = WD_ALIGN_PARAGRAPH.LEFT
            r = fp.add_run((footer_text or "%s  ·  %s  ·  %s" % (NAME, CONTACT["city"], CONTACT["email"])) + "\t\t")
            r.font.size = Pt(8); r.font.color.rgb = _rgb(C["ink_3"])
            pr = _page_field(fp); pr.font.size = Pt(8); pr.font.color.rgb = _rgb(C["ink_3"])
    return doc


def docx_new(title=None, subtitle=None, **kw):
    """A new house-style Word document, optionally starting with a title and subtitle."""
    from docx import Document
    doc = docx_apply(Document(), **kw)
    if title:
        doc.add_paragraph(title, style="Title")
    if subtitle:
        doc.add_paragraph(subtitle, style="Subtitle")
    return doc


def docx_table(doc, rows, header=True, num_cols=(), widths_cm=None, note=None):
    """House-style table: bold header with a dark rule, hairlines, numbers right-aligned.
    rows: list of lists (first row is the header when header=True). num_cols: column indexes."""
    from docx.shared import Pt, Cm
    from docx.enum.text import WD_ALIGN_PARAGRAPH
    from docx.oxml import OxmlElement
    from docx.oxml.ns import qn

    def border(cell, edge, color, size):
        tcPr = cell._tc.get_or_add_tcPr()
        b = tcPr.find(qn("w:tcBorders"))
        if b is None:
            b = OxmlElement("w:tcBorders"); tcPr.append(b)
        e = OxmlElement("w:" + edge)
        e.set(qn("w:val"), "single"); e.set(qn("w:sz"), str(size)); e.set(qn("w:color"), color.lstrip("#"))
        b.append(e)

    t = doc.add_table(rows=len(rows), cols=len(rows[0]))
    t.style = doc.styles["Table Grid"] if "Table Grid" in [s.name for s in doc.styles] else None
    tblPr = t._tbl.tblPr
    borders = tblPr.find(qn("w:tblBorders"))
    if borders is not None:
        tblPr.remove(borders)
    nb = OxmlElement("w:tblBorders")
    for edge in ("top", "left", "bottom", "right", "insideH", "insideV"):
        e = OxmlElement("w:" + edge); e.set(qn("w:val"), "nil"); nb.append(e)
    tblPr.append(nb)
    for i, row in enumerate(rows):
        for j, val in enumerate(row):
            cell = t.cell(i, j)
            p = cell.paragraphs[0]
            p.paragraph_format.space_after = Pt(2)
            r = p.add_run("" if val is None else str(val))
            r.font.size = Pt(9.5)
            if j in num_cols:
                p.alignment = WD_ALIGN_PARAGRAPH.RIGHT
            if header and i == 0:
                r.bold = True; r.font.color.rgb = _rgb(C["ink"])
                border(cell, "bottom", C["ink"], 12)
            else:
                r.font.color.rgb = _rgb(C["ink_2"] if j not in num_cols else C["ink"])
                border(cell, "bottom", C["hair"], 4)
            if widths_cm:
                cell.width = Cm(widths_cm[j])
    if note:
        p = doc.add_paragraph(note, style="Caption")
    return t


# ---------------------------------------------------------------- PowerPoint

W_IN, H_IN = 13.333, 7.5


def _ppt():
    from pptx.util import Inches, Pt, Emu
    from pptx.dml.color import RGBColor
    return Inches, Pt, RGBColor


def _rgbp(h):
    from pptx.dml.color import RGBColor
    return RGBColor.from_string(h.lstrip("#").upper())


def pptx_new():
    """A blank 16:9 deck. Add slides with the slide_* helpers."""
    from pptx import Presentation
    from pptx.util import Inches
    prs = Presentation()
    prs.slide_width, prs.slide_height = Inches(W_IN), Inches(H_IN)
    return prs


def _blank(prs, bg):
    s = prs.slides.add_slide(prs.slide_layouts[6])
    fill = s.background.fill
    fill.solid(); fill.fore_color.rgb = _rgbp(bg)
    return s


def _text(slide, x, y, w, h, text, size, color, font=None, bold=False, align="l", anchor="t", spacing=None):
    from pptx.util import Inches, Pt
    from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
    tb = slide.shapes.add_textbox(Inches(x), Inches(y), Inches(w), Inches(h))
    tf = tb.text_frame
    tf.word_wrap = True
    tf.margin_left = tf.margin_right = tf.margin_top = tf.margin_bottom = 0
    tf.vertical_anchor = {"t": MSO_ANCHOR.TOP, "m": MSO_ANCHOR.MIDDLE, "b": MSO_ANCHOR.BOTTOM}[anchor]
    lines = text if isinstance(text, list) else [text]
    for i, line in enumerate(lines):
        p = tf.paragraphs[0] if i == 0 else tf.add_paragraph()
        p.alignment = {"l": PP_ALIGN.LEFT, "c": PP_ALIGN.CENTER, "r": PP_ALIGN.RIGHT}[align]
        if spacing:
            p.space_after = Pt(spacing)
        r = p.add_run(); r.text = line
        r.font.size = Pt(size); r.font.bold = bold; r.font.name = font or SANS
        r.font.color.rgb = _rgbp(color)
    return tb


def _footer(prs, slide, source=None, dark=False):
    from pptx.util import Inches
    t = D if dark else C
    n = len(prs.slides)
    slide.shapes.add_picture(str(logo("mark", dark=dark)), Inches(0.6), Inches(H_IN - 0.62), height=Inches(0.28))
    _text(slide, 1.0, H_IN - 0.6, 6, 0.3, NAME, 9, t["ink_3"], anchor="m")
    if source:
        _text(slide, 4.2, H_IN - 0.6, 7.6, 0.3, source, 9, t["ink_3"], align="r", anchor="m")
    _text(slide, W_IN - 1.1, H_IN - 0.6, 0.5, 0.3, str(n), 9, t["ink_3"], align="r", anchor="m")


def slide_title(prs, title, subtitle=None, date=None):
    """Opening slide: dark navy, light-blue logo, big serif title."""
    from pptx.util import Inches
    s = _blank(prs, D["deck_navy"])
    s.shapes.add_picture(str(logo("logo", dark=True)), Inches(0.8), Inches(0.75), height=Inches(0.45))
    _text(s, 0.8, 2.5, 10.5, 2.2, title, 44, "#f2f1ec", font=SERIF, bold=True, anchor="b")
    if subtitle:
        _text(s, 0.8, 4.9, 10.5, 0.9, subtitle, 20, D["brand"])
    _text(s, 0.8, H_IN - 1.0, 8, 0.4, date or TAGLINE, 12, D["ink_3"])
    return s


def slide_section(prs, title, kicker=None):
    """Section divider: light page, small kicker, big serif title, blue rule."""
    from pptx.util import Inches, Pt
    s = _blank(prs, C["page"])
    if kicker:
        _text(s, 0.8, 2.55, 10, 0.4, kicker.upper(), 13, C["ink_3"], bold=True)
    _text(s, 0.8, 3.0, 11, 1.6, title, 40, C["ink"], font=SERIF, bold=True)
    bar = s.shapes.add_shape(1, Inches(0.8), Inches(2.25), Inches(0.9), Inches(0.08))
    bar.fill.solid(); bar.fill.fore_color.rgb = _rgbp(C["mark"]); bar.line.fill.background()
    _footer(prs, s)
    return s


def _headline(s, title, kicker=None):
    if kicker:
        _text(s, 0.6, 0.45, 12, 0.35, kicker.upper(), 11, C["ink_3"], bold=True)
    _text(s, 0.6, 0.8 if kicker else 0.55, 12.1, 1.0, title, 28, C["ink"], font=SERIF, bold=True)


def slide_content(prs, title, bullets=(), kicker=None, source=None, notes=None):
    """Headline (the message, as a sentence) plus up to ~5 short bullets."""
    from pptx.util import Inches, Pt
    s = _blank(prs, C["page"])
    _headline(s, title, kicker)
    if bullets:
        tb = s.shapes.add_textbox(Inches(0.6), Inches(2.0), Inches(11.5), Inches(4.4))
        tf = tb.text_frame; tf.word_wrap = True
        for i, b in enumerate(bullets):
            p = tf.paragraphs[0] if i == 0 else tf.add_paragraph()
            p.space_after = Pt(14)
            r0 = p.add_run(); r0.text = "—  "; r0.font.color.rgb = _rgbp(C["mark"]); r0.font.size = Pt(20); r0.font.name = SANS
            r = p.add_run(); r.text = b; r.font.size = Pt(20); r.font.name = SANS; r.font.color.rgb = _rgbp(C["ink_2"])
    if notes:
        s.notes_slide.notes_text_frame.text = notes
    _footer(prs, s, source)
    return s


def slide_chart(prs, title, image, kicker=None, source=None, side_text=None, notes=None):
    """Headline plus a chart image (PNG from use_matplotlib). Optional takeaway column on the right."""
    from pptx.util import Inches
    s = _blank(prs, C["page"])
    _headline(s, title, kicker)
    from PIL import Image
    w_px, h_px = Image.open(image).size
    box_w = 8.2 if side_text else 12.1
    box_h = 4.6
    w = box_w; h = w * h_px / w_px
    if h > box_h:
        h = box_h; w = h * w_px / h_px
    s.shapes.add_picture(str(image), Inches(0.6), Inches(1.95), width=Inches(w), height=Inches(h))
    if side_text:
        _text(s, 9.3, 2.1, 3.4, 4.3, side_text if isinstance(side_text, list) else [side_text],
              15, C["ink_2"], spacing=10)
    if notes:
        s.notes_slide.notes_text_frame.text = notes
    _footer(prs, s, source)
    return s


def slide_kpis(prs, title, kpis, kicker=None, source=None):
    """Up to four big numbers. kpis: list of (value, label, detail) e.g. ('46%', 'Aided awareness', '±3.1 pp, n = 1,003')."""
    from pptx.util import Inches
    s = _blank(prs, C["page"])
    _headline(s, title, kicker)
    n = len(kpis); gap = 0.3; w = (12.1 - gap * (n - 1)) / n
    for i, k in enumerate(kpis):
        value, label = k[0], k[1]
        detail = k[2] if len(k) > 2 else None
        x = 0.6 + i * (w + gap)
        card = s.shapes.add_shape(5, Inches(x), Inches(2.2), Inches(w), Inches(3.0))
        card.adjustments[0] = 0.08
        card.fill.solid(); card.fill.fore_color.rgb = _rgbp(C["card"])
        card.line.color.rgb = _rgbp(C["hair"]); card.shadow.inherit = False
        card.text_frame.text = ""
        _text(s, x + 0.35, 2.5, w - 0.7, 0.4, label, 14, C["ink_3"])
        _text(s, x + 0.35, 3.0, w - 0.7, 1.2, value, 48, C["brand"], font=SERIF, bold=True, anchor="m")
        if detail:
            _text(s, x + 0.35, 4.4, w - 0.7, 0.6, detail, 12, C["ink_3"])
    _footer(prs, s, source)
    return s


def slide_closing(prs, line="Thank you", contact=True):
    """Closing slide: navy, tagline lockup feel, contact details."""
    from pptx.util import Inches
    s = _blank(prs, D["deck_navy"])
    s.shapes.add_picture(str(logo("mark", dark=True)), Inches(0.8), Inches(1.0), height=Inches(0.9))
    _text(s, 0.8, 2.6, 11, 1.4, line, 44, "#f2f1ec", font=SERIF, bold=True)
    if contact:
        _text(s, 0.8, 4.3, 11, 1.2, [CONTACT["email"], CONTACT["web"].replace("https://", "") + "  ·  " + CONTACT["city"]],
              18, D["brand"], spacing=6)
    _text(s, 0.8, H_IN - 1.0, 8, 0.4, TAGLINE, 12, D["ink_3"])
    return s
