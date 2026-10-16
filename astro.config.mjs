import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import { getColorRouteSlugs, noindexColorSlugs } from './src/lib/color-routes.mjs';
import { getNoindexArticleSlugs } from './src/lib/article-routes.mjs';

const canonicalSlugs = new Set(getColorRouteSlugs());
const excludedSitemapPaths = new Set([
  ...[...canonicalSlugs].map(slug => `/colors/${slug}`),
  ...[...noindexColorSlugs].map(slug => `/colors/${slug}`),
  ...[...noindexColorSlugs].map(slug => `/color/${slug}`),
  ...[...getNoindexArticleSlugs()].map(slug => `/articles/${slug}`),
]);

export default defineConfig({
  site: 'https://hexpalettes.vercel.app',
  trailingSlash: 'never',
  integrations: [react(), sitemap({
    filter: page => {
      const pathname = new URL(page).pathname.replace(/\/$/, '');
      // Palette tag pages are generated templates and are noindexed
      return !excludedSitemapPaths.has(pathname) && !pathname.startsWith('/palettes/');
    },
  })],
});


