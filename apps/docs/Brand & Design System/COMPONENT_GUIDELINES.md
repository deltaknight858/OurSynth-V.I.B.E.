# Oursynth Shell Component Guidelines

Status: Living, authoritative Last updated: September 24, 2025

See Also:

Primitives

Brand Guidelines

Shell Layout

Glossary

Engineering Standards

Sidebar

The sidebar is a persistent vertical navigation panel rendered inside the Shell layout. It provides access to core tools, agents, and workspace views.

File

apps/shell/components/Sidebar.tsx

Behavior

Fixed position on left

Collapsible (via toggle button)

Highlights active route

Supports nested groups

Contents

Logo

Navigation items (Tracker, Agents, Docs, Market, Settings)

Agent Ball (optional)

Styling

Uses RadialCommandCenter.css for shared neon/glass styles

Theme-aware (dark/light)

Motion-aware (respects prefers-reduced-motion)

Notes

Navigation items are hydrated from registry.json

Agent Ball glows when agents are active

Sidebar state (collapsed/expanded) is stored in local storage

Header

The header is a horizontal bar at the top of the Shell layout. It provides context, controls, and status indicators.

File

apps/shell/components/Header.tsx

Behavior

Fixed position at top

Shows current workspace or agent

Includes search, notifications, and user menu

Styling

Theme-aware

Uses shared layout tokens

ShellApp

The ShellApp is the top-level layout wrapper for all pages in the V.I.B.E. monorepo. It includes the sidebar, header, and command wheel.

File

apps/shell/ShellApp.tsx

Behavior

Wraps all routes

Provides consistent chrome

Hydrates command wheel

Notes

Use ShellApp in pages/ to ensure consistent layout

Wheel actions are filtered via registry.json

Best Practices

Keep Shell components declarative

Avoid hard-coded routes or actions

Respect theme and motion preferences

Use design tokens from packages/core/tokens

Glossary

Shell: The layout wrapper including sidebar, header, and wheel

Chrome: Visual UI frame around content

Agent Ball: Floating avatar indicating agent activity

Command Wheel: Radial UI for invoking agents and actions
