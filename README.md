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

## Pages

| Route | Notes |
| --- | --- |
| `/` | Home — hero, financing banner, services grid, area/stats, contact strip. |
| `/about` | About Us. |
| `/services` | All 9 services, also reachable via the header's Services dropdown. |
| `/services/[slug]` | One page per service (`src/data/services.ts` → `services` array drives this). |
| `/service-area` | Town list + interactive Leaflet map (see below). |
| `/our-work` | One representative photo per service category — not real job case studies yet. |
| `/financing` | HFS Financial partnership page (see below). |
| `/contact` | Contact info + the lead form. |
| `/api/lead` | POST endpoint the lead form submits to; not a page. |

The header's **Services** nav item is a dropdown (hover on desktop, `<details>` on mobile) linking
directly to all 9 service pages — this is deliberate for SEO: every service page is a real `<a>`
link present in the static HTML of every page on the site, one crawl-hop from anywhere.

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
from a banner on the homepage (right under the hero).

- **Apply link** → your personalized HFS promo URL (hardcoded in `src/pages/financing.astro` and
  `src/pages/index.astro` as `applyUrl` / the banner's href).
- **HFS logo** → `public/images/financing/hfs-logo.webp`, pulled from HFS's own site
  (`hfsfinancial.net`), legitimate to use for a co-marketing/partner page.
- **Downloadable flyer** → `public/documents/action-renovations-hfs-financing-flyer.pdf`.

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

Displayed in the footer (`src/data/services.ts` → `companyInfo.njHicLicense`, currently
`13VH14111800`). Update that one value if the license number ever changes.

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
