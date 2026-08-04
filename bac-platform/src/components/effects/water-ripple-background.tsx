"use client";

import { useEffect, useRef } from "react";

// ── Internal grid resolution (kept tiny for phone perf) ──
const COLS = 160;
const ROWS = 90;
const DAMPING = 0.97;
const RIPPLE_RADIUS = 3;
const RIPPLE_STRENGTH = 180;

// ── Base palette (extracted from CSS tokens for the light theme) ──
const BASE_R = 247; // --bg-page #F7FAFC
const BASE_G = 250;
const BASE_B = 252;

const TINT_R = 24;  // --blue-600 #185FA5
const TINT_G = 95;
const TINT_B = 165;

export function WaterRippleBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    // ── Reduced motion: skip entirely ──
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    let ctx: CanvasRenderingContext2D | null;
    try {
      ctx = canvas.getContext("2d", { alpha: false });
    } catch {
      return;
    }
    if (!ctx) return;

    // ── Set internal resolution (CSS handles visual upscale) ──
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    canvas.width = Math.round(COLS * dpr);
    canvas.height = Math.round(ROWS * dpr);

    // ── Two heightmap buffers ──
    const size = COLS * ROWS;
    let prev = new Float32Array(size);
    let curr = new Float32Array(size);

    // ── ImageData for pixel output ──
    const imgData = ctx.createImageData(COLS, ROWS);
    const pixels = imgData.data;

    // ── Pre-fill base colour ──
    for (let i = 0; i < size; i++) {
      const p = i * 4;
      pixels[p] = BASE_R;
      pixels[p + 1] = BASE_G;
      pixels[p + 2] = BASE_B;
      pixels[p + 3] = 255;
    }

    // ── Drop a ripple at grid coords ──
    function dropRipple(gx: number, gy: number) {
      for (let dy = -RIPPLE_RADIUS; dy <= RIPPLE_RADIUS; dy++) {
        for (let dx = -RIPPLE_RADIUS; dx <= RIPPLE_RADIUS; dx++) {
          const nx = gx + dx;
          const ny = gy + dy;
          if (nx < 1 || nx >= COLS - 1 || ny < 1 || ny >= ROWS - 1) continue;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist > RIPPLE_RADIUS) continue;
          const fade = 1 - dist / RIPPLE_RADIUS;
          curr[ny * COLS + nx] += RIPPLE_STRENGTH * fade;
        }
      }
    }

    // ── Pointer → grid conversion + throttle ──
    let lastDrop = 0;
    const THROTTLE_MS = 16;

    function handlePointer(clientX: number, clientY: number) {
      const now = performance.now();
      if (now - lastDrop < THROTTLE_MS) return;
      lastDrop = now;

      const gx = Math.floor((clientX / window.innerWidth) * COLS);
      const gy = Math.floor((clientY / window.innerHeight) * ROWS);
      dropRipple(gx, gy);
    }

    const onMouseMove = (e: MouseEvent) => handlePointer(e.clientX, e.clientY);
    const onTouchMove = (e: TouchEvent) => {
      const t = e.touches[0];
      if (t) handlePointer(t.clientX, t.clientY);
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });

    // ── Animation loop ──
    let raf = 0;
    let running = true;

    function step() {
      if (!running) return;
      raf = requestAnimationFrame(step);
      if (!ctx) return;

      // Wave equation
      const next = new Float32Array(size);
      for (let y = 1; y < ROWS - 1; y++) {
        for (let x = 1; x < COLS - 1; x++) {
          const i = y * COLS + x;
          const avg =
            (curr[i - 1] + curr[i + 1] + curr[(y - 1) * COLS + x] + curr[(y + 1) * COLS + x]) *
            0.5;
          next[i] = (avg - prev[i]) * DAMPING;
        }
      }
      prev = curr;
      curr = next;

      // Render: convert height to refraction-style shading
      for (let y = 1; y < ROWS - 1; y++) {
        for (let x = 1; x < COLS - 1; x++) {
          const i = y * COLS + x;
          // Gradient approximation (refraction offset)
          const dx = curr[i - 1] - curr[i + 1];
          const dy = curr[(y - 1) * COLS + x] - curr[(y + 1) * COLS + x];
          const light = (dx + dy) * 0.35; // subtle intensity

          const p = i * 4;
          // Mix base with blue tint proportional to light intensity
          pixels[p] = Math.max(0, Math.min(255, BASE_R + light * 0.6 + (TINT_R - BASE_R) * Math.abs(light) * 0.008));
          pixels[p + 1] = Math.max(0, Math.min(255, BASE_G + light * 0.4 + (TINT_G - BASE_G) * Math.abs(light) * 0.008));
          pixels[p + 2] = Math.max(0, Math.min(255, BASE_B + light * 0.3 + (TINT_B - BASE_B) * Math.abs(light) * 0.008));
        }
      }

      // Blit to canvas (internal resolution; CSS stretches it)
      ctx.putImageData(imgData, 0, 0);
    }

    step();

    // ── Page Visibility: pause / resume ──
    function onVisibility() {
      if (document.hidden) {
        running = false;
        cancelAnimationFrame(raf);
      } else {
        running = true;
        step();
      }
    }
    document.addEventListener("visibilitychange", onVisibility);

    // ── Cleanup ──
    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("touchmove", onTouchMove);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
        pointerEvents: "none",
        imageRendering: "auto",
      }}
    />
  );
}
