#!/usr/bin/env python3
"""
Builds figma/design-system.svg from the LIVE site CSS, so the Figma sheet can
never drift from what customers see.

Everything on the sheet is read out of public/assets/css/style.css (+ the
arrangement skin) at run time: the :root palette, the radius/shadow tokens and
the real type scale. The component anatomy blocks mirror the current
components (ProductCard.astro, Hero.astro, Toolbar.astro) and embed one real
studio photo so the card diagram shows the true premium backdrop.

Run:  python3 figma/make_design_system.py
Then: drag design-system.svg into Figma -> right-click -> Ungroup.
"""
import base64
import os
import re

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.join(HERE, "..")
CSS = os.path.join(ROOT, "public", "assets", "css", "style.css")
ARR = os.path.join(ROOT, "public", "assets", "css", "arrangement.css")
PHOTO = os.path.join(ROOT, "public", "assets", "img", "opt", "blush-linea-set.jpg")
OUT = os.path.join(HERE, "design-system.svg")

W = 1440
PAD = 64
COL = W - PAD * 2

# ---------------------------------------------------------------- read tokens
raw = open(CSS, encoding="utf-8").read()
root = re.search(r":root\s*\{(.*?)\n\}", raw, re.S).group(1)
tok = dict(re.findall(r"--([\w-]+)\s*:\s*([^;]+);", root))
# the Gallery Noir skin re-declares :root at the end of arrangement.css;
# the LAST declaration wins in CSS, so it must win here too
arr_raw = open(ARR, encoding="utf-8").read()
for blk in re.findall(r":root\s*\{(.*?)\n\}", arr_raw, re.S):
    tok.update(dict(re.findall(r"--([\w-]+)\s*:\s*([^;]+);", blk)))

COLOURS = [
    ("premium", "Studio backdrop behind every product photo"),
    ("gold", "Primary accent, CTAs, badges"),
    ("gold-dark", "Gold hover / pressed"),
    ("gold-soft", "Soft gold fills, chip hover"),
    ("sand", "Warm neutral fill"),
    ("wa", "WhatsApp green"),
    ("wa-dark", "WhatsApp hover"),
    ("ink", "Headings, body"),
    ("ink-soft", "Secondary body"),
    ("muted", "Paragraphs, captions"),
    ("muted-2", "Fine print, kickers"),
    ("bg", "Page background"),
    ("surface", "Cards, sheets"),
    ("surface-2", "Alternate fill"),
    ("surface-3", "Pressed / hover fills"),
    ("line", "Borders, dividers"),
    ("line-soft", "Card borders"),
    ("green", "Legacy brand green (footer, dark bands)"),
    ("amber", "Legacy accent"),
]
RADII = ["radius-xs", "radius-sm", "radius", "radius-lg", "radius-xl", "pill"]
SHADOWS = ["shadow-sm", "shadow-md", "shadow-lg"]

DISPLAY = "Instrument Serif, Georgia, serif"
SANS = "-apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"

def esc(s):
    return s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")

def b64(path):
    with open(path, "rb") as f:
        return base64.b64encode(f.read()).decode("ascii")

photo = b64(PHOTO)

P = []          # svg body parts
y = 0

def band(title, note=""):
    global y
    y += 56
    P.append(f'<text x="{PAD}" y="{y}" font-family="{DISPLAY}" font-size="34" fill="#0B0C0E">{esc(title)}</text>')
    if note:
        P.append(f'<text x="{PAD}" y="{y+24}" font-family="{SANS}" font-size="13" fill="#8A8F93">{esc(note)}</text>')
        y += 24
    y += 34

def rule():
    global y
    P.append(f'<line x1="{PAD}" y1="{y}" x2="{W-PAD}" y2="{y}" stroke="#E4DFD4" stroke-width="1"/>')
    y += 8

# ---------------------------------------------------------------- header
P.append(f'<rect width="{W}" height="150" fill="#FFFFFF"/>')
P.append(f'<text x="{PAD}" y="72" font-family="{DISPLAY}" font-size="52" fill="#0B0C0E">That Furniture Girl — design system</text>')
P.append(f'<text x="{PAD}" y="104" font-family="{SANS}" font-size="15" fill="#515659">Gallery Noir — generated from public/assets/css/style.css + arrangement.css (noir :root wins) · canvas {tok["bg"].strip()} · studio plates --premium {tok["premium"].strip()} · display Instrument Serif</text>')
y = 150

