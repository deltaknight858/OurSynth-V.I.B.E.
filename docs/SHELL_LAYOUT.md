# Oursynth Shell Layout & SPA Principles

## Wireframe Concept
```
┌───────────────────────────────────────────────────────────────┐
│ TOP BAR (Persistent)                                           │
│ [Logo]   Context Title                        Utilities        │
└───────────────────────────────────────────────────────────────┘
│ SIDEBAR (Persistent)   │ SHELL VIEWPORT (Dynamic)           │ RIGHTBAR (Optional) │
│ [Icon Btns]             │ [Module View / App Content]          │ [Contextual Controls] │
│                         │                                      │
└─────────────────────────┴──────────────────────────────────────┴───────────────────────┘
```

## Layout Patterns
- Persistent shell: Sidebar, Topbar, and (optional) Rightbar never reload.
- Dynamic content area: Only the Shell Viewport swaps content.
- SPA routing: Use React Router, Vue Router, or vanilla JS view swapping.
- Modular: Each content view is a self-contained component.

## Branding & Moodboard
- Color Palette: Deep charcoal / midnight black (#0B0B0F), Neon Purple (#7B00FF), Electric Cyan (#00F5FF), Signal Orange (#FF8C00), Violet Haze (#9B5CFF)
- Typography: Orbitron, Inter, geometric sans-serif
- Microinteractions: Neon edge glow, animated gradients, theme toggle, sound effects

## Why This Works
- Speed & Smoothness: Only the central content changes, so it feels instant and fluid.
- Consistent Branding: The shell stays visible, reinforcing the design identity.
- Dynamic Controls: Side/top buttons can change based on context without breaking the layout.
- Modular Thinking: Each content view is a self-contained component.
- Design Playground: Microinteractions, hover states, and animations are easy to implement.

## Moodboard Reference
- Highlight Glow: Soft neon gradients blending cyan → magenta → violet
- Button hover: Neon edge glow
- Tab switch: Synth “ping” sound (optional)
- Content load: Fade-in with slight parallax
