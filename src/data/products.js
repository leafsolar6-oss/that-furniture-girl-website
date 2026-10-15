/* ==========================================================================
   That Furniture Girl — product catalogue (Astro edition)
   --------------------------------------------------------------------------
   This is the ONLY file you edit to change prices, colours, sizes or add new
   pieces. The home page, the shop grid, the hero slider, the quick-view panel
   and the search box all read from here when the site is built.

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
     img      – photo file inside public/assets/img/opt/
     featured – true to show it on the home page
   ========================================================================== */

export const CONFIG = {
  brand: 'That Furniture Girl',
  city: 'Ibadan, Oyo State',
  address: 'Iyaganku, New GRA, Ibadan 200273, Oyo State',
  // WhatsApp number in international format, digits only
  whatsapp: '2349079849626',
  // how the number is displayed on the site
  phoneDisplay: '0907 984 9626',
  instagram: 'https://www.instagram.com/thatfurnituregirl__',
  tiktok: 'https://www.tiktok.com/@thatfurnituregirl_',
  currency: '\u20A6' // ₦
};

export const CATEGORIES = [
  { key: 'all',     label: 'All' },
  { key: 'sofas',   label: 'Sofas' },
  { key: 'sets',    label: 'Sets' },
  { key: 'tables',  label: 'Tables' },
  { key: 'storage', label: 'Storage' },
  { key: 'beds',    label: 'Beds' },
  { key: 'dining',  label: 'Dining' }
];

export const PRODUCTS = [
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
    gallery: ['blush-sectional-2.jpg', 'blush-sectional-3.jpg'],
    featured: true
  },
  {
    id: 'jewel-sectional',
    name: 'Jewel L-Shaped Sectional',
    cat: 'sofas',
    price: 370000,
    badge: 'Best seller',
    colours: 'Chocolate brown',
    material: 'Corduroy',
    lead: 'Available for immediate pickup',
    desc: 'A low, architectural L-shape wrapped in ribbed chocolate corduroy. The texture catches the light beautifully and the wide chaise makes it the best seat in the house.',
    img: 'jewel-sectional.jpg',
    gallery: ['jewel-sectional-2.jpg'],
    featured: true
  },
  {
    id: 'blush-linea-set',
    name: 'Blush Linea Sectional Set',
    cat: 'sets',
    price: 450000,
    badge: 'New',
    colours: 'Cream',
    material: 'Boucle fabric',
    lead: '14 working days',
    desc: 'A complete living room set — deep channel-tufted sectional with a chaise, shown as it leaves our workshop. Treated wood frames, high-density foam and textured boucle, and we can build it in any colour, size or design you like.',
    img: 'blush-linea-set.jpg',
    gallery: ['blush-linea-set-2.jpg', 'blush-linea-set-3.jpg', 'blush-linea-set-4.jpg'],
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
    gallery: ['twinkle-set-2.jpg', 'twinkle-set-3.jpg', 'twinkle-set-4.jpg'],
    featured: true
  },
  {
    id: 'plush-three-seaters',
    name: 'Plush 3-Seater',
    cat: 'sofas',
    price: 250000,
    colours: 'Chocolate brown + cream',
    material: 'Boucle fabric',
    desc: 'A plush three-seater with pillowy cushions and a two-tone finish. Compact enough for an apartment, soft enough that nobody wants to get up.',
    img: 'plush-three-seaters.jpg',
    gallery: ['plush-three-seaters-2.jpg', 'plush-three-seaters-3.jpg'],
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
    gallery: ['royal-kinging-set-2.jpg', 'royal-kinging-set-3.jpg', 'royal-kinging-set-4.jpg'],
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
    gallery: ['centre-table-2.jpg', 'centre-table-3.jpg'],
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
    gallery: ['wardrobe-2.jpg', 'wardrobe-3.jpg', 'wardrobe-4.jpg'],
    featured: false
  }
];

