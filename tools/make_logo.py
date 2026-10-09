#!/usr/bin/env python3
"""Build the alpha-metrics.ai logo files from two system fonts.

The logo is the lowercase wordmark "alpha-metrics.ai" set in a bold serif, in the
site's dark blue. The lockup adds the line "Where science meets business" in light
grey, spaced out to the width of the wordmark. The letters are converted to
outlines, so the SVGs look the same on every machine and need no font.

Writes
  assets/logo/alpha-metrics.svg           wordmark, dark blue, for light backgrounds
  assets/logo/alpha-metrics-dark.svg      wordmark, light blue, for dark backgrounds
  assets/logo/alpha-metrics-white.svg     wordmark, white
  assets/logo/alpha-metrics-ink.svg       wordmark, one colour, near black, for print
  assets/logo/alpha-metrics-tagline.svg       wordmark and tagline, for light backgrounds
  assets/logo/alpha-metrics-tagline-dark.svg  the same, for dark backgrounds
  assets/favicon.svg, assets/apple-touch-icon.png, favicon.ico   "am" tile
and replaces the wordmark in the top-left of assets/og-card.png.

Usage:
    python3 tools/make_logo.py [bold serif .ttf] [regular sans .ttf]

Defaults are Palatino Linotype Bold and Segoe UI from Windows. Needs fontTools
and Pillow.
"""
import os, sys
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


serif, sans = Face(SERIF), Face(SANS)

# Wordmark
d, box = serif.run(TEXT, EM, TRACK)
for name, fill in (('alpha-metrics', BLUE), ('alpha-metrics-dark', BLUE_DARK_BG),
                   ('alpha-metrics-white', WHITE), ('alpha-metrics-ink', INK)):
    write('assets/logo/%s.svg' % name, svg(box, '<path fill="%s" d="%s"/>' % (fill, d)))

# Lockup: the tagline is letter-spaced until it is exactly as wide as the wordmark.
wm_w = box[2] - box[0]
track = (wm_w - sans.width(TAGLINE, TAG_EM)) / (TAG_EM * (len(TAGLINE) - 1))
assert 0.02 < track < 0.3, track
td, tbox = sans.run(TAGLINE, TAG_EM, track, dx=box[0], dy=box[3] + 95)
lock_box = (box[0], box[1], box[2], tbox[3])
for name, fill, grey in (('alpha-metrics-tagline', BLUE, GREY),
                         ('alpha-metrics-tagline-dark', BLUE_DARK_BG, GREY_DARK_BG)):
    write('assets/logo/%s.svg' % name,
          svg(lock_box, '<path fill="%s" d="%s"/><path fill="%s" d="%s"/>' % (fill, d, grey, td)))

# Favicon: dark-blue rounded tile with a white "am", centred on its outline box.
d, (x0, y0, x1, y1) = serif.run('am', EM, -0.03)
k = 34 / (x1 - x0)
tx, ty = 32 - (x0 + x1) / 2 * k, 32 - (y0 + y1) / 2 * k
write('assets/favicon.svg',
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" '
      'fill="%s"/><path fill="#fff" transform="translate(%s %s) scale(%.4f)" d="%s"/></svg>\n'
      % (BLUE, num(tx), num(ty), k, d))


def tile(size):
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    dr = ImageDraw.Draw(img)
    dr.rounded_rectangle((0, 0, size - 1, size - 1), radius=size * 14 // 64, fill=BLUE)
    dr.text((size / 2, size / 2), 'am', font=ImageFont.truetype(SERIF, int(size * 0.56)),
            fill='#ffffff', anchor='mm')
    return img


tile(180).save(os.path.join(ROOT, 'assets', 'apple-touch-icon.png'))
tile(256).save(os.path.join(ROOT, 'favicon.ico'), sizes=[(16, 16), (32, 32), (48, 48)])

# Social card: keep the layout, swap the old "alpha AlphaMetrics AI" lockup for the new one.
og = os.path.join(ROOT, 'assets', 'og-card.png')
img = Image.open(og).convert('RGB')
dr = ImageDraw.Draw(img)
dr.rectangle((60, 48, 460, 150), fill=img.getpixel((50, 90)))
wm = ImageFont.truetype(SERIF, 46)
dr.text((72, 82), TEXT, font=wm, fill=BLUE_DARK_BG, anchor='lm')
width = dr.textlength(TEXT, font=wm)
tf = ImageFont.truetype(SANS, 15)
gap = (width - sum(dr.textlength(c, font=tf) for c in TAGLINE)) / (len(TAGLINE) - 1)
x = 72.0
for c in TAGLINE:
    dr.text((x, 124), c, font=tf, fill=GREY_DARK_BG, anchor='ls')
    x += dr.textlength(c, font=tf) + gap
img.save(og, optimize=True)
print('wrote logo files')
