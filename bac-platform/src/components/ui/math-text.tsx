// src/components/ui/math-text.tsx
"use client";

import React from "react";
import katex from "katex";

interface MathTextProps {
  text: string;
  className?: string;
}

// Helper to render KaTeX safely with scrollable wrapper
function renderMath(math: string, displayMode: boolean): React.ReactNode {
  try {
    const html = katex.renderToString(math, {
      displayMode,
      throwOnError: false,
    });
    if (displayMode) {
      return (
        <div
          className="katex-display-wrapper"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      );
    }
    return (
      <span
        className="katex-inline-wrapper"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  } catch {
    return <code className="math-code">{math}</code>;
  }
}

// Helper to parse inline markdown elements (**bold**, *italic*, `code`, and $math$)
function parseInlineMarkdown(text: string): React.ReactNode[] {
  // Regex to match $...$ LaTeX, **bold**, *italic*, and `code`
  const regex = /(\$[^\$]+?\$|\*\*[^*]+?\*\*|\*[^*]+?\*|`[^`]+?`)/g;
  const tokens = text.split(regex);

  return tokens.map((token, idx) => {
    if (!token) return null;

    // Inline LaTeX $...$
    if (token.startsWith("$") && token.endsWith("$") && token.length > 1) {
      const math = token.slice(1, -1).trim();
      return <React.Fragment key={idx}>{renderMath(math, false)}</React.Fragment>;
    }

    // Bold **...**
    if (token.startsWith("**") && token.endsWith("**") && token.length > 3) {
      const content = token.slice(2, -2);
      return (
        <strong key={idx} className="math-bold">
          {parseInlineMarkdown(content)}
        </strong>
      );
    }

    // Italic *...*
    if (token.startsWith("*") && token.endsWith("*") && token.length > 2) {
      const content = token.slice(1, -1);
      return (
        <em key={idx} className="math-italic">
          {parseInlineMarkdown(content)}
        </em>
      );
    }

    // Code `...`
    if (token.startsWith("`") && token.endsWith("`") && token.length > 2) {
      const content = token.slice(1, -1);
      return (
        <code key={idx} className="math-code">
          {content}
        </code>
      );
    }

    return <React.Fragment key={idx}>{token}</React.Fragment>;
  });
}

interface MathTextProps {
  text: string;
  className?: string;
  inline?: boolean;
}

export function MathText({ text, className = "", inline = false }: MathTextProps) {
  if (!text) return null;

  const isMultiBlock =
    !inline &&
    (text.includes("\n") ||
      text.includes("$$") ||
      text.includes("###") ||
      text.includes("####") ||
      text.includes("---") ||
      /^\s*[*•-]\s+/m.test(text));

  // If inline or single short phrase: render pure inline span with zero <div> or <p>
  if (!isMultiBlock) {
    return (
      <span className={`math-inline-text ${className}`} style={{ direction: "rtl" }}>
        {parseInlineMarkdown(text)}
      </span>
    );
  }

  // Split text by display math blocks $$...$$
  const displayBlocks = text.split(/(\$\$[\s\S]*?\$\$)/g);

  return (
    <div className={`math-text-container ${className}`}>
      {displayBlocks.map((block, bIdx) => {
        if (!block) return null;

        // Display LaTeX block
        if (block.startsWith("$$") && block.endsWith("$$")) {
          const math = block.slice(2, -2).trim();
          return <React.Fragment key={bIdx}>{renderMath(math, true)}</React.Fragment>;
        }

        // Standard text lines
        const lines = block.split(/\r?\n/);

        return (
          <div key={bIdx} className="math-block-text">
            {lines.map((line, lIdx) => {
              const trimmed = line.trim();

              if (!trimmed) {
                return <div key={lIdx} className="math-empty-line" />;
              }

              // Divider ---
              if (trimmed === "---" || trimmed === "***") {
                return <hr key={lIdx} className="math-divider" />;
              }

              // Headings #### or ### or ##
              if (trimmed.startsWith("#### ")) {
                return (
                  <h4 key={lIdx} className="math-h4">
                    {parseInlineMarkdown(trimmed.slice(5))}
                  </h4>
                );
              }
              if (trimmed.startsWith("### ")) {
                return (
                  <h3 key={lIdx} className="math-h3">
                    {parseInlineMarkdown(trimmed.slice(4))}
                  </h3>
                );
              }
              if (trimmed.startsWith("## ")) {
                return (
                  <h2 key={lIdx} className="math-h2">
                    {parseInlineMarkdown(trimmed.slice(3))}
                  </h2>
                );
              }

              // List items (* or - or •)
              const listMatch = line.match(/^(\s*)([*•-]\s+)(.*)$/);
              if (listMatch) {
                const indentLevel = Math.min(Math.floor(listMatch[1].length / 2), 4);
                return (
                  <div
                    key={lIdx}
                    className="math-list-item"
                    style={{ marginInlineStart: `${indentLevel * 1.25}rem` }}
                  >
                    <span className="math-bullet">•</span>
                    <span className="math-list-content">
                      {parseInlineMarkdown(listMatch[3])}
                    </span>
                  </div>
                );
              }

              // Regular paragraph line rendered as div.math-paragraph to prevent DOM nesting errors
              return (
                <div key={lIdx} className="math-paragraph">
                  {parseInlineMarkdown(line)}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
