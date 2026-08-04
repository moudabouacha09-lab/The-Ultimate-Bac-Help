/* ========================================
   The Legend of 3rd Class — Script
   FABLE 5 Version
   ======================================== */

// ==================== MEDIA DATA ====================
const mediaData = {
  '3as3': {
    basePath: '3 AS 3',
    items: [
      { type: 'photo', file: 'photo_2026-04-30_01-26-17 (2).jpg' },
      { type: 'photo', file: 'photo_2026-04-30_01-26-17.jpg' },
      { type: 'photo', file: 'photo_2026-06-30_12-41-44.jpg' },
      { type: 'photo', file: 'photo_2026-06-30_12-41-47 (2).jpg' },
      { type: 'photo', file: 'photo_2026-06-30_12-41-48 (2).jpg' },
      { type: 'photo', file: 'photo_2026-06-30_12-41-48.jpg' },
      { type: 'photo', file: 'photo_2026-06-30_12-41-49.jpg' },
      { type: 'photo', file: 'photo_2026-06-30_12-41-54.jpg' },
      { type: 'photo', file: 'photo_2026-06-30_12-41-55.jpg' },
      { type: 'photo', file: 'photo_2026-06-30_12-41-56.jpg' },
      { type: 'photo', file: 'photo_2026-06-30_12-42-01.jpg' },
      { type: 'photo', file: 'photo_2026-06-30_12-42-02 (2).jpg' },
      { type: 'photo', file: 'photo_2026-06-30_12-42-02.jpg' },
      { type: 'photo', file: 'photo_2026-06-30_12-42-03.jpg' },
      { type: 'photo', file: 'photo_2026-06-30_12-42-09.jpg' },
      { type: 'photo', file: 'photo_2026-06-30_12-42-21.jpg' },
      { type: 'photo', file: 'photo_2026-06-30_12-42-22.jpg' },
      { type: 'photo', file: 'photo_2026-06-30_12-42-23 (2).jpg' },
      { type: 'photo', file: 'photo_2026-06-30_12-42-23.jpg' },
      { type: 'photo', file: 'photo_2026-06-30_12-42-24.jpg' },
      { type: 'photo', file: 'photo_2026-06-30_12-42-25.jpg' },
      { type: 'photo', file: 'photo_2026-06-30_12-42-31.jpg' },
      { type: 'photo', file: 'photo_2026-06-30_12-42-44.jpg' },
      { type: 'photo', file: 'photo_2026-06-30_12-43-23.jpg' },
      { type: 'photo', file: 'photo_2026-06-30_12-43-24.jpg' },
      { type: 'photo', file: 'photo_2026-06-30_12-43-25 (2).jpg' },
      { type: 'photo', file: 'photo_2026-06-30_12-44-14.jpg' },
      { type: 'photo', file: 'photo_2026-06-30_12-44-16.jpg' },
      { type: 'photo', file: 'photo_2026-06-30_12-44-19 (2).jpg' },
      { type: 'photo', file: 'photo_2026-06-30_12-45-05.jpg' },
      { type: 'photo', file: 'photo_2026-06-30_12-45-06 (2).jpg' },
      { type: 'photo', file: 'photo_2026-06-30_12-45-06.jpg' },
      { type: 'photo', file: 'photo_2026-06-30_12-45-11.jpg' },
      { type: 'photo', file: 'photo_2026-06-30_12-45-14.jpg' },
      { type: 'photo', file: 'photo_2026-06-30_12-45-16.jpg' },
      { type: 'photo', file: 'photo_2026-06-30_12-45-17.jpg' },
      { type: 'photo', file: 'photo_2026-06-30_12-45-27.jpg' },
      { type: 'photo', file: 'photo_2026-06-30_12-45-29 (2).jpg' },
      { type: 'photo', file: 'photo_2026-06-30_12-45-30 (2).jpg' },
      { type: 'photo', file: 'photo_2026-06-30_12-45-30.jpg' },
      { type: 'photo', file: 'photo_2026-06-30_12-45-31 (2).jpg' },
      { type: 'photo', file: 'photo_2026-06-30_12-45-32.jpg' },
      { type: 'video', file: 'video_2026-06-30_12-42-11.mp4' },
      { type: 'video', file: 'video_2026-06-30_12-43-29.mp4' },
      { type: 'video', file: 'video_2026-06-30_12-45-13.mp4' },
    ]
  },
  'adn': {
    basePath: '2 AS 3/ملتقى ADN',
    items: [
      { type: 'photo', file: '493323338_122201575178130819_1420090942118597444_n.jpg' },
      { type: 'photo', file: '493775078_122201577476130819_7992269131213519303_n.jpg' },
      { type: 'photo', file: '493847432_122201575904130819_5761229659666897775_n.jpg' },
      { type: 'photo', file: '493867556_122201575004130819_4264382206118162116_n.jpg' },
      { type: 'photo', file: '494192435_122201586920130819_4141047914736118511_n.jpg' },
      { type: 'photo', file: '494195712_122201576618130819_6789892733575234793_n.jpg' },
    ]
  },
  'party': {
    basePath: '2 AS 3/حفلة نهاية العام 2025',
    items: [
      { type: 'photo', file: 'IMG20250508104057.jpg' },
      { type: 'photo', file: 'IMG20250508104103.jpg' },
      { type: 'photo', file: 'IMG20250508104355.jpg' },
      { type: 'photo', file: 'IMG20250508120235 (1).jpg' },
      { type: 'photo', file: 'IMG20250508120235.jpg' },
      { type: 'photo', file: 'IMG20250508120414.jpg' },
      { type: 'photo', file: 'IMG20250508121759.jpg' },
      { type: 'photo', file: 'IMG_20250508_185828_598.jpg' },
      { type: 'photo', file: 'IMG_20250508_185828_760.jpg' },
      { type: 'photo', file: 'IMG_20250508_185828_777.jpg' },
      { type: 'photo', file: 'IMG_20250508_185828_930.jpg' },
      { type: 'photo', file: 'IMG_20250508_185835_378.jpg' },
      { type: 'photo', file: 'IMG_20250508_185835_416.jpg' },
      { type: 'photo', file: 'IMG_20250508_185835_580.jpg' },
      { type: 'photo', file: 'IMG_20250508_185835_609.jpg' },
      { type: 'photo', file: 'IMG_20250508_185835_847.jpg' },
      { type: 'photo', file: 'IMG_20250508_185835_992.jpg' },
      { type: 'photo', file: 'IMG_20250508_185836_157.jpg' },
      { type: 'photo', file: 'IMG_20250508_185836_187.jpg' },
      { type: 'photo', file: 'IMG_20250508_185836_225.jpg' },
      { type: 'photo', file: 'IMG_20250508_185841_188.jpg' },
      { type: 'photo', file: 'IMG_20250508_185841_515.jpg' },
      { type: 'photo', file: 'IMG_20250508_185841_729.jpg' },
      { type: 'photo', file: 'IMG_20250508_185858_489.jpg' },
      { type: 'photo', file: 'IMG_20250508_185858_491.jpg' },
      { type: 'photo', file: 'IMG_20250508_185858_504.jpg' },
      { type: 'photo', file: 'IMG_20250508_185858_709.jpg' },
      { type: 'photo', file: 'IMG_20250508_185858_825.jpg' },
      { type: 'photo', file: 'IMG_20250508_185858_922.jpg' },
      { type: 'photo', file: 'IMG_20250508_185859_138.jpg' },
      { type: 'photo', file: 'IMG_20250508_185859_173.jpg' },
      { type: 'photo', file: 'IMG_20250508_185859_264.jpg' },
      { type: 'photo', file: 'IMG_20250508_185902_850 (1).jpg' },
      { type: 'photo', file: 'IMG_20250508_185902_850.jpg' },
      { type: 'photo', file: 'IMG_20250508_185903_088.jpg' },
      { type: 'photo', file: 'IMG_20250508_185903_258.jpg' },
      { type: 'photo', file: 'IMG_20250508_185903_508 (1).jpg' },
      { type: 'photo', file: 'IMG_20250508_185903_508.jpg' },
      { type: 'photo', file: 'IMG_20250508_193730_965 (1).jpg' },
      { type: 'photo', file: 'IMG_20250508_193730_965.jpg' },
      { type: 'photo', file: 'IMG_20250508_193731_701 (1).jpg' },
      { type: 'photo', file: 'IMG_20250508_193731_701.jpg' },
      { type: 'photo', file: 'IMG_20250508_193853_651.jpg' },
      { type: 'photo', file: 'IMG_20250508_193854_038.jpg' },
      { type: 'photo', file: 'IMG_20250508_193854_217.jpg' },
      { type: 'photo', file: 'IMG_20250508_193854_239.jpg' },
      { type: 'photo', file: 'IMG_20250508_193854_243.jpg' },
      { type: 'photo', file: 'IMG_20250508_193854_450.jpg' },
      { type: 'photo', file: 'IMG_20250508_193854_519.jpg' },
      { type: 'photo', file: 'IMG_20250508_193854_595.jpg' },
      { type: 'photo', file: 'IMG_20250508_193901_323.jpg' },
      { type: 'photo', file: 'IMG_20250508_193901_343.jpg' },
      { type: 'photo', file: 'IMG_20250508_193901_522.jpg' },
      { type: 'photo', file: 'IMG_20250508_193901_560.jpg' },
      { type: 'photo', file: 'IMG_20250508_193901_652.jpg' },
      { type: 'photo', file: 'IMG_20250508_193901_896 (1).jpg' },
      { type: 'photo', file: 'IMG_20250508_193901_896.jpg' },
      { type: 'photo', file: 'IMG_20250508_193902_002.jpg' },
      { type: 'photo', file: 'IMG_20250508_193902_076.jpg' },
      { type: 'photo', file: 'IMG_20250508_193928_685.jpg' },
      { type: 'photo', file: 'IMG_20250508_193928_847.jpg' },
      { type: 'photo', file: 'IMG_20250508_193929_284.jpg' },
      { type: 'video', file: 'VID20250508110210.mp4' },
      { type: 'video', file: 'VID20250508110600.mp4' },
      { type: 'video', file: 'VID20250508110948.mp4' },
      { type: 'video', file: 'VID20250508111013.mp4' },
    ]
  }
};

