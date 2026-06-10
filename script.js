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
        <div class="logo"><div class="logo-dot"></div>Skedee</div>
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
