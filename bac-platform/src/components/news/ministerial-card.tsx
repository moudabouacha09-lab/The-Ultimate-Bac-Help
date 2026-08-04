// src/components/news/ministerial-card.tsx
"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { type NewsItem } from "@/data/news-data";

interface MinisterialCardProps {
  news: NewsItem;
}

export function MinisterialCard({ news }: MinisterialCardProps) {
  // Verify valid PDF URL to prevent 404 links
  const hasValidPdf =
    news.pdfUrl &&
    news.pdfUrl.startsWith("http") &&
    !news.pdfUrl.includes("undefined") &&
    !news.pdfUrl.includes("null") &&
    news.pdfUrl.endsWith(".pdf");

  return (
    <article
      style={{
        backgroundColor: "var(--card-bg)",
        border: "1px solid var(--border-color)",
        borderRadius: "1rem",
        overflow: "hidden",
        boxShadow: "var(--shadow-md, 0 8px 25px rgba(0, 0, 0, 0.08))",
        marginBottom: "2rem",
        transition: "transform 0.2s ease, box-shadow 0.2s ease"
      }}
    >
      {/* Header Image with Live Tag Overlay */}
      {news.headerImage && (
        <div style={{ position: "relative", width: "100%", height: "220px", backgroundColor: "#0f2537" }}>
          <Image
            src={news.headerImage}
            alt={news.title}
            fill
            unoptimized
            style={{ objectFit: "cover", opacity: 0.9 }}
            sizes="(max-width: 768px) 100vw, 800px"
          />
          <div
            style={{
              position: "absolute",
              top: "1rem",
              right: "1rem",
              backgroundColor: "rgba(15, 37, 55, 0.85)",
              backdropFilter: "blur(8px)",
              color: "#ffffff",
              padding: "0.35rem 0.85rem",
              borderRadius: "999px",
              fontSize: "0.78rem",
              fontWeight: "800",
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
              border: "1px solid rgba(255, 255, 255, 0.2)"
            }}
          >
            <span style={{ color: "#22c55e" }}>● بيان رسمي موثوق</span>
          </div>
        </div>
      )}

      {/* Content Area */}
      <div style={{ padding: "1.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem", flexWrap: "wrap" }}>
          <span style={{
            backgroundColor: "rgba(239, 68, 68, 0.15)",
            color: "#ef4444",
            padding: "0.25rem 0.65rem",
            borderRadius: "0.5rem",
            fontSize: "0.78rem",
            fontWeight: "800"
          }}>
            🚨 قرار وزاري
          </span>
          <span style={{ color: "var(--text-secondary)", fontSize: "0.82rem" }}>{news.date}</span>
        </div>

        <h2 style={{ color: "var(--text-primary)", fontSize: "1.25rem", margin: "0.3rem 0 0.75rem", lineHeight: "1.4", fontWeight: "800" }}>
          {news.title}
        </h2>

        <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", lineHeight: "1.6", margin: "0 0 1rem" }}>
          {news.summary}
        </p>

        {/* AI Agent Simple Explanation Box */}
        {news.simpleExplanation && (
          <div
            style={{
              backgroundColor: "rgba(37, 99, 235, 0.08)",
              borderRight: "4px solid var(--accent-color, #2563eb)",
              padding: "1rem",
              borderRadius: "0.6rem",
              marginBottom: "1.25rem"
            }}
          >
            <p style={{ margin: 0, color: "var(--text-primary)", fontSize: "0.88rem", fontWeight: "700", lineHeight: "1.6" }}>
              {news.simpleExplanation}
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", alignItems: "center" }}>
          {news.officialSourceUrl && (
            <a
              href={news.officialSourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                minHeight: "48px",
                padding: "0.6rem 1.25rem",
                borderRadius: "0.6rem",
                border: "1px solid var(--border-color)",
                backgroundColor: "var(--card-bg)",
                color: "var(--text-primary)",
                fontWeight: "700",
                fontSize: "0.88rem",
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center"
              }}
            >
              🔗 معاينة الخبر المباشر بموقع الوزارة ↗
            </a>
          )}
          {hasValidPdf && (
            <a
              href={news.pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                minHeight: "48px",
                padding: "0.6rem 1.25rem",
                borderRadius: "0.6rem",
                border: "1px solid rgba(239, 68, 68, 0.3)",
                backgroundColor: "rgba(239, 68, 68, 0.1)",
                color: "#ef4444",
                fontWeight: "700",
                fontSize: "0.88rem",
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center"
              }}
            >
              📄 تنزيل وثيقة الـ PDF الرسمية ⬇
            </a>
          )}
          {news.actionUrl && (
            <Link
              href={news.actionUrl}
              style={{
                minHeight: "48px",
                padding: "0.6rem 1.25rem",
                borderRadius: "0.6rem",
                border: "none",
                backgroundColor: "var(--accent-color, #2563eb)",
                color: "#ffffff",
                fontWeight: "700",
                fontSize: "0.88rem",
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center"
              }}
            >
              {news.actionLabel || "التفاصيل ⬅"}
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}