// ==================== HELPERS ====================
const galleryMeta = {
  '3as3':  { title: '✦ 3 AS 3 — The Final Year' },
  'adn':   { title: '✦ ملتقى ADN' },
  'party': { title: '✦ حفلة نهاية العام 2025' },
};

// encodeURI is critical — folder/file names contain spaces and Arabic characters
const srcOf = (galleryKey, item) =>
  encodeURI(`${mediaData[galleryKey].basePath}/${item.file}`);

// Flat list for lightbox/slideshow navigation
const flatList = [];
Object.keys(mediaData).forEach(key => {
  mediaData[key].items.forEach(item => flatList.push({ key, item }));
});

// ==================== RENDER GALLERIES ====================
const galleriesEl = document.getElementById('galleries');

Object.keys(mediaData).forEach(key => {
  const section = document.createElement('section');
  section.className = 'gallery-section';
  section.id = `gallery-${key}`;

  const h2 = document.createElement('h2');
  h2.className = 'gallery-title';
  h2.textContent = galleryMeta[key]?.title || key;
  section.appendChild(h2);

  const grid = document.createElement('div');
  grid.className = 'grid';

  mediaData[key].items.forEach(item => {
    const cell = document.createElement('div');
    cell.className = 'grid-item';
    const flatIndex = flatList.findIndex(f => f.key === key && f.item === item);

    if (item.type === 'photo') {
      const img = document.createElement('img');
      img.loading = 'lazy';
      img.src = srcOf(key, item);
      img.alt = item.file;
      cell.appendChild(img);
    } else {
      const vid = document.createElement('video');
      vid.src = srcOf(key, item);
      vid.muted = true;
      vid.preload = 'metadata';
      cell.appendChild(vid);
      const badge = document.createElement('span');
      badge.className = 'badge';
      badge.textContent = '▶ Video';
      cell.appendChild(badge);
    }

    cell.addEventListener('click', () => openLightbox(flatIndex));
    grid.appendChild(cell);
  });

  section.appendChild(grid);
  galleriesEl.appendChild(section);
});

