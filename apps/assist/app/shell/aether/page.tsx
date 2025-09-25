'use client'

import React, { useState, useEffect } from 'react'
import styles from './Aether.module.css'

// TypeScript interfaces for Aether Integration
interface AetherProject {
  id: string
  name: string
  description: string
  type: 'workflow' | 'analysis' | 'visualization' | 'experiment'
  status: 'draft' | 'active' | 'completed' | 'archived'
  lastModified: string
  nodes: number
  connections: number
  collaborators: string[]
  tags: string[]
  thumbnail?: string
}

interface WorkflowTemplate {
  id: string
  name: string
  description: string
  category: 'data-analysis' | 'ml-pipeline' | 'visualization' | 'automation'
  complexity: 'beginner' | 'intermediate' | 'advanced'
  estimatedTime: string
  nodes: WorkflowNode[]
  connections: WorkflowConnection[]
  previewImage?: string
}

interface WorkflowNode {
  id: string
  type: 'input' | 'processing' | 'output' | 'ai-agent' | 'transform'
  label: string
  position: { x: number; y: number }
  config: Record<string, any>
  metadata?: {
    description?: string
    parameters?: any[]
    outputs?: any[]
  }
}

interface WorkflowConnection {
  id: string
  source: string
  target: string
  type: 'data' | 'control' | 'feedback'
}

interface BridgeSession {
  id: string
  assistProject: string
  aetherProject: string
  status: 'syncing' | 'active' | 'paused' | 'error'
  lastSync: string
  conflictCount: number
  syncDirection: 'assist-to-aether' | 'aether-to-assist' | 'bidirectional'
}

