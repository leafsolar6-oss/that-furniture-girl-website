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
  /* Exact pin for map deep-links — from the owner's Google Maps share link
     (2026-10-20): "Thatfurnituregirl, J-allen, Iyaganku, New Gra, Ibadan". */
  mapPin: '7.3858471,3.8743966',
  mapPlaceId: 'ChIJ1XfpxCWNORA1v3-WIu1pHA',
  // Google's own listing title — the Maps URL API needs this exact name
  // beside the place_id, or it falls back to fuzzy search (verified 2026-10-20:
  // address-as-query opened a DIFFERENT business).
  mapPlaceName: 'Thatfurnituregirl',
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
    colours: 'Light grey + white · also cream + chocolate, navy + white, chocolate + white',
    material: 'Boucle fabric',
    lead: 'Available for immediate pickup',
    desc: 'The piece that put us on the map. A deep, pillowy sectional in soft boucle with channel-tufted cushions and rounded arms — generous enough for the whole family, refined enough for a formal living room. The gallery also shows her posted colourways — cream + chocolate brown, navy blue + white, chocolate brown + white and a custom light ash + orange combo — same ₦500,000, single chair ₦170,000.',
    img: 'blush-sectional.jpg',
    gallery: ['blush-sectional-2.jpg', 'blush-sectional-3.jpg', 'blush-sectional-4.jpg', 'blush-sectional-5.jpg', 'blush-sectional-6.jpg'],
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
    gallery: ['jewel-sectional-6.jpg','jewel-sectional-7.jpg','jewel-sectional-8.jpg','jewel-sectional-9.jpg','jewel-sectional-10.jpg','jewel-sectional-2.jpg', 'jewel-sectional-11.jpg'],
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
    gallery: ['blush-linea-set-2.jpg', 'blush-linea-set-3.jpg', 'blush-linea-set-4.jpg', 'blush-linea-set-801.jpg'],
    featured: true
  },
  {
    id: 'twinkle-set',
    name: 'The Twinkle Set',
    cat: 'sets',
    price: 750000,
    colours: 'Dark grey + floral',
    material: 'Boucle + floral print fabric',
    desc: 'Dark grey boucle given a playful twist with floral print cushions and a matching accent chair. A set with personality — and one of our most requested designs.',
    img: 'twinkle-set.jpg',
    gallery: ['twinkle-set-2.jpg', 'twinkle-set-3.jpg', 'twinkle-set-4.jpg', 'twinkle-set-5.jpg'],
    featured: true
  },
  {
    id: 'plush-three-seaters',
    name: 'Plush 3-Seater',
    cat: 'sofas',
    price: 250000,
    colours: 'Chocolate brown + cream',
    material: 'Boucle fabric',
    desc: 'A plush three-seater with pillowy cushions and a two-tone finish. Compact enough for an apartment, soft enough that nobody wants to get up. Also posted in cream + brown — see gallery.',
    img: 'plush-three-seaters.jpg',
    gallery: ['plush-three-seaters-2.jpg', 'plush-three-seaters-3.jpg', 'plush-three-seaters-4.jpg', 'plush-three-seaters-5.jpg', 'plush-three-seaters-6.jpg', 'plush-three-seaters-6.jpg'],
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
    gallery: ['royal-kinging-set-2.jpg', 'royal-kinging-set-3.jpg', 'royal-kinging-set-4.jpg', 'royal-kinging-set-801.jpg'],
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
    gallery: ['centre-table-2.jpg', 'centre-table-3.jpg', 'centre-table-4.jpg'],
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
    gallery: ['wardrobe-2.jpg', 'wardrobe-3.jpg', 'wardrobe-4.jpg', 'wardrobe-801.jpg'],
    featured: false
  },
  {
    id: 'sienne-wooden-set',
    name: 'The Sienne Wooden Set',
    cat: 'sets',
    price: 800000,
    badge: 'Best seller',
    colours: 'Cream + brown · wood: coffee brown',
    material: 'Matte fabric',
    lead: 'Available for immediate pickup',
    desc: 'The Sienne Wooden Set in cream and brown with coffee-brown wood trim and matte fabric — a best seller, in the showroom now for immediate pickup. Like every piece here, it can also be built in your colour of choice.',
    img: 'sienne-wooden-set.jpg',
    gallery: ['sienne-wooden-set-2.jpg','sienne-wooden-set-3.jpg','sienne-wooden-set-4.jpg','sienne-wooden-set-5.jpg','sienne-wooden-set-6.jpg','sienne-wooden-set-7.jpg','sienne-wooden-set-8.jpg','sienne-wooden-set-9.jpg'],
  },
  {
    id: 'upholstery-bed-navy',
    name: 'Upholstery Bed + 2 Bedsides — Navy Blue',
    cat: 'beds',
    price: 450000,
    colours: 'Navy blue',
    material: 'Velvet',
    lead: '14 working days',
    desc: 'A 6ft by 6ft upholstery bed in navy blue velvet with two matching bedside drawers — treated wood frames, high-density foam and textured velvet fabric, built to order in any colour you prefer.',
    img: 'upholstery-bed-navy.jpg',
    gallery: ['upholstery-bed-navy-2.jpg','upholstery-bed-navy-3.jpg','upholstery-bed-navy-4.jpg','upholstery-bed-navy-5.jpg'],
  },
  {
    id: 'jewel-balloon-black',
    name: 'Jewel Balloon L-Shaped Sectionals — Black',
    cat: 'sofas',
    price: 350000,
    badge: 'Best seller',
    colours: 'Black',
    material: 'Velvet',
    lead: 'Available for immediate pickup',
    desc: 'The balloon cut of the Jewel sectional in black velvet — deep rounded channels and a wide chaise, a best seller in the showroom now for immediate pickup. Throw pillows add ₦5,000 each, and the piece can be built in your colour of choice.',
    img: 'jewel-balloon-black.jpg',
    gallery: ['jewel-balloon-black-2.jpg','jewel-balloon-black-3.jpg','jewel-balloon-black-4.jpg','jewel-balloon-black-5.jpg'],
  },
  {
    id: 'oloye-set',
    name: 'Oloye Set — Cream with Marble Print',
    cat: 'sets',
    price: 650000,
    badge: 'Best seller',
    colours: 'Cream with marble print',
    material: 'Thick leather cloth',
    lead: 'Available for immediate pickup',
    desc: 'The Oloye Set in cream thick leather cloth with marble-print accents — a best seller, in the showroom now for immediate pickup, and available in your colour of choice.',
    img: 'oloye-set.jpg',
    gallery: ['oloye-set-2.jpg','oloye-set-3.jpg','oloye-set-4.jpg','oloye-set-5.jpg','oloye-set-6.jpg','oloye-set-7.jpg'],
  },
  {
    id: 'centre-table-oval-white',
    name: 'Centre Table — White Oval (+5mm Glass)',
    cat: 'tables',
    price: 150000,
    priceTo: 200000,
    badge: 'Best seller',
    colours: 'White',
    material: 'MDF or HDF · oval + 5mm glass',
    lead: 'Available for immediate pickup',
    desc: 'A white oval centre table topped with 5mm glass, built in MDF or HDF — a best seller, in the showroom now for immediate pickup.',
    img: 'centre-table-oval-white.jpg',
    gallery: ['centre-table-oval-white-2.jpg','centre-table-oval-white-3.jpg','centre-table-oval-white-4.jpg'],
  },
  {
    id: 'royalty-set',
    name: 'Royalty Set — Champagne Gold & Brown',
    cat: 'sets',
    price: 2000000,
    badge: 'Best seller',
    colours: 'Champagne gold + brown',
    material: 'Flowering fabric',
    lead: 'Available for immediate pickup',
    desc: 'The Royalty Set in champagne gold and brown flowering fabric — our most ornate build, a best seller available for immediate showroom pickup, and reproducible in your colour of choice.',
    img: 'royalty-set.jpg',
    gallery: ['royalty-set-2.jpg','royalty-set-3.jpg','royalty-set-4.jpg','royalty-set-5.jpg','royalty-set-6.jpg','royalty-set-7.jpg','royalty-set-8.jpg'],
  },

  {
    id: 'jewel-drafted-set-grey',
    name: 'Jewel Drafted Set — Dark Grey',
    cat: 'sets',
    price: 430000,
    badge: 'Best seller',
    colours: 'Dark grey',
    material: 'Dry matte fabric',
    lead: 'Available for immediate pickup',
    desc: 'The Jewel Drafted Set in dark grey dry matte fabric — drafted squared arms on slim gold feet, a best seller in the showroom now for immediate pickup, and available in your colour of choice.',
    img: 'jewel-drafted-set-grey.jpg',
    gallery: ['jewel-drafted-set-grey-2.jpg','jewel-drafted-set-grey-3.jpg','jewel-drafted-set-grey-4.jpg','jewel-drafted-set-grey-5.jpg','jewel-drafted-set-grey-6.jpg'],
  },
  {
    id: 'jide-buttoned-brown',
    name: 'The Jide Buttoned Design — Brown',
    cat: 'sets',
    price: 450000,
    badge: 'Best seller',
    colours: 'Brown',
    material: 'Velvet',
    lead: 'Available for immediate pickup',
    desc: 'The Jide Buttoned Design in brown velvet — deep buttoned backs and seats on slim gold feet, a best seller in the showroom now for immediate pickup, and available in your colour of choice.',
    img: 'jide-buttoned-brown.jpg',
    gallery: ['jide-buttoned-brown-2.jpg','jide-buttoned-brown-3.jpg','jide-buttoned-brown-4.jpg','jide-buttoned-brown-5.jpg','jide-buttoned-brown-6.jpg','jide-buttoned-brown-7.jpg','jide-buttoned-brown-8.jpg','jide-buttoned-brown-9.jpg','jide-buttoned-brown-10.jpg'],
  },
  {
    id: 'blush-sectional-off-white',
    name: 'Blush Sectional — Off White',
    cat: 'sofas',
    price: 400000,
    badge: 'Best seller',
    colours: 'Off white',
    material: 'Boucle fabric',
    lead: 'Available for immediate pickup',
    desc: 'The Blush Sectional in off-white boucle — the same deep pillowy cut with channel-tufted cushions, a best seller in the showroom now for immediate pickup, and available in your colour of choice.',
    img: 'blush-sectional-off-white.jpg',
    gallery: ['blush-sectional-off-white-2.jpg','blush-sectional-off-white-3.jpg','blush-sectional-off-white-4.jpg','blush-sectional-off-white-5.jpg','blush-sectional-off-white-6.jpg'],
  },
  {
    id: 'jewel-sectional-off-white',
    name: 'Jewel L-Shaped Sectional — Off White',
    cat: 'sofas',
    price: 350000,
    badge: 'Best seller',
    colours: 'Off white',
    material: 'Corduroy',
    lead: 'Available for immediate pickup',
    desc: 'The Jewel L-Shaped Sectional in off-white corduroy with a wide chaise — a best seller in the showroom now for immediate pickup, and available in your colour of choice.',
    img: 'jewel-sectional-off-white.jpg',
    gallery: ['jewel-sectional-off-white-2.jpg','jewel-sectional-off-white-3.jpg','jewel-sectional-off-white-4.jpg','jewel-sectional-off-white-5.jpg','jewel-sectional-off-white-6.jpg'],
  },
  {
    id: 'upholstery-bed-off-white-ottoman',
    name: 'Upholstery Bed + 2 Bedsides + Ottoman — Off White',
    cat: 'beds',
    price: 550000,
    colours: 'Off white',
    material: 'Thick velvet',
    lead: '14 working days',
    desc: 'A 6ft by 6ft upholstery bed in off-white thick velvet with two bedside drawers and a matching ottoman — treated wood frames and high-density foam, built to order in any colour you prefer.',
    img: 'upholstery-bed-off-white-ottoman.jpg',
    gallery: ['upholstery-bed-off-white-ottoman-2.jpg','upholstery-bed-off-white-ottoman-3.jpg','upholstery-bed-off-white-ottoman-4.jpg','upholstery-bed-off-white-ottoman-5.jpg'],
  },
  {
    id: 'yaks-buttoned-grey',
    name: 'The Yaks Buttoned Design — Grey',
    cat: 'sofas',
    price: 550000,
    badge: 'Best seller',
    colours: 'Grey',
    material: 'Velvet',
    lead: 'Available for immediate pickup',
    desc: 'The Yaks Buttoned Design in grey velvet — deep diamond-buttoned channels with contrast pillows, a best seller in the showroom now for immediate pickup, and available in your colour of choice.',
    img: 'yaks-buttoned-grey.jpg',
    gallery: ['yaks-buttoned-grey-2.jpg','yaks-buttoned-grey-3.jpg','yaks-buttoned-grey-4.jpg','yaks-buttoned-grey-5.jpg','yaks-buttoned-grey-6.jpg','yaks-buttoned-grey-7.jpg','yaks-buttoned-grey-8.jpg','yaks-buttoned-grey-9.jpg','yaks-buttoned-grey-10.jpg','yaks-buttoned-grey-11.jpg'],
  },
  {
    id: 'vine-design-chocolate-carton',
    name: 'The Vine Design — Chocolate Brown + Carton',
    cat: 'sofas',
    price: 400000,
    badge: 'Best seller',
    colours: 'Chocolate brown + carton',
    material: 'Leather and fabric mix',
    lead: 'Available for immediate pickup',
    desc: 'The Vine Design in chocolate brown and carton — a leather-and-fabric mix with marble-print detailing, a best seller in the showroom now for immediate pickup, and available in your colour of choice.',
    img: 'vine-design-chocolate-carton.jpg',
    gallery: ['vine-design-chocolate-carton-2.jpg','vine-design-chocolate-carton-3.jpg','vine-design-chocolate-carton-4.jpg','vine-design-chocolate-carton-5.jpg','vine-design-chocolate-carton-6.jpg'],
  },
  {
    id: 'yems-l-sectional',
    name: 'Yems L-Shaped Sectionals — Brown + Off White',
    cat: 'sofas',
    price: 350000,
    badge: 'Best seller',
    colours: 'Brown + off white',
    material: 'Corduroy',
    lead: 'Available for immediate pickup',
    desc: 'Yems L-Shaped Sectionals in brown and off-white corduroy — a best seller in the showroom now for immediate pickup, and available in your colour of choice.',
    img: 'yems-l-sectional.jpg',
    gallery: ['yems-l-sectional-2.jpg','yems-l-sectional-3.jpg','yems-l-sectional-4.jpg','yems-l-sectional-5.jpg','yems-l-sectional-6.jpg','yems-l-sectional-7.jpg'],
  },
  {
    id: 'headroll-ash',
    name: 'Headroll Design — Ash',
    cat: 'sets',
    price: 400000,
    badge: 'Best seller',
    colours: 'Ash',
    material: 'Leather cloth fabric',
    lead: 'Available for immediate pickup',
    desc: 'The Headroll Design in ash leather cloth — rolled headrests over a deep seat, a best seller in the showroom now for immediate pickup, and available in your colour of choice.',
    img: 'headroll-ash.jpg',
    gallery: ['headroll-ash-2.jpg','headroll-ash-3.jpg','headroll-ash-4.jpg','headroll-ash-5.jpg','headroll-ash-6.jpg'],
  },
  {
    id: 'carving-side-ash-black',
    name: 'Carving Side — Ash + Black',
    cat: 'sets',
    price: 500000,
    badge: 'Best seller',
    colours: 'Ash + black',
    material: 'Leather cloth fabric',
    lead: 'Available for immediate pickup',
    desc: 'The Carving Side set in ash and black leather cloth with carved side detailing — a best seller in the showroom now for immediate pickup, and available in your colour of choice.',
    img: 'carving-side-ash-black.jpg',
    gallery: ['carving-side-ash-black-2.jpg','carving-side-ash-black-3.jpg','carving-side-ash-black-4.jpg'],
  },
  {
    id: 'tv-shelf-black',
    name: 'TV Shelf — Black',
    cat: 'storage',
    price: 150000,
    priceTo: 200000,
    badge: 'Best seller',
    colours: 'Black',
    material: 'MDF or HDF',
    sizes: '60 inches height · 20 inches depth',
    lead: 'Available for immediate pickup',
    desc: 'A black TV shelf, 60 inches high and 20 inches deep, in MDF or HDF — a best seller in the showroom now for immediate pickup, and available in your colour of choice.',
    img: 'tv-shelf-black.jpg',
    gallery: ['tv-shelf-black-2.jpg','tv-shelf-black-3.jpg','tv-shelf-black-4.jpg','tv-shelf-black-5.jpg'],
  },
  {
    id: 'tv-shelf-cider',
    name: 'TV Shelf — Cider (High Gloss Top)',
    cat: 'storage',
    price: 150000,
    priceTo: 200000,
    badge: 'Best seller',
    colours: 'Cider',
    material: 'MDF or HDF · high gloss top',
    sizes: '60 inches height · 20 inches depth',
    lead: 'Available for immediate pickup',
    desc: 'A cider TV shelf with a high-gloss top — peel the nylon off when delivered — 60 inches high and 20 inches deep, in MDF or HDF, a best seller in the showroom now for immediate pickup.',
    img: 'tv-shelf-cider.jpg',
    gallery: ['tv-shelf-cider-2.jpg','tv-shelf-cider-3.jpg','tv-shelf-cider-4.jpg','tv-shelf-cider-5.jpg','tv-shelf-cider-6.jpg'],
  },
  {
    id: 'board-bed-black-cream',
    name: 'Wooden Bed — Black + Cream',
    cat: 'beds',
    price: null,
    colours: 'Black + cream',
    material: 'Wooden frame with padded headboard',
    desc: 'A clean-lined storage bed in black with a cream padded-panel headboard and pull-out drawers in the base — tidy linen storage without extra furniture.',
    img: 'board-bed-black-cream.jpg',
    catalogOnly: true
  },
  {
    id: 'arch-accent-set-grey',
    name: 'The Arch Accent Set — Grey Marble',
    cat: 'sets',
    price: null,
    colours: 'Grey marble print',
    material: 'Marble-print upholstery with gold metal accents',
    desc: 'A sculpted barrel-arm set in grey marble-print upholstery, finished with polished gold arch accents on every arm and button-tufted backs.',
    img: 'arch-accent-set-grey.jpg',
    catalogOnly: true
  },
  {
    id: 'arch-accent-set-maroon',
    name: 'The Arch Accent Set — Maroon',
    cat: 'sets',
    price: null,
    colours: 'Maroon brown',
    material: 'Ribbed velvet-look upholstery with gold metal accents',
    desc: 'The same sculpted barrel-arm set in deep maroon ribbed velvet-look upholstery, gold arch accents and button-tufted backs.',
    img: 'arch-accent-set-maroon.jpg',
    catalogOnly: true
  },
  {
    id: 'hex-quilted-bed-grey',
    name: 'Hex Quilted Bed — Grey',
    cat: 'beds',
    price: null,
    colours: 'Dark grey',
    material: 'Quilted upholstery',
    desc: 'A dark grey upholstered bed with bold hexagon-diamond quilting across the headboard and base, flanked by matching bedside cabinets.',
    img: 'hex-quilted-bed-grey.jpg',
    catalogOnly: true
  },
  {
    id: 'balloon-sectional-grey-orange',
    name: 'Balloon Modular Sectional — Grey',
    cat: 'sofas',
    price: null,
    colours: 'Grey with orange accents',
    material: 'Soft boucle-look fabric',
    desc: 'A playful modular sectional of plump grey balloon modules, styled here with orange accent cushions, a round orange chair and a white fluted ottoman.',
    img: 'balloon-sectional-grey-orange.jpg',
    catalogOnly: true
  },
  {
    id: 'marble-panel-bed-white',
    name: 'Marble Panel Bed — White + Grey',
    cat: 'beds',
    price: null,
    colours: 'White marble-look + grey',
    material: 'Marble-look panels with quilted headboard',
    desc: 'A statement bed in white marble-look panels with a channel-quilted grey headboard and tall matching bedside cabinets.',
    img: 'marble-panel-bed-white.jpg',
    catalogOnly: true
  },
  {
    id: 'balloon-sofa-maroon',
    name: 'Balloon Sofa — Maroon',
    cat: 'sofas',
    price: null,
    colours: 'Maroon brown',
    material: 'Smooth velvet-look fabric',
    desc: 'A rounded balloon sofa in smooth maroon velvet-look fabric, deep enough to curl up in and soft enough for long evenings.',
    img: 'balloon-sofa-maroon.jpg',
    catalogOnly: true
  },
  {
    id: 'straight-arm-sofa-cream',
    name: 'Straight Arm Sofa — Cream',
    cat: 'sofas',
    price: null,
    colours: 'Cream + brown cushions',
    material: 'Textured upholstery',
    desc: 'A pair of clean cream three-seaters with straight track arms and loose brown scatter cushions — calm, formal lines for a bright living room.',
    img: 'straight-arm-sofa-cream.jpg',
    catalogOnly: true
  },
  {
    id: 'round-arm-sofa-cream',
    name: 'Round Arm Sofa — Cream',
    cat: 'sofas',
    price: null,
    colours: 'Cream + chocolate cushions',
    material: 'Smooth upholstery',
    desc: 'A cream sofa with softly rounded arms and a curved back, shown with chocolate scatter cushions and matching cube poufs.',
    img: 'round-arm-sofa-cream.jpg',
    catalogOnly: true
  },
  {
    id: 'board-bed-walnut-brown',
    name: 'Wooden Bed — Walnut + Brown Panels',
    cat: 'beds',
    price: null,
    colours: 'Light walnut + brown panels',
    material: 'Wooden frame with padded headboard',
    desc: 'A light walnut bed with twin brown padded panels in the headboard and an open storage base with inner shelving.',
    img: 'board-bed-walnut-brown.jpg',
    catalogOnly: true
  },
  {
    id: 'board-bed-cream-inlay',
    name: 'Wooden Bed — Cream Inlay',
    cat: 'beds',
    price: null,
    colours: 'Walnut + cream inlay',
    material: 'Wooden frame with inlay headboard',
    desc: 'A walnut bed with cream diamond-inlay panels framed in the headboard and boxed side storage.',
    img: 'board-bed-cream-inlay.jpg',
    catalogOnly: true
  },
  {
    id: 'arch-slat-bed-light',
    name: 'Arch Slat Bed — Light Wood',
    cat: 'beds',
    price: null,
    colours: 'Light wood',
    material: 'Wooden frame',
    desc: 'A light-wood bed with an arched slat headboard and twin pedestal side boxes.',
    img: 'arch-slat-bed-light.jpg',
    catalogOnly: true
  },
  {
    id: 'board-bed-cider-grey',
    name: 'Natural Wood Bed Frame',
    cat: 'beds',
    price: null,
    colours: 'Natural wood + grey panels',
    material: 'Wooden frame with padded headboard',
    desc: 'A natural wood bed frame with grey padded panels set into the headboard and a deep storage base.',
    img: 'board-bed-cider-grey.jpg',
    catalogOnly: true
  },
  {
    id: 'duo-lounge-chairs-cream-choc',
    name: 'Duo Lounge Chairs — Cream + Chocolate',
    cat: 'sets',
    price: null,
    colours: 'Cream + chocolate',
    material: 'Textured upholstery',
    desc: 'A lounge pair in cream and chocolate — the same boxy comfortable chair in two colourways to mix across a living room.',
    img: 'duo-lounge-chairs-cream-choc.jpg',
    catalogOnly: true
  },
  {
    id: 'ribbed-club-set-mauve',
    name: 'Ribbed Club Set — Mauve Brown',
    cat: 'sets',
    price: null,
    colours: 'Mauve brown + dark chocolate',
    material: 'Ribbed upholstery',
    desc: 'A club set in mauve-brown ribbed upholstery with rolled arms and deep seats, shown mixed with dark chocolate pieces.',
    img: 'ribbed-club-set-mauve.jpg',
    catalogOnly: true
  },
  {
    id: 'dining-set-grey-velvet',
    name: 'Dining Set — Grey Velvet',
    cat: 'dining',
    price: null,
    colours: 'Grey chairs + black table',
    material: 'Velvet-look chairs',
    desc: 'A six-seat dining set with curved-back grey velvet-look chairs around a black-topped table.',
    img: 'dining-set-grey-velvet.jpg',
    catalogOnly: true
  },
  {
    id: 'marble-boxy-set-grey',
    name: 'Marble Boxy Set — Grey',
    cat: 'sets',
    price: null,
    colours: 'Grey marble print',
    material: 'Marble-print upholstery',
    desc: 'A boxy modern set in grey marble-print upholstery with square arms and deep seat cushions.',
    img: 'marble-boxy-set-grey.jpg',
    catalogOnly: true
  },
  {
    id: 'nest-centre-tables-walnut',
    name: 'Nest Centre Tables — Walnut',
    cat: 'tables',
    price: null,
    colours: 'Walnut',
    material: 'Wood',
    desc: 'A family of round walnut centre tables and stools in graduating sizes — group them or spread them across the room.',
    img: 'nest-centre-tables-walnut.jpg',
    catalogOnly: true
  },
  {
    id: 'channel-sectional-blue-grey',
    name: 'Channel Sectional — Blue Grey',
    cat: 'sofas',
    price: null,
    colours: 'Blue grey',
    material: 'Channel-stitched upholstery',
    desc: 'An L-shaped sectional in blue-grey channel-stitched upholstery with low rounded arms and deep family seating.',
    img: 'channel-sectional-blue-grey.jpg',
    catalogOnly: true
  },
  {
    id: 'bubble-bed',
    name: 'Bubble Bed',
    cat: 'beds',
    price: 250000,
    colours: 'Off White',
    material: 'Velvet',
    sizes: '4.5/6ft',
    lead: 'Available for immediate pickup',
    desc: 'A bubble bed in off-white velvet — a fully cushioned, rounded frame that makes the bedroom soft. A showroom best seller, ready for immediate pickup or made in the colour of your choice.',
    img: 'bubble-bed.jpg',
    gallery: ['bubble-bed-2.jpg', 'bubble-bed-3.jpg', 'bubble-bed-4.jpg', 'bubble-bed-5.jpg'],
  },
  {
    id: 'oloye-set-dark-grey',
    name: 'Oloye Set — Dark Grey',
    cat: 'sets',
    price: 650000,
    colours: 'Dark Grey with Marble Print',
    material: 'Thick leather cloth',
    lead: 'Available for immediate pickup',
    desc: 'The Oloye set in dark grey marble-print thick leather cloth — deep, generous seating with a statement veined look. A showroom best seller, ready for immediate pickup or made in the colour of your choice.',
    img: 'oloye-set-dark-grey.jpg',
    gallery: ['oloye-set-dark-grey-2.jpg', 'oloye-set-dark-grey-3.jpg', 'oloye-set-dark-grey-4.jpg', 'oloye-set-dark-grey-5.jpg', 'oloye-set-dark-grey-6.jpg', 'oloye-set-dark-grey-7.jpg', 'oloye-set-dark-grey-8.jpg'],
  },
  {
    id: 'jewel-sectional-extension',
    name: 'Jewel L Shaped Sectional + Single Extension',
    cat: 'sofas',
    price: 450000,
    colours: 'Chocolate Brown + Off White',
    material: 'Corduroy',
    lead: 'Available for immediate pickup',
    desc: 'A jewel L-shaped sectional in chocolate brown and off-white corduroy, with a single extension for extra lounging length. A showroom best seller, ready for immediate pickup or made in the colour of your choice.',
    img: 'jewel-sectional-extension.jpg',
    gallery: ['jewel-sectional-extension-2.jpg', 'jewel-sectional-extension-3.jpg', 'jewel-sectional-extension-4.jpg', 'jewel-sectional-extension-5.jpg'],
  },
  {
    id: 'blush-sectional-burnt-orange',
    name: 'Blush Sectional — Burnt Orange + White',
    cat: 'sofas',
    price: 500000,
    colours: 'Burnt Orange + White',
    material: 'Boucle',
    lead: 'Available for immediate pickup',
    desc: 'The Blush sectional in burnt orange and white boucle — channel-tufted cushions, rounded arms and a warm contemporary line. A showroom best seller, ready for immediate pickup or made in the colour of your choice.',
    img: 'blush-sectional-burnt-orange.jpg',
    gallery: ['blush-sectional-burnt-orange-2.jpg', 'blush-sectional-burnt-orange-3.jpg', 'blush-sectional-burnt-orange-4.jpg', 'blush-sectional-burnt-orange-5.jpg', 'blush-sectional-burnt-orange-6.jpg', 'blush-sectional-burnt-orange-7.jpg', 'blush-sectional-burnt-orange-8.jpg', 'blush-sectional-burnt-orange-9.jpg'],
  },
  {
    id: 'carving-side-grey-black',
    name: 'Carving Side — Grey + Black',
    cat: 'sets',
    price: 500000,
    colours: 'Grey and Black',
    material: 'Leather cloth',
    lead: 'Available for immediate pickup',
    desc: 'A carving side set in grey and black leather cloth — deeply carved detailing with a bold two-tone finish. A showroom best seller, ready for immediate pickup or made in the colour of your choice.',
    img: 'carving-side-grey-black.jpg',
    gallery: ['carving-side-grey-black-2.jpg', 'carving-side-grey-black-3.jpg', 'carving-side-grey-black-4.jpg', 'carving-side-grey-black-5.jpg', 'carving-side-grey-black-6.jpg', 'carving-side-grey-black-7.jpg', 'carving-side-grey-black-8.jpg'],
  },
  {
    id: 'oloye-set-chocolate',
    name: 'Oloye Set — Chocolate Brown',
    cat: 'sets',
    price: 650000,
    colours: 'Chocolate Brown with Marble Print',
    material: 'Thick leather cloth',
    lead: 'Available for immediate pickup',
    desc: 'The Oloye set in chocolate brown marble-print thick leather cloth — low, deep and built for long evenings. A showroom best seller, ready for immediate pickup or made in the colour of your choice.',
    img: 'oloye-set-chocolate.jpg',
    gallery: ['oloye-set-chocolate-2.jpg', 'oloye-set-chocolate-3.jpg', 'oloye-set-chocolate-4.jpg', 'oloye-set-chocolate-5.jpg', 'oloye-set-chocolate-6.jpg', 'oloye-set-chocolate-7.jpg', 'oloye-set-chocolate-8.jpg', 'oloye-set-chocolate-9.jpg', 'oloye-set-chocolate-10.jpg'],
  },
  {
    id: 'upholstery-bed-grey-2bedside',
    name: 'Upholstery Bed + 2 Bedside Drawers — Grey + Silver',
    cat: 'beds',
    price: 400000,
    colours: 'Grey + Silver',
    material: 'Leather over treated wood frames with high-density foam',
    sizes: '4.5/6ft',
    lead: '14 working days',
    desc: 'An upholstered bed in grey and silver leather with two bedside drawers — treated wood frames, high-density foam and a soft paneled headboard. Made to order in your size.',
    img: 'upholstery-bed-grey-2bedside.jpg',
    gallery: ['upholstery-bed-grey-2bedside-2.jpg', 'upholstery-bed-grey-2bedside-3.jpg', 'upholstery-bed-grey-2bedside-4.jpg', 'upholstery-bed-grey-2bedside-5.jpg', 'upholstery-bed-grey-2bedside-6.jpg', 'upholstery-bed-grey-2bedside-7.jpg'],
  },
  {
    id: 'hdf-bed-bedside-white-black',
    name: 'HDF Bed + 1 Bedside Drawers — White + Black',
    cat: 'beds',
    price: 250000,
    colours: 'White + Black',
    material: 'Black leather over treated wood frames with high-density foam',
    sizes: '4.5/6ft',
    lead: '14 working days',
    desc: 'An HDF bed frame in white and black leather with one bedside drawer — treated wood frames and high-density foam, built to order in your size.',
    img: 'hdf-bed-bedside-white-black.jpg',
    gallery: ['hdf-bed-bedside-white-black-2.jpg', 'hdf-bed-bedside-white-black-3.jpg', 'hdf-bed-bedside-white-black-4.jpg'],
  },
  {
    id: 'upholstery-bed-grey-1bedside',
    name: 'Upholstery Bed + 1 Bedside Drawers — Grey + Off White',
    cat: 'beds',
    price: 250000,
    colours: 'Grey + Off White',
    material: 'Textured velvet over treated wood frames with high-density foam',
    sizes: '4.5/6ft',
    lead: '14 working days',
    desc: 'An upholstered bed in grey and off-white velvet with one bedside drawer — treated wood frames, high-density foam and a soft paneled headboard. Made to order in your size.',
    img: 'upholstery-bed-grey-1bedside.jpg',
    gallery: ['upholstery-bed-grey-1bedside-2.jpg', 'upholstery-bed-grey-1bedside-3.jpg', 'upholstery-bed-grey-1bedside-4.jpg', 'upholstery-bed-grey-1bedside-5.jpg'],
  },
  {
    id: 'centre-piece-table-stools-brown',
    name: 'Centre Piece (Table + Stools) — Brown',
    cat: 'tables',
    price: 100000,
    colours: 'Brown',
    material: '',
    lead: 'Available for immediate pickup',
    desc: 'A brown centre piece — a statement table with matching stools grouped around it. Centre table ₦100,000; extra stools ₦25,000 each. A showroom best seller, ready for immediate pickup.',
    img: 'centre-piece-table-stools-brown.jpg',
    gallery: ['centre-piece-table-stools-brown-2.jpg', 'centre-piece-table-stools-brown-3.jpg', 'centre-piece-table-stools-brown-4.jpg', 'centre-piece-table-stools-brown-5.jpg', 'centre-piece-table-stools-brown-6.jpg', 'centre-piece-table-stools-brown-7.jpg', 'centre-piece-table-stools-brown-8.jpg', 'centre-piece-table-stools-brown-9.jpg'],
  },
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
    gallery: ['unik-board-bed-frame-2.jpg'],
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
    gallery: ['chested-board-bed-frame-2.jpg', 'chested-board-bed-frame-3.jpg', 'chested-board-bed-frame-4.jpg']
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
    gallery: ['hdf-board-bed-2.jpg', 'hdf-board-bed-3.jpg', 'hdf-board-bed-4.jpg']
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
    gallery: ['bubble-linear-set-2.jpg', 'bubble-linear-set-3.jpg', 'bubble-linear-set-4.jpg']
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
    gallery: ['bubble-single-footstool-2.jpg', 'bubble-single-footstool-3.jpg', 'bubble-single-footstool-4.jpg']
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
    gallery: ['snail-dining-set-2.jpg', 'snail-dining-set-3.jpg', 'snail-dining-set-4.jpg']
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
    gallery: ['royal-wardrobe-2.jpg', 'royal-wardrobe-3.jpg', 'royal-wardrobe-4.jpg']
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
    gallery: ['rovans-dining-set-2.jpg', 'rovans-dining-set-3.jpg', 'rovans-dining-set-4.jpg']
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
    gallery: ['rovans-classy-set-2.jpg', 'rovans-classy-set-3.jpg', 'rovans-classy-set-4.jpg']
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
    gallery: ['bubble-bed-bedsides-2.jpg', 'bubble-bed-bedsides-3.jpg', 'bubble-bed-bedsides-4.jpg', 'bubble-bed-bedsides-5.jpg', 'bubble-bed-bedsides-6.jpg']
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
    gallery: ['verona-classy-set-2.jpg', 'verona-classy-set-3.jpg', 'verona-classy-set-4.jpg']
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
    gallery: ['ogaranya-classy-set-2.jpg', 'ogaranya-classy-set-3.jpg', 'ogaranya-classy-set-4.jpg']
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
    gallery: ['royal-centre-table-2.jpg', 'royal-centre-table-3.jpg', 'royal-centre-table-4.jpg'],
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
    gallery: ['headroll-l-sectional-2.jpg', 'headroll-l-sectional-3.jpg', 'headroll-l-sectional-4.jpg'],
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
    gallery: ['chesterfield-dining-set-2.jpg', 'chesterfield-dining-set-3.jpg', 'chesterfield-dining-set-4.jpg', 'chesterfield-dining-set-5.jpg'],
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
    gallery: ['trinity-sofa-2.jpg', 'trinity-sofa-3.jpg'],
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
    gallery: ['titan-bed-storage-2.jpg', 'titan-bed-storage-3.jpg', 'titan-bed-storage-4.jpg'],
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
    gallery: ['zentro-tv-shelf-2.jpg', 'zentro-tv-shelf-3.jpg'],
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
    gallery: ['office-reading-table-2.jpg', 'office-reading-table-3.jpg'],
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
    gallery: ['casa-linea-l-sectional-2.jpg', 'casa-linea-l-sectional-3.jpg', 'casa-linea-l-sectional-4.jpg'],
    stamped: true
  }
];
PRODUCTS.push(...CATALOGUE_IMPORTS_2);

