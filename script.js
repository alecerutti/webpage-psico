(() => {
  const header = document.getElementById('header');
  const toggle = document.getElementById('nav-toggle');
  const navList = document.getElementById('nav-list');
  const mobileBar = document.getElementById('mobile-bar');
  const contact = document.getElementById('contatti');
  const mobile = window.matchMedia('(max-width: 899px)');

  // Header: sfondo dopo lo scroll; solo su mobile si nasconde scendendo e riappare risalendo
  let lastY = window.scrollY;
  let ticking = false;

  const onScroll = () => {
    const y = window.scrollY;
    header.classList.toggle('is-scrolled', y > 10);
    const hide = mobile.matches && !navList.classList.contains('is-open') && y > lastY && y > 200;
    header.classList.toggle('is-hidden', hide);
    lastY = y;
    ticking = false;
  };

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(onScroll);
      ticking = true;
    }
  }, { passive: true });
  onScroll();

  // Menu mobile
  const setMenu = (open) => {
    navList.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Chiudi menu' : 'Apri menu');
    document.body.style.overflow = open ? 'hidden' : '';
  };

  toggle.addEventListener('click', () => setMenu(!navList.classList.contains('is-open')));
  navList.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });

  // Voce di menu attiva in base alla sezione visibile
  const links = [...navList.querySelectorAll('a:not(.btn)')];
  const sections = links.map((a) => document.querySelector(a.getAttribute('href')));
  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      links.forEach((a) => a.classList.toggle('is-active', a.getAttribute('href') === `#${entry.target.id}`));
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  sections.forEach((s) => s && navObserver.observe(s));

  // Fade-in allo scroll, con leggero ritardo a cascata tra elementi fratelli
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      io.unobserve(entry.target);
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.1 });

  document.querySelectorAll('.reveal').forEach((el) => {
    const siblings = [...el.parentElement.children].filter((c) => c.classList.contains('reveal'));
    el.style.setProperty('--d', `${Math.min(siblings.indexOf(el), 5) * 80}ms`);
    io.observe(el);
  });

  // Barra contatti mobile: nascosta quando la sezione Contatti è visibile
  new IntersectionObserver(([entry]) => {
    mobileBar.classList.toggle('is-hidden', entry.isIntersecting);
  }, { threshold: 0.15 }).observe(contact);

  // Galleria: frecce visibili solo se le foto non entrano tutte
  const track = document.getElementById('gallery-track');
  const galleryNav = document.getElementById('gallery-nav');
  const [prevBtn, nextBtn] = galleryNav.querySelectorAll('button');

  const updateGallery = () => {
    const max = track.scrollWidth - track.clientWidth;
    galleryNav.hidden = max <= 4;
    prevBtn.disabled = track.scrollLeft <= 1;
    nextBtn.disabled = track.scrollLeft >= max - 1;
  };

  galleryNav.addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;
    const step = track.querySelector('img').getBoundingClientRect().width + 16;
    track.scrollBy({ left: step * Number(btn.dataset.dir), behavior: 'smooth' });
  });
  track.addEventListener('scroll', updateGallery, { passive: true });
  window.addEventListener('resize', updateGallery);
  window.addEventListener('load', updateGallery);
  updateGallery();

  // Modulo (dummy): in produzione l'invio passa da un servizio come Formspree o Web3Forms
  const form = document.getElementById('contact-form');
  const status = document.getElementById('form-status');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const required = [form.nome, form.email];
    let valid = true;
    required.forEach((input) => {
      const ok = input.value.trim() !== '' && input.checkValidity();
      input.classList.toggle('is-invalid', !ok);
      if (!ok) valid = false;
    });
    const consent = form.privacy;
    consent.closest('.consent').classList.toggle('is-invalid', !consent.checked);
    if (!consent.checked) valid = false;

    status.hidden = false;
    if (!valid) {
      status.textContent = 'Per inviare la richiesta servono nome, email e consenso privacy.';
      return;
    }
    status.textContent = `Grazie ${form.nome.value.trim()}, richiesta ricevuta. La risposta arriverà entro 24 ore lavorative.`;
    form.reset();
  });
})();
