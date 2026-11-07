// Prova 8 · Paesaggio a carta ritagliata: tre strati (sole, colline lontane, primo piano)
(() => {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hero = document.querySelector('.hero');
  const box = document.createElement('div');
  box.className = 'paesaggio';
  box.setAttribute('aria-hidden', 'true');

  // Tutti gli strati condividono la stessa viewBox e lo stesso adattamento, così restano allineati
  const layer = (content) =>
    `<svg viewBox="0 0 1440 520" preserveAspectRatio="xMidYMax slice">${content}</svg>`;

  const sole = layer('<circle cx="1110" cy="170" r="92" fill="#EDBC9F"/>');

  const lontane = layer(`
    <path d="M0 300C200 236 420 250 640 292C860 334 1080 238 1440 268V520H0Z" fill="#E8D0C2"/>
    <path d="M0 352C240 300 470 318 720 350C960 380 1210 312 1440 330V520H0Z" fill="#E0C3AE"/>`);

  const vicine = layer(`
    <!-- collina con la porta ad arco (lo studio) e il sentiero che ci arriva -->
    <path d="M520 520C600 440 760 392 980 384C1160 378 1320 404 1440 420V520Z" fill="#D2A88C"/>
    <path d="M944 392V332A36 36 0 0 1 1016 332V392Z" fill="#9C9A68"/>
    <path d="M967 392V350A13 13 0 0 1 993 350V392Z" fill="#5E5540"/>
    <path d="M640 520C700 486 800 468 880 440C930 422 962 408 972 394L990 394C982 414 950 434 900 456C820 490 760 500 724 520Z" fill="#F3E5D6"/>
    <!-- collina vicina a sinistra con due piante ritagliate -->
    <path d="M0 438C190 400 380 404 560 446C640 466 700 494 740 520H0Z" fill="#C88A70"/>
    <path d="M236 432C232 400 236 372 248 346" fill="none" stroke="#4A3A31" stroke-width="5" stroke-linecap="round"/>
    <path d="M247 360C254 334 276 318 304 318C296 342 274 360 247 360Z" fill="#A65A6C"/>
    <path d="M240 396C216 394 196 378 190 356C216 358 236 374 240 396Z" fill="#B46A55"/>
    <path d="M1300 420C1296 396 1300 374 1310 356" fill="none" stroke="#4A3A31" stroke-width="4" stroke-linecap="round"/>
    <path d="M1309 368C1314 348 1332 336 1354 336C1348 356 1330 370 1309 368Z" fill="#A47A91"/>
    <!-- terreno in primo piano: ha il colore della pagina e prosegue nella sezione successiva -->
    <path d="M0 500C300 470 640 494 1000 480C1200 472 1360 484 1440 478V520H0Z" fill="#F7F1E8"/>`);

  box.innerHTML = sole + lontane + vicine;
  hero.prepend(box);
  if (reduce) return;

  const [sun, far] = box.querySelectorAll('svg');
  let ticking = false;
  const update = () => {
    const y = Math.min(window.scrollY, hero.offsetHeight);
    sun.style.transform = `translate3d(0, ${(y * 0.45).toFixed(1)}px, 0)`;   // il sole scende e tramonta
    far.style.transform = `translate3d(0, ${(y * 0.12).toFixed(1)}px, 0)`;
    ticking = false;
  };
  window.addEventListener('scroll', () => {
    if (!ticking) { ticking = true; requestAnimationFrame(update); }
  }, { passive: true });
  update();
})();
