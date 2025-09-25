# User Flow Navigation (Canonical: OurSynth‑Eco)

_Status: Living, authoritative_
_Last updated: September 24, 2025_

**See Also:**

- [User Flow](./user-flow.md)
- [Promotion Pipeline](./promotion-pipeline.md)
- [Shell Layout](../architecture/SHELL_LAYOUT.md)
- [Glossary](../reference/GLOSSARY.md)
- [Engineering Standards](../reference/STANDARDS.md)

## Sidebar (shell)

- **Home** - Returns to the main dashboard.
- **User Management** - Access and manage user accounts.
- **Content Management** - Create, edit, and publish content.
- **Settings** - Configure application settings.
- **Help** - Access help resources and documentation.

## User Flow

1. **User visits the homepage.**
2. **User navigates to a section:**
   - For account-related tasks, go to **User Management**.
   - To modify content, head to **Content Management**.
   - For application settings, enter the **Settings**.
3. **User performs tasks within the section.**
4. **User logs out or returns to the homepage.**

## Promotion Pipeline

- **Draft** - Initial stage for new content.
- **Review** - Content under review by editors.
- **Approval** - Approved content ready for publication.
- **Published** - Content is live on the platform.

## Shell Layout

- **Header** - Contains the logo and main navigation.
- **Sidebar** - Quick links to important sections.
- **Main Area** - Displays content and tasks.
- **Footer** - Additional links and information.

## Glossary

- **User Flow** - The path a user takes through the application.
- **Promotion Pipeline** - The stages content goes through from creation to publication.
- **Shell Layout** - The structural layout of the application interface.

## Engineering Standards

- **Code Quality** - Adhere to coding standards and best practices.
- **Documentation** - Maintain up-to-date and accurate documentation.
- **Testing** - Ensure thorough testing of all features and fixes.

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
