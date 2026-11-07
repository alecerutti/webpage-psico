// Prova 9 · Griglia a vista: apertura a celle e foto che si compongono a tessere
(() => {
  // Copia un'illustrazione rendendo unici gli id interni (la maschera della coppa), altrimenti
  // i riferimenti url(#...) punterebbero all'originale o a copie nascoste
  const cloneSvg = (svg) => {
    const c = svg.cloneNode(true);
    c.querySelectorAll('[id]').forEach((el) => {
      const old = el.id;
      el.id = `${old}-${Math.random().toString(36).slice(2, 8)}`;
      c.querySelectorAll(`[mask="url(#${old})"]`).forEach((m) => m.setAttribute('mask', `url(#${el.id})`));
    });
    return c;
  };
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Apertura: ricompone nome, qualifica e recapiti in un mosaico di celle con le illustrazioni delle aree
  const inner = document.querySelector('.hero__inner');
  const name = inner.querySelector('.name');
  const role = inner.querySelector('.role');
  const who = inner.querySelector('.hero__who');
  const contacts = inner.querySelector('.hero__contacts');
  const art = [...document.querySelectorAll('.area')].map((a) => {
    const cell = document.createElement('div');
    cell.className = `bento__arte ${[...a.classList].find((c) => c.startsWith('tone-'))}`;
    cell.setAttribute('aria-hidden', 'true');
    cell.append(cloneSvg(a.querySelector('.area__cover svg')));
    return cell;
  });
  const cell = (cls, ...children) => {
    const el = document.createElement('div');
    el.className = cls;
    el.append(...children);
    return el;
  };
  const bento = cell('bento',
    cell('bento__nome', name), art[0], art[1],
    cell('bento__testo', role, who), cell('bento__recapiti', contacts), art[2]);
  inner.replaceChildren(bento);

  // Foto: una griglia di tessere color carta che sparisce in ordine sparso quando la foto entra nello schermo
  if (reduce) return;
  const cover = (host, target, cols, rows) => {
    host.classList.add('tessere-host');
    const t = document.createElement('div');
    t.className = 'tessere';
    t.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
    t.style.gridTemplateRows = `repeat(${rows}, 1fr)`;
    for (let i = 0; i < cols * rows; i++) {
      const tile = document.createElement('i');
      tile.style.transitionDelay = `${Math.round(Math.random() * 900)}ms`;
      t.append(tile);
    }
    const fit = () => { t.style.height = `${target.offsetHeight}px`; };
    fit();
    window.addEventListener('resize', fit);
    host.append(t);
    new IntersectionObserver(([e], obs) => {
      if (!e.isIntersecting) return;
      t.classList.add('via');
      obs.disconnect();
    }, { threshold: 0.35 }).observe(target);
  };
  const portrait = document.querySelector('.portrait');
  cover(portrait, portrait.querySelector('img'), 6, 8);
  const gallery = document.querySelector('.gallery');
  cover(gallery, document.getElementById('gallery-track'), 9, 6);
})();
