/* ==========================================================================
   That Furniture Girl — site behaviour (Astro edition)
   --------------------------------------------------------------------------
   The product cards, the hero slides and the category tabs are now rendered
   at BUILD time by Astro. This file only adds the interactivity on top:

     · WhatsApp links written as data-wa in the HTML
     · drawer, sticky header, scroll reveals
     · category tabs + search + price range + grid/list toggle (they show and
       hide rendered cards instead of rebuilding them)
     · hero slider
     · quick view modal
     · search overlay
     · newsletter hand-off to WhatsApp

   Prices and product details live in src/data/products.js.
   ========================================================================== */
import { CONFIG, PRODUCTS, categoryLabel } from '../data/products.js';
import { colourVariants } from '../lib/site.js';
import { wireCart } from './cart.js';

/* ---------- helpers ---------------------------------------------------- */

const $ = (sel, scope = document) => scope.querySelector(sel);
const $$ = (sel, scope = document) => Array.from(scope.querySelectorAll(sel));

function fmt(n) {
  return CONFIG.currency + Number(n).toLocaleString('en-NG');
}

function waLink(message) {
  return 'https://wa.me/' + CONFIG.whatsapp + '?text=' + encodeURIComponent(message);
}

function orderMessage(p) {
  /* Structured, sales-ready enquiry: the team sees the exact listing,
     the colourway, the live price and the ask (pickup today / deposit to
     start / price for catalogue pieces) — no follow-up round needed. */
  const colour = (p.colours || '').trim();
  let name = p.name || 'a piece';
  let colourPart = '';
  const dash = name.indexOf(' \u2014 ');
  if (dash > -1 && colour && name.slice(dash + 3).trim().toLowerCase() === colour.toLowerCase()) {
    colourPart = ' (' + name.slice(dash + 3).trim() + ')';
    name = name.slice(0, dash);
  } else if (colour) {
    colourPart = ' (' + colour.charAt(0).toUpperCase() + colour.slice(1) + ')';
  }
  const listed = p.priceTo
    ? ' listed for \u20A6' + Number(p.price).toLocaleString('en-NG') + ' \u2013 \u20A6' + Number(p.priceTo).toLocaleString('en-NG')
    : p.price ? ' listed for \u20A6' + Number(p.price).toLocaleString('en-NG') : '';
  const hi = 'Hello ' + CONFIG.brand + '!';
  if (p.lead && /pickup/i.test(p.lead)) {
    return hi + ' \uD83D\uDCCB I am interested in the show-room ready ' + name + colourPart + listed
      + '. Is it still available for immediate pickup/delivery today?';
  }
  if (p.price) {
    const ask = p.lead
      ? ' The site says the lead time is ' + p.lead.toLowerCase() + ' \u2014 could you confirm that, plus my colour and size options and how to start with a deposit?'
      : ' Could you confirm the production timeline, my colour and size options and how to start with a deposit?';
    return hi + ' \uD83D\uDECB I am interested in the ' + name + colourPart + listed
      + ' and would like it made to order.' + ask;
  }
  return hi + ' \uD83D\uDECB I saw the ' + name + colourPart
    + ' in your catalogue and would love one. Could you share the price range, colour options and how soon it could be ready?';
}

function priceHTML(p) {
  if (p.priceTo) {
    return '<span class="price__value">' + fmt(p.price) + ' \u2013 ' + fmt(p.priceTo) + '</span>' +
           '<span class="price__note">Two sizes available</span>';
  }
  if (p.price) {
    return '<span class="price__value">' + fmt(p.price) + '</span>' +
           '<span class="price__note">Custom colours available</span>';
  }
  return '<span class="price__value">Price on request</span>' +
         '<span class="price__note">Made to order</span>';
}

function footerNote(p) {
  let when = 'Production time 5\u201310 working days on most builds.';
  if (p.lead && /pickup/i.test(p.lead)) {
    when = 'Available now for immediate pickup at the showroom.';
  } else if (p.lead) {
    when = 'Production time ' + p.lead + '.';
  }
  return when + ' Same-day delivery available in Ibadan.';
}

const WA_ICON = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.46 1.32 4.96L2 22l5.25-1.38a9.87 9.87 0 0 0 4.79 1.22c5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2zm5.43 12.38c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.76-1.66-2.06-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.06 2.88 1.21 3.08c.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.69.63.71.22 1.36.19 1.87.12.57-.09 1.75-.72 2-1.41.25-.69.25-1.28.17-1.41-.07-.13-.27-.2-.57-.35z"/></svg>';

