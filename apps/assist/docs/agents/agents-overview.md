## Agents Overview

Unified catalog of all proposed / planned OurSynth Labs agents. Each agent is a composable service surfaced via Chat, Command Palette, or contextual panel actions. All agents conform to a common lifecycle: `plan → execute → emit events (provenance) → summarize`.

---
### 1. Agent Index (Canonical Names)
| Key | Name | Category | Primary Output | MVP Status | Monetization Potential |
|-----|------|----------|----------------|-----------|------------------------|
| analyzer | Codebase Analyzer | Intelligence | Structural report + hotspots | PLANNED | Premium deep graph scans |
| orchestrator | Orchestrator | Workflow | Multi-step execution plan | PLANNED | Paid automation bundles |
| capsule | Capsule Builder | Packaging | Exported component/pathway bundle | PLANNED | Paid export formats / marketplace fee |
| pathwayPlanner | Pathway Planner | Design | Node graph & step flow | PLANNED | Template marketplace |
| provenance | Provenance Tracker | Observability | Timeline snapshots + diffs | PLANNED | Retention tiers |
| timeTravel | Time Travel Navigator | Observability | State rewind interface | PLANNED | Advanced diff tooling add-on |
| agentRegistry | Agent Registry | Meta | Registered agent manifest | PLANNED | Enterprise governance add-on |
| chatAssist | Chat Assistant | Interaction | Contextual response (LLM) | MVP | Token billing / subscription |
| refactor | Refactor Agent | Code Quality | Patch suggestions | PLANNED | Bulk refactor credits |
| lintFix | Lint & Style Agent | Code Quality | Auto-fix patch | PLANNED | Batch enforcement tier |
| testGen | Test Generation Agent | Quality | Unit/integration test scaffolds | PLANNED | Per-test credit |
| uxAudit | UX Heuristic Auditor | Design | Issue list + severity | PLANNED | Report credits |
| accessibility | Accessibility Auditor | Compliance | WCAG report + remediation steps | PLANNED | Compliance subscription |
| performance | Performance Profiler | Performance | Metrics + optimization hints | PLANNED | Advanced metrics tier |
| assetOptimizer | Asset Optimizer | Assets | Optimized SVG/IMG & diff stats | PLANNED | Bulk optimization credits |
| svgSprite | SVG Sprite Compiler | Assets | Generated sprite / React indices | MVP | FREE (upsell to pipeline bundle) |
| tokenSync | Token Sync Agent | Design System | Reconciled tokens diff | PLANNED | Multi-theme pack |
| brandPulse | Brand Consistency Agent | Branding | Deviation report | PLANNED | Brand enforcement add-on |
| releasePlanner | Release Planner | Workflow | Changelog + semantic version rec | PLANNED | Release automation tier |
| dependencyGuardian | Dependency Guardian | Security | Vulnerability & update plan | PLANNED | Security subscription |
| monetizationScout | Monetization Scout | Business | Productizable asset list | PLANNED | Revenue share / upsell |
| marketplacePublisher | Marketplace Publisher | Distribution | Packaged listing metadata | PLANNED | Listing fee / % rev |

---
### 2. Detailed Specifications

#### analyzer (Codebase Analyzer)
Purpose: Build AST + dependency graph, detect dead code, complexity hotspots.
Inputs: repo snapshot path, config (depth, includeTests?).
Outputs: JSON graph, summary markdown, recommended refactors.
Events: `graphBuilt`, `hotspotsFound`.

#### orchestrator (Orchestrator)
Purpose: Compose multiple agents into a cohesive multi-step plan (e.g., analyze → refactor → test).
Inputs: goal statement, constraints.
Outputs: Ordered step plan + execution readiness status.

#### capsule (Capsule Builder)
Purpose: Package a component or pathway (code + metadata + tokens) for export.
Outputs: `.capsule.json` manifest + optional zip.
Monetize: Paid export formats (e.g., Figma tokens, Storybook story pack).

#### pathwayPlanner (Pathway Planner)
Purpose: Create interactive node flow (learning path / automation path).
Outputs: Graph JSON; supports versioning.

#### provenance (Provenance Tracker)
Purpose: Record agent invocations & code diffs.
Outputs: Timeline snapshots linking commit hash / store hash.

#### timeTravel (Time Travel Navigator)
Purpose: Navigate provenance timeline; compute semantic diffs.
Outputs: Selected snapshot state + diff summary.

#### chatAssist (Chat Assistant)
Purpose: Natural language interface bridging user queries to other agents or LLM responses.
Outputs: Formatted messages, tool trigger proposals.
Monetize: Tiered model access (OpenAI / Vertex premium models).

#### refactor (Refactor Agent)
Purpose: Suggest safe code improvements (naming, extraction, decomposition).
Outputs: Unified diff patches.

#### lintFix (Lint & Style Agent)
Purpose: Auto-run ESLint/Prettier + custom rules; propose batch patch.
Outputs: Patch set + rule compliance score.

#### testGen (Test Generation Agent)
Purpose: Generate minimal tests for primitives & modules based on code introspection.
Outputs: Test file skeletons + coverage estimate.

