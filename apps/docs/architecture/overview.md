
## Architecture Overview

The system is a Next.js application with a modular Labs domain containing all evolving feature code. Legacy or imported artifacts live in `import-staging/` until promoted.

### Layers

1. Presentation (labs/primitives + modules UI)
2. State (labs/state/* per domain store)
3. Services (agent runtime bridges, API fetch)
4. Assets (brand, svg registry)
5. Automation (scripts for promotion & build)

## API Integration & Setup

The API module provides backend integration for agent orchestration, data management, and external service connectivity. It includes Azure Functions, Python function apps, and supporting tests and templates.

### Main Components

- **Application/**: Azure Function app with host.json, requirements.txt, and Python entry points
- **ArmTemplates/**: ARM templates for deployment (consumption/dedicated)
- **Tests/**: Python unit tests for API endpoints

### Setup & Deployment

1. Configure Azure Function app settings in `Application/host.json` and `requirements.txt`.
2. Deploy using ARM templates in `ArmTemplates/` for your environment.
3. Run tests in `Tests/` to validate API functionality.

Refer to the API app folder and SECTIONS.md for more details on integration points and usage.

## Dashboard Orchestration & User Flows

The Dashboard app provides service orchestration, authentication, and UI for managing services and workflows in OurSynth-Eco.

### Main Components

- **ServiceList.tsx**: Lists and manages available services
- **auth.ts**: Handles authentication and user sessions
- **orchestrator.ts**: Coordinates service workflows and agent interactions
- **index.tsx**: Main dashboard entry point

### User Flows

1. User logs in via the dashboard (auth.ts)
2. ServiceList.tsx displays available services and their status
3. User selects a service to view details or trigger workflows
4. orchestrator.ts manages multi-step workflows and agent coordination
5. Dashboard UI updates to reflect workflow progress and results

Refer to the dashboard app folder and SECTIONS.md for more details on implementation and integration.

### Separation Rules

- Pages perform minimal orchestration → delegate to modules.
- Modules never import from other modules' internals: use public surface (index/barrel).
- Assets accessed only via registry utilities.