/* ==========================================================================
   CATALOGUE PART 3 IMPORTS 2026-10-15 — three further owner-published pieces
   from the "Deep History" catalogue (April-May 2026 posts). Blush Sectional
   colourways and the cream+brown 3-seater were merged into existing pieces
   as gallery photos instead of duplicate listings.
   ========================================================================== */
const CATALOGUE_IMPORTS_3 = [
  {
    id: 'noble-rest-bed',
    name: 'Noble Rest Bed + Bedside Drawer',
    cat: 'beds',
    price: 250000,
    colours: 'White + black',
    material: 'Black leather',
    sizes: '4.5/6ft',
    lead: '14 working days',
    desc: 'The Noble Rest design — a white frame with black leather slatted headboard and one bedside drawer, on treated wood frames with high-density foams.',
    img: 'noble-rest-bed.jpg',
    gallery: ['noble-rest-bed-2.jpg', 'noble-rest-bed-3.jpg', 'noble-rest-bed-4.jpg'],
    stamped: true
  },
  {
    id: 'plush-arc-sofa',
    name: 'Plush Arc Sofa',
    cat: 'sofas',
    price: 250000,
    badge: 'Best seller',
    colours: 'Cream',
    material: 'Matte',
    lead: 'Available for immediate pickup',
    desc: 'A sculptural curved arc sofa in cream matte fabric — a showroom best seller that can also be made in a colour of your choice.',
    img: 'plush-arc-sofa.jpg',
    gallery: ['plush-arc-sofa-2.jpg', 'plush-arc-sofa-3.jpg', 'plush-arc-sofa-4.jpg'],
    stamped: true
  },
  {
    id: 'upholstery-bed-cream-gold',
    name: 'Upholstery Bed — Cream + Gold',
    cat: 'beds',
    price: 320000,
    colours: 'Cream + gold',
    material: 'Leather',
    sizes: '4.5/6ft',
    lead: '14 working days',
    desc: 'A cream diamond-tufted leather bed with gold-trimmed headboard, built on treated wood frames with high-density foams.',
    img: 'upholstery-bed-cream-gold.jpg',
    gallery: ['upholstery-bed-cream-gold-2.jpg'],
    stamped: true
  }
];
PRODUCTS.push(...CATALOGUE_IMPORTS_3);

