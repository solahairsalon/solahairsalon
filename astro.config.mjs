import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

// Static output = deploys directly to Cloudflare Pages (or any static host).
// No adapter needed since there is no backend/SSR/database.
//
// NOTE: @astrojs/sitemap was removed. It has a reproducible crash
// ("Cannot read properties of undefined (reading 'reduce')" in its
// astro:build:done hook) with this project's config on both Cloudflare's
// build environment and locally on Windows — the same failure across two
// different machines and two different package versions (3.1.6 and 3.2.1)
// points to a real upstream bug rather than an environment fluke. The
// sitemap is now a hand-written static file at public/sitemap.xml instead,
// which is dependency-free and can't crash the build. Update that file
// whenever a page is added, removed, or renamed.
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
  integrations: [tailwind()],
});
