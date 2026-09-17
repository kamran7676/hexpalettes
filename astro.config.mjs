import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: process.env.SITE_URL || 'http://localhost:4321',
  integrations: [react(), sitemap()],
});


