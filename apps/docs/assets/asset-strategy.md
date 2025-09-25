# Asset & SVG Strategy

This document defines how visual assets (SVG, PNG, Lottie, etc.) are classified, transformed, and promoted into the runtime of OurSynth.

## 1. Classification Buckets
| Bucket | Path Prefix | Runtime Usage | Notes |
|--------|-------------|---------------|-------|
| Brand Canonical | `/assets/brand` | Yes | Source of truth (icons, wordmark, status glyphs) |
| Vendor / Reference Only | `/assets/vendor/**` | No (build fails if imported) | Inspiration & structural study |
| Experimental (Labs) | `/labs/**` | Not by default | Must be promoted via pipeline |
| Promoted Runtime | `/packages/ui/**` | Yes | Token + a11y enforced |

## 2. Promotion Pipeline (Summary)
1. Inventory & hash scan (scripts/svg-inventory.mjs)
2. Optimize (SVGO config – preserve viewBox, strip width/height)
3. Classify (icon / structural / decorative / background)
4. If icon → convert to React component (scripts/generate-icon-components.mjs)
5. Add entry to `LICENSE_AUDIT.md` (origin + transformation)
6. Merge new tokens if color/depth expansions required

## 3. Adaptation Rules
- Metallic gradients → replaced with CSS-driven glass + neon edge (tokens: `--color-accent-cyan`, `--color-accent-purple` [alias: `--color-accent-magenta` during migration])
- Stroke normalization: 1.5px (< 32px), 2px (≥ 32px)
- Never inline reference-only SVG from Language GUI kit; recreate geometry if needed.

## 4. CI Guardrails (Planned)
| Check | Action |
|-------|--------|
| Import path contains `/assets/vendor` | Fail build |
| Non-optimized SVG (> 10KB & not decorative) | Warn |
| Duplicate hash across promoted icons | Fail |