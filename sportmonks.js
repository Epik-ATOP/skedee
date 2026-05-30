/* ── THE ODDS API INTEGRATION ─────────────────────────────────────────────
   Docs: https://the-odds-api.com/lol-odds-api/

   HOW TO USE:
   1. Deploy sm-worker.js as a Cloudflare Worker (see instructions inside)
   2. Go to Settings → Variables and Secrets → set SM_TOKEN to your Odds API key
      (get a free key at the-odds-api.com — 500 requests/month on free tier)
   3. Each market page has SM_HOME_NAME and SM_AWAY_NAME set already —
      no fixture IDs needed! Odds load automatically by team name.

   WHY A PROXY? The Odds API blocks direct browser requests (CORS policy).
   The Worker sits between the browser and the API, adds your key server-side,
   and returns CORS-safe responses. Your key never appears in browser code.
   ──────────────────────────────────────────────────────────────────────── */

// Cloudflare Worker URL (proxies requests to The Odds API)
const SM_PROXY = 'https://skedee-sm.atypeofperson08.workers.dev';
const SM_BASE  = SM_PROXY;

// Premier League sport key on The Odds API
const SM_SPORT = 'soccer_epl';

// ── TEAM NAME ALIASES ─────────────────────────────────────────────────────
// Maps the short names used in each market page → full names The Odds API uses
const SM_ALIASES = {
  'man city':              'Manchester City',
  'manchester city':       'Manchester City',
  'aston villa':           'Aston Villa',
  'brighton':              'Brighton and Hove Albion',
  'brighton & hove albion':'Brighton and Hove Albion',
  'man united':            'Manchester United',
  'man utd':               'Manchester United',
  'manchester united':     'Manchester United',
  'fulham':                'Fulham',
  'newcastle':             'Newcastle United',
  'newcastle united':      'Newcastle United',
  'spurs':                 'Tottenham Hotspur',
  'tottenham':             'Tottenham Hotspur',
  'tottenham hotspur':     'Tottenham Hotspur',
  'everton':               'Everton',
  'liverpool':             'Liverpool',
  'brentford':             'Brentford',
  'burnley':               'Burnley',
  'wolves':                'Wolverhampton Wanderers',
  'wolverhampton':         'Wolverhampton Wanderers',
  'wolverhampton wanderers':'Wolverhampton Wanderers',
  'nottm forest':          'Nottingham Forest',
  'nottingham forest':     'Nottingham Forest',
  'bournemouth':           'Bournemouth',
  'west ham':              'West Ham United',
  'west ham united':       'West Ham United',
  'leeds':                 'Leeds United',
  'leeds united':          'Leeds United',
  'sunderland':            'Sunderland',
  'chelsea':               'Chelsea',
  'crystal palace':        'Crystal Palace',
  'arsenal':               'Arsenal',
  'psg':                   'Paris Saint-Germain',
  'paris saint-germain':   'Paris Saint-Germain',
  'paris sg':              'Paris Saint-Germain',
};

// ── INTERNAL HELPERS ──────────────────────────────────────────────────────

/** Resolve a short team name to The Odds API full name */
function _smAlias(name) {
  return SM_ALIASES[name.toLowerCase()] ?? name;
}

/** Route a request through the Cloudflare Worker proxy */
async function _smFetch(path) {
  const res = await fetch(`${SM_BASE}${path}`);
  if (!res.ok) throw new Error(`Odds API HTTP ${res.status} — ${path}`);
  return res.json();
}

/** Find a game in an Odds API response array by home/away team (fuzzy) */
function _smFindGame(games, homeTeam, awayTeam) {
  const hn = _smAlias(homeTeam).toLowerCase();
  const an = _smAlias(awayTeam).toLowerCase();
  return games.find(g => {
    const gh = g.home_team.toLowerCase();
    const ga = g.away_team.toLowerCase();
    // Accept if either name is a substring of the other (first 5 chars)
    const hOk = gh.includes(hn.slice(0,6)) || hn.includes(gh.slice(0,6));
    const aOk = ga.includes(an.slice(0,6)) || an.includes(ga.slice(0,6));
    return hOk && aOk;
  }) ?? null;
}

// ── ODDS UTILITIES ────────────────────────────────────────────────────────

