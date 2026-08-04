/* ========================================
   reactive-glass.js — Reactive Refraction & Magnetic Buttons
   ======================================== */
(function () {
  'use strict';

  // 1. Reactive Refraction Tilt + Glare
  document.querySelectorAll('.glass-card, .file-card, .countdown-card, .grid-item, .app-display-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width;
      const py = (e.clientY - rect.top) / rect.height;
      const tiltX = (py - 0.5) * -6;   // max 6deg
      const tiltY = (px - 0.5) * 6;
      card.style.transform = `perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateZ(8px)`;
      card.style.setProperty('--glare-x', `${px * 100}%`);
      card.style.setProperty('--glare-y', `${py * 100}%`);
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(800px) rotateX(0) rotateY(0) translateZ(0)';
    });
  });

  // 2. Magnetic Buttons
  document.querySelectorAll('.btn-slideshow, .hero-cta, .btn-fluid-primary, .btn-download, .apps-premium-download-btn').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const relX = e.clientX - (rect.left + rect.width / 2);
      const relY = e.clientY - (rect.top + rect.height / 2);
      btn.style.transform = `translate(${relX * 0.25}px, ${relY * 0.25}px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = 'translate(0, 0)';
    });
  });

  // 3. Scroll Entrance Observer
  const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
        scrollObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.gallery-section, .grid-item, .hero-content').forEach(el => {
    el.classList.add('reveal-on-scroll');
    scrollObserver.observe(el);
  });
})();
