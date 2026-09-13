# Action Renovations LLC — Website

Marketing site for Action Renovations LLC, built with [Astro](https://astro.build) and deployed to
[Cloudflare Pages](https://pages.cloudflare.com/). Leads submitted on the site are forwarded to
Housecall Pro via a Zapier webhook.

**Live:** [action-renovations.pages.dev](https://action-renovations.pages.dev) (not yet cut over to
the `actionrenovations.net` domain — that's a deliberate, separate step; see "Deploying" below).

## Stack

- **Astro 5** (`output: 'server'`) — pages are prerendered to static HTML at build time
  (`export const prerender = true` on every page), except `/api/lead`, which runs as a
  Cloudflare Pages Function.
- **Tailwind CSS** for styling.
- **@astrojs/cloudflare** adapter — ships a single Worker (`_worker.js`) alongside the static assets.
- **Leaflet** (CDN, client-side only) for the interactive map on `/service-area`.
- **Housecall Pro's online-booking widget script** (loaded site-wide, see "Online booking" below)
  and **reviews widget** (embedded via iframe on `/reviews` only).

## Pages

| Route | Notes |
| --- | --- |
| `/` | Home — hero, financing banner, services grid, area/stats, contact strip. |
| `/about` | About Us. |
| `/services` | All 9 services, also reachable via the header's Services dropdown. |
| `/services/[slug]` | One page per service (`src/data/services.ts` → `services` array drives this). |
| `/service-area` | Town list + interactive Leaflet map (see below). |
| `/our-work` | One representative photo per service category — not real job case studies yet. Ends with a "Read Our Reviews" banner linking to `/reviews`. |
| `/reviews` | Embeds the real Housecall Pro reviews widget (iframe) in a card styled to match the site. |
| `/financing` | HFS Financial partnership page (see below). |
| `/contact` | Contact info, a "prefer to book instantly?" Book Online callout, and the lead form. |
| `/api/lead` | POST endpoint the lead form submits to; not a page. |

## Navigation

The header has two hover dropdowns (desktop) / `<details>` accordions (mobile), both driving
directly off `src/data/services.ts` so they can't drift out of sync with the actual pages:

- **Services** → all 9 service pages, plus "View All Services".
- **Our Work** → `/our-work` ("Recent Projects") and `/reviews` ("Customer Reviews"). Reviews was
  folded in here rather than added as its own top-level nav item — see the breakpoint note below.

Every link in both dropdowns is a real `<a>` in the static HTML of every page, one crawl-hop from
anywhere — deliberate for SEO.

**Desktop nav breakpoint is `xl` (1280px), not `lg` (1024px).** With the full item set (Home,
About Us, Services▾, Service Area, Our Work▾, Financing, Contact Us) plus the logo and CTA button,
1024px is too narrow — the nav visibly wraps onto two lines. Below 1280px it now shows the mobile
hamburger menu instead. If you add another top-level nav item, re-check this at exactly 1024px and
1280px before assuming it fits.

## Local development

```bash
npm install
cp .dev.vars.example .dev.vars   # then fill in ZAPIER_LEAD_WEBHOOK_URL (see "Lead pipeline")
npm run dev
```

> **Note:** This repo currently lives under an iCloud Drive path
> (`.../Mobile Documents/com~apple~CloudDocs/...`), which contains spaces. A bug in Astro 5's
> internal route-scanner file-path matching means **static prerendering silently fails when the
> project path contains spaces** — every page gets built as a dynamic SSR route instead of a
> static file. This does not affect production (Cloudflare's build environment checks out the
> repo to a clean path), but if you build locally from this iCloud path and get 0 `.html` files
> in `dist/`, that's why. Workaround: build from a path with no spaces (e.g. `~/action-renovations`
> or `/tmp/some-path`, synced with `rsync`) or symlink around it.

## Lead pipeline

**Status: live and tested.** All leads — from the website, Facebook/Instagram Lead Ads, and Google
Ads lead forms — land in Housecall Pro as a **Customer + Lead**. Since the Housecall Pro plan in
use doesn't include self-serve Public API access (that requires the MAX or XL plan), the
integration goes through **Zapier's official Housecall Pro app** instead, which authenticates via
your own HCP login inside Zapier — no API key needed.

### 1. Website → Zapier → Housecall Pro (done)

The website's Zap (Webhooks by Zapier "Catch Hook" → Housecall Pro "Create Lead") is built and
live. The webhook URL is stored as the `ZAPIER_LEAD_WEBHOOK_URL` secret on the Cloudflare Pages
project — **not** in this repo. To change it:

```bash
npx wrangler pages secret put ZAPIER_LEAD_WEBHOOK_URL --project-name=action-renovations
```

then redeploy (secrets only take effect on the next deployment, not retroactively on existing ones).

The site's `/api/lead` function (`src/pages/api/lead.ts`) validates the form submission
server-side and POSTs it as JSON to that webhook URL. If `ZAPIER_LEAD_WEBHOOK_URL` isn't set,
submissions are accepted (so the form doesn't break for visitors) but only logged, not forwarded —
check the Cloudflare Worker logs if leads seem to be going nowhere.

### 2. Facebook / Instagram Lead Ads → Zapier → Housecall Pro (not yet built)

1. New Zap: **Trigger = "Facebook Lead Ads" → "New Lead"** (pick the Page + Form).
   Note: Facebook Lead Ads is a "Premium" Zapier app and may require a paid Zapier plan.
2. Action = **Housecall Pro → Create Lead**, mapping the ad form's fields the same way as the
   website Zap, with `source` set to a static value of `"facebook"`.

### 3. Google Ads Lead Form → Zapier → Housecall Pro (not yet built)

1. New Zap: **Trigger = "Google Ads" → "New Lead Form Submission"**.
2. Action = **Housecall Pro → Create Lead**, same field mapping, `source` = `"google"`.

### Later: routing to a marketing team

Once the marketing team's actual workflow is defined, this is the one place to change:
`src/pages/api/lead.ts` (for website leads) and/or the Zaps above (for ad leads) can fan out to
additional destinations — e.g. a Slack notification, an email via a transactional email API, or
tagging the HCP lead for a specific pipeline/team member.

## Service area map

`/service-area` embeds a Leaflet map (`src/components/ServiceAreaMap.astro`) using CARTO's
authenticated raster tile service, styled light (`light_all`) to match the site and keep labels
legible, with a gold pin per town. Town coordinates live in `serviceAreaPins` in
`src/data/services.ts` — add a `{ name, lat, lng }` entry there to add a pin.

The CARTO API key is hardcoded in `ServiceAreaMap.astro`. This is intentional, not an oversight:
it's a **client-side tile key** used directly in browser tile requests (like a domain-restricted
Google Maps JS key), not a server secret, so there's no confidentiality benefit to hiding it behind
an env var — it's visible in the network tab either way.

## Financing page (`/financing`)

Covers the HFS Financial partnership: soft-credit-check inquiry, no equity/appraisal required, up
to 120% project financing, a how-it-works walkthrough, and HFS's required legal disclaimer
(displayed verbatim — don't edit that text without checking with HFS/legal first). Also linked
from a banner on the homepage (right under the hero, above the services grid) and from a
"Financing by HFS" badge in the footer, to the right of the payment-method icons.

- **Apply link** → your personalized HFS promo URL (hardcoded in `src/pages/financing.astro` and
  `src/pages/index.astro` as `applyUrl` / the banner's href).
- **HFS logo** → `public/images/financing/hfs-logo.webp`, pulled from HFS's own site
  (`hfsfinancial.net`), legitimate to use for a co-marketing/partner page.
- **Downloadable flyer** → `public/documents/action-renovations-hfs-financing-flyer.pdf`.

## Online booking (Housecall Pro widget)

The Housecall Pro online-booking script is loaded site-wide in `src/layouts/Layout.astro`, and
`src/components/BookOnlineButton.astro` is the reusable trigger — it renders a plain `<button>`
whose `onclick` calls `window.HCPWidget.openModal()`, matching HCP's own recommended snippet
exactly. It's placed in: the header top bar, the homepage hero (primary CTA), the `ContactStrip`
component (shown on most pages), each service page (above the quote form), and the contact page.
Booking config (token, org name, and the fallback booking-page URL) lives in `companyInfo` in
`src/data/services.ts`.

**Two gotchas found while wiring this up:**

1. **Don't put `class="hcp-button"` on the trigger element.** The HCP script scans the page for
   that exact class name and force-overrides its CSS (to HCP's own blue), clobbering whatever
   styling you gave it. `BookOnlineButton.astro` deliberately omits that class — only your own
   `class` prop is applied.
2. **The modal wouldn't render on `localhost` or the `*.pages.dev` preview domain.** Clicking does
   correctly toggle HCP's widget container and inject an iframe pointing at the right booking URL
   (confirmed via DOM inspection — `document.querySelector('.hcp-widget')` gets the
   `hcp-widget--visible` class and a same-content iframe), but the iframe painted blank in both
   environments. The likely cause is that HCP's booking iframe is domain-restricted (like an
   `X-Frame-Options`/CSP `frame-ancestors` allowlist) to the business's actual registered domain,
   which neither `localhost` nor a Cloudflare preview subdomain would satisfy. **This needs a real
   test on `actionrenovations.net` once DNS is cut over** — if it's still blank there, check
   Housecall Pro's booking widget settings for a domain allowlist.

## Customer Login (Housecall Pro portal)

The header's "Customer Login" link (`companyInfo.customerPortalUrl` in `src/data/services.ts`)
points at the Housecall Pro customer portal, matching what's on the live actionrenovations.net
site today. The `token` query param is a **stable, per-account API key** (Housecall Pro calls it
`customer_portal_api_key`), not a per-session/per-customer token — confirmed by inspecting the
live site's widget config, where the same value is baked into the static page markup for every
visitor. Safe to keep hardcoded as a permanent link.

## Images

Every photo in `public/images/` (hero, about, and all 9 service categories) is a free-license
stock photo from [Pexels](https://www.pexels.com) (Pexels License — free for commercial use, no
attribution required). These are **not** photos of Action Renovations' actual completed work.

The first version of this site pulled photos directly from the live actionrenovations.net CDN,
but those turned out to be stock images bundled with the Housecall Pro / Duda website template —
licensed to that platform, not to Action Renovations, so reusing them on an independent site
wasn't safe. They were replaced with the Pexels photos here instead.

**Action item:** swap these for real photos of Action Renovations' own completed jobs as they
become available — both the per-service images (`public/images/services/`) and the `/our-work`
gallery (`src/pages/our-work.astro`), which currently shows one stock photo per category rather
than real project case studies.

## NJ HIC license

Displayed in the footer, set in bold display type (`src/data/services.ts` →
`companyInfo.njHicLicense`, currently `13VH14111800`). Update that one value if the license number
ever changes.

## Footer (`src/components/Footer.astro`)

Four columns (company info + license, all 9 services, the full service-area town list, and
company/site links including Customer Reviews), then two full-width rows below:

- **Payment methods** (left) — Visa, Mastercard, Amex, Discover, Apple Pay, Google Pay, as inline
  SVGs sourced from [Simple Icons](https://simpleicons.org) (CC0 icon shapes; these are standard
  "we accept" brand-mark usage, not licensed assets). **Financing by HFS** badge (right) — same
  white pill/logo treatment as the homepage banner and `/financing` hero.
- Copyright + service-region line, set in the display font.

If you add a 10th service or another town, both list columns pull straight from `services` /
`serviceAreas` in `src/data/services.ts` — no template changes needed. (There was a bug where the
Services column was hardcoded to `.slice(0, 6)` and silently dropped 3 services; that's fixed, but
worth remembering if columns ever look short again after adding new items.)

## Deploying to Cloudflare Pages

**Current setup:** deployed manually via the Wrangler CLI (not yet connected to Cloudflare's Git
integration). To ship a change:

```bash
npm run build
npx wrangler pages deploy ./dist --project-name=action-renovations --branch=main
```

To switch to git-based auto-deploys instead (recommended eventually, so pushing to `main` deploys
automatically without a manual CLI step):

1. In the Cloudflare dashboard: **Workers & Pages → action-renovations → Settings → Builds →
   Connect to Git**, and select the `bstef/action-renovations` repo.
2. Build settings:
   - Framework preset: **Astro**
   - Build command: `npm run build`
   - Build output directory: `dist`
3. The `ZAPIER_LEAD_WEBHOOK_URL` secret (see "Lead pipeline") and the CARTO key (already in source,
   see "Service area map") don't need any extra setup for this — secrets persist on the Pages
   project regardless of how deploys are triggered.
4. Point the `actionrenovations.net` domain at the Pages project under **Custom domains** once
   you're ready to cut over DNS — this hasn't been done yet; the live site today is still the old
   Duda-based one.
