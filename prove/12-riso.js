// Prova 12 · Risograph: aggiunge all'apertura il sole a retino e la collina sovrastampata
(() => {
  const hero = document.querySelector('.hero');
  const sun = document.createElement('div');
  sun.className = 'riso-sole retino-b';
  const hill = document.createElement('div');
  hill.className = 'riso-collina';
  [sun, hill].forEach((el) => el.setAttribute('aria-hidden', 'true'));
  hero.prepend(sun, hill);
})();
