## Component Promotion Guidelines

1. Stage raw asset/code in `import-staging/`.
2. Run `promote_component.mjs` with source path.
3. Script outputs → `labs/modules/<domain>/` + updates barrel.
4. Add/Update doc section before commit.
5. Ensure zero direct color/shadow values.
6. Add minimal unit test if logic present.
