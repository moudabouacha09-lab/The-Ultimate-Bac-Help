"use client";

import { useEffect } from "react";

export function ReactiveMotion() {
  useEffect(() => {
    // 1. Reactive Refraction Tilt + Glare
    const handleGlassMouseMove = (e: MouseEvent) => {
      const card = e.currentTarget as HTMLElement;
      const rect = card.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width;
      const py = (e.clientY - rect.top) / rect.height;
      const tiltX = (py - 0.5) * -6; // max 6deg tilt
      const tiltY = (px - 0.5) * 6;

      card.style.transform = `perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateZ(8px)`;
      card.style.setProperty("--glare-x", `${px * 100}%`);
      card.style.setProperty("--glare-y", `${py * 100}%`);
    };

    const handleGlassMouseLeave = (e: MouseEvent) => {
      const card = e.currentTarget as HTMLElement;
      card.style.transform = "perspective(800px) rotateX(0) rotateY(0) translateZ(0)";
    };

    // 2. Magnetic Buttons
    const handleMagneticMouseMove = (e: MouseEvent) => {
      const btn = e.currentTarget as HTMLElement;
      const rect = btn.getBoundingClientRect();
      const relX = e.clientX - (rect.left + rect.width / 2);
      const relY = e.clientY - (rect.top + rect.height / 2);

      btn.style.transform = `translate(${relX * 0.25}px, ${relY * 0.25}px)`;
    };

    const handleMagneticMouseLeave = (e: MouseEvent) => {
      const btn = e.currentTarget as HTMLElement;
      btn.style.transform = "translate(0, 0)";
    };

    // 3. Click Ripple Effect
    const handleCardClick = (e: MouseEvent) => {
      const card = e.currentTarget as HTMLElement;
      const rect = card.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;

      const ripple = document.createElement("span");
      ripple.className = "click-ripple";
      ripple.style.width = ripple.style.height = `${size}px`;
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;

      card.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    };

    // Attach listeners dynamically
    const attachListeners = () => {
      const glassCards = document.querySelectorAll(
        ".glass-card, .file-card, .countdown-card, .apps-route-glass-card, .tool-card, .sidebar-card, .lesson-row, .subject-input-card, .quick-link-card"
      );
      glassCards.forEach((card) => {
        const el = card as HTMLElement;
        if (!el.dataset.reactiveAttached) {
          el.addEventListener("mousemove", handleGlassMouseMove as EventListener);
          el.addEventListener("mouseleave", handleGlassMouseLeave as EventListener);
          el.addEventListener("click", handleCardClick as EventListener);
          el.dataset.reactiveAttached = "true";
        }
      });

      const magneticBtns = document.querySelectorAll(
        ".btn-fluid-primary, .btn-download, .apps-premium-download-btn, .btn-app-download, .btn-preview, .btn-fluid-secondary, .file-action-download"
      );
      magneticBtns.forEach((btn) => {
        const el = btn as HTMLElement;
        if (!el.dataset.magneticAttached) {
          el.addEventListener("mousemove", handleMagneticMouseMove as EventListener);
          el.addEventListener("mouseleave", handleMagneticMouseLeave as EventListener);
          el.dataset.magneticAttached = "true";
        }
      });
    };

    // Initial attach
    attachListeners();

    // Observe DOM changes for dynamically loaded cards
    const observer = new MutationObserver(() => attachListeners());
    observer.observe(document.body, { childList: true, subtree: true });

    // 4. Scroll Entrance Animation (IntersectionObserver)
    const scrollObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-revealed");
            scrollObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    const observeScrollItems = () => {
      const items = document.querySelectorAll(
        ".section-block, .tool-card, .apps-route-glass-card, .subject-checklist-card, .progress-dashboard-card"
      );
      items.forEach((item) => {
        if (!item.classList.contains("reveal-on-scroll")) {
          item.classList.add("reveal-on-scroll");
          scrollObserver.observe(item);
        }
      });
    };

    observeScrollItems();

    return () => {
      observer.disconnect();
      scrollObserver.disconnect();
    };
  }, []);

  return null;
}
