// @ts-check
import { defineConfig } from 'astro/config';

// The site is published from GitHub Pages at the custom domain
// https://thatfurnituregirl.com/ (CNAME file + DNS A/CNAME records; the
// github.io/that-furniture-girl-website path 301s to the domain).
// `base: '/'` because the domain serves from the root. If the domain ever
// moves back to the /that-furniture-girl-website/ preview path, restore both
// values here — every hand-written link in src/ stays relative either way.
export default defineConfig({
  site: 'https://thatfurnituregirl.com',
  base: '/',
  outDir: './dist',
  build: {
    // writes shop.html (not shop/index.html) so the existing links, the
    // #cat-sofas deep links and anything customers have already shared
    // keep working exactly as they do today
    format: 'file',
    inlineStylesheets: 'auto'
  },
  // Astro 7 defaults to JSX whitespace rules, which strips the space between
  // inline elements (e.g. "Ibadan <span>&</span> nationwide" would run
  // together). `true` keeps HTML-aware whitespace — the same output as before.
  compressHTML: true,
  devToolbar: { enabled: false }
});
