// @ts-check
import { defineConfig } from 'astro/config';

// The site is published from GitHub Pages at
// https://leafsolar6-oss.github.io/that-furniture-girl-website/
// Every link inside the site is relative and every asset lives in public/,
// so the same build works on a custom domain later with no changes — only
// this `site`/`base` pair has to be updated.
export default defineConfig({
  site: 'https://leafsolar6-oss.github.io',
  base: '/that-furniture-girl-website',
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
