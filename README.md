# Sola Hair Salon

Independent, informational Astro static site about the Sola Salon Studios
salon-suite model, hair services, hairstyles, hair care, and salon pricing —
built for organic search traffic and AdSense-readiness.

Domain: **solahairsalon.com**
Contact: **salonsolahair@gmail.com**

## Stack
- **Astro** (static output — no server runtime)
- **Tailwind CSS**, "Fraunces + Inter" editorial type system
- **@astrojs/sitemap** for automatic sitemap generation
- No database, no backend/API routes — calculators and the contact form run
  client-side / via a third-party form endpoint
- Real photography (locally hosted, compressed) + a compressed studio-tour
  video, plus a handful of freely-licensed Unsplash CDN images

## What's in this update
- **Official email**: `salonsolahair@gmail.com`, on the Contact page and in the footer.
- **Contact form**: `/contact/` has a real form (name/email/subject/message +
  a honeypot field) that posts to Formspree. **You need to connect it** — see
  "Contact form setup" below. Until then it falls back to a clear on-page
  prompt to email directly.
- **Dark/light mode toggle**: sun/moon button in the header. Respects the
  visitor's OS preference on first visit, remembers their choice in
  `localStorage`, and applies before paint (no flash of the wrong theme).
  Implemented as a small global CSS override layer in `Layout.astro` rather
  than `dark:` classes on every element, so it covers the whole site.
- **Real photos & video**: your uploaded salon/studio photos are in
  `public/images/gallery/` (resized + compressed, 42–142 KB each) and used
  for the homepage hero, a new "Every Studio Looks Different" gallery
  section, and several page hero banners. The uploaded video is compressed
  (11.2 MB → 1.85 MB, audio stripped since it was silent, `faststart` for
  instant playback) and embedded as a poster-image, click-to-play video
  under "Inside a Sola-Style Studio" on the homepage — it does **not**
  autoplay or block page load.
- **Technical SEO / security fixes**:
  - Fixed `robots.txt` — it was still pointing at the old
    `solahairsalonguide.com` domain; now points at `solahairsalon.com`.
  - `astro.config.mjs` now sets `trailingSlash: 'always'` so every internal
    link, canonical tag, and sitemap entry is consistent — no host ever
    needs to 3xx-redirect `/page` to `/page/`.
  - Added `public/_headers` (Cloudflare Pages reads this automatically) with
    `Content-Security-Policy`, `Strict-Transport-Security` (HSTS),
    `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, and a
    `Permissions-Policy` that allows geolocation only for the near-me page's
    own "use my location" button.
  - Every page already self-referenced its own canonical URL and used
    `robots: index, follow` — verified no noindex/canonical mismatches.
  - Audited every external URL in the codebase (fonts, Unsplash images,
    Google Maps search links) for validity.

## Contact form setup (required)
The form in `src/pages/contact.astro` posts to Formspree, a no-backend form
service:
1. Create a free account at https://formspree.io and add a new form.
2. Copy your form ID and replace `YOUR_FORM_ID` in the form's `action`
   attribute in `src/pages/contact.astro`.
3. Set the form's notification email to `salonsolahair@gmail.com` in the
   Formspree dashboard.
Until step 2 is done, submitting the form shows a message pointing people to
email you directly — it never fails silently.

## Performance choices
- Static output — no server render cost, deploys as pure HTML/CSS/JS
- `preconnect` to Google Fonts and the Unsplash image CDN in `<head>`
- All below-the-fold images use `loading="lazy"` + explicit `width`/`height`
- Hero image uses `fetchpriority="high"` for a fast LCP
- The studio-tour video uses `preload="none"` and a poster image — it costs
  nothing until a visitor actually presses play
- Local photos are pre-compressed (JPEG, quality ~72, progressive) instead
  of relying on runtime optimization
- Minimal JS: calculators, nav/theme toggles, and the near-me search are the
  only client-side scripts — no framework runtime

## Local development
```bash
npm install
npm run dev
```

> **Note:** this project intentionally does not ship a `package-lock.json`
> (no network access was available to generate a real, registry-valid one
> while building it). Run `npm install` once locally to generate your own,
> then commit it — Cloudflare Pages runs `npm ci` whenever a lock file is
> present, which fails hard if it's ever out of sync with `package.json`
> (e.g. after manually bumping a dependency version without re-running
> `npm install`). If a deploy ever fails with an `npm ci` / "lock file
> does not satisfy" error, the fix is: `rm -rf node_modules
> package-lock.json && npm install`, then commit the fresh lock file — or
> simply delete `package-lock.json` from the repo entirely and let
> Cloudflare fall back to a plain `npm install` during the build.

## Build
```bash
npm run build
```
Outputs a fully static site to `dist/`.

## Deploying to Cloudflare Pages
1. Push this repo to GitHub/GitLab.
2. In the Cloudflare dashboard: Workers & Pages → Create → Pages → connect repo.
3. Build command: `npm run build`
4. Build output directory: `dist`
5. No environment variables or backend bindings are required. The
   `public/_headers` file is picked up automatically for security headers.

Alternatively, deploy via Wrangler:
```bash
npm run build
npx wrangler pages deploy dist
```

## Project structure
```
wrangler.toml                   Cloudflare Wrangler config (CLI deploys)
src/
  layouts/Layout.astro         SEO/meta, fonts, dark-mode init + CSS layer
  components/
    Header.astro / Footer.astro   Nav, dark-mode toggle, email
    Card.astro                     Content card, optional lazy-loaded image
    ArticleHero.astro              Full-width photo banner for pillar pages
    AdSlot.astro                   Disabled-by-default AdSense placeholder
  pages/
    index.astro                  Homepage — hero, real-photo gallery, video
    contact.astro                 Contact form + official email
    sola-hair-salon.astro         Primary SEO pillar page
    sola-salon-studio.astro / sola-salons.astro / sola-salon-studios-near-me.astro
    hair-services/ · hairstyles/ · hair-care/
    tools/salon-cost-calculator.astro · hair-length-calculator.astro
    blog/index.astro · about.astro · privacy-policy.astro · terms.astro · disclaimer.astro · 404.astro
