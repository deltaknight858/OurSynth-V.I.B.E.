# SVG Catalog

A living catalog of SVG assets (owned + reference-only inspirations) with semantic usage guidance.

## Legend

- Status: `core` (owned), `ref` (reference-only), `derived` (planned recreation), `pending` (needs decision)
- Domain: `brand`, `ui-icon`, `layout-chrome`, `decorative`, `motion`, `pipeline`

## Key Assets (Initial Pass)

| ID / File | Status | Domain | Intent / Usage | Notes / Recreation Plan |
|-----------|--------|--------|----------------|-------------------------|
| Asset 41 (purple ring) | core | brand | Primary accent ring / focus halo | Color source for `--neonPurple` (#7B00FF). Export multiple sizes (24/48/96). |
| Asset 46 | core | decorative | Edge flare / panel corner embellishment | Convert to CSS mask + radial-gradient for themeable hue. |
| Asset 47 | core | decorative | Secondary flare variant | Pair with 46 for asymmetrical compositions. |
| Asset 48 | core | motion | Potential spinner arcs | Break into 3 path segments; animate stroke-dasharray. |
| Asset 49 | core | motion | Pipeline progress arc | Map to Logic Bar stage transitions. |
| Asset 50 | core | ui-icon | Minimal node glyph | Basis for agent node / step marker. |
| Asset 51 | core | pipeline | Stage connector element | Use as flexible inline SVG with stroke var tokens. |
| Asset 52 | core | pipeline | Terminal stage marker | Combine with glow filter for completion state. |
| Asset 53 | core | brand | Outline variant of ring | Use for inactive vs Asset 41 active ring. |
| LanguageGUI Chat Bubble | ref | ui-icon | Inspirational shape for NL editor bubble | Recreate as simplified 2-path icon (no vendor gradients). |
| LanguageGUI Sidebar Icon Set | ref | ui-icon | Layout inspiration | Re-draw in our 2px stroke system; keep naming consistent. |
| Neumorphic Panel Slice(s) | ref | decorative | Light elevation reference | Rebuild as layered box-shadow + inset highlight. |

## Pipeline Mapping (Logic Bar)

- Stage icons: derive from Asset 50 (base node) with overlay glyph (A, P, S, R, F) or semantic mini-icon.
- Connectors: Asset 51 scaled horizontally; dynamic stroke color based on stage state (pending/active/done/error).
- Progress arcs: Asset 49 partial ring segments; animate stroke offset on stage advancement.

## Token Hooks

| Semantic | Token Proposal | Source Asset |
|----------|----------------|-------------|
| Accent.Ring.Active | shape.ring.active | Asset 41 |
| Accent.Ring.Inactive | shape.ring.inactive | Asset 53 |
| Pipeline.Connector | shape.pipeline.connector | Asset 51 |
| Pipeline.Node | shape.pipeline.node | Asset 50 |
| Motion.ProgressArc | shape.motion.arc | Asset 49 |

## Recreation Guidelines

1. Strip all embedded color; use `currentColor` or CSS variables for fills/strokes.
2. Prefer strokes at 1.5px or 2px (consistent with UI density scale).
3. Avoid inline filters—reference shared `defs` with reusable blur/glow if required.
4. Provide size variants: 16, 20, 24 for UI; 48, 96 for marketing/hero.
5. Single responsibility per SVG file (no multi-icon sprites yet); plan for an icon build script later.

## Build Scripts (Planned)

- `scripts/svg-inventory.mjs`: Enumerate SVGs, emit JSON manifest (id, path, domain, status).
- `scripts/svg-normalize.mjs`: Apply SVGO, enforce attribute policy (remove fill, add role="img" if decorative vs aria-hidden).
- `scripts/generate-icon-components.mjs`: Create React/TS components with size + title props (outputs to `docs/generated/icon-components`, temporary inspection only — do not publish).

## Open Items

- [ ] Confirm additional assets needing classification (Assets 54+ if present).
- [ ] Decide whether to inline glow filters or simulate with CSS shadows.
- [ ] Add comparison snapshots (before/after normalization) once scripts exist.

Back: [Index](./index.md)
