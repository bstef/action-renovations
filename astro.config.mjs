import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  output: 'server',
  adapter: cloudflare({
    imageService: 'compile',
  }),
  integrations: [tailwind()],
  site: 'https://actionrenovations.net',
  // This site doesn't use Astro's session API. Setting a driver here (rather than leaving
  // it unset) stops the Cloudflare adapter from auto-requiring a "SESSION" KV namespace
  // binding that would otherwise need to exist in production for no reason.
  session: {
    driver: 'memory',
  },
});