/* ---------- imported from the owner's catalogue (Oct 2026 PDF) ---------- */
const CATALOGUE_IMPORTS = [
  {
    id: 'unik-board-bed-frame',
    name: 'Unik Board Bed Frame',
    cat: 'beds',
    price: null,
    colours: 'Swiss + black',
    material: 'HDF',
    lead: 'Custom order — 10 working days',
    desc: 'A board bed frame in HDF with a clean Swiss-and-black finish. Built as a custom order — colours, sizes and design to your taste.',
    img: 'unik-board-bed-frame.jpg',
    stamped: true,
  },
  {
    id: 'chested-board-bed-frame',
    name: 'Chested Board Bed Frame',
    cat: 'beds',
    price: 180000,
    priceTo: 230000,
    colours: 'Cider',
    material: 'MDF / HDF',
    lead: '10 working days',
    desc: 'A chested board bed frame in warm cider tones. Priced in MDF or HDF — practical storage lines with a clean, sturdy finish.',
    img: 'chested-board-bed-frame.jpg',
    stamped: true,
    gallery: ['chested-board-bed-frame-2.jpg', 'chested-board-bed-frame-3.jpg']
  },
  {
    id: 'hdf-board-bed',
    name: 'HDF Board Bed',
    cat: 'beds',
    price: 450000,
    colours: 'Cider + black',
    material: 'HDF board + leather',
    sizes: '6ft × 6ft',
    lead: '14 working days',
    desc: 'A 6ft by 6ft board bed in cider and black — HDF board and textured leather over treated wood frames and high-density foam.',
    img: 'hdf-board-bed.jpg',
    stamped: true,
    gallery: ['hdf-board-bed-2.jpg', 'hdf-board-bed-3.jpg']
  },
  {
    id: 'bubble-linear-set',
    name: 'Bubble Linear Set',
    cat: 'sets',
    price: 750000,
    colours: 'Grey & orange',
    material: 'Boucle fabric',
    lead: '14 working days',
    desc: 'A linear bubble set in grey boucle with orange accents — treated wood frames and high-density foams under deeply tufted channels.',
    img: 'bubble-linear-set.jpg',
    stamped: true,
    gallery: ['bubble-linear-set-2.jpg', 'bubble-linear-set-3.jpg']
  },
  {
    id: 'bubble-single-footstool',
    name: 'Bubble Single + Mini Footstool',
    cat: 'sofas',
    price: 200000,
    colours: 'Chocolate brown',
    material: 'Boucle fabric',
    lead: '14 working days',
    desc: 'The bubble single chair with its mini footstool in chocolate brown boucle. Also in orange, cream, light ash or brown — or your own custom colour. The single on its own is ₦170,000.',
    img: 'bubble-single-footstool.jpg',
    stamped: true,
    gallery: ['bubble-single-footstool-2.jpg', 'bubble-single-footstool-3.jpg']
  },
  {
    id: 'snail-dining-set',
    name: 'Snail Dining Set (4 Chairs)',
    cat: 'dining',
    price: 300000,
    colours: 'Ash + black',
    material: 'Wooden body / upholstered curtain fabric',
    sizes: '4 chairs',
    lead: '14 working days',
    desc: 'A four-chair dining set with a wooden body and upholstered curtain-fabric seats in ash and black.',
    img: 'snail-dining-set.jpg',
    stamped: true,
    gallery: ['snail-dining-set-2.jpg', 'snail-dining-set-3.jpg']
  },
  {
    id: 'royal-wardrobe',
    name: 'Royal Wardrobe',
    cat: 'storage',
    price: 200000,
    colours: 'Cider',
    material: 'MDF',
    sizes: '7ft × 4ft',
    lead: '14 working days',
    desc: 'A 7ft by 4ft wardrobe in cider MDF — tall, deep and built to carry a whole household’s clothing.',
    img: 'royal-wardrobe.jpg',
    stamped: true,
    gallery: ['royal-wardrobe-2.jpg', 'royal-wardrobe-3.jpg']
  },
  {
    id: 'rovans-dining-set',
    name: 'Rovans 6-Chairs Dining Set',
    cat: 'dining',
    price: 500000,
    colours: 'Light ash',
    material: 'Velvet',
    sizes: '6 chairs',
    lead: '14 working days',
    desc: 'A six-chair dining set in light ash with velvet upholstery — room for the whole table.',
    img: 'rovans-dining-set.jpg',
    stamped: true,
    gallery: ['rovans-dining-set-2.jpg', 'rovans-dining-set-3.jpg']
  },
  {
    id: 'rovans-classy-set',
    name: 'Rovans Classy Set',
    cat: 'sets',
    price: 600000,
    colours: 'Beige + brown',
    material: 'Matte fabric',
    lead: '14 working days',
    desc: 'A classy living set in beige and brown matte fabric — soft lines with a formal posture.',
    img: 'rovans-classy-set.jpg',
    stamped: true,
    gallery: ['rovans-classy-set-2.jpg', 'rovans-classy-set-3.jpg']
  },
  {
    id: 'bubble-bed-bedsides',
    name: 'Bubble Bed + 2 Bedsides',
    cat: 'beds',
    price: 300000,
    badge: 'Best seller',
    colours: 'Off white / grey',
    material: 'Velvet / matte fabric',
    sizes: '6ft × 6ft',
    lead: 'Available for immediate pickup',
    desc: 'A 6ft by 6ft bubble bed with two matching bedsides in off-white and grey — already in the showroom for immediate pickup. On its own, without the bedside drawers, the bubble bed is ₦250,000.',
    img: 'bubble-bed-bedsides.jpg',
    stamped: true,
    gallery: ['bubble-bed-bedsides-2.jpg', 'bubble-bed-bedsides-3.jpg', 'bubble-bed-bedsides-4.jpg', 'bubble-bed-bedsides-5.jpg']
  },
  {
    id: 'verona-classy-set',
    name: 'Verona Classy Set',
    cat: 'sets',
    price: 600000,
    colours: 'Chocolate brown + carton brown',
    material: 'Velvet',
    lead: '14 working days',
    desc: 'A classy set in chocolate brown and carton brown velvet — deep, warm and generously padded.',
    img: 'verona-classy-set.jpg',
    stamped: true,
    gallery: ['verona-classy-set-2.jpg', 'verona-classy-set-3.jpg']
  },
  {
    id: 'ogaranya-classy-set',
    name: 'Ogaranya Classy Set',
    cat: 'sets',
    price: 650000,
    colours: 'Black + natural wood paint',
    material: 'Matte fabric',
    lead: '14 working days',
    desc: 'A classy set in black matte fabric with natural wood paint detail — bold contrast, clean lines.',
    img: 'ogaranya-classy-set.jpg',
    stamped: true,
    gallery: ['ogaranya-classy-set-2.jpg', 'ogaranya-classy-set-3.jpg']
  },
  {
    id: 'koral-l-sectionals',
    name: 'Koral L-Sectionals',
    cat: 'sofas',
    price: 350000,
    colours: 'Cream + umber brown',
    material: 'Velvet fabric',
    lead: '14 working days',
    desc: 'An L-shaped sectional in cream and umber brown velvet — a soft corner for the whole family.',
    img: 'koral-l-sectionals.jpg',
    stamped: true,
    gallery: ['koral-l-sectionals-2.jpg', 'koral-l-sectionals-3.jpg']
  }
];

