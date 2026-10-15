#!/usr/bin/env python3
"""
Generates figma/page-blueprints.svg — a Figma-importable blueprint of all four
pages of the That Furniture Girl site.

The section list, order, pixel heights, background colours, grid columns and
card counts were measured from the real pages at a 1440 px viewport
(Playwright, viewport 1440x1000, .reveal forced visible so lazy sections have
their true height). Re-run the measurement and update SITE if the markup
changes; then re-run this file.

Every block is a real SVG layer, so in Figma you can ungroup, restyle or
rebuild any section without touching the site.
"""
import html, os

W = 1600
SCALE = 0.24          # 1440 px page -> 345.6 px blueprint column
COLW = 1440 * SCALE
GAP = 28
MARGIN = (W - (4 * COLW + 3 * GAP)) / 2
TOP = 214
HEADER_H = 150
FOOT_H = 132

GREEN, GREEN_DARK, AMBER, AMBER_SOFT = "#004B1F", "#003716", "#CE9A43", "#F7EEDD"
BG, INK, MUTED, LINE, LINE_SOFT = "#F7F5EF", "#0B0C0E", "#515659", "#E4DFD4", "#EFEAE0"

FONT = "Plus Jakarta Sans, Inter, Helvetica Neue, Arial, sans-serif"

# (number, label, pixel height, computed background, grid columns, card count, chrome)
HOME = [
    ("Sticky header — logo, nav, search, gold WhatsApp pill", 75, "rgba(247,245,239,0.86)", 0, 0, True),
    ("Hero — 2-col: copy + 3 real stats | photo panel with chips", 786, BG, 2, 0, False),
    ("Same-day delivery strip — 3 points", 243, BG, 0, 0, False),
    ("Category showcase — 3 tiles (sofas / sets / tables)", 835, BG, 2, 3, False),
    ("#collection — Trending pieces: gold tabs, search, price, view toggle + 4-up grid", 1682, BG, 4, 7, False),
    ("Ready right now — what is finished in the showroom", 582, BG, 2, 0, False),
    ("This week's two favourites — 2-up deal cards", 704, BG, 2, 2, False),
    ("Promo pair — sofas + wardrobes (2 cards)", 372, BG, 2, 2, False),
    ("The Royal Kinging Set — signature build (ink)", 707, GREEN, 2, 0, False),
    ("#custom — tell us the look, we build it (surface)", 859, "#FDFBF9", 2, 0, False),
    ("How it works — 4 numbered steps", 631, BG, 4, 4, False),
    ("Loved on TikTok — 191 videos (ink)", 815, GREEN, 3, 0, False),
    ("Guides & stories — 3-up article cards", 967, BG, 3, 3, False),
    ("Instagram — 5-up real photo grid", 574, BG, 5, 5, False),
    ("FAQs — accordion + green ask card", 920, BG, 2, 0, False),
    ("Newsletter — hands off to WhatsApp", 564, BG, 0, 0, False),
    ("Come and see — showroom / contact card", 542, BG, 0, 0, False),
    ("Footer — cream, 4 columns, contact rows, chips", 526, "#FDFBF9", 4, 0, False),
]

SHOP = [
    ("Sticky header", 75, "rgba(247,245,239,0.86)", 0, 0, True),
    ("Page hero — The collection", 350, BG, 0, 0, False),
    ("All pieces — same toolbar + 4-up grid, 8 cards", 1351, BG, 4, 8, False),
    ("If you can picture it (surface)", 790, "#FDFBF9", 2, 0, False),
    ("Before you order — FAQ", 645, BG, 2, 0, False),
    ("CTA band (ink)", 325, GREEN, 0, 0, False),
    ("Footer — cream, 4 columns", 526, "#FDFBF9", 4, 0, False),
]

ABOUT = [
    ("Sticky header", 75, "rgba(247,245,239,0.86)", 0, 0, True),
    ("Page hero — ink + photo", 491, GREEN, 0, 0, False),
    ("How it started — story", 742, BG, 2, 0, False),
    ("What we stand for (surface)", 884, "#FDFBF9", 2, 0, False),
    ("The craft — what goes into a piece", 859, BG, 2, 0, False),
    ("Why customers stay — quote (ink)", 998, GREEN, 2, 0, False),
    ("CTA band (ink)", 376, GREEN, 0, 0, False),
    ("Footer — cream, 4 columns", 526, "#FDFBF9", 4, 0, False),
]

