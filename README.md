# Action Renovations LLC — Website

Marketing site for Action Renovations LLC, built with [Astro](https://astro.build) and deployed to
[Cloudflare Pages](https://pages.cloudflare.com/). Leads submitted on the site are forwarded to
Housecall Pro via a Zapier webhook.

## Stack

- **Astro 5** (`output: 'server'`) — pages are prerendered to static HTML at build time
  (`export const prerender = true` on every page), except `/api/lead`, which runs as a
  Cloudflare Pages Function.
- **Tailwind CSS** for styling.
- **@astrojs/cloudflare** adapter — ships a single Worker (`_worker.js`) alongside the static assets.

## Local development

```bash
npm install
cp .dev.vars.example .dev.vars   # then fill in ZAPIER_LEAD_WEBHOOK_URL once you have it
npm run dev
```

> **Note:** This repo currently lives under an iCloud Drive path
> (`.../Mobile Documents/com~apple~CloudDocs/...`), which contains spaces. A bug in Astro 5's
> internal route-scanner file-path matching means **static prerendering silently fails when the
> project path contains spaces** — every page gets built as a dynamic SSR route instead of a
> static file. This does not affect production (Cloudflare's build environment checks out the
> repo to a clean path), but if you build locally from this iCloud path and get 0 `.html` files
> in `dist/`, that's why. Workaround: build from a path with no spaces (e.g. `~/action-renovations`)
> or symlink around it.

## Lead pipeline

All leads — from the website, Facebook/Instagram Lead Ads, and Google Ads lead forms — are meant
to land in Housecall Pro as a **Customer + Lead**. Since the Housecall Pro plan in use doesn't
include self-serve Public API access (that requires the MAX or XL plan), the integration goes
through **Zapier's official Housecall Pro app** instead, which authenticates via your own HCP
login inside Zapier — no API key needed.

### 1. Website → Zapier → Housecall Pro

1. In Zapier, create a new Zap: **Trigger = "Webhooks by Zapier" → "Catch Hook"**.
2. Copy the webhook URL Zapier gives you.
3. Set it as the `ZAPIER_LEAD_WEBHOOK_URL` secret (see "Deploying" below).
4. Add the action step: **Housecall Pro → Create Lead** (this will also create/match the Customer).
   Map fields from the incoming webhook payload:
   - `firstName`, `lastName`, `email`, `phone`, `address`
   - `service` → put in the lead notes/description
   - `message` → lead notes/description
   - `source` → will be `"website"` for anything coming from this site
5. Turn the Zap on.

The site's `/api/lead` function (`src/pages/api/lead.ts`) validates the form submission
server-side and POSTs it as JSON to that webhook URL. If `ZAPIER_LEAD_WEBHOOK_URL` isn't set yet,
submissions are accepted (so the form doesn't break for visitors) but only logged, not forwarded —
check the Cloudflare Worker logs if leads seem to be going nowhere.

### 2. Facebook / Instagram Lead Ads → Zapier → Housecall Pro

1. New Zap: **Trigger = "Facebook Lead Ads" → "New Lead"** (pick the Page + Form).
   Note: Facebook Lead Ads is a "Premium" Zapier app and may require a paid Zapier plan.
2. Action = **Housecall Pro → Create Lead**, mapping the ad form's fields the same way as above,
   with `source` set to a static value of `"facebook"`.

### 3. Google Ads Lead Form → Zapier → Housecall Pro

1. New Zap: **Trigger = "Google Ads" → "New Lead Form Submission"**.
2. Action = **Housecall Pro → Create Lead**, same field mapping, `source` = `"google"`.

### Later: routing to a marketing team

Once the marketing team's actual workflow is defined, this is the one place to change:
`src/pages/api/lead.ts` (for website leads) and/or the Zaps above (for ad leads) can fan out to
additional destinations — e.g. a Slack notification, an email via a transactional email API, or
tagging the HCP lead for a specific pipeline/team member.

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

## Deploying to Cloudflare Pages

1. In the Cloudflare dashboard: **Workers & Pages → Create → Pages → Connect to Git**, and select
   the `bstef/action-renovations` repo.
2. Build settings:
   - Framework preset: **Astro**
   - Build command: `npm run build`
   - Build output directory: `dist`
3. Add the environment variable/secret `ZAPIER_LEAD_WEBHOOK_URL` under
   **Settings → Environment variables** (mark it as a secret, not plaintext).
4. Point the `actionrenovations.net` domain at the new Pages project under
   **Custom domains** once you're ready to cut over DNS.

Alternatively, from the CLI (requires `wrangler login` once):

```bash
npm run build
npx wrangler pages deploy ./dist --project-name=action-renovations
npx wrangler pages secret put ZAPIER_LEAD_WEBHOOK_URL --project-name=action-renovations
```
