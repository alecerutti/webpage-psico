// Prova 7 · Fogli di carta: i fogli si posano quando entrano nello schermo; su telefono le
// illustrazioni delle card si animano all'ingresso
(() => {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) return;

  const sheets = [...document.querySelectorAll('main > .section, .footer')];
  sheets.forEach((s) => s.classList.add('foglio-in-arrivo'));
  const settle = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.classList.remove('foglio-in-arrivo');
      settle.unobserve(e.target);
    });
  }, { threshold: 0.08 });
  sheets.forEach((s) => settle.observe(s));

  const cards = new IntersectionObserver((entries) => {
    entries.forEach((e) => e.target.classList.toggle('anima', e.isIntersecting));
  }, { threshold: 0.6 });
  document.querySelectorAll('.area').forEach((a) => cards.observe(a));
})();
