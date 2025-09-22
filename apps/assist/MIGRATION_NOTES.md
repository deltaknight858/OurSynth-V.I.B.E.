## Assist App Migration Notes

Legacy `src/` at repository root will be incrementally moved here under `apps/assist/src/`.

Planned steps:
1. Copy existing pages (index, _app, _document, feature folders) into `apps/assist/src/pages`.
2. Adapt absolute import aliases to use `@oursynth/core` where possible.
3. Move shared components into `packages/core/components` if they are cross-app.
4. Keep app-specific wrappers/branding in `apps/assist/src/components`.
5. Remove old root `src/` once parity is validated.

Tracking: Phase 1 Unification.