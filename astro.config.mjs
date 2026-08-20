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
    // Plain sitemap() call — no custom filter. Astro's build always emits
    // /404.html as a flat file outside the normal page/route list, so it was
    // never actually included in the generated sitemap in the first place;
    // the custom `filter` option here was redundant and, on top of that,
    // triggered a real upstream bug in @astrojs/sitemap 3.1.x when combined
    // with newer Astro 4.16.x internals ("Cannot read properties of
    // undefined (reading 'reduce')" during the astro:build:done hook).
    sitemap(),
  ],
});
