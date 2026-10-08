// src/components/layout/brand-logo.tsx
"use client";

import React, { useId } from "react";
import Link from "next/link";
import Image from "next/image";

interface BrandLogoProps {
  size?: "sm" | "md" | "lg";
  showSubtitle?: boolean;
  useImageCalligraphy?: boolean;
  className?: string;
}

export function BrandLogo({
  size = "md",
  showSubtitle = false,
  useImageCalligraphy = false,
  className = "",
}: BrandLogoProps) {
  const rawId = useId();
  const gradId = `goldStarGrad_${rawId.replace(/:/g, "_")}`;

  const iconSizes = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-14 h-14",
  };

  const textSizes = {
    sm: "text-base",
    md: "text-xl",
    lg: "text-2xl md:text-3xl",
  };

  if (useImageCalligraphy) {
    const imgHeights = {
      sm: "h-8 w-28",
      md: "h-10 w-36",
      lg: "h-14 w-48",
    };

    return (
      <Link
        href="/"
        className={`group inline-flex items-center select-none transition-all duration-300 focus:outline-none rounded-xl p-1 -m-1 ${className}`}
        aria-label="منصة البكالوريا - الصفحة الرئيسية"
      >
        <div className={`relative ${imgHeights[size]} overflow-hidden rounded-lg`}>
          <Image
            src="/images/logo.jpg"
            alt="منصة البكالوريا"
            fill
            sizes="200px"
            className="object-contain"
            priority
          />
        </div>
      </Link>
    );
  }

  return (
    <Link
      href="/"
      className={`group inline-flex items-center gap-3 select-none transition-all duration-300 focus:outline-none rounded-xl p-1 -m-1 ${className}`}
      aria-label="منصة البكالوريا - الصفحة الرئيسية"
    >
      {/* ── Geometric Emblem (8-pointed Golden Star + Book of Knowledge) ── */}
      <div
        className={`relative ${iconSizes[size]} shrink-0 rounded-xl bg-gradient-to-br from-primary via-primary-container to-[#00261f] p-0.5 shadow-sm transition-transform duration-300 ease-out group-hover:scale-105 group-hover:shadow-md flex items-center justify-center overflow-hidden`}
      >
        {/* Subtle radial inner glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(204,167,48,0.35)_0%,_transparent_70%)] opacity-75 group-hover:opacity-100 transition-opacity" />

        <svg
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full p-1.5 relative z-10 transition-transform duration-500 ease-out group-hover:rotate-6"
          aria-hidden="true"
        >
          {/* Outer 8-Pointed Star (Rub el Hizb) */}
          <path
            d="M24 3L28.2 9.5L35.8 8.2L37.1 15.8L43.6 20L40 26.8L43.6 33.6L37.1 37.8L35.8 45.4L28.2 44.1L24 50.6L19.8 44.1L12.2 45.4L10.9 37.8L4.4 33.6L8 26.8L4.4 20L10.9 15.8L12.2 8.2L19.8 9.5L24 3Z"
            fill={`url(#${gradId})`}
            opacity="0.9"
            transform="scale(0.85) translate(4, 4)"
          />

          {/* Central Open Book + Rising Beacon */}
          <g transform="translate(12, 14)">
            {/* Book spine and pages */}
            <path
              d="M12 18V5C9.5 3.5 4 3.5 1 5V18C4 16.5 9.5 16.5 12 18Z"
              fill="#FFFFFF"
              fillOpacity="0.95"
            />
            <path
              d="M12 18V5C14.5 3.5 20 3.5 23 5V18C20 16.5 14.5 16.5 12 18Z"
              fill="#F5F3EF"
              fillOpacity="0.9"
            />
            <path
              d="M12 5V18"
              stroke="#00342b"
              strokeWidth="1.2"
              strokeLinecap="round"
            />
            {/* Star of Excellence above book */}
            <circle cx="12" cy="0" r="2.2" fill="#FFE088" />
          </g>

          <defs>
            <linearGradient id={gradId} x1="4" y1="3" x2="44" y2="48" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FFE088" />
              <stop offset="0.5" stopColor="#CCA730" />
              <stop offset="1" stopColor="#8A6E10" />
            </linearGradient>
          </defs>
        </svg>

        {/* Shine highlight */}
        <span className="absolute -inset-full w-[200%] h-[200%] bg-gradient-to-r from-transparent via-white/20 to-transparent rotate-45 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none" />
      </div>

      {/* ── Brand Typography ── */}
      <div className="flex flex-col text-right leading-none">
        <div className="flex items-center gap-1.5">
          <span
            className={`font-headline font-bold text-primary tracking-tight transition-colors duration-200 group-hover:text-primary-container ${textSizes[size]}`}
          >
            منصة البكالوريا
          </span>
          {/* Subtle gold badge for edition */}
          <span className="bg-gradient-to-r from-tertiary-container/20 to-tertiary-fixed/30 text-tertiary font-body text-[10px] font-bold px-1.5 py-0.5 rounded border border-tertiary/20 select-none">
            2027
          </span>
        </div>

        {showSubtitle && (
          <span className="font-body text-caption text-on-surface-variant font-medium mt-1 tracking-wide">
            رفيقك الشامل نحو التفوق الدراسي
          </span>
        )}
      </div>
    </Link>
  );
}

