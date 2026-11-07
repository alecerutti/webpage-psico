(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  // Barra in alto: finché si vede l'apertura ha il suo colore; quando l'apertura passa sotto la barra
  // diventa crema e mostra il nome
  const bar = document.getElementById('bar');
  const hero = document.querySelector('.hero');
  new IntersectionObserver(([entry]) => {
    bar.classList.toggle('is-stuck', !entry.isIntersecting);
  }, { rootMargin: `-${bar.offsetHeight}px 0px 0px 0px` }).observe(hero);

  // Voce attiva della barra in base alla sezione al centro dello schermo
  const links = [...bar.querySelectorAll('.nav a')];
  const linkFor = new Map(links.map((a) => [a.hash.slice(1), a]));
  const spy = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      links.forEach((a) => a.removeAttribute('aria-current'));
      linkFor.get(entry.target.id)?.setAttribute('aria-current', 'true');
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  linkFor.forEach((_, id) => {
    const section = document.getElementById(id);
    if (section) spy.observe(section);
  });
  spy.observe(hero); // sull'apertura nessuna voce è attiva

  // Foto dello studio: si scorrono con il dito (scroll-snap) o con le frecce; senza JS resta lo scorrimento
  const track = document.getElementById('gallery-track');
  const controls = document.getElementById('gallery-controls');
  const count = document.getElementById('gallery-count');
  const [prev, next] = controls.querySelectorAll('.gallery__btn');
  const total = track.children.length;

  const current = () => Math.round(track.scrollLeft / track.clientWidth);
  const goTo = (i) => track.scrollTo({
    left: i * track.clientWidth,
    behavior: reduceMotion.matches ? 'auto' : 'smooth',
  });
  const update = () => {
    const i = current();
    count.textContent = `${i + 1} / ${total}`;
    prev.disabled = i <= 0;
    next.disabled = i >= total - 1;
  };

  prev.addEventListener('click', () => goTo(current() - 1));
  next.addEventListener('click', () => goTo(current() + 1));
  track.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  controls.hidden = total < 2;
  update();

  // Apertura: "mobile" di ritagli di carta. Ogni ritaglio ha una profondità (data-d): seguendo il
  // mouse, i più vicini si spostano e ruotano di più, con inerzia, come carta mossa da un respiro.
  // Senza mouse (telefono) fluttuano lentissimi; con "riduci movimento" restano fermi; il calcolo
  // si ferma quando l'apertura non è visibile.
  const pieces = [...hero.querySelectorAll('.ritaglio')].map((el, i) => ({
    el, depth: Number(el.dataset.d) || 0.5, baseRot: Number(el.dataset.r) || 0,
    phase: i * 1.9, x: 0, y: 0, rot: 0,
  }));
  const place = (p, x, y, rot) => {
    p.el.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0) rotate(${(p.baseRot + rot).toFixed(2)}deg)`;
  };
  if (reduceMotion.matches) {
    pieces.forEach((p) => place(p, 0, 0, 0));
  } else if (pieces.length) {
    let targetX = 0, targetY = 0, heroVisible = true, frame = 0;
    hero.addEventListener('pointermove', (e) => {
      if (e.pointerType !== 'mouse') return;
      const r = hero.getBoundingClientRect();
      targetX = ((e.clientX - r.left) / r.width - 0.5) * 2;
      targetY = ((e.clientY - r.top) / r.height - 0.5) * 2;
    });
    hero.addEventListener('pointerleave', () => { targetX = 0; targetY = 0; });

    const animate = (t) => {
      frame = 0;
      if (!heroVisible) return;
      for (const p of pieces) {
        p.x += (-targetX * p.depth * 42 - p.x) * 0.045;
        p.y += (-targetY * p.depth * 30 - p.y) * 0.045;
        p.rot += (targetX * p.depth * 9 - p.rot) * 0.04;
        const driftX = Math.sin(t / 2700 + p.phase) * 5 * p.depth;
        const driftY = Math.cos(t / 3300 + p.phase) * 7 * p.depth;
        const sway = Math.sin(t / 4100 + p.phase) * 2;
        place(p, p.x + driftX, p.y + driftY, p.rot + sway);
      }
      frame = requestAnimationFrame(animate);
    };
    new IntersectionObserver(([entry]) => {
      heroVisible = entry.isIntersecting;
      if (heroVisible && !frame) frame = requestAnimationFrame(animate);
    }).observe(hero);
  }

  // Modulo dimostrativo: la validazione è quella nativa del browser (required/type), quindi submit
  // arriva solo a modulo valido. In produzione l'invio passa da un servizio come Formspree o Web3Forms.
  const form = document.getElementById('richiesta');
  const status = document.getElementById('richiesta-esito');
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    status.hidden = false;
    status.textContent = 'Grazie, la richiesta è stata registrata. La risposta arriverà entro due giorni lavorativi. (Versione dimostrativa: nessun dato è stato inviato.)';
    form.reset();
  });
})();
