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
  const bits = ['Hello ' + CONFIG.brand + '! I would like to order the ' + p.name];
  if (p.colours) bits.push(' (' + p.colours + ')');
  if (p.price) bits.push(' \u2014 ' + fmt(p.price));
  bits.push('. Is it available?');
  return bits.join('');
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

function openModal(p) {
  if (!modal) return;
  let specs = '';
  const row = (k, v) => { if (v) specs += '<div><dt>' + k + '</dt><dd>' + v + '</dd></div>'; };
  row('Colour', p.colours);
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
      '<div class="modal__body">' +
        (p.badge ? '<span class="badge badge--clay" style="justify-self:start">' + p.badge + '</span>' : '') +
        '<h3>' + p.name + '</h3>' +
        '<p class="muted">' + p.desc + '</p>' +
        '<dl class="spec-list">' + specs + '</dl>' +
        '<div class="price" style="margin-top:4px">' + priceHTML(p) + '</div>' +
        '<a class="btn btn--primary btn--block" href="' + waLink(orderMessage(p)) + '" target="_blank" rel="noopener">Order on WhatsApp</a>' +
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
    const cards = $$('.product-card', grid);
  const filterBar = toolbar.querySelector('.chip-row');
  const search = toolbar.querySelector('[data-tool="search"]');
  const range = toolbar.querySelector('[data-tool="range"]');
  const rangeOut = toolbar.querySelector('[data-tool="rangeout"]');
  const viewBtns = $$('[data-tool="grid"], [data-tool="list"]', toolbar);

  const rangeMax = range ? Number(range.max) : Infinity;
  let current = 'all';
  let query = '';
  let maxPrice = rangeMax;

  function syncRange() {
    if (!range) return;
    maxPrice = Number(range.value);
    if (rangeOut) rangeOut.textContent = fmt(maxPrice) + (maxPrice >= rangeMax ? '+' : '');
  }

  function apply() {
    let shown = 0;
    cards.forEach((card) => {
      const catOk = current === 'all' || card.dataset.cat === current;
      const priceValue = card.dataset.price === '' ? null : Number(card.dataset.price);
      // a price-on-request piece only shows at the full range
      const priceOk = priceValue ? priceValue <= maxPrice : maxPrice >= rangeMax;
      const textOk = !query || card.dataset.search.includes(query);
      const on = catOk && priceOk && textOk;
      card.hidden = !on;
      if (on) shown++;
    });
    if (emptyMsg) emptyMsg.hidden = shown > 0;
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

/* ---------- hero slider ------------------------------------------------- */

function wireHero() {
  const panel = document.getElementById('heroPanel');
  const slides = document.getElementById('heroSlides');
  if (!panel || !slides) return;

  const nodes = $$('.hero__slide', slides);
  if (!nodes.length) return;

  const badge = document.getElementById('heroBadge');
  const name = document.getElementById('heroName');
  const price = document.getElementById('heroPrice');
  const dots = document.getElementById('heroDots');
  let at = 0;

  if (dots) {
    dots.innerHTML = nodes.map((n, i) =>
      '<button type="button" class="' + (i === 0 ? 'is-on' : '') + '" data-slide="' + i +
      '" aria-label="Show ' + n.dataset.name + '"></button>').join('');
  }

  function show(i) {
    at = (i + nodes.length) % nodes.length;
    nodes.forEach((n, idx) => n.classList.toggle('is-on', idx === at));
    if (dots) $$('button', dots).forEach((d, idx) => d.classList.toggle('is-on', idx === at));
    const slide = nodes[at];
    if (name) name.textContent = slide.dataset.name;
    if (price) price.textContent = slide.dataset.price;
    if (badge) badge.textContent = slide.dataset.badge;
    restartBar();
  }

  $$('[data-hero]').forEach((b) => {
    b.addEventListener('click', () => { show(at + Number(b.getAttribute('data-hero'))); restart(); });
  });
  if (dots) {
    dots.addEventListener('click', (e) => {
      const b = e.target.closest('[data-slide]');
      if (!b) return;
      show(Number(b.getAttribute('data-slide')));
      restart();
    });
  }

  let timer = null;
  const reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  /* Autoplay cadence: was 6000ms, now 1.5x faster (6000 / 1.5 = 4000ms). */
  const AUTOPLAY_MS = 4000;
  /* Progress hairline: restarts its CSS animation in lockstep with every slide
     change so the fill always matches the 4s rotation. */
  const bar = panel.querySelector('.hero__progress i');
  function restartBar() {
    if (!bar) return;
    if (reduced || nodes.length < 2) { bar.style.animation = 'none'; return; }
    bar.style.animation = 'none';
    void bar.offsetWidth;
    bar.style.animation = '';
    bar.style.animationPlayState = 'running';
  }
  function restart() {
    if (timer) clearInterval(timer);
    if (reduced || nodes.length < 2) return;
    timer = setInterval(() => show(at + 1), AUTOPLAY_MS);
    restartBar();
  }
  panel.addEventListener('mouseenter', () => {
    if (timer) clearInterval(timer);
    if (bar) bar.style.animationPlayState = 'paused';
  });
  panel.addEventListener('mouseleave', restart);
  show(0);
  restart();
}

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

/* ---------- boot -------------------------------------------------------- */

document.addEventListener('DOMContentLoaded', () => {
  modal = document.getElementById('productModal');

  /* WhatsApp links written in the HTML: <a data-wa="message"> */
  $$('[data-wa]').forEach((el) => {
    const msg = el.getAttribute('data-wa') || ('Hello ' + CONFIG.brand + '! I would like to make an enquiry.');
    el.setAttribute('href', waLink(msg));
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
  wireHero();
  wireSearch();

  /* Modal close still delegated (the shell stays mounted for future use) */
  document.addEventListener('click', (e) => {
    if (e.target.closest('.js-close-modal')) closeModal();
  });

  /* Chat buttons open WhatsApp in a new tab without navigating the card */
  document.addEventListener('click', (e) => {
    const waBtn = e.target.closest('[data-wa]');
    if (!waBtn) return;
    e.preventDefault();
    window.open(waBtn.getAttribute('data-wa'), '_blank', 'noopener');
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

  observeReveals(document);
});
