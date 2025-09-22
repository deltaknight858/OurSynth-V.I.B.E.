# OurSynth-Eco Navigation & Integration

## Sidebar

All apps (new + existing) are visible in sidebar, routed via shell.

## Cross-wiring

- **Provenance:** All panels log events, timeline visible everywhere.
- **Agents:** Registry/session hooks in every panel.
- **Capsule:** Export/replay from any panel with context.
- **Taskflow/Noteflow:** Integrated for provenance and agents, but unmodified.

## Example Integration Points

- Studio → logs to provenance, has agent session.
- Pathways → wizard creates projects with origin, logs to timeline.
- Capsule → provenance and SBOM included on export.
- Orchestrator → manages jobs across flows.
- Command Center → unified agent/job controls.
- MeshSim → runs simulations, links to capsule provenance.

## Panel CSS

Each panel has distinct accent color and border for visual separation, but shares global theme.

## Existing Apps

- Taskflow, Noteflow: Sidebar links, cross-wired but never overwritten.