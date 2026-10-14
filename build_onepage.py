#!/usr/bin/env python3
"""
build_onepage.py — bundles the multi-page site into ONE self-contained HTML file.

Why: the multi-page version in this folder is what you host (index.html,
shop.html, about.html, contact.html + assets). This script also produces
`that-furniture-girl-one-page.html`, a single file with every section, with the
CSS, JavaScript, fonts and photos embedded inside it — handy for previewing,
emailing, or dropping onto any host as one file.

Run it from the project folder:   python3 build_onepage.py
"""

import base64
import mimetypes
import pathlib
import re

ROOT = pathlib.Path(__file__).parent
OUT_NAME = "that-furniture-girl-one-page.html"

PAGES = [
    ("index.html",   "#home"),
    ("shop.html",    "#shop"),
    ("about.html",   "#story"),
    ("contact.html", "#visit"),
]

LINK_MAP = {
    "index.html":    "#home",
    "shop.html":     "#shop",
    "about.html":    "#story",
    "contact.html":  "#visit",
    "index.html#custom": "#custom",
    "shop.html#cat-sofas": "#shop",
    "shop.html#cat-sets": "#shop",
    "shop.html#cat-tables": "#shop",
    "shop.html#cat-storage": "#shop",
}


def read(path):
    return (ROOT / path).read_text(encoding="utf-8")


def data_uri(path: pathlib.Path) -> str:
    mime = mimetypes.guess_type(path.name)[0] or "application/octet-stream"
    if path.suffix == ".woff2":
        mime = "font/woff2"
    b64 = base64.b64encode(path.read_bytes()).decode("ascii")
    return f"data:{mime};base64,{b64}"


def inline_css() -> str:
    css = read("assets/css/style.css")
    for font in sorted((ROOT / "assets" / "fonts").glob("*.woff2")):
        rel = f"../fonts/{font.name}"
        css = css.replace(rel, data_uri(font))
    return css


def extract_main(html: str) -> str:
    m = re.search(r"<main>(.*?)</main>", html, re.S)
    if not m:
        raise SystemExit("No <main> block found — check the page structure.")
    return m.group(1).strip()


def rewrite_links(html: str) -> str:
    for src, dst in sorted(LINK_MAP.items(), key=lambda kv: -len(kv[0])):
        html = html.replace(f'href="{src}"', f'href="{dst}"')
    html = re.sub(r'\s+aria-current="page"', "", html)
    return html


