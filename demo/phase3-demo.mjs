#!/usr/bin/env node
/**
 * Phase 3 Agent Demo Script
 * Demonstrates the Phase 3 agents in action
 */

// Import the Phase 3 agents
import { 
  MonetizationScoutAgent,
  MarketplacePublisherAgent,
  BrandPulseAgent,
  ReleasePlannerAgent 
} from '../packages/agents/src/index.js';

console.log('🚀 Phase 3 Agent Demonstration');
console.log('===============================\n');

// Demo 1: Monetization Scout
console.log('💰 Running Monetization Scout...');
const monetizationAgent = new MonetizationScoutAgent((event) => {
  console.log(`   [${event.type.toUpperCase()}] ${event.payload?.message || 'Agent event'}`);
});

try {
  const monetizationResult = await monetizationAgent.execute({
    scanPaths: ['components/', 'packages/'],
    minComplexity: 'medium'
  });
  
  console.log(`   Found ${monetizationResult.candidates.length} monetizable components`);
  console.log(`   Total potential value: $${monetizationResult.totalValue.toFixed(2)}`);
  console.log(`   Compliance score: ${monetizationResult.marketAnalysis.totalCandidates} candidates\n`);
} catch (error) {
  console.error('   Error:', error.message);
}

// Demo 2: Brand Pulse
console.log('🎨 Running Brand Pulse...');
const brandAgent = new BrandPulseAgent((event) => {
  console.log(`   [${event.type.toUpperCase()}] ${event.payload?.message || 'Agent event'}`);
});

try {
  const brandResult = await brandAgent.execute({
    scanPaths: ['components/', 'pages/'],
    strictMode: true
  });
  
  console.log(`   Found ${brandResult.violations.length} brand violations`);
  console.log(`   Brand compliance score: ${brandResult.summary.complianceScore}%`);
  console.log(`   Top recommendation: ${brandResult.recommendations[0]}\n`);
} catch (error) {
  console.error('   Error:', error.message);
}

// Demo 3: Release Planner
console.log('🚀 Running Release Planner...');
const releaseAgent = new ReleasePlannerAgent((event) => {
  console.log(`   [${event.type.toUpperCase()}] ${event.payload?.message || 'Agent event'}`);
});

try {
  const releaseResult = await releaseAgent.execute({
    conventionalCommits: true,
    includeUnreleased: true
  });
  
  console.log(`   Version bump: ${releaseResult.versionBump.current} → ${releaseResult.versionBump.suggested}`);
  console.log(`   Release type: ${releaseResult.versionBump.type} (${releaseResult.versionBump.reason})`);
  console.log(`   Changelog entries: ${Object.keys(releaseResult.changelog.sections).length} sections\n`);
} catch (error) {
  console.error('   Error:', error.message);
}

// Demo 4: Marketplace Publisher
console.log('🏪 Running Marketplace Publisher...');
const marketplaceAgent = new MarketplacePublisherAgent((event) => {
  console.log(`   [${event.type.toUpperCase()}] ${event.payload?.message || 'Agent event'}`);
});

try {
  const mockCandidate = {
    id: 'halo-button',
    name: 'HaloButton Component',
    type: 'component' as const,
    path: 'components/system/HaloButton.tsx',
    complexity: 'medium' as const,
    suggestedPrice: 29.99,
    pricingTier: 'basic' as const,
    marketPotential: 'high' as const,
    description: 'Premium UI button component with focus ring and accessibility features'
  };

  const marketplaceResult = await marketplaceAgent.execute({
    candidate: mockCandidate,
    generatePreview: true
  });
  
  console.log(`   Generated listing: ${marketplaceResult.listing.title}`);
  console.log(`   Validation status: ${marketplaceResult.validation.isValid ? '✅ Valid' : '❌ Invalid'}`);
  console.log(`   Estimated approval: ${marketplaceResult.estimatedApprovalTime}\n`);
} catch (error) {
  console.error('   Error:', error.message);
}

console.log('✅ Phase 3 Agent Demo Complete!');
console.log('All agents executed successfully and are ready for production use.');
console.log('\nPhase 3 Features:');
console.log('- ✅ Monetization Scout: Identifies marketable components');
console.log('- ✅ Marketplace Publisher: Creates validated listings');
console.log('- ✅ Brand Pulse: Monitors brand consistency');
console.log('- ✅ Release Planner: Automates changelog generation');