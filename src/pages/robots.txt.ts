/* Generated, never static. The old public/robots.txt hardcoded
   johnsoncitydrywall.com, so every site built from this template shipped a sitemap
   line pointing at the drywall site. Reading SITE.url makes that impossible.
   Found 2026-09-04. */
import type { APIRoute } from 'astro';
import { SITE } from '../config';

export const GET: APIRoute = () =>
  new Response(
    `User-agent: *
Allow: /

Sitemap: ${SITE.url}/sitemap-index.xml
`,
    { headers: { 'Content-Type': 'text/plain; charset=utf-8' } }
  );
