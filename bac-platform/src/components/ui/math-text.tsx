// src/components/ui/math-text.tsx
"use client";

import React from "react";
import katex from "katex";

interface MathTextProps {
  text: string;
  className?: string;
}

export function MathText({ text, className = "" }: MathTextProps) {
  if (!text) return null;

  // Split text by LaTeX wrappers $$...$$ and $...$
  const parts = text.split(/(\$\$.*?\$\$|\$[^\$]+\$)/gs);

  return (
    <span className={`math-text-container ${className}`} style={{ direction: "rtl" }}>
      {parts.map((part, index) => {
        // Display mode $$...$$
        if (part.startsWith("$$") && part.endsWith("$$")) {
          const math = part.slice(2, -2).trim();
          try {
            const html = katex.renderToString(math, {
              displayMode: true,
              throwOnError: false,
            });
            return (
              <span
                key={index}
                style={{ display: "block", margin: "0.75rem 0", direction: "ltr" }}
                dangerouslySetInnerHTML={{ __html: html }}
              />
            );
          } catch {
            return <code key={index}>{part}</code>;
          }
        }

        // Inline mode $...$
        if (part.startsWith("$") && part.endsWith("$")) {
          const math = part.slice(1, -1).trim();
          try {
            const html = katex.renderToString(math, {
              displayMode: false,
              throwOnError: false,
            });
            return (
              <span
                key={index}
                style={{ display: "inline-block", direction: "ltr", padding: "0 0.2rem" }}
                dangerouslySetInnerHTML={{ __html: html }}
              />
            );
          } catch {
            return <code key={index}>{part}</code>;
          }
        }

        // Plain text
        return <React.Fragment key={index}>{part}</React.Fragment>;
      })}
    </span>
  );
}
