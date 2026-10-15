# Figma handoff — That Furniture Girl

Everything a designer (or an AI design agent) needs to work on this site in Figma
**without guessing**. The kit is *generated from the live site*, never from a
mockup, so it cannot drift from what customers actually see.

> Direction of travel: **site → Figma**. Nothing in the build imports these
> files; they are documentation and design input, not code. The source of truth
> for what ships is `public/assets/css/style.css` + `arrangement.css`.

| File | What it is | How to use it |
|---|---|---|
| `design-system.svg` | The full style sheet, read out of `:root` at run time: 19 named colours incl. `--premium` (the greige studio backdrop), the real type scale (Instrument Serif display + system sans body), radius scale, elevation, buttons/chips, and labelled anatomy diagrams of the product card and the hero carousel plate — with a real studio photo embedded. | Drag onto a Figma page → right-click → **Ungroup**. |
| `page-blueprints.svg` | The **two live pages** (Home, Products) side by side at 1:4, section order parsed from `dist/` at build time, plus a section index, component inventory and the business rules. Heights are CSS estimates at 1440 px, labelled `~`. | Drag in, ungroup, scale ×4.1667 for true 1440. |
| `tokens.json` | The same tokens in W3C DTCG format, parsed from `style.css`. | **Tokens Studio → Import → JSON**, or the Figma MCP server. |
| `proposal/home.svg`, `proposal/products.svg` | The **approved** design direction, drafted as artboards: *Gallery Noir* — ink canvas, greige studio plates as framed prints, serif display, gold hairlines. Real photos, real names and real prices pulled from `src/data/products.js`. | Approved 2026-10-15 and implemented live: the noir `:root` + component block at the end of `public/assets/css/arrangement.css`. These artboards remain the visual reference. |
| `make_tokens.py` | Regenerates `tokens.json`. | `python3 make_tokens.py` after any palette change. |
| `make_design_system.py` | Regenerates `design-system.svg`. | `python3 make_design_system.py` after any CSS/component change. |
| `make_blueprint.py` | Regenerates `page-blueprints.svg` from `dist/`. | `npm run build && python3 make_blueprint.py` after any section change. |
| `make_proposal.py` | Regenerates the Gallery Noir artboards. | `python3 make_proposal.py` — edit the script to iterate on the direction. |

## Import into Figma, step by step

1. New Figma file → **File → Import** (or drag the file onto the canvas).
2. `design-system.svg` first, so palette and type exist before you draw.
3. `page-blueprints.svg` on a second page named *Blueprints*.
4. Create Figma colour styles from the swatch names — they match the CSS
   variable names exactly (`--premium`, `--gold`, `--muted-2`, …).
5. Text styles: Display 68 / H2 46 / H3 25 (Instrument Serif), Body 16.5,
   Small 13.5, Eyebrow 12 (system sans stack).
6. Display face is **Instrument Serif** (Google Fonts, loaded in
   `Base.astro`). Body is the system sans stack. The self-hosted
   `jakarta/manrope/fraunces` woff2 files are legacy and unreferenced.

## Reviewing the proposal

Open `proposal/home.svg` and `proposal/products.svg` side by side with the
current site. The direction keeps every business rule below and changes only
the canvas, type mood and plate framing. Approve it (or ask for variants) and
the next step is implementing it in `public/assets/css/*.css` + the `.astro`
components — the proposal script is written so colours and layout constants sit
at the top of the file for fast iteration.

## If you are designing with an AI agent (Figma MCP)

Paste this into the agent:

> Read the public repo `github.com/leafsolar6-oss/that-furniture-girl-website`.
> The design system is `public/assets/css/style.css` (+ `arrangement.css`) —
> treat the `:root` block as the single source of truth for colour, radius,
> shadow and spacing, and `src/scripts/site.js` + `src/components/ProductCard.astro`
> as the source of truth for the product card, filter chips and quick-view
> modal. Section order per page: read `src/pages/index.astro` and
> `src/pages/products.astro`.
>
> Build the new design **from** that, then open a pull request on `main`.

## The rules the design has to keep

These come from the business, not from a style guide. Any design that breaks
them will be sent back.

- Ordering is **WhatsApp only**. No cart, no checkout, no payment step. Every
  CTA deep-links to a pre-filled WhatsApp message.
- **No invented urgency or numbers.** No countdowns, no fake strike-through
  prices, no star ratings, no "50k+ customers". Every figure on the page is
  real and verified — the proposal scripts read prices straight from
  `src/data/products.js` for exactly this reason.
- **Real photos only** — her own Instagram and TikTok shots, now presented on
  the premium greige studio backdrop (`--premium #DCD3C8`). No stock furniture,
  no generated room scenes presented as her work.
- The reviews section stays empty until a real customer review exists; it is
  hidden by design, not missing.
- Showroom: Iyaganku, New GRA, Ibadan · WhatsApp 0907 984 9626 ·
  @thatfurnituregirl\_ (TikTok) · @thatfurnituregirl\_\_ (Instagram).
