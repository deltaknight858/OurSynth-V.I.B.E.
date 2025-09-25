# OurSynth Ecosystem Architecture

_Status: Living, authoritative_
_Last updated: September 24, 2025_

**See Also:**

- [Shell Layout](./SHELL_LAYOUT.md)
- [Migration Guide](./migration-guide.md)
- [Agents Architecture](../agents/AGENTS.md)
- [Glossary](../reference/GLOSSARY.md)
- [Engineering Standards](../reference/STANDARDS.md)

This document outlines the high-level architecture of the OurSynth platform.

## Core Pillars

 The portable application format. A "capsule" is a signed, replayable bundle containing an application's code, configuration, and build instructions, enabling perfect reproducibility and "time-travel" functionality.

## Data & Control Flow

The typical user workflow demonstrates how these pillars interact:

1. **User Interaction**: The user interacts with an AI agent (e.g., "Rasa Bot with Calm") via conversational UI or command center.
2. **Orchestration**: The AI agent parses the request and decides which tool to use.
    - For new features, it invokes the **Pathways** wizard.
    - For deployment, it triggers the **Deploy** pipeline.
    - For history or rollbacks, it interacts with **Capsules**.
3. **Generation**: **Pathways** generates the code and opens a pull request.
4. **Verification**: The user (or an agent) reviews the changes. Upon approval, the code is merged.
5. **Deployment**: The **Deploy** service takes the new code, builds it, and pushes it to the target environment.
6. **Packaging (Optional)**: At any point, a **Capsule** can be created from the current state of the application, providing a verifiable snapshot for rollbacks or distribution.

This architecture is designed to be modular and decoupled. Each pillar can operate independently but exposes a clear API for the orchestrator to use, creating a seamless, AI-driven development experience.
The ecosystem is built on four core, interconnected pillars:

1. **Pathways**: The generative engine. It takes high-level prompts (e.g., "add a login page") and uses a wizard-like flow to scaffold the necessary code, components, and pages.
2. **Deploy**: The automated shipping pipeline. It handles the building, packaging, and deployment of applications to various environments (staging, production).
3. **Capsules**:

---

## Capsules: Portable, Signed Application Bundles

Capsules are the backbone of reproducibility and distribution in the OurSynth ecosystem. Each capsule is a signed, replayable bundle containing:
-Application code
-Configuration and environment variables
-Build instructions and manifest
-Provenance metadata (who, when, why)
-Optional assets and design tokens

### Capsule Use Cases

- **Rollback & Recovery:** Instantly revert to any previous state by replaying a capsule.
- **Distribution:** Share or deploy capsules across environments, teams, or marketplaces.
- **Audit & Provenance:** Every capsule is cryptographically signed and timestamped, providing a verifiable history.
- **Testing:** Capsules can be replayed in MeshSim for chaos, latency, and artifact validation before deployment.
- **SBOM Generation:** Capsules include a Software Bill of Materials for compliance and security.

### Capsule Lifecycle

1. **Creation:** Triggered by agents, user actions, or automated workflows.
2. **Signing:** Ed25519 or similar cryptographic signature applied.
3. **Export:** Capsule is packaged as `.capsule.json` (with optional zip for assets).
4. **Replay:** Capsule can be loaded into MeshSim or deployed to target environments.
5. **Provenance Logging:** Every capsule event is recorded in the timeline for traceability.

### Future Extensions

- **Marketplace Integration:** Capsules can be listed, sold, or shared in the OurSynth marketplace.
- **Multi-tenant Capsules:** Support for organization-specific capsules with access controls.
- **Capsule Diff & Merge:** Tools for comparing and merging capsules across branches or environments.
