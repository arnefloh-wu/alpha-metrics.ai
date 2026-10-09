#!/usr/bin/env python3
"""Build js/data.js from the output of the ZINTO case-study pipeline.

ZINTO is a fictional brand and every number is synthetic. The case study is
produced by the same analysis pipeline we use for real projects, run on a
generated dataset, so the showcase can show the full workflow without
exposing a client.

Usage:
    python3 tools/make_data.py <folder with the pipeline output>

The folder is the target of the case-study builder and must contain the
ERGEBNISSE_*.csv tables and the AUFBEREITUNG_*_log.txt protocols.
"""
import csv, io, json, os, re, statistics, sys

if len(sys.argv) != 2:
    sys.exit(__doc__)
SRC = sys.argv[1]
OUT = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
                   'js', 'data.js')
HERO = 'ZINTO'


def rows(name):
    with io.open(os.path.join(SRC, name), encoding='utf-8-sig') as f:
        return list(csv.DictReader(f))


def text(name):
    with io.open(os.path.join(SRC, name), encoding='utf-8') as f:
        return f.read()


def num(x):
    return float(x)


def grab(pattern, s, what):
    m = re.search(pattern, s)
    if not m:
        sys.exit('could not find %s' % what)
    return m.group(1)


# ---- aided awareness and funnel, Austria ---------------------------------
funnel = rows('ERGEBNISSE_AT_funnel.csv')
awareness = [dict(label=r['marke'], value=num(r['bekanntheit']),
                  lo=num(r['bekanntheit_ku']), hi=num(r['bekanntheit_ko']),
                  n=int(r['bekanntheit_n']), hero=r['marke'] == HERO)
             for r in sorted(funnel, key=lambda r: -num(r['bekanntheit']))]
assert sum(a['hero'] for a in awareness) == 1
rank = [a['label'] for a in awareness].index(HERO) + 1

z = next(r for r in funnel if r['marke'] == HERO)
eligible = [r for r in funnel if int(r['bekanntheit_n']) >= 30]
med_aware_consider = statistics.median(num(r['konv_bek_bet']) for r in eligible)
eligible_c = [r for r in funnel if int(r['betracht_n']) >= 30]
med_consider_buy = statistics.median(num(r['konv_bet_kauf']) for r in eligible_c)

funnel_hero = dict(
    stages=[dict(label='Aware of the brand', value=num(z['bekanntheit']),
                 n=int(z['bekanntheit_n'])),
            dict(label='Would consider at next purchase', value=num(z['betracht']),
                 n=int(z['betracht_n'])),
            dict(label='Bought in the last 3 months', value=num(z['kauf']),
                 n=int(z['kauf_n']))],
    conv=[dict(label='Aware to consider', value=num(z['konv_bek_bet']),
               median=round(med_aware_consider, 1), brands=len(eligible)),
          dict(label='Consider to buy', value=num(z['konv_bet_kauf']),
               median=round(med_consider_buy, 1), brands=len(eligible_c))])

# ---- who knows the brand --------------------------------------------------
demo = rows('ERGEBNISSE_AT_bekanntheit_demografie.csv')


def block(key):
    return [dict(label=r['auspraegung'], value=num(r['gest']), lo=num(r['ku']),
                 hi=num(r['ko']), n=int(r['n'])) for r in demo if r['merkmal'] == key]


age = block('alter_txt')
gender = block('geschlecht_txt')
education = block('bildung3')
for a in age:
    a['label'] = (a['label'].replace(' Jahre und älter', '+')
                  .replace(' bis ', '–').replace(' Jahre', ''))
for g in gender:
    g['label'] = {'Männlich': 'Men', 'Weiblich': 'Women'}[g['label']]
edu_map = {'Pflichtschule/Lehre': 'Compulsory school / apprenticeship',
           'Matura': 'A-levels (Matura)', 'Hochschule': 'University degree'}
for e in education:
    e['label'] = edu_map[e['label']]

# ---- contact channels (aware respondents only) ---------------------------
ch = [r for r in rows('ERGEBNISSE_AT_kanaele.csv') if r['ebene'] == 'Kanal']
ch_en = {'Supermarkt (Regal, Display)': 'In store (shelf, display)',
         'Instagram/Facebook': 'Instagram / Facebook', 'Mundpropaganda': 'Word of mouth',
         'TV-Werbung': 'TV advertising', 'YouTube': 'YouTube', 'TikTok': 'TikTok',
         'Printwerbung': 'Print advertising', 'Außenwerbung': 'Outdoor advertising',
         'Werbung auf Websites': 'Website advertising',
         'Influencer-Empfehlungen': 'Influencer recommendations'}
