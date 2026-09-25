# Action Renovations LLC — Website

Marketing site for Action Renovations LLC, built with [Astro](https://astro.build) and deployed to
[Cloudflare Pages](https://pages.cloudflare.com/). Leads submitted on the site are forwarded to
Housecall Pro via a Zapier webhook.

**Live:** [actionrenos.com](https://actionrenos.com) and
[action-renovations.pages.dev](https://action-renovations.pages.dev). The main
`actionrenovations.net` domain has **not** been cut over yet — it still serves the old Duda site;
see "Deploying" below.

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
| `/reviews` | Embeds the real Housecall Pro reviews widget (iframe) in a card styled to match the site, plus a "Leave Us a Google Review" button (`companyInfo.googleReviewUrl`, the Business Profile's "Ask for reviews" link). |
| `/social` | "Follow Us" — Facebook, Instagram, and Google Business Profile cards and an embedded Facebook Page Plugin timeline (plain iframe, no SDK). Accounts live in `socialLinks` in `src/data/services.ts`. |
| `/financing` | HFS Financial partnership page (see below). |
| `/contact` | Contact info, a "prefer to book instantly?" Book Online callout, and the lead form. |
| `/api/lead` | POST endpoint the lead form submits to; not a page. |

## Navigation

The header has two hover dropdowns (desktop) / `<details>` accordions (mobile), both driving
directly off `src/data/services.ts` so they can't drift out of sync with the actual pages:

- **Services** → all 9 service pages, plus "View All Services".
- **Our Work** → `/our-work` ("Project Gallery"), `/reviews` ("Customer Reviews"), and `/social`
  ("Follow Us"). Reviews and Social were folded in here rather than added as their own top-level nav
  items — see the breakpoint note below.

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
legible, with a gold pin per town. Towns live in `serviceAreaPins` in `src/data/services.ts` — add a
`{ name, lat, lng }` entry there to add a town. `serviceAreas` (the town lists on the home, service
area, and contact pages and in the footer) is derived from it, so pins and lists can't drift apart.

The region itself is described as **"Morris & Northern Somerset County, NJ"** everywhere
(`companyInfo.serviceRegion` plus a few headings). Page `<title>`s deliberately still end in
"Morris County, NJ" for search.

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

## Chat bubble (Housecall Pro)

The same Housecall Pro chat widget the old actionrenovations.net site used is loaded on every page,
at the end of `<body>` in `src/layouts/Layout.astro`: a single `proChat.js` script tag that renders
a fixed bottom-right bubble, opening a "Hello, how can we help?" form (name + phone). Conversations
land in Housecall Pro's messaging inbox. Its `data-color` is the site gold (`#e8ac37`), and
`data-organization` is `companyInfo.hcpOrganizationUuid` (also used by the `/reviews` widget).

Keep the tag's `id="housecall-pro-chat-bubble"` and its position at the end of `<body>`:
`proChat.js` looks itself up by that id to read its settings and appends its iframe to `<body>` as
soon as it runs.

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
company/site links including Customer Reviews and Follow Us), then two full-width rows below:

- **Payment methods** (left) — Visa, Mastercard, Amex, Discover, Apple Pay, Google Pay, as
  full-color inline SVGs on white chips (the one-color white versions were too hard to see on the
  dark footer). Wordmark shapes come from [Simple Icons](https://simpleicons.org) (CC0) recolored in
  each brand's colors; Mastercard's circles and Google's four-color G are drawn directly. Each
  entry's `viewBox` is cropped to the mark's real bounds so wide wordmarks fill the chip. Standard
  "we accept" brand-mark usage, not licensed assets. **Financing by HFS** badge (right) — same
  white pill/logo treatment as the homepage banner and `/financing` hero.
- Copyright (left) + service-region line and Facebook/Instagram/Google icons (right), set in the display
  font. The icons come from `socialLinks` in `src/data/services.ts`.

If you add a 10th service or another town, both list columns pull straight from `services` /
`serviceAreas` in `src/data/services.ts` — no template changes needed. (There was a bug where the
Services column was hardcoded to `.slice(0, 6)` and silently dropped 3 services; that's fixed, but
worth remembering if columns ever look short again after adding new items.)

## Deploying to Cloudflare Pages

**Current setup:** the Pages project is connected to this GitHub repo — **pushing to `main`
deploys to production automatically**, and pushes to other branches get preview deployments
(`<hash>.action-renovations.pages.dev`). Build settings (Workers & Pages → action-renovations →
Settings → Builds):

- Build command: `npm run build`
- Build output directory: `dist`
- Production branch: `main`

> The build command was blank for a while, so every Git build failed with `Output directory "dist"
> not found` and pushes silently didn't deploy (production kept serving the last good build). If
> pushes stop showing up live, check the deployment list for failures first:
> `npx wrangler pages deployment list --project-name=action-renovations`.

The `ZAPIER_LEAD_WEBHOOK_URL` secret (see "Lead pipeline") lives on the Pages project, so it applies
to Git builds with no extra setup. The CARTO key is in source (see "Service area map").

**Manual deploy (fallback):** direct upload with Wrangler still works if you need to ship without
pushing — build from a path without spaces (see the iCloud note under "Local development"), then:

```bash
npx wrangler pages deploy ./dist --project-name=action-renovations --branch=main
```

### Domains

- **`actionrenos.com`** — already attached as a custom domain and serving this site.
- **`actionrenovations.net`** — not cut over yet; still the old Duda site. When you do cut over, add
  it under **Custom domains**. The old site's `/about-us` and `/contact-us` URLs are already
  301-redirected to `/about/` and `/contact/` via `public/_redirects` (the other old URLs —
  `/services`, `/service-area` — exist here under the same paths). The Astro Cloudflare adapter
  reads that file and excludes those paths from the worker in `_routes.json`, so Pages applies
  them; redirects for anything under `/api/*` wouldn't work, since the worker serves those.
- `site` in `astro.config.mjs` (and so every page's canonical URL) is `https://actionrenovations.net`.
  Change it if `actionrenos.com` is meant to be the long-term primary domain.
