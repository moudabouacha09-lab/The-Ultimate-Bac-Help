/* ========================================
   cursor-aurora.js — Cursor-Reactive Aurora
   Trailing fluid gradient canvas backdrop
   ======================================== */
(function () {
  'use strict';

  let mouseX = 0.5, mouseY = 0.5, targetX = 0.5, targetY = 0.5;
  let ticking = false;

  document.addEventListener('pointermove', (e) => {
    targetX = e.clientX / window.innerWidth;
    targetY = e.clientY / window.innerHeight;
    if (!ticking) {
      requestAnimationFrame(updateAurora);
      ticking = true;
    }
  }, { passive: true });

  function updateAurora() {
    mouseX += (targetX - mouseX) * 0.06;
    mouseY += (targetY - mouseY) * 0.06;
    document.documentElement.style.setProperty('--mouse-x', `${mouseX * 100}%`);
    document.documentElement.style.setProperty('--mouse-y', `${mouseY * 100}%`);
    ticking = false;
  }

  // Create .bg-aurora element if not present
  if (!document.querySelector('.bg-aurora')) {
    const aurora = document.createElement('div');
    aurora.className = 'bg-aurora';
    document.body.prepend(aurora);
  }
})();
