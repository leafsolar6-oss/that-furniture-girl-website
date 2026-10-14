# Figma handoff — That Furniture Girl

This folder holds everything a designer (or an AI design agent) needs to work on this
site in Figma **without guessing**. It is generated from the live site, not from a
mockup, so nothing here can drift from what customers actually see.

| File | What it is | How to use it |
|---|---|---|
| `design-system.svg` | The full style sheet: 19 colours, type specimens, radius scale, shadows, buttons, badges, the product-card anatomy, layout and spacing rules. Every element is a real vector layer. | Drag onto a Figma page → right-click → **Ungroup**. Colour swatches, text and shapes become editable. |
| `page-blueprints.svg` | All four pages side by side at 1:4, section by section, with real measurements (heights, background, grid columns, card counts), a section index, the component inventory and the rules we keep. | Drag in, ungroup, then rebuild any section on top of its block. Scale ×4.1667 to work at true 1440 px. |
| `tokens.json` | The same tokens in W3C Design Tokens (DTCG) format, parsed straight out of `assets/css/style.css`. | In Figma: **Tokens Studio → Import → JSON**. Also readable by the Figma MCP server. |
| `make_tokens.py` | Regenerates `tokens.json` from `:root` in `assets/css/style.css`. | `python3 make_tokens.py` after any palette or spacing change. |
| `make_blueprint.py` | Regenerates `page-blueprints.svg`. | `python3 make_blueprint.py` after any section is added or reordered. |

## Import into Figma, step by step

1. New Figma file → **File → Import** (or drag the file onto the canvas).
2. `design-system.svg` first, so the palette and type styles exist before you draw.
3. Then `page-blueprints.svg` on a second page and name that page *Blueprints*.
4. Create Figma **colour styles** from the swatch names — they match the CSS variable
   names exactly (`--green`, `--amber`, `--muted-2`, …), so a developer can find any
   colour in `assets/css/style.css` by name.
5. Text styles: Display, Heading 2, Heading 3, Body, Small, Eyebrow — sizes and
   weights are labelled on the sheet.
6. Typeface: **Plus Jakarta Sans** (200–800), free on Google Fonts. The site self-hosts
   `assets/fonts/jakarta-latin.woff2`, so text set in Plus Jakarta Sans matches 1:1.

## If you are designing with an AI agent (Figma MCP)

Paste this into the agent:

> Read the public repo `github.com/leafsolar6-oss/that-furniture-girl-website`.
> The design system is `assets/css/style.css` — treat the `:root` block as the single
> source of truth for colour, radius, shadow and spacing, and `assets/js/main.js`
> (`cardHTML()`, `wireFilters()`) as the source of truth for the product card, filter
> chips and the quick-view modal. Section order per page: read `index.html`,
> `shop.html`, `about.html`, `contact.html`.
>
> Build the new design **from** that, then open a pull request on `main`. Keep these
> constraints or the design cannot ship:
>
> - Ordering is **WhatsApp only**. No cart, no checkout, no payment step. Every CTA
>   deep-links to a pre-filled WhatsApp message.
> - **No invented urgency or numbers.** No countdowns, no fake strike-through prices,
>   no star ratings, no "50k+ customers". Every figure on the page is real and verified.
> - **Real photos only** — shots from her own Instagram and TikTok. No stock furniture
>   images, no generated room scenes presented as her work.
> - The reviews section (`#reviews`) stays empty until a real customer review exists;
>   it is hidden by design, not missing.
> - Prices shown: sofas from ₦350,000 · sets ₦450,000 · tables & storage ₦100,000 and
>   from ₦140,000 · Royal Kinging Set ₦1,500,000 (~3 months to build).
> - Showroom: Iyaganku, New GRA, Ibadan, 200273 · WhatsApp 0907 984 9626 ·
>   @thatfurnituregirl\_ (TikTok) · @thatfurnituregirl\_\_ (Instagram).
>
> Anything you change in the design must be reproducible in one file: `assets/css/style.css`.

## The rules the design has to keep

These come from the business, not from a style guide. Any design that breaks them
will be sent back.

1. **WhatsApp is the checkout.** Green channel buttons are the primary action
   everywhere; `.btn--primary` is green, `.btn--amber` is the secondary accent.
2. **Honesty over persuasion.** No countdown, no "only 2 left", no invented review
   counts, no fake discounts. Where the template we restyled asked for a flash sale,
   this site says *Ready right now* and lists pieces that are genuinely in the showroom.
3. **Her own photographs.** The eight product shots, three scene shots and six
   Instagram crops are hers.
4. **Made to order is the product.** Custom colour, size and fabric is the main selling
   point, so `#custom` gets a full section and every card can end in "Order on WhatsApp".
5. **Mobile first.** 1 column below 560 px, 2 at 560 px, 3 at 900 px, 4 at 1200 px.
   Most of her traffic arrives from TikTok on a phone.
