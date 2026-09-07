import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://milikatembobibliotherapy.netlify.app',
  integrations: [sitemap()],
  trailingSlash: 'always',
});