/* ---------- scroll reveals -------------------------------------------- */

let io;
function observeReveals(scope) {
  const targets = $$('.reveal:not(.is-in)', scope || document);
  if (!('IntersectionObserver' in window)) {
    targets.forEach((t) => t.classList.add('is-in'));
    return;
  }
  if (!io) {
    io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
      });
    }, { threshold: 0, rootMargin: '0px 0px -5% 0px' });
  }
  targets.forEach((t) => io.observe(t));

  /* Safety net: the reveal is decorative, so content must never be able to
     stay invisible. Anything the observer missed is shown on the next scroll
     frame, and once more shortly after load. */
  function sweep() {
    $$('.reveal:not(.is-in)').forEach((t) => {
      const box = t.getBoundingClientRect();
      if (box.top < window.innerHeight * 1.05 && box.bottom > -window.innerHeight) {
        t.classList.add('is-in');
      }
    });
  }
  if (!observeReveals.net) {
    observeReveals.net = true;
    let queued = false;
    window.addEventListener('scroll', () => {
      if (queued) return;
      queued = true;
      window.requestAnimationFrame(() => { queued = false; sweep(); });
    }, { passive: true });
    window.setTimeout(sweep, 900);
    window.addEventListener('load', sweep);
  }
}

/* ---------- quick view ------------------------------------------------- */

let modal, lastFocus;

/* Build the swatch matrix for the runtime modal with the same markup the
   Astro component renders at build time (single source: colourVariants). */
const escA = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
function cwMatrixHTML(cws) {
  return '<div class="cwmatrix">'
    + '<p class="cwmatrix__head">Colourways built <span>' + cws.length + '</span></p>'
    + '<div class="cwmatrix__grid" role="group" aria-label="Colourways this piece has been built in">'
    + cws.map((v) => '<button type="button" class="cwchip" data-cw="' + escA(v.label) + '" aria-pressed="false">'
        + '<span class="cwchip__dot" style="' + v.dot + '"></span><span class="cwchip__lab">' + escA(v.label) + '</span></button>').join('')
    + '</div>'
    + '<p class="cwmatrix__note" data-cw-note>Tap a colourway \u2014 your order message will ask for exactly that one.</p>'
    + '</div>';
}

function openModal(p) {
  if (!modal) return;
  let specs = '';
  const row = (k, v) => { if (v) specs += '<div><dt>' + k + '</dt><dd>' + v + '</dd></div>'; };
  const cws = colourVariants(p);
  if (cws.length < 2) row('Colour', p.colours);
  row('Material', p.material);
  row('Sizes', p.sizes);
  row('Availability', p.lead);
  row('Price', p.price ? fmt(p.price) + (p.priceTo ? ' \u2013 ' + fmt(p.priceTo) : '') : 'On request');
  row('Customisation', 'Any colour, size or design');

  modal.innerHTML = '' +
    '<div class="modal__scrim js-close-modal"></div>' +
    '<div class="modal__panel" role="dialog" aria-modal="true" aria-label="' + p.name + '">' +
      '<button class="modal__close js-close-modal" type="button" aria-label="Close">&times;</button>' +
      '<div class="modal__media"><img src="assets/img/opt/' + p.img + '" alt="' + p.name + '"></div>' +
      '<div class="modal__body" data-cwroot data-pid="' + p.id + '">' +
        (p.badge ? '<span class="badge badge--clay" style="justify-self:start">' + p.badge + '</span>' : '') +
        '<h3>' + p.name + '</h3>' +
        '<p class="muted">' + p.desc + '</p>' +
        '<dl class="spec-list">' + specs + '</dl>' +
        (cws.length >= 2 ? cwMatrixHTML(cws) : '') +
        '<div class="price" style="margin-top:4px">' + priceHTML(p) + '</div>' +
        '<a class="btn btn--primary btn--block" data-order href="' + waLink(orderMessage(p)) + '" target="_blank" rel="noopener">Order on WhatsApp</a>' +
        '<button type="button" class="btn btn--outline btn--block" data-add="' + p.id + '" style="margin-top:10px">Add to order list</button>' +
        '<p class="small muted">' + footerNote(p) + '</p>' +
      '</div>' +
    '</div>';
  modal.classList.add('is-open');
  document.body.style.overflow = 'hidden';
  lastFocus = document.activeElement;
  const closeBtn = modal.querySelector('.modal__close');
  if (closeBtn) closeBtn.focus();
}

