# Wizard Capsule Migration Plan

Goal: Bring the external "capsule wizard suite" into the OurSynth monorepo without MUI/Firebase and wire a Memory Note Node extension.

Promote/Map:

- packages → packages/wizard-capsule (types, memory API, nodes)
- pages/components → components/capsules/* (UI host panels)
- assets → assets/ (icons, images) via svg pipeline where applicable
- docs → docs/capsules/*

APIs to use:

- `@oursynth/wizard-capsule` exports `memory` (stub), `MemoryNoteNode`, types for nodes/edges/media, and `mindmap/getRelevantContext`.

Not used:

- External node_modules, root package.json, standalone tsconfig
- Old CI in .github (merge only relevant workflows)

Next steps:

1. Replace in-memory `memory` API with persistent backing (supabase or file-based) behind the same interface.
2. Drop in the Memory Note Node implementation under `packages/wizard-capsule/src/nodes/` and export from `index.ts`.
3. Integrate the UI into the wizard flow (see `components/wizard/PathwaysWizard.tsx`).
