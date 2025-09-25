# Color Migration: Magenta → Purple

This document tracks the transition from legacy "Neon Magenta" to the new "Neon Purple" accent.

## Rationale

- Visual distinctiveness vs common magenta gradients.
- Improved contrast pairing with cyan and signal yellow.
- Unification around Asset 41 purple (`#7B00FF`).

## Legacy Variants Detected

| Legacy Value | Locations (examples) | Action |
|--------------|----------------------|--------|
| `#FF00F5` | `docs/brand-system.md` (old gradient) | Replaced |
| `#ff00c8` | `assets/css/oursynth-core.css` | Aliased |
| `#FF00FF` | Tailwind configs (import-staging) | Pending unification |
| `#FF2DA8` | Brand readme (import-staging) | Pending unification |

## Implementation Steps

1. Define `--neonPurple: #7B00FF` in root CSS.
2. Alias `--neonMagenta` → `var(--neonPurple)` for backward compatibility.
3. Add new utility classes `.bg-neonPurple`, `.text-neonPurple`.
4. Update gradients to terminate in `#7B00FF`.
5. Phase 2 (later): remove alias & run codemod replacing class names.

## Token Naming (Future Tokens Package)

| Semantic | Token | Value |
|----------|-------|-------|
| Accent.Primary | `color.accent.cyan` | `#00F5FF` |
| Accent.Secondary | `color.accent.purple` | `#7B00FF` |
