# TASKS.md — Improvement backlog

Prioritized for: **visual design / animations** and **new features (lightbox + search)**.
Read `AGENTS.md` first for project context and constraints.

---

## 1. Visual design & animation polish

- [ ] **Hero entrance animation** — staggered fade/slide-up for title, subtitle, and year on load (title → subtitle → year → scroll indicator), instead of appearing all at once.
- [ ] **Parallax on hero orbs** — subtle movement of `.hero-orb--1/2/3` on scroll and/or mouse move, reinforcing the "ambient glow" feel already established by the particle canvas.
- [ ] **Richer gallery-item hover state** — check current hover treatment for consistency (scale, glow border, shadow using `--shadow-glow`) across photo and video cards.
- [ ] **Shimmer/skeleton loading state** — replace the current opacity-only `.loading-placeholder` swap with a subtle shimmer while images load, matching the violet theme.
- [ ] **Animated lightbox open/close** — currently toggled via `.active` class; add a scale + fade transition using the existing `--transition-spring` token so it feels like the rest of the site.
- [ ] **Ken Burns effect on lightbox photos** — slow, subtle zoom/pan while a photo is open, fitting the "cinematic memory" theme.
- [ ] **Nav link micro-interaction** — animated underline or glow slide on hover/active instead of a flat color change.
- [ ] **"Back to top" button** — appears after scrolling past the hero, styled to match the glass/glow aesthetic.

## 2. New feature: better lightbox

- [ ] **Thumbnail filmstrip** at the bottom of the lightbox for quick jumping between items in the current gallery.
- [ ] **Pinch-to-zoom / double-tap-to-zoom** on photos for mobile users.
- [ ] **Download button** for the currently open photo/video.
- [ ] **Slideshow mode** — autoplay through the gallery with a play/pause control and adjustable interval.
- [ ] **Deep-linkable items** — update the URL hash when an item opens (e.g. `#3as3-12`) so a specific photo/video can be shared and opened directly on load.

## 3. New feature: search & filtering

- [ ] **Quick-jump / filter bar** to move between the three galleries (3 AS 3, ملتقى ADN, حفلة نهاية العام) without scrolling — data is already static/local, so this can be pure client-side JS.
- [ ] **Photos-only / Videos-only toggle** per section.
- [ ] **"Random memory" button** — opens a random photo/video from any gallery in the lightbox; fits the nostalgic, playful tone of the site.

## 4. Correctness fixes (small, high value)

- [ ] **Compute stats from data, not hardcoded text.** Replace the hand-typed "42 Photos / 3 Videos" strings in `index.html` with values calculated from `mediaData` at load time, so they can never go stale again.
- [ ] **Open Graph / social preview tags.** Currently only a meta description exists — add `og:title`, `og:description`, `og:image` (a nice group photo), and `twitter:card` so sharing the link on WhatsApp/Instagram shows a proper preview card. High value for a class memory site people will share in group chats.
- [ ] **RTL styling pass** for the Arabic sub-section headers to make sure they render and align correctly within the LTR page.

## 5. Larger scope — confirm with the user before starting

- [ ] **Comments / reactions per photo.** Would need a backend (Supabase is a natural fit, already used for the class's anonymous messaging app). This is materially bigger than everything else on this list — scope and confirm before implementing.
- [ ] **Image optimization pipeline** (resize/compress originals, serve responsive sizes). Worth doing eventually given the gallery sizes, but it's an infra change, not a quick task — flag to the user rather than doing silently.

---

## Notes for the agent

- Keep everything dependency-free (no npm/build step) unless the user opts into one.
- Reuse existing CSS custom properties (`--color-*`, `--bg-*`, `--transition-*`, `--radius-*`) for any new UI rather than introducing new ad hoc values.
- Don't touch `basePath` values or file names in `mediaData` — see `AGENTS.md` "Do not change without asking".