// ==================== LENIS + GSAP SCROLLTRIGGER ====================
let lenis = null;
if (typeof Lenis !== 'undefined') {
  lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    touchMultiplier: 1.5
  });

  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);
  } else {
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
  }

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href && href.length > 1) {
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          lenis.scrollTo(target, { offset: -60, duration: 1.2 });
        }
      }
    });
  });
}

// Always mark grid items visible so layout is fully styled immediately
document.querySelectorAll('.grid-item').forEach(el => el.classList.add('visible'));

if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
  document.querySelectorAll('.grid-item').forEach((item, index) => {
    const yOffset = (index % 3 === 0) ? -25 : (index % 3 === 1) ? -10 : -35;
    gsap.fromTo(item, 
      {
        opacity: 0.85,
        y: 30,
        scale: 0.98
      },
      {
        opacity: 1,
        y: yOffset,
        scale: 1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: item,
          start: 'top 95%',
          end: 'top 35%',
          scrub: 0.8
        }
      }
    );
  });
  setTimeout(() => ScrollTrigger.refresh(), 300);
} else {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => e.isIntersecting && e.target.classList.add('visible'));
  }, { threshold: 0.1 });
  document.querySelectorAll('.grid-item').forEach(el => observer.observe(el));
}

// ==================== FILMSTRIP ====================
const filmstrip = document.getElementById('filmstrip');
const photosOnly = flatList.filter(f => f.item.type === 'photo').slice(0, 20);
[...photosOnly, ...photosOnly].forEach(f => {   // duplicated for seamless loop
  const img = document.createElement('img');
  img.src = srcOf(f.key, f.item);
  img.loading = 'lazy';
  filmstrip.appendChild(img);
});

