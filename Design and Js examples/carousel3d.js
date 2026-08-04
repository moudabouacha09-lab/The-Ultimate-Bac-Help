/* ========================================
   carousel3d.js — WebGL Ring Carousel
   Three.js + GSAP inertia + snap
   Inspired by Garden Eight / aikawakenichi
   ======================================== */
(function () {
  'use strict';

  /* ---- constants ---- */
  const R         = 12;         // ring radius — larger = more spacing
  const H         = 2.6;        // plane height
  const MAX       = 10;         // max photos per album (fewer = cleaner)
  const LERP      = 0.06;
  const IDLE_SPD  = 0.0004;
  const DRAG_K    = 0.004;
  const PROJ_K    = 18;
  const SNAP_DUR  = 1.2;
  const TILT_AMT  = 0.035;
  const TILT_LERP = 0.04;

  /* ---- state ---- */
  const S = {
    target: 0, current: 0,
    dragging: false, idle: true, animating: false,
    album: '3as3', N: 0, front: 0,
    mxN: 0, myN: 0, tiltX: 0,
    idleTimer: null, visible: true
  };

  /* ---- elements ---- */
  const cvs     = document.getElementById('ring-canvas');
  const section = document.getElementById('carousel3d');
  const titleEl = document.getElementById('carousel-title');
  const indexEl = document.getElementById('carousel-index');
  if (!cvs || !section) return;

  /* ---- Three.js ---- */
  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, cvs.clientWidth / cvs.clientHeight, 0.1, 100);
  camera.position.set(0, 0, 0);   // dead center

  const renderer = new THREE.WebGLRenderer({ canvas: cvs, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.setSize(cvs.clientWidth, cvs.clientHeight);
  const maxAniso = renderer.capabilities.getMaxAnisotropy();

  const ringGrp = new THREE.Group();
  scene.add(ringGrp);
  const loader = new THREE.TextureLoader();
  let planes = [];      // { photo: Mesh, frame: Mesh }

  /* ---- resize ---- */
  function onResize() {
    const w = section.clientWidth, h = section.clientHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  }
  window.addEventListener('resize', onResize);

  /* ---- album helpers ---- */
  const galleryMeta = {
    '3as3':  { titleAr: '',      titleLa: '3 AS 3' },
    'adn':   { titleAr: 'ملتقى', titleLa: 'ADN' },
    'party': { titleAr: 'حفلة نهاية العام', titleLa: '2025' },
  };

  function albumPhotos(key) {
    const g = mediaData[key];
    if (!g) return [];
    return g.items
      .filter(i => i.type === 'photo')
      .slice(0, MAX)
      .map(i => encodeURI(g.basePath + '/' + i.file));
  }

  /* ---- rounded rectangle shape (for frame geometry) ---- */
  function createRoundedRectShape(w, h, r) {
    const shape = new THREE.Shape();
    shape.moveTo(-w/2 + r, -h/2);
    shape.lineTo(w/2 - r, -h/2);
    shape.quadraticCurveTo(w/2, -h/2, w/2, -h/2 + r);
    shape.lineTo(w/2, h/2 - r);
    shape.quadraticCurveTo(w/2, h/2, w/2 - r, h/2);
    shape.lineTo(-w/2 + r, h/2);
    shape.quadraticCurveTo(-w/2, h/2, -w/2, h/2 - r);
    shape.lineTo(-w/2, -h/2 + r);
    shape.quadraticCurveTo(-w/2, -h/2, -w/2 + r, -h/2);
    return shape;
  }

  /* ---- build / clear ring ---- */
  function clearRing() {
    planes.forEach(p => {
      if (p.photo.material.map) p.photo.material.map.dispose();
      p.photo.material.dispose(); p.photo.geometry.dispose();
      p.frame.material.dispose(); p.frame.geometry.dispose();
    });
    while (ringGrp.children.length) ringGrp.remove(ringGrp.children[0]);
    planes = [];
  }

  function buildRing(urls) {
    S.N = urls.length;
    if (!S.N) return;
    const step = (Math.PI * 2) / S.N;

    urls.forEach((url, i) => {
      const angle = i * step;
      const group = new THREE.Group();

      // Frame (frosted glass card behind the photo)
      const frameW = H * 1.5 + 0.3;
      const frameH = H + 0.3;
      const frameShape = createRoundedRectShape(frameW, frameH, 0.15);
      const frameGeo = new THREE.ShapeGeometry(frameShape);
      const frameMat = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.04,
        side: THREE.DoubleSide
      });
      const frameMesh = new THREE.Mesh(frameGeo, frameMat);
      frameMesh.position.z = -0.02; // slightly behind photo
      group.add(frameMesh);

      // Photo plane
      const photoMat = new THREE.MeshBasicMaterial({
        side: THREE.DoubleSide, transparent: true, opacity: 0.25
      });
      const photoGeo = new THREE.PlaneGeometry(H * 1.5, H);
      const photoMesh = new THREE.Mesh(photoGeo, photoMat);
      group.add(photoMesh);

      // Position group in ring
      group.position.set(Math.sin(angle) * R, 0, -Math.cos(angle) * R);
      group.lookAt(0, 0, 0);
      group.userData.idx = i;

      ringGrp.add(group);
      planes.push({ photo: photoMesh, frame: frameMesh, group });

      // Load texture with quality settings
      loader.load(url, tex => {
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.anisotropy = maxAniso;
        tex.minFilter = THREE.LinearMipmapLinearFilter;
        tex.magFilter = THREE.LinearFilter;
        tex.generateMipmaps = true;

        photoMat.map = tex;
        photoMat.needsUpdate = true;

        // Fix aspect ratio
        const aspect = tex.image.width / tex.image.height;
        const w = H * aspect;
        photoMesh.geometry.dispose();
        photoMesh.geometry = new THREE.PlaneGeometry(w, H);

        // Update frame to match
        frameMesh.geometry.dispose();
        const newShape = createRoundedRectShape(w + 0.25, H + 0.25, 0.12);
        frameMesh.geometry = new THREE.ShapeGeometry(newShape);
      });
    });
  }

  /* ---- transition animations ---- */
  function animateOut(cb) {
    const tl = gsap.timeline({ onComplete: cb });
    planes.forEach((p, i) => {
      tl.to(p.group.position, { x: p.group.position.x * 2.2, z: p.group.position.z * 2.2,
        duration: 0.5, ease: 'power2.in' }, i * 0.03);
      tl.to(p.photo.material, { opacity: 0, duration: 0.4, ease: 'power2.in' }, i * 0.03);
      tl.to(p.frame.material, { opacity: 0, duration: 0.4, ease: 'power2.in' }, i * 0.03);
    });
  }

  function animateIn() {
    planes.forEach((p, i) => {
      const tx = p.group.position.x, tz = p.group.position.z;
      p.group.position.x *= 2.2;
      p.group.position.z *= 2.2;
      p.photo.material.opacity = 0;
      p.frame.material.opacity = 0;
      gsap.to(p.group.position, { x: tx, z: tz, duration: 0.7, ease: 'power3.out', delay: i * 0.03 });
      gsap.to(p.photo.material, { opacity: 0.25, duration: 0.6, ease: 'power3.out', delay: i * 0.03 });
      gsap.to(p.frame.material, { opacity: 0.04, duration: 0.6, ease: 'power3.out', delay: i * 0.03 });
    });
  }

  /* ---- load album ---- */
  function loadAlbum(key, animate) {
    S.album = key;
    const urls = albumPhotos(key);
    if (animate && planes.length) {
      S.animating = true;
      animateOut(() => {
        clearRing(); buildRing(urls);
        animateIn();
        S.target = 0; S.current = 0;
        S.animating = false; updateUI();
      });
    } else {
      clearRing(); buildRing(urls);
      S.target = 0; S.current = 0; updateUI();
    }
  }

  /* ---- front detection ---- */
  function getFront() {
    if (!S.N) return 0;
    const step = (Math.PI * 2) / S.N;
    let i = Math.round(S.current / step) % S.N;
    if (i < 0) i += S.N;
    return i;
  }

  /* ---- ui ---- */
  function updateUI() {
    const meta = galleryMeta[S.album] || { titleAr: '', titleLa: S.album };
    if (titleEl) {
      titleEl.innerHTML = (meta.titleAr ? `<span class="rt-ar">${meta.titleAr}</span> ` : '') + 
                          `<span class="rt-la">${meta.titleLa}</span>`;
    }
    const watermarkEl = document.getElementById('ring-watermark');
    if (watermarkEl) watermarkEl.textContent = meta.titleLa;
    if (indexEl && S.N)
      indexEl.textContent = String(S.front + 1).padStart(2, '0') + ' — ' + String(S.N).padStart(2, '0');
  }

  /* ---- per-frame plane visuals ---- */
  function updatePlanes() {
    if (!S.N) return;
    const step = (Math.PI * 2) / S.N;
    planes.forEach((p, i) => {
      let d = (i * step - S.current) % (Math.PI * 2);
      d = ((d + Math.PI * 3) % (Math.PI * 2)) - Math.PI;
      const t = Math.abs(d) / Math.PI;       // 0 = front, 1 = back

      // Scale: front = 1.2, back drops to 0.65
      const sc = 1.2 - t * 0.55;
      p.group.scale.setScalar(Math.max(sc, 0.65));

      if (!S.animating) {
        // Opacity: front = 1.0, back = 0.2 (sharp falloff)
        const pow = t * t;                    // quadratic falloff for sharper contrast
        p.photo.material.opacity = 1.0 - pow * 0.8;
        // Frame glows on front image
        p.frame.material.opacity = t < 0.15 ? 0.08 : 0.03;
      }
    });
    const f = getFront();
    if (f !== S.front) { S.front = f; updateUI(); }
  }

  /* ---- render loop ---- */
  (function loop() {
    requestAnimationFrame(loop);
    if (!S.visible) return;

    S.current += (S.target - S.current) * LERP;
    if (S.idle && !S.dragging && !S.animating) S.target += IDLE_SPD;

    ringGrp.rotation.y = S.current;
    S.tiltX += (S.myN * TILT_AMT - S.tiltX) * TILT_LERP;
    ringGrp.rotation.x = S.tiltX;

    updatePlanes();
    renderer.render(scene, camera);
  })();

  /* ---- drag ---- */
  let lastX = 0, vel = 0;

  cvs.addEventListener('pointerdown', e => {
    S.dragging = true; S.idle = false; vel = 0;
    lastX = e.clientX;
    clearTimeout(S.idleTimer);
    cvs.setPointerCapture(e.pointerId);
  });

  cvs.addEventListener('pointermove', e => {
    const rect = cvs.getBoundingClientRect();
    S.mxN = ((e.clientX - rect.left) / rect.width  - 0.5) * 2;
    S.myN = ((e.clientY - rect.top)  / rect.height - 0.5) * 2;
    if (!S.dragging) return;
    const dx = e.clientX - lastX; lastX = e.clientX;
    S.target += dx * DRAG_K;
    vel = dx * DRAG_K;
  });

  cvs.addEventListener('pointerup', e => {
    if (!S.dragging) return;
    S.dragging = false;
    cvs.releasePointerCapture(e.pointerId);
    snapTo(vel);
  });

  /* ---- snap helper ---- */
  function snapTo(v) {
    if (!S.N) return;
    const step = (Math.PI * 2) / S.N;
    const projected = S.target + v * PROJ_K;
    const snapped = Math.round(projected / step) * step;
    S.animating = true;
    gsap.to(S, { target: snapped, duration: SNAP_DUR, ease: 'power3.out',
      overwrite: true, onComplete: () => { S.animating = false; resetIdle(); }
    });
  }

  /* ---- wheel ---- */
  cvs.addEventListener('wheel', e => {
    e.preventDefault();
    S.idle = false; clearTimeout(S.idleTimer);
    if (!S.N) return;
    const step = (Math.PI * 2) / S.N;
    const dir = e.deltaY > 0 ? 1 : -1;
    const snapTarget = Math.round(S.current / step) * step + step * dir;
    S.animating = true;
    gsap.to(S, { target: snapTarget, duration: 0.8, ease: 'power3.out',
      overwrite: true, onComplete: () => { S.animating = false; resetIdle(); }
    });
  }, { passive: false });

  /* ---- idle ---- */
  function resetIdle() {
    clearTimeout(S.idleTimer);
    S.idleTimer = setTimeout(() => { S.idle = true; }, 4000);
  }

  /* ---- dock: prev / next ---- */
  function stepBy(dir) {
    S.idle = false; clearTimeout(S.idleTimer);
    if (!S.N) return;
    const step = (Math.PI * 2) / S.N;
    const snapTarget = Math.round(S.current / step) * step + step * dir;
    S.animating = true;
    gsap.to(S, { target: snapTarget, duration: SNAP_DUR, ease: 'power3.out',
      overwrite: true, onComplete: () => { S.animating = false; resetIdle(); }
    });
  }

  document.querySelector('.dock-prev')?.addEventListener('click', () => stepBy(-1));
  document.querySelector('.dock-next')?.addEventListener('click', () => stepBy(1));

  /* ---- dock: album tabs ---- */
  document.querySelectorAll('.dock-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      const key = tab.dataset.album;
      if (key === S.album) return;
      document.querySelectorAll('.dock-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const indicator = document.querySelector('.dock-tab-indicator');
      if (indicator) gsap.to(indicator, { x: tab.offsetLeft, width: tab.offsetWidth, duration: 0.4, ease: 'power3.out' });
      loadAlbum(key, true);
    });
  });

  /* ---- dock: view button ---- */
  document.querySelector('.dock-view')?.addEventListener('click', () => {
    const g = mediaData[S.album];
    if (!g) return;
    const photos = g.items.filter(i => i.type === 'photo').slice(0, MAX);
    const item = photos[S.front];
    if (!item) return;
    const fi = flatList.findIndex(f => f.key === S.album && f.item === item);
    if (fi >= 0 && typeof openLightbox === 'function') openLightbox(fi);
  });

  /* ---- intersection observer ---- */
  new IntersectionObserver(([e]) => { S.visible = e.isIntersecting; }, { threshold: 0.05 })
    .observe(section);

  /* ---- init ---- */
  loadAlbum('3as3', false);
  resetIdle(); onResize();

  // Init tab indicator position
  requestAnimationFrame(() => {
    const activeTab = document.querySelector('.dock-tab.active');
    const indicator = document.querySelector('.dock-tab-indicator');
    if (activeTab && indicator) {
      indicator.style.width = activeTab.offsetWidth + 'px';
      indicator.style.transform = `translateX(${activeTab.offsetLeft}px)`;
    }
  });

})();
