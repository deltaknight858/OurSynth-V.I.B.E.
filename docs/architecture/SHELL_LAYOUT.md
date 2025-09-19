# SHELL_LAYOUT.md

## Command Center & Navigation

The Command Center app provides the main shell and navigation for the OurSynth ecosystem. It includes:

- **Topbar**: Brand, quick navigation links
- **Sidebar**: Section navigation (Dashboard, Notes, Notebooks, Studio, Aether, Capsules, Provenance, Assets, Components, Settings)
- **Main Viewport**: Renders the selected app or feature

### Navigation Flow
- User selects a section from the sidebar or topbar
- The corresponding app/component is rendered in the main viewport
- Navigation state is reflected in the URL and UI

### Key Components
- `CommandCenterShell.tsx`: Main shell layout
- `CommandWheel.tsx`: Visual navigation wheel
- `layout.tsx`, `page.tsx`: Section layouts and entry points

Refer to `apps/command-center/` and `docs/architecture/SECTIONS.md` for more details.