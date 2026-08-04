/* ========================================
   cursor.js — Custom Cursor (Upgraded)
   Dot + trailing ring with lerp & reactive states
   ======================================== */
(function () {
  'use strict';

  // Skip on touch devices
  if (window.matchMedia('(pointer: coarse)').matches) return;

  // Create elements
  const dot  = document.createElement('div');
  const ring = document.createElement('div');
  dot.className  = 'cursor-dot';
  ring.className = 'cursor-ring';
  document.body.appendChild(dot);
  document.body.appendChild(ring);

  // Hide default cursor globally
  document.documentElement.classList.add('custom-cursor');

  let mx = -100, my = -100, rx = -100, ry = -100;

  window.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; }, { passive: true });

  // Animation loop — dot snaps, ring trails
  (function loop() {
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    dot.style.transform  = `translate3d(${mx - 5}px, ${my - 5}px, 0)`;
    ring.style.transform = `translate3d(${rx - 22}px, ${ry - 22}px, 0)`;
    requestAnimationFrame(loop);
  })();

  // Advanced reactive cursor states
  function addHover(el) {
    el.addEventListener('mouseenter', () => {
      if (el.matches('.btn-slideshow, .hero-cta, .btn-fluid-primary, .btn-download, .apps-premium-download-btn')) {
        ring.classList.add('cursor-magnetic');
      } else if (el.matches('.glass-card, .file-card, .countdown-card, .grid-item, .app-display-card')) {
        ring.classList.add('cursor-glass');
      } else {
        ring.classList.add('cursor-grow');
      }
      dot.classList.add('cursor-shrink');
    });

    el.addEventListener('mouseleave', () => {
      ring.classList.remove('cursor-grow', 'cursor-magnetic', 'cursor-glass');
      dot.classList.remove('cursor-shrink');
    });
  }

  // Observe current and future interactive elements
  document.querySelectorAll('a, button, .grid-item, .dock-tab, .dock-btn, .glass-card, .file-card').forEach(addHover);

  // Also observe dynamically added grid items
  const mo = new MutationObserver(muts => {
    muts.forEach(m => m.addedNodes.forEach(n => {
      if (n.nodeType !== 1) return;
      if (n.matches && n.matches('a, button, .grid-item, .glass-card')) addHover(n);
      n.querySelectorAll?.('a, button, .grid-item, .glass-card').forEach(addHover);
    }));
  });
  mo.observe(document.body, { childList: true, subtree: true });

  // "DRAG" label when hovering the 3D canvas
  const ringCanvas = document.getElementById('ring-canvas');
  if (ringCanvas) {
    ringCanvas.addEventListener('mouseenter', () => ring.classList.add('cursor-drag'));
    ringCanvas.addEventListener('mouseleave', () => ring.classList.remove('cursor-drag'));
  }

})();
