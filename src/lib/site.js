/* ==========================================================================
   Shared formatting + linking helpers.
   Used by the .astro components at build time AND by src/scripts/site.js in
   the browser, so the WhatsApp messages and prices can never disagree.
   ========================================================================== */
import { CONFIG, categoryLabel } from '../data/products.js';

/* ₦1,234,567 */
export function fmt(n) {
  return CONFIG.currency + Number(n).toLocaleString('en-NG');
}

/* A WhatsApp deep link with the message pre-filled. */
export function waLink(message) {
  return 'https://wa.me/' + CONFIG.whatsapp + '?text=' + encodeURIComponent(message);
}

/* Search text and optional pin every "visit" link carries, so the runtime
   Apple Maps rewrite cannot disagree with the build-time Google Maps URL. */
export const MAPS_Q = CONFIG.brand + ', ' + CONFIG.address;
export const MAPS_LL = CONFIG.mapPin || '';

/* Map deep-link with the showroom pin pre-loaded. Google's URL opens the
   Maps app on Android and the web map on desktop; site.js swaps iPhone and
   iPad over to Apple Maps. */
export function mapsLink() {
  if (CONFIG.mapPlaceId) {
    // Canonical business listing via the Maps URL API — verified to open the
    // shop page itself (name, reviews, one-tap directions). The alternate
    // /maps/place/?q=place_id: form silently drops to an empty map.
    return 'https://www.google.com/maps/search/?api=1&query='
      + encodeURIComponent(CONFIG.mapPlaceName || CONFIG.brand) + '&query_place_id=' + CONFIG.mapPlaceId;
  }
  const q = MAPS_LL ? MAPS_Q + ', ' + MAPS_LL : MAPS_Q;
  return 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(q);
}

/* The message a customer sends when they tap Order on a piece. */
/* Card / plate subtext: the piece's colourway (plus a short fabric word when
   the material IS just a fabric, so "Black" + "Velvet" reads "Black Velvet"),
   then any finish spec that used to clutter the title. */
export function subline(p) {
  if (!p) return '';
  let c = (p.colours || '').trim();
  /* the "· also …" colourway list belongs to the swatch matrix, not the line */
  const cut = c.indexOf(' \u00b7 also ');
  if (cut > -1) c = c.slice(0, cut);
  const m = (p.material || '').trim();
  if (c && c.length <= 22 && m && /^[A-Za-z ]+$/.test(m) && m.split(/\s+/).length <= 2 && m.length <= 18) {
    c = c + ' ' + m.split(/\s+/).map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
  }
  const bits = [];
  if (c) bits.push(c);
  if (p.spec) bits.push(p.spec);
  return bits.join(' \u00b7 ');
}

