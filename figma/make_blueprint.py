#!/usr/bin/env python3
"""
Builds figma/page-blueprints.svg from the BUILT site (dist/), so the blueprint
can never describe a page that no longer exists.

The section list is parsed out of dist/index.html and dist/products.html at
run time — order, ids and classes come from the real markup. Backgrounds come
from the same signatures the CSS uses. Heights are estimates at 1440 px derived
from the CSS (padding + aspect ratios + card counts) and are labelled with
"~" on the sheet; measure in the browser when you need exact numbers.

Run:  npm run build && python3 figma/make_blueprint.py
Then: drag page-blueprints.svg into Figma, ungroup, scale x4.1667 for true 1440.
"""
import os
import re

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.join(HERE, "..")
DIST = os.path.join(ROOT, "dist")
OUT = os.path.join(HERE, "page-blueprints.svg")

INK, MUTED, LINE = "#0B0C0E", "#8A8F93", "#E4DFD4"
GOLD, PREMIUM, WHITE = "#CE9A43", "#DCD3C8", "#FFFFFF"
SANS = "-apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"

# signature -> (label, background, estimated height @1440, columns/note)
KNOWN = {
    "announce":        ("Announcement bar — rotating messages", "#0B0C0E", 40, "marquee, 12.5px"),
    "site-header":     ("Header — brand, Home/Products nav, search, WhatsApp", "#FFFFFF", 76, "sticky, blurs on scroll"),
    "hero":            ("Hero — headline left, carousel right", "#FFFFFF", 648, "grid 1.12fr/.88fr >=1100px"),
    "stats-band":      ("Numbers band \u2014 followers, likes, videos", "#F6F1E9", 300, "3 cols, count-up serif figures"),
    "freedelivery":    ("Free delivery band — over ₦2,000,000", "#FFFFFF", 78, "hairline top+bottom"),
    "collection":      ("Collection — toolbar + product grid", "#FFFFFF", 1120, "chips, search, range, toggle; 4 cols"),
    "page-head":       ("Page head — breadcrumb, H1, category pills", "#FFFFFF", 268, "breadcrumb 13px, H1 52px"),
    "page-cta":        ("Closing CTA — send us your design", "#F1ECE2", 300, "gradient sheet, 2 buttons"),
    "workshop":        ("Workshop band — real photos + verified counts", "#F6F1E9", 560, "2 arched photos, 3 proof chips"),
    "process":         ("Process — message to delivery in 4 steps", "#FFFFFF", 420, "4 columns at >=820px"),
    "materials":       ("Materials & colours — aggregated from catalogue", "#F6F1E9", 470, "chip rows from products.js"),
    "showroom":        ("Showroom — address, phone, plan my visit", "#FFFFFF", 560, "split, arched photo"),
    "faqband":         ("FAQ — five factual answers", "#FFFFFF", 520, "details/summary, no JS"),
    "site-footer":     ("Footer — brand, Browse, Follow, Contact", "#004B1F", 430, "4 columns at >=980px"),
}

def sections_of(page):
    html = open(os.path.join(DIST, page), encoding="utf-8").read()
    main = re.search(r"<main\b[^>]*>(.*)</main>", html, re.S).group(1)
    out = []
    for m in re.finditer(r'<section class="([^"]*)"([^>]*)>', main):
        cls, rest = m.group(1), m.group(2)
        sid = re.search(r'id="([^"]+)"', rest)
        key = None
        for k in ("hero", "stats-band", "freedelivery", "page-head", "page-cta", "collection",
                  "workshop", "process", "materials", "showroom", "faqband"):
            if k in cls or (sid and sid.group(1) == k):
                key = k
                break
        if key is None:
            key = cls.split()[0]
        out.append((key, sid.group(1) if sid else ""))
    return out

PAGES = [("Home", "index.html"), ("Products", "products.html")]

SCALE = 0.25            # 1440 -> 360
PW = int(1440 * SCALE)  # page column width
GAP = 56
PAD = 64

panels = []
for pi, (name, fn) in enumerate(PAGES):
    secs = sections_of(fn)
    blocks = []
    y = 0
    for key, sid in [("announce", ""), ("site-header", "")] + secs + [("site-footer", "")]:
        label, bg, h, note = KNOWN.get(key, (key, "#FFFFFF", 120, ""))
        blocks.append((label, bg, h, note, sid))
        y += h
    panels.append((name, fn, blocks, y))

total_h = max(p[3] for p in panels)
H = int(total_h * SCALE) + 320

