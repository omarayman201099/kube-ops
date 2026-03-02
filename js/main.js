/* ══════════════════════════════════════ */
/*        KUBE-OPS ANIMATION SYSTEM       */
/*     OPTIMIZED VERSION - Performance    */
/* ══════════════════════════════════════ */

(function() {
  'use strict';

  /* ─────────────────────────────────── */
  /*  1. Consolidated DOMContentLoaded   */
  /* ─────────────────────────────────── */
  
  function init() {
    initAnimationSystem();
    initBadgeCounter();
  }

  /* ─────────────────────────────────── */
  /*  2. Cached DOM Elements             */
  /* ─────────────────────────────────── */
  
  // Pre-cache commonly used elements and NodeLists
  const domCache = {
    heroContent: null,
    animatedElements: [],
    observedElements: new WeakSet()
  };

  function cacheDOMElements() {
    domCache.heroContent = document.querySelector('.hero-content');
    
    // Cache all elements that need animation in one pass
    const selectors = [
      '.title h4',
      '.title h2', 
      '.title h1',
      '.service-card',
      '.pricing-card',
      '.why-card-tl',
      '.why-card-bl',
      '.why-card-tr',
      '.why-card-br',
      '.open-source-content',
      '.open-source-cards',
      '.os-card',
      '.contact-badge',
      '.contact-content h2',
      '.contact-content p',
      '#contact .btn-group2'
    ];
    
    // Build a single NodeList containing all elements
    domCache.animatedElements = selectors.reduce((acc, sel) => {
      const nodes = document.querySelectorAll(sel);
      nodes.forEach(el => acc.push({ el, selector: sel }));
      return acc;
    }, []);
  }

  /* ─────────────────────────────────── */
  /*  3. Optimized IntersectionObserver  */
  /* ─────────────────────────────────── */
  
  let observer = null;

  function createObserver() {
    // Optimized IntersectionObserver for smoother scroll animations
    // Lower threshold triggers earlier for smoother visual experience
    observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          // Skip if already animated
          if (domCache.observedElements.has(entry.target)) return;
          
          if (entry.isIntersecting) {
            // Mark as observed to prevent re-processing
            domCache.observedElements.add(entry.target);
            
            // Use requestAnimationFrame for smoother animation trigger
            requestAnimationFrame(() => {
              entry.target.classList.add('animate-in');
            });
            
            // Stop observing immediately
            obs.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.05,  // Lower threshold = earlier trigger for smoother feel
        rootMargin: '0px 0px -15px 0px'  // Smaller margin = element triggers when closer to viewport
      }
    );
  }

  /* ─────────────────────────────────── */
  /*  4. Animation Registration          */
  /*     Uses CSS custom properties      */
  /*     instead of inline styles         */
  /* ─────────────────────────────────── */
  
  const animationMap = {
    '.title h4':             { class: 'anim-fade-up', delay: 0 },
    '.title h2':             { class: 'anim-fade-up', delay: 80 },
    '.title h1':             { class: 'anim-fade-up', delay: 80 },
    '.service-card':         { class: 'anim-fade-up', delay: 0, step: 110 },
    '.pricing-card':         { class: 'anim-fade-up', delay: 0, step: 130 },
    '.why-card-tl':          { class: 'anim-fade-right', delay: 0 },
    '.why-card-bl':          { class: 'anim-fade-right', delay: 120 },
    '.why-card-tr':          { class: 'anim-fade-left', delay: 0 },
    '.why-card-br':          { class: 'anim-fade-left', delay: 120 },
    '.open-source-content': { class: 'anim-fade-right', delay: 0 },
    '.open-source-cards':    { class: 'anim-fade-left', delay: 80 },
    '.os-card':              { class: 'anim-zoom', delay: 0, step: 130 },
    '.contact-badge':        { class: 'anim-fade-down', delay: 0 },
    '.contact-content h2':   { class: 'anim-fade-up', delay: 100 },
    '.contact-content p':    { class: 'anim-fade-up', delay: 200 },
    '#contact .btn-group2': { class: 'anim-fade-up', delay: 300 }
  };

  function registerAnimations() {
    Object.entries(animationMap).forEach(([selector, config]) => {
      const elements = document.querySelectorAll(selector);
      elements.forEach((el, index) => {
        el.classList.add('will-animate', config.class);
        
        // Use inline style for delay (compatible with existing CSS)
        // Batch all style changes together for better performance
        const delay = config.delay + (config.step ? index * config.step : 0);
        if (delay) {
          el.style.transitionDelay = `${delay}ms`;
        }
        
        observer.observe(el);
      });
    });
  }

  /* ─────────────────────────────────── */
  /*  5. Hero Animation - Optimized       */
  /* ─────────────────────────────────── */
  
  const heroSequence = [
    { selector: '.hero-content h1',        delay: 80 },
    { selector: '.hero-content h2',        delay: 200 },
    { selector: '.hero-content > p',       delay: 340 },
    { selector: '.hero-content .btn-group2', delay: 480 }
  ];

  function initHeroAnimations() {
    heroSequence.forEach(({ selector, delay }) => {
      const el = document.querySelector(selector);
      if (!el) return;
      
      el.classList.add('will-animate', 'anim-hero');
      
      // Use requestAnimationFrame for smoother animation start
      requestAnimationFrame(() => {
        setTimeout(() => {
          el.classList.add('animate-in');
        }, delay);
      });
    });
  }

  /* ─────────────────────────────────── */
  /*  6. Badge Counter - Optimized        */
  /*     Uses requestIdleCallback        */
  /* ─────────────────────────────────── */
  
  function initBadgeCounter() {
    const countEl = document.querySelector('.badge-count');
    if (!countEl) return;

    const target = parseInt(countEl.textContent.replace('+', ''), 10);
    const duration = 1800;

    // EaseOutExpo function
    const easeOutExpo = (t) => t === 1 ? 1 : 1 - Math.pow(2, -10 * t);

    function animateCounter(start) {
      const now = performance.now();
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const value = Math.floor(easeOutExpo(progress) * target);
      
      countEl.textContent = '+' + value;
      
      if (progress < 1) {
        requestAnimationFrame(() => animateCounter(start));
      }
    }

    // Use requestIdleCallback if available, otherwise requestAnimationFrame
    const startAnimation = () => {
      requestAnimationFrame(() => animateCounter(performance.now()));
    };

    if ('requestIdleCallback' in window) {
      requestIdleCallback(startAnimation, { timeout: 2000 });
    } else {
      // Fallback for browsers without requestIdleCallback
      setTimeout(startAnimation, 100);
    }
  }

  /* ─────────────────────────────────── */
  /*  7. Main Initialization             */
  /* ─────────────────────────────────── */
  
  function initAnimationSystem() {
    // Create observer first
    createObserver();
    
    // Cache DOM elements
    cacheDOMElements();
    
    // Register all animations
    registerAnimations();
    
    // Initialize hero animations
    initHeroAnimations();
  }

  /* ─────────────────────────────────── */
  /*  8. Start Everything                */
  /* ─────────────────────────────────── */
  
  // Use single DOMContentLoaded listener
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    // DOM already loaded, initialize immediately
    init();
  }

})();
