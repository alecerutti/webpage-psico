// Prova 2 · Grandi ritagli tono su tono: crea le forme e le sposta appena allo scorrimento (parallasse)
(() => {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const SHAPES = {
    sole: '<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="50"/></svg>',
    arco: '<svg viewBox="0 0 100 150"><path d="M0 150V50A50 50 0 0 1 100 50V150Z"/></svg>',
    foglia: '<svg viewBox="0 0 100 100"><path d="M4 96C8 46 46 8 96 4C92 54 54 92 4 96Z"/></svg>',
    coppa: '<svg viewBox="0 0 100 100"><path d="M0 40A50 50 0 0 0 100 40A60 60 0 0 1 0 40Z"/></svg>',
  };

  // [sezione, forma, colore, posizione, velocità parallasse, rotazione]
  const PIECES = [
    ['.hero', 'sole', 'var(--t-peach)', 'width:clamp(16rem,38vw,34rem); right:-9vw; top:-8vw;', -0.08, 0],
    ['#chi-sono', 'arco', 'var(--t-rose)', 'width:clamp(9rem,20vw,19rem); left:-6vw; bottom:-16vw;', 0.1, -10],
    ['#aree', 'foglia', 'var(--t-sand)', 'width:clamp(14rem,30vw,28rem); right:-10vw; bottom:-14vw;', 0.12, 8],
    ['#come-e-dove', 'coppa', 'var(--t-mauve)', 'width:clamp(14rem,34vw,32rem); left:-12vw; bottom:-6vw;', 0.07, 14],
    ['#contatti', 'sole', 'var(--t-rose)', 'width:clamp(5rem,11vw,10rem); right:3vw; top:3rem;', -0.12, 0],
  ];

  const cuts = [];
  for (const [selector, shape, color, position, speed, rot] of PIECES) {
    const host = document.querySelector(selector);
    if (!host) continue;
    const el = document.createElement('div');
    el.className = 'cut';
    el.setAttribute('aria-hidden', 'true');
    el.style.cssText = `${position}--c:${color};--rot:${rot}deg;`;
    el.innerHTML = SHAPES[shape];
    host.prepend(el);
    cuts.push({ el, speed });
  }
  if (reduce) return;

  let ticking = false;
  const update = () => {
    const mid = window.innerHeight / 2;
    for (const { el, speed } of cuts) {
      const r = el.parentElement.getBoundingClientRect();
      el.style.transform = `translate3d(0, ${((r.top + r.height / 2 - mid) * speed).toFixed(1)}px, 0)`;
    }
    ticking = false;
  };
  window.addEventListener('scroll', () => {
    if (!ticking) { ticking = true; requestAnimationFrame(update); }
  }, { passive: true });
  window.addEventListener('resize', update);
  update();
})();
