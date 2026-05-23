/**
 * Skedee — The Odds API Proxy
 * Deploy this as a Cloudflare Worker.
 *
 * SETUP:
 * 1. Paste this into your Cloudflare Worker (Edit code → replace all → Deploy)
 * 2. Go to Settings → Variables and Secrets → edit SM_TOKEN:
 *      Set its value to your The Odds API key (from the-odds-api.com)
 * 3. Your Worker URL stays the same: https://skedee-sm.atypeofperson08.workers.dev
 */

export default {
  async fetch(request, env) {

    // ── CORS preflight ──────────────────────────────────────────────────────
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin':  '*',
          'Access-Control-Allow-Methods': 'GET, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      });
    }

    if (request.method !== 'GET') {
      return new Response('Method not allowed', { status: 405 });
    }

    // ── Proxy to The Odds API ───────────────────────────────────────────────
    const url    = new URL(request.url);
    const path   = url.pathname + url.search;
    const sep    = path.includes('?') ? '&' : '?';
    const target = `https://api.the-odds-api.com${path}${sep}apiKey=${env.SM_TOKEN}`;

    try {
      const res  = await fetch(target, { headers: { Accept: 'application/json' } });
      const body = await res.text();

      return new Response(body, {
        status: res.status,
        headers: {
          'Content-Type':                'application/json',
          'Access-Control-Allow-Origin': '*',
          'Cache-Control':               'public, max-age=60',
        },
      });

    } catch (e) {
      return new Response(JSON.stringify({ error: e.message }), {
        status: 502,
        headers: {
          'Content-Type':                'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }
  },
};
