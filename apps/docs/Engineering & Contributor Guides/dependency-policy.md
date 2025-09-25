# Dependency Policy

Goal: Minimal, single-version, auditable dependency surface.

## Principles

1. One version per dependency (no parallel major versions).
2. Prefer native / standard library / small utilities over large frameworks.
3. No design system dependencies (e.g., MUI) – we own primitives.
4. Add only if it accelerates core value (agents, NL workflow, provenance).
5. Every new dependency must list: purpose, surface area used, removal fallback.

## Allowed Categories (Examples)

| Category | Examples | Notes |
|----------|----------|-------|
| Core Runtime | react, next (if/where used) | Keep updated minor range |
| Styling Infra | postcss, tailwind *optional*, cssnano | Evaluate tree size |
| Editor | codemirror 6 core + selective language packages | Avoid monaco unless TS analysis required |
| State | zustand or jotai (choose one) | Single state lib only |
| Build/Tooling | esbuild / swc, typescript | Pin major |
| Testing | vitest / jest (choose one) | Focus on logic components |

## Prohibited Without Review

- Heavy UI kits (MUI, Ant, Chakra)
- Drag & drop frameworks (since NL editing focus)
- Large icon packs (we generate our own)

## Vetting Checklist

| Step | Question |
|------|----------|
| Justification | Does it replace ≥100 LOC of complex code? |
| Size | < 50KB added (gzipped)? |
| Security | Maintained & no severe CVEs? |
| Overlap | Duplicate existing capability? |
| Removal | Can we fallback gracefully? |

## Version Strategy

Use caret for minor updates, pin major: `^1.4.0`. Lock file committed. Quarterly review for pruning.

## Tooling (Planned)

- `scripts/dependency-audit.mjs`: list size, duplicates, unused.
- CI gate: fail if duplicate major versions introduced.

---
Back: [Index](./index.md)
