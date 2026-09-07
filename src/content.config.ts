import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/* ============================================================================
   CONTENT COLLECTIONS
   ----------------------------------------------------------------------------
   Adding a page to this site = adding one markdown file. No components, no
   layout work, no routing. Write the markdown, drop it in, it ships.

     src/content/services/drywall-repair.md  ->  /drywall-repair
     src/content/locations/kingsport.md      ->  /kingsport

   The schema below is deliberately strict. If a required field is missing the
   build FAILS rather than shipping a page with no title tag or no meta
   description — the two things easiest to forget and most expensive to miss.
   ============================================================================ */

const faq = z.object({
  q: z.string(),
  a: z.string(),
});

const services = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/services' }),
  schema: z.object({
    /* --- required --- */
    title: z.string(),                    // the <title> tag
    h1: z.string(),                       // the on-page H1 — often differs from the title
    description: z.string().max(165),     // meta description. Hard cap so it can't truncate
    intro: z.string(),                    // first paragraph, rendered above the fold

    /* --- layer: decides internal link weight, not layout --- */
    layer: z.enum(['money', 'main', 'longtail']),

    /* --- images: keys from config.ts IMAGES, never raw paths --- */
    hero: z.string(),
    bandImage: z.string().optional(),
    bodyImage: z.string().optional(),
    extraImage: z.string().optional(),

    /* --- optional --- */
    faqs: z.array(faq).default([]),
    inMenu: z.boolean().default(false),   // main service pages only
    order: z.number().default(99),
    updated: z.date().optional(),
  }),
});

const locations = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/locations' }),
  schema: z.object({
    title: z.string(),
    h1: z.string(),
    description: z.string().max(165),
    intro: z.string(),

    /* --- the town facts. These are what make the page worth having --- */
    town: z.string(),
    county: z.string(),
    /* Every town fact must be researched and sourced. If it can't be filled in
       truthfully, don't build the page. See FACTS.md § Sub-city local facts. */
    sources: z.array(z.string()).default([]),

    hero: z.string(),
    bandImage: z.string().optional(),
    bodyImage: z.string().optional(),
    extraImage: z.string().optional(),
    faqs: z.array(faq).default([]),
  }),
});

export const collections = { services, locations };
