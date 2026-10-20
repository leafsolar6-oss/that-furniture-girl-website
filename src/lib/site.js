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
export function orderMessage(p) {
  const bits = ['Hello ' + CONFIG.brand + '! I would like to order the ' + p.name];
  if (p.colours) bits.push(' (' + p.colours + ')');
  if (p.price) bits.push(' \u2014 ' + fmt(p.price));
  bits.push('. Is it available?');
  return bits.join('');
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