function closeModal() {
  if (!modal) return;
  modal.classList.remove('is-open');
  modal.innerHTML = '';
  document.body.style.overflow = '';
  if (lastFocus) lastFocus.focus();
}

function closeDrawer() {
  const drawer = $('#drawer');
  const scrim = $('#scrim');
  if (drawer) drawer.classList.remove('is-open');
  if (scrim) scrim.classList.remove('is-open');
  document.body.style.overflow = '';
}

/* ---------- filters, search, price, view toggle ------------------------- */

function wireFilters(toolbar) {
  const gridId = toolbar.getAttribute('data-tools-for');
  const grid = document.getElementById(gridId);
  if (!grid) return;

  const emptyMsg = document.querySelector(`[data-empty-for="${gridId}"]`);
  const clearBtn = document.querySelector(`[data-empty-for="${gridId}"] [data-clear-filters]`);
    const cards = $$('.product-card', grid);
  const filterBar = toolbar.querySelector('.chip-row');
  const search = toolbar.querySelector('[data-tool="search"]');
  const range = toolbar.querySelector('[data-tool="range"]');
  const rangeOut = toolbar.querySelector('[data-tool="rangeout"]');
  const rangeLabel = toolbar.querySelector('[data-tool="rangelabel"]');
  const viewBtns = $$('[data-tool="grid"], [data-tool="list"]', toolbar);
  const miniBar = document.querySelector('[data-mchipbar]');

  const rangeMax = range ? Number(range.max) : Infinity;
  let current = 'all';
  let query = '';
  let maxPrice = rangeMax;

  function rangeText(shown) {
    const atTop = maxPrice >= rangeMax;
    // the top stop IS the default view — say so plainly instead of naming a
    // price band that reads like an active filter on first glance
    const base = atTop ? 'No filter' : 'Up to ' + fmt(maxPrice);
    return base + ' \u00b7 ' + shown + (shown === 1 ? ' piece' : ' pieces');
  }

  /* mini category bar pinned under the header once the first ten pieces
     have scrolled past — same slide-in idiom as the lookbook's lb-sticky */
  let miniQueued = false;
  function miniMeasure() {
    if (!miniBar) return;
    const visible = cards.filter((c) => !c.hidden);
    const marker = visible[9];
    const show = !!marker && marker.getBoundingClientRect().top < 80 && grid.getBoundingClientRect().top < 0;
    miniBar.classList.toggle('is-show', show);
  }
  window.addEventListener('scroll', () => {
    if (miniQueued) return;
    miniQueued = true;
    window.requestAnimationFrame(() => { miniQueued = false; miniMeasure(); });
  }, { passive: true });
  window.addEventListener('resize', miniMeasure, { passive: true });

  if (miniBar) {
    miniBar.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-mchip]');
      if (!btn) return;
      const twin = filterBar && filterBar.querySelector(`.chip[data-cat="${btn.dataset.mchip}"]`);
      if (twin) twin.click();
    });
  }

  function syncRange() {
    if (!range) return;
    maxPrice = Number(range.value);
    if (rangeLabel) rangeLabel.textContent = '';
  }

  function apply() {
    let shown = 0;
    cards.forEach((card) => {
      const catOk = current === 'all' || card.dataset.cat === current;
      const priceValue = card.dataset.price === '' ? null : Number(card.dataset.price);
      // the top band is open-ended ("… & above"): no ceiling at all, so pieces
      // at or above the tier — and price-on-request made-to-order builds —
      // stay permanently visible there
      const priceOk = maxPrice >= rangeMax ? true : (priceValue ? priceValue <= maxPrice : false);
      const textOk = !query || card.dataset.search.includes(query);
      const on = catOk && priceOk && textOk;
      card.hidden = !on;
      if (on) {
        shown++;
        /* A card the filter shows must never linger in its pre-reveal
           (opacity:0) state — the IntersectionObserver/sweep only fires on
           scroll, so on phones that filtered first, revealed later, matches
           could stay invisible and the grid would LOOK empty. */
        if (!card.classList.contains('is-in')) card.classList.add('is-in');
      }
    });
    if (emptyMsg) emptyMsg.hidden = shown > 0;
    if (range && rangeOut) rangeOut.textContent = rangeText(shown);
    if (miniBar) $$('[data-mchip]', miniBar).forEach((x) => x.setAttribute('aria-pressed', String(x.dataset.mchip === current)));
    miniMeasure();
  }

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      current = 'all';
      query = '';
      if (search) search.value = '';
      if (range) range.value = String(rangeMax);
      syncRange();
      if (filterBar) {
        $$('.chip', filterBar).forEach((x) => x.setAttribute('aria-pressed', 'false'));
        const all = filterBar.querySelector('[data-cat="all"]');
        if (all) all.setAttribute('aria-pressed', 'true');
      }
      apply();
    });
  }

  if (filterBar) {
    filterBar.addEventListener('click', (e) => {
      const chip = e.target.closest('.chip');
      if (!chip) return;
      current = chip.getAttribute('data-cat');
      $$('.chip', filterBar).forEach((c) => c.setAttribute('aria-pressed', 'false'));
      chip.setAttribute('aria-pressed', 'true');
      apply();
    });

    /* Deep links from the footer, e.g. shop.html#cat-sofas */
    const wanted = (window.location.hash || '').replace('#cat-', '');
    if (wanted && wanted !== window.location.hash) {
      const match = filterBar.querySelector(`[data-cat="${wanted}"]`);
      if (match) {
        current = wanted;
        $$('.chip', filterBar).forEach((c) => c.setAttribute('aria-pressed', 'false'));
        match.setAttribute('aria-pressed', 'true');
      }
    }
  }

  if (search) {
    search.addEventListener('input', () => { query = search.value.trim().toLowerCase(); apply(); });
    /* Deep link from the homepage swatch chips: products.html?q=chocolate
       pre-fills the search box so the tap lands on matching builds. */
    const q0 = new URLSearchParams(window.location.search).get('q');
    if (q0) { search.value = q0; query = q0.trim().toLowerCase(); }
  }

  if (range) {
    range.addEventListener('input', () => { syncRange(); apply(); });
    syncRange();
  }

  viewBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const list = btn.getAttribute('data-tool') === 'list';
      grid.classList.toggle('is-list', list);
      viewBtns.forEach((b) => {
        const on = b === btn;
        b.classList.toggle('is-on', on);
        b.setAttribute('aria-pressed', on ? 'true' : 'false');
      });
    });
  });

  apply();
}

