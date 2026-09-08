import type { APIRoute } from 'astro';

export const prerender = false;

interface LeadPayload {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  address?: string;
  service?: string;
  message?: string;
  source?: string;
  company?: string; // honeypot
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export const POST: APIRoute = async ({ request, locals }) => {
  let body: LeadPayload;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON body' }), { status: 400 });
  }

  // Honeypot: bots that fill hidden fields get a fake success, no forwarding.
  if (body.company) {
    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  }

  const firstName = (body.firstName || '').trim();
  const lastName = (body.lastName || '').trim();
  const email = (body.email || '').trim();
  const phone = (body.phone || '').trim();

  if (!firstName || !lastName || !email || !phone) {
    return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });
  }
  if (!isValidEmail(email)) {
    return new Response(JSON.stringify({ error: 'Invalid email' }), { status: 400 });
  }

  const env = (locals as { runtime?: { env?: Record<string, string | undefined> } }).runtime?.env ?? {};
  const webhookUrl = env.ZAPIER_LEAD_WEBHOOK_URL;

  const lead = {
    firstName,
    lastName,
    email,
    phone,
    address: (body.address || '').trim(),
    service: (body.service || '').trim(),
    message: (body.message || '').trim(),
    source: body.source === 'facebook' || body.source === 'google' ? body.source : 'website',
    submittedAt: new Date().toISOString(),
    pageUrl: request.headers.get('referer') || '',
  };

  if (!webhookUrl) {
    // No webhook configured yet — accept the lead but log it so nothing is silently lost
    // while the Zapier -> Housecall Pro connection is being set up.
    console.warn('ZAPIER_LEAD_WEBHOOK_URL is not set; lead was not forwarded.', lead);
    return new Response(JSON.stringify({ ok: true, forwarded: false }), { status: 200 });
  }

  try {
    const zapierRes = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(lead),
    });

    if (!zapierRes.ok) {
      console.error('Zapier webhook returned an error', zapierRes.status, await zapierRes.text());
      return new Response(JSON.stringify({ error: 'Failed to forward lead' }), { status: 502 });
    }
  } catch (err) {
    console.error('Failed to reach Zapier webhook', err);
    return new Response(JSON.stringify({ error: 'Failed to forward lead' }), { status: 502 });
  }

  return new Response(JSON.stringify({ ok: true, forwarded: true }), { status: 200 });
};
