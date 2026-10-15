# -*- coding: utf-8 -*-
"""Static audit of the Skedee market data layer.

Run:  python audit.py
Checks markets-data.js + the markets/ directory for the bugs reported earlier:
dead '#', duplicate ids, dangling links, orphaned pages, category coverage,
and the volume-sort formula the index page now uses. Exits 1 on any problem.
"""
import os
import re
from collections import Counter

DATA = "markets-data.js"
src = open(DATA, encoding="utf-8").read()
_start = src.index("window.SKEDII_MARKETS")
block = src[_start: src.index("];", _start)]

# ---- entries ------------------------------------------------------------
rows = re.findall(r"\{[^\n]*\bid:\s*(?:'[^']*'|\d+)[^\n]*\},?", block)

def field_id(row):
    m = re.search(r"\bid:\s*(?:'([^']+)'|([0-9]+))", row)
    return (m.group(1) or m.group(2)) if m else None


def field(row, name, num=False):
    if num:
        m = re.search(r"\b%s:\s*(-?[0-9]+(?:\.[0-9]+)?)(?![0-9])" % name, row)
    else:
        m = re.search(r"\b%s:\s*'((?:[^'\\]|\\.)*)'" % name, row)
    return m.group(1) if m else None

ids = [field_id(r) for r in rows]
links = [field(r, "link") for r in rows]
titles = [field(r, "title") for r in rows]
cats = [field(r, "cat") for r in rows]
vols = [field(r, "vol") for r in rows]
yes = [field(r, "yes", num=True) for r in rows]

problems = []

dupes = [i for i, c in Counter(ids).items() if i is not None and c > 1]
if dupes:
    problems.append("duplicate ids: %s" % dupes)

dead = [t for t, l in zip(titles, links) if l in (None, "#", "")]
if dead:
    problems.append("dead '#' links (%d): %s" % (len(dead), dead[:4]))

# links may carry a ?query; check the base file only
missing = []
for l in links:
    if not l or l.startswith("#"):
        continue
    base = l.split("?", 1)[0]
    if not os.path.exists(base):
        missing.append(l)
if missing:
    problems.append("dangling links: %s" % missing)

pages = {"markets/" + f for f in os.listdir("markets") if f.endswith(".html")}
linked = {l.split("?", 1)[0] for l in links if l and l.startswith("markets/")}
orphans = sorted(pages - linked)
if orphans:
    problems.append("orphaned pages (%d): %s" % (len(orphans), orphans))

# every category used in the data must be reachable from index.html filters
index = open("index.html", encoding="utf-8").read()
reachable = set(re.findall(r"filterCat\('([^']+)'", index))
unreachable = sorted(set(cats) - set(reachable))
if unreachable:
    problems.append("categories with no filter: %s" % unreachable)

# every consumer must read the global this file actually defines (SKEDII vs SKEDEE mismatch is silent)
defined = set(re.findall(r"window\.([A-Z_]+)\s*=\s*\[", src))
for page in ("index.html", "market.html", "search.html"):
    used = set(re.findall(r"window\.([A-Z_]+MARKETS)\b", open(page, encoding="utf-8").read()))
    unknown = used - defined
    if unknown:
        problems.append("%s reads undefined global(s) %s (data file defines %s)" % (page, sorted(unknown), sorted(defined)))

# every data id must be needed: cards with no yes% would render NaN
no_yes = [i for i, y in zip(ids, yes) if y is None]
if no_yes:
    problems.append("entries missing yes probability: %s" % no_yes)

# ---- volume sort, same formula as sortMarkets() in index.html: volNum() --
def vol_num(v):
    m = re.match(r"\s*[^0-9]*([0-9][0-9,\.]*)\s*([KMB])?", v or "")
    if not m:
        return 0.0
    n = float(m.group(1).replace(",", ""))
    return n * {"K": 1e3, "M": 1e6, "B": 1e9}.get((m.group(2) or "").upper(), 1)

order = sorted(range(len(vols)), key=lambda i: -vol_num(vols[i]))
top3 = [vols[i] for i in order[:3]]
if top3[0] != "\u20a6350M":  # the original bug ranked ₦48.2M above ₦350M
    problems.append("volume sort top is %r, expected ₦350M first" % top3[0])
descending = all(vol_num(vols[order[i]]) >= vol_num(vols[order[i + 1]])
                 for i in range(len(order) - 1))
if not descending:
    problems.append("volume sort is not descending")

# ---- report -------------------------------------------------------------
print("entries=%d  unique_ids=%d  pages=%d  linked=%d"
      % (len(rows), len(set(ids)), len(pages), len(linked)))
print("categories=%s" % sorted(set(cats)))
print("volume sort top-3: %s" % top3)
if problems:
    print("\nPROBLEMS:")
    for p in problems:
        print("  -", p)
    raise SystemExit(1)
print("\nAll checks passed.")