/** Convert decimal odds (home/draw/away) to fair probabilities (removes vig) */
function smOddsToProbs(h, d, a) {
  const hi = 1/h, di = d ? 1/d : 0, ai = 1/a, t = hi + di + ai;
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

/** Extract a short keyword from a team name for fuzzy market title matching.
 *  e.g. "Crystal Palace" → "palace", "Man City" → "city", "West Ham" → "west" */
function smTeamKey(name) {
  const words = name.toLowerCase().split(/\s+/).filter(w => w.length >= 4);
  return words.length ? words[words.length - 1] : name.toLowerCase().slice(0, 5);
}

// ── PRE-MATCH ODDS → PROBABILITIES ───────────────────────────────────────

/**
 * Fetch pre-match h2h odds for a fixture (by team names) and return fair probabilities.
 * Returns { home, draw, away } as decimals (0–1), or null if unavailable.
 */
async function smGetProbs(homeTeam, awayTeam, sport = SM_SPORT) {
  try {
    const games = await _smFetch(
      `/v4/sports/${sport}/odds/?regions=uk&markets=h2h&oddsFormat=decimal`
    );
    const game = _smFindGame(games, homeTeam, awayTeam);
    if (!game) {
      console.warn('[OA] Game not found in odds list:', homeTeam, 'vs', awayTeam);
      return null;
    }

    // Prefer well-known/sharp bookmakers for accuracy
    const PREF = ['pinnacle', 'betfair_ex_uk', 'bet365', 'williamhill', 'unibet', 'betway', 'onexbet'];
    const bks = [...(game.bookmakers ?? [])];
    bks.sort((a, b) => {
      const ai = PREF.indexOf(a.key ?? '');
      const bi = PREF.indexOf(b.key ?? '');
      return (ai < 0 ? 99 : ai) - (bi < 0 ? 99 : bi);
    });

    const market = bks[0]?.markets?.find(m => m.key === 'h2h');
    if (!market) {
      console.warn('[OA] No h2h market found for', homeTeam, 'vs', awayTeam);
      return null;
    }

    const outcomes = market.outcomes ?? [];
    // Match outcomes by exact team name from the game object
    const homeOut = outcomes.find(o => o.name === game.home_team);
    const awayOut = outcomes.find(o => o.name === game.away_team);
    const drawOut = outcomes.find(o => o.name === 'Draw');

    if (!homeOut || !awayOut) {
      console.warn('[OA] Could not match outcomes:', outcomes.map(o => o.name), '|', game.home_team, game.away_team);
      return null;
    }

    const h = homeOut.price, a = awayOut.price, d = drawOut?.price ?? null;
    const probs = smOddsToProbs(h, d, a);
    console.log(`[OA] ${homeTeam} vs ${awayTeam}: H=${h} D=${d} A=${a} →`, smRound(probs));
    return probs;

  } catch(e) {
    console.warn('[OA] getProbs error:', e.message);
    return null;
  }
}

// ── LIVE SCORE DATA ───────────────────────────────────────────────────────

/**
 * Fetch live/recent score data for a fixture (by team names).
 * Returns the Odds API game object, or null if not found.
 */
async function smGetLive(homeTeam, awayTeam, sport = SM_SPORT) {
  try {
    const games = await _smFetch(`/v4/sports/${sport}/scores/?daysFrom=1`);
    return _smFindGame(games, homeTeam, awayTeam);
  } catch(e) {
    console.warn('[OA] getLive error:', e.message);
    return null;
  }
}

/**
 * Parse score out of an Odds API scores object.
 * Returns { home, away } as integers.
 */
function smParseScore(game) {
  if (!game?.scores?.length) return { home: 0, away: 0 };
  const hEntry = (game.scores ?? []).find(s =>
    s.name.toLowerCase() === (game.home_team ?? '').toLowerCase()
  );
  const aEntry = (game.scores ?? []).find(s =>
    s.name.toLowerCase() === (game.away_team ?? '').toLowerCase()
  );
  return {
    home: parseInt(hEntry?.score ?? 0) || 0,
    away: parseInt(aEntry?.score ?? 0) || 0,
  };
}

/**
 * Parse match state from an Odds API scores object.
 * Returns: 'pre' | 'live' | 'finished'
 * Note: The Odds API does not distinguish HT — use the simulated clock for that.
 */
function smParseState(game) {
  if (!game) return 'pre';
  if (game.completed) return 'finished';
  const now = Date.now();
  const kick = new Date(game.commence_time).getTime();
  if (now < kick) return 'pre';
  // OA only populates scores[] when a game is in-progress or finished
  if (game.scores?.length) return 'live';
  return 'pre';
}

/**
 * The Odds API does not provide match events (goals, cards, etc.).
 * Returns empty array so caller code doesn't break.
 */
function smParseEvents(_game) {
  return [];
}

// ── LIVE POLLING ──────────────────────────────────────────────────────────

/**
 * Poll live scores every intervalMs milliseconds.
 * Calls onUpdate(gameData) on each successful tick.
 * Returns a stop() function to cancel polling.
 */
function smStartPoll(homeTeam, awayTeam, onUpdate, intervalMs = 30000, sport = SM_SPORT) {
  let active = true;
  const tick = async () => {
    if (!active) return;
    const data = await smGetLive(homeTeam, awayTeam, sport);
    if (data) onUpdate(data);
    if (active) setTimeout(tick, intervalMs);
  };
  tick(); // immediate first call
  return () => { active = false; };
}

// ── FIXTURE LOOKUP (for sm-lookup.html) ───────────────────────────────────

/**
 * Fetch all upcoming EPL games with odds (for the lookup tool).
 * Returns the raw Odds API response array.
 */
async function smGetUpcomingGames() {
  try {
    return await _smFetch(
      `/v4/sports/${SM_SPORT}/odds/?regions=uk&markets=h2h&oddsFormat=decimal`
    );
  } catch(e) {
    console.warn('[OA] getUpcomingGames error:', e.message);
    return [];
  }
}
