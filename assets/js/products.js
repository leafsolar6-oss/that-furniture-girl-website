/* ==========================================================================
   That Furniture Girl — product catalogue
   --------------------------------------------------------------------------
   EDIT THIS FILE to change prices, colours, sizes or add new pieces.
   Everything on the website (shop grid, featured pieces, quick-view) is
   generated from the list below.

   Fields:
     id       – short unique name, no spaces
     name     – product name shown on the site
     cat      – category key: sofas | sets | tables | storage
     price    – number only, in naira (e.g. 500000). Use null for "Price on request"
     priceTo  – optional second price when a piece comes in two sizes
     badge    – optional label: "Best seller", "Signature", "New"
     colours  – colour description
     material – fabric / material description
     sizes    – optional size note
     lead     – optional production time
     desc     – one or two sentences describing the piece
     img      – photo file inside assets/img/
     featured – true to show it on the home page
   ========================================================================== */

var TFG_CONFIG = {
  brand:      'That Furniture Girl',
  city:       'Ibadan, Oyo State',
  address:    'Iyaganku, New GRA, Ibadan 200273, Oyo State',
  // WhatsApp number in international format, digits only
  whatsapp:   '2349079849626',
  // how the number is displayed on the site
  phoneDisplay: '0907 984 9626',
  instagram:  'https://www.instagram.com/thatfurnituregirl__',
  tiktok:     'https://www.tiktok.com/@thatfurnituregirl_',
  currency:   '\u20A6' // ₦
};

var TFG_CATEGORIES = [
  { key: 'all',     label: 'All pieces' },
  { key: 'sofas',   label: 'Sofas & Sectionals' },
  { key: 'sets',    label: 'Full Sets' },
  { key: 'tables',  label: 'Centre Tables' },
  { key: 'storage', label: 'Storage' }
];

var TFG_PRODUCTS = [
  {
    id: 'blush-sectional',
    name: 'Blush Sectional',
    cat: 'sofas',
    price: 500000,
    badge: 'Best seller',
    colours: 'Light grey + white',
    material: 'Boucle fabric',
    lead: 'Available for immediate pickup',
    desc: 'The piece that put us on the map. A deep, pillowy sectional in soft boucle with channel-tufted cushions and rounded arms — generous enough for the whole family, refined enough for a formal living room.',
    img: 'blush-sectional.jpg',
    featured: true
  },
  {
    id: 'jewel-sectional',
    name: 'Jewel L-Shaped Sectional',
    cat: 'sofas',
    price: 350000,
    badge: 'Best seller',
    colours: 'Chocolate brown',
    material: 'Corduroy',
    lead: 'Available for immediate pickup',
    desc: 'A low, architectural L-shape wrapped in ribbed chocolate corduroy. The texture catches the light beautifully and the wide chaise makes it the best seat in the house.',
    img: 'jewel-sectional.jpg',
    featured: true
  },
  {
    id: 'blush-linea-set',
    name: 'Blush Linea Sectional Set',
    cat: 'sets',
    price: null,
    colours: 'Cream',
    material: 'Boucle fabric',
    desc: 'A complete living room set — long lineal sectional with matching armchairs and ottoman. Clean lines, cream boucle, built as a family of pieces that sit together perfectly.',
    img: 'blush-linea-set.jpg',
    featured: true
  },
  {
    id: 'twinkle-set',
    name: 'The Twinkle Set',
    cat: 'sets',
    price: null,
    colours: 'Dark grey + floral',
    material: 'Boucle + floral print fabric',
    desc: 'Dark grey boucle given a playful twist with floral print cushions and a matching accent chair. A set with personality — and one of our most requested designs.',
    img: 'twinkle-set.jpg',
    featured: true
  },
  {
    id: 'plush-three-seaters',
    name: 'Plush 3-Seater',
    cat: 'sofas',
    price: null,
    colours: 'Chocolate brown + cream',
    material: 'Boucle fabric',
    desc: 'A plush three-seater with pillowy cushions and a two-tone finish. Compact enough for an apartment, soft enough that nobody wants to get up.',
    img: 'plush-three-seaters.jpg',
    featured: true
  },
  {
    id: 'royal-kinging-set',
    name: 'Royal Kinging Set',
    cat: 'sets',
    price: 1500000,
    badge: 'Signature',
    colours: 'Chocolate brown + gold',
    material: 'Floral fabric + leather',
    lead: 'About 3 months to produce',
    desc: 'Our most ambitious build. Treated wood frames, high-density foam, leather combined with rich floral fabric and gold detail. Live like a king — made to order in any colour or craft.',
    img: 'royal-kinging-set.jpg',
    featured: true
  },
  {
    id: 'centre-table',
    name: 'Centre Table',
    cat: 'tables',
    price: 100000,
    colours: 'Swiss + cider',
    material: 'HDF',
    lead: '10 working days',
    desc: 'A low, minimal centre table that grounds the room without crowding it. Made in HDF with a two-tone finish that pairs with both boucle and corduroy.',
    img: 'centre-table.jpg',
    featured: true
  },
  {
    id: 'wardrobe',
    name: 'Wardrobe',
    cat: 'storage',
    price: 140000,
    priceTo: 160000,
    colours: 'Swiss + black',
    material: 'MDF',
    sizes: 'Small — 6ft height, 3.5ft length · Big — 6ft height, 4ft length',
    lead: '5 working days',
    desc: 'A clean-lined wardrobe in matte MDF with slim black detailing. Two sizes, and we can build it in any colour, size or layout you need.',
    img: 'wardrobe.jpg',
    featured: false
  }
];
