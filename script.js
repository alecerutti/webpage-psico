(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  // Barra in alto: quando l'intestazione esce dallo schermo compaiono il nome e una riga sottile
  const bar = document.getElementById('bar');
  const masthead = document.querySelector('.masthead');
  new IntersectionObserver(([entry]) => {
    bar.classList.toggle('is-stuck', !entry.isIntersecting);
  }).observe(masthead);

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