channels = [dict(label=ch_en[r['name']], value=num(r['anteil']), lo=num(r['ku']),
                 hi=num(r['ko']), n=int(r['n']))
            for r in sorted(ch, key=lambda r: -num(r['anteil']))
            if r['name'] in ch_en and int(r['n']) >= 30][:8]   # minimum base 30

# ---- tracking across waves ------------------------------------------------
wav = [r for r in rows('ERGEBNISSE_wellen.csv') if r['land'] == 'AT']
change = [dict(label=r['marke'], value=num(r['differenz_pp']), lo=num(r['ci_unten']),
               hi=num(r['ci_oben']), w2022=num(r['bekanntheit_2022']),
               w2026=num(r['bekanntheit_2026']), hero=r['marke'] == HERO)
          for r in sorted(wav, key=lambda r: -num(r['differenz_pp']))]
wmd = text('ERGEBNISSE_wellen.md')
at_block = wmd.split('ÖSTERREICH', 1)[1].split('DEUTSCHLAND', 1)[0]
tracking = dict(
    control_median=num(grab(r'Median (-?\d+\.\d+) pp', at_block, 'control median')),
    expected=num(grab(r'bei reinem Formatwechsel:\s+(\d+\.\d+) %', at_block, 'expected')),
    measured=num(grab(r'Gemessen 2026:\s+(\d+\.\d+) %', at_block, 'measured')),
    adjusted=num(grab(r'Bereinigter Markeneffekt:\s+\+(\d+\.\d+) pp', at_block, 'adjusted')),
    ci_lo=num(grab(r'Bootstrap-Intervall \(\d+ Ziehungen\):\s+\[\+(\d+\.\d+);', at_block, 'ci lo')),
    ci_hi=num(grab(r'Bootstrap-Intervall \(\d+ Ziehungen\):\s+\[\+\d+\.\d+; \+(\d+\.\d+)\]',
                   at_block, 'ci hi')),
    n_2022=int(grab(r'Basis 2022:\s+n =\s+(\d+)', at_block, 'n 2022')),
    n_2026=int(grab(r'Basis 2026:\s+n =\s+(\d+)', at_block, 'n 2026')))

# ---- field facts ----------------------------------------------------------
log_at, log_de = text('AUFBEREITUNG_AT_log.txt'), text('AUFBEREITUNG_DE_log.txt')


def field(log):
    return dict(
        interviews=int(grab(r'Datensaetze im Export:\s+(\d+)', log, 'interviews')),
        net=int(grab(r'NETTOSTICHPROBE:\s+(\d+)', log, 'net')),
        excluded_pct=num(grab(r'AUSGESCHLOSSEN gesamt:\s+\d+\s+(\d+\.\d) %', log, 'excl')),
        minutes=num(grab(r'Median Bearbeitungszeit:\s+\d+ s\s+\((\d+\.\d) Min', log, 'median')),
        deff=num(grab(r'Designeffekt:\s+(\d+\.\d+)', log, 'deff')),
        n_eff=int(grab(r'Effektives n:\s+(\d+)', log, 'neff')))


fa, fd = field(log_at), field(log_de)
zd = next(r for r in rows('ERGEBNISSE_DE_funnel.csv') if r['marke'] == HERO)
fa['aware'] = int(z['bekanntheit_n'])
fd['aware'] = int(zd['bekanntheit_n'])
fd['consider'] = int(zd['betracht_n'])
fd['buy'] = int(zd['kauf_n'])

data = dict(
    note='ZINTO is a fictional brand. All figures are synthetic.',
    hero=HERO, rank=rank, brands=len(awareness),
    awareness=awareness, funnel=funnel_hero, age=age, gender=gender,
    education=education, channels=channels, change=change, tracking=tracking,
    field=dict(at=fa, de=fd))

with io.open(OUT, 'w', encoding='utf-8') as f:
    f.write('/* Generated by tools/make_data.py - do not edit by hand.\n'
            '   ZINTO is a fictional brand; every figure is synthetic. */\n')
    f.write('window.AM_DATA = ')
    json.dump(data, f, ensure_ascii=False, indent=1)
    f.write(';\n')
print('wrote', OUT, '(%d bytes)' % os.path.getsize(OUT))
print('rank %d of %d; funnel %s; medians %s / %s' % (
    rank, len(awareness), [s['value'] for s in funnel_hero['stages']],
    med_aware_consider, med_consider_buy))
print('tracking', tracking)
print('field AT', fa)
print('field DE', fd)