/* ---------- catalogue price filter --------------------------------------- */
/* The pinned bar's slider hides plates above the chosen price; a chapter
   whose pieces are all hidden has its header hidden too. Top band = open
   ended ("… & above") so premium + made-to-order pieces never disappear. */
function wireCataloguePrice() {
  const slider = document.querySelector('[data-tool="crange"]');
  const bar = slider && slider.closest('.lb-sticky');
  if (!slider || !bar) return;
  const out = bar.querySelector('[data-tool="crangeout"]');
  const lab = bar.querySelector('[data-tool="crangelabel"]');
  const plates = $$('.lb-plate');
  const segs = $$('.lb-seg');
  const maxv = Number(slider.max);

  function applyC() {
    const v = Number(slider.value);
    const atTop = v >= maxv;
    let shown = 0;
    plates.forEach((pl) => {
      const pv = pl.dataset.price === '' ? null : Number(pl.dataset.price);
      const on = atTop || (pv !== null && pv <= v);
      pl.hidden = !on;
      if (on) {
        shown++;
        if (!pl.classList.contains('is-in')) pl.classList.add('is-in');
      }
    });
    segs.forEach((sg) => {
      const key = sg.id.replace('seg-', '');
      sg.hidden = !plates.some((pl) => pl.dataset.seg === key && !pl.hidden);
    });
    if (lab) lab.textContent = '';
    if (out) out.textContent = atTop
      ? 'No filter \u00b7 all ' + plates.length + ' pieces'
      : 'Up to ' + fmt(v) + ' \u00b7 ' + shown + ' of ' + plates.length + ' pieces';
    const lbEmpty = document.querySelector('.lb-empty');
    if (lbEmpty) lbEmpty.hidden = shown > 0;
  }

  slider.addEventListener('input', applyC);
  const catReset = document.querySelector('[data-crange-reset]');
  if (catReset) catReset.addEventListener('click', () => {
    slider.value = String(maxv);
    applyC();
  });
}