PRODUCTS.push(...CATALOGUE_IMPORTS);

/* ==========================================================================
   CATALOGUE PART 2 IMPORTS 2026-10-15 — nine further owner-published pieces
   from the "Older History" catalogue (May-June 2026 posts). Photos carry the
   owner's own stamped watermark, so stamped: true suppresses the site seal.
   ========================================================================== */
const CATALOGUE_IMPORTS_2 = [
  {
    id: 'royal-centre-table',
    name: 'Royal Centre Table',
    cat: 'tables',
    price: 150000,
    colours: 'Black + gold',
    material: 'HDF board + panel + 5mm glass',
    lead: '14 working days',
    desc: 'A rectangular royal centre table in black and gold with a 5mm glass top, built on treated wood frames with high-density foams.',
    img: 'royal-centre-table.jpg',
    gallery: ['royal-centre-table-2.jpg', 'royal-centre-table-3.jpg'],
    stamped: true
  },
  {
    id: 'headroll-l-sectional',
    name: 'Headroll L-Sectional Set',
    cat: 'sofas',
    price: 350000,
    badge: 'Best seller',
    colours: 'Brown + black stains',
    material: 'Leather cloth',
    lead: 'Available for immediate pickup',
    desc: 'An L-shaped sectional with rolled headrest arms in brown and black-stained leather cloth — in the showroom for immediate pickup.',
    img: 'headroll-l-sectional.jpg',
    gallery: ['headroll-l-sectional-2.jpg', 'headroll-l-sectional-3.jpg'],
    stamped: true
  },
  {
    id: 'board-bed-bedside',
    name: 'Board Bed Frame + Bedside Drawer',
    cat: 'beds',
    price: 150000,
    priceTo: 210000,
    badge: 'Best seller',
    colours: 'Swiss + black',
    material: 'Leather',
    sizes: '4.5/6ft · 6×6 · 6×7',
    lead: 'Available for immediate pickup',
    desc: 'A Swiss-and-black board bed frame with one bedside drawer in leather; 6×6 and 6×7 sizes quoted at ₦180,000 and ₦210,000.',
    img: 'board-bed-bedside.jpg',
    gallery: ['board-bed-bedside-2.jpg', 'board-bed-bedside-3.jpg'],
    stamped: true
  },
  {
    id: 'chesterfield-dining-set',
    name: 'Chesterfield 6-Chairs Dining Set',
    cat: 'dining',
    price: 400000,
    badge: 'Best seller',
    colours: 'Light grey',
    material: 'Matte',
    sizes: '6 chairs',
    lead: 'Available for immediate pickup',
    desc: 'Six diamond-tufted light-grey chairs in matte fabric around a dark table — the Chesterfield dining set, in the showroom now.',
    img: 'chesterfield-dining-set.jpg',
    gallery: ['chesterfield-dining-set-2.jpg', 'chesterfield-dining-set-3.jpg', 'chesterfield-dining-set-4.jpg'],
    stamped: true
  },
  {
    id: 'trinity-sofa',
    name: 'Trinity 4-Seater Sofa',
    cat: 'sofas',
    price: 300000,
    badge: 'Best seller',
    colours: 'Dark grey',
    material: 'Boucle',
    sizes: '4 seaters',
    lead: 'Available for immediate pickup',
    desc: 'The Trinity sofa in four seaters — deep dark-grey boucle with round bolster cushions, in the showroom for immediate pickup.',
    img: 'trinity-sofa.jpg',
    gallery: ['trinity-sofa-2.jpg'],
    stamped: true
  },
  {
    id: 'titan-bed-storage',
    name: 'Titan Frame + Bed Storage + Bedside',
    cat: 'beds',
    price: 250000,
    colours: 'Black + cream',
    material: 'HDF',
    sizes: '4.5/6ft',
    lead: '14 working days',
    desc: 'A black Titan frame with cream upholstered headboard, foot-end bed storage and one bedside drawer, in HDF on treated wood frames.',
    img: 'titan-bed-storage.jpg',
    gallery: ['titan-bed-storage-2.jpg', 'titan-bed-storage-3.jpg'],
    stamped: true
  },
  {
    id: 'zentro-tv-shelf',
    name: 'Zentro TV Shelf',
    cat: 'storage',
    price: 120000,
    priceTo: 150000,
    badge: 'Best seller',
    colours: 'White Mansonia',
    material: 'HDF or MDF',
    lead: 'Available for immediate pickup',
    desc: 'The Zentro TV shelf in White Mansonia with open shelving — ₦150,000 in HDF, ₦120,000 in MDF, in the showroom now.',
    img: 'zentro-tv-shelf.jpg',
    gallery: ['zentro-tv-shelf-2.jpg'],
    stamped: true
  },
  {
    id: 'office-reading-table',
    name: 'Office / Reading Table',
    cat: 'tables',
    price: 90000,
    priceTo: 120000,
    badge: 'Best seller',
    colours: 'Cider',
    material: 'HDF or MDF',
    lead: 'Available for immediate pickup',
    desc: 'A cider-finished office or reading table with a drawer bank — ₦120,000 in HDF, ₦90,000 in MDF, in the showroom now.',
    img: 'office-reading-table.jpg',
    gallery: ['office-reading-table-2.jpg'],
    stamped: true
  },
  {
    id: 'casa-linea-l-sectional',
    name: 'Casa-Linea L-Sectional Set',
    cat: 'sofas',
    price: 500000,
    badge: 'Best seller',
    colours: 'Orange',
    material: 'Boucle',
    lead: 'Available for immediate pickup',
    desc: 'A ribbed channel L-sectional in orange boucle with rolled arms and round cushions — in the showroom for immediate pickup.',
    img: 'casa-linea-l-sectional.jpg',
    gallery: ['casa-linea-l-sectional-2.jpg', 'casa-linea-l-sectional-3.jpg'],
    stamped: true
  }
];
PRODUCTS.push(...CATALOGUE_IMPORTS_2);

