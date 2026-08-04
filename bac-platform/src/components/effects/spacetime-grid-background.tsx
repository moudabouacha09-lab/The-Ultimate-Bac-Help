"use client";

import { useEffect, useRef } from "react";

// ── Tuning constants ──
const CELL_SIZE = 50;        // px between grid lines (recomputed on resize)
const WARP_STRENGTH = 22;    // max displacement in px
const WARP_FALLOFF = 0.008;  // inverse-distance falloff factor
const LERP_SPEED = 0.08;     // cursor smoothing per frame
const LINE_OPACITY = 0.14;   // grid line alpha
const GLOW_OPACITY = 0.25;   // cursor glow alpha
const GLOW_RADIUS = 60;      // cursor glow size

export function SpacetimeGridBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    // ── Reduced motion: skip entirely ──
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    let ctx: CanvasRenderingContext2D | null;
    try {
      ctx = canvas.getContext("2d", { alpha: true });
    } catch {
      return;
    }
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);

    // ── Grid state ──
    let cols = 0;
    let rows = 0;
    let cw = 0;
    let ch = 0;

    function resize() {
      cw = window.innerWidth;
      ch = window.innerHeight;
      canvas!.width = Math.round(cw * dpr);
      canvas!.height = Math.round(ch * dpr);
      cols = Math.ceil(cw / CELL_SIZE) + 2;
      rows = Math.ceil(ch / CELL_SIZE) + 2;
    }
    resize();
    window.addEventListener("resize", resize, { passive: true });

    // ── Theme tracking ──
    let isDark = document.documentElement.getAttribute("data-theme") === "dark";
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.attributeName === "data-theme") {
          isDark = document.documentElement.getAttribute("data-theme") === "dark";
        }
      }
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

    // ── Smoothed cursor tracking ──
    let targetX = cw / 2;
    let targetY = ch / 2;
    let cursorX = targetX;
    let cursorY = targetY;
    let hasMoved = false;

    function handlePointer(clientX: number, clientY: number) {
      targetX = clientX;
      targetY = clientY;
      hasMoved = true;
    }

    const onMouseMove = (e: MouseEvent) => handlePointer(e.clientX, e.clientY);
    const onTouchMove = (e: TouchEvent) => {
      const t = e.touches[0];
      if (t) handlePointer(t.clientX, t.clientY);
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });

    // ── Gravity-well displacement for a single point ──
    function displace(px: number, py: number): [number, number] {
      const dx = px - cursorX;
      const dy = py - cursorY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const force = WARP_STRENGTH / (dist * WARP_FALLOFF + 1);

      if (dist < 1) return [px, py];

      // Pull points toward cursor (gravity-well / rubber-sheet sinking effect)
      const nx = dx / dist;
      const ny = dy / dist;
      return [px - nx * force, py - ny * force];
    }

    // ── Animation loop ──
    let raf = 0;
    let running = true;

    function draw() {
      if (!running) return;
      raf = requestAnimationFrame(draw);
      if (!ctx) return;

      // Smooth cursor lerp
      cursorX += (targetX - cursorX) * LERP_SPEED;
      cursorY += (targetY - cursorY) * LERP_SPEED;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, cw, ch);

      // Grid line style
      // Dark mode: brighter cyan/blue lines with slightly higher opacity
      ctx.strokeStyle = isDark ? `rgba(56, 189, 248, ${LINE_OPACITY * 1.5})` : `rgba(24, 95, 165, ${LINE_OPACITY})`;
      ctx.lineWidth = 0.8;
      ctx.lineJoin = "round";

      // Compute displaced grid points
      const startX = -CELL_SIZE;
      const startY = -CELL_SIZE;

      // Cache displaced points for column-pass reuse
      const grid: [number, number][][] = [];
      for (let r = 0; r < rows; r++) {
        grid[r] = [];
        for (let c = 0; c < cols; c++) {
          const baseX = startX + c * CELL_SIZE;
          const baseY = startY + r * CELL_SIZE;
          if (hasMoved) {
            grid[r][c] = displace(baseX, baseY);
          } else {
            grid[r][c] = [baseX, baseY];
          }
        }
      }

      // Draw horizontal lines (row polylines)
      for (let r = 0; r < rows; r++) {
        ctx.beginPath();
        for (let c = 0; c < cols; c++) {
          const [x, y] = grid[r][c];
          if (c === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      // Draw vertical lines (column polylines)
      for (let c = 0; c < cols; c++) {
        ctx.beginPath();
        for (let r = 0; r < rows; r++) {
          const [x, y] = grid[r][c];
          if (r === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      // Subtle glow at cursor position
      if (hasMoved) {
        const gradient = ctx.createRadialGradient(
          cursorX, cursorY, 0,
          cursorX, cursorY, GLOW_RADIUS
        );
        const glowColor = isDark ? `rgba(56, 189, 248, ${GLOW_OPACITY})` : `rgba(14, 165, 233, ${GLOW_OPACITY})`;
        const glowColorTransparent = isDark ? "rgba(56, 189, 248, 0)" : "rgba(14, 165, 233, 0)";
        
        gradient.addColorStop(0, glowColor);
        gradient.addColorStop(1, glowColorTransparent);
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(cursorX, cursorY, GLOW_RADIUS, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    draw();

    // ── Page Visibility: pause / resume ──
    function onVisibility() {
      if (document.hidden) {
        running = false;
        cancelAnimationFrame(raf);
      } else {
        running = true;
        draw();
      }
    }
    document.addEventListener("visibilitychange", onVisibility);

    // ── Cleanup ──
    return () => {
      running = false;
      observer.disconnect();
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("resize", resize);
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
        width: "100vw",
        height: "100vh",
        zIndex: 0,
        pointerEvents: "none",
      }}
    />
  );
}
