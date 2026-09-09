import { defineConfig } from 'astro/config';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
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

/* @astrojs/sitemap always writes `sitemap-index.xml` + `sitemap-0.xml`; the base
   name is configurable but the `-index` suffix is not. Search engines and humans
   expect /sitemap.xml, so emit that as the canonical name after the build.
   One chunk (any site under 45k URLs) -> copy the urlset itself, so /sitemap.xml
   is a plain sitemap rather than an index pointing at one file. More than one
   chunk -> copy the index, which is valid under that name too. Added 2026-09-09. */
function canonicalSitemap() {
  return {
    name: 'canonical-sitemap',
    hooks: {
      'astro:build:done': ({ dir, logger }) => {
        /* fileURLToPath, not .pathname: a project path containing spaces comes
           back percent-encoded from .pathname and every fs call then ENOENTs. */
        const out = fileURLToPath(dir);
        const chunks = fs.readdirSync(out).filter((f) => /^sitemap-\d+\.xml$/.test(f));
        const source = chunks.length === 1 ? chunks[0] : 'sitemap-index.xml';
        const from = path.join(out, source);
        if (!fs.existsSync(from)) {
          logger.warn(`canonical-sitemap: ${source} not found, /sitemap.xml not written`);
          return;
        }
        fs.copyFileSync(from, path.join(out, 'sitemap.xml'));
        logger.info(`\`sitemap.xml\` created at \`dist\` (from ${source})`);
      },
    },
  };
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
    canonicalSitemap(),
  ],
});