export function orderMessage(p) {
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

/* Everything the price block needs, as data the template can render. */
export function priceInfo(p) {
  if (p.priceTo) {
    return { value: fmt(p.price) + ' \u2013 ' + fmt(p.priceTo), note: 'Two sizes available', ask: false };
  }
  if (p.price) {
    return { value: fmt(p.price), note: 'Custom colours available', ask: false };
  }
  return { value: 'Price on request', note: 'Made to order', ask: true };
}

/* ==========================================================================
   Colourway engine — shared by the Materials swatch families, the product
   swatch matrix and the quick-view modal, so tint maths live in exactly
   one place. Long raw strings like "Light grey + white · also cream +
   chocolate, navy + white" parse into tappable variant chips.
   ========================================================================== */
const COLOUR_SPLIT = /\s*(?:\+|\/|·|,|&|\band\b|\bor\b|\bwith\b)\s*|\balso\b\s*/;
export const tokensOf = (s) => s.toLowerCase().split(COLOUR_SPLIT).map((t) => t.trim().replace(/\.$/, '')).filter(Boolean);

/* Longest keys win, so "light grey" beats "grey". */
const TINT = [
  ['chocolate', '#4E2E1E'], ['coffee', '#6F4E37'], ['cocoa', '#7B5544'], ['caramel', '#A66A35'],
  ['cognac', '#9F4A23'], ['terracotta', '#C0693D'], ['umber', '#635147'], ['rust', '#9C4A1A'],
  ['cider', '#7E3F1D'], ['carton', '#A97F50'], ['mansonia', '#D9C09A'], ['walnut', '#5C4033'],
  ['mahogany', '#75382E'], ['honey', '#C98F3D'], ['natural wood', '#A98357'], ['wood', '#A98357'],
  ['off white', '#EFE8DA'], ['off-white', '#EFE8DA'], ['ivory', '#F3EAD3'], ['cream', '#EAD9B8'],
  ['champagne', '#D6BC8A'], ['sand', '#DCC9A3'], ['taupe', '#A5927E'], ['linen', '#E5DCC8'],
  ['light grey', '#C4C4C2'], ['light gray', '#C4C4C2'], ['dark grey', '#5E5E5C'], ['dark gray', '#5E5E5C'],
  ['charcoal', '#3C3B3A'], ['grey', '#9A9A98'], ['gray', '#9A9A98'], ['light ash', '#CFC9BF'],
  ['ash', '#B9B4AC'], ['swiss', '#EADFC9'], ['white', '#F4F1EA'], ['black', '#17161A'],
  ['burnt orange', '#B4531E'], ['orange', '#D96A1F'], ['navy', '#1E2A4A'], ['cobalt', '#1F4FA3'],
  ['royal', '#2A3E8C'], ['blue', '#2E4E7E'], ['gold', '#C9A227'], ['emerald', '#1F6B4A'],
  ['teal', '#24706E'], ['turquoise', '#2BAFA6'], ['green', '#3E6B4F'], ['burgundy', '#6B2233'],
  ['red', '#A72626'], ['blush', '#E5B8B4'], ['pink', '#D8A6AE'], ['violet', '#6B4E9C'],
  ['purple', '#5D3A7E'], ['mustard', '#C99A1E'], ['yellow', '#E0B81E'], ['silver', '#BFC3C6'],
  ['marble', '#DAD4C8'], ['floral', '#B86B7E'], ['gloss', '#232327'], ['mirror', '#C9D2D6'],
].sort((a, b) => b[0].length - a[0].length);
export const tintOf = (tok) => TINT.find(([k]) => tok.includes(k))?.[1];

/* CSS for the swatch dot of any colour phrase: flat for one tone, a true
   half-and-half conic split for two-tone combos. */
export function tintStyle(phrase) {
  const hexes = [];
  for (const t of tokensOf(phrase)) {
    const x = tintOf(t);
    if (x && !hexes.includes(x)) hexes.push(x);
    if (hexes.length === 2) break;
  }
  return hexes.length >= 2
    ? 'background: conic-gradient(' + hexes[0] + ' 0 50%, ' + hexes[1] + ' 50% 100%)'
    : 'background: ' + (hexes[0] || '#CFC8BA');
}

const titleish = (s) => s.replace(/(^|[\s+/,&·-])(\p{L})/gu, (_, sep, ch) => sep + ch.toUpperCase());

/* Individual colourway variants of one product, as chip data:
   the base combo, then anything after "also". Empty list when the piece
   has no colour story to matrix. */
export function colourVariants(p) {
  const raw = ((p && p.colours) || '').trim();
  if (!raw) return [];
  const parts = raw.split(/\balso\b/i);
  const heads = [];
  const base = parts[0].replace(/\s*·\s*$/, '').trim();
  if (base) heads.push(base);
  if (parts[1]) for (const s of parts[1].split(',')) {
    const t = s.replace(/[.;]+$/, '').trim();
    if (t) heads.push(t);
  }
  const seen = new Set();
  const out = [];
  for (const h of heads) {
    const k = h.toLowerCase();
    if (seen.has(k)) continue;
    seen.add(k);
    out.push({ label: titleish(h), dot: tintStyle(h) });
  }
  return out;
}

/* Card blurb — the title already sits right above the description, so strip
   a leading "The Oloye Set …" restatement at the start of the sentence.
   Product loops become scannable: each line adds news instead of repeating.
   Only the card display is trimmed; the piece's own page keeps the full
   sentence (that page reads as prose, not as a list). */
export function cardBlurb(p) {
  let d = (p.desc || '').trim();
  if (!d) return '';
  const head = (p.name || '').split('\u2014')[0].trim();
  if (head.length > 3) {
    const esc = head.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const re = new RegExp('^(The\\s+)?' + esc + '\\b[,;:]?\\s*[-\u2014]?\\s*', 'i');
    const stripped = d.replace(re, '');
    if (stripped && stripped !== d) {
      d = stripped.charAt(0).toUpperCase() + stripped.slice(1);
    }
  }
  return d;
}

/* "Colour: X · Material: Y" for the card, as parts the template joins. */
export function specParts(p) {
  const parts = [];
  if (p.colours) parts.push({ k: 'Colour', v: p.colours });
  if (p.material) parts.push({ k: 'Material', v: p.material });
  if (p.sizes) parts.push({ k: 'Sizes', v: p.sizes });
  return parts;
}

export function badgesFor(p) {
  const out = [];
  if (p.badge) out.push({ label: p.badge, tone: p.badge === 'Signature' ? 'gold' : 'clay' });
  if (p.lead && /pickup/i.test(p.lead)) out.push({ label: 'Available now', tone: 'green' });
  return out;
}

/* Closing note under the order button — reflects how long THIS piece takes. */
export function footerNote(p) {
  let when = 'Production time 5\u201310 working days on most builds.';
  if (p.lead && /pickup/i.test(p.lead)) {
    when = 'Available now for immediate pickup at the showroom.';
  } else if (p.lead) {
    when = 'Production time ' + p.lead + '.';
  }
  return when + ' Same-day delivery available in Ibadan.';
}

/* alt text that describes the actual piece */
export function imgAlt(p) {
  return p.name + ' \u2014 ' + (p.colours || 'handmade furniture') + ' by ' + CONFIG.brand;
}

export const catLabel = categoryLabel;
export { CONFIG, categoryLabel };
