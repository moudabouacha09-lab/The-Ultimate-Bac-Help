# 🇩🇿 The Ultimate BAC Help — Project Context & Resume Folder

This folder contains the complete, up-to-date documentation, sitemap, and codebase context for **The Ultimate BAC Help** (باك الجزائر | رفيقك في التحضير) platform.

---

## 📄 Key Files in This Folder

1. 📘 **`MASTER_PROJECT_RESUME.md`**: The complete, authoritative technical & functional resume of the project. Read this file for a comprehensive breakdown of the Next.js 16 architecture, 8 feature modules, 51 source files (10,501 LOC), 5 API routes, 6 visual effects engines, AI assistant integration, and the 2,346 branch University Orientation Engine across all 58 Wilayas.

2. 📦 **`codebase_bundle.txt`**: Consolidated file bundle of core application pages and components.

---

## 📊 Project at a Glance (August 2026)

| Metric | Value |
| :----- | :---- |
| **Source Files** | 51 (TSX + TS + CSS) |
| **Lines of Code** | 10,501 |
| **Total Project Files** | 330+ |
| **Total Project Size** | ~930 MB (0.93 GB) |
| **Subject Modules** | 9 (Math, Physics, Science, Arabic, French, English, Philosophy, Islamic, History/Geo) |
| **University Branches** | 2,346 across 58 Wilayas |
| **API Routes** | 5 (News Sync, AI Chat, Survey, Admin, Materials) |
| **Visual Effects** | 6 canvas/DOM engines |
| **Pages/Routes** | 22 static routes |

---

## 🚀 Recent Major Updates (August 2026)

### Architecture & Source Code
- **AI Study Assistant**: Floating Gemini-powered chat widget with 8 queries/day IP rate limiting
- **Survey & Onboarding System**: First-time visitor modal → Google Sheets webhook + Supabase admin dashboard
- **6 Visual Effects Engines**: Spacetime grid, interactive particles, cursor aurora, reactive motion, fade-in sections, water ripple
- **Dynamic Layout System**: ResizeObserver-based `--header-height` and `--bottom-nav-height` CSS variables (no hardcoded pixels)
- **KaTeX Math Engine**: Full LaTeX rendering across diagnostic quizzes and exercises

### University Orientation Engine (`/tools/orientation`)
- Full dataset of **2,346 university branches** across all **58 Wilayas** in Algeria
- Resolved 277 institution codes to accurate Wilayas & city names
- Dual-Mode UI: Predictor Explorer & Dream University Autocomplete Combobox
- 8 Sectors (`Medical`, `HigherSchool`, `Engineering`, `ENS`, `DoubleDegree`, `Professional`, `DistanceLearning`, `University`)
- 7 Career Goal Filters (`doctor` 🩺, `software_ai` 💻, `teacher` 👨‍🏫, `architect` 🏛️, `engineer` ⚙️, `business_finance` 📊, `general` 🌐)
- Multilingual Fuzzy Search Engine with Arabic/French normalization
- Official weighted average formulas ($\mathfrak{g^i}$) for Health, ST, MI, AUM, Languages, Translation

### Content Assets
- **91 Natural Sciences files** including 67 regional BAC Expérimental 2026 mock exams
- **21 Philosophy files** with original audio recordings (M4A podcasts)
- **50 History & Geography files** with interactive HTML tools
- **ENS cutoffs report**: 254 KB ground-truth data for all Higher Teacher Schools

### Mobile UI Fixes
- Fixed header overlap via ResizeObserver (Bug 1)
- Fixed bottom nav clipping (Bug 2)
- Fixed subject grid stacking — `display: block` on `<Link>` elements (Bug 3)
- Fixed subject selector horizontal scroll with RTL `Math.abs()` normalization (Bug 4)
- Fixed ministerial card image validation with domain blocklist (Bug 5)

### Deployment
- **Production Build Verification**: `npm run build` passes cleanly with `0 TypeScript errors` and 22 static routes
- **Vercel**: Auto-deploy on push to `main`

---

## 🔗 Quick Links

- **Development Server**: `cd bac-platform && npm run dev` → `http://localhost:3000`
- **Production Build**: `cd bac-platform && npm run build`
- **Main Source**: `bac-platform/src/`
- **Design System**: `bac-platform/src/app/styles.css` (3,093 lines)
- **Orientation Data**: `bac-platform/src/data/bac-branches.json` (3.37 MB)
