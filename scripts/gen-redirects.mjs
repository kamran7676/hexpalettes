import { readFileSync, writeFileSync } from 'node:fs';
import { getColorRouteSlugs, noindexColorSlugs } from '../src/lib/color-routes.mjs';

const vercelPath = new URL('../vercel.json', import.meta.url);
const vercelConfig = JSON.parse(readFileSync(vercelPath, 'utf8'));
const slugs = getColorRouteSlugs();
const redirects = slugs.filter(slug => !noindexColorSlugs.has(slug)).map(slug => ({
  source: `/colors/${slug}`,
  destination: `/color/${slug}`,
  permanent: true,
}));

vercelConfig.redirects = redirects;
writeFileSync(vercelPath, `${JSON.stringify(vercelConfig, null, 2)}\n`);

const oldRouteSlugs = new Set(slugs);
const canonicalRouteSlugs = new Set(slugs);
const overlap = [...oldRouteSlugs].filter(slug => canonicalRouteSlugs.has(slug));
const legacyOnly = [...oldRouteSlugs].filter(slug => !canonicalRouteSlugs.has(slug));
const noindex = [...noindexColorSlugs].filter(slug => oldRouteSlugs.has(slug));

console.log(`/colors slugs: ${oldRouteSlugs.size}`);
console.log(`/color slugs: ${canonicalRouteSlugs.size}`);
console.log(`Exact slug-string matches: ${overlap.length === canonicalRouteSlugs.size}`);
console.log(`Set (a), overlapping slugs: ${overlap.length}`);
console.log(`Redirect entries (overlap excluding noindex slugs): ${redirects.length}`);
console.log(`Set (b), only in /colors (${legacyOnly.length}): ${legacyOnly.join(', ') || '(none)'}`);
console.log(`Set (c), noindex /colors slugs (${noindex.length}): ${noindex.join(', ') || '(none)'}`);
