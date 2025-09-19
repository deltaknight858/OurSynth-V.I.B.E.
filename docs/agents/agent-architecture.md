# Agent Architecture

## Core Agents & Roles

- **OAI:** Conversational AI, user’s entry point
- **Orchestrator:** Coordinates all agents, plans workflows
- **Analyzer:** Inspects code, enforces standards, powers Explain
- **Capsule:** Packages artifacts, cryptographic signing
- **Provenance:** Tracks origin, authorship, authenticity
- **Time Travel:** Restores/replays project states
- **Mesh:** Runs simulations, records history
- **Deploy/Connect:** Handles deployment pipeline
- **Domains:** Manages domain mapping, environments
- **V.I.B.E.:** Visual backend explorer, data dashboard

## Workflow

The full OurSynth Labs workflow is mapped to five core pages for maximum clarity and efficiency:

1. **Home / Entry (User → OAI):**
	- Hero, onboarding, and first interaction with OAI (conversational AI)
	- Quick start, “Begin Pathway” CTA, and brand intro
2. **Workspace (Orchestrator + Agents):**
	- Main creative hub: Orchestrator panel, Analyzer, Capsule, Mesh, V.I.B.E.
	- Tabs or side panels for Analyzer, Capsule, Mesh, V.I.B.E.
	- All config, validation, and artifact packaging happens here
3. **Preview & Actions (Preview Panel):**
	- Live preview of generated code/UI/config
	- Action buttons: Explain, Save, Send, Deploy
	- Theme/motion toggles, accessibility controls
4. **Command Center:**
	- Admin, deployment, domain management, environment settings
	- Modal overlays for advanced settings, domain mapping, etc.
5. **History & Provenance (Provenance/Time Travel):**
	- Timeline/history view, restore/replay, authorship tracking
	- Modal or drawer for detailed provenance, signature, and audit info

### Wizard Logic Bar Integration (New)

Natural language commands flow through incremental stages:
`analyze → plan → scaffold → refine → finalize`.

Each stage emits events (see `logic-bar.md`) captured by a lightweight store. UI surfaces:

- Stage ring (status + file count)
- Expandable file diff list
- Live announcements for accessibility

Benefits:

- Reinforces trust & transparency (user sees artifact birth order)
- Enables monetization hooks (e.g., advanced diff insights gated by tier)
- Decouples NL orchestration engine from rendering layer via event bus


Secondary content (About, Contact, Docs, etc.) can be handled as modals, popups, or overlays from any page.

---

### 📦 Nicepage Export & Review System

- All 5 core pages are exported from Nicepage using the [Nicepage Export Contributor Kit](/docs/nicepage-export-checklist.md).
- See the [Nicepage Sitemap & Layout Specs](/docs/nicepage-sitemap.md) for page-by-page requirements and mapping.
- Automated PR labeling, reviewer assignment, and checklists are set up for all Nicepage exports (see `/docs/nicepage-export-checklist.md` for workflow and [labeler config](../.github/labeler.yml)).
- All exports must follow the [commit/PR checklist](/docs/nicepage-export-checklist.md#3%EF%B8%8F%E2%83%A3-commit-message-template--pr-checklist) and will be auto-checked for assets, accessibility, and structure.

#### 🚦 Export System Automation & Guardrails

- **Labels:** PRs touching Nicepage export paths are auto-labeled (e.g., `nicepage:export`, `nicepage:review:design`, `needs:assets`).
- **Labeler config:** See [.github/labeler.yml](../.github/labeler.yml) for path-based rules.
- **Export bot:** [Nicepage Export Bot](../.github/workflows/nicepage-export-bot.yml) auto-assigns reviewers, posts the checklist, and flags missing assets or a11y issues.
- **Branch protection:** Optionally require the export bot and label checks to pass before merge.
- **Issue template:** Use [Nicepage Export Task](../.github/ISSUE_TEMPLATE/nicepage-export.md) to track and standardize new exports.
- **CODEOWNERS:** (optional) Auto-request reviews from design/frontend teams for Nicepage-related files ([CODEOWNERS](../CODEOWNERS)).

**For setup and usage details, see the full [Nicepage Export System Guide](/docs/nicepage-export-checklist.md#nicepage-export-label-system).**

For full details on the export, review, and integration process, see:
- [Nicepage Export Contributor Kit](/docs/nicepage-export-checklist.md)
- [Nicepage Sitemap & Layout Specs](/docs/nicepage-sitemap.md)
- [Contributor Playbook](/docs/contributor-playbook.md)

## Keyword Index for Search
See `/docs/agent-keywords.md` for the full regex and search plan.

[Back to Index](./index.md)