/* ---------- maps deep-links ------------------------------------------------ */
/* Build time gives every visit link a Google Maps URL (opens the Android app
   directly). On iPhone/iPad we rewrite the href to Apple Maps with the same
   query \u2014 and the exact pin whenever CONFIG.mapPin is filled in. */
function wireMapsLinks() {
  const ios = /iP(hone|ad|od)/.test(navigator.userAgent)
    || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  if (!ios) return;
  document.querySelectorAll('a[data-map]').forEach((a) => {
    const q = a.getAttribute('data-map-q') || 'That Furniture Girl, Ibadan';
    const ll = a.getAttribute('data-map-ll');
    a.href = ll
      ? 'https://maps.apple.com/?ll=' + ll + '&z=18&q=' + encodeURIComponent(q)
      : 'https://maps.apple.com/?q=' + encodeURIComponent(q);
  });
}

/* ---------- colourway swatch matrix --------------------------------------- */
/* One delegated handler for every matrix surface (detail pages, catalogue
   plates, modal): selecting a chip re-highlights, updates the note and
   rewrites the order button beside it so the WhatsApp enquiry names that
   exact colourway. Tapping the active chip clears the choice again. */
function wireColourway() {
  document.addEventListener('click', (e) => {
    const chip = e.target.closest('.cwchip');
    if (!chip) return;
    const root = chip.closest('[data-cwroot]');
    if (!root) return;
    const wasOn = chip.classList.contains('is-on');
    root.querySelectorAll('.cwchip').forEach((c) => {
      c.classList.remove('is-on');
      c.setAttribute('aria-pressed', 'false');
    });
    let chosen = null;
    if (!wasOn) {
      chip.classList.add('is-on');
      chip.setAttribute('aria-pressed', 'true');
      chosen = chip.getAttribute('data-cw');
    }
    const note = root.querySelector('[data-cw-note]');
    if (note) note.textContent = chosen
      ? 'Enquiring about: ' + chosen + '. Tap again to clear.'
      : 'Tap a colourway \u2014 your order message will ask for exactly that one.';
    const link = root.querySelector('a[data-order]');
    const p = PRODUCTS.find((x) => x.id === root.getAttribute('data-pid'));
    if (link && p) {
      const msg = orderMessage(chosen ? Object.assign({}, p, { colours: chosen }) : p);
      link.href = waLink(msg);
    }
  });
}

/* ---------- material swatch popup ---------------------------------------- */
/* Fabric & board swatches in the materials strip open a feel-and-durability
   card. Same shape as the product modal: content cloned into a dialog, body
   scroll locked, focus returned on close, Esc / scrim / \u00d7 close it. */
function wireSwatchModal() {
  const modal = document.getElementById('sw-modal');
  if (!modal) return;
  let lastFocus = null;

  function open(key) {
    const pane = document.getElementById('sw-' + key);
    if (!pane) return;
    modal.innerHTML = '<button class="sw-modal__close" type="button" aria-label="Close">&times;</button>'
      + '<div class="sw-pane">' + pane.innerHTML + '</div>';
    modal.hidden = false;
    requestAnimationFrame(() => modal.classList.add('is-open'));
    document.body.style.overflow = 'hidden';
    lastFocus = document.activeElement;
    const btn = modal.querySelector('.sw-modal__close');
    if (btn) btn.focus();
  }

  function close() {
    if (modal.hidden) return;
    modal.classList.remove('is-open');
    document.body.style.overflow = '';
    window.setTimeout(() => { modal.hidden = true; modal.innerHTML = ''; }, 180);
    if (lastFocus) lastFocus.focus();
  }

  document.addEventListener('click', (e) => {
    const sw = e.target.closest('[data-swatch]');
    if (sw) { open(sw.getAttribute('data-swatch')); return; }
    if (e.target.closest('.sw-modal__close') || e.target === modal) close();
  });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
}

/* ---------- hero slider ------------------------------------------------- */


/* ---------- search overlay --------------------------------------------- */