const AetherIntegrationPage: React.FC = () => {
  // State management
  const [activeTab, setActiveTab] = useState<'projects' | 'templates' | 'bridge' | 'workflows'>('projects')
  const [selectedProject, setSelectedProject] = useState<AetherProject | null>(null)
  const [isCreatingWorkflow, setIsCreatingWorkflow] = useState(false)
  const [bridgeSessions, setBridgeSessions] = useState<BridgeSession[]>([])
  const [workflowBuilder, setWorkflowBuilder] = useState({
    nodes: [] as WorkflowNode[],
    connections: [] as WorkflowConnection[],
    selectedNode: null as WorkflowNode | null
  })

  // Mock data for Aether projects
  const [aetherProjects, setAetherProjects] = useState<AetherProject[]>([
    {
      id: 'aether-1',
      name: 'Data Analysis Pipeline',
      description: 'Multi-stage data processing workflow with ML integration',
      type: 'analysis',
      status: 'active',
      lastModified: '2025-09-20T10:30:00Z',
      nodes: 15,
      connections: 22,
      collaborators: ['alice@oursynth.com', 'bob@oursynth.com'],
      tags: ['data', 'ml', 'pipeline']
    },
    {
      id: 'aether-2',
      name: 'Real-time Visualization Dashboard',
      description: 'Interactive dashboard for live data monitoring and alerts',
      type: 'visualization',
      status: 'completed',
      lastModified: '2025-09-19T16:45:00Z',
      nodes: 8,
      connections: 12,
      collaborators: ['charlie@oursynth.com'],
      tags: ['visualization', 'dashboard', 'real-time']
    },
    {
      id: 'aether-3',
      name: 'Automated Workflow Engine',
      description: 'Self-managing workflow system with adaptive optimization',
      type: 'workflow',
      status: 'draft',
      lastModified: '2025-09-20T09:15:00Z',
      nodes: 25,
      connections: 40,
      collaborators: ['dave@oursynth.com', 'eve@oursynth.com'],
      tags: ['automation', 'optimization', 'engine']
    }
  ])

  // Mock workflow templates
  const workflowTemplates: WorkflowTemplate[] = [
    {
      id: 'template-1',
      name: 'Data Processing Pipeline',
      description: 'Standard ETL workflow for structured data processing',
      category: 'data-analysis',
      complexity: 'intermediate',
      estimatedTime: '2-4 hours',
      nodes: [
        { id: 'input-1', type: 'input', label: 'Data Source', position: { x: 100, y: 100 }, config: {} },
        { id: 'process-1', type: 'processing', label: 'Clean & Transform', position: { x: 300, y: 100 }, config: {} },
        { id: 'output-1', type: 'output', label: 'Export Results', position: { x: 500, y: 100 }, config: {} }
      ],
      connections: [
        { id: 'conn-1', source: 'input-1', target: 'process-1', type: 'data' },
        { id: 'conn-2', source: 'process-1', target: 'output-1', type: 'data' }
      ]
    },
    {
      id: 'template-2',
      name: 'ML Training Pipeline',
      description: 'Complete machine learning model training and evaluation workflow',
      category: 'ml-pipeline',
      complexity: 'advanced',
      estimatedTime: '4-8 hours',
      nodes: [
        { id: 'data-1', type: 'input', label: 'Training Data', position: { x: 50, y: 50 }, config: {} },
        { id: 'prep-1', type: 'processing', label: 'Data Preprocessing', position: { x: 200, y: 50 }, config: {} },
        { id: 'train-1', type: 'ai-agent', label: 'Model Training', position: { x: 350, y: 50 }, config: {} },
        { id: 'eval-1', type: 'processing', label: 'Evaluation', position: { x: 500, y: 50 }, config: {} },
        { id: 'deploy-1', type: 'output', label: 'Model Deploy', position: { x: 650, y: 50 }, config: {} }
      ],
      connections: [
        { id: 'conn-1', source: 'data-1', target: 'prep-1', type: 'data' },
        { id: 'conn-2', source: 'prep-1', target: 'train-1', type: 'data' },
        { id: 'conn-3', source: 'train-1', target: 'eval-1', type: 'data' },
        { id: 'conn-4', source: 'eval-1', target: 'deploy-1', type: 'control' }
      ]
    }
  ]

  // Initialize bridge sessions
  useEffect(() => {
    setBridgeSessions([
      {
        id: 'bridge-1',
        assistProject: 'assist-pathways-wizard',
        aetherProject: 'aether-1',
        status: 'active',
        lastSync: '2025-09-20T10:35:00Z',
        conflictCount: 0,
        syncDirection: 'bidirectional'
      },
      {
        id: 'bridge-2',
        assistProject: 'assist-noteflow-agent',
        aetherProject: 'aether-2',
        status: 'syncing',
        lastSync: '2025-09-20T10:30:00Z',
        conflictCount: 2,
        syncDirection: 'assist-to-aether'
      }
    ])
  }, [])

  // Handlers
  const handleCreateProject = () => {
    const newProject: AetherProject = {
      id: `aether-${Date.now()}`,
      name: 'New Aether Project',
      description: 'Created from Assist integration',
      type: 'workflow',
      status: 'draft',
      lastModified: new Date().toISOString(),
      nodes: 0,
      connections: 0,
      collaborators: [],
      tags: ['assist-integration']
    }
    setAetherProjects(prev => [...prev, newProject])
    setSelectedProject(newProject)
  }

  const handleCreateFromTemplate = (template: WorkflowTemplate) => {
    setWorkflowBuilder({
      nodes: template.nodes,
      connections: template.connections,
      selectedNode: null
    })
    setIsCreatingWorkflow(true)
  }

  const handleBridgeProject = (assistProject: string, aetherProject: string) => {
    const newSession: BridgeSession = {
      id: `bridge-${Date.now()}`,
      assistProject,
      aetherProject,
      status: 'syncing',
      lastSync: new Date().toISOString(),
      conflictCount: 0,
      syncDirection: 'bidirectional'
    }
    setBridgeSessions(prev => [...prev, newSession])
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#10B981'
      case 'completed': return '#3B82F6'
      case 'draft': return '#F59E0B'
      case 'archived': return '#6B7280'
      case 'syncing': return '#8B5CF6'
      case 'error': return '#EF4444'
      case 'paused': return '#F59E0B'
      default: return '#6B7280'
    }
  }

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString()
  }

  return (
    <div className={styles.aetherContainer}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h1>Assist ↔ Aether Integration</h1>
          <p>Cross-platform workflow bridge with graph generation and unified project management</p>
        </div>
        <div className={styles.headerActions}>
          <button 
            className={styles.createButton}
            onClick={handleCreateProject}
          >
            + New Project
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className={styles.tabNav}>
        <button 
          className={`${styles.tab} ${activeTab === 'projects' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('projects')}
        >
          <span className={styles.tabIcon}>🏗️</span>
          Projects
        </button>
        <button 
          className={`${styles.tab} ${activeTab === 'templates' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('templates')}
        >
          <span className={styles.tabIcon}>📋</span>
          Templates
        </button>
        <button 
          className={`${styles.tab} ${activeTab === 'bridge' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('bridge')}
        >
          <span className={styles.tabIcon}>🌉</span>
          Bridge
        </button>
        <button 
          className={`${styles.tab} ${activeTab === 'workflows' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('workflows')}
        >
          <span className={styles.tabIcon}>⚡</span>
          Workflows
        </button>
      </div>

      {/* Main Content */}
      <div className={styles.content}>
        {activeTab === 'projects' && (
          <div className={styles.projectsTab}>
            <div className={styles.projectsGrid}>
              {aetherProjects.map(project => (
                <div 
                  key={project.id} 
                  className={styles.projectCard}
                  onClick={() => setSelectedProject(project)}
                >
                  <div className={styles.projectHeader}>
                    <h3>{project.name}</h3>
                    <div 
                      className={`${styles.statusBadge} ${styles[`status${project.status.charAt(0).toUpperCase() + project.status.slice(1)}`]}`}
                    >
                      {project.status}
                    </div>
                  </div>
                  <p className={styles.projectDescription}>{project.description}</p>
                  
                  <div className={styles.projectStats}>
                    <div className={styles.stat}>
                      <span className={styles.statValue}>{project.nodes}</span>
                      <span className={styles.statLabel}>Nodes</span>
                    </div>
                    <div className={styles.stat}>
                      <span className={styles.statValue}>{project.connections}</span>
                      <span className={styles.statLabel}>Connections</span>
                    </div>
                    <div className={styles.stat}>
                      <span className={styles.statValue}>{project.collaborators.length}</span>
                      <span className={styles.statLabel}>Collaborators</span>
                    </div>
                  </div>

                  <div className={styles.projectTags}>
                    {project.tags.map(tag => (
                      <span key={tag} className={styles.tag}>{tag}</span>
                    ))}
                  </div>

                  <div className={styles.projectMeta}>
                    <span className={styles.projectType}>{project.type}</span>
                    <span className={styles.lastModified}>
                      {formatTimestamp(project.lastModified)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'templates' && (
          <div className={styles.templatesTab}>
            <div className={styles.templatesGrid}>
              {workflowTemplates.map(template => (
                <div key={template.id} className={styles.templateCard}>
                  <div className={styles.templateHeader}>
                    <h3>{template.name}</h3>
                    <div className={`${styles.complexityBadge} ${styles[template.complexity]}`}>
                      {template.complexity}
                    </div>
                  </div>
                  
                  <p className={styles.templateDescription}>{template.description}</p>
                  
                  <div className={styles.templateMeta}>
                    <div className={styles.templateCategory}>{template.category}</div>
                    <div className={styles.templateTime}>{template.estimatedTime}</div>
                  </div>

                  <div className={styles.templateActions}>
                    <button 
                      className={styles.useTemplateButton}
                      onClick={() => handleCreateFromTemplate(template)}
                    >
                      Use Template
                    </button>
                    <button className={styles.previewButton}>
                      Preview
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'bridge' && (
          <div className={styles.bridgeTab}>
            <div className={styles.bridgeHeader}>
              <h2>Active Bridge Sessions</h2>
              <button className={styles.createBridgeButton}>
                + Create Bridge
              </button>
            </div>

            <div className={styles.bridgeList}>
              {bridgeSessions.map(session => (
                <div key={session.id} className={styles.bridgeSession}>
                  <div className={styles.bridgeInfo}>
                    <div className={styles.bridgeFlow}>
                      <div className={styles.bridgeProject}>
                        <span className={styles.projectLabel}>Assist</span>
                        <span className={styles.projectName}>{session.assistProject}</span>
                      </div>
                      
                      <div className={styles.bridgeArrow}>
                        {session.syncDirection === 'bidirectional' ? '↔️' : 
                         session.syncDirection === 'assist-to-aether' ? '→' : '←'}
                      </div>
                      
                      <div className={styles.bridgeProject}>
                        <span className={styles.projectLabel}>Aether</span>
                        <span className={styles.projectName}>{session.aetherProject}</span>
                      </div>
                    </div>

                    <div className={styles.bridgeStatus}>
                      <div 
                        className={`${styles.statusIndicator} ${styles[`status${session.status.charAt(0).toUpperCase() + session.status.slice(1)}`]}`}
                      >
                        {session.status}
                      </div>
                      
                      {session.conflictCount > 0 && (
                        <div className={styles.conflictBadge}>
                          {session.conflictCount} conflicts
                        </div>
                      )}
                    </div>
                  </div>

                  <div className={styles.bridgeActions}>
                    <span className={styles.lastSync}>
                      Last sync: {formatTimestamp(session.lastSync)}
                    </span>
                    <div className={styles.bridgeControls}>
                      <button className={styles.syncButton}>Sync Now</button>
                      <button className={styles.pauseButton}>Pause</button>
                      <button className={styles.settingsButton}>⚙️</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'workflows' && (
          <div className={styles.workflowsTab}>
            <div className={styles.workflowBuilder}>
              <div className={styles.builderHeader}>
                <h2>Workflow Builder</h2>
                <div className={styles.builderActions}>
                  <button className={styles.addNodeButton}>+ Add Node</button>
                  <button className={styles.saveWorkflowButton}>Save Workflow</button>
                </div>
              </div>

              <div className={styles.workflowCanvas}>
                <div className={styles.canvasGrid}>
                  {workflowBuilder.nodes.map(node => (
                    <div
                      key={node.id}
                      className={`${styles.workflowNode} ${styles[node.type]}`}
                      data-x={node.position.x}
                      data-y={node.position.y}
                      onClick={() => setWorkflowBuilder(prev => ({ 
                        ...prev, 
                        selectedNode: node 
                      }))}
                    >
                      <div className={styles.nodeHeader}>
                        <span className={styles.nodeIcon}>
                          {node.type === 'input' ? '📥' : 
                           node.type === 'processing' ? '⚙️' :
                           node.type === 'output' ? '📤' :
                           node.type === 'ai-agent' ? '🤖' : '🔄'}
                        </span>
                        <span className={styles.nodeLabel}>{node.label}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className={styles.nodeInspector}>
                {workflowBuilder.selectedNode ? (
                  <div className={styles.inspectorContent}>
                    <h3>Node Inspector</h3>
                    <div className={styles.nodeDetails}>
                      <div className={styles.nodeProperty}>
                        <label>Label:</label>
                        <input 
                          type="text" 
                          value={workflowBuilder.selectedNode.label}
                          placeholder="Node label"
                          title="Node label"
                          readOnly
                        />
                      </div>
                      <div className={styles.nodeProperty}>
                        <label>Type:</label>
                        <span className={styles.nodeTypeValue}>
                          {workflowBuilder.selectedNode.type}
                        </span>
                      </div>
                      <div className={styles.nodeProperty}>
                        <label>Position:</label>
                        <span>
                          X: {workflowBuilder.selectedNode.position.x}, 
                          Y: {workflowBuilder.selectedNode.position.y}
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className={styles.inspectorPlaceholder}>
                    <p>Select a node to inspect its properties</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Project Detail Modal */}
      {selectedProject && (
        <div className={styles.modal} onClick={() => setSelectedProject(null)}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>{selectedProject.name}</h2>
              <button 
                className={styles.closeButton}
                onClick={() => setSelectedProject(null)}
              >
                ×
              </button>
            </div>
            
            <div className={styles.modalBody}>
              <div className={styles.projectDetails}>
                <p className={styles.modalDescription}>{selectedProject.description}</p>
                
                <div className={styles.detailsGrid}>
                  <div className={styles.detailItem}>
                    <strong>Type:</strong> {selectedProject.type}
                  </div>
                  <div className={styles.detailItem}>
                    <strong>Status:</strong> 
                    <span 
                      className={`${styles.statusBadge} ${styles[`status${selectedProject.status.charAt(0).toUpperCase() + selectedProject.status.slice(1)}`]}`}
                    >
                      {selectedProject.status}
                    </span>
                  </div>
                  <div className={styles.detailItem}>
                    <strong>Last Modified:</strong> {formatTimestamp(selectedProject.lastModified)}
                  </div>
                  <div className={styles.detailItem}>
                    <strong>Nodes:</strong> {selectedProject.nodes}
                  </div>
                  <div className={styles.detailItem}>
                    <strong>Connections:</strong> {selectedProject.connections}
                  </div>
                </div>

                <div className={styles.collaborators}>
                  <strong>Collaborators:</strong>
                  <div className={styles.collaboratorList}>
                    {selectedProject.collaborators.map(collaborator => (
                      <span key={collaborator} className={styles.collaborator}>
                        {collaborator}
                      </span>
                    ))}
                  </div>
                </div>

                <div className={styles.projectTags}>
                  <strong>Tags:</strong>
                  {selectedProject.tags.map(tag => (
                    <span key={tag} className={styles.tag}>{tag}</span>
                  ))}
                </div>
              </div>
            </div>

            <div className={styles.modalActions}>
              <button className={styles.editButton}>Edit Project</button>
              <button className={styles.openAetherButton}>Open in Aether</button>
              <button 
                className={styles.bridgeButton}
                onClick={() => handleBridgeProject('current-assist-project', selectedProject.id)}
              >
                Bridge to Assist
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AetherIntegrationPage