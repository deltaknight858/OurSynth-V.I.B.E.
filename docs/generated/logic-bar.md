# Wizard Logic Bar

Visual feedback rail mapping natural language (NL) commands → staged code artifact generation.

## Stages

`analyze → plan → scaffold → refine → finalize`

Each stage renders as a concentric ring derivative (inspired by circular assets) with:

- Status: pending | active | done
- Badge: count of files touched
- Accessible label: "Scaffold stage – 3 files created"

## Event Contract

```ts
type LogicEvent = {
  id: string;
  stage: 'analyze' | 'plan' | 'scaffold' | 'refine' | 'finalize';
  action: 'create' | 'update';
  filePath: string;
  summary?: string; // e.g. +120/-4
  ts: number;
};
```

Stage aggregate shape:

```ts
type LogicStageState = {
  stage: string;
  status: 'pending' | 'active' | 'done';
  files: { filePath: string; action: string; summary?: string }[];
};
```

## Interaction & A11y

| Interaction | Behavior |
|-------------|----------|
| Click / Enter | Toggle file list for stage |
| Arrow keys | Move focus between stages (roving tabindex) |
| Live region | Announces stage transitions |

## Visual Tokens

| Element | Token |
|---------|-------|
| Ring gradient active | `logic.stage.active` |
| Ring glow done | `logic.stage.done` |
| Ring outline pending | `logic.stage.pending` |

## Rendering Notes

- Rings implemented via pure SVG generated component or layered divs with `conic-gradient`.
- Glow intensity scales with file count using a capped easing: `intensity = min(1, 0.25 + ln(n+1)/3)`.
- Collapses to vertical rail on narrow viewports.

## Roadmap

| Phase | Deliverable |
|-------|-------------|
| 1 | Static component + mock data |
| 2 | Live event bus integration |
| 3 | Diff preview drawers |
| 4 | Provenance signatures overlay |

---
Back: [Index](./index.md)
