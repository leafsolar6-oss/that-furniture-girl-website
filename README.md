# That Furniture Girl — website

The live site for **That Furniture Girl**, a handcrafted furniture workshop in
Iyaganku, New GRA, Ibadan. Sectionals, sofa sets, wardrobes and centre tables,
all made to order — **ordering happens on WhatsApp**, so there is no cart, no
checkout and no payment step anywhere on the site.

**Live:** https://leafsolar6-oss.github.io/that-furniture-girl-website/

---

## How it is built

The site is an **Astro 7.3** project. Astro generates plain HTML, CSS and a small
script at build time — there is no framework shipped to the browser, so the
pages stay as light and as fast on Nigerian mobile data as the hand-written
version they replaced.

```
src/
  components/           header, footer, drawer, search panel, product card…
    sections/           one file per page section (Hero, Collection, FAQ…)
  data/products.js      ← EDIT THIS: prices, colours, materials, photos, reviews
  layouts/Base.astro    <head>, announcement bar, chrome, footer
  lib/site.js           price + WhatsApp-message helpers (used at build time)
  scripts/site.js       the browser behaviour (filters, slider, quick view)
  pages/                index.astro (home) · products.astro (full catalogue)
public/
  assets/               photos, logos, the two stylesheets, fonts
figma/                  Figma handoff kit (see figma/README.md)
build_onepage.py        bundles everything into one self-contained HTML file
.github/workflows/      builds and publishes to GitHub Pages on every push
```

## Everyday commands

**Requires Node 22.12 or newer** — that is what Astro 7 needs. `.nvmrc` holds
the version, `nvm use` picks it up, and the GitHub Actions build reads the same
file, so the two can never disagree.

```bash
npm install        # once
npm run dev        # local preview with live reload → http://localhost:4321
npm run build      # generates the site into dist/
npm run preview    # serve the built site locally
npm run onepage    # build, then refresh that-furniture-girl-one-page.html
```

Publishing is automatic: **push to `main` and GitHub Actions builds and
deploys it.** Nothing has to be uploaded by hand. (The first time, the repo's
Pages source must be set to *GitHub Actions*.)

## Changing prices, products and photos

Open **`src/data/products.js`** — that single file feeds the home page grid,
the shop page, the hero slider, the quick-view panel and the search box.

```js
{
  id: 'blush-sectional',           // short unique name, no spaces
  name: 'Blush Sectional',         // shown on the card
  cat: 'sofas',                    // sofas | sets | tables | storage
  price: 500000,                   // naira, number only — or null for "on request"
  priceTo: 160000,                 // optional second price (two sizes)
  badge: 'Best seller',            // optional: Best seller | Signature | New
  colours: 'Light grey + white',
  material: 'Boucle fabric',
  sizes: 'Small — … · Big — …',    // optional
  lead: '14 working days',         // optional production time
  desc: 'One or two sentences.',
  img: 'blush-sectional.jpg',      // a file in public/assets/img/opt/
  featured: true                   // show it on the home page
}
```

Then `git push` — the site rebuilds itself.

**Swapping a photo:** drop the new file into `public/assets/img/opt/` using the
same filename and nothing else has to change. Keep photos around 1200 px wide;
`sips`/Preview/Paint can resize them.

### Customer reviews

`TESTIMONIALS` in the same file is **empty on purpose**. The "What our
customers say" section is not rendered at all until real messages are added,
so the site can never show a review nobody wrote. Paste in what customers
actually sent you and the section appears by itself.

## What the site deliberately does not do

- **No cart or checkout.** Every CTA deep-links to a pre-filled WhatsApp message.
- **No fake urgency or numbers.** No countdowns, no strike-through prices, no
  star ratings, no invented "50k+ customers". Every figure on the site is real
  (1,101 TikTok followers · 59,230 likes · 191 videos) and every price is the
  price the workshop charges.
- **No stock photography.** Every photo is from her own Instagram and TikTok.
- Where the reference template asked for a "flash sale", this site says *Ready
  right now* and lists the pieces genuinely finished in the showroom.

