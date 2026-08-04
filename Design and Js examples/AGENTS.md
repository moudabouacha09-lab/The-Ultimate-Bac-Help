# AGENTS.md — The Legend of 3rd Class

Context file for AI coding agents (Antigravity) working on this project. Read this before making changes.

## Project

A single-page cinematic "photo album" website for a graduating high school class in Algeria, covering two years: **2 AS 3** (2024–2025) and **3 AS 3** (2025–2026). Live at: https://legend-of-3rd-class.netlify.app/

Tone: nostalgic, emotional, "legend"-themed. Dark violet/indigo aesthetic with glowing particle background. This tone should guide any new UI/animation work — keep it cinematic and soft, not corporate or flashy.

## Tech stack

- **Plain HTML/CSS/JS.** No framework, no bundler, no build step.
- Deployed as a static site on **Netlify**.
- Fonts: Google Fonts `Outfit` (headings) + `Inter` (body), loaded via `<link>` in `<head>`.
- No external JS libraries — the particle background, lightbox, and scroll reveal are all hand-rolled in `script.js`.

Keep it dependency-free unless the user explicitly asks for a bundler/framework — introducing one is a bigger decision than a normal task and should be confirmed first.

## File structure

```
index.html      — the entire page: navbar, hero, #section-3as3, #section-2as3
                   (with sub-sections #section-adn and #section-party), footer,
                   and the lightbox modal markup
styles.css       — all styling; design tokens defined as CSS custom properties in :root
script.js        — everything else:
                     - mediaData (the content model, see below)
                     - initParticles()      canvas particle background
                     - buildGalleries()     renders gallery grids from mediaData
                     - initLightbox()       modal viewer, keyboard + swipe nav
                     - initScrollReveal()   IntersectionObserver fade-in
                     - initNavbar()         hide-on-scroll navbar + active link tracking
                     - initScrollIndicator()
```

Media files live in folders next to the site, referenced by relative path — these are **not** in the repo files shared with the agent, but they exist on the deployed site:
- `3 AS 3/`
- `2 AS 3/ملتقى ADN/`
- `2 AS 3/حفلة نهاية العام 2025/`

Do not rename or restructure these folders without also updating `basePath` in `mediaData` — that will break every image/video on the site.

## Content model (single source of truth)

Everything the galleries render comes from the `mediaData` object at the top of `script.js`:

```js
mediaData = {
  '3as3': { basePath: '3 AS 3', items: [{ type: 'photo'|'video', file: '...' }, ...] },
  'adn':  { basePath: '2 AS 3/ملتقى ADN', items: [...] },
  'party':{ basePath: '2 AS 3/حفلة نهاية العام 2025', items: [...] },
}
```

`buildGalleries()` interleaves videos among photos and renders `.gallery-item` cards; `initLightbox()` reads back from the same (reordered) list for prev/next navigation.

**To add new photos/videos:** append entries to the relevant `items` array. File names must match exactly, including spaces, parentheses, and casing — Netlify's Linux hosting is case-sensitive even though these files were likely authored on Windows.

## Design tokens (styles.css `:root`)

- Colors: `--color-primary`, `--color-accent`, `--color-glow` (all violet/indigo hues, 240–280° range)
- Backgrounds: `--bg-deep`, `--bg-dark`, `--bg-surface`, `--bg-elevated`, `--bg-glass*`
- Text: `--text-primary`, `--text-secondary`, `--text-muted`
- Radii: `--radius-sm/md/lg/xl`
- Transitions: `--transition-fast/smooth/spring` (all cubic-bezier easings — reuse these instead of inventing new ones, to keep motion consistent)

Any new UI should pull from these variables rather than hardcoding new colors, so the theme stays consistent.

## Known gotchas — read before touching these

1. **File paths are wrapped in `encodeURI()`** everywhere they're used (gallery rendering + lightbox). Keep doing this for any new media-loading code, since folder/file names contain spaces and Arabic characters.
2. **Stat counts are hardcoded and NOT derived from data.** Text like "42 Photos" / "3 Videos" in `index.html`'s section headers is hand-typed and will silently go stale whenever `mediaData` changes. Good candidate to fix by computing counts from `mediaData` at runtime instead.
3. **Mixed language content, no `dir` handling.** The page is `dir="ltr"`, but Arabic sub-section titles ("ملتقى ADN", "حفلة نهاية العام") are embedded directly with no `dir="rtl"` on those elements. Worth checking this renders correctly and isn't just relying on Unicode bidi defaults.
4. **No image optimization pipeline.** Full-resolution photos are loaded directly (only `loading="lazy"` is used). With 100+ images this will be a real performance cost — worth flagging even though it wasn't the top-requested priority.
5. Video thumbnails use a real `<video preload="metadata">` element as the "poster" rather than an actual poster image — works, but is heavier than it needs to be.

## Do not change without asking

- `basePath` values / folder names — breaks all media links site-wide.
- File names inside `mediaData` — must exactly match the real files.
- Overall page language/structure (this is a memory piece for real people — content changes should be confirmed, not just styling/behavior).

## Current focus for this session

See `TASKS.md`. Priority areas requested by the site owner: **visual design & animation polish**, and **new features — especially a better lightbox and search/filtering.**
