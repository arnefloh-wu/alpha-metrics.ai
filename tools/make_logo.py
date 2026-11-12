#!/usr/bin/env python3
"""Build the alpha-metrics.ai logo files from two system fonts.

The logo is a rounded dark-blue tile with a white alpha, followed by the lowercase
wordmark "alpha-metrics.ai" set in a bold serif, in the site's dark blue. The tile
alone is the favicon and app icon. The tagline lockup adds the line "Where science meets business" in light
grey, spaced out to the width of the wordmark. The letters are converted to
outlines, so the SVGs look the same on every machine and need no font.

Writes
  assets/logo/alpha-metrics-logo.svg      tile and wordmark, for light backgrounds
  assets/logo/alpha-metrics-logo-dark.svg the same, for dark backgrounds
  assets/logo/alpha-metrics-mark.svg      tile alone, dark blue with a white alpha
  assets/logo/alpha-metrics-mark-dark.svg tile alone, light blue with a dark alpha
  assets/logo/alpha-metrics.svg           wordmark, dark blue, for light backgrounds
  assets/logo/alpha-metrics-dark.svg      wordmark, light blue, for dark backgrounds
  assets/logo/alpha-metrics-white.svg     wordmark, white
  assets/logo/alpha-metrics-ink.svg       wordmark, one colour, near black, for print
  assets/logo/alpha-metrics-tagline.svg       wordmark and tagline, for light backgrounds
  assets/logo/alpha-metrics-tagline-dark.svg  the same, for dark backgrounds
  assets/favicon.svg, assets/apple-touch-icon.png, favicon.ico   the tile
and replaces the logo in the top-left of assets/og-card.png.

Usage:
    python3 tools/make_logo.py [bold serif .ttf] [regular sans .ttf]

Defaults are Palatino Linotype Bold and Segoe UI from Windows. Needs fontTools
and Pillow. If the fonts are not on this machine, the letter outlines are read
back from the existing SVGs, so the tile and the logo files can still be rebuilt;
only the social card is left as it is.
"""
import os, re, sys
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.pens.boundsPen import BoundsPen
from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SERIF = sys.argv[1] if len(sys.argv) > 1 else 'C:/Windows/Fonts/palab.ttf'
SANS = sys.argv[2] if len(sys.argv) > 2 else 'C:/Windows/Fonts/segoeui.ttf'
TEXT = 'alpha-metrics.ai'
TAGLINE = 'Where science meets business'
TRACK = -0.01          # wordmark letter-spacing, in em
BLUE, BLUE_DARK_BG, WHITE, INK = '#104281', '#9cc3f3', '#ffffff', '#0e1a2b'
GREY, GREY_DARK_BG = '#9b9a92', '#c3c2b7'
EM = 200               # the wordmark is drawn at 200 units per em
TAG_EM = 80            # the tagline at 80: two fifths of the wordmark's size
TILE_INK = '#0b1522'   # the alpha on the light-blue tile
# The alpha: one stroke on a 64 x 64 grid, as four cubic curves from the upper tail,
# round the bowl, to the lower tail.
ALPHA = [((50, 15), (45, 33), (35, 49), (24, 49)), ((24, 49), (15, 49), (9, 41), (9, 32)),
         ((9, 32), (9, 23), (15, 15), (24, 15)), ((24, 15), (35, 15), (45, 31), (53, 49))]
ALPHA_W = 7.5          # stroke width on that grid
ALPHA_FIT = 'translate(32 32) scale(.86) translate(-31 -32)'   # centres the alpha in the tile
TILE_R = 14            # corner radius of the 64-unit tile


