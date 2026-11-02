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

  // Carosello dello studio: una foto alla volta, con pallini e frecce
  const track = document.getElementById('gallery-track');
  const galleryNav = document.getElementById('gallery-nav');
  const dotsBox = document.getElementById('gallery-dots');
  const slides = [...track.querySelectorAll('img')];
  const [prevBtn, nextBtn] = galleryNav.querySelectorAll('.gallery__btn');

  const goTo = (i) => track.scrollTo({ left: i * track.clientWidth, behavior: 'smooth' });

  const dots = slides.map((_, i) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'gallery__dot';
    dot.setAttribute('aria-label', `Foto ${i + 1} di ${slides.length}`);
    dot.addEventListener('click', () => goTo(i));
    dotsBox.appendChild(dot);
    return dot;
  });

  const updateGallery = () => {
    const current = Math.round(track.scrollLeft / track.clientWidth);
    galleryNav.hidden = slides.length < 2;
    dots.forEach((d, i) => d.classList.toggle('is-active', i === current));
    prevBtn.disabled = current <= 0;
    nextBtn.disabled = current >= slides.length - 1;
  };

  [prevBtn, nextBtn].forEach((btn) => {
    btn.addEventListener('click', () => {
      const current = Math.round(track.scrollLeft / track.clientWidth);
      goTo(current + Number(btn.dataset.dir));
    });
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
