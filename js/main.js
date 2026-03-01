/* ══════════════════════════════════════ */
/*        KUBE-OPS ANIMATION SYSTEM       */
/* ══════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ─────────────────────────────────── */
  /*  1. تعريف الـ Observer               */
  /* ─────────────────────────────────── */
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
          // لما يتعمل animate بنوقف المراقبة عشان ما يتكررش
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,   // لما 12% من العنصر يظهر
      rootMargin: '0px 0px -60px 0px'
    }
  );

  /* ─────────────────────────────────── */
  /*  2. دالة تسجيل العناصر              */
  /* ─────────────────────────────────── */
  function register(selector, animClass, delayStep = 0) {
    document.querySelectorAll(selector).forEach((el, i) => {
      el.classList.add('will-animate', animClass);
      if (delayStep) {
        el.style.transitionDelay = `${i * delayStep}ms`;
      }
      observer.observe(el);
    });
  }

  /* ─────────────────────────────────── */
  /*  3. تسجيل كل العناصر               */
  /* ─────────────────────────────────── */

  // Hero


  // Titles
  register('.title h4',            'anim-fade-up');
  register('.title h2',            'anim-fade-up');
  register('.title h1',            'anim-fade-up');

  // Services cards — كل كارت بتأخير
  register('.service-card',        'anim-fade-up', 120);

  // Who we help cards
  register('.pricing-card',        'anim-fade-up', 150);

  // Why section cards
  register('.why-card-tl',         'anim-fade-right');
  register('.why-card-bl',         'anim-fade-right');
  register('.why-card-tr',         'anim-fade-left');
  register('.why-card-br',         'anim-fade-left');

  // Open source
  register('.open-source-content', 'anim-fade-right');
  register('.open-source-cards',   'anim-fade-left');
  register('.os-card',             'anim-fade-up', 150);

  // Contact
  register('.contact-badge',       'anim-fade-down');
  register('.contact-content h2',  'anim-fade-up');
  register('.contact-content p',   'anim-fade-up');
  register('#contact .btn-group2', 'anim-fade-up');

});


// ── Badge Counter Animation ──
function animateBadgeCounter() {
  const countEl = document.querySelector('.badge-count');
  if (!countEl) return;

  const target = parseInt(countEl.textContent.replace('+', ''));
  const duration = 1500; // ms
  const step = target / (duration / 16);
  let current = 0;

  const timer = setInterval(() => {
    current += step;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    countEl.textContent = '+' + Math.floor(current);
  }, 16);
}

document.addEventListener('DOMContentLoaded', animateBadgeCounter);