def main() -> None:
    index_html = read("index.html")

    # ---- head / shell from index.html ----------------------------------
    head_meta = re.search(r"<head>(.*?)</head>", index_html, re.S).group(1)
    head_meta = re.sub(r"<title>.*?</title>", "", head_meta, flags=re.S)
    head_meta = re.sub(r'<link rel="stylesheet".*?>', "", head_meta, flags=re.S)
    head_meta = re.sub(r'<link rel="icon".*?>', "", head_meta, flags=re.S)

    title = ("<title>That Furniture Girl — Handcrafted Furniture in Ibadan, Nigeria"
             "</title>\n"
             '<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' '
             "viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='9' fill='%23004B1F'/%3E"
             "%3Cg fill='none' stroke='%23FFB600' stroke-width='1.7' stroke-linecap='round'%3E"
             "%3Cpath d='M8 17v-4.5A2.5 2.5 0 0 1 10.5 10h11A2.5 2.5 0 0 1 24 12.5V17'/%3E"
             "%3Cpath d='M6 18a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v3H6z'/%3E"
             "%3Cpath d='M9 21v2M23 21v2'/%3E%3C/g%3E%3C/svg%3E\">")
    # the theme-colour meta is read from index.html; keep it in step with --bg

    # ---- global chrome (announce / header / drawer / footer / fab) ------
    announce = re.search(r'(<div class="announce".*?</div>\s*</div>\s*</div>)', index_html, re.S).group(1)
    # the shared chrome also carries page links — rewrite them like any section,
    # otherwise the one-page file points at index.html / shop.html and 404s
    header = rewrite_links(re.search(r'(<header class="site-header".*?</header>)', index_html, re.S).group(1))
    chrome = rewrite_links(re.search(r'(<div class="scrim".*?</aside>)', index_html, re.S).group(1))
    footer = rewrite_links(re.search(r'(<footer class="site-footer".*?</footer>)', index_html, re.S).group(1))
    fab = rewrite_links(re.search(r'(<a class="fab".*?</a>)', index_html, re.S).group(1))
    modal = '<div class="modal" id="productModal" aria-live="polite"></div>'

    # ---- sections ------------------------------------------------------
    sections = []
    for i, (page, anchor) in enumerate(PAGES):
        html = index_html if page == "index.html" else read(page)
        main_html = rewrite_links(extract_main(html))

        if i == 0:
            # give the hero an id so the nav can point at it
            main_html = main_html.replace('<section class="hero">', '<section class="hero" id="home">', 1)
            main_html = main_html.replace('<section class="section" id="collection">',
                                          '<section class="section section--tight" id="collection">', 1)
        else:
            marker = f'<span id="{anchor[1:]}"></span>'
            main_html = marker + "\n" + main_html
            # soften the inner-page hero blocks so they read as section dividers
            main_html = main_html.replace('class="page-hero page-hero--ink page-hero--media"',
                                          'class="page-hero page-hero--ink page-hero--media"', 1)

        sections.append(f"<!-- ============ {page} ============ -->\n{main_html}")

    # the bundled page only needs one modal + one scripts block
    body = "\n\n".join(sections)
    body = re.sub(r'<div class="modal" id="productModal"[^>]*></div>', "", body)
    body = re.sub(r'<noscript>.*?</noscript>', "", body, flags=re.S)

    # ---- photo map: lets the JS resolve product images without any files --
    products_src = read("assets/js/products.js")
    photos = sorted(set(re.findall(r"img:\s*'([^']+)'", products_src)))
    img_map_entries = []
    for name in photos:
        photo = ROOT / "assets" / "img" / "opt" / name
        if photo.exists():
            img_map_entries.append(f'  "{name}": "{data_uri(photo)}"')
    img_map = "window.TFG_IMG_MAP = {\n" + ",\n".join(img_map_entries) + "\n};"

    products_js = read("assets/js/products.js").replace(
        "assets/js/products.js", "the product list below")

    out = f"""<!DOCTYPE html>
<html lang="en-NG">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
{title}
{head_meta.strip()}
<style>
/* ---- stylesheet, fonts embedded ---- */
{inline_css()}
</style>
</head>
<body>

<div class="announce" aria-hidden="true">
  <div class="announce__track">
    <span>Same-day delivery in Ibadan &amp; nationwide</span><span class="announce__dot"></span>
    <span>Custom colours, sizes &amp; designs</span><span class="announce__dot"></span>
    <span>Order on WhatsApp &middot; 0907 984 9626</span><span class="announce__dot"></span>
    <span>Same-day delivery in Ibadan &amp; nationwide</span><span class="announce__dot"></span>
    <span>Custom colours, sizes &amp; designs</span><span class="announce__dot"></span>
    <span>Order on WhatsApp &middot; 0907 984 9626</span><span class="announce__dot"></span>
  </div>
</div>

{header}

{chrome}

<main>

{body}

</main>

{footer}

{fab}

{modal}

<script>
{img_map}
</script>
<script>
{products_js}
</script>
<script>
{read("assets/js/main.js")}
</script>
</body>
</html>
"""

    # ---- inline every photo and logo -------------------------------------
    def swap(match):
        rel = match.group(0)
        path = ROOT / rel
        return data_uri(path) if path.exists() else rel

    # photos used by the JS live in assets/img/opt/ and are mapped above;
    # everything else referenced directly in the markup gets embedded here
    out = re.sub(r"assets/img/(?!opt/)(?:[\w\-]+/)?[\w.\-]+\.(?:jpg|jpeg|png)", swap, out)
    out = re.sub(r"assets/img/opt/[\w.\-]+\.jpg", swap, out)

    (ROOT / OUT_NAME).write_text(out, encoding="utf-8")
    size_mb = (ROOT / OUT_NAME).stat().st_size / 1024 / 1024
    real = re.findall(r'(?:src|href)="(assets/[^"]+)"', out)
    print(f"wrote {OUT_NAME}  ({size_mb:.2f} MB)")
    print("un-inlined asset references:", sorted(set(real)) or "none")
    print(f"photos embedded: {len(photos)}")


if __name__ == "__main__":
    main()
