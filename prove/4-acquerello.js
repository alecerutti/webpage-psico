// Prova 4 · Acquerello simulato: macchie con bordo irregolare (spostamento da rumore),
// pigmento non uniforme (maschera di rumore) e bordo più scuro (tratto sfumato)
(() => {
  // Generatore pseudo-casuale con seme, così le macchie sono sempre uguali
  const rng = (seed) => () => ((seed = (seed * 16807) % 2147483647) / 2147483647);

  // Contorno morbido attorno a un'ellisse, con raggio che varia: curva chiusa Catmull-Rom → Bézier
  const blob = (cx, cy, rx, ry, seed, n = 9, jitter = 0.22) => {
    const r = rng(seed);
    const pts = Array.from({ length: n }, (_, i) => {
      const a = (i / n) * Math.PI * 2;
      const k = 1 - jitter + r() * jitter * 2;
      return [cx + Math.cos(a) * rx * k, cy + Math.sin(a) * ry * k];
    });
    let d = `M${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
    for (let i = 0; i < n; i++) {
      const [p0, p1, p2, p3] = [pts[(i - 1 + n) % n], pts[i], pts[(i + 1) % n], pts[(i + 2) % n]];
      const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
      const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
      d += ` C${c1.map((v) => v.toFixed(1)).join(' ')} ${c2.map((v) => v.toFixed(1)).join(' ')} ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
    }
    return `${d}Z`;
  };

  const svgFor = (id, seed, [c1, c2]) => `
    <svg viewBox="0 0 1000 600" preserveAspectRatio="none">
      <defs>
        <filter id="${id}" x="-15%" y="-15%" width="130%" height="130%">
          <feTurbulence type="fractalNoise" baseFrequency="0.009" numOctaves="3" seed="${seed}" result="forma"/>
          <feDisplacementMap in="SourceGraphic" in2="forma" scale="70" xChannelSelector="R" yChannelSelector="G" result="mossa"/>
          <feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="2" seed="${seed + 1}" result="pigmento"/>
          <feColorMatrix in="pigmento" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -1 1.1" result="maschera"/>
          <feComposite in="mossa" in2="maschera" operator="in" result="steso"/>
          <feGaussianBlur in="steso" stdDeviation="1.2"/>
        </filter>
      </defs>
      <g filter="url(#${id})">
        <path d="${blob(470, 300, 420, 230, seed)}" fill="${c1}" fill-opacity=".5" stroke="${c1}" stroke-opacity=".9" stroke-width="4"/>
        <path d="${blob(560, 330, 330, 190, seed + 7)}" fill="${c2}" fill-opacity=".45" stroke="${c2}" stroke-opacity=".8" stroke-width="3"/>
      </g>
    </svg>`;

  // [sezione, posizione e misura, colori, seme]
  const WASHES = [
    ['.hero', 'left:-6vw; top:-3rem; width:min(80rem,96vw); height:calc(100% + 5rem);', ['#E2A58C', '#ECC2AE'], 3],
    ['#chi-sono', 'left:-8vw; top:12%; width:min(38rem,62vw); height:72%;', ['#E3C2B8', '#EDD3CB'], 17],
    ['#come-e-dove', 'right:-8vw; top:2rem; width:min(84rem,104vw); height:90%;', ['#E6BC8A', '#EFD0A8'], 29],
    ['#contatti', 'left:-6vw; top:-1rem; width:min(46rem,70vw); height:80%;', ['#D3BACA', '#E2D0DB'], 41],
  ];

  WASHES.forEach(([selector, position, colors, seed], i) => {
    const host = document.querySelector(selector);
    if (!host) return;
    const el = document.createElement('div');
    el.className = 'wash';
    el.setAttribute('aria-hidden', 'true');
    el.style.cssText = position;
    el.innerHTML = svgFor(`acquerello-${i}`, seed, colors);
    host.prepend(el);
  });
})();
