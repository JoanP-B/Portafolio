/* ═══════════════════════════════════════════════════════════════════════════
   JOAN STIVEN — PORTFOLIO  |  main.js
   ═══════════════════════════════════════════════════════════════════════════ */

'use strict';

/* ─── Pill nav sliding indicator ─────────────────────────────────────────── */
(function initPillNav() {
  const nav = document.getElementById('pill-nav');
  const indicator = document.getElementById('pill-indicator');
  const buttons = nav ? nav.querySelectorAll('.pill-btn') : [];

  function moveIndicator(btn) {
    const navRect = nav.getBoundingClientRect();
    const btnRect = btn.getBoundingClientRect();
    indicator.style.left = (btnRect.left - navRect.left - 4) + 'px';
    indicator.style.width = btnRect.width + 'px';
    indicator.style.top = '4px';
  }

  // Set initial position on the active button
  const active = nav ? nav.querySelector('.pill-btn.active') : null;
  if (active) {
    // Wait one frame so layout is ready
    requestAnimationFrame(() => moveIndicator(active));
  }

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-pressed', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-pressed', 'true');
      moveIndicator(btn);

      // Scroll to target section
      const targetId = btn.dataset.target;
      if (targetId) {
        const sectionMap = { trabajo: 'habilidades', info: 'sobre-mi' };
        const el = document.getElementById(sectionMap[targetId] || targetId);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // Re-position on resize
  window.addEventListener('resize', () => {
    const cur = nav ? nav.querySelector('.pill-btn.active') : null;
    if (cur) moveIndicator(cur);
  });
})();

/* ─── Header: add .scrolled class when user scrolls ─────────────────────── */
(function initScrollHeader() {
  const header = document.getElementById('header');
  if (!header) return;

  const onScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 20);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load
})();

/* ─── Intersection Observer: fade-in elements ────────────────────────────── */
(function initFadeIn() {
  const elements = document.querySelectorAll('.fade-in');
  if (!elements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          // Stagger siblings inside the same parent
          const siblings = entry.target.parentElement
            ? [...entry.target.parentElement.querySelectorAll('.fade-in')]
            : [];
          const idx = siblings.indexOf(entry.target);
          entry.target.style.transitionDelay = (idx * 0.08) + 's';
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  elements.forEach(el => observer.observe(el));
})();

/* ─── Smooth scroll for anchor links ─────────────────────────────────────── */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href').slice(1);
      const target = document.getElementById(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
})();

/* ─── OS window: subtle parallax on mouse move ───────────────────────────── */
(function initWindowParallax() {
  const win = document.getElementById('os-window');
  if (!win) return;

  let rafId = null;
  let targetX = 0, targetY = 0;
  let currentX = 0, currentY = 0;

  document.addEventListener('mousemove', (e) => {
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    targetX = ((e.clientX - cx) / cx) * 5;   // max ±5deg
    targetY = ((e.clientY - cy) / cy) * -3;  // max ±3deg
  });

  function animate() {
    currentX += (targetX - currentX) * 0.06;
    currentY += (targetY - currentY) * 0.06;
    win.style.transform = `perspective(1200px) rotateY(${currentX}deg) rotateX(${currentY}deg)`;
    rafId = requestAnimationFrame(animate);
  }
  animate();

  // Reset on mouse leave
  document.addEventListener('mouseleave', () => {
    targetX = 0;
    targetY = 0;
  });
})();

/* ─── Skill cards: magnetic hover micro-animation ────────────────────────── */
(function initMagneticCards() {
  const cards = document.querySelectorAll('.skill-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      const rotX = (y / rect.height) * -6;
      const rotY = (x / rect.width) * 6;
      card.style.transform = `translateY(-4px) perspective(600px) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();

/* ─── Typing cursor effect on hero headline ─────────────────────────────── */
(function initCursorBlink() {
  const headline = document.querySelector('.hero-headline');
  if (!headline) return;

  const cursor = document.createElement('span');
  cursor.textContent = '|';
  cursor.style.cssText = `
    display: inline-block;
    color: rgba(200,184,245,0.7);
    font-weight: 300;
    margin-left: 4px;
    animation: cursorBlink 1.1s infinite;
  `;

  // Inject keyframes once
  if (!document.getElementById('cursor-style')) {
    const style = document.createElement('style');
    style.id = 'cursor-style';
    style.textContent = `
      @keyframes cursorBlink {
        0%, 100% { opacity: 1; }
        50%       { opacity: 0; }
      }
    `;
    document.head.appendChild(style);
  }

  headline.appendChild(cursor);

})();