CONTACT = [
    ("Sticky header", 75, "rgba(247,245,239,0.86)", 0, 0, True),
    ("Page hero — Visit & contact", 389, BG, 0, 0, False),
    ("Contact card + map + hours (3-col)", 1212, BG, 3, 0, False),
    ("Ordering — 4 steps", 1185, BG, 2, 4, False),
    ("Quick answers (surface)", 620, "#FDFBF9", 2, 0, False),
    ("CTA band (ink)", 325, GREEN, 0, 0, False),
    ("Footer — cream, 4 columns", 526, "#FDFBF9", 4, 0, False),
]

PAGES = [("Home", "index.html", HOME), ("Shop", "shop.html", SHOP),
         ("About", "about.html", ABOUT), ("Contact", "contact.html", CONTACT)]


def esc(s):
    return html.escape(s, quote=True)


def rect(x, y, w, h, r=0, fill="none", stroke=None, sw=1, opacity=None):
    s = f'<rect x="{x:.1f}" y="{y:.1f}" width="{w:.1f}" height="{h:.1f}"'
    if r:
        s += f' rx="{r}"'
    s += f' fill="{fill}"'
    if stroke:
        s += f' stroke="{stroke}" stroke-width="{sw}"'
    if opacity is not None:
        s += f' opacity="{opacity}"'
    return s + ' />'


def text(x, y, s, size=12, fill=INK, weight=400, anchor="start", ls=0, opacity=None):
    t = (f'<text x="{x:.1f}" y="{y:.1f}" font-family="{FONT}" font-size="{size}" '
         f'font-weight="{weight}" fill="{fill}" text-anchor="{anchor}"')
    if ls:
        t += f' letter-spacing="{ls}"'
    if opacity is not None:
        t += f' opacity="{opacity}"'
    return t + f'>{esc(s)}</text>'


