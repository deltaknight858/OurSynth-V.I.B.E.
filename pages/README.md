# Pages Directory

This folder contains all top-level and nested pages for the OurSynth ecosystem app. Pages are implemented as React components and support both static and dynamic routing.

## Structure
- Each file or folder represents a route in the app (e.g., `about.js` → `/about`, `agents/phase3.tsx` → `/agents/phase3`).
- Special files:
  - `_app.tsx`: Customizes the root app component (global providers, layout).
  - `_document.tsx`: Customizes the HTML document structure.
  - `[slug].js`: Dynamic route for arbitrary slugs.

## Key Pages
- `index.js` / `index.tsx`: Home page
- `about.js`: About page
- `command-center.js`: Command Center
- `capsules.tsx`: Capsules overview
- `pathways-wizard.tsx`: Pathways Wizard
- `studio.tsx`: Studio workspace
- `settings.tsx`: User/app settings
- `agents/phase3.tsx`: Agent dashboard

## Routing
- Uses Next.js file-based routing for both static and dynamic routes.
- Nested folders (e.g., `agents/`, `labs/`, `api/`) represent sub-routes and API endpoints.

## Usage
- Add new pages by creating a `.js` or `.tsx` file in this directory.
- For dynamic routes, use bracket notation (e.g., `[slug].js`).
- For shared layouts or providers, update `_app.tsx`.

---
For more details, see the main documentation in `docs/architecture/overview.md` and `docs/SHELL_LAYOUT.md`.
