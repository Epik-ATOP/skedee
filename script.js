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
