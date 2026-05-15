function toggleTheme() {
  const isDark = document.body.getAttribute('data-theme') !== 'light';
  document.body.setAttribute('data-theme', isDark ? 'light' : 'dark');
  document.getElementById('theme-icon').className = isDark ? 'fa-solid fa-moon' : 'fa-solid fa-sun';
}

(function() {
  const obs = new IntersectionObserver(entries => entries.forEach(e => {
    if (e.isIntersecting) e.target.classList.add('visible');
  }), { threshold: 0.08 });
  document.querySelectorAll('.fade-up').forEach(el => obs.observe(el));
})();
