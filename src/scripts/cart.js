/* ==========================================================================
   Order list — the lightweight, on-device cart.

   The shop has no server and takes no payment (see README): this collects
   the pieces a visitor likes, with quantities and chosen colourways, and
   hands the whole list to ONE pre-filled WhatsApp message. State lives in
   localStorage only, so it survives reloads and syncs across open tabs;
   it is never sent anywhere else.

   Surfaces that add to the list:
     · the + button on every product card        (data-add="<id>")
     · "Add to order list" on the piece's page    (honours the swatch picked)
     · the same button in the quick-view modal
   The header bag icon opens the list drawer; "Send order list" opens the
   order form, which composes the message.
   ========================================================================== */
import { PRODUCTS } from '../data/products.js';
import { waLink, fmt, subline } from '../lib/site.js';

const KEY = 'tfg.order-list.v1';
const CUST = 'tfg.order-cust.v1';
const MAXQ = 99;
const P = new Map(PRODUCTS.map((p) => [p.id, p]));

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const $all = (sel, scope = document) => Array.from(scope.querySelectorAll(sel));

/* ---------- state ------------------------------------------------------- */

let lines = [];

function read() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const a = JSON.parse(raw);
    if (!Array.isArray(a)) return [];
    return a
      .filter((l) => l && P.has(l.id))
      .map((l) => ({
        id: l.id,
        qty: Math.min(MAXQ, Math.max(1, Math.round(Number(l.qty)) || 1)),
        cw: typeof l.cw === 'string' ? l.cw.slice(0, 70) : null,
      }));
  } catch { return []; }
}

function write() {
  try {
    if (lines.length) localStorage.setItem(KEY, JSON.stringify(lines));
    else localStorage.removeItem(KEY);
  } catch { /* private mode: the list just won't survive the tab */ }
  render();
}

const lineKey = (l) => l.id + '\u0001' + (l.cw || '');
const findLine = (id, cw) => lines.find((l) => lineKey(l) === lineKey({ id, cw }));

function add(id, cw) {
  if (!P.has(id)) return;
  const hit = findLine(id, cw);
  if (hit) hit.qty = Math.min(MAXQ, hit.qty + 1);
  else lines.push({ id, qty: 1, cw: cw || null });
  write();
  toast(hit ? P.get(id).name + ' — now ' + hit.qty + ' on your list' : P.get(id).name + ' added to your order list');
  pulse();
}

/* ---------- money -------------------------------------------------------- */

function totals() {
  let sum = 0, fixed = 0, ranged = 0, asking = 0;
  for (const l of lines) {
    const p = P.get(l.id);
    if (p.priceTo) ranged++;
    else if (p.price) { sum += p.price * l.qty; fixed++; }
    else asking++;
  }
  const pieces = lines.reduce((n, l) => n + l.qty, 0);
  return { sum, fixed, ranged, asking, pieces };
}

/* ---------- message builders --------------------------------------------- */

function lineText(l, n) {
  const p = P.get(l.id);
  const colour = l.cw || (p.colours ? p.colours.split(' \u00b7 also ')[0] : '');
  const each = p.priceTo
    ? fmt(p.price) + ' \u2013 ' + fmt(p.priceTo) + ' each'
    : p.price ? fmt(p.price) + ' each' : 'price on request';
  const when = p.lead && /pickup/i.test(p.lead) ? 'showroom ready' : p.price ? 'made to order' : 'catalogue piece';
  return n + '. ' + p.name + (colour ? ' \u2014 ' + colour : '') + ' \u00b7 ' + l.qty + (l.qty > 1 ? ' pcs' : ' pc')
    + ' \u00b7 ' + each + ' \u00b7 ' + when;
}

function plainList() {
  const t = totals();
  const rows = lines.map((l, i) => lineText(l, i + 1)).join('\n');
  const money = t.fixed
    ? '\nListed total: ' + fmt(t.sum) + (t.ranged || t.asking ? ' plus ' + (t.ranged ? 'size-based ' : '') + (t.asking ? 'on-request ' : '') + 'pieces quoted in chat' : '')
    : '\nPrices to confirm in chat';
  return rows + money;
}

