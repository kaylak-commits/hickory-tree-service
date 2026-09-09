/* ============================================================================
   SITE VARIABLES — the single source of truth
   ----------------------------------------------------------------------------
   Every name, number, price and link on this site comes from this file.
   Change it here and it changes everywhere, including the schema markup.

   ⚠️ NEVER hard-code a phone number, price or address into a page or component.
   The whole citation strategy depends on the NAP being character-for-character
   identical on the site, in the schema and in every directory.
   ============================================================================ */

export const SITE = {
  /* ---- BRAND & DOMAIN ---------------------------------------------------- */
  brand: 'Tree Service Hickory NC',
  legalEntity: '',
  disclosure: '',
  domain: 'treeservicehickorync.com',
  url: 'https://treeservicehickorync.com',
  tagline: 'Tree Removal and Tree Trimming in Hickory, NC',

  /* ---- TEMPLATE REUSE — these three exist so no component hardcodes the city.
     h1Suffix must match EXACTLY the trailing text on every service h1, because
     Header and BaseLayout strip it to make short nav labels and schema names.
     Get this wrong and nav labels keep the city in them. ---------------------- */
  h1Suffix: ' in Hickory, NC',
  serviceCategory: 'Tree services',
  footerBlurb: 'Tree removal, tree trimming and emergency storm damage cleanup across Hickory and Catawba County.',

  /* ---- NAP — CONFIRMED by Kayla 2026-09-07 ------------------------------- */
  phone: '(828) 522-9430',
  phoneHref: 'tel:+18285229430',
  email: 'info@treeservicehickorync.com',
  address: {
    street: '',        // service-area business. No street address published.
    city: 'Hickory',
    state: 'NC',
    zip: '',
  },

  /* ---- CREDENTIALS -------------------------------------------------------
     ⚠️ Governed by 01 PROCESS/13 Trust Signal Rule.md.
     GREEN only until a renter signs. No licence number, no founding year, no
     specific number of years, no rating, no review count. */
  credentials: [
    'Licensed &amp; Insured',            // CONFIRMED, Kayla — see FACTS.md Trust signals
    'Free Estimates',                     // GREEN, ships by default per standing rule 2026-09-02
  ],
  licenseNumber: '',                 // 🔴 RED until a renter supplies a real one
  established: 0,                    // 🔴 RED. Never publish a founding year pre-rental

  /* ---- SOCIAL — only list what actually exists --------------------------- */
  social: { facebook: '', instagram: '', youtube: '', google: '' },

  /* ---- THE STANDING RULES THAT APPEAR IN COPY ----------------------------
     ⚠️ Two different floors, not one. Tree removal (and every other service
     except stump grinding) uses minCallout. Stump grinding has its own,
     lower, CONFIRMED floor — see stumpGrindingMinCallout below. Both numbers
     are CONFIRMED in FACTS.md § Minimum callouts, 2026-09-06. */
  minCallout: '$500',
  stumpGrindingMinCallout: '$150',
  visitNote: 'Job length depends mainly on whether the tree comes down whole or has to be rigged down in sections, whether it is climbed or worked from the ground, and how close it stands to a structure or power line.',

  /* ---- SERVICE AREA ------------------------------------------------------ */
  counties: ['Catawba'],

  /* ---- LOCAL ANGLE — sourced, see FACTS.md ------------------------------- */
  rainInches: 45,
  precipDays: 107,

  /* ---- TRACKING ---------------------------------------------------------- */
  ga4: '',
  callrailScript: '',
} as const;

/* ✅ Live 2026-09-07. */
/* ---- AMBER CLAIMS — 13 Trust Signal Rule, audit C12 -----------------------
   "Free estimates" is true-or-false about a specific business, so it is AMBER:
   it ships only once FACTS.md marks it CONFIRMED for THIS site, and it starts
   AMBER again on every new site. Flip the flag, never the strings. */
