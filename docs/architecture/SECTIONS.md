# Sections Overview (Apps & Packages)

This document explains what each section does and how they interact.


## Apps

### Detailed App Breakdown

#### aether

**Purpose:** Visualization assets, concept demos, and HTML/JS downloads for experimental or UI features.
**Main Files:** HTML files, JS downloads, webp images.
**Docs Mapping:** No dedicated doc found. Recommend adding a brief summary in docs/concept/aether concept/.

#### agents

**Purpose:** Agent orchestration and dashboard (Phase3AgentDashboard.tsx).
**Main Files:** Phase3AgentDashboard.tsx
**Docs Mapping:** Covered in docs/agents/agent-architecture.md and agents-overview.md. Ensure dashboard logic is described.

#### ai

**Purpose:** Core agent UI components for chat, push panel, and command center.
**Main Files:** AgentBallDemo.tsx, AgentChat.tsx, AgentPushPanel.tsx, CommandCenter.tsx
**Docs Mapping:** Referenced in docs/agents/agent-architecture.md. Add UI component details if missing.

#### api

**Purpose:** Backend API integration, Azure Functions, Python function app, and tests.
**Main Files:** Application/ (Azure Function), ArmTemplates/, Tests/
**Docs Mapping:** Not clearly documented. Recommend adding a section in docs/architecture/overview.md and linking to API setup notes.

#### assist

**Purpose:** Standalone Next.js app for assistive flows, with its own docs, pages, and migration notes.
**Main Files:** app/, docs/, packages/, public/, styles/
**Docs Mapping:** Has its own docs/assist/ directory. Ensure main docs/architecture/SECTIONS.md links to assist docs and describes its role.

#### capsules

**Purpose:** Core capsule components for modular agent/capsule logic, including time travel and wizard flows.
**Main Files:** WizardCapsulePanel.tsx, TimeMachinePanel.tsx, page.tsx
**Docs Mapping:** Documented in docs/capsules/CAPSULES.md and wizard-capsule-migration.md. Ensure all key components are described.

#### chat

**Purpose:** Chat UI and logic, including agent chat panel, message capsule, and prompt input.
**Main Files:** AgentChatPanel.tsx, AgentPushPanel.tsx, MessageCapsule.tsx, PromptInput.tsx
**Docs Mapping:** Should be referenced in docs/agents/agent-architecture.md and user flow docs. Add details if missing.

#### command-center

**Purpose:** Main shell and navigation for command center features, including layout and wheel navigation.
**Main Files:** CommandCenterShell.tsx, CommandWheel.tsx, layout.tsx, page.tsx
**Docs Mapping:** Should be described in docs/architecture/overview.md and SHELL_LAYOUT.md. Add navigation details if missing.

#### connect

**Purpose:** Deployment and environment management, with integrations, metrics, and UI components for deploy flows.
**Main Files:** EnvManager.tsx, LogViewer.tsx, MetricsChart.tsx, NewDeployModal.tsx, ui components
**Docs Mapping:** Documented in docs/workflows/domains-and-connect.md. Ensure all major flows and integrations are covered.

#### dashboard

**Purpose:** Service orchestration, authentication, and dashboard UI for managing services.
**Main Files:** ServiceList.tsx, auth.ts, orchestrator.ts, index.tsx
**Docs Mapping:** Should be described in docs/architecture/overview.md and user flow docs. Add orchestration details if missing.

#### icons

**Purpose:** Centralized icon components for UI consistency and branding.
**Main Files:** CommandCenterIcon.tsx, ExternalLinkIcon.tsx, HomeIcon.tsx, Logo.tsx, etc.
**Docs Mapping:** Documented in docs/assets/ICON_CHECKLIST.md and docs/brand/svg-pipeline.md. Ensure all key icons are listed.

#### labs

**Purpose:** Prototyping, instructions, workflows, and agent experimentation. Contains studio app and agent code.
**Main Files:** .github/instructions/, agents/oursynth-agent/, apps/studio/
**Docs Mapping:** Referenced in docs/archive/LABS_1_INSTRUCTIONS_INDEX.md and LABS_2_INSTRUCTIONS_INDEX.md. Add details for new experiments if needed.

#### layout

**Purpose:** Base layout, header, and footer components for consistent app structure.
**Main Files:** BaseLayout.jsx, Header.jsx, Footer.jsx
**Docs Mapping:** Should be described in docs/architecture/SHELL_LAYOUT.md. Add layout details if missing.