function wireSearch() {
  const panel = document.getElementById('searchPanel');
  if (!panel) return;
  const input = panel.querySelector('input');
  const out = panel.querySelector('.search-panel__results');
  let lastFocusEl;

  function render(q) {
    const needle = (q || '').trim().toLowerCase();
    const list = PRODUCTS.filter((p) => !needle || p.haystack.indexOf(needle) > -1);
    if (!list.length) {
      out.innerHTML = '<div class="search-panel__empty">Nothing matches that yet &mdash; message us and we will build it for you.</div>';
      return;
    }
    out.innerHTML = list.map((p) =>
      '<a class="search-result" href="' + p.id + '.html">' +
        '<img src="assets/img/opt/' + p.img + '" alt="" loading="lazy">' +
        '<span><strong>' + p.name + '</strong>' +
        '<span>' + categoryLabel(p.cat) + ' &middot; ' +
          (p.price ? fmt(p.price) : 'Price on request') + '</span></span></a>').join('');
  }

  function open() {
    lastFocusEl = document.activeElement;
    panel.classList.add('is-open');
    render('');
    if (input) { input.value = ''; input.focus(); }
  }
  function close() {
    panel.classList.remove('is-open');
    if (lastFocusEl) lastFocusEl.focus();
  }

  $$('[data-open-search]').forEach((b) => b.addEventListener('click', open));
  panel.addEventListener('click', (e) => {
    if (e.target === panel) close();
    if (e.target.closest('.search-panel__close')) close();
  });
  if (input) input.addEventListener('input', () => render(input.value));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
}

/* ---------- chat FAB: wake politely -------------------------------------- */

/* The "Chat with a Designer" pill stays parked until the visitor has actually
   looked around — 30 seconds of dwell, or 5 furniture pieces scrolled past,
   whichever comes first — then it slides in and stays. */
