// Prova 11 · Indice: voci enormi con anteprima che segue il mouse e disco-cursore
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
  const coverOf = (i) => document.querySelectorAll('.area__cover svg')[i];
  const art = (i, tone) => {
    const d = document.createElement('div');
    d.className = `arte ${tone}`;
    d.append(cloneSvg(coverOf(i)));
    return d;
  };
  const img = (src) => { const el = new Image(); el.src = src; el.alt = ''; return el; };

  const VOCI = [
    ['#chi-sono', 'Chi sono', 'Formazione e modo di lavorare', () => img(document.querySelector('.portrait img').src)],
    ['#aree', 'Aree di intervento', 'Preadolescenti, adolescenti, giovani adulti, genitori', () => art(0, 'tone-rose')],
    ['#come-e-dove', 'Come e dove', 'Sedute, onorari, lo studio', () => img(document.querySelector('#gallery-track img').src)],
    ['#contatti', 'Contatti', 'Telefono, email, modulo', () => art(2, 'tone-mauve')],
  ];

  const list = document.createElement('ol');
  list.className = 'indice';
  const preview = document.createElement('div');
  preview.className = 'anteprima';
  preview.setAttribute('aria-hidden', 'true');

  VOCI.forEach(([href, title, note, media], i) => {
    const li = document.createElement('li');
    li.innerHTML = `<a href="${href}"><span class="indice__titolo">${title}</span><span class="indice__nota">${note}</span><span class="indice__mini" aria-hidden="true"></span></a>`;
    li.querySelector('.indice__mini').append(media());
    const m = media();
    m.dataset.i = i;
    preview.append(m);
    li.querySelector('a').dataset.i = i;
    list.append(li);
  });
  document.querySelector('.hero > .wrap').append(list);
  document.body.append(preview);

  // Anteprima e disco seguono il mouse con un leggero ritardo (interpolazione)
  if (!window.matchMedia('(hover: hover)').matches || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const dot = document.createElement('div');
  dot.className = 'cursore';
  dot.setAttribute('aria-hidden', 'true');
  document.body.append(dot);

  let mx = innerWidth / 2, my = innerHeight / 2, px = mx, py = my, dx = mx, dy = my;
  window.addEventListener('mousemove', (e) => { mx = e.clientX; my = e.clientY; }, { passive: true });
  const loop = () => {
    px += (mx - px) * 0.12; py += (my - py) * 0.12;
    dx += (mx - dx) * 0.35; dy += (my - dy) * 0.35;
    preview.style.left = `${px}px`; preview.style.top = `${py}px`;
    dot.style.transform = `translate(${dx}px, ${dy}px)`;
    requestAnimationFrame(loop);
  };
  loop();

  list.querySelectorAll('a').forEach((a) => {
    a.addEventListener('mouseenter', () => {
      preview.querySelectorAll('[data-i]').forEach((m) => m.classList.toggle('on', m.dataset.i === a.dataset.i));
      preview.classList.add('on');
    });
    a.addEventListener('mouseleave', () => preview.classList.remove('on'));
  });
  document.addEventListener('mouseover', (e) => dot.classList.toggle('grande', !!e.target.closest('a, button, input, textarea, label')));
})();
