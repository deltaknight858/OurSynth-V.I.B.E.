# OurSynth‑Eco

The unified, AI‑powered application factory platform.  
Visual builder, pathways wizard, orchestrator, mesh simulation, provenance, capsule export, agent registry, and command center—all in one shell.

## 🚀 Getting Started

- See the workspace shell sidebar for access to:
  - Studio 🖌️
  - Pathways 🪄
  - Orchestrator ⚙️
  - MeshSim 🌐
  - Provenance 📜
  - Capsule 📦
  - Command Center 🎛️
  - Agents 🤖

## 🧭 User Flows

- **Canonical user journeys and navigation** are defined in:
  - [`docs/user-flow.md`](../docs/user-flow.md)
  - [`docs/user-flow-navigation.md`](../docs/user-flow-navigation.md)

## 🗂️ Repo Structure

```
apps/
  shell/              # Workspace shell with sidebar navigation
  studio/             # Visual builder
  pathways/           # Wizard + generator
  orchestrator/       # Job/event manager
  mesh-sim/           # Mesh simulation panel
  provenance/         # Provenance timeline
  capsule/            # Capsule export + time machine
  command-center/     # Orchestrator + agent control
  agents/             # Agent registry and panels
packages/
  core/               # Shared state (Zustand), types, utils
  halo-ui/            # Custom UI components
docs/
  user-flow.md
  user-flow-navigation.md
  README.md
```

## 🔑 Features Integrated

- **Studio**: Visual builder, provenance hooks, agent session state, wizard/upload project identity
- **Pathways**: Wizard flows, generator service, provenance-signed capsule export
- **Orchestrator**: Job/event manager, retry/dependency helpers, history timeline
- **MeshSim**: Capsule mesh simulation, chaos/latency, provenance artifact logging
- **Provenance**: Audit log, timeline view, evidence panels, auto-logging from all flows
- **Capsule**: Manifest, packing/export, Ed25519 signing, SBOM, time machine, diffs, replay
- **Agents**: Registry, session store, integrated chat/push panels
- **Command Center**: Unified control for orchestrator jobs, agent actions, capsule builds

## 🔐 Security & Backend

- Supabase is the backend spine, with RLS policies for per-user isolation on all logs, projects, capsules, provenance.
- Environment variables: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `GOOGLE_APPLICATION_CREDENTIALS_JSON`, `HF_API_TOKEN`, etc.

## 🎨 Branding & UI

- **No MUI, Firebase, Shadcn.**  
- **Halo UI and custom components only.**  
- Sidebar icons and motion cues unified under Eco branding.

## 📝 Contribution Guide

- See `/docs/user-flow.md` and `/docs/user-flow-navigation.md` for canonical user journeys and navigation.
- Each app/flow has a README with its role and primary flows.
- Open issues and PRs for ideas, improvements, and new integrations.

---

*See the docs for full user flow and navigation maps. Welcome to the future of rapid, trustworthy, AI-first app creation!*
