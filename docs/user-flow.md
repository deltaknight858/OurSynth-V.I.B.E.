# User Flow (Canonical: OurSynth‑Eco)

## Workspace Shell

- Entry: User lands in Eco shell workspace, sees sidebar (Studio, Pathways, Orchestrator, MeshSim, Provenance, Capsule, Command Center, Agents).
- Navigation: Sidebar → Panel → Nested Flow

## Studio

- Studio (visual builder) opened from sidebar
- User creates/edits project (drag/drop panels, agent session state, provenance-logged)
- Projects distinguished by origin (wizard-generated vs. uploaded)

## Pathways

- Pathways wizard launches from sidebar
- Step-by-step flow: describe app, select features, generate code/capsule
- Output provenance-signed capsule, ProjectIdentity (origin = wizard)

## Orchestrator

- Orchestrator panel manages jobs/events (builds, mesh sim, capsule export)
- Jobs can trigger mesh simulation, capsule builds, provenance exports
- Retry/dependency helpers, job history/timeline

## MeshSim

- MeshSim panel simulates capsule deployment (chaos, latency, signed artifact)
- Results logged to Provenance timeline
- Capsule manifests testable before deployment

## Provenance

- Provenance panel shows audit log, timeline, evidence panels
- Every capsule export, mesh sim, orchestrator job → provenance entry
- Timeline filterable by project, capsule, agent

## Capsule

- Capsule panel: manifest, packing/export, Ed25519 signing, time machine (diffs, replay)
- Export always generates provenance + SBOM
- Capsules replayable in MeshSim or deployable

## Agents

- Agent registry and session state (Zustand)
- Panels for AgentChat, AgentPushPanel
- Integrated into Studio, Orchestrator, Command Center

## Command Center

- Unified control for orchestrator jobs, agent actions, capsule builds

## Backend & Security

- Supabase backend, RLS policies, per-user logs/projects/capsules/provenance
- All flows cross-wired for provenance, mesh, orchestrator, capsule logic

---

*This doc is the single source of truth for user journeys in OurSynth‑Eco. See user-flow-navigation.md for navigation hierarchy.*