function wakeFab() {
  const fab = document.querySelector('.fab');
  if (!fab) return;
  let awake = false;
  const passed = () => {
    const items = document.querySelectorAll('.product-card:not([hidden]), .lb-plate:not([hidden])');
    let n = 0;
    for (const el of items) {
      if (el.getBoundingClientRect().top < 120) { n++; if (n >= 5) return n; } else break;
    }
    return n;
  };
  function onScroll() { if (passed() >= 5) wake(); }
  function wake() {
    if (awake) return;
    awake = true;
    fab.classList.add('is-awake');
    window.removeEventListener('scroll', onScroll);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.setTimeout(wake, 30000);
  if (passed() >= 5) wake(); /* reloaded mid-page or restored scroll */
}

/* ---------- announcement marquee --------------------------------------- */

/* The bar's second copy exists only to make the loop seamless. Looping is
   enabled by measurement (a single copy must actually overflow the bar) and
   is never enabled for reduced-motion visitors, so the announcement text
   can no longer sit there printed twice side by side. */
function wireAnnounce() {
  const bar = document.querySelector('.announce');
  if (!bar) return;
  const track = bar.querySelector('.announce__track');
  const group = bar.querySelector('.announce__group');
  if (!track || !group) return;
  const mq = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
  const measure = () => {
    const fits = group.scrollWidth <= bar.clientWidth + 1;
    const still = mq && mq.matches;
    const loop = !fits && !still;
    bar.classList.toggle('is-loop', loop);
    bar.classList.toggle('is-center', fits);  // only center when nothing gets clipped
    track.style.animationDuration = loop ? Math.max(16, Math.round(group.scrollWidth / 42)) + 's' : '';
  };
  measure();
  window.addEventListener('resize', measure, { passive: true });
  window.addEventListener('load', measure);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(measure);
  if (mq && mq.addEventListener) mq.addEventListener('change', measure);
}

/* ---------- boot -------------------------------------------------------- */

document.addEventListener('DOMContentLoaded', () => {
  modal = document.getElementById('productModal');

  /* WhatsApp links written in the HTML: <a data-wa="message">.
     Two conventions coexist: data-wa holds plain message text, but the
     product-card chat buttons store a full wa.me URL there. Accept both. */
  const waUrl = (v) => {
    v = (v || '').trim();
    if (!v) v = 'Hello ' + CONFIG.brand + '! I would like to make an enquiry.';
    return /^https?:\/\//.test(v) ? v : waLink(v);
  };
  $$('[data-wa]').forEach((el) => {
    el.setAttribute('href', waUrl(el.getAttribute('data-wa')));
    el.setAttribute('target', '_blank');
    el.setAttribute('rel', 'noopener');
  });

  /* Newsletter — no mailing service behind it, so the form hands off to
     WhatsApp with what they typed in the message. */
  const newsForm = document.getElementById('newsletterForm');
  if (newsForm) {
    newsForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = newsForm.querySelector('input');
      const who = ((input && input.value) || '').trim();
      let msg = 'Hello ' + CONFIG.brand + '! Please add me to your updates list.';
      if (who) msg += ' My name or email: ' + who;
      window.open(waLink(msg), '_blank', 'noopener');
    });
  }

  $$('[data-tools-for]').forEach(wireFilters);
  wireCataloguePrice();
  wireSwatchModal();
  wireMapsLinks();
  wireColourway();
  wireAnnounce();
  wakeFab();
  wireCart();
  wireSearch();

  /* Modal close still delegated (the shell stays mounted for future use) */
  document.addEventListener('click', (e) => {
    if (e.target.closest('.js-close-modal')) closeModal();
  });

  /* Chat buttons open WhatsApp in a new tab without navigating the card.
     data-wa holds the MESSAGE TEXT, not a URL — route it through waLink().
     (Using the raw attribute as a URL made the browser navigate to
     "…/Hello!%20I%20would%20like…" on the site itself, which broke every
     WhatsApp button.) */
  document.addEventListener('click', (e) => {
    const waBtn = e.target.closest('[data-wa]');
    if (!waBtn) return;
    e.preventDefault();
    window.open(waUrl(waBtn.getAttribute('href') || waBtn.getAttribute('data-wa')), '_blank', 'noopener');
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') { closeModal(); closeDrawer(); }
  });

  /* Mobile drawer */
  const drawer = document.getElementById('drawer');
  const scrim = document.getElementById('scrim');
  const toggle = document.getElementById('navToggle');
  function openDrawer() {
    if (!drawer) return;
    drawer.classList.add('is-open');
    if (scrim) scrim.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    if (toggle) toggle.setAttribute('aria-expanded', 'true');
  }
  if (toggle) toggle.addEventListener('click', openDrawer);
  if (scrim) scrim.addEventListener('click', () => { closeDrawer(); if (toggle) toggle.setAttribute('aria-expanded', 'false'); });
  $$('[data-close-drawer]').forEach((b) => b.addEventListener('click', () => {
    closeDrawer();
    if (toggle) toggle.setAttribute('aria-expanded', 'false');
  }));

  /* Sticky header shadow */
  const header = document.getElementById('siteHeader');
  if (header) {
    const onScroll = () => header.classList.toggle('is-stuck', window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* Year */
  $$('[data-year]').forEach((el) => { el.textContent = new Date().getFullYear(); });

  /* Piece-page gallery: thumbnails swap the main photo (jpeg + webp source) */
  document.addEventListener('click', (e) => {
    const th = e.target.closest('[data-gal]');
    if (!th) return;
    const img = document.getElementById('pieceImg');
    const src = document.getElementById('pieceSource');
    if (!img) return;
    img.src = th.getAttribute('data-gal');
    if (src) src.srcset = th.getAttribute('data-galwebp');
    const strip = th.closest('.piece__thumbs');
    const media = document.querySelector('.piece__media');
    if (media) media.classList.toggle('wm-off', th.getAttribute('data-stamp') === '1');
    if (strip) $$('button', strip).forEach((b) => b.classList.toggle('is-on', b === th));
  });

    /* Hero workshop film: honour reduced motion (CSS hides the element; this
     also stops decoding so it costs nothing on battery). */
  {
    document.querySelectorAll('.hero__video').forEach((v) => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        v.removeAttribute('autoplay'); v.pause();
      }
    });
  }

/* Hero stats: gentle count-up when the band scrolls into view.
     Values are the owner's verified figures — nothing is invented. */
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reduce && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => entries.forEach((en) => {
      if (!en.isIntersecting) return;
      io.unobserve(en.target);
      const el = en.target;
      if (el.querySelector('.product-card')) return; /* never animate over a live grid (2026-10-20 guard) */
      const end = parseInt(el.getAttribute('data-count'), 10);
      const suf = el.getAttribute('data-suffix') || '';
      /* rounded stats (soc()) must land on their compact final string, e.g.
         "59K+", not the locale-formatted "59,000K+" — data-final carries it */
      const fin = el.getAttribute('data-final') || '';
      const t0 = performance.now();
      const dur = 1500;
      const step = (t) => {
        const k = Math.min(1, (t - t0) / dur);
        const ease = 1 - Math.pow(1 - k, 3);
        el.textContent = (k === 1 && fin) ? fin
          : Math.round(end * ease).toLocaleString('en-US') + (k === 1 ? suf : '');
        if (k < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }), { threshold: 0.4 });
    $$('.stat [data-count], .stat[data-count]').forEach((c) => io.observe(c));
  }

  observeReveals(document);
});