function orderMessage(cust) {
  let msg = 'Hello That Furniture Girl! \uD83E\uDDFE I would like to place this order:\n\n'
    + plainList() + '\n\nFinal total, delivery and how to pay are for you to confirm.';
  const bits = [];
  if (cust.name) bits.push('Name: ' + cust.name);
  if (cust.phone) bits.push('Call/WhatsApp: ' + cust.phone);
  if (cust.deliv !== 'pickup') bits.push('Delivery: ' + (cust.deliv === 'ibadan' ? 'within Ibadan' : 'to another state') + (cust.addr ? ' \u2014 ' + cust.addr : ''));
  else bits.push('Delivery: pickup at your showroom');
  if (cust.notes) bits.push('Notes: ' + cust.notes);
  return msg + '\n\n' + bits.join('\n')
    + '\n\nCould you confirm availability, the exact total and how to start with a deposit?';
}

/* ---------- render -------------------------------------------------------- */

const imgFor = (p) => 'assets/img/opt/' + p.img;

function render() {
  const t = totals();
  /* header + detail badges */
  $all('[data-cart-count]').forEach((el) => {
    el.textContent = t.pieces > 9 ? '9+' : String(t.pieces);
    el.hidden = t.pieces === 0;
  });
  $all('[data-open-cart]').forEach((el) => {
    el.setAttribute('aria-label', t.pieces ? 'Your order list \u2014 ' + t.pieces + (t.pieces > 1 ? ' pieces' : ' piece') : 'Your order list \u2014 empty');
  });
  /* add-buttons that are already on the list light up */
  const onList = new Set(lines.map((l) => l.id));
  $all('[data-add]').forEach((b) => b.classList.toggle('is-on', onList.has(b.getAttribute('data-add'))));

  const panel = document.getElementById('tfgCart');
  if (!panel) return;
  const list = panel.querySelector('#tfgCartLines');
  const empty = panel.querySelector('#tfgCartEmpty');
  const foot = panel.querySelector('#tfgCartFoot');
  const sum = panel.querySelector('#tfgCartSum');
  const send = panel.querySelector('[data-cart-send]');

  if (!lines.length) {
    list.innerHTML = '';
    empty.hidden = false;
    foot.hidden = true;
  } else {
    empty.hidden = true;
    foot.hidden = false;
    list.innerHTML = lines.map((l, i) => {
      const p = l.id && P.get(l.id);
      const sub = l.cw || subline(p);
      const each = p.priceTo ? fmt(p.price) + ' \u2013 ' + fmt(p.priceTo) + ' each' : p.price ? fmt(p.price) + (l.qty > 1 ? ' each \u00d7 ' + l.qty + ' = ' + fmt(p.price * l.qty) : ' each') : 'Price on request';
      return '<div class="tfg-line" data-i="' + i + '">'
        + '<img src="' + imgFor(p) + '" alt="" loading="lazy" width="56" height="56">'
        + '<div class="tfg-line__info"><a href="' + esc(p.id) + '.html">' + esc(p.name) + '</a>'
        + (sub ? '<span class="tfg-line__sub">' + esc(sub) + '</span>' : '')
        + '<span class="tfg-line__price">' + each + '</span></div>'
        + '<div class="tfg-line__side">'
        + '<span class="tfg-qty"><button type="button" data-qty="-1" aria-label="One fewer ' + esc(p.name) + ' \u2014 ' + (l.cw || 'listed colourway') + '">&minus;</button>'
        + '<b aria-live="polite">' + l.qty + '</b>'
        + '<button type="button" data-qty="1" ' + (l.qty >= MAXQ ? 'disabled' : '') + ' aria-label="One more ' + esc(p.name) + ' \u2014 ' + (l.cw || 'listed colourway') + '">+</button></span>'
        + '<button type="button" class="tfg-line__rm" data-cart-rm aria-label="Remove ' + esc(p.name) + ' from your order list">Remove</button>'
        + '</div></div>';
    }).join('');
    sum.innerHTML = '<b>' + t.pieces + (t.pieces > 1 ? ' pieces' : ' piece') + '</b>'
      + (t.fixed ? '<span>Listed total ' + fmt(t.sum) + '</span>' : '')
      + (t.ranged || t.asking ? '<small>' + (t.fixed ? 'plus ' : '') + 'size &amp; on-request prices confirmed in chat</small>' : '');
    send.disabled = false;
  }
  if (send) send.disabled = !lines.length;
  /* the form, if open, mirrors the list */
  const ofSum = document.getElementById('tfgFormSummary');
  if (ofSum) ofSum.textContent = lines.length ? plainList() : 'Your list is empty.';
}

/* ---------- drawer / form open-close -------------------------------------- */

let cartLastFocus = null, formLastFocus = null;

