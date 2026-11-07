// Prova 3 · Tinta che cambia scorrendo: interpola il colore di fondo tra le tinte delle sezioni
(() => {
  // [id della sezione, tinta]: tutte chiare e di luminosità simile
  const STOPS = [
    ['top', '#F3DED2'],          // cipria
    ['chi-sono', '#F7F0E6'],     // crema
    ['aree', '#F6E5DE'],         // rosa chiarissimo
    ['come-e-dove', '#F2E2CB'],  // albicocca
    ['contatti', '#EEE4EC'],     // lilla
  ];
  const toRgb = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
  const colors = STOPS.map(([, c]) => toRgb(c));
  const sections = STOPS.map(([id]) => document.getElementById(id));
  const root = document.documentElement;
  const smooth = (t) => t * t * (3 - 2 * t);

  let ticking = false;
  const update = () => {
    const vh = window.innerHeight;
    const probe = window.scrollY + vh * 0.55;
    const tops = sections.map((s) => s.getBoundingClientRect().top + window.scrollY);
    let i = 0;
    while (i < tops.length - 1 && probe >= tops[i + 1]) i++;
    let rgb = colors[i];
    if (i < tops.length - 1) {
      // il passaggio avviene nell'ultimo tratto prima della sezione successiva
      const start = tops[i + 1] - vh * 0.6;
      const t = Math.min(1, Math.max(0, (probe - start) / (tops[i + 1] - start)));
      rgb = colors[i].map((v, k) => Math.round(v + (colors[i + 1][k] - v) * smooth(t)));
    }
    root.style.setProperty('--page', `rgb(${rgb.join(' ')})`);
    ticking = false;
  };
  window.addEventListener('scroll', () => {
    if (!ticking) { ticking = true; requestAnimationFrame(update); }
  }, { passive: true });
  window.addEventListener('resize', update);
  update();
})();