# ---------------------------------------------------------------- colours
band("Colour", "Names match the CSS custom properties exactly — find any of them in style.css by name.")
sw = 148
gap = 14
per_row = (COL + gap) // (sw + gap)
for i, (name, desc) in enumerate(COLOURS):
    val = tok.get(name, "#FFFFFF").strip()
    cx = PAD + (i % per_row) * (sw + gap)
    cy = y + (i // per_row) * 118
    P.append(f'<rect x="{cx}" y="{cy}" width="{sw}" height="64" rx="12" fill="{val}" stroke="#E4DFD4"/>')
    P.append(f'<text x="{cx}" y="{cy+82}" font-family="{SANS}" font-size="13" font-weight="700" fill="#0B0C0E">--{name}</text>')
    P.append(f'<text x="{cx}" y="{cy+98}" font-family="{SANS}" font-size="11.5" fill="#8A8F93">{val}</text>')
y += ((len(COLOURS) + per_row - 1) // per_row) * 118 + 8
rule()

# ---------------------------------------------------------------- type
band("Type", "Headings are Instrument Serif (Google Fonts, loaded in Base.astro). Body is the system sans stack.")
spec = [
    ("Display / h1", 68, DISPLAY, "-.038em", "Furniture that Transforms"),
    ("Heading / h2", 46, DISPLAY, "-.034em", "Trending collections"),
    ("Heading / h3", 25, DISPLAY, "-.024em", "Blush Linea Set"),
    ("Body", 16.5, SANS, "0", "Handcrafted sectionals, sofas and wardrobes made in Ibadan."),
    ("Small / caption", 13.5, SANS, "0", "Same-day delivery in Ibadan & nationwide"),
    ("Eyebrow", 12, SANS, ".1em", "NEW COLLECTION 2026"),
]
for label, size, fam, ls, sample in spec:
    P.append(f'<text x="{PAD}" y="{y+8}" font-family="{SANS}" font-size="12" fill="#8A8F93">{esc(label)} — {size}px</text>')
    P.append(f'<text x="{PAD+230}" y="{y+14}" font-family="{fam}" font-size="{size}" letter-spacing="{ls}" fill="#0B0C0E">{esc(sample)}</text>')
    y += max(46, int(size * 1.5))
y += 16
rule()

# ---------------------------------------------------------------- radius + shadow
band("Radius & elevation", "Radius tokens from :root; shadows drawn with the same two-stop blur the CSS uses.")
x = PAD
for r in RADII:
    val = tok.get(r, "0px").strip()
    rx = 999 if r == "pill" else int(re.sub(r"[^\d]", "", val) or 0)
    P.append(f'<rect x="{x}" y="{y}" width="120" height="76" rx="{min(rx,38)}" fill="#F1ECE2" stroke="#E4DFD4"/>')
    P.append(f'<text x="{x}" y="{y+96}" font-family="{SANS}" font-size="12" font-weight="700" fill="#0B0C0E">--{r}</text>')
    P.append(f'<text x="{x}" y="{y+112}" font-family="{SANS}" font-size="11" fill="#8A8F93">{val}</text>')
    x += 140
x += 40
P.append(f'<rect x="{x-24}" y="{y-16}" width="{3*175+24}" height="118" rx="16" fill="#F1ECE2"/>')
for i, s in enumerate(SHADOWS):
    P.append(f'<rect x="{x}" y="{y+6}" width="150" height="70" rx="16" fill="#FFFFFF" filter="url(#sh{i})"/>')
    P.append(f'<text x="{x}" y="{y+96}" font-family="{SANS}" font-size="12" font-weight="700" fill="#0B0C0E">--{s}</text>')
    x += 175
y += 130
rule()

# ---------------------------------------------------------------- buttons
band("Buttons & chips", "Every CTA on the site is one of these; ordering is WhatsApp-only.")
P.append(f'<rect x="{PAD}" y="{y}" width="210" height="54" rx="999" fill="{tok["gold"].strip()}"/><text x="{PAD+105}" y="{y+34}" text-anchor="middle" font-family="{SANS}" font-size="15" font-weight="700" fill="#0B0C0E">Shop collection</text>')
P.append(f'<rect x="{PAD+230}" y="{y}" width="190" height="54" rx="999" fill="none" stroke="{tok["line"].strip()}"/><text x="{PAD+325}" y="{y+34}" text-anchor="middle" font-family="{SANS}" font-size="15" font-weight="600" fill="#0B0C0E">View products</text>')
P.append(f'<rect x="{PAD+440}" y="{y}" width="230" height="54" rx="999" fill="{tok["wa"].strip()}"/><text x="{PAD+555}" y="{y+34}" text-anchor="middle" font-family="{SANS}" font-size="15" font-weight="700" fill="#FFFFFF">Order on WhatsApp</text>')
P.append(f'<rect x="{PAD+690}" y="{y+10}" width="120" height="34" rx="999" fill="{tok["gold"].strip()}"/><text x="{PAD+750}" y="{y+32}" text-anchor="middle" font-family="{SANS}" font-size="12.5" font-weight="700" fill="#0B0C0E">Chat</text>')
y += 74
P.append(f'<rect x="{PAD}" y="{y}" width="70" height="34" rx="999" fill="#0B0C0E"/><text x="{PAD+35}" y="{y+22}" text-anchor="middle" font-family="{SANS}" font-size="12.5" font-weight="600" fill="#FFFFFF">All</text>')
P.append(f'<rect x="{PAD+80}" y="{y}" width="86" height="34" rx="999" fill="none" stroke="{tok["line"].strip()}"/><text x="{PAD+123}" y="{y+22}" text-anchor="middle" font-family="{SANS}" font-size="12.5" font-weight="600" fill="#33383C">Sofas</text>')
P.append(f'<rect x="{PAD+176}" y="{y}" width="150" height="34" rx="999" fill="{tok["gold-soft"].strip()}" stroke="{tok["gold"].strip()}"/><text x="{PAD+251}" y="{y+22}" text-anchor="middle" font-family="{SANS}" font-size="12.5" font-weight="650" fill="{tok["gold-dark"].strip()}">category pill</text>')
y += 60
rule()

# ---------------------------------------------------------------- product card anatomy
band("Product card anatomy", "The card customers see: 1:1 media on the premium backdrop, badge, name, description, price + Chat.")
cw, ch = 330, 330
cx, cy = PAD, y
P.append(f'<rect x="{cx}" y="{cy}" width="{cw}" height="{ch}" fill="{tok["premium"].strip()}"/>')
P.append(f'<image x="{cx}" y="{cy}" width="{cw}" height="{ch}" href="data:image/jpeg;base64,{photo}" preserveAspectRatio="xMidYMid slice"/>')
P.append(f'<rect x="{cx+12}" y="{cy+12}" width="74" height="24" rx="999" fill="{tok["gold"].strip()}"/><text x="{cx+49}" y="{cy+28}" text-anchor="middle" font-family="{SANS}" font-size="10.5" font-weight="700" fill="#0B0C0E">SETS</text>')
by = cy + ch + 18
P.append(f'<text x="{cx}" y="{by}" font-family="{SANS}" font-size="17" font-weight="700" fill="#0B0C0E">Blush Linea Set</text>')
P.append(f'<text x="{cx}" y="{by+22}" font-family="{SANS}" font-size="13" fill="#515659">Cream boucle, channelled seat, two accents</text>')
P.append(f'<text x="{cx}" y="{by+52}" font-family="{SANS}" font-size="17" font-weight="800" fill="#0B0C0E">&#8358;450,000</text>')
P.append(f'<rect x="{cx+210}" y="{by+32}" width="120" height="38" rx="999" fill="{tok["gold"].strip()}"/><text x="{cx+270}" y="{by+56}" text-anchor="middle" font-family="{SANS}" font-size="13" font-weight="700" fill="#0B0C0E">Chat</text>')
# callouts
lx = cx + cw + 60
for i, (t, d) in enumerate([
    ("media 1:1", "aspect-ratio 1/1, object-fit cover, background var(--premium)"),
    ("category badge", "gold pill, 10.5px, top-left 12px inset"),
    ("name / desc", "17px semibold sans / 13px muted, one line each"),
    ("price + Chat", "price 17px extrabold; Chat pill deep-links to WhatsApp"),
    ("hover", "card lifts 8px, image scales 1.05, shadow-md"),
]):
    ty = cy + 24 + i * 62
    P.append(f'<line x1="{cx+cw}" y1="{ty}" x2="{lx-12}" y2="{ty}" stroke="#CE9A43" stroke-width="1" stroke-dasharray="3 3"/>')
    P.append(f'<circle cx="{cx+cw}" cy="{ty}" r="3" fill="#CE9A43"/>')
    P.append(f'<text x="{lx}" y="{ty-4}" font-family="{SANS}" font-size="13" font-weight="700" fill="#0B0C0E">{esc(t)}</text>')
    P.append(f'<text x="{lx}" y="{ty+14}" font-family="{SANS}" font-size="11.5" fill="#8A8F93">{esc(d)}</text>')
y = by + 90
rule()

# ---------------------------------------------------------------- hero panel anatomy
band("Hero carousel panel", "Greige gradient plate, floating price card, arrows, dots. Autoplay 4s, pauses on hover.")
hw, hh = 380, 470
hx, hy = PAD, y
P.append(f'<defs><linearGradient id="pg" x1="0" y1="0" x2="0.4" y2="1"><stop offset="0" stop-color="#E6DED3"/><stop offset="0.6" stop-color="{tok["premium"].strip()}"/><stop offset="1" stop-color="#CFC5B8"/></linearGradient></defs>')
P.append(f'<rect x="{hx}" y="{hy}" width="{hw}" height="{hh}" rx="24" fill="url(#pg)"/>')
P.append(f'<image x="{hx}" y="{hy}" width="{hw}" height="{hh}" href="data:image/jpeg;base64,{photo}" preserveAspectRatio="xMidYMid slice" opacity="0.92"/>')
P.append(f'<rect x="{hx+16}" y="{hy+hh-72}" width="{hw-32}" height="56" rx="16" fill="#FFFFFF"/><text x="{hx+32}" y="{hy+hh-38}" font-family="{SANS}" font-size="14" font-weight="700" fill="#0B0C0E">Blush Linea Set</text><text x="{hx+hw-32}" y="{hy+hh-38}" text-anchor="end" font-family="{SANS}" font-size="15" font-weight="800" fill="{tok["gold-dark"].strip()}">&#8358;450,000</text>')
for i in range(5):
    P.append(f'<rect x="{hx+hw//2-24+i*11}" y="{hy+hh-92}" width="{18 if i==0 else 7}" height="7" rx="3.5" fill="{"#FFFFFF" if i==0 else "rgba(255,255,255,.55)"}"/>')
lx = hx + hw + 60
for i, (t, d) in enumerate([
    ("plate", "spans eyebrow line -> free-delivery line on desktop"),
    ("price card", "white sheet, name + price, updates with each slide"),
    ("dots", "active dot widens to a pill"),
    ("arrows", "40px circles, ink on hover, restart autoplay"),
]):
    ty = hy + 40 + i * 74
    P.append(f'<line x1="{hx+hw}" y1="{ty}" x2="{lx-12}" y2="{ty}" stroke="#CE9A43" stroke-width="1" stroke-dasharray="3 3"/>')
    P.append(f'<circle cx="{hx+hw}" cy="{ty}" r="3" fill="#CE9A43"/>')
    P.append(f'<text x="{lx}" y="{ty-4}" font-family="{SANS}" font-size="13" font-weight="700" fill="#0B0C0E">{esc(t)}</text>')
    P.append(f'<text x="{lx}" y="{ty+14}" font-family="{SANS}" font-size="11.5" fill="#8A8F93">{esc(d)}</text>')
y = hy + hh + 40
rule()

# ---------------------------------------------------------------- layout rules
band("Layout rules", "Container, gutters and the grids that decide how many cards sit in a row.")
rules = [
    ("container", tok["container"].strip(), "max width of every .container"),
    ("gutter", tok["gutter"].strip(), "inline padding, fluid 18->56px"),
    ("section-y", tok["section-y"].strip(), "vertical rhythm between sections"),
    ("hero grid", "1.12fr / .88fr at >=1100px", "copy left, carousel right; stacks below 680px"),
    ("product grid", "4 / 3 / 2 cols", "at >=1240 / >=900 / >=560px"),
    ("ease", tok["ease"].strip(), "every transition on the site"),
]
for i, (k, v, d) in enumerate(rules):
    ty = y + i * 30
    P.append(f'<text x="{PAD}" y="{ty}" font-family="{SANS}" font-size="13" font-weight="700" fill="#0B0C0E">{esc(k)}</text>')
    P.append(f'<text x="{PAD+180}" y="{ty}" font-family="{SANS}" font-size="13" fill="#33383C">{esc(v)}</text>')
    P.append(f'<text x="{PAD+520}" y="{ty}" font-family="{SANS}" font-size="12" fill="#8A8F93">{esc(d)}</text>')
y += len(rules) * 30 + 48

P.append(f'<text x="{PAD}" y="{y}" font-family="{SANS}" font-size="12" fill="#8A8F93">Generated by figma/make_design_system.py — re-run after any CSS change. Ungroup in Figma; swatch names equal the CSS variable names.</text>')
y += 40

body = "\n".join(P)
svg = f'''<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{y}" viewBox="0 0 {W} {y}">
<defs>
<filter id="sh0" x="-40%" y="-40%" width="180%" height="180%"><feDropShadow dx="0" dy="1" stdDeviation="1" flood-color="#101410" flood-opacity="0.04"/><feDropShadow dx="0" dy="8" stdDeviation="10" flood-color="#101410" flood-opacity="0.16"/></filter>
<filter id="sh1" x="-40%" y="-40%" width="180%" height="180%"><feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#101410" flood-opacity="0.04"/><feDropShadow dx="0" dy="22" stdDeviation="22" flood-color="#101410" flood-opacity="0.24"/></filter>
<filter id="sh2" x="-60%" y="-60%" width="220%" height="220%"><feDropShadow dx="0" dy="34" stdDeviation="35" flood-color="#101410" flood-opacity="0.40"/></filter>
</defs>
<rect width="{W}" height="{y}" fill="#FFFFFF"/>
{body}
</svg>
'''
open(OUT, "w", encoding="utf-8").write(svg)
print(f"wrote {os.path.relpath(OUT, ROOT)}  {W}x{y}  ({os.path.getsize(OUT)//1024} KB)")
