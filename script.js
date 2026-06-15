function addAmount(n) {
  const el = document.getElementById('op-amount');
  if (!el) return;
  el.value = Math.min((parseFloat(el.value) || 0) + n, 9999999);
  if (typeof updateOrderSummary === 'function') updateOrderSummary();
}

function syncThemeIcon() {
  const isDark = document.body.getAttribute('data-theme') !== 'light';
  const icon = isDark ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
  const el = document.getElementById('theme-icon');
  const elM = document.getElementById('theme-icon-mobile');
  if (el) el.className = icon;
  if (elM) elM.className = icon;
}

function applySystemTheme() {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  document.body.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
  syncThemeIcon();
}

function toggleTheme() {
  const isDark = document.body.getAttribute('data-theme') !== 'light';
  document.body.setAttribute('data-theme', isDark ? 'light' : 'dark');
  syncThemeIcon();
}

applySystemTheme();
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', applySystemTheme);

function toggleNotif() {
  document.getElementById('notif-dd')?.classList.toggle('open');
  document.getElementById('profile-dd')?.classList.remove('open');
}

function toggleProfile() {
  document.getElementById('profile-dd')?.classList.toggle('open');
  document.getElementById('notif-dd')?.classList.remove('open');
}

document.addEventListener('click', e => {
  if (!e.target.closest('.btn-icon') && !e.target.closest('.notif-dropdown'))
    document.getElementById('notif-dd')?.classList.remove('open');
  if (!e.target.closest('.avatar') && !e.target.closest('.profile-dropdown'))
    document.getElementById('profile-dd')?.classList.remove('open');
});

(function() {
  const obs = new IntersectionObserver(entries => entries.forEach(e => {
    if (e.isIntersecting) e.target.classList.add('visible');
  }), { threshold: 0.08 });
  document.querySelectorAll('.fade-up').forEach(el => obs.observe(el));
})();

// ── MORE DRAWER ───────────────────────────────────────────────────────────────
(function() {
  const r = window.location.pathname.includes('/markets/') ? '../' : '';
  document.body.insertAdjacentHTML('beforeend', `
    <div class="more-overlay" id="more-overlay"></div>
    <div class="more-drawer" id="more-drawer">
      <div class="more-drawer-header">
        <div class="more-drawer-brand"><div class="more-drawer-brand-dot"></div>Skedee</div>
      </div>
      <div class="more-drawer-nav">
        <a href="${r}index.html"   class="more-drawer-link"><i class="fa-solid fa-chart-line"></i>Markets</a>
        <a href="${r}search.html"  class="more-drawer-link"><i class="fa-solid fa-magnifying-glass"></i>Search Markets</a>
        <a href="${r}about.html"   class="more-drawer-link"><i class="fa-solid fa-circle-info"></i>About</a>
        <a href="${r}faq.html"     class="more-drawer-link"><i class="fa-solid fa-circle-question"></i>FAQ</a>
        <a href="${r}terms.html"   class="more-drawer-link"><i class="fa-solid fa-file-lines"></i>Terms of Service</a>
        <a href="${r}policy.html"  class="more-drawer-link"><i class="fa-solid fa-shield-halved"></i>Privacy Policy</a>
      </div>
      <div class="more-drawer-footer">
        <a href="${r}signup.html" class="more-drawer-signup">Sign Up</a>
        <a href="${r}login.html"  class="more-drawer-login">Login</a>
      </div>
    </div>`);
  document.getElementById('more-overlay').addEventListener('click', closeMoreDrawer);
})();

