function toggleTheme() {
  const isDark = document.body.getAttribute('data-theme') !== 'light';
  document.body.setAttribute('data-theme', isDark ? 'light' : 'dark');
  const icon = isDark ? 'fa-solid fa-moon' : 'fa-solid fa-sun';
  const el = document.getElementById('theme-icon');
  const elM = document.getElementById('theme-icon-mobile');
  if (el) el.className = icon;
  if (elM) elM.className = icon;
}

(function() {
  const obs = new IntersectionObserver(entries => entries.forEach(e => {
    if (e.isIntersecting) e.target.classList.add('visible');
  }), { threshold: 0.08 });
  document.querySelectorAll('.fade-up').forEach(el => obs.observe(el));
})();