class Face:
    def __init__(self, path):
        self.font = TTFont(path)
        self.gs = self.font.getGlyphSet()
        self.cmap = self.font.getBestCmap()
        self.upm = self.font['head'].unitsPerEm

    def run(self, text, em, track, dx=0.0, dy=0.0):
        """Path data and bounds (x0, y0, x1, y1) of text, y down, baseline at dy."""
        d = SVGPathPen(self.gs, ntos=num)
        b = BoundsPen(self.gs)
        s, x = em / self.upm, dx
        for ch in text:
            g = self.gs[self.cmap[ord(ch)]]
            for pen in (d, b):
                g.draw(TransformPen(pen, (s, 0, 0, -s, x, dy)))
            x += g.width * s + track * em
        return d.getCommands(), b.bounds

    def width(self, text, em, track=0.0):
        s = em / self.upm
        return sum(self.gs[self.cmap[ord(c)]].width * s for c in text) + track * em * (len(text) - 1)


def num(v):
    return ('%.1f' % v).rstrip('0').rstrip('.')


def svg(box, body):
    x0, y0, x1, y1 = box
    pad = 2
    return ('<svg xmlns="http://www.w3.org/2000/svg" viewBox="%s %s %s %s" role="img" '
            'aria-label="alpha-metrics.ai">%s</svg>\n'
            % (num(x0 - pad), num(y0 - pad), num(x1 - x0 + 2 * pad), num(y1 - y0 + 2 * pad), body))


def write(path, text):
    path = os.path.join(ROOT, path)
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, 'w', encoding='utf-8', newline='\n') as f:
        f.write(text)


def mark(tile_fill, alpha_fill):
    """SVG body of the tile on a 64 x 64 grid."""
    d = 'M%s %s' % ALPHA[0][0] + ''.join('C%s %s %s %s %s %s' % (a + b + c) for _, a, b, c in ALPHA)
    return ('<rect width="64" height="64" rx="%d" fill="%s"/><path transform="%s" d="%s" fill="none" '
            'stroke="%s" stroke-width="%s" stroke-linecap="round" stroke-linejoin="round"/>'
            % (TILE_R, tile_fill, ALPHA_FIT, d, alpha_fill, ALPHA_W))


def tile(size, ss=8):
    """The dark-blue tile as an image, drawn large and scaled down for smooth edges."""
    n = size * ss
    k = n / 64
    img = Image.new('RGBA', (n, n), (0, 0, 0, 0))
    dr = ImageDraw.Draw(img)
    dr.rounded_rectangle((0, 0, n - 1, n - 1), radius=TILE_R * k, fill=BLUE)
    r = ALPHA_W * .86 / 2 * k
    for p0, p1, p2, p3 in ALPHA:
        for i in range(201):
            t = i / 200
            u = 1 - t
            x, y = (u ** 3 * p0[j] + 3 * u * u * t * p1[j] + 3 * u * t * t * p2[j] + t ** 3 * p3[j]
                    for j in (0, 1))
            x, y = (32 + .86 * (x - 31)) * k, (32 + .86 * (y - 32)) * k
            dr.ellipse((x - r, y - r, x + r, y + r), fill='#ffffff')
    return img.resize((size, size), Image.LANCZOS)


def outlines(name):
    """Path data and bounds of the letters in an SVG this script wrote earlier."""
    with open(os.path.join(ROOT, 'assets', 'logo', name), encoding='utf-8') as f:
        text = f.read()
    x, y, w, h = (float(v) for v in re.search(r'viewBox="([^"]+)"', text).group(1).split())
    return re.findall(r' d="([^"]+)"', text), (x + 2, y + 2, x + w - 2, y + h - 2)


# The tile, as the mark and as the favicon and app icons.
write('assets/logo/alpha-metrics-mark.svg',
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" role="img" '
      'aria-label="alpha-metrics.ai">%s</svg>\n' % mark(BLUE, WHITE))
write('assets/logo/alpha-metrics-mark-dark.svg',
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" role="img" '
      'aria-label="alpha-metrics.ai">%s</svg>\n' % mark(BLUE_DARK_BG, TILE_INK))
