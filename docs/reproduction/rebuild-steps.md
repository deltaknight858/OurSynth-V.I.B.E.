> **DEPRECATED:** This document is retained for historical reference only. See README.md for current guidance.

## Rebuild Steps (Deterministic)

1. Clone repository & install deps (`pnpm install` or `npm ci`).
2. Ensure Node LTS; enable Corepack if using pnpm.
3. Generate tokens: `node scripts/build_tokens.mjs` (future).
4. Optimize + register SVGs: `node scripts/generate_svg_registry.mjs`.
5. Run dev server: `pnpm dev`.
6. Open `/labs` dashboard; verify primitives render.
7. Run promotion script for a sample component.
8. Execute minimal test suite.
9. Build production bundle.
10. Deploy (platform TBD) ensuring `public/brand` assets bundled.

### Integrity Checks
- No TODO markers in promoted code.
- All primitives import only tokens.
- Registry export count matches optimized SVG file count.
