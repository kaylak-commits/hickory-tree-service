import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { SITE, NAP_BLOCKERS } from './src/config.ts';

/* Pages that exist for people mid-flow, not for search. A 79-word confirmation
   page in the index is thin content Google found on its own. */
const NOINDEX = ['/thank-you'];

if (NAP_BLOCKERS.length) {
  console.warn(
    '\n⚠️  NOT READY TO LAUNCH — placeholder NAP fields are omitted from schema:\n' +
    NAP_BLOCKERS.map((b) => `      • ${b}`).join('\n') +
    '\n    Set PHONE_LIVE / EMAIL_LIVE in src/config.ts once the real values exist.\n'
  );
}

export default defineConfig({
  site: SITE.url,
  /* Output is directory-format (dist/about/index.html), so the live URL is /about/.
     Pinning this keeps every href matching the canonical and the sitemap; without it
     each internal link costs a 308 hop. Added 2026-09-04. */
  trailingSlash: 'always',
  integrations: [
    sitemap({
      filter: (page) => !NOINDEX.some((p) => page.includes(p)),
      /* No lastmod = no recrawl signal. Build time, not per-page dates: the content
         carries no reliable date field and a wrong date is worse than a coarse one. */
      serialize(item) {
        item.lastmod = new Date().toISOString();
        return item;
      },
    }),
  ],
});
