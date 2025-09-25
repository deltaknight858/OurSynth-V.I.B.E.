/**
 * Phase 3 Agent Dashboard
 * Demonstrates the Phase 3 agents in action
 */

import React, { useState } from 'react';
import type { 
  MonetizationScoutOutput,
  MarketplacePublisherOutput,
  BrandConsistencyOutput,
  ReleasePlanOutput 
} from '@oursynth/agents';

interface AgentResult {
  monetization?: MonetizationScoutOutput;
  marketplace?: MarketplacePublisherOutput;
  brand?: BrandConsistencyOutput;
  release?: ReleasePlanOutput;
}

export default function Phase3AgentDashboard() {
  const [activeTab, setActiveTab] = useState<'monetization' | 'marketplace' | 'brand' | 'release'>('monetization');
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [results, setResults] = useState<AgentResult>({});

  const runAgent = async (agentType: keyof AgentResult) => {
    setLoading(prev => ({ ...prev, [agentType]: true }));
    
    try {
      // Mock agent execution - in real implementation would call actual agents
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockResults: AgentResult = {
        monetization: {
          candidates: [
            {
              id: 'halo-button',
              name: 'HaloButton Component',
              type: 'component',
              path: 'components/system/HaloButton.tsx',
              complexity: 'medium',
              suggestedPrice: 29.99,
              pricingTier: 'basic',
              marketPotential: 'high',
              description: 'Premium UI button component with focus ring and accessibility features'
            }
          ],
          totalValue: 279.97,
          recommendations: ['Focus on high-complexity components for premium pricing'],
          marketAnalysis: {
            totalCandidates: 3,
            byType: { component: 2, template: 1 },
            byPricingTier: { basic: 1, premium: 2 }
          }
        },
        marketplace: {
          listing: {
            id: 'halo-button',
            title: 'HaloButton Component',
            description: 'Premium UI button component with focus ring and accessibility features',
            keywords: ['react', 'component', 'ui', 'button'],
            category: 'Form Controls',
            tags: ['premium', 'production-ready'],
            price: 29.99,
            pricingTier: 'basic',
            documentation: {
              installation: 'npm install @oursynth/halo-button',
              usage: 'import { HaloButton } from "@oursynth/halo-button";',
              examples: ['<HaloButton variant="primary" />']
            },
            metadata: {
              version: '1.0.0',
              author: 'OurSynth',
              license: 'MIT',
              dependencies: ['react', 'typescript'],
              compatibility: ['React 18+', 'TypeScript 5+']
            }
          },
          validation: {
            isValid: true,
            errors: [],
            warnings: [],
            suggestions: ['Consider adding a preview URL']
          },
          estimatedApprovalTime: '2-3 business days'
        },
        brand: {
          violations: [
            {
              id: 'color-hardcode-1',
              type: 'color',
              severity: 'error',
              file: 'components/system/HaloButton.tsx',
              line: 15,
              currentValue: '#0066cc',
              expectedValue: 'var(--color-primary)',
              message: 'Hardcoded color value detected'
            }
          ],
          summary: {
            totalViolations: 4,
            byType: { color: 1, typography: 1, spacing: 1, logo: 1 },
            bySeverity: { error: 1, warning: 2, info: 1 },
            complianceScore: 85
          },
          recommendations: ['Implement CSS custom properties for all brand tokens']
        },
        release: {
          versionBump: {
            current: '2.1.4',
            suggested: '2.2.0',
            type: 'minor',
            reason: 'New features added'
          },
          changelog: {
            version: '2.2.0',
            date: '2025-09-13',
            sections: {
              'Features': [
                {
                  type: 'feat',
                  scope: 'agents',
                  description: 'add Phase 3 monetization and marketplace agents',
                  hash: 'abc123'
                }
              ],
              'Bug Fixes': []
            }
          },
          releaseNotes: '# Release 2.2.0\n\n**New features added**\n\n## ✨ New Features\n- **agents**: add Phase 3 monetization and marketplace agents (abc123)',
          commits: [],
          recommendations: ['Ensure all CI checks pass before release']
        }
      };
      
      setResults(prev => ({ ...prev, [agentType]: mockResults[agentType] }));
    } catch (error) {
      console.error(`Error running ${agentType} agent:`, error);
    } finally {
      setLoading(prev => ({ ...prev, [agentType]: false }));
    }
  };

  const tabs = [
    { key: 'monetization' as const, label: 'Monetization Scout', icon: '💰' },
    { key: 'marketplace' as const, label: 'Marketplace Publisher', icon: '🏪' },
    { key: 'brand' as const, label: 'Brand Pulse', icon: '🎨' },
    { key: 'release' as const, label: 'Release Planner', icon: '🚀' }
  ];

  return (
    <div className="phase3-agent-dashboard">
      <div className="dashboard-header">
        <h1>Phase 3 Agent Dashboard</h1>
        <p>Monetization, Marketplace, Brand Consistency & Release Planning</p>
      </div>

      <div className="tab-navigation">
        {tabs.map(tab => (
          <button
            key={tab.key}
            className={`tab-button ${activeTab === tab.key ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.key)}
          >
            <span className="tab-icon">{tab.icon}</span>
            <span className="tab-label">{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="agent-panel">
        <div className="agent-controls">
          <button
            className="run-agent-button"
            onClick={() => runAgent(activeTab)}
            disabled={loading[activeTab]}
          >
            {loading[activeTab] ? 'Running...' : `Run ${tabs.find(t => t.key === activeTab)?.label}`}
          </button>
        </div>

        <div className="agent-results">
          {activeTab === 'monetization' && results.monetization && (
            <MonetizationResults data={results.monetization} />
          )}
          {activeTab === 'marketplace' && results.marketplace && (
            <MarketplaceResults data={results.marketplace} />
          )}
          {activeTab === 'brand' && results.brand && (
            <BrandResults data={results.brand} />
          )}
          {activeTab === 'release' && results.release && (
            <ReleaseResults data={results.release} />
          )}
        </div>
      </div>

      <style jsx>{`
        .phase3-agent-dashboard {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem;
          font-family: Inter, system-ui, sans-serif;
        }

        .dashboard-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .dashboard-header h1 {
          font-size: 2.5rem;
          font-weight: 700;
          color: #1a1a1a;
          margin-bottom: 0.5rem;
        }

        .dashboard-header p {
          font-size: 1.125rem;
          color: #666;
        }

        .tab-navigation {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 2rem;
          border-bottom: 2px solid #e5e5e5;
        }

        .tab-button {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          border: none;
          background: none;
          font-size: 0.9rem;
          font-weight: 500;
          color: #666;
          cursor: pointer;
          border-bottom: 2px solid transparent;
          transition: all 0.2s ease;
        }

        .tab-button:hover {
          color: #007bff;
          background-color: #f8f9fa;
        }

        .tab-button.active {
          color: #007bff;
          border-bottom-color: #007bff;
        }

        .tab-icon {
          font-size: 1.2rem;
        }

        .agent-panel {
          background: white;
          border-radius: 8px;
          border: 1px solid #e5e5e5;
          padding: 2rem;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .agent-controls {
          margin-bottom: 2rem;
        }

        .run-agent-button {
          background: #007bff;
          color: white;
          border: none;
          padding: 0.75rem 2rem;
          border-radius: 6px;
          font-size: 1rem;
          font-weight: 500;
          cursor: pointer;
          transition: background-color 0.2s ease;
        }

        .run-agent-button:hover:not(:disabled) {
          background: #0056b3;
        }

        .run-agent-button:disabled {
          background: #ccc;
          cursor: not-allowed;
        }

        .agent-results {
          min-height: 400px;
        }
      `}</style>
    </div>
  );
}

// Result components for each agent type
function MonetizationResults({ data }: { data: MonetizationScoutOutput }) {
  return (
    <div className="results-container">
      <h3>💰 Monetization Opportunities</h3>
      <div className="metric-cards">
        <div className="metric-card">
          <div className="metric-value">${data.totalValue.toFixed(2)}</div>
          <div className="metric-label">Total Value</div>
        </div>
        <div className="metric-card">
          <div className="metric-value">{data.candidates.length}</div>
          <div className="metric-label">Candidates</div>
        </div>
      </div>
      <div className="candidates-list">
        {data.candidates.map(candidate => (
          <div key={candidate.id} className="candidate-card">
            <h4>{candidate.name}</h4>
            <p>{candidate.description}</p>
            <div className="candidate-meta">
              <span className="price">${candidate.suggestedPrice}</span>
              <span className="tier">{candidate.pricingTier}</span>
              <span className="potential">{candidate.marketPotential} potential</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MarketplaceResults({ data }: { data: MarketplacePublisherOutput }) {
  return (
    <div className="results-container">
      <h3>🏪 Marketplace Listing</h3>
      <div className="listing-preview">
        <h4>{data.listing.title}</h4>
        <p>{data.listing.description}</p>
        <div className="listing-meta">
          <span className="price">${data.listing.price}</span>
          <span className="category">{data.listing.category}</span>
        </div>
        <div className="validation-status">
          {data.validation.isValid ? '✅ Ready to publish' : '❌ Needs fixes'}
          <span className="approval-time">{data.estimatedApprovalTime}</span>
        </div>
      </div>
    </div>
  );
}

function BrandResults({ data }: { data: BrandConsistencyOutput }) {
  return (
    <div className="results-container">
      <h3>🎨 Brand Consistency</h3>
      <div className="compliance-score">
        <div className="score-circle">
          <span className="score-value">{data.summary.complianceScore}%</span>
          <span className="score-label">Compliance</span>
        </div>
      </div>
      <div className="violations-list">
        {data.violations.map(violation => (
          <div key={violation.id} className={`violation-item ${violation.severity}`}>
            <div className="violation-header">
              <span className="violation-type">{violation.type}</span>
              <span className="violation-severity">{violation.severity}</span>
            </div>
            <div className="violation-message">{violation.message}</div>
            <div className="violation-file">{violation.file}:{violation.line}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ReleaseResults({ data }: { data: ReleasePlanOutput }) {
  return (
    <div className="results-container">
      <h3>🚀 Release Plan</h3>
      <div className="version-bump">
        <div className="version-info">
          <span className="current-version">{data.versionBump.current}</span>
          <span className="arrow">→</span>
          <span className="new-version">{data.versionBump.suggested}</span>
        </div>
        <div className="bump-reason">{data.versionBump.reason}</div>
      </div>
      <div className="changelog-preview">
        <h4>Changelog Preview</h4>
        <pre className="changelog-text">{data.releaseNotes}</pre>
      </div>
    </div>
  );
}