export const FREE_ESTIMATE_CONFIRMED = true  /* Kayla's standing decision 2026-09-02: free estimates ship by default on every site. Set false only if a renter says they charge. */;
export const QUOTE_CTA     = FREE_ESTIMATE_CONFIRMED ? 'Free Quote' : 'Get a Quote';
export const QUOTE_HEADING = FREE_ESTIMATE_CONFIRMED ? 'Get a FREE Quote' : 'Get a Quote';
export const ESTIMATE_LINE = FREE_ESTIMATE_CONFIRMED ? 'Free estimates.' : '';

export const PHONE_LIVE = true;
export const EMAIL_LIVE = true;

const looksFake = (v: string): boolean =>
  v.trim() === '' || /555[-\s]?0\d{3}|example\.(com|org)|yourdomain|@test\./i.test(v);

export const HAS_PHONE = PHONE_LIVE && !looksFake(SITE.phone);
export const HAS_EMAIL = EMAIL_LIVE && !looksFake(SITE.email);

export const CALL_CTA = HAS_PHONE
  ? { href: SITE.phoneHref, label: `Call ${SITE.phone}` }
  : { href: '#quote', label: 'Request a Quote' };

export const SHOW_CALL_CTA = HAS_PHONE;

export const NAP_BLOCKERS: string[] = [
  ...(HAS_PHONE ? [] : [`phone (${SITE.phone || 'empty'})`]),
  ...(HAS_EMAIL ? [] : [`email (${SITE.email || 'empty'})`]),
];

/* ============================================================================
   PRICING — job tiers, not per-unit line items.
   ----------------------------------------------------------------------------
   ⚠️ SOURCED from two real regional contractor price pages (ArborPro,
   arborprotreenc.com — actually Hickory-based; DC Tree Cutting, Eastern NC)
   plus a size/species table Kayla aggregated 2026-09-06. See FACTS.md § Costs.
   NOTHING on this site may quote a removal job below SITE.minCallout, or a
   stump-grinding job below SITE.stumpGrindingMinCallout.
   ============================================================================ */

export const PRICING = [
  { job: 'Tree Removal, Small (under 30 ft)',   range: '$500 to $1,000',   slug: '/tree-removal/',
    drives: 'Dogwood, crape myrtle and other ornamentals, open access' },
  { job: 'Tree Removal, Medium (30-60 ft)',     range: '$1,000 to $2,000', slug: '/tree-removal/',
    drives: 'Loblolly pine, red maple, sweetgum at typical height' },
  { job: 'Tree Removal, Large (60-80 ft)',      range: '$2,000 to $3,000', slug: '/tree-removal/',
    drives: 'Water oak, willow oak, mature pine' },
  { job: 'Tree Removal, Very Large (80+ ft)',   range: '$3,500 to $9,000+', slug: '/tree-removal/',
    drives: 'White oak, sycamore and mature hardwoods, often needing a crane' },
  { job: 'Tree Trimming & Pruning',             range: '$500 to $2,500+', slug: '/tree-trimming/',
    drives: 'Project scope, from a small hedge to a large oak or maple canopy' },
  { job: 'Stump Grinding',                      range: '$150 to $800+',   slug: '/stump-grinding/',
    drives: 'Stump diameter, number of stumps and site access' },
  { job: 'Crane-Assisted Removal',              range: '$4,500 to $15,000+', slug: '/hazardous-tree-removal/',
    drives: 'Large or hazardous trees needing a crane instead of climbing or a bucket truck' },
  { job: 'Emergency Storm Damage Removal',      range: '$2,000 to $20,000+', slug: '/emergency-storm-damage-tree-removal/',
    drives: 'After-hours response, downed limbs on structures, possible crane work' },
  { job: 'Land / Lot Clearing',                 range: '$2,500 to $12,000+ per acre', slug: '/land-clearing/',
    drives: 'Vegetation density and site accessibility' },
] as const;