## The page arrangement

The layout follows the modern Nigerian furniture-store arrangement the client
sent as a reference (cream page, gold primary CTA, green WhatsApp buttons, pill
controls, 4-up product grid, floating price cards).

- `public/assets/css/arrangement.css` holds that skin — pills, hero panel,
  filter toolbar, product card, 4-up grid, cream footer. It loads after
  `style.css`, so the older styles still work underneath.
- The hero is a real slider: slides and prices come from `products.js`.
- The filter toolbar (search + price range + grid/list toggle + category tabs)
  is wired once in `src/scripts/site.js`; on the built site it **shows and
  hides** server-rendered cards rather than rebuilding them, which is why the
  product grid is visible before any JavaScript runs.

## Rebuilding the single-file version

`npm run onepage` regenerates `that-furniture-girl-one-page.html` — the home
page with the full catalogue, all photos, fonts and scripts, in one file that
opens from anywhere, offline. Links to `products.html` are rewritten to
`#collection` so nothing in that file can 404. It is a build artifact, so it is
not committed.

## Designing it in Figma

`figma/` holds a handoff kit generated from this code:

- `design-system.svg` — colours, type, radius, shadows, buttons, badges, the
  product-card anatomy and the arrangement band, as editable vector layers.
- `page-blueprints.svg` — all four pages at 1:4 with real section heights,
  backgrounds, grid columns and card counts.
- `tokens.json` — the same tokens in design-token format (Tokens Studio import).
- `README.md` — import steps, the agent brief, and the rules the design keeps.

## Publishing

Hosting is free: GitHub Pages, built by the workflow in
`.github/workflows/deploy.yml`. A custom domain can be added later without
touching the code — add the `CNAME`, then point DNS at GitHub and tick
*Enforce HTTPS*.

---

Built as a static site — no frameworks, no dependencies in the browser, no
monthly software costs. Fonts and photos are self-hosted, so it loads fast on
Nigerian mobile data.

---

## How the site is published today

Every push to `main` publishes the site twice: the Actions workflow uploads
`dist/`, and — because GitHub Pages is *still* set to **deploy from a branch**
(`main`, `/`) rather than from the workflow — the repository root is published
too. Both copies are the same site, so the two can never disagree while the
setting is what it is. That is why a freshly built copy of `dist/`
(`index.html`, `shop.html`, `about.html`, `contact.html`, `assets/`, `_astro/`,
`.nojekyll`) also sits at the root.

The root copy is generated output: never edit it. To refresh it, run
`npm run build` and copy `dist/` over the root.

**Finishing the job** — in the repo: *Settings → Pages → Source → GitHub
Actions*. Then the root copy can go:

```bash
git rm -r _astro assets index.html shop.html about.html contact.html .nojekyll
git commit -m "Remove the interim root copy — Pages now builds from Actions"
git push
```

From then on `dist/` is the only thing published, and a content change needs
nothing more than a push.

## Production: thatfurnituregirl.com (Truehost cPanel)

- The repo root **is** the deployable build (minified output committed alongside `src/`).
- cPanel → **Git Version Control** → repo `https://github.com/leafsolar6-oss/that-furniture-girl-website.git`,
  branch `main`, **Repository Path: `public_html`**, *Auto Deploy* checked.
  If cPanel refuses with “...already contains files”: in File Manager rename `public_html`
  to `public_html_bak` (Git then recreates it as the checkout), Deploy, delete the _bak once
  the site verifies. The checkout keeps `.git/` inside the docroot — the `.htaccess` above
  blocks it and the other repo scaffolding.
- Flow from now on: ship a change → push `main` → cPanel auto-pulls → the live domain
  updates in seconds. `leafsolar6-oss.github.io/that-furniture-girl-website` stays up
  as the free preview/rollback copy.
- `.htaccess` (repo root, also deployed) forces HTTPS and hides `src/` & friends.
- DNS is managed by Truehost nameservers (cloudoon.com); TLS issues via AutoSSL.
- If Git UI is ever unavailable: upload the site zip via File Manager into `public_html`.
