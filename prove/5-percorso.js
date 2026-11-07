// Prova 5 · Il percorso disegnato: linea nei margini che si disegna con lo scorrimento
(() => {
  const NS = 'http://www.w3.org/2000/svg';
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const svg = document.createElementNS(NS, 'svg');
  svg.classList.add('percorso');
  svg.setAttribute('aria-hidden', 'true');
  const line = document.createElementNS(NS, 'path');
  line.classList.add('percorso__linea');
  svg.append(line);
  document.body.prepend(svg);

  let samples = [];   // [lunghezza, y] lungo la linea, per sapere quanto disegnarne
  let total = 0;
  let stops = [];

  const pageY = (el, edge) => el.getBoundingClientRect()[edge] + window.scrollY;

  const build = () => {
    const W = document.documentElement.clientWidth;
    const H = document.documentElement.scrollHeight;
    svg.setAttribute('width', W);
    svg.setAttribute('height', H);
    svg.setAttribute('viewBox', `0 0 ${W} ${H}`);

    const blocks = [document.querySelector('.hero > .wrap'), ...document.querySelectorAll('main > .section > .wrap')];
    const left = blocks[1].getBoundingClientRect().left;
    const m = Math.max(9, left / 2);
    const xs = [m, W - m];

    // Si attraversa la pagina a metà dello spazio vuoto tra un blocco e il successivo
    const crossings = [];
    for (let i = 0; i < blocks.length - 1; i++) {
      crossings.push((pageY(blocks[i], 'bottom') + pageY(blocks[i + 1], 'top')) / 2);
    }
    const startY = pageY(blocks[0], 'top') + 20;
    const last = blocks[blocks.length - 1];
    const endY = pageY(last, 'top') + Math.min(320, last.offsetHeight * 0.4);

    const h = Math.min(90, window.innerHeight * 0.1);
    let side = 0;
    let d = `M${xs[0]} ${startY}`;
    const points = [];
    for (const y of crossings) {
      const a = xs[side], b = xs[1 - side];
      d += ` L${a} ${y - h} C${a} ${y} ${b} ${y} ${b} ${y + h}`;
      points.push([(a + b) / 2, y]);
      side = 1 - side;
    }
    d += ` L${xs[side]} ${endY}`;
    points.push([xs[side], endY]);
    line.setAttribute('d', d);

    svg.querySelectorAll('.percorso__tappa').forEach((c) => c.remove());
    stops = points.map(([x, y]) => {
      const c = document.createElementNS(NS, 'circle');
      c.classList.add('percorso__tappa');
      c.setAttribute('cx', x); c.setAttribute('cy', y); c.setAttribute('r', 5);
      svg.append(c);
      return { c, y };
    });

    total = line.getTotalLength();
    samples = [];
    for (let s = 0; s <= total; s += 10) samples.push([s, line.getPointAtLength(s).y]);
    line.style.strokeDasharray = total;
    update();
  };

  const update = () => {
    const target = reduce ? Infinity : window.scrollY + window.innerHeight * 0.62;
    let len = total;
    for (const [s, y] of samples) { if (y >= target) { len = s; break; } }
    line.style.strokeDashoffset = total - len;
    for (const { c, y } of stops) c.classList.toggle('passata', y <= target);
  };

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) { ticking = true; requestAnimationFrame(() => { update(); ticking = false; }); }
  }, { passive: true });
  window.addEventListener('resize', build);
  window.addEventListener('load', build);
  build();
})();
