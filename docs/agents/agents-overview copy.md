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
| brandPulse | Brand Consistency Agent | Branding | Deviation report | **IMPLEMENTED** | Brand enforcement add-on |
| releasePlanner | Release Planner | Workflow | Changelog + semantic version rec | **IMPLEMENTED** | Release automation tier |
| dependencyGuardian | Dependency Guardian | Security | Vulnerability & update plan | PLANNED | Security subscription |
| monetizationScout | Monetization Scout | Business | Productizable asset list | **IMPLEMENTED** | Revenue share / upsell |
| marketplacePublisher | Marketplace Publisher | Distribution | Packaged listing metadata | **IMPLEMENTED** | Listing fee / % rev |
| monetizationScout | Monetization Scout | Business | Productizable asset list | PLANNED | Revenue share / upsell |
| marketplacePublisher | Marketplace Publisher | Distribution | Packaged listing metadata | PLANNED | Listing fee / % rev |
| **Phase 4 Enterprise Agents** | | | | | |
| multiTenantOrchestrator | Multi-Tenant Orchestrator | Enterprise | Workspace isolation & resource mgmt | PHASE4 | Enterprise tier subscription |
| complianceEngine | Compliance Engine | Governance | SOC2/GDPR/HIPAA reports | PHASE4 | Compliance audit tier |
| auditTrail | Audit Trail | Security | Comprehensive audit logs | PHASE4 | Enterprise logging tier |
| rbacManager | RBAC Manager | Security | Role-based access control | PHASE4 | Enterprise security tier |
| ssoIntegrator | SSO Integrator | Authentication | SAML/OIDC/AD integration | PHASE4 | Enterprise auth tier |
| loadBalancer | Load Balancer | Infrastructure | Intelligent workload distribution | PHASE4 | Enterprise scale tier |
| mlPipelineBuilder | ML Pipeline Builder | AI/ML | Custom ML training & deployment | PHASE4 | AI platform subscription |
| semanticSearchEngine | Semantic Search | AI/ML | Advanced code/docs search | PHASE4 | Advanced search tier |
| apiGateway | API Gateway | Integration | Unified API management | PHASE4 | API usage billing |
| distributedTesting | Distributed Testing | Quality | Cross-environment test orchestration | PHASE4 | Enterprise testing tier |

| **PHASE 4 ENTERPRISE AGENTS** |
| multiTenantOrchestrator | Multi-Tenant Orchestrator | Enterprise Governance | Workspace isolation config | PLANNED | Per-tenant pricing |
| complianceEngine | Compliance Engine | Enterprise Governance | Compliance status & remediation | PLANNED | Compliance-as-a-service |
| rbacManager | RBAC Manager | Enterprise Governance | Access control matrix | PLANNED | Advanced permission tiers |
| auditTrailCollector | Audit Trail Collector | Enterprise Governance | Immutable audit logs | PLANNED | Extended retention |
| secretsVault | Secrets Vault | Enterprise Governance | Encrypted secrets management | PLANNED | Secrets storage tiers |
| loadBalancer | Load Balancer | Platform Infrastructure | Load distribution metrics | PLANNED | Premium traffic handling |
| cacheManager | Cache Manager | Platform Infrastructure | Cache performance metrics | PLANNED | Extended cache storage |
| queueManager | Queue Manager | Platform Infrastructure | Job status & queue metrics | PLANNED | Priority queue tiers |
| resourceMonitor | Resource Monitor | Platform Infrastructure | Infrastructure metrics | PLANNED | Advanced monitoring |
| backupOrchestrator | Backup Orchestrator | Platform Infrastructure | Backup status & procedures | PLANNED | Backup storage tiers |
| mlPipelineBuilder | ML Pipeline Builder | Advanced AI/ML | Trained models & configs | PLANNED | Model training credits |
| semanticSearchEngine | Semantic Search Engine | Advanced AI/ML | Vector search results | PLANNED | Search index tiers |
| predictiveAnalyzer | Predictive Analyzer | Advanced AI/ML | Predictions & confidence | PLANNED | Advanced prediction models |
| anomalyDetector | Anomaly Detector | Advanced AI/ML | Anomaly reports & classification | PLANNED | Advanced detection |
| nlpProcessor | NLP Processor | Advanced AI/ML | Text processing results | PLANNED | Document processing credits |
| apiGateway | API Gateway | Ecosystem Integration | API metrics & analytics | PLANNED | API call quotas |
| webhookManager | Webhook Manager | Ecosystem Integration | Delivery status & metrics | PLANNED | Webhook delivery tiers |
| thirdPartyConnector | Third-Party Connector | Ecosystem Integration | Integration sync reports | PLANNED | Premium integration pack |
| dataExporter | Data Exporter | Ecosystem Integration | Exported data files | PLANNED | Export volume tiers |
| apiDocGenerator | API Doc Generator | Ecosystem Integration | Generated documentation | PLANNED | Advanced doc features |
| distributedTesting | Distributed Testing | Advanced DevTools | Parallel test results | PLANNED | Parallel execution tiers |
| deploymentOrchestrator | Deployment Orchestrator | Advanced DevTools | Deployment status & rollback | PLANNED | Advanced deployment |
| performanceProfiler | Performance Profiler | Advanced DevTools | Deep performance reports | PLANNED | Advanced profiling |
| securityScanner | Security Scanner | Advanced DevTools | Security reports & remediation | PLANNED | Security scanning credits |
| infraCodeManager | Infrastructure Code Manager | Advanced DevTools | Validated infra configs | PLANNED | Infrastructure tiers |

---
### 2. Detailed Specifications
