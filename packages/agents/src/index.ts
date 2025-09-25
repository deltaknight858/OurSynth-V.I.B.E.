<<<<<<< HEAD
export * from './IAgent';

// Re-export main interfaces for convenience
export type {
  IAgent,
  IAgentRegistry,
  IAgentOrchestrator,
  AgentRequest,
  AgentResponse,
  AgentContext,
  AgentMetadata,
  AgentCapability
} from './IAgent';

// Re-export agent types
export { AgentTypes } from './IAgent';
=======
/**
 * Phase 3 Agents - Monetization & Marketplace
 * 
 * This module exports all Phase 3 agents according to the OurSynth roadmap:
 * - monetizationScout: Identify candidate components/assets for marketplace
 * - marketplacePublisher: Prepare marketplace metadata and validation
 * - brandPulse: Scan for brand consistency violations
 * - releasePlanner: Generate changelogs and version recommendations
 */

export * from './types.js';
export * from './monetizationScout.js';
export * from './marketplacePublisher.js';
export * from './brandPulse.js';
export * from './releasePlanner.js';

// Agent registry for Phase 3
export const PHASE3_AGENTS = {
  monetizationScout: 'MonetizationScoutAgent',
  marketplacePublisher: 'MarketplacePublisherAgent',
  brandPulse: 'BrandPulseAgent',
  releasePlanner: 'ReleasePlannerAgent'
} as const;

export type Phase3AgentType = keyof typeof PHASE3_AGENTS;
>>>>>>> main
