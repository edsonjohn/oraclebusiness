// ── COUNTER ANIMATION ──
function animateCounter(id, target, duration) {
  const el = document.getElementById(id);
  if (!el) return;
  let start = null;
  function step(ts) {
    if (!start) start = ts;
    const progress = Math.min((ts - start) / duration, 1);
    el.textContent = Math.round(progress * target);
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
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    const btn = form.querySelector('.f-btn');
    btn.textContent = 'Mensagem enviada ✓';
    btn.style.background = '#22C55E';
    btn.style.color = '#fff';
    btn.disabled = true;
    setTimeout(() => {
      btn.textContent = 'Agendar reunião gratuita →';
      btn.style.background = '';
      btn.style.color = '';
      btn.disabled = false;
      form.reset();
    }, 3000);
  });
}

// ── SCROLL REVEAL ──
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

['.svc-list > .svc', '.sectors-grid > .sector', '.testi-grid > .testi', '.eng-grid > .eng', '.how-grid > .how-c'].forEach(sel => {
  document.querySelectorAll(sel).forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = `opacity 0.4s ease ${Math.min(i * 0.07, 0.35)}s, transform 0.4s ease ${Math.min(i * 0.07, 0.35)}s`;
    revealObserver.observe(el);
  });
});

document.querySelectorAll('.ba-col, .manifesto, .stack-wrap, .faq-item, .logos-row, .sec-hd').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
  revealObserver.observe(el);
});
