// ── COUNTER ANIMATION ──
function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }

function animateCounter(id, target, duration) {
  const el = document.getElementById(id);
  if (!el) return;
  let start = null;
  function step(ts) {
    if (!start) start = ts;
    const progress = Math.min((ts - start) / duration, 1);
    el.textContent = Math.round(easeOutCubic(progress) * target);
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter('c1', 80, 1100);
      animateCounter('c2', 24, 900);
      animateCounter('c3', 3, 700);
      animateCounter('c4', 6, 900);
      statsObserver.disconnect();
    }
  });
}, { threshold: 0.4 });

const statsEl = document.querySelector('.stats');
if (statsEl) statsObserver.observe(statsEl);

// ── FAQ ACCORDION ──
function toggleFaq(el) {
  const answer = el.nextElementSibling;
  const isOpen = answer.classList.contains('open');

  document.querySelectorAll('.faq-a').forEach(a => a.classList.remove('open'));
  document.querySelectorAll('.faq-q').forEach(q => q.classList.remove('open'));

  if (!isOpen) {
    answer.classList.add('open');
    el.classList.add('open');
  }
}

// ── SMOOTH SCROLL FOR NAV LINKS ──
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

// ── FORM SUBMISSION ──
const form = document.querySelector('.cta-form');
if (form) {
  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    const btn = form.querySelector('.f-btn');
    const dict = translations[getLang()];
    const originalKey = btn.getAttribute('data-i18n');
    const originalText = btn.textContent;
    btn.disabled = true;

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' },
      });

      if (!response.ok) throw new Error('Form submission failed');

      btn.textContent = dict['form.success'];
      btn.style.background = '#22C55E';
      btn.style.color = '#fff';
      setTimeout(() => {
        btn.textContent = translations[getLang()][originalKey];
        btn.style.background = '';
        btn.style.color = '';
        btn.disabled = false;
        form.reset();
      }, 3000);
    } catch (err) {
      btn.textContent = dict['form.error'];
      btn.style.background = '#DC2626';
      btn.style.color = '#fff';
      setTimeout(() => {
        btn.textContent = originalText;
        btn.style.background = '';
        btn.style.color = '';
        btn.disabled = false;
      }, 3500);
    }
  });
}

// ── SCROLL REVEAL ──
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-revealed');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

['.svc-list > .svc', '.sectors-grid > .sector', '.testi-grid > .testi', '.eng-grid > .eng', '.how-grid > .how-c', '.portfolio-track > .port-card'].forEach(sel => {
  document.querySelectorAll(sel).forEach((el, i) => {
    el.classList.add('reveal-init');
    el.style.transitionDelay = `${Math.min(i * 0.07, 0.35)}s`;
    revealObserver.observe(el);
  });
});

document.querySelectorAll('.ba-col, .manifesto, .stack-wrap, .faq-item, .sec-hd').forEach(el => {
  el.classList.add('reveal-init');
  revealObserver.observe(el);
});

// ── SCROLL PROGRESS ──
const scrollBar = document.getElementById('scrollBar');
function updateScrollProgress() {
  const h = document.documentElement;
  const scrolled = h.scrollHeight > h.clientHeight
    ? (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100
    : 0;
  if (scrollBar) scrollBar.style.width = scrolled + '%';
}
window.addEventListener('scroll', updateScrollProgress, { passive: true });
updateScrollProgress();

// ── HERO CURSOR SPOTLIGHT ──
const heroSection = document.getElementById('heroSection');
if (heroSection) {
  heroSection.addEventListener('mousemove', (e) => {
    const rect = heroSection.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    heroSection.style.setProperty('--mx', x + '%');
    heroSection.style.setProperty('--my', y + '%');
  });
}

// ── CARD CURSOR SPOTLIGHT ──
document.querySelectorAll('.spotlight-card').forEach((card) => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    card.style.setProperty('--mx', ((e.clientX - rect.left) / rect.width) * 100 + '%');
    card.style.setProperty('--my', ((e.clientY - rect.top) / rect.height) * 100 + '%');
  });
});

// ── PORTFOLIO SLIDER ──
const portfolioTrack = document.getElementById('portfolioTrack');
if (portfolioTrack) {
  const slides = Array.from(portfolioTrack.children);
  const dotsWrap = document.getElementById('portfolioDots');
  const prevBtn = document.getElementById('portfolioPrev');
  const nextBtn = document.getElementById('portfolioNext');

  slides.forEach((slide, i) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'port-dot';
    dot.setAttribute('aria-label', `Ir para o projeto ${i + 1}`);
    dot.addEventListener('click', () => {
      portfolioTrack.scrollTo({ left: slide.offsetLeft - portfolioTrack.offsetLeft, behavior: 'smooth' });
    });
    dotsWrap.appendChild(dot);
  });
  const dots = Array.from(dotsWrap.children);

  function activeIndex() {
    const pos = portfolioTrack.scrollLeft;
    let closest = 0;
    let minDist = Infinity;
    slides.forEach((slide, i) => {
      const dist = Math.abs((slide.offsetLeft - portfolioTrack.offsetLeft) - pos);
      if (dist < minDist) { minDist = dist; closest = i; }
    });
    return closest;
  }

  function goTo(i) {
    portfolioTrack.scrollTo({ left: slides[i].offsetLeft - portfolioTrack.offsetLeft, behavior: 'smooth' });
  }

  function updateSliderState() {
    const i = activeIndex();
    dots.forEach((d, di) => d.classList.toggle('active', di === i));
  }

  let scrollTimer;
  portfolioTrack.addEventListener('scroll', () => {
    clearTimeout(scrollTimer);
    scrollTimer = setTimeout(updateSliderState, 80);
  }, { passive: true });

  if (prevBtn) prevBtn.addEventListener('click', () => {
    goTo((activeIndex() - 1 + slides.length) % slides.length);
    restartAutoplay();
  });
  if (nextBtn) nextBtn.addEventListener('click', () => {
    goTo((activeIndex() + 1) % slides.length);
    restartAutoplay();
  });
  dots.forEach(dot => dot.addEventListener('click', restartAutoplay));

  window.addEventListener('resize', updateSliderState, { passive: true });
  updateSliderState();

  // ── AUTOPLAY ──
  const AUTOPLAY_DELAY = 5000;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let autoplayTimer;

  function startAutoplay() {
    if (reduceMotion || slides.length < 2) return;
    stopAutoplay();
    autoplayTimer = setInterval(() => goTo((activeIndex() + 1) % slides.length), AUTOPLAY_DELAY);
  }
  function stopAutoplay() { clearInterval(autoplayTimer); }
  function restartAutoplay() { startAutoplay(); }

  const sliderEl = document.querySelector('.portfolio-slider');
  sliderEl.addEventListener('mouseenter', stopAutoplay);
  sliderEl.addEventListener('mouseleave', startAutoplay);
  sliderEl.addEventListener('touchstart', stopAutoplay, { passive: true });
  sliderEl.addEventListener('touchend', restartAutoplay, { passive: true });
  sliderEl.addEventListener('touchcancel', restartAutoplay, { passive: true });
  sliderEl.addEventListener('focusin', stopAutoplay);
  sliderEl.addEventListener('focusout', startAutoplay);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stopAutoplay(); else startAutoplay();
  });

  startAutoplay();
}

// ── NAV SCROLL SHRINK ──
const navEl = document.querySelector('nav');
function updateNavScroll() {
  if (navEl) navEl.classList.toggle('nav-scrolled', window.scrollY > 40);
}
window.addEventListener('scroll', updateNavScroll, { passive: true });
updateNavScroll();
