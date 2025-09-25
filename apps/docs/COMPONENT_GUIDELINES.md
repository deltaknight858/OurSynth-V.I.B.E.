
# Oursynth Shell Component Guidelines

## Sidebar

- Vertical stack of icon-only buttons
- Icons in Neon Purple by default, hover glow to Cyan
- Context-aware icons that swap based on active module

## Top Bar

- Slim height, spans above Shell Viewport + Rightbar
- Left: Logo (flat or outlined)
- Center: Context title
- Right: Utility buttons (theme toggle, settings, profile)
- Active context underline: animated Cyan → Purple gradient

## Shell Viewport

- Dynamic view loader (SPA pattern)
- Smooth fade/slide transitions between modules
- Optional parallax grid background

## Rightbar (Optional)

- Collapsible
- Translucent panels with subtle grid overlay
- Accent highlights in Orange for key actions

## Microinteractions

- Hover States: Neon glow ring (Purple → Cyan)
- Active States: Slight scale-up + intensified glow
- Theme Toggle: Instant dark/light mode with animated gradient sweep
- Optional Sound Design: Soft “ping” or “whoosh” for context changes

## Implementation Notes

- Lock Tokens in CSS: :root {…}
- Persistent Shell: Sidebar + Topbar never reload; only .content swaps.
- SPA-Friendly: Works with React Router, Vue Router, or vanilla JS view swapping.
- Brand-First: All colors, spacing, and typography pulled from tokens.

## Assembly Choreography

1. Initialize Shell Container
2. Create root layout with Sidebar, Topbar, Shell Viewport, and optional Rightbar
3. Inject Brand Tokens
4. Apply CSS variables for colors, gradients, and spacing
5. Render Sidebar
6. Stack icon buttons vertically
7. Apply Neon Purple default, Cyan hover glow
8. Render Topbar
9. Insert Logo, Context Title, and Utility Buttons
10. Add animated underline for active context
11. Render Shell Viewport
12. Enable dynamic module loading
13. Add fade/slide transitions
14. Optional: parallax grid background
15. Render Rightbar (if needed)
16. Make collapsible
17. Add translucent panels and Orange highlights
18. Enable Microinteractions
19. Hover glow, active scale-up, theme toggle animation
20. Optional sound effects for context changes
21. Test SPA Routing
22. Ensure smooth transitions and persistent shell
23. Finalize Typography
24. Orbitron for headers, Inter for body
25. Apply weights and spacing
26. Deploy and Lock
27. Confirm brand fidelity across modules
28. Lock layout and style for production handoff
