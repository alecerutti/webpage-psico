// Prova 10 · Luce dalla finestra: crea lo strato di luce e lega l'ora del giorno allo scorrimento
(() => {
  const layer = document.createElement('div');
  layer.className = 'luce';
  layer.setAttribute('aria-hidden', 'true');

  // Ombra: tutto scuro tranne i quattro vetri (regola evenodd), più le foglie di una pianta davanti
  const leaf = (x, y, len, w, rot) =>
    `<path class="foglia-ombra" transform="rotate(${rot} ${x} ${y})" d="M${x} ${y}C${x - w} ${y - len * .35} ${x - w * .6} ${y - len * .8} ${x} ${y - len}C${x + w * .6} ${y - len * .8} ${x + w} ${y - len * .35} ${x} ${y}Z"/>`;
  layer.innerHTML = `
    <div class="luce__mattino"></div>
    <div class="luce__sera"></div>
    <div class="luce__ombra">
      <svg viewBox="0 0 1000 1000" preserveAspectRatio="xMidYMid slice" fill="#6B4A33">
        <path fill-rule="evenodd" d="M0 0H1000V1000H0Z
          M300 170H485V475H300Z M515 170H700V475H515Z
          M300 505H485V830H300Z M515 505H700V830H515Z"/>
        <g>
          ${leaf(250, 980, 420, 70, 28)}
          ${leaf(270, 990, 360, 60, 8)}
          ${leaf(240, 985, 300, 55, 48)}
          ${leaf(300, 1000, 330, 50, -12)}
        </g>
      </svg>
    </div>`;
  document.body.prepend(layer);

  // Ora del giorno: 0 in cima (mattino), 1 in fondo (pomeriggio)
  const root = document.documentElement;
  let ticking = false;
  const update = () => {
    const max = root.scrollHeight - window.innerHeight;
    root.style.setProperty('--p', (max > 0 ? window.scrollY / max : 0).toFixed(3));
    ticking = false;
  };
  window.addEventListener('scroll', () => {
    if (!ticking) { ticking = true; requestAnimationFrame(update); }
  }, { passive: true });
  window.addEventListener('resize', update);
  update();
})();
