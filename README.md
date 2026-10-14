# That Furniture Girl — website

A modern website for **That Furniture Girl** (@thatfurnituregirl_), handcrafted
furniture from **Iyaganku, New GRA, Ibadan** — Nigeria.

Every price, product, photo, statistic and contact detail on this site was
recovered from the brand's own TikTok account. Nothing here is invented.

---

## What's in this folder

```
index.html                         Home page
shop.html                          Full collection with category filters
about.html                         Our story / the workshop
contact.html                       Visit & contact / how ordering works
that-furniture-girl-one-page.html  The whole site as ONE self-contained file
assets/
  css/style.css                    Design system (colours, type, layout)
  js/products.js                   ➜ EDIT THIS to change products & prices
  js/main.js                       Shop rendering, quick-view, drawer, WhatsApp
  img/                             Photography + the real logo
  img/opt/                         Same photos compressed for the web
  fonts/                           Plus Jakarta Sans, self-hosted
design-reference/template-pin.jpg  The template the look is based on
source-photos/                     The original TikTok stills, uncropped
build_onepage.py                   Rebuilds the single-file version
```

### The design system

The layout follows a modern furniture-store template: deep green + amber on a
soft grey page, rounded cards and pill buttons. Everything is driven by CSS
variables at the top of `assets/css/style.css` — change them there and the whole
site follows.

```
--green   #004B1F    buttons, headings accent, dark panels, footer
--amber   #FFB600    icon tiles, badges, count-ups, highlight buttons
--bg      #F4F4F4    page background
--surface #FFFFFF    cards
```

Photography is hers throughout. Prices, colours and production times in the
copy all come from her own posts — see "Where the real data came from".

### The customer reviews section

The home page has a "What our customers say" section that is **switched off
until you give it real reviews**. It reads `TFG_TESTIMONIALS` at the bottom of
`assets/js/products.js`, which ships empty — while it is empty the whole
section hides itself, so the site can never show a review nobody wrote.

Paste in what customers actually sent you (WhatsApp, Instagram DM, TikTok
comment) and it appears on the home page automatically:

```js
var TFG_TESTIMONIALS = [
  { name: 'Ada O.',                  // how they want to be shown
    where: 'Ibadan',                 // optional — city, or how they found you
    text: 'The exact words they sent you.' }
];
```

There is one other thing the site deliberately does not fake: discount badges
and countdown timers. The "Ready right now" band shows real stock instead —
the two pieces that are finished and sitting in the showroom.

**Two versions, same site:**

| File | Use it for |
|---|---|
| `index.html` + `shop.html` + `about.html` + `contact.html` | **Hosting.** Upload the whole folder. |
| `that-furniture-girl-one-page.html` | **Sharing.** One file, everything embedded — email it, WhatsApp it, open it offline. |

---

## Where the real data came from

TikTok blocks ordinary page requests, so the assets were collected through
TikTok's own signed CDN endpoints. Everything below is genuine:

**The photography** — `assets/img/` contains real stills from her posts: the
grey boucle Blush Sectional, the chocolate corduroy Jewel, the Blush Linea set,
the Twinkle Set with its floral print, the Plush 3-Seaters, the Royal Kinging
Set, the round Centre Table and the two-door Wardrobe — all photographed in the
Iyaganku workshop. Nothing is AI-generated any more.

**The logo** — `logo-mark.png`, `logo-mark-light.png`, `logo-full.png` and
`logo-full-light.png` were cut from her real profile avatar, with the white
background removed and transparency preserved. The wordmark and her tagline
(*"your best comfort zone"*) are the originals. Use the `-light` variants on
dark backgrounds.

**The numbers** — taken from the account, not estimated:

| | |
|---|---|
| Followers | 1,101 |
| Likes | 59,230 |
| Videos | 191 |
| Views on the Blush Sectional | 57,172 |