/* ==========================================================================
   CATALOGUE PART 3 — FULL EXTRACTION 2026-10-15: every indexed row now has
   its own listing, including the Blush Sectional colourways and the custom
   Blush + Bubble combo previously merged into galleries.
   ========================================================================== */
const CATALOGUE_IMPORTS_3B = [
  {
    id: 'blush-cream-chocolate',
    name: 'Blush Sectional — Cream + Chocolate Brown',
    cat: 'sofas',
    price: 500000,
    badge: 'Best seller',
    colours: 'Cream + chocolate brown',
    material: 'Boucle fabric',
    lead: 'Available for immediate pickup',
    desc: 'The Blush Sectional in cream + chocolate brown boucle — channel-tufted cushions and rounded arms, in the showroom for immediate pickup.',
    img: 'blush-cream-chocolate.jpg',
    gallery: ['blush-cream-chocolate-2.jpg', 'blush-cream-chocolate-3.jpg', 'blush-cream-chocolate-4.jpg'],
    stamped: true
  },
  {
    id: 'blush-bubble-custom-combo',
    name: 'Blush Sectional + Bubble Single (Custom)',
    cat: 'sofas',
    price: 740000,
    badge: 'Best seller',
    colours: 'Light ash + orange',
    material: 'Boucle fabric',
    lead: 'Available for immediate pickup',
    desc: 'A custom order pairing the Blush Sectional with a Bubble Single in light ash + orange — the sofa can be re-arranged. Single ₦170,000 · table ₦150,000.',
    img: 'blush-bubble-custom-combo.jpg',
    gallery: ['blush-bubble-custom-combo-2.jpg', 'blush-bubble-custom-combo-3.jpg', 'blush-bubble-custom-combo-4.jpg', 'blush-bubble-custom-combo-5.jpg'],
    stamped: true
  },
  {
    id: 'blush-navy-white',
    name: 'Blush Sectional — Navy Blue + White',
    cat: 'sofas',
    price: 500000,
    badge: 'Best seller',
    colours: 'Navy blue + white',
    material: 'Boucle fabric',
    lead: 'Available for immediate pickup',
    desc: 'The Blush Sectional in navy blue + white boucle — channel-tufted cushions and rounded arms, in the showroom for immediate pickup.',
    img: 'blush-navy-white.jpg',
    gallery: ['blush-navy-white-2.jpg', 'blush-navy-white-3.jpg', 'blush-navy-white-4.jpg'],
    stamped: true
  },
  {
    id: 'blush-chocolate-white',
    name: 'Blush Sectional — Chocolate Brown + White',
    cat: 'sofas',
    price: 500000,
    badge: 'Best seller',
    colours: 'Chocolate brown + white',
    material: 'Boucle fabric',
    lead: 'Available for immediate pickup',
    desc: 'The Blush Sectional in chocolate brown + white boucle — channel-tufted cushions and rounded arms, in the showroom for immediate pickup.',
    img: 'blush-chocolate-white.jpg',
    gallery: ['blush-chocolate-white-2.jpg', 'blush-chocolate-white-3.jpg', 'blush-chocolate-white-4.jpg'],
    stamped: true
  },
  {
    id: 'three-seaters-cream-brown',
    name: '3 Seaters — Cream + Brown',
    cat: 'sofas',
    price: 250000,
    badge: 'Best seller',
    colours: 'Cream + brown',
    material: 'Boucle fabric',
    lead: 'Available for immediate pickup',
    desc: 'A channel-tufted three-seater in cream + brown boucle — a showroom best seller that can also be made in a colour of your choice.',
    img: 'three-seaters-cream-brown.jpg',
    gallery: ['three-seaters-cream-brown-2.jpg', 'three-seaters-cream-brown-3.jpg', 'three-seaters-cream-brown-4.jpg'],
    stamped: true
  }
];
PRODUCTS.push(...CATALOGUE_IMPORTS_3B);

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