def col_run(entries, x, top, title, sub):
    """Draw one page column; returns (svg, bottom_y)."""
    out = [text(x, top - 34, title, 17, INK, 800, ls="-0.4"),
           text(x, top - 15, sub, 10.5, MUTED, 600)]
    frame_h = sum(e[1] for e in entries) * SCALE
    out.append(rect(x, top, COLW, frame_h, 6, "#FFFFFF", LINE_SOFT, 1))
    y = top
    for i, (label, ph, bg, cols, cards, chrome) in enumerate(entries, 1):
        h = ph * SCALE
        if chrome:
            fill = "#FFFFFF"
        elif bg == GREEN:
            fill = GREEN
        elif bg == "#FFFFFF":
            fill = "#FFFFFF"
        else:
            fill = BG
        out.append(rect(x, y, COLW, h, 4, fill, LINE, 0.8))
        dark = (bg == GREEN)
        out.append(text(x + 9, y + 13, f"{i:02d}", 8.5, AMBER if dark else MUTED, 800))
        # label wraps onto up to 2 lines at ~46 chars
        words, lines, cur = label.split(), [], ""
        for wd in words:
            if len(cur + " " + wd) > 44 and cur:
                lines.append(cur); cur = wd
            else:
                cur = (cur + " " + wd).strip()
        lines.append(cur)
        for li, ln in enumerate(lines[:2]):
            out.append(text(x + 24, y + 13 + li * 11, ln, 8.5,
                            "#FFFFFF" if dark else ("#2E352F" if bg == "#FFFFFF" else "#414741"), 600))
        # wireframe hints: card boxes
        if cards:
            rows = max(1, (cards + max(cols, 1) - 1) // max(cols, 1))
            per = min(cards, max(cols, 1))
            bw = (COLW - 18 - (per - 1) * 5) / per
            bh = min(20, max(9, (h - 34) / rows - 5))
            for c in range(cards):
                r_, c_ = divmod(c, per)
                bx = x + 9 + c_ * (bw + 5)
                by = y + h - (rows * (bh + 5)) + r_ * (bh + 5) - 4
                if by < y + 20:
                    by = y + 20
                out.append(rect(bx, by, bw, bh, 2.5,
                                "#E7F1EA" if dark else ("#FFFFFF" if bg == "#FFFFFF" else "#FFFFFF"),
                                "#CFE0D6" if dark else LINE, 0.7))
        else:
            # text-line hints
            if h > 34:
                for li in range(2):
                    lw = COLW * (0.62 - li * 0.16)
                    out.append(rect(x + 24, y + h - 16 + li * 6, lw, 2.4, 1.2,
                                    "#7FAE92" if dark else "#DDDDDD"))
        y += h
    out.append(text(x, y + 16, f"{sum(e[1] for e in entries):,} px tall".replace(",", " ") +
                    f"  ·  {len(entries)} sections", 9.5, MUTED, 700))
    return "\n".join(out), y


def panel(x, y, w, title, rows, fill="#FFFFFF"):
    lh = 15
    h = 34 + len(rows) * lh + 12
    out = [rect(x, y, w, h, 10, fill, LINE, 1),
           text(x + 16, y + 24, title, 11.5, INK, 800, ls="0.2")]
    yy = y + 42
    for r in rows:
        out.append(text(x + 16, yy, r, 9.5, MUTED, 500))
        yy += lh
    return "\n".join(out), h


def build():
    o = ['<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="{H}" '
         'viewBox="0 0 1600 {H}">'.format(H=0).replace('width="1600" height="0"', 'width="1600" height="__H__"')]
    body = []
    # header band
    body.append(rect(0, 0, W, HEADER_H, 0, GREEN))
    body.append(rect(MARGIN, 42, 34, 34, 11, AMBER))
    body.append(text(MARGIN + 48, 68, "That Furniture Girl — page blueprints", 23, "#FFFFFF", 800, ls="-0.6"))
    body.append(text(MARGIN + 48, 92,
                     "All four pages at 1440 px, drawn at 1:4. Section order, heights, background and card counts "
                     "measured from the live site, not sketched.", 11, "#CFE0D6", 500))
    body.append(text(MARGIN + 48, 112,
                     "Not drawn on purpose: #reviews sits in the markup but stays hidden until real customer reviews "
                     "exist. No fake ratings, discounts or countdowns anywhere.", 11, AMBER, 600))
    body.append(text(W - MARGIN, 58, "FIGMA BLUEPRINT", 10, AMBER, 800, "end", ls="1.2"))
    body.append(text(W - MARGIN, 76, "Import: drag onto the canvas", 9.5, "#CFE0D6", 500, "end"))
    body.append(text(W - MARGIN, 90, "then right-click → Ungroup", 9.5, "#CFE0D6", 500, "end"))
    body.append(text(W - MARGIN, 104, "Scale 1 px = 4 px", 9.5, "#CFE0D6", 500, "end"))

    bottoms = {}
    for i, (name, fn, entries) in enumerate(PAGES):
        x = MARGIN + i * (COLW + GAP)
        sub = f"{fn}  ·  1440 px wide  ·  drawn 1:4"
        svg, bottom = col_run(entries, x, TOP, name, sub)
        body.append(svg)
        bottoms[name] = bottom

    # notes panel in the empty space under the three shorter columns
    px = MARGIN + 1 * (COLW + GAP)
    pw = 3 * COLW + 2 * GAP
    py = max(bottoms["Shop"], bottoms["About"], bottoms["Contact"]) + 46
    if py + 300 < TOP + sum(e[1] for e in HOME) * SCALE:
        cw = (pw - 3 * 18) / 4
        p1, h1 = panel(px, py, cw, "Grid scale", [
            "1 column  < 560 px",
            "2 columns ≥ 560 px",
            "3 columns ≥ 900 px",
            "4 columns ≥ 1200 px",
        ])
        p2, h2 = panel(px + (cw + 18), py, cw, "Container", [
            "max 1280 px, centred",
            "gutter clamp(18px, 4vw, 56px)",
            "section-y clamp(56px, 8vw, 112px)",
            "card radius 20 px, pill 999 px",
        ])
        p3, h3 = panel(px + 2 * (cw + 18), py, cw, "Section colour", [
            "page background  #F7F5EF",
            "surface / sand   #FFFFFF",
            "ink band         #004B1F",
            "gold accent      #CE9A43",
            "WhatsApp green   #1FA34A",
        ])
        p4, h4 = panel(px + 3 * (cw + 18), py, cw, "Rules we keep", [
            "ordering is WhatsApp only",
            "no cart, no payment step",
            "prices are real, no strike-through",
            "her own photos, real copy only",
        ])
        body += [p1, p2, p3, p4]
        py2 = py + max(h1, h2, h3, h4) + 22
        p5, h5 = panel(px, py2, pw, "How to use this file", [
            "1.  Drop page-blueprints.svg onto a Figma page. Each page column is one frame — 345.6 px wide on the canvas, so scale by 4.1667 to work at real 1440 px.",
            "2.  Ungroup once, then ungroup a section to get its blocks. Use the design-system.svg file for the colours, type styles, buttons, badges and the product card.",
            "3.  Rebuild a section by drawing over its block, then name the frame with the CSS class in the label (e.g. .collection, .section--ink) so engineers can map design to code.",
            "4.  Keep the section order. Each page is already ordered the way the live site is, from sticky header to footer.",
        ])
        body.append(p5)
        py3 = py2 + h5 + 22
        half = 2 * cw + 18
        idx_rows = []
        for i, (label, ph, bg, cols, cards, chrome) in enumerate(HOME, 1):
            short = label.split(" — ")[0]
            extra = label.split(" — ")[1] if " — " in label else ""
            idx_rows.append(f"{i:02d}   {short}" + (f"   ·   {extra}" if extra else "") + f"   ·   {ph} px")
        p6, h6 = panel(px, py3, half, "Home page section index (top to bottom)", idx_rows)
        comp = [
            "Product card        .product  (media, badges, tools, body, price, Order)",
            "Filter chip           .chip[aria-pressed]",
            "Buttons                .btn.btn--primary / --amber / --outline / --ghost / --light",
            "Badges                 .badge  (NEW, BEST SELLER, SIGNATURE, AVAILABLE NOW, READY NOW)",
            "Search overlay       .search-panel  ·  opens from [data-open-search]",
            "Quick view             .modal  ·  .modal.is-open  ·  .modal:empty hidden",
            "Hero panel             .hero__panel  ·  slides, chips, arrows, dots",
            "Filter toolbar         .collection-top  ·  tabs + search + price + view toggle",
            "Deal / promo cards .deal  ·  .promo",
            "Quote card            .quote-card  (hidden while TFG_TESTIMONIALS is empty)",
            "Guide card            .post",
            "Instagram tile        .ig-tile  (real photos from her page)",
            "FAQ item               .faq-item  ·  ask card  .faq-ask",
            "Step card              .step  (How it works, Ordering)",
            "Newsletter              #newsletterForm  ·  hands off to WhatsApp",
            "Sticky header        .site-header  ·  drawer, search, WhatsApp CTA",
        ]
        p7, h7 = panel(px + half + 18, py3, half, "Component inventory (CSS class names)", comp)
        body += [p6, p7]

    sheet_h = max(TOP + sum(e[1] for e in HOME) * SCALE + 60, py3 + max(h6, h7) + 50)
    sheet_h = int(sheet_h) + FOOT_H
    body.append(rect(0, sheet_h - FOOT_H, W, FOOT_H, 0, INK))
    body.append(text(MARGIN, sheet_h - FOOT_H + 34,
                     "Blueprint of the live site · That Furniture Girl, Iyaganku New GRA, Ibadan · WhatsApp 0907 984 9626",
                     10.5, "#FFFFFF", 600))
    body.append(text(MARGIN, sheet_h - FOOT_H + 54,
                     "Generated by figma/make_blueprint.py from measurements of index.html, shop.html, about.html and contact.html.",
                     9.5, "#9AA09A", 500))
    body.append(text(W - MARGIN, sheet_h - FOOT_H + 34, "github.com/leafsolar6-oss/that-furniture-girl-website",
                     10.5, AMBER, 700, "end"))

    head = ('<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="%d" viewBox="0 0 1600 %d">'
            '<rect width="1600" height="%d" fill="#FFFFFF"/>' % (sheet_h, sheet_h, sheet_h))
    return head + "\n".join(body) + "</svg>", sheet_h


if __name__ == "__main__":
    svg, h = build()
    out = os.path.join(os.path.dirname(os.path.abspath(__file__)), "page-blueprints.svg")
    with open(out, "w", encoding="utf-8") as f:
        f.write(svg)
    print("wrote", out, len(svg), "bytes, 1600 x", h)
