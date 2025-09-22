# OurSynth-Eco User Flow

## Sidebar Navigation

- Studio
- Pathways (Wizard)
- Orchestrator
- MeshSim
- Provenance
- Capsule
- Command Center
- Agents
- **Taskflow** (existing)
- **Noteflow** (existing)

## Typical User Journey

1. **Start in Studio:** Visual builder for new app or capsule.
2. **Pathways:** Use wizard to generate new flows, tagged as `origin=wizard` in backend.
3. **Orchestrator:** Manage jobs (build, export, simulate).
4. **MeshSim:** Simulate capsule state/chaos.
5. **Capsule/Provenance:** Export signed capsule, view audit timeline.
6. **Agents/Command Center:** Register agents, interact, unify control.
7. **Taskflow/Noteflow:** Use task/note management, with provenance and agent links.  
   - All existing flows untouched, but cross-linked for provenance and session updates.

## Provenance

Every app logs edits/events to the timeline.  
Capsule export includes SBOM and provenance.  
Agents can be referenced for context in all panels.

## Backend

- **Supabase:** All wizard/upload projects stored with RLS policies.
- Each user only sees their own projects.