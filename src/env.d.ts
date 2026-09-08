/// <reference types="astro/client" />
/// <reference types="@astrojs/cloudflare" />

type Runtime = import('@astrojs/cloudflare').Runtime<Env>;

declare namespace App {
  interface Locals extends Runtime {}
}

interface Env {
  ZAPIER_LEAD_WEBHOOK_URL?: string;
}