write('assets/favicon.svg',
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">%s</svg>\n' % mark(BLUE, WHITE))
tile(180).save(os.path.join(ROOT, 'assets', 'apple-touch-icon.png'))
tile(256).save(os.path.join(ROOT, 'favicon.ico'), sizes=[(16, 16), (32, 32), (48, 48)])

HAVE_FONTS = os.path.exists(SERIF) and os.path.exists(SANS)
if HAVE_FONTS:
    serif, sans = Face(SERIF), Face(SANS)

# Wordmark
if HAVE_FONTS:
    d, box = serif.run(TEXT, EM, TRACK)
else:
    (d,), box = outlines('alpha-metrics-ink.svg')
for name, fill in (('alpha-metrics', BLUE), ('alpha-metrics-dark', BLUE_DARK_BG),
                   ('alpha-metrics-white', WHITE), ('alpha-metrics-ink', INK)):
    write('assets/logo/%s.svg' % name, svg(box, '<path fill="%s" d="%s"/>' % (fill, d)))

# Logo: the tile to the left of the wordmark, centred a little above the x-height.
TILE, GAP, TILE_MID = 190, 46, -58
tile_x, tile_y = box[0] - GAP - TILE, TILE_MID - TILE / 2
logo_box = (tile_x, min(box[1], tile_y), box[2], max(box[3], tile_y + TILE))
for name, fill, tile_fill, alpha_fill in (('alpha-metrics-logo', BLUE, BLUE, WHITE),
                                          ('alpha-metrics-logo-dark', BLUE_DARK_BG, BLUE_DARK_BG, TILE_INK)):
    write('assets/logo/%s.svg' % name,
          svg(logo_box, '<g transform="translate(%s %s) scale(%s)">%s</g><path fill="%s" d="%s"/>'
              % (num(tile_x), num(tile_y), TILE / 64, mark(tile_fill, alpha_fill), fill, d)))

# Lockup: the tagline is letter-spaced until it is exactly as wide as the wordmark.
if HAVE_FONTS:
    wm_w = box[2] - box[0]
    track = (wm_w - sans.width(TAGLINE, TAG_EM)) / (TAG_EM * (len(TAGLINE) - 1))
    assert 0.02 < track < 0.3, track
    td, tbox = sans.run(TAGLINE, TAG_EM, track, dx=box[0], dy=box[3] + 95)
else:
    (_, td), tbox = outlines('alpha-metrics-tagline.svg')
lock_box = (box[0], box[1], box[2], tbox[3])
for name, fill, grey in (('alpha-metrics-tagline', BLUE, GREY),
                         ('alpha-metrics-tagline-dark', BLUE_DARK_BG, GREY_DARK_BG)):
    write('assets/logo/%s.svg' % name,
          svg(lock_box, '<path fill="%s" d="%s"/><path fill="%s" d="%s"/>' % (fill, d, grey, td)))

# Social card: keep the layout, redraw the logo in the top-left corner.
if not HAVE_FONTS:
    print('wrote logo files; fonts not found, assets/og-card.png left as it is')
    sys.exit()
og = os.path.join(ROOT, 'assets', 'og-card.png')
img = Image.open(og).convert('RGB')
dr = ImageDraw.Draw(img)
dr.rectangle((60, 48, 560, 150), fill=img.getpixel((50, 90)))
OG_TILE, OG_X = 74, 72 + 74 + 20
t = tile(OG_TILE)
img.paste(t, (72, 54), t)
wm = ImageFont.truetype(SERIF, 46)
dr.text((OG_X, 82), TEXT, font=wm, fill=BLUE_DARK_BG, anchor='lm')
width = dr.textlength(TEXT, font=wm)
tf = ImageFont.truetype(SANS, 15)
gap = (width - sum(dr.textlength(c, font=tf) for c in TAGLINE)) / (len(TAGLINE) - 1)
x = float(OG_X)
for c in TAGLINE:
    dr.text((x, 124), c, font=tf, fill=GREY_DARK_BG, anchor='ls')
    x += dr.textlength(c, font=tf) + gap
img.save(og, optimize=True)
print('wrote logo files')
