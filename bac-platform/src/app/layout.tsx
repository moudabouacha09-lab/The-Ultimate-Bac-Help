import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "katex/dist/katex.min.css";
import "./styles.css";
import { SpacetimeGridBackground } from "@/components/effects/spacetime-grid-background";
import { CursorAurora } from "@/components/effects/cursor-aurora";
import { InteractiveParticles } from "@/components/effects/interactive-particles";
import { ReactiveMotion } from "@/components/effects/reactive-motion";

const cairo = Cairo({ subsets: ["arabic", "latin"], variable: "--font-cairo", display: "swap", adjustFontFallback: false, fallback: ["system-ui", "sans-serif"] });

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
        if (stored === 'dark' || stored === 'light') {
          document.documentElement.setAttribute('data-theme', stored);
        } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
          document.documentElement.setAttribute('data-theme', 'dark');
        }
      } catch (e) {}
    })();
  `;

  return (
    <html lang="ar" dir="rtl" className={cairo.variable} suppressHydrationWarning>
      <head>
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
