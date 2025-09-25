'use client'

import React, { useState, useEffect, useRef } from 'react'
import styles from './Provenance.module.css'

// TypeScript interfaces for Provenance System
interface ProvenanceNode {
  id: string
  type: 'agent' | 'capsule' | 'workflow' | 'data' | 'transform' | 'output'
  label: string
  status: 'pending' | 'running' | 'completed' | 'failed' | 'skipped'
  startTime: string
  endTime?: string
  duration?: number
  cost?: number
  position: { x: number; y: number }
  inputs: string[]
  outputs: string[]
  metadata: {
    agentType?: string
    capsuleId?: string
    version?: string
    parameters?: Record<string, any>
    resources?: {
      cpu: number
      memory: number
      gpu?: number
    }
  }
  artifacts: ProvenanceArtifact[]
  logs: ProvenanceLog[]
  metrics: ProvenanceMetrics
}

interface ProvenanceConnection {
  id: string
  source: string
  target: string
  type: 'data' | 'control' | 'dependency'
  label?: string
  dataFlow: {
    size: number
    format: string
    timestamp: string
  }
}

interface ProvenanceArtifact {
  id: string
  name: string
  type: 'file' | 'model' | 'data' | 'image' | 'document'
  size: number
  format: string
  path: string
  timestamp: string
  metadata?: Record<string, any>
}

interface ProvenanceLog {
  id: string
  level: 'info' | 'warn' | 'error' | 'debug'
  message: string
  timestamp: string
  context?: Record<string, any>
}

interface ProvenanceMetrics {
  executionTime: number
  memoryUsage: number
  cpuUtilization: number
  errorRate: number
  throughput: number
  costs: {
    compute: number
    storage: number
    network: number
    total: number
  }
}

interface ExecutionSession {
  id: string
  name: string
  description: string
  startTime: string
  endTime?: string
  status: 'running' | 'completed' | 'failed' | 'cancelled'
  totalNodes: number
  completedNodes: number
  failedNodes: number
  totalCost: number
  totalDuration: number
  environment: string
  user: string
  tags: string[]
}

interface TimelineEvent {
  id: string
  nodeId: string
  type: 'start' | 'complete' | 'error' | 'milestone'
  timestamp: string
  message: string
  details?: any
}