#### uxAudit (UX Heuristic Auditor)
Purpose: Evaluate UI semantics: contrast, spacing consistency, focus states.
Outputs: Issue list with severity & token fix suggestions.

#### accessibility (Accessibility Auditor)
Purpose: Run a11y checks (axe-core) + ARIA role validation.
Outputs: Report JSON + prioritized remediation queue.

#### performance (Performance Profiler)
Purpose: Lighthouse / custom metric capture for targeted routes.
Outputs: Score delta, metric frames, suggestions.

#### assetOptimizer (Asset Optimizer)
Purpose: Compress, optimize, and deduplicate images/SVG.
Outputs: Size reduction report + optimized asset set.

#### svgSprite (SVG Sprite Compiler)
Purpose: Build sprite + React component index from curated SVG registry.
Outputs: `/labs/svg/registry.ts` + optional sprite sheet.

#### tokenSync (Token Sync Agent)
Purpose: Reconcile incoming design tokens vs canonical set; propose merges or deprecations.
Outputs: Diff JSON, patch operations.

#### brandPulse (Brand Consistency Agent)
Purpose: Scan UI code + assets for palette / logo drift.
Outputs: Violations + suggested replacements.

#### releasePlanner (Release Planner)
Purpose: Aggregate changes since last tag; produce semantic version suggestion & changelog.
Outputs: `CHANGELOG.md` snippet + version bump.

#### dependencyGuardian (Dependency Guardian)
Purpose: Security + update intelligence (CVEs, outdated libs).
Outputs: Risk matrix + upgrade script suggestions.

#### monetizationScout (Monetization Scout)
Purpose: Identify candidate components/assets for marketplace.
Outputs: List of items + pricing tier suggestion.

#### marketplacePublisher (Marketplace Publisher)
Purpose: Prepare marketplace metadata (name, description, keywords, preview media).
Outputs: Listing manifest + validation report.

---
### 3. Common Data Contracts
```ts
interface AgentInvocation {
  id: string;
  agent: string;          // key from catalog
  input: unknown;         // validated per agent schema
  output?: unknown;       // agent-specific payload
  status: 'pending' | 'success' | 'error';
  startedAt: number;
  finishedAt?: number;
  events?: AgentEvent[];
  cost?: { tokens?: number; credits?: number }; // monetization tracking
}

interface AgentEvent {
  ts: number;
  type: string;           // e.g., 'graphBuilt', 'diffGenerated'
  data?: any;
}

interface AgentSpec {
  key: string;
  name: string;
  description: string;
  inputSchema: any;       // JSON Schema
  outputSchema: any;      // JSON Schema
  category: string;
  monetization?: string;  // note / tier / pricing idea
  status: 'PLANNED' | 'MVP' | 'BETA' | 'STABLE';
}
```

---
### 4. Invocation Channels
| Channel | Description | Notes |
|---------|-------------|-------|
| Chat Slash Command | `/analyze`, `/refactor` | Quick trigger; minimal config |
| Command Palette | Global `Ctrl+K` panel | Can batch queue agents |
| Context Menu | Code editor selection → refactor/test | Limited to code-focused agents |
| Pipeline Orchestrator | Multi-step composition | Uses orchestrator agent |
| API Route | `/api/agents/:key` | External or headless invocation |

---
### 5. Monetization Layer (Concept)
| Mechanism | Applied To | Example |
|-----------|-----------|---------|
| Credit Packs | analyzer, testGen, accessibility | 100 analyzer scans/month |
| Subscription Tiers | chatAssist models, provenance retention | Pro plan: 90-day provenance |
| Marketplace Revenue Share | capsule exports, marketplacePublisher | 20% fee on sold component |
| Compliance Add-On | accessibility, brandPulse | Monthly compliance report |
| Automation Bundle | orchestrator + dependencyGuardian + releasePlanner | CI automation tier |

---
### 6. Roadmap Phasing
Phase 0 (MVP): chatAssist (scaffold integrated: basic chat + push panels + command center shell), svgSprite, analyzer (subset), Panel primitives.
Phase 1: refactor, testGen, provenance, tokenSync.
Phase 2: orchestrator, pathwayPlanner, capsule, performance, accessibility.
Phase 3: monetizationScout, marketplacePublisher, brandPulse, releasePlanner.

---
### 7. Implementation Notes
- All agent specs registered in a central `agentRegistry.ts` (generated or manually curated).
- Strict schema validation (e.g., zod) before execution.
- Provenance events streamed (SSE/WebSocket) for live UI.
- Cost tracking accumulates at invocation + aggregated in a ledger store.

---
### 8. Open Questions
- Multi-tenant separation for agent cost ledger?
- WebAssembly sandbox for risky transforms (future)?
- Marketplace packaging format (Capsule v1 spec) finalization.

---
### 9. Next Steps
1. Create `labs/state/agentRegistry.ts` stub with catalog.
2. Implement `AgentInvocation` store (zustand) + mock executor.
3. Add Chat slash command router mapping to catalog.
4. Build provenance event emitter skeleton.
5. Instrument cost tracking (mock token usage initially).

