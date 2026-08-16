import type { Metadata } from "next";
import "katex/dist/katex.min.css";
import "./styles.css";
import { SpacetimeGridBackground } from "@/components/effects/spacetime-grid-background";
import { CursorAurora } from "@/components/effects/cursor-aurora";
import { InteractiveParticles } from "@/components/effects/interactive-particles";
import { ReactiveMotion } from "@/components/effects/reactive-motion";

export const metadata: Metadata = {
  title: "باك الجزائر | رفيقك في التحضير",
  description: "منصة مراجعة لطلبة البكالوريا الجزائرية"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  // Inline script to prevent FOUC (Flash of Unstyled Content) by setting the theme synchronously before React hydrates.
  const themeScript = `
    (function() {
      try {
        var stored = localStorage.getItem('bac-theme');
        if (stored === 'light') {
          document.documentElement.setAttribute('data-theme', 'light');
        } else if (stored === 'dark') {
          document.documentElement.setAttribute('data-theme', 'dark');
        } else if (window.matchMedia('(prefers-color-scheme: light)').matches) {
          document.documentElement.setAttribute('data-theme', 'light');
        }
      } catch (e) {}
    })();
  `;

  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
        <script id="theme-script" dangerouslySetInnerHTML={{ __html: themeScript }} suppressHydrationWarning />
      </head>
      <body>
        <SpacetimeGridBackground />
        <CursorAurora />
        <InteractiveParticles />
        <ReactiveMotion />
        {children}
      </body>
    </html>
  );
}
