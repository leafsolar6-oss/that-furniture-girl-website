#!/usr/bin/env python3
"""
Builds figma/proposal/*.svg — a NEW design direction drafted as Figma artboards,
using the real studio photography so the proposal reads as the finished site.

Direction: GALLERY NOIR
  · deep ink canvas (#101114) instead of white — the greige studio plates float
    like framed prints in a dark gallery
  · Instrument Serif display type in warm paper (#F4EFE7), gold hairlines
  · product plates keep the premium greige backdrop (#DCD3C8) — it becomes the
    "frame mat" of each print
  · ordering stays WhatsApp-only; no invented urgency; real photos only

These are artboards, not code: review them in Figma first. If approved, the
direction is implemented in public/assets/css/*.css + the .astro components.

Run:  python3 figma/make_proposal.py
"""
import base64
import os
import re

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.join(HERE, "..")
IMG = os.path.join(ROOT, "public", "assets", "img", "opt")
OUTD = os.path.join(HERE, "proposal")
os.makedirs(OUTD, exist_ok=True)

INK = "#101114"
INK2 = "#17181C"
PAPER = "#F4EFE7"
MUTE = "#9A968E"
GOLD = "#CE9A43"
PREMIUM = "#DCD3C8"
SERIF = "Instrument Serif, Georgia, serif"
SANS = "-apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"

W, PAD = 1440, 88

# ---- real catalogue: names, categories and prices come from products.js so
# ---- the proposal can never invent a figure (business rule)
def load_products():
    src = open(os.path.join(ROOT, "src", "data", "products.js"), encoding="utf-8").read()
    out = []
    for pid, body in re.findall(r"\{\s*id: '([^']+)'(.*?)\n  \}", src, re.S):
        g = lambda k: (re.search(k + r":\s*'([^']*)'", body) or [None, None])[1]
        n = lambda k: (re.search(k + r":\s*(\d+)", body) or [None, None])[1]
        out.append(dict(id=pid, name=g('name'), cat=g('cat'), img=g('img'),
                        price=int(n('price')) if n('price') else None,
                        priceTo=int(n('priceTo')) if n('priceTo') else None))
    return out

CATS = {'sofas': 'SOFAS', 'sets': 'SETS', 'tables': 'TABLES', 'storage': 'STORAGE'}
PRODUCTS = {p['id']: p for p in load_products()}

def money(n):
    return "\u20a6" + f"{n:,}"

def price_of(p):
    if p['priceTo']:
        return money(p['price']) + " \u2013 " + money(p['priceTo'])
    if p['price']:
        return money(p['price'])
    return "Price on request"

CACHE = {}
def photo(name):
    if name not in CACHE:
        with open(os.path.join(IMG, name), "rb") as f:
            CACHE[name] = base64.b64encode(f.read()).decode("ascii")
    return CACHE[name]

def esc(s):
    return s.replace("&", "&amp;").replace("<", "&lt;")