// ==================== LIGHTBOX ====================
const lightbox = document.getElementById('lightbox');
const lbStage = document.getElementById('lbStage');
const lbCounter = document.getElementById('lbCounter');
let currentIndex = 0;

function renderLightbox() {
  const { key, item } = flatList[currentIndex];
  lbStage.innerHTML = '';
  if (item.type === 'photo') {
    const img = document.createElement('img');
    img.src = srcOf(key, item);
    lbStage.appendChild(img);
  } else {
    const vid = document.createElement('video');
    vid.src = srcOf(key, item);
    vid.controls = true;
    vid.autoplay = true;
    lbStage.appendChild(vid);
  }
  lbCounter.textContent = `${currentIndex + 1} / ${flatList.length}`;
}

function openLightbox(index) {
  currentIndex = index;
  lightbox.classList.add('open');
  renderLightbox();
}
function closeLightbox() {
  lightbox.classList.remove('open');
  lbStage.innerHTML = '';   // stops videos
  stopSlideshow();
}
function step(dir) {
  currentIndex = (currentIndex + dir + flatList.length) % flatList.length;
  renderLightbox();
}

document.getElementById('lbClose').onclick = closeLightbox;
document.getElementById('lbPrev').onclick = () => step(-1);
document.getElementById('lbNext').onclick = () => step(1);
lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
document.addEventListener('keydown', e => {
  if (!lightbox.classList.contains('open')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft') step(-1);
  if (e.key === 'ArrowRight') step(1);
});

// ==================== SLIDESHOW ====================
let slideshowTimer = null;
function startSlideshow() {
  openLightbox(0);
  slideshowTimer = setInterval(() => step(1), 3500);
}
function stopSlideshow() {
  clearInterval(slideshowTimer);
  slideshowTimer = null;
}
document.getElementById('slideshowBtn').onclick = () =>
  slideshowTimer ? stopSlideshow() : startSlideshow();

// ==================== PARALLAX ====================
window.addEventListener('scroll', () => {
  const hero = document.querySelector('.hero-content');
  if (hero) hero.style.transform = `translateY(${window.scrollY * 0.35}px)`;
});

// ==================== PARTICLES WITH POINTER REPEL & CONSTELLATIONS ====================
const canvas = document.getElementById('particles');
if (canvas) {
  const ctx = canvas.getContext('2d');
  let particles = [];
  let mouseX = -1000, mouseY = -1000;

  function resize() {
    canvas.width = innerWidth;
    canvas.height = innerHeight;
  }
  window.addEventListener('resize', resize, { passive: true });
  window.addEventListener('mousemove', e => { mouseX = e.clientX; mouseY = e.clientY; }, { passive: true });
  window.addEventListener('mouseleave', () => { mouseX = -1000; mouseY = -1000; }, { passive: true });
  resize();

  for (let i = 0; i < 70; i++) {
    const baseVx = (Math.random() - 0.5) * 0.4;
    const baseVy = (Math.random() - 0.5) * 0.4;
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 2 + 0.5,
      vx: baseVx,
      vy: baseVy,
      baseVx,
      baseVy
    });
  }

  (function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let connectionCount = 0;
    const maxConnections = 8;
    const repelRadius = 120;
    const connectRadius = 100;

    particles.forEach(p => {
      // Repel from cursor
      const dx = p.x - mouseX;
      const dy = p.y - mouseY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < repelRadius && dist > 0) {
        const force = (repelRadius - dist) / repelRadius;
        p.vx += (dx / dist) * force * 0.15;
        p.vy += (dy / dist) * force * 0.15;
      }

      // Smooth return to base speed
      p.vx += (p.baseVx - p.vx) * 0.05;
      p.vy += (p.baseVy - p.vy) * 0.05;

      p.x = (p.x + p.vx + canvas.width) % canvas.width;
      p.y = (p.y + p.vy + canvas.height) % canvas.height;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(14, 165, 233, 0.6)';
      ctx.fill();

      // Constellation line to cursor
      if (dist < connectRadius && connectionCount < maxConnections) {
        connectionCount++;
        const alpha = (1 - dist / connectRadius) * 0.35;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(mouseX, mouseY);
        ctx.strokeStyle = `rgba(181, 212, 244, ${alpha})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    });
    requestAnimationFrame(animate);
  })();
}
