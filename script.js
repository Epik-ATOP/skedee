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

  // Wait for page-specific scripts to run (they set matchDone, MARKET_CLOSED, etc.)
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