/* ==========================================================================
   Testimonial screenshot lightbox.
   Tap a chat screenshot to read it large; arrows / keyboard / swipe browse
   the set. The wall's anchors still open the images without JavaScript.
   ========================================================================== */
(() => {
  const raw = Array.from(document.querySelectorAll('.shot-wall a.shot-wall__item, .showcase a.showcase__item'));
  /* the showcase re-features some of the wall's screenshots — open once per
     image so prev/next never lands on the same shot twice */
  const seenShots = new Set();
  const items = raw.filter((a) => {
    const h = a.getAttribute('href');
    if (seenShots.has(h)) return false;
    seenShots.add(h);
    return true;
  });
  if (!items.length) return;

  const box = document.createElement('div');
  box.className = 'shotbox';
  box.setAttribute('role', 'dialog');
  box.setAttribute('aria-modal', 'true');
  box.setAttribute('aria-label', 'Customer chat screenshot');
  box.innerHTML =
    '<button class="shotbox__close" type="button" aria-label="Close">✕</button>' +
    '<button class="shotbox__nav shotbox__nav--prev" type="button" aria-label="Previous screenshot">‹</button>' +
    '<figure class="shotbox__fig"><img class="shotbox__img" alt="" /><figcaption class="shotbox__cap"></figcaption></figure>' +
    '<button class="shotbox__nav shotbox__nav--next" type="button" aria-label="Next screenshot">›</button>';
  document.body.appendChild(box);

  const img = box.querySelector('.shotbox__img');
  const cap = box.querySelector('.shotbox__cap');
  const btnClose = box.querySelector('.shotbox__close');
  const btnPrev = box.querySelector('.shotbox__nav--prev');
  const btnNext = box.querySelector('.shotbox__nav--next');
  let idx = 0;
  let lastFocus = null;

  const srcOf = (i) => items[i].getAttribute('href');
  const show = (i) => {
    idx = (i + items.length) % items.length;
    img.src = srcOf(idx);
    const thumb = items[idx].querySelector('img');
    img.alt = thumb ? thumb.alt : '';
    cap.textContent = idx + 1 + ' / ' + items.length;
    [idx + 1, idx - 1].forEach((j) => {
      const k = (j + items.length) % items.length;
      const pre = new Image();
      pre.src = srcOf(k);
    });
  };
  const open = (i) => {
    lastFocus = document.activeElement;
    show(i);
    box.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    btnClose.focus();
  };
  const close = () => {
    box.classList.remove('is-open');
    document.body.style.overflow = '';
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  };

  items.forEach((a, i) => a.addEventListener('click', (e) => {
    e.preventDefault();
    open(i);
  }));
  btnClose.addEventListener('click', close);
  btnPrev.addEventListener('click', (e) => { e.stopPropagation(); show(idx - 1); });
  btnNext.addEventListener('click', (e) => { e.stopPropagation(); show(idx + 1); });
  box.addEventListener('click', (e) => {
    if (e.target === box || e.target.classList.contains('shotbox__fig')) close();
  });
  document.addEventListener('keydown', (e) => {
    if (!box.classList.contains('is-open')) return;
    if (e.key === 'Escape') close();
    else if (e.key === 'ArrowLeft') show(idx - 1);
    else if (e.key === 'ArrowRight') show(idx + 1);
  });

  let touchX = null;
  box.addEventListener('touchstart', (e) => {
    touchX = e.touches[0].clientX;
  }, { passive: true });
  box.addEventListener('touchend', (e) => {
    if (touchX === null) return;
    const dx = e.changedTouches[0].clientX - touchX;
    if (Math.abs(dx) > 40) show(dx > 0 ? idx - 1 : idx + 1);
    touchX = null;
  }, { passive: true });
})();