function openCart() {
  const el = document.getElementById('tfgCart');
  if (!el) return;
  cartLastFocus = document.activeElement;
  el.classList.add('is-open');
  el.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  render();
  const c = el.querySelector('.tfg-cart__close');
  if (c) c.focus();
}
function closeCart() {
  const el = document.getElementById('tfgCart');
  if (!el) return;
  el.classList.remove('is-open');
  el.setAttribute('aria-hidden', 'true');
  if (!document.getElementById('tfgForm')?.classList.contains('is-open')) document.body.style.overflow = '';
  if (cartLastFocus && document.contains(cartLastFocus)) cartLastFocus.focus();
}
function openForm() {
  const el = document.getElementById('tfgForm');
  if (!el || !lines.length) return;
  formLastFocus = document.activeElement;
  try {
    const c = JSON.parse(localStorage.getItem(CUST) || '{}');
    const set = (id, v) => { const f = el.querySelector('#' + id); if (f && v) f.value = v; };
    set('tfgOfName', c.name); set('tfgOfPhone', c.phone); set('tfgOfAddr', c.addr);
    const d = el.querySelector('input[name=tfgDeliv][value="' + (c.deliv || 'ibadan') + '"]');
    if (d) d.checked = true;
  } catch { /* fresh form */ }
  syncAddrVisibility(el);
  el.classList.remove('is-done');
  el.classList.add('is-open');
  el.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  render();
  const f = el.querySelector('#tfgOfName');
  if (f) f.focus();
}
function closeForm() {
  const el = document.getElementById('tfgForm');
  if (!el) return;
  el.classList.remove('is-open');
  el.setAttribute('aria-hidden', 'true');
  if (!document.getElementById('tfgCart')?.classList.contains('is-open')) document.body.style.overflow = '';
  if (formLastFocus && document.contains(formLastFocus)) formLastFocus.focus();
}
function syncAddrVisibility(scope) {
  const on = scope.querySelector('input[name=tfgDeliv]:checked');
  const row = scope.querySelector('.tfg-of__addrrow');
  const lab = scope.querySelector('#tfgOfAddrLabel');
  if (!on || !row) return;
  const hide = on.value === 'pickup';
  row.hidden = hide;
  if (lab && on.value === 'nationwide') lab.textContent = 'Town / city + address for the carrier';
  else if (lab) lab.textContent = 'Address in Ibadan';
}

function currentCw(root) {
  if (!root) return null;
  const on = root.querySelector('.cwchip.is-on');
  return on ? (on.getAttribute('data-cw') || null) : null;
}

/* ---------- toast + badge pulse --------------------------------------------- */

let toastTimer;
function toast(msg) {
  let t = document.getElementById('tfgToast');
  if (!t) {
    t = document.createElement('div');
    t.id = 'tfgToast';
    t.className = 'tfg-toast';
    document.body.appendChild(t);
  }
  t.setAttribute('role', 'status');
  t.innerHTML = '<span>' + esc(msg) + '</span>'
    + '<button type="button" data-cart-open-view>View list</button>';
  t.classList.add('is-on');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('is-on'), 3600);
}
function pulse() {
  $all('.cart-dot').forEach((d) => {
    d.classList.remove('is-pop');
    void d.offsetWidth;
    d.classList.add('is-pop');
  });
}

/* ---------- wiring ----------------------------------------------------------- */

