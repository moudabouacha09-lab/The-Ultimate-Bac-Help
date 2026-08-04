# TASK: Final Verification Audit — University Orientation / "Dream University" Module

## Your role for this task

You are acting as a **meticulous data auditor and code reviewer**, not a feature builder. Do **not** add new features, redesign the UI, or refactor for style. Your only job is to verify that everything currently in this module is factually correct, traceable to a real source, and internally consistent — then report what you found.

**Do not trust any previous session's code, comments, or chat summary as ground truth — including anything labeled "official," "verified," or "production-ready" in earlier commits.** Re-derive every number and every rule independently from the two source PDFs listed below. If a previous implementation already matches the source, say so explicitly with evidence. If it doesn't, fix it and show the diff.

## Source of truth (the only three files you may cite as authority)

1. `circulaire-2026.pdf` — the official MESRS ministerial circular (210 pages). This is the ONLY valid source for: which BAC streams are allowed per domain, their priority order (أ1/أ2/أ3), and any stated eligibility conditions.
2. `BAC-2026-Fichier-des-moyennes-minimales-apres-phase-1.pdf` — the official post-Phase-1 minimum average cutoffs (350 pages). This is the ONLY valid source for numeric thresholds (Min1/Min2/Min3) per `Code Etb` + `Code Fil`.
3. `bac-domain-stream-priorities.json` — a pre-verified extraction (already cross-checked line-by-line against page 5 of the circular) of domain → stream → priority-tier mappings. You may treat this file as correct, but if you find a specialty in the codebase whose domain doesn't map cleanly onto one of the 19 entries in this file, flag it — don't guess which one it belongs to.

If any specialty/university/threshold appears in the code but you cannot find its exact row in one of these three files, treat it as **unverified** — do not assume it's correct just because it looks plausible.

## What to check, in this order

### A. Numeric threshold accuracy
For every specialty entry in the codebase with a `minThresholds` (or equivalent) field:
1. Locate its exact row in `BAC-2026-Fichier-des-moyennes-minimales-apres-phase-1.pdf` by `Code Fil`.
2. Confirm Min1/Min2/Min3 in the code match the PDF **in the same order** (do not assume priority1=Min1 without checking — we already found one case, Medicine/P01MAL01, where a prior AI attempt swapped Min1 and Min2).
3. If the PDF shows `NC` for any priority tier, the code and UI **must** represent it as "غير محسوب بعد (NC)" or equivalent — never a fabricated number. If you find any numeric value where the source says `NC`, this is a hallucination and must be removed.
4. If a filière/program exists at multiple institutions (e.g. a double-degree offered at several universities), it must be represented as **separate entries per institution**, each with its own real Min1/Min2/Min3 — never merged into one row using only one campus's numbers.
5. Spot-check at least 15 entries chosen across different categories (medical, grandes écoles, engineering, double-degree, humanities, "NC" cases) and list which ones you checked with the exact PDF values found.

### B. Weighted-average formula integrity
Search the full text of `circulaire-2026.pdf` for any explicit numeric coefficient (e.g. "×2", "÷3", "معامل") tied to the weighted-average calculation itself. As of our own review, **no such explicit arithmetic appears in the plain text** — the circular only says a digital calculator app exists inside the official platform, without publishing the coefficients as readable text.

Given this:
- Any `computeWeightedAverage`-style function with hardcoded ratios must carry a visible, unambiguous comment stating the exact ratio is **not sourced from the circular text** and should be treated as a best-effort estimate pending official confirmation.
- The user-facing UI must carry the same caveat wherever a computed "weighted average" is shown — not just in code comments. Do not let the app present these formulas as ministry-confirmed.
- If you find a way to actually confirm a coefficient from the PDFs (re-search; don't rely on our earlier negative result alone), report the exact page/quote and update the disclaimer accordingly.

### C. Stream priority-tier logic
- Confirm the code uses per-domain **ranked priority tiers** (أ1/أ2/أ3) from `bac-domain-stream-priorities.json`, not a flat unranked "allowedStreams" array. A flat array loses real information (e.g. the Math+CS domain has a completely different tier structure at ESI/ENSIA/Cyber-security school than at regular universities, even though the raw list of allowed streams looks the same).
- Confirm `Arts` (فنون) exists as a stream key in the type system. It is a real, official BAC stream (its own domain, plus explicit priority appearances in 5 other domains) and was missing from the original `Stream`/`StreamKey` type.
- Confirm no specialty silently drops a stream that the source file says should be included (even at a lower tier).

### D. Copy, tone, and disclaimers
- Remove any promotional/hype language comparing the platform favorably to the official ministry portal, or unverifiable performance claims (e.g. "opens in 0.1 seconds," "we are better than the ministry's app"). This is a study tool for real students, not a pitch deck.
- Confirm every screen showing a cutoff/threshold displays it as a **historical result**, with language equivalent to "based on last cycle's published results — not a guarantee for future years," not a deterministic "🟢 قبولك مضمون."
- Confirm there's a visible link out to the official platform (`orientation-esi.dz` for the actual wishes submission, and the ministry's own circular/portal) so students don't treat this tool as a substitute for the real registration process.
- Proofread all Arabic copy for grammatical correctness and consistent formal register (فصحى), matching the rest of the site.

### E. Code architecture and quality
- Confirm specialty data (thresholds, allowed streams, priority tiers, formula description) is stored as **plain serializable data** (JSON-shape objects), not as embedded arrow functions inside a data array — this was a flaw in an earlier draft that would block moving this data to a per-year JSON file for easy annual updates.
- Confirm a single generic evaluator function reads that data shape, rather than one bespoke function per formula category.
- Confirm every specialty record carries a traceable source reference (e.g. PDF page number, or the raw `Code Fil` used to look it up) so future audits don't have to redo this whole search from scratch.
- Confirm the new orientation page(s) reuse existing shared CSS classes/tokens (`AppShell`, existing color variables, `.file-action`-style touch targets, etc.) rather than introducing one-off inline styles that could drift from the rest of the site — check this specifically against the mobile touch-target pass already applied to `styles.css`.
- Run a TypeScript build check and report any type errors, unused variables, or console warnings.
- Confirm RTL layout and mobile responsiveness of any new components, consistent with the rest of the site.

## Required output format

Do not just silently patch things. Produce a written audit report structured exactly like this, before or alongside any code changes:

```
✅ VERIFIED CORRECT
- [item] — [exact source reference: PDF name, page, or Code Fil]

❌ FOUND AND FIXED
- [item] — [what was wrong] → [what it is now] — [exact source reference used to fix it]

⚠️ NEEDS A HUMAN DECISION
- [item] — [why you can't resolve this alone, e.g. ambiguous source, missing data, judgment call]
```

## Hard constraints (do not violate these under any circumstance)

- Never invent a numeric threshold, coefficient, or specialty code that isn't verifiably present in one of the two PDFs.
- Never collapse multiple real institutions/campuses into a single averaged or borrowed number.
- Never remove the "NC" / unverified-formula disclaimers to make the UI look more polished — accuracy takes priority over confidence.
- If you cannot verify something after a genuine search effort, say so in the "NEEDS A HUMAN DECISION" section rather than guessing.

Once this audit is complete and everything is either ✅ or explicitly flagged ⚠️, this module is considered closed and we will move on to other parts of the site.