class Board:
    def __init__(self):
        self.y = 0
        self.p = []

    def rect(self, x, y, w, h, fill, rx=0, stroke=None, sw=1, op=1):
        s = f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{rx}" fill="{fill}"'
        if stroke:
            s += f' stroke="{stroke}" stroke-width="{sw}"'
        if op != 1:
            s += f' opacity="{op}"'
        self.p.append(s + "/>")

    def text(self, x, y, s, size=14, fill=PAPER, fam=SANS, weight=400, anchor="start", ls=0, style=""):
        self.p.append(f'<text x="{x}" y="{y}" text-anchor="{anchor}" font-family="{fam}" '
                      f'font-size="{size}" font-weight="{weight}" fill="{fill}" '
                      f'letter-spacing="{ls}"{f" font-style=\"{style}\"" if style else ""}>{esc(s)}</text>')

    def img(self, x, y, w, h, name):
        self.p.append(f'<image x="{x}" y="{y}" width="{w}" height="{h}" preserveAspectRatio="xMidYMid slice" '
                      f'href="data:image/jpeg;base64,{photo(name)}"/>')

    def plate(self, x, y, w, h, name, offset=14):
        """greige studio photo as a framed print: gold hairline offset behind."""
        self.rect(x + offset, y + offset, w, h, "none", stroke=GOLD, sw=1, op=0.55)
        self.rect(x, y, w, h, PREMIUM)
        self.img(x, y, w, h, name)

    def pill(self, x, y, label, w=None, fill=GOLD, colour=INK, size=13, weight=700, h=44):
        w = w or (len(label) * size * 0.62 + 44)
        self.rect(x, y, w, h, fill, rx=h / 2)
        self.text(x + w / 2, y + h / 2 + size * 0.36, label, size=size, fill=colour, weight=weight, anchor="middle")
        return w

    def hairline(self, y, colour="rgba(244,239,231,.14)"):
        self.p.append(f'<line x1="{PAD}" y1="{y}" x2="{W-PAD}" y2="{y}" stroke="{colour}" stroke-width="1"/>')

    # ---------------------------------------------------------- shared parts
    def header(self):
        self.rect(0, 0, W, 84, INK)
        self.hairline(84)
        self.text(PAD, 52, "That Furniture Girl", 26, PAPER, SERIF)
        self.text(PAD + 292, 51, "Home", 13.5, MUTE, weight=600)
        self.text(PAD + 356, 51, "Products", 13.5, PAPER, weight=700)
        self.pill(W - PAD - 150, 20, "Chat with us", w=150, h=44)
        self.y = 84

    def marquee(self):
        self.rect(0, self.y, W, 46, INK2)
        self.hairline(self.y, "rgba(244,239,231,.10)")
        self.hairline(self.y + 46, "rgba(244,239,231,.10)")
        msg = "Same-day delivery in Ibadan & nationwide      ·      Custom colours, sizes & designs      ·      Order on WhatsApp 0907 984 9626      ·      "
        self.text(W / 2, self.y + 29, msg + msg[:40], 12, MUTE, ls=1.4, anchor="middle")
        self.y += 46

    def footer(self):
        self.y += 80
        self.hairline(self.y)
        self.y += 56
        self.text(PAD, self.y, "That Furniture Girl", 30, PAPER, SERIF)
        self.text(PAD, self.y + 26, "Your best comfort zone", 12.5, MUTE)
        cols = [("Browse", ["All products", "Sofas", "Sets", "Tables", "Storage"]),
                ("Follow", ["Instagram", "TikTok", "WhatsApp"]),
                ("Visit", ["Iyaganku, New GRA, Ibadan", "0907 984 9626", "@thatfurnituregirl__"])]
        for i, (h, items) in enumerate(cols):
            cx = PAD + 480 + i * 260
            self.text(cx, self.y - 6, h, 12, GOLD, weight=800, ls=1.6)
            for j, it in enumerate(items):
                self.text(cx, self.y + 18 + j * 22, it, 12.5, MUTE)
        self.y += 130
        self.text(PAD, self.y, "© 2026 That Furniture Girl — built to order in Ibadan", 11.5, "rgba(154,150,142,.7)")
        self.y += 64

    # ---------------------------------------------------------- product card
    def card(self, x, y, w, name, price, cat, img):
        ph = int(w * 1.16)
        self.plate(x, y, w, ph, img)
        self.text(x, y + ph + 26, cat, 10.5, GOLD, weight=800, ls=1.8)
        self.text(x, y + ph + 50, name, 19, PAPER, SERIF)
        self.text(x, y + ph + 72, price, 13, MUTE)
        self.p.append(f'<line x1="{x}" y1="{y+ph+88}" x2="{x+58}" y2="{y+ph+88}" stroke="{GOLD}" stroke-width="1.4"/>')
        self.text(x + 68, y + ph + 92, "Chat", 12.5, GOLD, weight=700)
        return ph + 92

    def save(self, name):
        out = os.path.join(OUTD, name)
        svg = (f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{self.y}" '
               f'viewBox="0 0 {W} {self.y}">\n<rect width="{W}" height="{self.y}" fill="{INK}"/>\n'
               + "\n".join(self.p) + "\n</svg>\n")
        open(out, "w", encoding="utf-8").write(svg)
        print(f"wrote figma/proposal/{name}  {W}x{self.y}  ({os.path.getsize(out)//1024} KB)")

# ================================================================= HOME
b = Board()
b.header()
b.marquee()