public/
  _headers                      Cloudflare Pages security headers (CSP, HSTS, etc.)
  _redirects                    www → apex canonical redirect
  robots.txt · llms.txt · site.webmanifest · favicons
  images/gallery/                Real salon photos + video poster frame
  video/studio-tour.mp4          Compressed, silent studio walkthrough
```

### wrangler.toml
Lets you deploy from the command line with `npx wrangler pages deploy dist`
instead of (or alongside) connecting a git repo in the Cloudflare dashboard.
Points Wrangler at the static `dist/` build output — no bindings, KV, D1, or
Workers logic needed since this project has no backend.

### llms.txt
Follows the emerging [llms.txt](https://llmstxt.org) convention — a plain-text
sitemap-style summary at the site root aimed at AI assistants and LLM-based
tools, so they can quickly understand what the site covers and link to the
right page instead of guessing from a full crawl. Update it whenever you add
or restructure major pages, the same way you'd update a sitemap.

## Before launch checklist
- [ ] Point the `solahairsalon.com` DNS at Cloudflare Pages
- [ ] Finish Formspree setup for the contact form (see above)
- [ ] Replace the `@solahairsalon` placeholder in `twitter:site` (Layout.astro,
      line ~75) with your real X/Twitter handle once one exists — or remove
      the tag entirely if you don't plan to run one
- [ ] Add real, human-reviewed blog articles (roadmap of ~20 topics from the original brief)
- [ ] Review disclaimer language with a lawyer before using the Sola brand
      name commercially, especially before enabling AdSense
- [ ] Set `ENABLED = true` in `src/components/AdSlot.astro` and paste real
      AdSense code only after AdSense approval
- [ ] Run Lighthouse/PageSpeed Insights after deploying and re-check the CSP
      against any third-party script you add later (AdSense, analytics) —
      you'll need to extend `public/_headers` to allowlist those domains
- [ ] In the Cloudflare Pages dashboard, add **both** `solahairsalon.com` and
      `www.solahairsalon.com` as custom domains so the `www` → apex redirect
      in `public/_redirects` actually has something to redirect *from*
- [ ] As real content dates become known, pass explicit `publishDate` /
      `modifiedDate` props (`YYYY-MM-DD`) into a page's `<Layout>` call instead
      of relying on the site-wide default — see "SEO/technical fixes" below

## SEO / technical fixes in this update
- **X-Robots-Tag header**: added site-wide via `public/_headers` (`index,
  follow`), plus a `noindex` prop on `Layout` used by the 404 page so it's
  excluded at both the header and `<meta name="robots">` level.
- **Hreflang**: this is a single-locale (English) site, so every page now
  self-references `hreflang="en-us"` and `hreflang="x-default"` — the
  correct minimal setup when there's no translated version to point to.
- **twitter:site**: added with a placeholder handle (`@solahairsalon`) — see
  the checklist above.
- **Published / modified dates**: every page now emits
  `article:published_time` / `article:modified_time` meta tags via `Layout`,
  and any page passing an `Article`-type JSON-LD schema automatically gets
  matching `datePublished` / `dateModified` fields merged in. All pages
  currently share one default date; update it per page as real publish dates
  are known.
- **Non-canonical redirects / duplicate-host indexing**: added
  `public/_redirects` to force `www.solahairsalon.com` → `solahairsalon.com`
  (301) so Google never has two hosts serving identical content — this only
  activates once both hostnames are added as custom domains in Cloudflare
  Pages (see checklist). HTTPS is enforced automatically by Cloudflare.
  `trailingSlash: 'always'` in `astro.config.mjs` keeps every internal link,
  canonical tag, and sitemap entry on the same URL shape, so there's no
  separate redirect needed for that.
- The sitemap (`@astrojs/sitemap`) now explicitly excludes the 404 page.

## Trademark note
"Sola Salon Studios" is a third-party brand. This project is written to describe
and inform, not to impersonate or claim affiliation. Confirm your final content,
domain name, and branding with a trademark attorney before publishing commercially.
