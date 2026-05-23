/**
 * Skedee — Sportmonks API Proxy
 * Deploy this as a Cloudflare Worker.
 *
 * SETUP:
 * 1. Go to https://workers.cloudflare.com → Create a Worker
 * 2. Paste this entire file into the editor, click Deploy
 * 3. Go to Settings → Variables → Add variable:
 *      Name:  SM_TOKEN
 *      Value: (your Sportmonks API token)
 *      → click Encrypt, then Save
 * 4. Copy your Worker URL (looks like https://skedee-sm.YOUR_NAME.workers.dev)
 * 5. Open sportmonks.js and set SM_PROXY to that URL
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

    // ── Build Sportmonks URL ────────────────────────────────────────────────
    const url     = new URL(request.url);
    const smPath  = url.pathname + url.search;
    const sep     = smPath.includes('?') ? '&' : '?';
    const smUrl   = `https://api.sportmonks.com/v3/football${smPath}${sep}api_token=${env.SM_TOKEN}`;

    // ── Proxy request ───────────────────────────────────────────────────────
    try {
      const smRes  = await fetch(smUrl, { headers: { Accept: 'application/json' } });
      const body   = await smRes.text();

      return new Response(body, {
        status: smRes.status,
        headers: {
          'Content-Type':                'application/json',
          'Access-Control-Allow-Origin': '*',
          'Cache-Control':               'public, max-age=60', // cache 60s
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
