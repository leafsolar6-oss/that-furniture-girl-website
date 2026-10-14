/* ==========================================================================
   That Furniture Girl — site behaviour
   --------------------------------------------------------------------------
   Renders the shop grid and featured pieces from products.js, handles the
   mobile drawer, sticky header, product quick-view, filters, scroll reveals
   and every WhatsApp order link on the site.
   You should not need to edit this file — prices and details live in
   assets/js/products.js
   ========================================================================== */

(function () {
  'use strict';

  var CFG  = window.TFG_CONFIG;
  var IMG  = 'assets/img/opt/';

  /* Photos live in assets/img/opt/ on the multi-page site. The single-file
     version of the site embeds them as data URIs in window.TFG_IMG_MAP. */
  function imgSrc(file) {
    var map = window.TFG_IMG_MAP;
    return (map && map[file]) ? map[file] : IMG + file;
  }

  /* ---------- helpers ---------------------------------------------------- */

  function fmt(n) {
    return CFG.currency + Number(n).toLocaleString('en-NG');
  }

  function waLink(message) {
    return 'https://wa.me/' + CFG.whatsapp + '?text=' + encodeURIComponent(message);
  }

  function orderMessage(p) {
    var bits = ['Hello ' + CFG.brand + '! I would like to order the ' + p.name];
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

  function specLine(p) {
    var parts = [];
    if (p.colours)  parts.push('<b>Colour:</b> ' + p.colours);
    if (p.material) parts.push('<b>Material:</b> ' + p.material);
    return parts.join(' · ');
  }

  var ICONS = {
    arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
    wa:    '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.47 14.38c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.76-1.66-2.06-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.06 2.88 1.21 3.08c.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.69.63.71.22 1.36.19 1.87.12.57-.09 1.75-.72 2-1.41.25-.69.25-1.28.17-1.41-.07-.13-.27-.2-.57-.35z"/><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.46 1.32 4.96L2 22l5.25-1.38a9.87 9.87 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2zm0 18.15h-.01a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.18 8.18 0 0 1-1.26-4.38c0-4.54 3.7-8.23 8.25-8.23 2.2 0 4.27.86 5.83 2.41a8.19 8.19 0 0 1 2.41 5.83c0 4.54-3.7 8.23-8.24 8.23z"/></svg>',
    eye:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>'
  };

  /* ---------- product markup -------------------------------------------- */

  function cardHTML(p, delay) {
    var badges = '';
    if (p.badge) badges += '<span class="badge ' + (p.badge === 'Signature' ? 'badge--gold' : 'badge--clay') + '">' + p.badge + '</span>';
    if (p.lead && /pickup/i.test(p.lead)) badges += '<span class="badge">Available now</span>';

    return '' +
      '<article class="product reveal" data-delay="' + (delay || 0) + '" data-id="' + p.id + '">' +
        '<div class="product__media">' +
          '<img src="' + imgSrc(p.img) + '" alt="' + p.name + ' — ' + (p.colours || 'handmade furniture') + '" loading="lazy" width="900" height="600">' +
          '<div class="badges">' + badges + '</div>' +
        '</div>' +
        '<div class="product__body">' +
          '<h3 class="product__name">' + p.name + '</h3>' +
          '<p class="product__spec">' + specLine(p) + '</p>' +
          '<div class="product__foot">' +
            '<div class="price">' + priceHTML(p) + '</div>' +
            '<div class="product__actions">' +
              '<button class="icon-btn js-quick" type="button" aria-label="Quick view: ' + p.name + '">' + ICONS.eye + '</button>' +
              '<a class="btn-wa" href="' + waLink(orderMessage(p)) + '" target="_blank" rel="noopener">' + ICONS.wa + '<span>Order</span></a>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</article>';
  }

  function renderGrid(el, list) {
    if (!el) return;
    if (!list.length) {
      el.innerHTML = '<div class="empty-state">No pieces in this category yet — message us and we will build it for you.</div>';
      return;
    }
    el.innerHTML = list.map(function (p, i) { return cardHTML(p, i % 3); }).join('');
    observeReveals(el);
  }

  /* ---------- quick view ------------------------------------------------- */

  var modal, lastFocus;

  function openModal(p) {
    if (!modal) return;
    var specs = '';
    function row(k, v) { if (v) specs += '<div><dt>' + k + '</dt><dd>' + v + '</dd></div>'; }
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
        '<div class="modal__media"><img src="' + imgSrc(p.img) + '" alt="' + p.name + '"></div>' +
        '<div class="modal__body">' +
          (p.badge ? '<span class="badge badge--clay" style="justify-self:start">' + p.badge + '</span>' : '') +
          '<h3>' + p.name + '</h3>' +
          '<p class="muted">' + p.desc + '</p>' +
          '<dl class="spec-list">' + specs + '</dl>' +
          '<div class="price" style="margin-top:4px">' + priceHTML(p) + '</div>' +
          '<a class="btn btn--primary btn--block" href="' + waLink(orderMessage(p)) + '" target="_blank" rel="noopener">Order on WhatsApp</a>' +
          '<p class="small muted">Production time 5\u201310 working days on most builds. Same-day delivery available in Ibadan.</p>' +
        '</div>' +
      '</div>';
    modal.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    lastFocus = document.activeElement;
    var closeBtn = modal.querySelector('.modal__close');
    if (closeBtn) closeBtn.focus();
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.remove('is-open');
    modal.innerHTML = '';
    document.body.style.overflow = '';
    if (lastFocus) lastFocus.focus();
  }

  /* ---------- scroll reveals -------------------------------------------- */

  var io;
  function observeReveals(scope) {
    var targets = (scope || document).querySelectorAll('.reveal:not(.is-in)');
    if (!('IntersectionObserver' in window)) {
      Array.prototype.forEach.call(targets, function (t) { t.classList.add('is-in'); });
      return;
    }
    if (!io) {
      io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
        });
      }, { threshold: 0, rootMargin: '0px 0px -5% 0px' });
    }
    Array.prototype.forEach.call(targets, function (t) { io.observe(t); });

    /* Safety net: anything already on screen shortly after load is shown even
       if the observer never fires (odd embeds, print, very tall elements). */
    if (!observeReveals._net) {
      observeReveals._net = true;
      window.setTimeout(function () {
        Array.prototype.forEach.call(document.querySelectorAll('.reveal:not(.is-in)'), function (t) {
          var box = t.getBoundingClientRect();
          if (box.top < window.innerHeight * 1.05) t.classList.add('is-in');
        });
      }, 900);
    }
  }

  /* ---------- boot ------------------------------------------------------- */

  document.addEventListener('DOMContentLoaded', function () {
    modal = document.getElementById('productModal');

    /* WhatsApp links written in the HTML: <a data-wa="message"> */
    Array.prototype.forEach.call(document.querySelectorAll('[data-wa]'), function (el) {
      var msg = el.getAttribute('data-wa') || ('Hello ' + CFG.brand + '! I would like to make an enquiry.');
      el.setAttribute('href', waLink(msg));
      el.setAttribute('target', '_blank');
      el.setAttribute('rel', 'noopener');
    });

    /* Featured pieces on the home page */
    var featured = document.getElementById('featuredGrid');
    if (featured) {
      var list = TFG_PRODUCTS.filter(function (p) { return p.featured; });
      var limit = parseInt(featured.getAttribute('data-limit') || '6', 10);
      renderGrid(featured, list.slice(0, limit));
    }

    /* Full shop grid + filters */
    var grid = document.getElementById('shopGrid');
    var filterBar = document.getElementById('shopFilters');
    if (grid) {
      var current = 'all';
      function apply() {
        var list = current === 'all' ? TFG_PRODUCTS : TFG_PRODUCTS.filter(function (p) { return p.cat === current; });
        renderGrid(grid, list);
      }
      if (filterBar) {
        filterBar.innerHTML = TFG_CATEGORIES.map(function (c, i) {
          return '<button class="chip' + (i === 0 ? ' is-active' : '') + '" type="button" data-cat="' + c.key + '">' + c.label + '</button>';
        }).join('');
        filterBar.addEventListener('click', function (e) {
          var chip = e.target.closest('.chip');
          if (!chip) return;
          current = chip.getAttribute('data-cat');
          Array.prototype.forEach.call(filterBar.children, function (c) { c.classList.remove('is-active'); });
          chip.classList.add('is-active');
          apply();
        });

        /* Deep links from the footer, e.g. shop.html#cat-sofas */
        var wanted = (window.location.hash || '').replace('#cat-', '');
        if (wanted && wanted !== window.location.hash) {
          var match = filterBar.querySelector('[data-cat="' + wanted + '"]');
          if (match) { current = wanted; match.click(); }
        }
      }
      apply();
    }

    /* Quick view (delegated, so it works for every rendered card) */
    document.addEventListener('click', function (e) {
      var quick = e.target.closest('.js-quick');
      if (quick) {
        var card = quick.closest('[data-id]');
        var p = TFG_PRODUCTS.filter(function (x) { return x.id === (card && card.getAttribute('data-id')); })[0];
        if (p) openModal(p);
        return;
      }
      if (e.target.closest('.js-close-modal')) closeModal();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { closeModal(); closeDrawer(); }
      if (e.key === 'Enter' && e.target.classList && e.target.classList.contains('js-quick')) e.target.click();
    });

    /* Mobile drawer */
    var drawer = document.getElementById('drawer');
    var scrim  = document.getElementById('scrim');
    var toggle = document.getElementById('navToggle');
    if (toggle && drawer) {
      toggle.addEventListener('click', function () {
        drawer.classList.add('is-open');
        if (scrim) scrim.classList.add('is-open');
        document.body.style.overflow = 'hidden';
      });
    }
    if (scrim) scrim.addEventListener('click', closeDrawer);
    function closeDrawer() {
      if (drawer) drawer.classList.remove('is-open');
      if (scrim) scrim.classList.remove('is-open');
      document.body.style.overflow = '';
    }
    Array.prototype.forEach.call(document.querySelectorAll('[data-close-drawer]'), function (b) {
      b.addEventListener('click', closeDrawer);
    });

    /* Sticky header shadow */
    var header = document.getElementById('siteHeader');
    if (header) {
      var onScroll = function () {
        header.classList.toggle('is-stuck', window.scrollY > 12);
      };
      onScroll();
      window.addEventListener('scroll', onScroll, { passive: true });
    }

    /* Year + current nav highlight */
    Array.prototype.forEach.call(document.querySelectorAll('[data-year]'), function (el) {
      el.textContent = new Date().getFullYear();
    });

    observeReveals(document);
  });
})();