#### marketing

**Purpose:** Advanced organization and promotional sections for landing or marketing pages.
**Main Files:** AdvancedOrganizationSection.tsx
**Docs Mapping:** Should be referenced in docs/brand/BRANDING.md or related marketing docs.

#### noteflow

**Purpose:** Standalone Next.js app for note-taking and memory agent logic.
**Main Files:** .next/, server/, src/
**Docs Mapping:** Documented in docs/agents/agent-architecture.md and user flow docs. Ensure memory agent flows are described.

#### np

**Purpose:** Legacy or alternate note page (NPPage.jsx).
**Main Files:** NPPage.jsx
**Docs Mapping:** Should be referenced in docs/agents/agents-overview.md if still relevant.

#### pathways

**Purpose:** Wizard and code generation flows, AI provider setup, and theming.
**Main Files:** README.md, WIZARD_README.md, src/components/, src/app/
**Docs Mapping:** Documented in docs/capsules/WIZARD_CAPSULE.md and docs/blueprint/UnifiedBlueprint.md. Add details for new flows if needed.

#### sentient-developer

**Purpose:** Code generation, deployment, and testing services for advanced agent logic.
**Main Files:** CodeGenerationService.js, DeploymentService.js, TestingService.js
**Docs Mapping:** Should be described in docs/agents/agent-architecture.md and docs/architecture/overview.md.

#### showcase

**Purpose:** Component showcase for UI/UX review and demonstration.
**Main Files:** ComponentShowcase.tsx
**Docs Mapping:** Should be referenced in docs/components/derivative-ui-plan.md or promotion-guidelines.md.


#### studio

**Purpose:** Large app for workspace, database, and feature management. Includes migration, setup, and validation docs.
**Main Files:** app/, components/, docs/, infra/, packages/, scripts/, src/, test/, types/
**Docs Mapping:** Documented in docs/architecture/overview.md, MIGRATION_CHECKLIST.md, and validation docs. Ensure all major features are covered.

#### system

**Purpose:** Core system components, quarantine logic, and UI primitives (FocusRing, HaloButton).
**Main Files:** FocusRing.module.css, HaloButton.tsx, quarantine.ts, QuarantineButton.tsx
**Docs Mapping:** Should be described in docs/architecture/SECTIONS.md and docs/components/primitives.md.

#### theme

**Purpose:** Theme provider and types for global theming and design system.
**Main Files:** AppThemeProvider.tsx, types.ts, README.md
**Docs Mapping:** Documented in docs/brand/THEME_SYSTEM.md and docs/design-system/tokens.md.

#### ui

**Purpose:** Shared UI components for layout, dialog, dashboard, and cards.
**Main Files:** Button.tsx, DashboardLayout.tsx, Dialog.tsx, SharedCard.tsx, ui.css
**Docs Mapping:** Documented in docs/components/primitives.md and docs/design-system/branding.md.

#### vibe

**Purpose:** Domain manager, registration, and UI for domain-related flows.
**Main Files:** DomainSuggester.tsx, DomainCard.tsx, DomainRegistrationModal.tsx, AuthContext.tsx, integrations, pages/
**Docs Mapping:** Documented in docs/workflows/domains-and-connect.md and referenced in agent-architecture.md. Ensure all domain flows are described.

#### wizard

**Purpose:** Capsule export, wizard flows, and project dialogs.
**Main Files:** capsuleExport.ts, CapsuleExportButton.tsx, MyProjectsDialog.tsx, PathwaysWizard.tsx, page.tsx
**Docs Mapping:** Documented in docs/capsules/WIZARD_CAPSULE.md and wizard-capsule-migration.md. Add details for new flows if needed.

## Packages

- core: tokens, theme provider, types and contracts
- ui: Halo + shadcn primitives; shared components used by apps
- agents: agent factories and utilities
- capsule: manifest schema, packaging, signing
- mesh: provenance and mesh utilities
- orchestrator: orchestration layer for composing agents
- shared-types: common TypeScript types
- storybook: centralized Storybook with theme/token/motion stories
- aliases: optional alias tooling

## Interaction

- Apps depend on packages/ui and packages/core
- Agents and orchestrator power Aether and Studio features
- Capsules are produced/consumed across apps; marketplace integration optional