**The address** — `Iyaganku, New GRA, Ibadan 200273, Oyo State`, from the
location attached to her posts (coordinates 7.375526, 3.868076 — the "Get
directions" button on the contact page uses these).

`source-photos/` holds the uncropped originals plus `meta/` (her exact captions
and engagement figures for each post). Keep it as your master copy.

---

## Editing products & prices

Open **`assets/js/products.js`**. The shop grid, the home-page featured row and
the quick-view pop-ups are all generated from that one list.

```js
{
  id: 'blush-sectional',          // short unique name
  name: 'Blush Sectional',
  cat: 'sofas',                   // sofas | sets | tables | storage
  price: 500000,                  // number only. null = "Price on request"
  priceTo: 160000,                // optional, for two-size pieces
  badge: 'Best seller',           // 'Best seller' | 'Signature' | 'New'
  colours: 'Light grey + white',
  material: 'Boucle fabric',
  sizes: 'optional size note',
  lead: '5 working days',
  desc: 'One or two sentences for the quick-view.',
  img: 'blush-sectional.jpg',
  featured: true                  // show it on the home page
}
```

To add a piece: crop its photo to roughly 4:3, save it into
`assets/img/opt/`, then copy a block and change the values. To remove one:
delete its block. Nothing else needs touching.

Contact details, the WhatsApp number and social links live at the top of the
same file (`TFG_CONFIG`). **The number is currently `2349079849626`** — set it
to whichever number should receive orders.

### Swapping a photo

Replace the file in **both** `assets/img/` (full quality) and `assets/img/opt/`
(web version), keeping the same filename. To make the web version:

```bash
python3 -c "
from PIL import Image
im = Image.open('new-photo.jpg').convert('RGB')
w = 1400 if im.width > 1400 else im.width
im = im.resize((w, int(im.height*w/im.width)), Image.LANCZOS)
im.save('assets/img/opt/name.jpg', 'JPEG', quality=78, optimize=True, progressive=True)
"
```

---

## Rebuilding the single-file version

After any change to pages, CSS, JS or photos:

```bash
python3 build_onepage.py
```

That rewrites `that-furniture-girl-one-page.html` with the fresh content,
embedding the CSS, fonts, photos and logo as data URIs.

---

## Publishing it

Any static host works — no build step, no server, no database.

### GitHub (and GitHub Pages, free hosting)

This folder is already a git repository with everything committed on the `main`
branch. To publish it:

**1. Create the repository.** Go to <https://github.com/new>, give it a name
(keep it **Public** if you want free Pages hosting), and leave it *empty* — no
README, no .gitignore, no licence, so there's nothing to conflict with.

**2. Push.** Open a terminal in this folder and run:

```bash
./push-to-github.sh yourusername/your-repo-name
```

When GitHub asks for a password, paste a **Personal Access Token** instead —
GitHub stopped accepting account passwords over git in 2021. To make one:
*Settings → Developer settings → Personal access tokens → Fine-grained tokens
→ Repository access: only this repo → Contents: Read and write.*

**3. Put it on the web.** In the repository: *Settings → Pages → Source:
Deploy from a branch → Branch: `main`, Folder: `/ (root)` → Save.* After a
minute your site is live at:

```
https://yourusername.github.io/your-repo-name/
```

The `.nojekyll` file in this folder stops GitHub from running Jekyll over the
site, which isn't needed for plain HTML.

### Other hosts

- **Netlify / Vercel / Cloudflare Pages** — drag the folder onto the dashboard. Free.
- **cPanel / shared hosting** — upload the contents to `public_html`.

Only the four HTML files, `assets/` and the fonts are needed to serve the site.
`source-photos/`, `build_onepage.py` and `push-to-github.sh` are working files —
they live in the repository but don't affect the live site.

---

## How the site sells

It is built as an **order-enquiry business**, not a checkout — because that is
how this business actually trades today. There is no cart and no payment
processor. Every product's "Order" button opens WhatsApp with the piece name,
colour and price pre-filled:

> Hello That Furniture Girl! I would like to order the Blush Sectional
> (Light grey + white) — ₦500,000. Is it available?

A floating WhatsApp button follows the visitor on every page. The product data
is a clean JavaScript array, so a real shop (Paystack, Flutterwave, Shopify Buy
Button) can be bolted on later without redesigning anything.

---

## Designing it in Figma

The `figma/` folder is a handoff kit generated from this code, so a designer (or an
AI design agent) can work in Figma without guessing:

- `figma/design-system.svg` — every colour, text style, radius, shadow, button,
  badge and the product-card anatomy, as editable vector layers.
- `figma/page-blueprints.svg` — all four pages at 1:4 with the real section
  heights, background, grid columns and card counts, plus a section index and a
  component inventory.
- `figma/tokens.json` — the same tokens in design-token format (Tokens Studio import).
- `figma/README.md` — import steps, the agent brief, and the rules the design keeps.

The tokens are parsed from `:root` in `assets/css/style.css`, so change the CSS and
re-run `python3 figma/make_tokens.py` to keep Figma and the site in step.

## Nice next steps

1. Shoot a few fresh lifestyle photos with the furniture in customers' homes.
2. Add real customer reviews — screenshots of TikTok comments work well.
3. Add a "what's on the ground now" strip you can update weekly.
4. Swap the WhatsApp number if orders should go to a different line.

---

Built as a static site — no frameworks, no dependencies, no monthly software
costs. Fonts and photos are self-hosted, so it loads fast on Nigerian mobile data.
