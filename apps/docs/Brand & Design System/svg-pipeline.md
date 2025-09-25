# SVG Asset Pipeline

This document outlines the automated workflow for processing, cleaning, and using SVG icons in the OurSynth Core project.

## Overview

The pipeline ensures all icons are consistent, optimized, and available as type-safe React components. It consists of three main stages, executed by scripts in the root directory.

### 1. Inventory (`svg-inventory.mjs`)

-   **Purpose**: To scan the `assets/brand/` directory and create a JSON manifest of all available SVG files.
-   **Script**: `npm run svg:inventory`
-   **Output**: Creates `docs/generated/svg-inventory.json`.

### 2. Normalize (`svg-normalize.mjs`)

-   **Purpose**: To clean and optimize every SVG in the inventory. It uses `svgo` to remove editor metadata, comments, and unnecessary attributes. It also ensures all icons use `fill="currentColor"` so their color can be controlled via CSS.
-   **Script**: `npm run svg:normalize`
-   **Output**: Overwrites the existing SVGs in `assets/brand/` with the cleaned versions and creates a report at `docs/generated/svg-normalize-report.json`.

### 3. Generate Components (`generate-icon-components.mjs`)

-   **Purpose**: To convert each cleaned SVG into a type-safe React (TSX) component.
-   **Script**: `npm run svg:generate`
-   **Output**: Creates TSX files in `components/icons/`. For example, `assets/brand/home-icon.svg` becomes `components/icons/HomeIcon.tsx`.

## Master Script

To run all three stages in the correct order, use the master script.

-   **Script**: `npm run svg:all`

This is the only command you need to run when adding or updating icons.

## Workflow for Adding a New Icon

1.  Add your new SVG file (e.g., `new-cool-icon.svg`) to the `assets/brand/` directory.
2.  Run the master pipeline script: `npm run svg:all`.
3.  A new component, `components/icons/NewCoolIcon.tsx`, will be created.
4.  Import and use the new component in your code: `import { NewCoolIcon } from 'components/icons';`.
5.  Update `docs/ICON_CHECKLIST.md` to include the new icon.