export const PRICE_CAVEAT =
  'Our minimum callout for tree removal is ' + '$500' + ', and stump grinding has its own, lower ' +
  'floor of ' + '$150' + '. Scope drives the price from there: tree size and species, whether it comes ' +
  'down whole or has to be rigged down in sections, whether it is climbed or worked from the ground, ' +
  'and how close it stands to a house, fence or power line.';

/* ============================================================================
   NAVIGATION
   ============================================================================ */

export const NAV = [
  { label: 'Home',     href: '/' },
  { label: 'Services', href: '/services/' },
  { label: 'Areas',    href: '/service-areas/' },
  { label: 'About',    href: '/about/' },
  { label: 'Contact',  href: '/contact/' },
] as const;

/* ============================================================================
   LOCATIONS — each takes a DIFFERENT head term so thirteen pages are not all
   chasing "tree removal in <town>". See 01 PROCESS/Templates/Page Templates.md §3
   and site-seo.json page_terms.
   ============================================================================ */

export const LOCATIONS = [
  { name: 'Conover',        slug: '/conover-nc/',        county: 'Catawba', term: 'Tree Removal' },
  { name: 'Newton',         slug: '/newton-nc/',         county: 'Catawba', term: 'Tree Trimming' },
  { name: 'Longview',       slug: '/longview-nc/',       county: 'Catawba', term: 'Emergency Tree Removal' },
  { name: 'Maiden',         slug: '/maiden-nc/',         county: 'Catawba', term: 'Tree Service Contractor' },
  { name: 'Claremont',      slug: '/claremont-nc/',      county: 'Catawba', term: 'Tree Removal' },
  { name: 'St Stephens',    slug: '/st-stephens-nc/',    county: 'Catawba', term: 'Tree Trimming' },
  { name: 'Startown',       slug: '/startown-nc/',       county: 'Catawba', term: 'Land Clearing' },
  { name: 'Brookford',      slug: '/brookford-nc/',      county: 'Catawba', term: 'Stump Grinding' },
  { name: 'Catawba',        slug: '/catawba-nc/',        county: 'Catawba', term: 'Emergency Tree Removal' },
  { name: 'Sherrills Ford', slug: '/sherrills-ford-nc/', county: 'Catawba', term: 'Tree Removal' },
  { name: 'Terrell',        slug: '/terrell-nc/',        county: 'Catawba', term: 'Tree Trimming' },
  { name: 'Mountain View',  slug: '/mountain-view-nc/',  county: 'Catawba', term: 'Hazardous Tree Removal' },
  { name: 'Catawba County', slug: '/catawba-county/', county: 'Catawba', term: 'Tree Service' },
] as const;

/* No towns held out — all 13 site-seo.json locations (12 towns + the
   Catawba County hub page) are built and listed here. */
export const SERVICE_AREA_EXTRA = [] as const;

/* ============================================================================
   IMAGES
   ----------------------------------------------------------------------------
   14 real, delivered photos (from Kayla's "Tree Removal photos hickory" folder,
   staged 2026-09-07), not stock placeholders. They ship as large PNGs because
   no image-conversion tool (sips/cwebp) was available in this build environment
   — see STATUS.md "still needed" list: convert to compressed .webp before
   go-live, the same as every other site's IMAGES set. Several longtail keys
   below intentionally reuse the closest-fitting photo since only 14 unique
   shots exist for ~20 page roles; [slug].astro's per-page de-dup logic still
   guarantees no single PAGE repeats a photo across its own 4 slots.
   ============================================================================ */