export function wireCart() {
  lines = read();
  render();

  document.addEventListener('click', (e) => {
    /* add to the list — works from cards (inside the card link, hence the
       preventDefault, same idiom as the card chat button), piece pages and
       the quick-view modal, honouring whatever colourway chip is lit there */
    const addBtn = e.target.closest('[data-add]');
    if (addBtn) {
      e.preventDefault();
      const root = addBtn.closest('[data-cwroot]');
      add(addBtn.getAttribute('data-add'), currentCw(root));
      return;
    }
    if (e.target.closest('[data-open-cart], [data-cart-open-view]')) { openCart(); return; }
    if (e.target.closest('[data-cart-close]')) { closeCart(); return; }

    const panel = document.getElementById('tfgCart');
    if (panel && panel.classList.contains('is-open')) {
      const row = e.target.closest('.tfg-line');
      if (row && e.target.closest('[data-cart-rm]')) {
        lines.splice(Number(row.getAttribute('data-i')), 1);
        write();
        return;
      }
      const qbtn = e.target.closest('[data-qty]');
      if (qbtn && row) {
        const l = lines[Number(row.getAttribute('data-i'))];
        if (l) { l.qty = Math.min(MAXQ, Math.max(1, l.qty + Number(qbtn.getAttribute('data-qty')))); write(); }
        return;
      }
      if (e.target.closest('[data-cart-clear]')) {
        lines = [];
        write();
        toast('Order list emptied');
        return;
      }
      if (e.target.closest('[data-cart-copy]')) {
        const btn = e.target.closest('[data-cart-copy]');
        const done = () => { const old = btn.textContent; btn.textContent = 'Copied \u2713'; setTimeout(() => { btn.textContent = old; }, 1600); };
        const txt = plainList();
        if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(txt).then(done, () => fallbackCopy(txt, done));
        else fallbackCopy(txt, done);
        return;
      }
      if (e.target.closest('[data-cart-send]')) { openForm(); return; }
    }

    const form = document.getElementById('tfgForm');
    if (form && form.classList.contains('is-open')) {
      if (e.target.closest('[data-of-cancel], [data-of-scrim]')) { closeForm(); return; }
      if (e.target.closest('[data-of-keep]')) { closeForm(); closeCart(); return; }
      if (e.target.closest('[data-of-clear]')) { lines = []; write(); closeForm(); closeCart(); toast('Order list emptied'); return; }
      const deliv = e.target.closest('input[name=tfgDeliv]');
      if (deliv) { /* change fires too, but taps on the chip label beat us here */ syncAddrVisibility(form); }
    }
  });

  document.addEventListener('change', (e) => {
    if (e.target.matches && e.target.matches('input[name=tfgDeliv]')) {
      const form = document.getElementById('tfgForm');
      if (form) syncAddrVisibility(form);
    }
  });

  document.addEventListener('submit', (e) => {
    const form = document.getElementById('tfgForm');
    if (!form || e.target !== form.querySelector('form')) return;
    e.preventDefault();
    const val = (id) => { const f = form.querySelector('#' + id); return f ? f.value.trim() : ''; };
    const cust = {
      name: val('tfgOfName'),
      phone: val('tfgOfPhone'),
      addr: val('tfgOfAddr'),
      notes: val('tfgOfNotes'),
      deliv: (form.querySelector('input[name=tfgDeliv]:checked') || {}).value || 'ibadan',
    };
    const errs = [];
    if (cust.name.length < 2) errs.push('Your name so the team knows who to greet.');
    if (cust.phone && !/^[0-9+\-\s()]{8,18}$/.test(cust.phone)) errs.push('The phone number looks off \u2014 digits only, 8\u201315 of them.');
    if (cust.deliv !== 'pickup' && cust.addr.length < 4) errs.push('A delivery address is needed (or pick the showroom pickup option).');
    const errEl = form.querySelector('.tfg-of__err');
    form.querySelectorAll('.is-err').forEach((x) => x.classList.remove('is-err'));
    if (errs.length) {
      errEl.textContent = errs.join(' ');
      errEl.hidden = false;
      if (cust.name.length < 2) form.querySelector('#tfgOfName').classList.add('is-err');
      if (cust.phone && !/^[0-9+\-\s()]{8,18}$/.test(cust.phone)) form.querySelector('#tfgOfPhone').classList.add('is-err');
      if (cust.deliv !== 'pickup' && cust.addr.length < 4) form.querySelector('#tfgOfAddr').classList.add('is-err');
      return;
    }
    errEl.hidden = true;
    try { localStorage.setItem(CUST, JSON.stringify({ name: cust.name, phone: cust.phone, addr: cust.addr, deliv: cust.deliv })); } catch {}
    const link = form.querySelector('[data-of-send]');
    link.href = waLink(orderMessage(cust));
    form.classList.add('is-done');
    link.click();
  });

  /* Esc closes the topmost layer: form over drawer */
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    const form = document.getElementById('tfgForm');
    if (form && form.classList.contains('is-open')) { closeForm(); return; }
    const cart = document.getElementById('tfgCart');
    if (cart && cart.classList.contains('is-open')) closeCart();
  });

  /* second tab edits? first tab keeps up */
  window.addEventListener('storage', (e) => {
    if (e.key === KEY || e.key === null) { lines = read(); render(); }
  });
}

function fallbackCopy(txt, done) {
  const ta = document.createElement('textarea');
  ta.value = txt;
  ta.setAttribute('readonly', '');
  ta.style.cssText = 'position:fixed;top:-40px;opacity:0';
  document.body.appendChild(ta);
  ta.select();
  try { document.execCommand('copy'); } catch {}
  document.body.removeChild(ta);
  done();
}
