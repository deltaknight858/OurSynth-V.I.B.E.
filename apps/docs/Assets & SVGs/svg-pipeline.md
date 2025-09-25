# SVG Pipeline

## Steps

1. Place raw SVGs in `assets/brand` (or a temporary `assets/staging` folder before promotion).
2. Run inventory: `npm run svg:inventory` (generates `docs/generated/svg-inventory.json`).
3. Normalize + optimize: `npm run svg:normalize` (SVGO, fill→currentColor, report at `docs/generated/svg-normalize-report.json`).
4. Generate TSX icon components: `npm run svg:generate` (outputs to `components/icons/`, report at `docs/generated/svg-component-report.json`).
5. (Optional one-shot) `npm run svg:all` to execute the full pipeline.
6. Import icons via `import { Logo, HomeIcon } from '@/components/icons';` then `<Logo size={48} />`.

## Rules

- Do NOT commit raw vendor/reference assets; only normalized outputs.
- All fills default to `currentColor` unless semantic multi-color (must be justified in PR).
- Preserve `viewBox`; no fixed width/height in component wrapper (sizing via `size` prop).
- Auto-generated header comment stays intact (regeneration overwrites manual edits).
- For removal: delete SVG + component + re-run `svg:inventory` to update counts.

## Reports

- Inventory: `docs/generated/svg-inventory.json`
- Normalize: `docs/generated/svg-normalize-report.json`
- Components: `docs/generated/svg-component-report.json`

Use `npm run report:svg` to refresh all reports without re-running unrelated build steps.
