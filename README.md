# OurSynth Monorepo

This repo hosts the OurSynth monorepo:

- apps/
	- assist/ – Next.js App Router app wired to @oursynth/core
- packages/
	- @oursynth/core – shared UI, state, tokens, and components
	- @oursynth/agent-runtime – minimal agent runtime contract and runner
	- @oursynth/oai – tools scaffold (build pending)
	- @oursynth/mesh-node – discovery scaffold (build pending)
	- @oursynth/capsule – capsule CLI/manifest scaffold (build pending)
- scripts/ – migration, tokens, svg, deploy stubs
- components/ – local icons used by assist and docs
- docs/ – design and migration reports

## Build

- Root build: builds packages, generates tokens, then builds apps/assist.
- Some scaffolds (oai, mesh-node, capsule) are intentionally skipped if deps are missing; this doesn’t block the main build.

## Next app

- The assist app transpiles @oursynth/core and aliases it to its dist for production builds.

## Design tokens & icons

- Tokens are generated to packages/core/dist/tokens.css via `npm run labs:tokens`.
- SVG icon pipeline scripts live in scripts/ and can inventory/normalize/generate components.

## External sources integrated

- Capsule Wizard Suite (landing/studio/store): imported selectively into @oursynth/core and assist app.
- OurSynth-Core static site: assets and docs used to map brand icons/components.

## Contributing

- Commit with clear scopes. Keep ESM imports NodeNext-compatible: use .js extensions for local imports.

## Troubleshooting

- If TypeScript complains about extension imports, ensure imports use .js and `allowImportingTsExtensions` is not set.
- If Next build fails late, check for server-incompatible dynamic requires and prefer dynamic imports with `ssr: false`.
# OurSynth Core

**`OurSynth-Core`** is the foundational monorepo for the entire OurSynth ecosystem. It is the single source of truth for the **Halo UI** design system, shared state patterns, architectural documentation, and the governance tooling that all other applications (`Synth Assist`, `Aether`, etc.) consume.

---

## 📦 Repository Structure

Next.js application + supporting scripts. Some planned folders (e.g. `packages/`) will appear as promotion scripts are executed.

```
/
├── assets/
│   └── brand/              # All official SVG icons and logos
├── components/
│   ├── icons/              # Auto-generated TSX icon components
│   ├── system/             # Core primitives (Button, etc.)
│   └── auth/               # Auth-related components
├── docs/                   # All project documentation
├── lib/
│   ├── auth/               # Auth context and helpers
│   └── integrations/       # Supabase client, etc.
├── packages/
│   └── types/              # Shared TypeScript interfaces
├── components/
│   ├── ARCHITECTURE.md       # High-level system architecture
│   ├── design-system/        # Branding + tokens (replaces prior BRANDING_GUIDE.md)
│   ├── components/           # Promotion & primitives guides
│   ├── assets/               # SVG pipeline docs
│   ├── workflows/            # Promotion + user flow
│   ├── import-staging-audit.md # Classification before moves
│   └── README.md             # Index & navigation
├── pages/

For a deeper dive into the Core, see docs/CORE_OVERVIEW.md.
├── scripts/                # Build and utility scripts

---

## 🗺️ Project Roadmap

OurSynth follows a phased development approach, with each phase building upon the previous foundation:

- **Phase 0** (MVP) ✅ - Basic chat, command center, SVG pipeline
- **Phase 1** (Core) ✅ - Refactor, test generation, provenance, token sync  
- **Phase 2** (Advanced) 🟡 - Orchestrator, pathway planner, capsule, performance (90% complete)
- **Phase 3** (Monetization) 🔴 - Marketplace, brand pulse, release planner (pending Phase 2)
- **Phase 4** (Enterprise) 🆕 - Multi-tenant architecture, compliance automation, advanced AI/ML capabilities

Until that script lands: keep staging files unchanged; propose edits via docs first.

## 🚀 Getting Started

1. Clone the repo
2. Install dependencies: `npm install`
3. Run dev server: `npm run dev`
4. Visit <http://localhost:3000>

## 🔍 Design & Token Consistency

Scripts (design gate):

- `npm run lint:colors` – blocks legacy magenta hex / alias usage in runtime code.
- `npm run lint:icons` – validates gradients & flags un-tokenized stop colors.
- `npm run lint:tokens` – snapshots CSS custom property tokens and diffs changes.
- `npm run ci:design` – aggregate gate (intended for CI before merge).

Current coverage:

- [x] Color legacy scan (runtime only)
- [x] Icon gradient + legacy color scan
- [x] Token snapshot (initial baseline empty until tokens introduced)
- [ ] Token authoring script (future: generate from JSON/YAML design source)
- [ ] Enforce no direct `import-staging/` imports (ESLint rule TODO)
- [ ] ICON_CHECKLIST drift detection (script enhancement TODO)

## 🗺️ Roadmap Snapshot

| Area | Status | Next Step |
|------|--------|-----------|
| SVG Pipeline | MVP | Add report outputs & checklist sync |
| Import Promotion | Draft | Implement `scripts/promote.mjs` |
| Halo UI Primitives | Pending | Extract minimal subset |
| Agent Runtime | Planned | Define event contract & package scaffold |
| Color Migration | Active | Add lint + remove stragglers |
| **Phase 2** | In Progress | Complete D5 (docs sync & deprecations) |
| **Phase 3** | Not Started | Monetization platform development |
| **Phase 4** | Planning | Enterprise & platform maturity features |

---
Questions or proposing a new primitive? Open a doc stub under `docs/components/` first.
For detailed roadmap information, see:
- [Phase 2 Plan](./docs/roadmap/PHASE2_PLAN.md)
- [Phase 4 Plan](./docs/roadmap/PHASE4_PLAN.md) - Enterprise & Platform Maturity
- [Phase 4 Status Update](./docs/PHASE4_STATUS_UPDATE.md) - Current planning progress
