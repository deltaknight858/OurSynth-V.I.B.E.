# User Flow Navigation (Canonical: OurSynth‑Eco)

## Sidebar (shell)

- Studio 🖌️
- Pathways 🪄
- Orchestrator ⚙️
- MeshSim 🌐
- Provenance 📜
- Capsule 📦
- Command Center 🎛️
- Agents 🤖

## Routing Hierarchy

- `/studio` → Visual builder
- `/pathways` → Wizard + generator
- `/orchestrator` → Job/event manager
- `/mesh-sim` → Capsule mesh simulation
- `/provenance` → Audit timeline
- `/capsule` → Capsule export + time machine
- `/command-center` → Orchestrator + agent control
- `/agents` → Agent registry and panels

## Cross‑Flow Transitions

- Wizard (Pathways) → Studio → Capsule export → Provenance timeline
- Orchestrator job → MeshSim → Provenance entry
- Studio/Pathways edit → Provenance log
- Capsule export → MeshSim test → Provenance log
- Agent actions available in Studio, Orchestrator, Command Center

## Navigation Principles

- Persistent shell and sidebar; panels swap in viewport
- Context-aware controls: Inspector and feature panels adapt to current app/flow
- Deep-linking for features, flows, provenance
- Modular integration: New modules plug into shell via defined entry points

---

*Update this doc whenever navigation or flow changes. Reference in root README and contribution guide.*