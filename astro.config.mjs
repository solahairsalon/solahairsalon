import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

// Static output = deploys directly to Cloudflare Pages (or any static host).
// No adapter needed since there is no backend/SSR/database.
export default defineConfig({
  site: 'https://solahairsalon.com',
  output: 'static',
  // Every internal link, canonical, and sitemap entry in this project uses a
  // trailing slash — pin build output to match so a host never has to 3xx
  // redirect /page to /page/ (or vice versa) on first request.
  trailingSlash: 'always',
  build: {
    format: 'directory',
  },
  integrations: [
    tailwind(),
    sitemap({
      // Keep the sitemap to real, indexable pages — the 404 page has no
      // canonical destination worth submitting to Google.
      filter: (page) => !page.includes('/404'),
    }),
  ],
});
