/* ── SPORTMONKS API INTEGRATION ──────────────────────────────────────────
   Docs: https://docs.sportmonks.com/football

   HOW TO USE:
   1. Deploy sm-worker.js as a Cloudflare Worker (see instructions inside)
   2. Paste your Worker URL below as SM_PROXY (e.g. https://skedee-sm.you.workers.dev)
   3. In each market page, set SM_FIXTURE_ID to the Sportmonks fixture ID
      → Open sm-lookup.html to find the right ID for each match
   4. Probabilities and live events load automatically on page open

   WHY A PROXY? Sportmonks blocks direct browser requests (CORS policy).
   The Worker sits between the browser and Sportmonks, adds your API token
   server-side, and returns CORS-safe responses. Your token never appears
   in browser code.
   ──────────────────────────────────────────────────────────────────────── */

// ← Paste your Cloudflare Worker URL here after deploying sm-worker.js
const SM_PROXY = 'https://skedee-sm.atypeofperson08.workers.dev';
// e.g. 'https://skedee-sm.yourname.workers.dev'

const SM_BASE  = SM_PROXY;
const SM_PL_ID = 8; // Premier League ID on Sportmonks

// ── EVENT TYPE IDs ────────────────────────────────────────────────────────
const SME = {
  GOAL:       14,
  OWN_GOAL:   15,
  PENALTY:    16,
  YELLOW:     18,
  RED:        19,
  YELLOW_RED: 20,
  SUB:        24,
};

// ── INTERNAL HELPERS ──────────────────────────────────────────────────────

function _smReady() {
  if (SM_PROXY === 'PASTE_YOUR_WORKER_URL_HERE') {
    console.warn('[Sportmonks] ⚠ Worker URL not set — deploy sm-worker.js to Cloudflare and paste the URL into SM_PROXY in sportmonks.js');
    return false;
  }
  return true;
}

async function _smFetch(path) {
  // Route through the Cloudflare Worker proxy (handles auth + CORS)
  const res = await fetch(`${SM_BASE}${path}`);
  if (!res.ok) throw new Error(`Sportmonks HTTP ${res.status} on: ${path}`);
  return res.json();
}

// ── ODDS UTILITIES ────────────────────────────────────────────────────────

/** Convert decimal odds (home/draw/away) to fair probabilities (removes vig) */
function smOddsToProbs(h, d, a) {
  const hi = 1/h, di = 1/d, ai = 1/a, t = hi + di + ai;
  return { home: hi/t, draw: di/t, away: ai/t };
}

/** Round probs to integers summing to exactly 100 */
function smRound(p) {
  let h = Math.round(p.home * 100);
  let d = Math.round(p.draw * 100);
  let a = Math.round(p.away * 100);
  h += (100 - h - d - a); // assign rounding gap to home
  return { home: h, draw: d, away: a };
}

/** Extract a short keyword from a team name for fuzzy market matching.
 *  e.g. "Crystal Palace" → "palace", "Man City" → "city", "West Ham" → "west" */
function smTeamKey(name) {
  const words = name.toLowerCase().split(/\s+/).filter(w => w.length >= 4);
  return words.length ? words[words.length - 1] : name.toLowerCase().slice(0, 5);
}

// ── PRE-MATCH ODDS → PROBABILITIES ───────────────────────────────────────

/**
 * Fetch pre-match 1X2 odds for a fixture and return fair probabilities.
 * Returns { home, draw, away } as decimals (0–1), or null if unavailable.
 */
async function smGetProbs(fixtureId) {
  if (!_smReady()) return null;
  try {
    const json = await _smFetch(`/odds/pre-match/fixtures/${fixtureId}?include=bookmaker;market`);
    if (!json.data?.length) { console.warn('[SM] No odds data for fixture', fixtureId); return null; }

    // Find 1X2 / Match Winner market rows
    const rows = json.data.filter(o =>
      o.market_id === 1 ||
      o.market?.data?.name?.match(/1x2|match.?winner/i)
    );
    if (!rows.length) { console.warn('[SM] No 1X2 market found for fixture', fixtureId); return null; }

    // Prefer well-known bookmakers for accuracy
    const PREF = ['Pinnacle', 'Bet365', 'William Hill', 'Betway', '1xBet', 'Unibet'];
    rows.sort((a, b) => {
      const ai = PREF.indexOf(a.bookmaker?.data?.name ?? '');
      const bi = PREF.indexOf(b.bookmaker?.data?.name ?? '');
      return (ai < 0 ? 99 : ai) - (bi < 0 ? 99 : bi);
    });

    const vals = rows[0].values ?? [];
    const get  = (...labels) => vals.find(v => labels.includes(v.label))?.value;
    const h = parseFloat(get('1', 'Home', 'home'));
    const d = parseFloat(get('X', 'Draw', 'draw'));
    const a = parseFloat(get('2', 'Away', 'away'));

    if ([h, d, a].some(isNaN)) { console.warn('[SM] Could not parse odds values', vals); return null; }

    const probs = smOddsToProbs(h, d, a);
    console.log(`[SM] Odds for fixture ${fixtureId}: H=${h} D=${d} A=${a} → ${JSON.stringify(smRound(probs))}`);
    return probs;

  } catch(e) {
    console.warn('[SM] getProbs error:', e.message);
    return null;
  }
}

