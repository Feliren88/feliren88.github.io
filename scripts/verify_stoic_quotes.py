#!/usr/bin/env python3
"""
Verify every quotation in _data/stoic.yml against its public-domain source.

The /stoic/ page quotes two translations:

    Meditations   Marcus Aurelius, trans. George Long
                  https://classics.mit.edu/Antoninus/meditations.mb.txt
    Enchiridion   Epictetus, trans. Elizabeth Carter
                  https://classics.mit.edu/Epictetus/epicench.1b.txt

Both are long out of copyright. Quotes were extracted programmatically rather
than written from memory, because the best known Stoic lines in circulation are
usually a different translator's wording or no translator's at all.

A quote passes only if it is a contiguous verbatim span of the stated book or
chapter. Two normalisations are allowed, neither of which alters a word:

    * translator apparatus removed, meaning bracketed Greek, footnote markers
      and the translator's own editorial parentheses
    * truncation punctuation, meaning a span cut at a clause boundary may end
      in a full stop where the source has a colon or semicolon, and may
      capitalise its first letter

Usage:
    python3 scripts/verify_stoic_quotes.py            # fetches, then verifies
    python3 scripts/verify_stoic_quotes.py --cache DIR

Exits non-zero on any failure, so it is safe to wire into CI.
"""
import argparse
import html
import json
import os
import re
import sys
import urllib.request

SOURCES = {
    'meditations': ('https://classics.mit.edu/Antoninus/meditations.mb.txt',
                    'Marcus Aurelius, trans. George Long'),
    'encheiridion': ('https://classics.mit.edu/Epictetus/epicench.1b.txt',
                     'Epictetus, trans. Elizabeth Carter'),
}

ROMAN = {'I': 1, 'II': 2, 'III': 3, 'IV': 4, 'V': 5, 'VI': 6,
         'VII': 7, 'VIII': 8, 'IX': 9, 'X': 10, 'XI': 11, 'XII': 12}

GREEK = re.compile(r'\s*\(\[Greek:[^\]]*\]\)|\s*\[Greek:[^\]]*\]')
FOOTNOTE = re.compile(r'\[\d+\]|\[[A-Z]\]')
PAREN_GLOSS = re.compile(
    r'\s*\((?:description, notion|magisterial power|event|do|fault|dishonor|author|'
    r'thoughts|social|formal|forms|or,[^)]*)\)')

UA = ('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 '
      '(KHTML, like Gecko) Chrome/124.0 Safari/537.36')


def fetch(url, cache_path):
    if cache_path and os.path.exists(cache_path):
        return open(cache_path, encoding='utf-8', errors='replace').read()
    req = urllib.request.Request(url, headers={'User-Agent': UA})
    with urllib.request.urlopen(req, timeout=60) as r:
        text = r.read().decode('utf-8', 'replace')
    if cache_path:
        os.makedirs(os.path.dirname(cache_path), exist_ok=True)
        open(cache_path, 'w', encoding='utf-8').write(text)
    return text


def strip_markup(raw):
    if '<pre>' in raw:
        raw = raw.split('<pre>', 1)[1].split('</pre>', 1)[0]
    return html.unescape(re.sub(r'<[^>]+>', '', raw))


def norm(t):
    t = (t.replace('’', "'").replace('‘', "'")
          .replace('“', '"').replace('”', '"')
          .replace('—', ' ').replace('–', ' '))
    return re.sub(r'\s+', ' ', t).strip()


def clean(t):
    t = GREEK.sub('', t)
    t = FOOTNOTE.sub('', t)
    t = PAREN_GLOSS.sub('', t)
    return re.sub(r'\s+', ' ', t).strip()


def parse_meditations(raw):
    """Long's text marks books with a bare roman numeral line."""
    body = strip_markup(raw)
    lines = body.split('\n')
    heads, want = [], 1
    for i, ln in enumerate(lines):
        s = ln.strip().rstrip('.')
        if re.fullmatch(r'\s*[IVXL]+\.?\s*', ln) and ROMAN.get(s) == want:
            heads.append((i, want))
            want += 1
            if want > 12:
                break
    if not heads:                       # the MIT edition spells them out
        pat = re.compile(r'(?m)^\s*BOOK\s+([A-Z]+)\s*$')
        words = {'ONE': 1, 'TWO': 2, 'THREE': 3, 'FOUR': 4, 'FIVE': 5, 'SIX': 6,
                 'SEVEN': 7, 'EIGHT': 8, 'NINE': 9, 'TEN': 10, 'ELEVEN': 11, 'TWELVE': 12}
        marks = [(m.start(), words.get(m.group(1))) for m in pat.finditer(body)]
        marks = [(p, n) for p, n in marks if n]
        out = {}
        for i, (pos, num) in enumerate(marks):
            end = marks[i + 1][0] if i + 1 < len(marks) else len(body)
            out.setdefault(str(num), norm(body[pos:end]))
        return out
    out = {}
    for i, (ln, b) in enumerate(heads):
        end = heads[i + 1][0] if i + 1 < len(heads) else len(lines)
        out[str(b)] = norm('\n'.join(lines[ln + 1:end]))
    return out