function openMoreDrawer() {
  document.getElementById('more-overlay').classList.add('open');
  document.getElementById('more-drawer').classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeMoreDrawer() {
  document.getElementById('more-overlay').classList.remove('open');
  document.getElementById('more-drawer').classList.remove('open');
  document.body.style.overflow = '';
}

// ── FLOATING TRADE NUMBERS ────────────────────────────────────────────────────
(function() {
  if (!window.location.pathname.includes('/markets/')) return;

  const CSS = `
#float-container{position:fixed;right:0;bottom:60px;width:280px;height:380px;pointer-events:none;z-index:90;overflow:hidden;}
.float-num{position:absolute;bottom:0;font-family:'Space Mono',monospace;font-size:12px;font-weight:700;white-space:nowrap;animation:floatUp var(--dur,2.4s) ease-out forwards;}
.float-num.buy{color:#22C55E;}.float-num.sell{color:#EF4444;}
@keyframes floatUp{0%{opacity:0;transform:translateY(0)}12%{opacity:1}75%{opacity:.85}100%{opacity:0;transform:translateY(-340px)}}
@media(max-width:900px){#float-container{display:none;}}`;

  const AMOUNTS = [100,200,300,400,500,600,700,800,900,1000,2000,3000,4000,5000,6000,7000,8000,9000,10000,11000,12000,13000,14000,15000,16000,17000,18000,19000,20000,21000,22000,23000,24000,25000,26000,27000,28000,29000,30000,31000,32000,33000,34000,35000,36000,37000,38000,39000,40000,1100,1200,1600,2400,3200,4800,6400,8800,12000,16000,24000,36000,48000,88000,99000,100000,124000,67000,91200];

  function fmt(n) {
    if (n >= 1000000) return '₦' + (n / 1000000).toFixed(1) + 'M';
    if (n >= 10000)   return '₦' + Math.round(n / 1000) + 'K';
    if (n >= 1000)    return '₦' + (n / 1000).toFixed(1) + 'K';
    return '₦' + n;
  }

  function isClosed() {
    return window.matchDone === true ||
           window.MARKET_CLOSED === true ||
           !!(document.querySelector('.kickoff-title')?.textContent.trim().startsWith('✓')) ||
           !!(document.querySelector('#match-status')?.textContent.includes('FULL TIME')) ||
           !!(document.querySelector('#sentiment-live-tag')?.textContent.includes('SETTLED'));
  }

  function spawn(container) {
    if (isClosed()) return;
    const isBuy = Math.random() > 0.38;
    const amount = AMOUNTS[Math.floor(Math.random() * AMOUNTS.length)];
    const el = document.createElement('span');
    el.className = 'float-num ' + (isBuy ? 'buy' : 'sell');
    el.textContent = (isBuy ? '+' : '−') + fmt(amount);
    el.style.left = Math.floor(Math.random() * 55 + 10) + '%';
    el.style.setProperty('--dur', (2.0 + Math.random() * 1.4).toFixed(2) + 's');
    container.appendChild(el);
    el.addEventListener('animationend', () => el.remove(), { once: true });
    setTimeout(() => spawn(container), 700 + Math.random() * 2000);
  }

  // Wait for page-specific scripts to run (they set matchDone, MARKET_CLOSED, window.OVER_GOALS, etc.)
  setTimeout(function() {
    if (isClosed()) return;

    const style = document.createElement('style');
    style.textContent = CSS;
    document.head.appendChild(style);

    const container = document.createElement('div');
    container.id = 'float-container';
    document.body.appendChild(container);

    setTimeout(() => spawn(container), 1200);
  }, 300);
})();

// ── OVER GOALS CARD ──────────────────────────────────────────────────────────
let ogIdx = 2;

function ogRender() {
  if (!window.OVER_GOALS) return;
  const item = window.OVER_GOALS[ogIdx];
  const ge = id => document.getElementById(id);
  if (ge('og-thresh-label')) ge('og-thresh-label').textContent = item.t.toFixed(1);
  const probEl = ge('og-prob');
  if (probEl) {
    probEl.textContent = item.p + '%';
    probEl.style.color = window.OG_SETTLED ? (item.p >= 99 ? '#22C55E' : '#EF4444') : '';
  }
  const deltaEl = ge('og-delta');
  if (deltaEl) {
    deltaEl.style.display = window.OG_SETTLED ? 'none' : '';
    if (!window.OG_SETTLED && item.d !== undefined) {
      deltaEl.textContent = (item.d >= 0 ? '▲ ' : '▼ ') + Math.abs(item.d);
      deltaEl.className = 'og-delta ' + (item.d >= 0 ? 'up' : 'down');
    }
  }
  const bY = ge('og-btn-yes'), bN = ge('og-btn-no');
  if (bY) bY.textContent = 'YES ₦' + item.p;
  if (bN) bN.textContent = 'NO ₦' + (100 - item.p);
  document.querySelectorAll('.og-thresh').forEach((el, i) => el.classList.toggle('active', i === ogIdx));
  if (ge('og-prev')) ge('og-prev').disabled = ogIdx === 0;
  if (ge('og-next')) ge('og-next').disabled = ogIdx === window.OVER_GOALS.length - 1;
}

function ogMove(dir) {
  if (!window.OVER_GOALS) return;
  const n = ogIdx + dir;
  if (n < 0 || n >= window.OVER_GOALS.length) return;
  ogIdx = n; ogRender();
}

function ogSelect(i) { ogIdx = i; ogRender(); }

function ogBuyYes() {
  if (!window.OVER_GOALS || window.OG_SETTLED) return;
  const {t, p} = window.OVER_GOALS[ogIdx];
  openOrder('Over ' + t.toFixed(1) + ' Goals', 'YES', p);
}

function ogBuyNo() {
  if (!window.OVER_GOALS || window.OG_SETTLED) return;
  const {t, p} = window.OVER_GOALS[ogIdx];
  openOrder('Over ' + t.toFixed(1) + ' Goals', 'NO', 100 - p);
}

function ogDrift() {
  if (!window.OVER_GOALS || window.OG_SETTLED) return;
  window.OVER_GOALS.forEach(item => {
    item.p = Math.max(2, Math.min(98, item.p + Math.round((Math.random() - 0.5) * 2)));
  });
  ogRender();
}

function ogUpdate(totalGoals, minute) {
  if (!window.OVER_GOALS || window.OG_SETTLED) return;
  const lambda = Math.max(0, (90 - minute) / 90) * 2.8;
  window.OVER_GOALS.forEach(item => {
    const need = Math.ceil(item.t + 0.5) - totalGoals;
    if (need <= 0) { item.p = 99; return; }
    let under = 0, term = Math.exp(-lambda);
    under += term;
    for (let k = 1; k < need; k++) { term *= lambda / k; under += term; }
    item.p = Math.max(1, Math.min(98, Math.round((1 - under) * 97)));
  });
  ogRender();
}

function ogSettle(totalGoals) {
  if (!window.OVER_GOALS) return;
  window.OG_SETTLED = true;
  window.OVER_GOALS.forEach(item => { item.p = totalGoals > item.t ? 100 : 0; item.d = 0; });
  const card = document.getElementById('og-card');
  if (card) card.classList.add('settled');
  ogRender();
}

function initOg() {
  const wrap = document.getElementById('og-thresholds');
  if (!wrap || !window.OVER_GOALS) return;
  wrap.innerHTML = '';
  window.OVER_GOALS.forEach((item, i) => {
    const el = document.createElement('span');
    el.className = 'og-thresh' + (i === ogIdx ? ' active' : '');
    el.textContent = item.t.toFixed(1);
    el.onclick = () => ogSelect(i);
    wrap.appendChild(el);
  });
  if (window.OG_SETTLED) {
    const card = document.getElementById('og-card');
    if (card) card.classList.add('settled');
  }
  ogRender();
}

setInterval(ogDrift, 4000);

// Auto-update OG card from live score changes (MutationObserver)
(function() {
  const scoreEl = document.getElementById('score-display');
  if (!scoreEl) return;
  const clockEl = document.getElementById('clock-display');
  new MutationObserver(function() {
    if (!window.OVER_GOALS || window.OG_SETTLED) return;
    const m = scoreEl.textContent.trim().match(/(\d+)\s*[—–\-]\s*(\d+)/);
    if (!m) return;
    const total = +m[1] + +m[2];
    const ct = (clockEl ? clockEl.textContent : '').trim();
    if (ct === 'FT') { ogSettle(total); }
    else { const min = ct.match(/^(\d+)/); if (min) ogUpdate(total, +min[1]); }
  }).observe(scoreEl, { childList: true, subtree: true, characterData: true });
})();

// Auto-sync live-dot / live-label from status pill + clock changes
(function() {
  const dotEl   = document.getElementById('live-dot');
  const labelEl = document.getElementById('live-label');
  if (!dotEl || !labelEl) return;
  const statusEl = document.getElementById('match-status');
  const clockEl  = document.getElementById('clock-display');
  function sync() {
    const status = statusEl ? statusEl.textContent.trim() : '';
    const clock  = clockEl  ? clockEl.textContent.trim()  : '';
    if (status.includes('FULL TIME') || clock === 'FT') {
      dotEl.style.cssText = 'background:var(--green);animation:none;width:7px;height:7px;border-radius:50%;';
      labelEl.textContent = 'FULL TIME';
      labelEl.style.color = 'var(--green)';
    } else if (clock === 'HT') {
      dotEl.style.cssText = 'background:var(--y);animation:none;width:7px;height:7px;border-radius:50%;';
      labelEl.textContent = 'HALF TIME';
      labelEl.style.color = 'var(--y)';
    } else if (status.includes('LIVE')) {
      dotEl.style.cssText = 'background:var(--red);animation:pulse-dot 1.5s ease-in-out infinite;width:7px;height:7px;border-radius:50%;';
      labelEl.textContent = 'LIVE';
      labelEl.style.color = 'var(--red)';
    }
  }
  const obs = new MutationObserver(sync);
  if (statusEl) obs.observe(statusEl, { childList: true, subtree: true, characterData: true });
  if (clockEl)  obs.observe(clockEl,  { childList: true, subtree: true, characterData: true });
})();

// Volume ticker — slowly increments match vol by ₦1k–₦20k every ~5s
(function() {
  const meta = document.querySelector('.match-meta');
  if (!meta) return;
  let volEl = null;
  for (const s of meta.querySelectorAll('span')) {
    if (s.textContent.includes('vol')) { volEl = s; break; }
  }
  if (!volEl) return;
  let vol = parseInt(volEl.textContent.replace(/[^\d]/g, '')) || 0;
  if (!vol) return;
  function tick() {
    vol += Math.floor(Math.random() * 19001) + 1000;
    volEl.textContent = '₦' + vol.toLocaleString('en-US') + ' vol';
    setTimeout(tick, 4000 + Math.random() * 3000);
  }
  setTimeout(tick, 4000 + Math.random() * 3000);
})();
