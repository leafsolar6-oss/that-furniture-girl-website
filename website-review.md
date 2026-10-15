# Expert review — thatfurnituregirl (Atelier Blanc build)

Compiled 2026-10-15 from primary sources: Google **web.dev**, **Nielsen Norman Group**,
**W3C WCAG 2.2**. Each finding states the guidance (quoted), our audited current state,
a verdict, and the proposed tweak.

> **Status 2026-10-15:** clusters **A + B + C + D approved and implemented** (this commit).
> Cluster E (CSS minify, WebP pipeline) remains backlog.

Verdicts: `PASS` = already compliant · `TWEAK` = small fix proposed · `CONFLICT` = expert
guidance vs. an owner decision, resolved by design · `OPTIONAL` = worth it, not urgent.

---

## 1. Loading performance & Core Web Vitals — `TWEAK`

**Source:** web.dev, *Web Vitals* & *Largest Contentful Paint* —
"sites should strive to have Largest Contentful Paint of **2.5 seconds or less**";
thresholds: LCP ≤ 2.5 s, INP ≤ 200 ms, CLS ≤ 0.1.
**Source:** web.dev, *Preload critical assets* — "Preloading is best suited for resources
typically discovered **late** by the browser" (fonts are the classic example: the browser
finds them only after parsing CSS).

**Our state:** all images carry width/height (CLS-safe), JS is deferred, zero third-party
requests, fonts self-hosted with `swap`. But the hero plate (our LCP element) is discovered
at normal priority, and the two woff2 files wait behind the stylesheet parse.
**Proposed tweak (A):** `<link rel="preload">` for both woff2 files + the first hero image,
and `fetchpriority="high"` on the first slide `<img>`. ~6 lines, no visual change.

## 2. Lazy-loading discipline — `PASS`

**Source:** web.dev, *Browser-level image lazy-loading* — "Don't lazy-load images that are
likely to be in-viewport when the page loads, especially LCP images… Always eager-load
images visible in the first viewport."
**Our state:** slide 1 is `loading="eager"`, everything below the fold (grid, workshop,
showroom) is `lazy`. Exactly right. Fold into tweak A.

## 3. The auto-rotating carousel — `CONFLICT`, resolved by design

**Source:** NN/g, *Designing Effective Carousels* (K. Pernice) — "Consider using a **static**
carousel or hero image instead of a rotating one"; "Indicate how many frames are present and
where the user is within the progression, to help people feel in control"; "Ensure that
navigation controls appear **inside** the carousel"; reading-pace guideline "3 words per
second". Related: J. Nielsen, *Auto-Forwarding Carousels and Accordions Annoy Users and
Reduce Visibility*.
**Our state:** dots (progression) ✓, arrows inside the plate ✓, pause on hover ✓,
auto-rotation disabled under `prefers-reduced-motion` ✓. Rotation speed is 4 s **by owner
instruction** (1.5× request), which runs against NN/g's caution.
**Proposed tweak (D):** keep the owner's 4 s, but add a thin gold **progress hairline** that
fills across the plate over each 4 s cycle, so the auto-advance is *predictable* — NN/g's
real complaint is surprise, not motion. Pause-on-hover already freezes it. ~20 lines.

## 4. Touch / pointer target sizes — `TWEAK`

**Source:** W3C WCAG 2.2, SC 2.5.8 *Target Size (Minimum)* — "The size of the target for
pointer inputs is at least **24 by 24 CSS pixels**", with spacing/inline/equivalent
exceptions. (Industry practice goes further: 44 pt Apple HIG, 48 dp Material.)
**Our state:** chips, pills, nav, icon buttons, summaries are all ≥ 34 px ✓. **But** the
card's `Chat` and `Details` controls are ~18 px tall sitting 20 px apart — too small and
too close for the spacing exception; carousel dots are 7 px (arrows are an equivalent
control, so it passes on paper but is still fiddly on a phone).
**Proposed tweak (B):** give Chat/Details ≥ 24 px hit boxes (padding, visuals unchanged)
and give dots a 24–25 px invisible hit area via transparent padding. ~10 lines of CSS.

## 5. Small-text contrast — `TWEAK`

**Source:** W3C WCAG 2.2, SC 1.4.3 *Contrast (Minimum)* — 4.5:1 for normal-size text,
3:1 for large text.
**Our state (measured):** `--gold-dark #86641F` = 5.45 on white / 4.84 on cream ✓;
`--muted #6E6862` = 5.5 / 4.89 ✓; **`--muted-2 #767269` = 4.79 on white but 4.26 on cream ✗**
— and it is used for fine print that sits on cream (footer spans, price notes).
**Proposed tweak (B):** darken `--muted-2` to `#706A64` (≈5.2 white / ≈4.6 cream). One line.

## 6. Accordions (FAQ) — `PASS`

**Source:** NN/g, *Accordions for Complex Content* — accordions suit "long, content-rich
pages" because "collapsing the page minimizes scrolling", but are "not a one-size-fits-all
solution"; never hide essential content inside them.
**Our state:** exactly five secondary questions; ordering, prices and delivery promises all
live outside the accordion. Correct use. Keep.

## 7. Line length / reading comfort — `TWEAK`

**Guidance (typographic consensus echoed across NN/g readability writing):** body copy
reads best at roughly **50–75 characters per line**.
**Our state (measured):** hero sub ~60 chars ✓, FAQ answers 62ch ✓, materials note 52ch ✓;
**products page-head sub ~95 chars ✗** and **closing-CTA paragraph ~78 chars ✗**.
**Proposed tweak (C):** cap those two at 38rem / 34rem. Two lines of CSS.

## 8. Focus management, semantics, metadata — `PASS`

Audited against developer best practice: search overlay focuses its input on open and
restores focus on close (site.js L335/339); modal does the same (L142/150); skip-link
present; heading order h1→h2→h3 on both pages; `lang="en-NG"`; unique titles + descriptions;
canonical, og:image, JSON-LD, robots, sitemap, 404 all live. No action.

## 9. Stylesheet weight — `OPTIONAL`

Two unminified CSS files ship ~91 KB (≈74 KB minified). A build-step minify in
`build_onepage.py`'s spirit (small Python pass) would shave ~18 %. Real but modest win;
adds a build dependency-free step. Proposed only if you want it (E).

## 10. Image codec — `OPTIONAL`

Progressive JPEG q84 totals ~683 KB for the catalogue. WebP variants + `<picture>` would
cut ~35 % on supporting browsers (all modern ones). Meaningful on slow networks, but adds
generation + markup complexity. Proposed only if you want it (E).

---

## Proposed implementation clusters

| Cluster | Contents | Effort | Risk |
|---|---|---|---|
| **A — Vitals pack** | preload fonts + LCP image, `fetchpriority="high"` | ~6 lines | none |
| **B — A11y pack** | 24 px+ hit areas (Chat/Details/dots), `--muted-2` contrast | ~12 lines | none |
| **C — Readability** | two max-width caps | 2 lines | none |
| **D — Carousel control** | 4 s gold progress hairline, freezes on hover | ~20 lines | none |
| **E — Optional perf** | CSS minify step, WebP `<picture>` | medium | low |

Recommendation: **A + B + C + D now** (all tiny, zero visual-regression risk, each traceable
to a cited source); keep **E** in the backlog.
