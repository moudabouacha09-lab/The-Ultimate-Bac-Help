"use client";

import { useEffect } from "react";

export function CursorAurora() {
  useEffect(() => {
    let mouseX = 0.5;
    let mouseY = 0.5;
    let targetX = 0.5;
    let targetY = 0.5;
    let ticking = false;

    const handlePointerMove = (e: PointerEvent) => {
      targetX = e.clientX / window.innerWidth;
      targetY = e.clientY / window.innerHeight;
      if (!ticking) {
        requestAnimationFrame(updateAurora);
        ticking = true;
      }
    };

    const updateAurora = () => {
      mouseX += (targetX - mouseX) * 0.06;
      mouseY += (targetY - mouseY) * 0.06;
      document.documentElement.style.setProperty("--mouse-x", `${mouseX * 100}%`);
      document.documentElement.style.setProperty("--mouse-y", `${mouseY * 100}%`);
      ticking = false;
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
    };
  }, []);

  return <div className="bg-aurora" aria-hidden="true" />;
}