def parse_enchiridion(raw):
    """Carter's text numbers chapters 1 to 52 at line start."""
    body = strip_markup(raw)
    if 'Elizabeth Carter' in body:
        body = body.split('Elizabeth Carter', 1)[1]
    body = body.split('THE END', 1)[0]
    marks = [(m.start(), int(m.group(1))) for m in re.finditer(r'(?m)^(\d{1,2})\.\s', body)]
    out = {}
    for i, (pos, num) in enumerate(marks):
        end = marks[i + 1][0] if i + 1 < len(marks) else len(body)
        if str(num) in out:
            continue
        out[str(num)] = re.sub(r'^\d{1,2}\.\s*', '', norm(body[pos:end]))
    return out


def parse_yaml(path):
    entries, cur = [], None
    for line in open(path, encoding='utf-8'):
        line = line.rstrip('\n')
        m = re.match(r'  - id: (.+)$', line)
        if m:
            if cur:
                entries.append(cur)
            cur = {'id': m.group(1).strip()}
            continue
        m = re.match(r'    (\w+): (.*)$', line)
        if m and cur is not None:
            k, v = m.group(1), m.group(2)
            if v.startswith('"') and v.endswith('"'):
                v = v[1:-1].replace('\\"', '"').replace('\\\\', '\\')
            cur[k] = v
    if cur:
        entries.append(cur)
    return entries


def is_verbatim(quote, body):
    if quote in body:
        return True
    stem = quote.rstrip('.').rstrip()
    if not stem:
        return False
    return stem in body or (stem[0].lower() + stem[1:]) in body


def main():
    here = os.path.dirname(os.path.abspath(__file__))
    root = os.path.dirname(here)
    ap = argparse.ArgumentParser()
    ap.add_argument('--data', default=os.path.join(root, '_data', 'stoic.yml'))
    ap.add_argument('--cache', default=os.path.join(here, '.stoic-cache'))
    args = ap.parse_args()

    corpus = {}
    for key, (url, who) in SOURCES.items():
        raw = fetch(url, os.path.join(args.cache, key + '.txt') if args.cache else None)
        corpus[key] = (parse_meditations(raw) if key == 'meditations'
                       else parse_enchiridion(raw))
        print(f'{key:13s} {len(corpus[key]):3d} units  ({who})')

    entries = parse_yaml(args.data)
    valid_groups = {'control', 'judgement', 'adversity', 'others', 'desire', 'death', 'action'}
    fails = []

    for e in entries:
        if e.get('group') not in valid_groups:
            fails.append((e['id'], f"bad group {e.get('group')!r}"))
        src = corpus.get(e.get('source'))
        if src is None:
            fails.append((e['id'], f"unknown source {e.get('source')!r}"))
            continue
        unit = e['ref'].split('.')[0]
        raw = src.get(unit)
        if raw is None:
            fails.append((e['id'], f"no such ref {e['ref']}"))
            continue
        if not (is_verbatim(e['quote'], clean(raw)) or is_verbatim(e['quote'], raw)):
            fails.append((e['id'], f"quote is not a verbatim span of {e['source']} {e['ref']}"))
        for field in ('situation', 'take'):
            if '—' in e.get(field, ''):
                fails.append((e['id'], f'em dash in {field}'))

    ids = [e['id'] for e in entries]
    for dupe in {i for i in ids if ids.count(i) > 1}:
        fails.append((dupe, 'duplicate id'))

    print(f'\nentries  : {len(entries)}')
    print(f'verbatim : {len(entries) - len([f for f in fails if "verbatim" in f[1]])}/{len(entries)}')
    if fails:
        print(f'\nFAILURES ({len(fails)}):')
        for i, r in fails:
            print(f'  {i}: {r}')
        return 1
    print('\nall checks passed')
    return 0


if __name__ == '__main__':
    sys.exit(main())
