# Scripts Directory

This folder contains all build, migration, lint, and asset management scripts for the OurSynth ecosystem.

## Structure
- Each `.mjs`, `.cjs`, or `.js` file is a standalone script for a specific task.
- The `scripts/` subfolder contains additional scripts for icon generation and SVG inventory.

## Key Scripts
- `build_tokens.mjs`: Compiles design tokens for use in CSS and JS.
- `promote.mjs`: Promotes staged components/assets to production.
- `cleanup_assets.cjs`: Cleans up unused or deprecated assets.
- `generate-icon-checklist.mjs`: Generates a checklist of icon assets.
- `svg-inventory.mjs`: Creates an inventory of SVG assets.
- `ci-guard-*.mjs`: CI scripts for enforcing standards and preventing errors.
- `migrate_capsule_suite.mjs`: Migrates capsule suite assets and code.
- `tokens-diff.mjs`: Diffs token changes for review.

## Usage
- Run scripts using Node.js: `node scriptname.mjs`
- For CI scripts, integrate with your CI/CD pipeline as needed.
- See script comments for specific usage instructions and options.

---
For more details, see the main documentation in `docs/architecture/overview.md` and `docs/SHELL_LAYOUT.md`.