/* ==========================================================================
   TESTIMONIALS  —  the "What our customers say" section
   --------------------------------------------------------------------------
   This list is EMPTY on purpose. The section is not rendered at all until you
   add real messages here, so the site never shows a review nobody wrote.

   Paste in what customers actually sent you (WhatsApp, Instagram DM, TikTok
   comment) and the section appears on the home page automatically:

     { name: 'Ada O.',          // how they want to be shown
       where: 'Ibadan',         // optional — their city or how they found you
       img:   'blush-sectional.jpg',   // optional — a photo from assets/img/opt/
       text:  'The exact words they sent you, unchanged.' }
   ========================================================================== */

export const TESTIMONIALS = [];

/* --------------------------------------------------------------------------
   Small lookups the site uses everywhere.
   -------------------------------------------------------------------------- */

export const featuredProducts = PRODUCTS.filter((p) => p.featured);

export const heroProducts = PRODUCTS.filter((p) => p.img).slice(0, 5);

/* The six Instagram crops, in order — real posts from her page. */
export const INSTAGRAM_SHOTS = [1, 2, 3, 4, 5, 6].map((n) => `ig-${n}.jpg`);

export function productById(id) {
  return PRODUCTS.find((p) => p.id === id);
}

export function categoryLabel(key) {
  const hit = CATEGORIES.find((c) => c.key === key);
  return hit ? hit.label : '';
}

/* Plain-text search blob, built once per product at build time. */
PRODUCTS.forEach((p) => {
  p.haystack = [p.name, p.colours, p.material, p.desc, categoryLabel(p.cat), p.sizes]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
});
