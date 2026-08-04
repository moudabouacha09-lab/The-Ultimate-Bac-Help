// src/components/news/news-feed.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { type NewsItem, type NewsCategory, categoryLabels, badgeLabels } from "@/data/news-data";
import { MathText } from "@/components/ui/math-text";

interface NewsFeedProps {
  items: NewsItem[];
}

export function NewsFeed({ items }: NewsFeedProps) {
  const [selectedCategory, setSelectedCategory] = useState<NewsCategory | "all">("all");
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({});

  const filteredItems = items.filter((item) => {
    if (selectedCategory === "all") return true;
    return item.category === selectedCategory;
  });

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <section className="news-feed-section" aria-label="تغذية الأخبار والتحديثات">
      {/* Category Tabs */}
      <div
        style={{
          display: "flex",
          gap: "0.5rem",
          overflowX: "auto",
          paddingBottom: "0.5rem",
          marginBottom: "1.5rem",
          scrollbarWidth: "none"
        }}
      >
        {(Object.keys(categoryLabels) as (NewsCategory | "all")[]).map((catKey) => {
          const cat = categoryLabels[catKey];
          const isActive = selectedCategory === catKey;
          return (
            <button
              key={catKey}
              onClick={() => setSelectedCategory(catKey)}
              style={{
                minHeight: "44px",
                padding: "0.5rem 1.1rem",
                borderRadius: "999px",
                border: "1px solid var(--border-color)",
                backgroundColor: isActive ? "var(--accent-color, #2563eb)" : "var(--card-bg)",
                color: isActive ? "#ffffff" : "var(--text-primary)",
                fontWeight: "700",
                fontSize: "0.85rem",
                cursor: "pointer",
                whiteSpace: "nowrap",
                display: "flex",
                alignItems: "center",
                gap: "0.4rem",
                transition: "all 0.2s ease"
              }}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* News Cards Grid */}
      <div style={{ display: "grid", gap: "1rem" }}>
        {filteredItems.map((item) => {
          const badge = badgeLabels[item.badge];
          const isExpanded = expandedIds[item.id] ?? false;

          return (
            <article
              key={item.id}
              className="calculator-card"
              style={{
                padding: "1.25rem",
                transition: "all 0.2s ease"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "0.75rem", marginBottom: "0.5rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
                  <span
                    style={{
                      backgroundColor: badge.bg,
                      color: badge.color,
                      padding: "0.2rem 0.6rem",
                      borderRadius: "0.4rem",
                      fontSize: "0.75rem",
                      fontWeight: "800"
                    }}
                  >
                    {badge.label}
                  </span>
                  <span style={{ fontSize: "0.78rem", color: "var(--text-secondary)" }}>{item.date}</span>
                </div>
                {item.icon && <span style={{ fontSize: "1.25rem" }}>{item.icon}</span>}
              </div>

              <h3 style={{ fontSize: "1.1rem", color: "var(--text-primary)", margin: "0.25rem 0 0.5rem", lineHeight: "1.5", fontWeight: "800" }}>
                <MathText text={item.title} />
              </h3>

              <p style={{ color: "var(--text-secondary)", fontSize: "0.92rem", lineHeight: "1.6", margin: "0 0 0.75rem" }}>
                <MathText text={item.summary} />
              </p>

              {/* Expandable Details */}
              {isExpanded && item.contentDetails && (
                <div
                  style={{
                    padding: "1rem",
                    backgroundColor: "var(--card-bg)",
                    border: "1px solid var(--border-color)",
                    borderRadius: "0.65rem",
                    marginBottom: "0.75rem",
                    fontSize: "0.9rem",
                    lineHeight: "1.7",
                    color: "var(--text-primary)",
                    whiteSpace: "pre-line"
                  }}
                >
                  <MathText text={item.contentDetails} />
                </div>
              )}

              {/* Bottom Actions Bar */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "0.75rem", flexWrap: "wrap", marginTop: "0.5rem" }}>
                {item.contentDetails ? (
                  <button
                    onClick={() => toggleExpand(item.id)}
                    style={{
                      minHeight: "40px",
                      padding: "0.4rem 0.85rem",
                      backgroundColor: "transparent",
                      border: "none",
                      color: "var(--accent-color, #2563eb)",
                      fontWeight: "700",
                      fontSize: "0.85rem",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.3rem"
                    }}
                  >
                    {isExpanded ? "طوي التفاصيل 🔼" : "قراءة الخبر كاملاً 🔽"}
                  </button>
                ) : <div />}

                {item.actionUrl && (
                  <Link
                    href={item.actionUrl}
                    style={{
                      minHeight: "44px",
                      padding: "0.5rem 1rem",
                      borderRadius: "0.55rem",
                      backgroundColor: "var(--accent-color, #2563eb)",
                      color: "#ffffff",
                      fontWeight: "700",
                      fontSize: "0.85rem",
                      textDecoration: "none",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.4rem"
                    }}
                  >
                    {item.actionLabel || "انتقل للأداة ⬅"}
                  </Link>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