# hero
hy = b.y + 96
b.text(PAD, hy, "NEW COLLECTION 2026", 11.5, GOLD, weight=800, ls=2.6)
b.text(PAD, hy + 78, "Furniture that", 76, PAPER, SERIF)
b.text(PAD, hy + 156, "Transforms", 76, GOLD, SERIF, style="italic")
b.text(PAD, hy + 234, "your living space", 76, PAPER, SERIF)
b.text(PAD, hy + 286, "Handcrafted sectionals, sofas, wardrobes and centre tables —", 15.5, MUTE)
b.text(PAD, hy + 310, "built to order in Ibadan, in your colour, your size, your fabric.", 15.5, MUTE)
b.pill(PAD, hy + 348, "Shop the collection", w=214)
b.rect(PAD + 234, hy + 348, 168, 44, "none", rx=22, stroke="rgba(244,239,231,.28)")
b.text(PAD + 318, hy + 375, "View products", 13.5, PAPER, weight=600, anchor="middle")
# stats with hairline dividers
sy = hy + 452
for i, (n, l) in enumerate([("1,101", "TikTok followers"), ("59,230", "Likes across our builds"), ("191", "Videos of real work")]):
    sx = PAD + i * 210
    b.p.append(f'<line x1="{sx}" y1="{sy-34}" x2="{sx}" y2="{sy+16}" stroke="rgba(244,239,231,.18)"/>')
    b.text(sx + 18, sy - 6, n, 30, PAPER, SERIF)
    b.text(sx + 18, sy + 14, l, 11.5, MUTE)
# hero plate
pw, phh = 520, 620
px = W - PAD - pw
b.plate(px, hy - 40, pw, phh, "blush-sectional.jpg", offset=18)
b.rect(px + 24, hy + phh - 116, pw - 48, 62, INK, rx=10, op=0.92)
b.text(px + 44, hy + phh - 78, PRODUCTS['blush-sectional']['name'], 15, PAPER, weight=700)
b.text(px + pw - 44, hy + phh - 78, price_of(PRODUCTS['blush-sectional']), 15, GOLD, weight=800, anchor="end")
b.y = hy + phh + 40

# free delivery hairline band
b.hairline(b.y)
b.text(W / 2, b.y + 34, "✓  Free delivery on orders over ₦2,000,000  ·  T&Cs apply", 13, PAPER, anchor="middle", weight=600)
b.hairline(b.y + 56)
b.y += 108

# collection
b.text(PAD, b.y + 20, "The collection", 44, PAPER, SERIF)
b.text(W - PAD, b.y + 16, "All pieces →", 13, GOLD, weight=700, anchor="end")
b.y += 56
cw = (W - PAD * 2 - 3 * 28) // 4
items = [(PRODUCTS[i]['img'], CATS[PRODUCTS[i]['cat']], PRODUCTS[i]['name'], price_of(PRODUCTS[i]))
         for i in ("blush-linea-set", "royal-kinging-set", "centre-table", "wardrobe")]
ch = 0
for i, (img, cat, name, price) in enumerate(items):
    x = PAD + i * (cw + 28)
    ch = max(ch, b.card(x, b.y, cw, name, price, cat, img))
b.y += ch + 40
b.footer()
b.save("home.svg")

# ================================================================= PRODUCTS
b = Board()
b.header()
py = b.y + 84
b.text(PAD, py, "Home  /  Products", 12, MUTE)
b.text(PAD, py + 62, "All products", 62, PAPER, SERIF)
b.text(PAD, py + 96, "Eight pieces from the workshop — every one built to order.", 15, MUTE)
for i, c in enumerate(["All", "Sofas", "Sets", "Tables", "Storage"]):
    x = PAD + i * 108
    if i == 0:
        b.pill(x, py + 126, c, w=76, h=38, size=12.5)
    else:
        b.rect(x, py + 126, 96, 38, "none", rx=19, stroke="rgba(244,239,231,.24)")
        b.text(x + 48, py + 150, c, 12.5, MUTE, weight=600, anchor="middle")
b.y = py + 208

grid = [(p['img'], CATS[p['cat']], p['name'], price_of(p)) for p in load_products()]
cw = (W - PAD * 2 - 3 * 28) // 4
for row in range(2):
    ch = 0
    for i in range(4):
        img, cat, name, price = grid[row * 4 + i]
        x = PAD + i * (cw + 28)
        ch = max(ch, b.card(x, b.y, cw, name, price, cat, img))
    b.y += ch + 44

# closing CTA
b.rect(PAD, b.y, W - PAD * 2, 190, INK2, rx=18)
b.text(PAD + 48, b.y + 78, "Not seeing what you want?", 32, PAPER, SERIF)
b.text(PAD + 48, b.y + 110, "Send your reference, measurements and colour — we quote it and build it.", 14, MUTE)
b.pill(W - PAD - 48 - 210, b.y + 73, "Send us your design", w=210)
b.y += 190
b.footer()
b.save("products.svg")