W = PAD * 2 + PW * len(panels) + GAP * (len(panels) - 1) + 380  # + side index column
svg = [f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}">',
       f'<rect width="{W}" height="{H}" fill="#FFFFFF"/>',
       f'<text x="{PAD}" y="64" font-family="{SANS}" font-size="34" font-weight="800" fill="{INK}">Page blueprints — live site, 2 pages</text>',
       f'<text x="{PAD}" y="90" font-family="{SANS}" font-size="13" fill="{MUTED}">Parsed from dist/ at build time · scale 1:4 (multiply by 4.1667 for true 1440) · heights "~" are CSS estimates at 1440 px</text>']

for pi, (name, fn, blocks, total) in enumerate(panels):
    x = PAD + pi * (PW + GAP)
    y = 130
    svg.append(f'<text x="{x}" y="{y}" font-family="{SANS}" font-size="18" font-weight="800" fill="{INK}">{name}</text>')
    svg.append(f'<text x="{x+PW}" y="{y}" text-anchor="end" font-family="{SANS}" font-size="12" fill="{MUTED}">{fn} · ~{total}px</text>')
    y += 14
    for label, bg, h, note, sid in blocks:
        bh = max(6, int(h * SCALE))
        fill = bg if bg != "#FFFFFF" else "#FAF8F4"
        svg.append(f'<rect x="{x}" y="{y}" width="{PW}" height="{bh}" fill="{fill}" stroke="{LINE}"/>')
        dark = bg in ("#0B0C0E", "#004B1F")
        if bh >= 16:
            svg.append(f'<text x="{x+8}" y="{y+15}" font-family="{SANS}" font-size="10" font-weight="700" fill="{"#FFFFFF" if dark else INK}">{label.split("—")[0].strip()}</text>')
            if bh >= 30:
                svg.append(f'<text x="{x+8}" y="{y+27}" font-family="{SANS}" font-size="8.5" fill="{"rgba(255,255,255,.75)" if dark else MUTED}">~{h}px · {note}</text>')
        y += bh
    # grid overlay hint on the collection block
    y += 26

# ---- side index -----------------------------------------------------------
ix = PAD + len(panels) * (PW + GAP)
iy = 130
svg.append(f'<text x="{ix}" y="{iy}" font-family="{SANS}" font-size="16" font-weight="800" fill="{INK}">Section index</text>')
iy += 26
seen = []
for name, fn, blocks, total in panels:
    svg.append(f'<text x="{ix}" y="{iy}" font-family="{SANS}" font-size="12.5" font-weight="800" fill="{GOLD}">{name}</text>')
    iy += 18
    for label, bg, h, note, sid in blocks:
        if label in seen:
            continue
        seen.append(label)
        svg.append(f'<text x="{ix+10}" y="{iy}" font-family="{SANS}" font-size="11" fill="{MUTED}">· {label}</text>')
        iy += 15
    iy += 10

iy += 16
svg.append(f'<text x="{ix}" y="{iy}" font-family="{SANS}" font-size="16" font-weight="800" fill="{INK}">Component inventory</text>')
iy += 22
for c in ["product card (1:1 media, badge, name, desc, price + Chat)",
          "filter chip / category pill", "search box", "price range + output",
          "grid/list toggle", "hero price card", "carousel dots + arrows",
          "breadcrumb", "WhatsApp pill (gold / green)", "free-delivery band",
          "closing CTA sheet", "announcement marquee"]:
    svg.append(f'<text x="{ix}" y="{iy}" font-family="{SANS}" font-size="11" fill="{MUTED}">· {c}</text>')
    iy += 15

iy += 20
svg.append(f'<text x="{ix}" y="{iy}" font-family="{SANS}" font-size="16" font-weight="800" fill="{INK}">Rules the design keeps</text>')
iy += 22
for r in ["Ordering is WhatsApp only — no cart, no checkout.",
          "No invented urgency: no countdowns, fake strikes,",
          "   star ratings or made-up customer counts.",
          "Real photos only — her own Instagram / TikTok shots,",
          "   now on the premium greige studio backdrop.",
          "Reviews section stays hidden until a real review exists.",
          "Every figure on the page is real and verified."]:
    svg.append(f'<text x="{ix}" y="{iy}" font-family="{SANS}" font-size="11" fill="{MUTED}">{r}</text>')
    iy += 15

svg.append('</svg>')
open(OUT, "w", encoding="utf-8").write("\n".join(svg))
print(f"wrote {os.path.relpath(OUT, ROOT)}  {W}x{H}")
for name, fn, blocks, total in panels:
    print(f"  {name}: {len(blocks)} blocks, ~{total}px")