export const TESTIMONIALS = [
  {
    name: 'Faith A.',
    where: 'WhatsApp customer',
    text: 'Ouuuu 🔥 Aww this looks nice. I like them 🥹'
  },
  {
    name: 'A dining customer',
    where: 'WhatsApp customer',
    text: 'This is more than beautiful 🥰🥰 they couldn\'t resist the beauty, you can tell from this picture cus all the pictures they sent to me has one or two persons sitting pretty on it 😂😂 thank you sooooooo much ma\'am. Did I tell you it was a surprise gift? And you made everything seamless 🥰🥰 Ese ma'
  },
  {
    name: 'An Instagram customer',
    where: 'Instagram DM',
    text: 'Good morning. Thank you for your swift service. 🤝'
  },
  {
    name: 'A WhatsApp customer',
    where: 'WhatsApp',
    text: 'Beautiful!!! Thank you so much'
  },
  {
    name: 'A WhatsApp customer',
    where: 'WhatsApp',
    text: 'Will always be my Favorite 😂'
  },
  {
    name: 'A WhatsApp customer',
    where: 'WhatsApp',
    text: 'Both church and console came out lovely 👏 Thank you so much. Job well done ❤️'
  },
  {
    name: 'A WhatsApp customer',
    where: 'WhatsApp',
    text: 'Received ma Its so lovely Thanks'
  },
  {
    name: 'A WhatsApp customer',
    where: 'WhatsApp',
    text: 'I looooove it 😁'
  }
];

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
