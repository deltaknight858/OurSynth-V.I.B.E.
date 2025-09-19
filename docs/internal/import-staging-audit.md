> **DEPRECATED:** This document is retained for historical reference only. See README.md for current guidance.

# Import Staging Audit (Phase 1)

Purpose: Classify everything under `import-staging/` to decide what to PROMOTE (merge into canonical repo), REBUILD (re‑implement with cleaner surface), ARCHIVE (retain read‑only for reference), or DROP (delete after confirmation).

Status: Initial pass (no files moved yet). All actions are proposals.

## Summary Matrix

| Category | Path (relative) | Proposed Action | Rationale | Follow‑Up |
|----------|-----------------|-----------------|-----------|-----------|
| Storybook config | import-staging/.storybook | DROP | Legacy SB instance; no active story usage in root | Confirm no consumers |
| Agent runtime (JS) | import-staging/agents/oursynth-agent | REBUILD | Logic belongs in future `packages/agent-core` (TS) | Define agent API contract |
| App Router monolith | import-staging/apps/app | PARTIAL PROMOTE | Extract only wizard, command-center, pathways pages/components | Map routes to new structure |
| App actions/api | import-staging/apps/app/api/* | REBUILD | Clean Next 14 app router rewrite w/ security review | List required endpoints |
| Wizard UI | import-staging/apps/app/pathways/ (and wizard/) | PROMOTE | Core differentiator; adapt to current design tokens | Add NL pipeline integration |
| Command Center | import-staging/apps/app/command-center/* | PROMOTE | Needed for orchestration UI | Refactor layout to current shell |
| Marketplace | import-staging/apps/app/marketplace/* | DEFER | Monetization later; keep reference only now | Spin off separate feature flag |
| Mesh Sim | import-staging/apps/app/mesh-sim/* | ARCHIVE | Experimental; not core to MVP | Mark as lab experiment |
| Vibe (Domain Manager) | import-staging/apps/app/vibe/* | DROP | Low immediate value | Confirm no dependencies |
| Capsules (Time Machine) | import-staging/apps/app/capsule/* | PROMOTE (SCAFFOLD) | Needed for provenance narrative | Keep UI shell only first |
| Branding manifest | import-staging/brand/* | MERGE | Move authoritative parts into `assets/brand/` if missing | Diff + unify colors (purple migration) |
| Motion lotties | import-staging/brand/motion/* | PROMOTE (ASSET) | Potential hero/illustration usage | Compress & document in motion guide |
| Static SVG (legacy) | import-staging/brand/static/* | NORMALIZE | Run through svg pipeline & re‑export | Add to inventory JSON |
| Vanilla UI kit PNGs | import-staging/assets/vanillacomponents/* | ARCHIVE | Reference-only design inspiration | Do not import into build |
| Halo UI package | import-staging/assets/packages/halo-ui | PROMOTE (CURATE) | Potential primitives (scroll area, halo effects) | Extract minimal subset |
| Analyzer package | import-staging/assets/packages/analyzer | DROP (LATER) | No current analyzer feature scope | Revisit post-MVP |
| Orchestrator package | import-staging/assets/packages/orchestrator | REBUILD | Likely replaced by simplified agent bus | Define event contract |
| Shared types | import-staging/assets/packages/shared-types | PROMOTE | TS types centralization | Merge into `packages/types` (new) |
| Studio package/app | import-staging/Studio/* | PARTIAL PROMOTE | Some reusable panels (wizard, actions) | Identify duplicates first |
| Sentient developer | import-staging/Studio/sentient-developer | ARCHIVE | High complexity; not MVP | Document architecture pointers |
| Pushable agent action | import-staging/Studio/pushable-agent-action | REBUILD | Convert to unified action plugin spec | Add plugin manifest |
| Scripts (utility) | import-staging/Studio/scripts/*.mjs | REVIEW | Some still useful (generate-registry) | Evaluate individually |
| Tests | import-staging/Studio/tests/* | ADAPT | Keep patterns; update paths after restructure | Create test harness |
| Tools (wizard ps1) | import-staging/tools/oai-wizard.ps1 | DEFER | CLI not needed for initial web UI | Revisit once agent bus stable |
| Instructions docs | import-staging/instructions/*.md | MERGE (EDIT) | Incorporate into unified docs sections | Map into `/docs/agents/` |
| Supabase client | import-staging/src/supabaseClient.ts | PROMOTE (ISOLATE) | External integration; wrap for abstraction | Add env var guard |
| Auth context | import-staging/src/authContext.tsx | PROMOTE (REFINE) | Needed for session-handling | Add type safety & fallback |
| OAI feature comps | import-staging/src/features/oai/* | PROMOTE (SELECTIVE) | Core AI interaction elements | Align with logic bar events |
| Theme tokens | import-staging/src/theme/theme.ts | MERGE | Feed into design tokens pipeline | Convert to JSON tokens |
| Debug logs | */debug.log | DROP | Noise | Remove on promotion |

## Proposed Destination Map

| Source | Destination | Notes |
|--------|-------------|-------|
| apps/app/pathways/* | components/wizard/ (and pages/wizard.tsx if page-router) | Convert to TS if JS present |
| apps/app/command-center/* | components/command-center/ | Consolidate layout |
| apps/app/capsule/* | components/capsules/ | Keep panel skeleton only initially |
| src/features/oai/* | components/ai/ | Normalize naming (AgentChat → AgentChatPanel) |
| src/authContext.tsx | lib/auth/auth-context.tsx | Add index barrel |
| src/supabaseClient.ts | lib/integrations/supabase.ts | Lazy init pattern |
| brand/motion/*.lottie.json | public/motion/ | Reference via next static path |
| brand/static/*.svg | assets/brand/ + pipeline | Maintain original filenames |
| assets/packages/halo-ui/src/* | packages/halo-ui/src/* | Only primitives actually used |
| assets/packages/shared-types/* | packages/types/* | New package folder |

## Promotion Sequence (Recommended)

1. Freeze import-staging (no further edits there).
2. Copy prioritized feature folders (wizard, command-center, oai features) into target destinations.
3. Run svg pipeline for any new SVGs introduced.
4. Introduce `packages/types` and move shared types; update import paths.
5. Integrate auth + supabase under `lib/` with environment guards.
6. Extract a minimal `halo-ui` subset (scroll area, focus ring) and publish internal package.
7. Remove duplicates & update docs references (`import-staging-*` paths) → canonical ones.
8. Delete deprecated directories after validation pass.

## Open Questions

- Keep App Router or stay with Pages until consolidation? (Default: stay with Pages for now.)
- Do we need marketplace MVP for initial launch? (Default: No; postpone.)
- Is Mesh Sim part of core narrative? (Default: Archive.)
- Confirm which halo-ui primitives are genuinely used vs aspirational.

## Next Actions (Pending Approval)

- Implement promotion script to automate copy + path rewrites.
- Generate dependency diff (import-staging vs root) to identify missing libs.
- Remove stray `debug.log` files.

---
Back: [README](../README.md)
