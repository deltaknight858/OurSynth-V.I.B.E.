## OurSynth Labs Unified Blueprint

This file consolidates strategic intent and structural decisions. (User-provided content integrated & normalized.)

### 1. Goals & Principles
- Single Source of Truth
- Strict Modularity
- Automated Promotion
- Design System First (token driven)
- Agent-First Development

### 2. Directory Structure (Canonical)
```
our-synth-core-next/
├── public/
│   ├── np/
│   └── brand/
├── labs/
│   ├── layout/
│   ├── primitives/
│   ├── theme/
│   ├── svg/
│   ├── modules/
│   ├── state/
│   └── pages/
├── components/
├── scripts/
├── styles/
└── docs/
```

### 3. Dependency Control
- Single `package.json`; pinned versions.
- Renovate / Bot for dependency PRs.
- Precommit: lint, typecheck, format.

### 4. Tokens
- JSON source → build script → CSS variables under `:root[data-labs-theme]`.
- Categories: color, depth, motion, radius, spacing, shadow.

### 5. Promotion Scripts
| Script | Purpose |
|--------|---------|
| `promote_component.mjs` | Move from staging → labs + barrel export |
| `generate_svg_registry.mjs` | Optimize & wrap SVGs |
| `build_tokens.mjs` | Compile tokens to runtime layer |

### 6. Core Primitives
`Surface`, `Panel`, `NeonButton`, `IconButton`, `ScrollArea` — only sanctioned building blocks.

### 7. Feature Modules (MVP Scope)
Chat, Editor, Pathways, Agents, Provenance, Wizard, Analyzer.

### 8. Assets & Brand
All SVG → optimized + registered. Motion (Lottie/video) → `/public/brand/motion`.

### 9. Agent Rules
Copilot = code generation & refactor; Gemini = architectural reasoning; In-app agents = task execution.

### 10. Non-Negotiables
1. No raw color literals in components.
2. No ad-hoc global state; module store only.
3. Every promoted asset traced in manifest.
