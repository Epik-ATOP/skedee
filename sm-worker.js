/**
 * Skedee — API Proxy Worker
 * Deploys as a single Cloudflare Worker that fronts two upstreams:
 *
 *   1. The Odds API  (existing)  /v4/sports/...   → api.the-odds-api.com
 *   2. API-Football  (new)       /football/...    → v3.football.api-sports.io
 *
 * SETUP
 * 1. Paste this into your Cloudflare Worker (Edit code → replace all → Deploy)
 * 2. Settings → Variables and Secrets, add BOTH:
 *      SM_TOKEN  = your the-odds-api.com key
 *      AF_TOKEN  = your api-sports.io key
 *    Both stay server-side. The browser only ever sees this Worker's URL.
 * 3. Your Worker URL stays the same:
 *      https://skedee-sm.atypeofperson08.workers.dev
 *
 * Football pages call it as:
 *      fetch(SM_PROXY + '/football/fixtures?id=' + AF_FIXTURE)
 */

const CORS_HEADERS = {
  'Access-Control-Allow-Origin':  '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export default {
  async fetch(request, env) {

    // ── CORS preflight ──────────────────────────────────────────────────────
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: CORS_HEADERS });
    }

    if (request.method !== 'GET') {
      return new Response('Method not allowed', { status: 405 });
    }

    const url  = new URL(request.url);
    const path = url.pathname + url.search;

    // ── Route: API-Football ─────────────────────────────────────────────────
    // Client asks for  /football/fixtures?id=123
    // We hit           https://v3.football.api-sports.io/fixtures?id=123
    if (url.pathname === '/football' || url.pathname.startsWith('/football/')) {
      const upstreamPath = url.pathname.replace(/^\/football/, '') || '/';
      const target = `https://v3.football.api-sports.io${upstreamPath}${url.search}`;
      return proxy(target, { 'x-apisports-key': env.AF_TOKEN });
    }

    // ── Route: The Odds API (default) ───────────────────────────────────────
    const sep = path.includes('?') ? '&' : '?';
    const target = `https://api.the-odds-api.com${path}${sep}apiKey=${env.SM_TOKEN}`;
    return proxy(target);
  },
};

async function proxy(target, extraHeaders = {}) {
  try {
    const res = await fetch(target, {
      headers: { Accept: 'application/json', ...extraHeaders },
    });
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
      headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
    });
  }
}