export const IMAGES = {
  heroCrew:      { src: '/images/homepage-hero-crew.webp',        alt: 'Tree service crew on site in Hickory, NC', pos: 'center 20%' },
  /* Homepage hero background — Kayla, 2026-09-07: the hero should show trees,
     not the crew (the crew photo cropped down to legs/torsos at hero height).
     Crew photo stays available above for the About page only. */
  heroLanding:   { src: '/images/land-clearing-hero.webp',        alt: 'Wooded hills near Hickory, NC in fall color', pos: 'center 60%' },
  removal:       { src: '/images/tree-removal-hero.webp',         alt: 'Crane-assisted tree removal of a large tree' },
  trimming:      { src: '/images/tree-trimming-hero.webp',        alt: 'Arborist using a pole saw to trim limbs high in a tree canopy' },
  storm:         { src: '/images/storm-damage-hero.webp',         alt: 'A fallen tree blocking a residential driveway' },
  stump:         { src: '/images/stump-grinding-hero.webp',       alt: 'Stump grinder working down a tree stump' },
  landClearing:  { src: '/images/land-clearing-hero.webp',        alt: 'Wooded Piedmont NC lot being cleared' },
  hazardous:     { src: '/images/hazardous-tree-hero.webp',       alt: 'Bucket truck positioned for hazardous tree work' },
  crane:         { src: '/images/tree-removal-hero.webp',         alt: 'Crane-assisted removal of a large tree' },
  arborist:      { src: '/images/arborist-hero.webp',             alt: 'Arborists assessing a large oak tree in North Carolina' },
  /* ✅ Fixed 2026-09-08: 'deadwood-removal-hero.png' was the same logo-file bug
     flagged (not fixed) on 2026-09-07 — it was the logo image, not a photo.
     Kayla sent 4 new real photos this session; the climbing/rigging shot below
     is the correct real replacement. */
  deadwood:      { src: '/images/arborist-rigging-oak.webp',     alt: 'Arborist climbing and rigging down limbs from a large oak' },
  /* ✅ Fixed 2026-09-08: was a stand-in ('debris-hauling-hero.png' borrowed from
     the debris key) while Kayla sourced a real commercial-property photo — she
     sent one this session. */
  commercial:    { src: '/images/land-clearing-crew-2.webp',     alt: 'Tree crew clearing a wooded commercial lot' },
  brush:         { src: '/images/land-clearing-hero.webp',        alt: 'Brush and undergrowth cleared from a wooded lot' },
  hedge:         { src: '/images/tree-planting-hero.webp',        alt: 'Landscaped North Carolina backyard with hedges and shrubs' },
  cabling:       { src: '/images/arborist-rigging-oak.webp',     alt: 'Arborist harness and rigging detail on a tree trunk' },
  planting:      { src: '/images/tree-planting-hero.webp',        alt: 'North Carolina backyard with newly planted trees' },
  /* ✅ Fixed 2026-09-08: was reusing the 'commercial' stand-in photo; now its
     own real photo. */
  debris:        { src: '/images/log-truck-hauling.webp',        alt: 'Loaded log truck hauling cut tree debris away from a job site' },
  bushHogging:   { src: '/images/bush-hogging-hero.webp',         alt: 'Cut brush and wood debris cleared from a rural property' },
  transplanting: { src: '/images/tree-planting-hero.webp',        alt: 'North Carolina backyard with newly planted trees' },
  fertilization: { src: '/images/oak-canopy.webp',               alt: 'Healthy, full oak canopy in Hickory, NC' },
  healthAssess:  { src: '/images/arborist-hero.webp',             alt: 'Arborists assessing a large oak tree for health issues' },
  aboutCrew:     { src: '/images/about-crew-on-site.webp',        alt: 'Tree Service Hickory NC crew on site' },
} as const;

export type ImageKey = keyof typeof IMAGES;

export const focal = (k: ImageKey): string =>
  (IMAGES[k] as { pos?: string }).pos ?? 'center';

/* Band backgrounds sit under a 66-92% dark overlay and are always below the fold,
   but a CSS background-image cannot be lazy-loaded — the browser fetches it with the
   page. So bands point at a smaller, lower-quality variant of the same photo
   (1280px, q62) generated alongside each image. Cuts ~60% off the weight that blocks
   first paint, with no visible difference through the overlay. Added 2026-09-09. */
export const bandSrc = (src: string) => src.replace(/\.webp$/, '-band.webp');
