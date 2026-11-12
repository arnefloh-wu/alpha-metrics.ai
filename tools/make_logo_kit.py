#!/usr/bin/env python3
"""Build the downloadable logo kit from the SVGs that make_logo.py writes.

Writes
  assets/logo/png/<name>-<width>.png   PNG exports with a transparent background
  assets/logo/alpha-metrics-logo-kit.zip   every SVG and PNG plus a short guide

Run make_logo.py first when the logo changes, then this script.

Usage:
    python3 tools/make_logo_kit.py

Needs cairosvg.
"""
import os, zipfile
import cairosvg

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
LOGO = os.path.join(ROOT, 'assets', 'logo')
PNG = os.path.join(LOGO, 'png')
KIT = os.path.join(LOGO, 'alpha-metrics-logo-kit.zip')

# SVG name, PNG widths in pixels
EXPORTS = [
    ('alpha-metrics-logo', (600, 1200, 2400)),
    ('alpha-metrics-logo-dark', (600, 1200, 2400)),
    ('alpha-metrics-mark', (256, 512, 1024)),
    ('alpha-metrics-mark-dark', (256, 512, 1024)),
    ('alpha-metrics', (600, 1200, 2400)),
    ('alpha-metrics-dark', (600, 1200, 2400)),
    ('alpha-metrics-white', (600, 1200, 2400)),
    ('alpha-metrics-ink', (600, 1200, 2400)),
    ('alpha-metrics-tagline', (600, 1200, 2400)),
    ('alpha-metrics-tagline-dark', (600, 1200, 2400)),
]

GUIDE = """alpha-metrics.ai logo kit
=========================

Files
  alpha-metrics-logo         tile and wordmark, for light backgrounds
  alpha-metrics-logo-dark    tile and wordmark, for dark backgrounds
  alpha-metrics-mark         tile alone (profile pictures, app icons)
  alpha-metrics-mark-dark    tile alone, for dark backgrounds
  alpha-metrics              wordmark alone, dark blue
  alpha-metrics-dark         wordmark alone, light blue, for dark backgrounds
  alpha-metrics-white        wordmark alone, white
  alpha-metrics-ink          wordmark alone, one colour, for print
  alpha-metrics-tagline      wordmark with "Where science meets business"
  alpha-metrics-tagline-dark the same, for dark backgrounds

Use the SVG files wherever you can; they stay sharp at every size.
The PNG files have a transparent background; the number is the width in pixels.

Colours
  Dark blue   #104281   logo on light backgrounds
  Light blue  #9cc3f3   logo on dark backgrounds
  Ink         #0e1a2b   one-colour print
  Grey        #9b9a92   tagline on light backgrounds

Please keep clear space around the logo of at least the tile's width,
and do not stretch, recolour or rearrange it.

https://alpha-metrics.ai/logo.html
"""


def main():
    os.makedirs(PNG, exist_ok=True)
    files = []
    for name, widths in EXPORTS:
        svg = os.path.join(LOGO, name + '.svg')
        files.append((svg, 'svg/%s.svg' % name))
        for w in widths:
            out = os.path.join(PNG, '%s-%d.png' % (name, w))
            cairosvg.svg2png(url=svg, write_to=out, output_width=w)
            files.append((out, 'png/%s-%d.png' % (name, w)))
    with zipfile.ZipFile(KIT, 'w', zipfile.ZIP_DEFLATED) as z:
        z.writestr(zipfile.ZipInfo('alpha-metrics-logo-kit/README.txt', (2026, 1, 1, 0, 0, 0)), GUIDE)
        for src, arc in files:
            info = zipfile.ZipInfo('alpha-metrics-logo-kit/' + arc, (2026, 1, 1, 0, 0, 0))
            info.compress_type = zipfile.ZIP_DEFLATED
            with open(src, 'rb') as f:
                z.writestr(info, f.read())
    print('wrote %d PNG files and %s' % (len(files) - len(EXPORTS), os.path.relpath(KIT, ROOT)))


if __name__ == '__main__':
    main()
