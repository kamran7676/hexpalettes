import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

const excludedSitemapPaths = new Set([
  '/colors/mucus-plug-color-chart',
  '/colors/color-factory-nyc',
  '/colors/color-factory-chicago',
  '/colors/color-guard',
  '/colors/color-maze',
  '/colors/color-sheet',
]);

export default defineConfig({
  site: 'https://hexpalettes.vercel.app',
  trailingSlash: 'never',
  integrations: [react(), sitemap({
    filter: page => !excludedSitemapPaths.has(new URL(page).pathname.replace(/\/$/, '')),
  })],
});