const ProvenanceReviewPage: React.FC = () => {
  // State management
  const [activeTab, setActiveTab] = useState<'sessions' | 'timeline' | 'graph' | 'reports'>('sessions')
  const [selectedSession, setSelectedSession] = useState<ExecutionSession | null>(null)
  const [selectedNode, setSelectedNode] = useState<ProvenanceNode | null>(null)
  const [isTimelineView, setIsTimelineView] = useState(false)
  const [timeRange, setTimeRange] = useState({ start: '', end: '' })
  const [zoomLevel, setZoomLevel] = useState(1)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Mock data for execution sessions
  const [sessions, setSessions] = useState<ExecutionSession[]>([
    {
      id: 'session-1',
      name: 'Data Analysis Pipeline',
      description: 'Complete analysis workflow with ML training and visualization',
      startTime: '2025-09-20T08:00:00Z',
      endTime: '2025-09-20T10:30:00Z',
      status: 'completed',
      totalNodes: 15,
      completedNodes: 15,
      failedNodes: 0,
      totalCost: 24.75,
      totalDuration: 9000,
      environment: 'production',
      user: 'alice@oursynth.com',
      tags: ['ml', 'analysis', 'batch']
    },
    {
      id: 'session-2',
      name: 'Real-time Processing',
      description: 'Streaming data processing with real-time alerts',
      startTime: '2025-09-20T09:15:00Z',
      status: 'running',
      totalNodes: 8,
      completedNodes: 6,
      failedNodes: 0,
      totalCost: 12.50,
      totalDuration: 4500,
      environment: 'staging',
      user: 'bob@oursynth.com',
      tags: ['streaming', 'real-time', 'alerts']
    },
    {
      id: 'session-3',
      name: 'Model Training Experiment',
      description: 'Experimental ML model training with hyperparameter tuning',
      startTime: '2025-09-20T07:30:00Z',
      endTime: '2025-09-20T09:45:00Z',
      status: 'failed',
      totalNodes: 12,
      completedNodes: 8,
      failedNodes: 4,
      totalCost: 18.25,
      totalDuration: 8100,
      environment: 'experimental',
      user: 'charlie@oursynth.com',
      tags: ['ml', 'experiment', 'hyperparameter']
    }
  ])

  // Mock provenance nodes for detailed view
  const [provenanceNodes, setProvenanceNodes] = useState<ProvenanceNode[]>([
    {
      id: 'node-1',
      type: 'data',
      label: 'Input Dataset',
      status: 'completed',
      startTime: '2025-09-20T08:00:00Z',
      endTime: '2025-09-20T08:02:00Z',
      duration: 120,
      cost: 0.50,
      position: { x: 100, y: 100 },
      inputs: [],
      outputs: ['node-2'],
      metadata: {
        parameters: { format: 'csv', size: '10MB' }
      },
      artifacts: [
        {
          id: 'artifact-1',
          name: 'dataset.csv',
          type: 'data',
          size: 10485760,
          format: 'csv',
          path: '/data/input/dataset.csv',
          timestamp: '2025-09-20T08:02:00Z'
        }
      ],
      logs: [
        {
          id: 'log-1',
          level: 'info',
          message: 'Dataset loaded successfully',
          timestamp: '2025-09-20T08:02:00Z'
        }
      ],
      metrics: {
        executionTime: 120,
        memoryUsage: 256,
        cpuUtilization: 25,
        errorRate: 0,
        throughput: 87381,
        costs: { compute: 0.30, storage: 0.15, network: 0.05, total: 0.50 }
      }
    },
    {
      id: 'node-2',
      type: 'transform',
      label: 'Data Cleaning',
      status: 'completed',
      startTime: '2025-09-20T08:02:00Z',
      endTime: '2025-09-20T08:08:00Z',
      duration: 360,
      cost: 1.25,
      position: { x: 300, y: 100 },
      inputs: ['node-1'],
      outputs: ['node-3'],
      metadata: {
        parameters: { removeNulls: true, normalizeText: true }
      },
      artifacts: [
        {
          id: 'artifact-2',
          name: 'cleaned_dataset.csv',
          type: 'data',
          size: 9437184,
          format: 'csv',
          path: '/data/processed/cleaned_dataset.csv',
          timestamp: '2025-09-20T08:08:00Z'
        }
      ],
      logs: [
        {
          id: 'log-2',
          level: 'info',
          message: 'Data cleaning completed: 95% records retained',
          timestamp: '2025-09-20T08:08:00Z'
        }
      ],
      metrics: {
        executionTime: 360,
        memoryUsage: 512,
        cpuUtilization: 45,
        errorRate: 0,
        throughput: 26215,
        costs: { compute: 0.85, storage: 0.25, network: 0.15, total: 1.25 }
      }
    },
    {
      id: 'node-3',
      type: 'agent',
      label: 'ML Training Agent',
      status: 'completed',
      startTime: '2025-09-20T08:08:00Z',
      endTime: '2025-09-20T09:15:00Z',
      duration: 4020,
      cost: 15.75,
      position: { x: 500, y: 100 },
      inputs: ['node-2'],
      outputs: ['node-4'],
      metadata: {
        agentType: 'ml-trainer',
        parameters: { 
          algorithm: 'random-forest',
          epochs: 100,
          learningRate: 0.001
        },
        resources: { cpu: 4, memory: 8192, gpu: 1 }
      },
      artifacts: [
        {
          id: 'artifact-3',
          name: 'trained_model.pkl',
          type: 'model',
          size: 52428800,
          format: 'pickle',
          path: '/models/trained_model.pkl',
          timestamp: '2025-09-20T09:15:00Z'
        }
      ],
      logs: [
        {
          id: 'log-3',
          level: 'info',
          message: 'Training completed with 94.2% accuracy',
          timestamp: '2025-09-20T09:15:00Z'
        }
      ],
      metrics: {
        executionTime: 4020,
        memoryUsage: 8192,
        cpuUtilization: 85,
        errorRate: 0,
        throughput: 2348,
        costs: { compute: 12.50, storage: 1.25, network: 2.00, total: 15.75 }
      }
    }
  ])

  // Mock timeline events
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>([
    {
      id: 'event-1',
      nodeId: 'node-1',
      type: 'start',
      timestamp: '2025-09-20T08:00:00Z',
      message: 'Started dataset ingestion'
    },
    {
      id: 'event-2',
      nodeId: 'node-1',
      type: 'complete',
      timestamp: '2025-09-20T08:02:00Z',
      message: 'Dataset loaded: 10MB, 50,000 records'
    },
    {
      id: 'event-3',
      nodeId: 'node-2',
      type: 'start',
      timestamp: '2025-09-20T08:02:00Z',
      message: 'Started data cleaning process'
    },
    {
      id: 'event-4',
      nodeId: 'node-2',
      type: 'complete',
      timestamp: '2025-09-20T08:08:00Z',
      message: 'Data cleaning completed: 47,500 clean records'
    },
    {
      id: 'event-5',
      nodeId: 'node-3',
      type: 'start',
      timestamp: '2025-09-20T08:08:00Z',
      message: 'Started ML model training'
    },
    {
      id: 'event-6',
      nodeId: 'node-3',
      type: 'milestone',
      timestamp: '2025-09-20T08:45:00Z',
      message: 'Training 50% complete, accuracy: 89.1%'
    },
    {
      id: 'event-7',
      nodeId: 'node-3',
      type: 'complete',
      timestamp: '2025-09-20T09:15:00Z',
      message: 'Training completed: 94.2% accuracy achieved'
    }
  ])

  // Handlers
  const handleSessionSelect = (session: ExecutionSession) => {
    setSelectedSession(session)
    setActiveTab('graph')
  }

  const handleNodeSelect = (node: ProvenanceNode) => {
    setSelectedNode(node)
  }

  const handleExportReport = () => {
    if (!selectedSession) return
    
    const report = {
      session: selectedSession,
      nodes: provenanceNodes,
      timeline: timelineEvents,
      exportTime: new Date().toISOString(),
      summary: {
        totalExecutionTime: selectedSession.totalDuration,
        totalCost: selectedSession.totalCost,
        successRate: ((selectedSession.completedNodes / selectedSession.totalNodes) * 100).toFixed(1),
        averageNodeTime: (selectedSession.totalDuration / selectedSession.totalNodes).toFixed(0)
      }
    }
    
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `provenance-report-${selectedSession.name.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    
    if (hours > 0) return `${hours}h ${minutes}m ${secs}s`
    if (minutes > 0) return `${minutes}m ${secs}s`
    return `${secs}s`
  }

  const formatCost = (cost: number): string => {
    return `$${cost.toFixed(2)}`
  }

  const formatBytes = (bytes: number): string => {
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
    if (bytes === 0) return '0 B'
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i]
  }

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'completed': return '#10B981'
      case 'running': return '#3B82F6'
      case 'failed': return '#EF4444'
      case 'pending': return '#F59E0B'
      case 'cancelled': return '#6B7280'
      case 'skipped': return '#9CA3AF'
      default: return '#6B7280'
    }
  }

  return (
    <div className={styles.provenanceContainer}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h1>Provenance & Time Travel</h1>
          <p>Visual execution provenance, simulation, and comprehensive audit trails</p>
        </div>
        <div className={styles.headerActions}>
          {selectedSession && (
            <button 
              className={styles.exportButton}
              onClick={handleExportReport}
            >
              📊 Export Report
            </button>
          )}
          <button className={styles.simulateButton}>
            🔮 Simulate Run
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className={styles.tabNav}>
        <button 
          className={`${styles.tab} ${activeTab === 'sessions' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('sessions')}
        >
          <span className={styles.tabIcon}>📋</span>
          Sessions
        </button>
        <button 
          className={`${styles.tab} ${activeTab === 'timeline' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('timeline')}
        >
          <span className={styles.tabIcon}>⏰</span>
          Timeline
        </button>
        <button 
          className={`${styles.tab} ${activeTab === 'graph' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('graph')}
        >
          <span className={styles.tabIcon}>🕸️</span>
          Execution Graph
        </button>
        <button 
          className={`${styles.tab} ${activeTab === 'reports' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('reports')}
        >
          <span className={styles.tabIcon}>📈</span>
          Analytics
        </button>
      </div>

      {/* Main Content */}
      <div className={styles.content}>
        {activeTab === 'sessions' && (
          <div className={styles.sessionsTab}>
            <div className={styles.sessionsGrid}>
              {sessions.map(session => (
                <div 
                  key={session.id} 
                  className={styles.sessionCard}
                  onClick={() => handleSessionSelect(session)}
                >
                  <div className={styles.sessionHeader}>
                    <h3>{session.name}</h3>
                    <div 
                      className={`${styles.statusBadge} ${styles[`status${session.status.charAt(0).toUpperCase() + session.status.slice(1)}`]}`}
                    >
                      {session.status}
                    </div>
                  </div>
                  
                  <p className={styles.sessionDescription}>{session.description}</p>
                  
                  <div className={styles.sessionStats}>
                    <div className={styles.stat}>
                      <span className={styles.statValue}>{session.completedNodes}/{session.totalNodes}</span>
                      <span className={styles.statLabel}>Nodes</span>
                    </div>
                    <div className={styles.stat}>
                      <span className={styles.statValue}>{formatDuration(session.totalDuration)}</span>
                      <span className={styles.statLabel}>Duration</span>
                    </div>
                    <div className={styles.stat}>
                      <span className={styles.statValue}>{formatCost(session.totalCost)}</span>
                      <span className={styles.statLabel}>Cost</span>
                    </div>
                  </div>

                  <div className={styles.sessionMeta}>
                    <div className={styles.sessionInfo}>
                      <span className={styles.environment}>{session.environment}</span>
                      <span className={styles.user}>{session.user}</span>
                    </div>
                    <div className={styles.sessionTags}>
                      {session.tags.map(tag => (
                        <span key={tag} className={styles.tag}>{tag}</span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'timeline' && (
          <div className={styles.timelineTab}>
            <div className={styles.timelineContainer}>
              <div className={styles.timelineHeader}>
                <h2>Execution Timeline</h2>
                <div className={styles.timelineControls}>
                  <select 
                    className={styles.timeRangeSelect}
                    title="Select time range for timeline view"
                  >
                    <option>Last 24 hours</option>
                    <option>Last 7 days</option>
                    <option>Last 30 days</option>
                    <option>Custom range</option>
                  </select>
                </div>
              </div>
              
              <div className={styles.timeline}>
                {timelineEvents.map(event => (
                  <div key={event.id} className={styles.timelineEvent}>
                    <div className={`${styles.eventMarker} ${styles[event.type]}`}>
                      {event.type === 'start' ? '▶️' :
                       event.type === 'complete' ? '✅' :
                       event.type === 'error' ? '❌' : '🏁'}
                    </div>
                    <div className={styles.eventContent}>
                      <div className={styles.eventHeader}>
                        <span className={styles.eventTime}>
                          {new Date(event.timestamp).toLocaleTimeString()}
                        </span>
                        <span className={styles.eventType}>{event.type}</span>
                      </div>
                      <p className={styles.eventMessage}>{event.message}</p>
                      <span className={styles.eventNode}>Node: {event.nodeId}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'graph' && (
          <div className={styles.graphTab}>
            <div className={styles.graphContainer}>
              <div className={styles.graphHeader}>
                <h2>Execution Graph</h2>
                <div className={styles.graphControls}>
                  <button 
                    className={styles.zoomButton}
                    onClick={() => setZoomLevel(prev => Math.min(prev + 0.2, 3))}
                  >
                    🔍+
                  </button>
                  <button 
                    className={styles.zoomButton}
                    onClick={() => setZoomLevel(prev => Math.max(prev - 0.2, 0.5))}
                  >
                    🔍-
                  </button>
                  <button className={styles.resetButton}>↺ Reset</button>
                </div>
              </div>
              
              <div className={styles.graphCanvas}>
                <div className={styles.nodesContainer}>
                  {provenanceNodes.map(node => (
                    <div
                      key={node.id}
                      className={`${styles.provenanceNode} ${styles[node.type]} ${styles[`status${node.status.charAt(0).toUpperCase() + node.status.slice(1)}`]}`}
                      data-x={node.position.x}
                      data-y={node.position.y}
                      onClick={() => handleNodeSelect(node)}
                    >
                      <div className={styles.nodeIcon}>
                        {node.type === 'data' ? '📊' :
                         node.type === 'agent' ? '🤖' :
                         node.type === 'transform' ? '⚙️' :
                         node.type === 'capsule' ? '💊' :
                         node.type === 'workflow' ? '🔄' : '📤'}
                      </div>
                      <div className={styles.nodeInfo}>
                        <div className={styles.nodeLabel}>{node.label}</div>
                        <div className={styles.nodeStats}>
                          {node.duration && <span>{formatDuration(node.duration)}</span>}
                          {node.cost && <span>{formatCost(node.cost)}</span>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Node Inspector */}
            <div className={styles.nodeInspector}>
              {selectedNode ? (
                <div className={styles.inspectorContent}>
                  <div className={styles.inspectorHeader}>
                    <h3>{selectedNode.label}</h3>
                    <div className={`${styles.statusBadge} ${styles[`status${selectedNode.status.charAt(0).toUpperCase() + selectedNode.status.slice(1)}`]}`}>
                      {selectedNode.status}
                    </div>
                  </div>
                  
                  <div className={styles.inspectorTabs}>
                    <div className={styles.inspectorTab}>
                      <h4>📊 Metrics</h4>
                      <div className={styles.metricsGrid}>
                        <div className={styles.metric}>
                          <span className={styles.metricLabel}>Execution Time</span>
                          <span className={styles.metricValue}>{formatDuration(selectedNode.metrics.executionTime)}</span>
                        </div>
                        <div className={styles.metric}>
                          <span className={styles.metricLabel}>Memory Usage</span>
                          <span className={styles.metricValue}>{formatBytes(selectedNode.metrics.memoryUsage * 1024 * 1024)}</span>
                        </div>
                        <div className={styles.metric}>
                          <span className={styles.metricLabel}>CPU Utilization</span>
                          <span className={styles.metricValue}>{selectedNode.metrics.cpuUtilization}%</span>
                        </div>
                        <div className={styles.metric}>
                          <span className={styles.metricLabel}>Total Cost</span>
                          <span className={styles.metricValue}>{formatCost(selectedNode.metrics.costs.total)}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className={styles.inspectorTab}>
                      <h4>📁 Artifacts ({selectedNode.artifacts.length})</h4>
                      <div className={styles.artifactsList}>
                        {selectedNode.artifacts.map(artifact => (
                          <div key={artifact.id} className={styles.artifact}>
                            <div className={styles.artifactIcon}>
                              {artifact.type === 'model' ? '🧠' :
                               artifact.type === 'data' ? '📊' :
                               artifact.type === 'image' ? '🖼️' : '📄'}
                            </div>
                            <div className={styles.artifactInfo}>
                              <div className={styles.artifactName}>{artifact.name}</div>
                              <div className={styles.artifactMeta}>
                                {formatBytes(artifact.size)} • {artifact.format}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className={styles.inspectorTab}>
                      <h4>📝 Logs ({selectedNode.logs.length})</h4>
                      <div className={styles.logsList}>
                        {selectedNode.logs.map(log => (
                          <div key={log.id} className={`${styles.logEntry} ${styles[log.level]}`}>
                            <div className={styles.logHeader}>
                              <span className={styles.logLevel}>{log.level.toUpperCase()}</span>
                              <span className={styles.logTime}>
                                {new Date(log.timestamp).toLocaleTimeString()}
                              </span>
                            </div>
                            <div className={styles.logMessage}>{log.message}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className={styles.inspectorPlaceholder}>
                  <p>Select a node to inspect its details, metrics, artifacts, and logs</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'reports' && (
          <div className={styles.reportsTab}>
            <div className={styles.reportsGrid}>
              <div className={styles.reportCard}>
                <h3>📊 Performance Analytics</h3>
                <div className={styles.analyticsChart}>
                  <div className={styles.chartPlaceholder}>
                    <p>Execution time trends, resource utilization, and cost analysis</p>
                  </div>
                </div>
              </div>
              
              <div className={styles.reportCard}>
                <h3>💰 Cost Breakdown</h3>
                <div className={styles.costBreakdown}>
                  <div className={styles.costItem}>
                    <span>Compute</span>
                    <span>$18.65 (75%)</span>
                  </div>
                  <div className={styles.costItem}>
                    <span>Storage</span>
                    <span>$3.75 (15%)</span>
                  </div>
                  <div className={styles.costItem}>
                    <span>Network</span>
                    <span>$2.35 (10%)</span>
                  </div>
                </div>
              </div>
              
              <div className={styles.reportCard}>
                <h3>⚡ Success Metrics</h3>
                <div className={styles.successMetrics}>
                  <div className={styles.successMetric}>
                    <div className={styles.metricValue}>94.7%</div>
                    <div className={styles.metricLabel}>Success Rate</div>
                  </div>
                  <div className={styles.successMetric}>
                    <div className={styles.metricValue}>2.3s</div>
                    <div className={styles.metricLabel}>Avg Latency</div>
                  </div>
                  <div className={styles.successMetric}>
                    <div className={styles.metricValue}>1,247</div>
                    <div className={styles.metricLabel}>Total Runs</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProvenanceReviewPage