/**
 * Cloudflare Pages Function — quote form handler.
 * Lives at POST /api/quote. Runs on Cloudflare's edge, no server to manage.
 *
 * Environment variables — Workers & Pages -> project -> Settings -> Variables:
 *   RESEND_API_KEY   API key from resend.com (free tier is plenty for lead volume)
 *   LEAD_TO          where leads land, e.g. info@<domain>
 *   LEAD_FROM        a verified sender on the send. subdomain, e.g. leads@send.<domain>
 *   LEAD_BRAND       optional. Goes in the email subject. Defaults to the hostname.
 *
 * KV binding — same screen, "KV namespace bindings":
 *   LEADS            binding name LEADS -> a KV namespace named <site>-leads
 *
 * WHY THE KV BINDING EXISTS. Every lead is written to KV BEFORE the email is
 * attempted, and updated with the outcome after. Cloudflare's real-time logs are
 * not retained, so without this a rejected send loses the lead permanently while
 * the customer still sees the thank-you page. That is not hypothetical: it
 * happened on Johnson City Drywall on 2026-09-02, when Resend returned 403
 * because the domain had not been verified yet.
 *
 * The form still submits and still redirects to /thank-you no matter what fails.
 * That is deliberate: a broken form must never show a customer an error page.
 */

interface Env {
  RESEND_API_KEY?: string;
  LEAD_TO?: string;
  LEAD_FROM?: string;
  LEAD_BRAND?: string;
  /* Structurally typed so this file needs no @cloudflare/workers-types dependency. */
  LEADS?: { put(key: string, value: string): Promise<void> };
}

const redirect = (url: string) => new Response(null, { status: 303, headers: { Location: url } });

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const form = await request.formData();

  // Honeypot — silently accept and drop.
  if (form.get('company')) return redirect('/thank-you');

  const field = (k: string) => String(form.get(k) ?? '').trim().slice(0, 2000);
  const name = field('name');
  const email = field('email');
  const phone = field('phone');
  const project = field('project');
  const source = field('source');

  if (!name || !email || !phone) return redirect('/contact?error=missing');

  const host = new URL(request.url).hostname;
  const brand = env.LEAD_BRAND || host;
  const at = new Date().toISOString();

  const lead = {
    at, name, email, phone, project, source, host,
    status: 'pending' as 'pending' | 'sent' | 'failed',
    error: '' as string,
  };

  // Key sorts oldest-first and never collides.
  const key = `lead:${at}:${crypto.randomUUID().slice(0, 8)}`;

  // ---- 1. Persist FIRST, so the lead survives whatever happens next.
  const persist = async () => {
    if (!env.LEADS) return;
    try {
      await env.LEADS.put(key, JSON.stringify(lead));
    } catch (err) {
      console.error('lead KV write failed', err);
    }
  };
  await persist();
  if (!env.LEADS) {
    // Loud, because this is the safety net being absent, not a lead failing.
    console.error('NO LEADS KV BINDING — a failed send would lose this lead', key);
  }

  const body = [
    `Name:    ${name}`,
    `Email:   ${email}`,
    `Phone:   ${phone}`,
    `Page:    ${source}`,
    `Site:    ${host}`,
    `Ref:     ${key}`,
    ``,
    `Project:`,
    project || '(nothing entered)',
  ].join('\n');

  // ---- 2. Attempt delivery.
  if (env.RESEND_API_KEY && env.LEAD_TO && env.LEAD_FROM) {
    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: env.LEAD_FROM,
          to: [env.LEAD_TO],
          reply_to: email,
          subject: `New quote request — ${name} — ${brand}`,
          text: body,
        }),
      });
      if (res.ok) {
        lead.status = 'sent';
      } else {
        lead.status = 'failed';
        lead.error = `resend ${res.status}: ${(await res.text()).slice(0, 500)}`;
        console.error('lead email rejected', res.status, lead.error, key);
      }
    } catch (err) {
      lead.status = 'failed';
      lead.error = `fetch: ${String(err).slice(0, 500)}`;
      console.error('lead email failed', err, key);
    }
  } else {
    lead.status = 'failed';
    lead.error = 'email not configured';
    console.error('LEAD (email not configured)\n' + body);
  }

  // ---- 3. Record the outcome. A 'failed' row is a lead waiting to be rescued.
  await persist();

  return redirect('/thank-you');
};
