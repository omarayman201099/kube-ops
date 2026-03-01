/* ══════════════════════════════════════ */
/*        KUBE-OPS ANIMATION SYSTEM       */
/* ══════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ─────────────────────────────────── */
  /*  1. IntersectionObserver             */
  /* ─────────────────────────────────── */
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.08,
      rootMargin: '0px 0px -50px 0px'
    }
  );

  /* ─────────────────────────────────── */
  /*  2. دالة تسجيل عناصر الـ scroll     */
  /* ─────────────────────────────────── */
  function register(selector, animClass, delayStep = 0, baseDelay = 0) {
    document.querySelectorAll(selector).forEach((el, i) => {
      el.classList.add('will-animate', animClass);
      const delay = baseDelay + (delayStep ? i * delayStep : 0);
      if (delay) el.style.transitionDelay = `${delay}ms`;
      observer.observe(el);
    });
  }

  /* ─────────────────────────────────── */
  /*  3. Hero — دخول تسلسلي فوري         */
  /*     البادج مش بتتعمل فيها أنيميشن   */
  /* ─────────────────────────────────── */
  const heroSequence = [
    { selector: '.hero-content h1',        delay: 80  },
    { selector: '.hero-content h2',        delay: 200 },
    { selector: '.hero-content > p',       delay: 340 },
    { selector: '.hero-content .btn-group2', delay: 480 },
  ];

  heroSequence.forEach(({ selector, delay }) => {
    const el = document.querySelector(selector);
    if (!el) return;
    el.classList.add('will-animate', 'anim-hero');
    setTimeout(() => el.classList.add('animate-in'), delay);
  });

  /* ─────────────────────────────────── */
  /*  4. باقي العناصر — scroll-triggered  */
  /* ─────────────────────────────────── */

  // Titles
  register('.title h4',             'anim-fade-up', 0,   0);
  register('.title h2',             'anim-fade-up', 0,  80);
  register('.title h1',             'anim-fade-up', 0,  80);

  // Services
  register('.service-card',         'anim-fade-up', 110, 0);

  // Who We Help
  register('.pricing-card',         'anim-fade-up', 130, 0);

  // Why cards — من الجنبين
  register('.why-card-tl',          'anim-fade-right', 0, 0);
  register('.why-card-bl',          'anim-fade-right', 0, 120);
  register('.why-card-tr',          'anim-fade-left',  0, 0);
  register('.why-card-br',          'anim-fade-left',  0, 120);

  // Open Source
  register('.open-source-content',  'anim-fade-right', 0, 0);
  register('.open-source-cards',    'anim-fade-left',  0, 80);
  register('.os-card',              'anim-zoom',       130, 0);

  // Contact
  register('.contact-badge',        'anim-fade-down',  0,  0);
  register('.contact-content h2',   'anim-fade-up',    0, 100);
  register('.contact-content p',    'anim-fade-up',    0, 200);
  register('#contact .btn-group2',  'anim-fade-up',    0, 300);

});

/* ─────────────────────────────────── */
/*  Badge Counter — يشتغل فوراً        */
/* ─────────────────────────────────── */
function animateBadgeCounter() {
  const countEl = document.querySelector('.badge-count');
  if (!countEl) return;

  const target   = parseInt(countEl.textContent.replace('+', ''), 10);
  const duration = 1800;
  const start    = performance.now();

  // easeOutExpo
  function easeOutExpo(t) {
    return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
  }

  function tick(now) {
    const elapsed  = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const value    = Math.floor(easeOutExpo(progress) * target);
    countEl.textContent = '+' + value;
    if (progress < 1) requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
}

document.addEventListener('DOMContentLoaded', animateBadgeCounter);