// ── LIVE FIXTURE DATA ─────────────────────────────────────────────────────

/**
 * Fetch live fixture data: score, events, match state.
 * Returns the raw Sportmonks fixture object.
 */
async function smGetLive(fixtureId) {
  if (!_smReady()) return null;
  try {
    const json = await _smFetch(`/fixtures/${fixtureId}?include=events.type;events.player;scores;state;periods`);
    return json.data ?? null;
  } catch(e) {
    console.warn('[SM] getLive error:', e.message);
    return null;
  }
}

/**
 * Parse score out of a live fixture object.
 * Returns { home, away } as integers.
 */
function smParseScore(fixture) {
  const scores = fixture.scores?.data ?? [];

  // Try CURRENT aggregate score first
  const cur = scores.find(s => s.description === 'CURRENT' || s.description === 'LIVE');
  if (cur?.score) {
    return {
      home: parseInt(cur.score.goals ?? cur.score.home ?? 0) || 0,
      away: parseInt(cur.score.participant === 'away' ? cur.score.goals : cur.score.away ?? 0) || 0,
    };
  }

  // Fallback: sum period scores by participant
  let home = 0, away = 0;
  scores.forEach(s => {
    const g = parseInt(s.score?.goals ?? 0) || 0;
    if (s.participant === 'home' || s.score?.participant === 'home') home += g;
    if (s.participant === 'away' || s.score?.participant === 'away') away += g;
  });
  return { home, away };
}

/**
 * Parse match state from fixture.
 * Returns: 'pre' | 'live' | 'ht' | 'finished'
 */
function smParseState(fixture) {
  const s = fixture.state?.data?.short_name ?? fixture.state?.data?.name ?? '';
  if (['FT','AET','AP','POST','CANCL'].includes(s)) return 'finished';
  if (s === 'HT') return 'ht';
  if (['LIVE','1H','2H','ET','PEN_LIVE','BREAK'].includes(s)) return 'live';
  return 'pre';
}

/**
 * Parse match events into friendly objects, newest first.
 * Returns array of { id, minute, playerName, emoji, label }
 */
function smParseEvents(fixture) {
  const map = {
    [SME.GOAL]:       { emoji: '⚽', label: 'Goal' },
    [SME.OWN_GOAL]:   { emoji: '⚽', label: 'Own Goal' },
    [SME.PENALTY]:    { emoji: '⚽', label: 'Penalty' },
    [SME.YELLOW]:     { emoji: '🟨', label: 'Yellow Card' },
    [SME.RED]:        { emoji: '🟥', label: 'Red Card' },
    [SME.YELLOW_RED]: { emoji: '🟥', label: '2nd Yellow / Red' },
    [SME.SUB]:        { emoji: '🔄', label: 'Substitution' },
  };

  return (fixture.events?.data ?? [])
    .filter(e => map[e.type_id])
    .map(e => ({
      id:         e.id,
      minute:     e.minute ?? e.extra_minute ?? '?',
      playerName: e.player?.data?.display_name ?? e.player?.data?.name ?? 'Unknown',
      ...map[e.type_id],
    }))
    .sort((a, b) => (parseInt(b.minute) || 0) - (parseInt(a.minute) || 0));
}

// ── FIXTURE ID LOOKUP ────────────────────────────────────────────────────

/**
 * Search for a Premier League fixture by date.
 * date: 'YYYY-MM-DD'
 * Returns the full list of fixture objects for that date in the PL.
 */
async function smGetFixturesByDate(date) {
  if (!_smReady()) return [];
  try {
    const json = await _smFetch(`/fixtures/date/${date}?filters=leagueIds:${SM_PL_ID}&include=participants`);
    return json.data ?? [];
  } catch(e) {
    console.warn('[SM] getFixturesByDate error:', e.message);
    return [];
  }
}

/**
 * Find a single fixture ID by date + team names (fuzzy match).
 * Useful for scripting. For manual lookup use sm-lookup.html.
 */
async function smFindFixture(date, homeTeam, awayTeam) {
  const fixtures = await smGetFixturesByDate(date);
  const norm = s => s.toLowerCase().replace(/[^a-z0-9]/g, '');
  const hn = norm(homeTeam).slice(0, 6), an = norm(awayTeam).slice(0, 6);

  const found = fixtures.find(f => {
    const teams = (f.participants?.data ?? []).map(p => norm(p.name));
    return teams.some(t => t.includes(hn) || hn.includes(t.slice(0, 5))) &&
           teams.some(t => t.includes(an) || an.includes(t.slice(0, 5)));
  });
  return found?.id ?? null;
}

// ── LIVE POLLING ──────────────────────────────────────────────────────────

/**
 * Poll a live fixture every intervalMs milliseconds.
 * Calls onUpdate(fixtureData) on each tick.
 * Returns a stop() function to cancel polling.
 */
function smStartPoll(fixtureId, onUpdate, intervalMs = 30000) {
  let active = true;
  const tick = async () => {
    if (!active) return;
    const data = await smGetLive(fixtureId);
    if (data) onUpdate(data);
    if (active) setTimeout(tick, intervalMs);
  };
  tick(); // immediate first call
  return () => { active = false; };
}
