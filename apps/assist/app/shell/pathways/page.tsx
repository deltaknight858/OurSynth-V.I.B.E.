'use client';

import React, { useState, useEffect } from 'react';
import styles from './Pathways.module.css';

// Types for the Pathways system
interface LearningPath {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: string;
  category: string;
  progress?: number;
  steps: PathwayStep[];
  prerequisites?: string[];
  tags?: string[];
}

interface PathwayStep {
  id: string;
  title: string;
  description: string;
  type: 'content' | 'exercise' | 'project' | 'assessment';
  status: 'locked' | 'available' | 'in-progress' | 'completed';
  content?: string;
  resources?: Resource[];
  timeEstimate: string;
}

interface Resource {
  id: string;
  title: string;
  type: 'video' | 'article' | 'code' | 'demo' | 'reference';
  url: string;
  duration?: string;
}

interface WizardTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  features: string[];
  thumbnail: string;
  estimatedTime: string;
}

export default function PathwaysPage() {
  const [activeView, setActiveView] = useState<'explore' | 'myPaths' | 'wizard' | 'progress'>('explore');
  const [selectedPath, setSelectedPath] = useState<LearningPath | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [wizardStep, setWizardStep] = useState(0);
  const [wizardData, setWizardData] = useState({
    title: '',
    description: '',
    category: '',
    difficulty: 'beginner' as const,
    estimatedTime: '',
    steps: [] as PathwayStep[]
  });

  // Sample learning paths data
  const [learningPaths, setLearningPaths] = useState<LearningPath[]>([
    {
      id: 'ai-fundamentals',
      title: 'AI Fundamentals for Developers',
      description: 'Learn the basics of artificial intelligence, machine learning, and how to integrate AI into your applications.',
      difficulty: 'beginner',
      estimatedTime: '4-6 weeks',
      category: 'AI/ML',
      progress: 25,
      tags: ['ai', 'machine-learning', 'python', 'fundamentals'],
      steps: [
        {
          id: 'intro',
          title: 'Introduction to AI',
          description: 'Understanding what AI is and its applications',
          type: 'content',
          status: 'completed',
          timeEstimate: '30 min'
        },
        {
          id: 'ml-basics',
          title: 'Machine Learning Basics',
          description: 'Core concepts of supervised and unsupervised learning',
          type: 'content',
          status: 'in-progress',
          timeEstimate: '45 min'
        },
        {
          id: 'first-model',
          title: 'Build Your First Model',
          description: 'Hands-on exercise creating a simple prediction model',
          type: 'exercise',
          status: 'available',
          timeEstimate: '2 hours'
        }
      ]
    },
    {
      id: 'fullstack-development',
      title: 'Modern Full-Stack Development',
      description: 'Complete guide to building modern web applications with React, Node.js, and cloud deployment.',
      difficulty: 'intermediate',
      estimatedTime: '8-12 weeks',
      category: 'Web Development',
      progress: 60,
      tags: ['react', 'nodejs', 'cloud', 'fullstack'],
      steps: [
        {
          id: 'frontend',
          title: 'Frontend Development',
          description: 'Building user interfaces with React',
          type: 'content',
          status: 'completed',
          timeEstimate: '3 weeks'
        },
        {
          id: 'backend',
          title: 'Backend APIs',
          description: 'Creating REST APIs with Node.js',
          type: 'project',
          status: 'completed',
          timeEstimate: '2 weeks'
        },
        {
          id: 'deployment',
          title: 'Cloud Deployment',
          description: 'Deploy to Google Cloud Platform',
          type: 'project',
          status: 'in-progress',
          timeEstimate: '1 week'
        }
      ]
    },
    {
      id: 'data-science',
      title: 'Data Science with Python',
      description: 'Master data analysis, visualization, and machine learning with Python and popular libraries.',
      difficulty: 'intermediate',
      estimatedTime: '10-14 weeks',
      category: 'Data Science',
      progress: 0,
      tags: ['python', 'pandas', 'visualization', 'statistics'],
      steps: [
        {
          id: 'python-basics',
          title: 'Python for Data Science',
          description: 'Learn Python fundamentals for data analysis',
          type: 'content',
          status: 'available',
          timeEstimate: '2 weeks'
        },
        {
          id: 'data-analysis',
          title: 'Data Analysis with Pandas',
          description: 'Master data manipulation and analysis',
          type: 'exercise',
          status: 'locked',
          timeEstimate: '3 weeks'
        }
      ]
    }
  ]);

  // Wizard templates
  const wizardTemplates: WizardTemplate[] = [
    {
      id: 'ai-integration',
      name: 'AI Integration Pathway',
      description: 'Learn to integrate AI services into existing applications',
      category: 'AI/ML',
      difficulty: 'intermediate',
      features: ['Google Cloud AI', 'OpenAI API', 'Vertex AI', 'Custom Models'],
      thumbnail: '🤖',
      estimatedTime: '6-8 weeks'
    },
    {
      id: 'web-app',
      name: 'Web Application Pathway',
      description: 'Complete pathway for building modern web applications',
      category: 'Web Development', 
      difficulty: 'beginner',
      features: ['React', 'Node.js', 'Database', 'Authentication'],
      thumbnail: '🌐',
      estimatedTime: '8-10 weeks'
    },
    {
      id: 'mobile-dev',
      name: 'Mobile Development Pathway',
      description: 'Build cross-platform mobile applications',
      category: 'Mobile Development',
      difficulty: 'intermediate',
      features: ['React Native', 'Flutter', 'Native APIs', 'App Store'],
      thumbnail: '📱',
      estimatedTime: '10-12 weeks'
    }
  ];

  const categories = ['all', 'AI/ML', 'Web Development', 'Data Science', 'Mobile Development', 'Cloud Computing'];

  const filteredPaths = learningPaths.filter(path => {
    const matchesSearch = !searchQuery || 
      path.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      path.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      path.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || path.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const handleCreatePath = () => {
    if (wizardData.title && wizardData.description) {
      const newPath: LearningPath = {
        id: Date.now().toString(),
        title: wizardData.title,
        description: wizardData.description,
        category: wizardData.category || 'Custom',
        difficulty: wizardData.difficulty,
        estimatedTime: wizardData.estimatedTime || 'Flexible',
        progress: 0,
        steps: wizardData.steps.length > 0 ? wizardData.steps : [
          {
            id: 'getting-started',
            title: 'Getting Started',
            description: 'Introduction to your learning pathway',
            type: 'content',
            status: 'available',
            timeEstimate: '30 min'
          }
        ],
        tags: ['custom', 'user-created']
      };

      setLearningPaths(prev => [...prev, newPath]);
      setActiveView('myPaths');
      setWizardStep(0);
      setWizardData({
        title: '',
        description: '',
        category: '',
        difficulty: 'beginner',
        estimatedTime: '',
        steps: []
      });
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return '#10b981';
      case 'intermediate': return '#f59e0b';
      case 'advanced': return '#ef4444';
      default: return '#6b7280';
    }
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>Pathways Wizard</h1>
          <p className={styles.subtitle}>
            Create and follow structured learning pathways with adaptive content delivery and progress tracking
          </p>
        </div>
        <div className={styles.headerActions}>
          <button 
            className={`${styles.createButton} ${styles.glowButton}`}
            onClick={() => setActiveView('wizard')}
          >
            <span className={styles.buttonIcon}>✨</span>
            Create Pathway
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className={styles.tabs}>
        <button 
          className={`${styles.tab} ${activeView === 'explore' ? styles.tabActive : ''}`}
          onClick={() => setActiveView('explore')}
        >
          <span className={styles.tabIcon}>🔍</span>
          Explore Paths
        </button>
        <button 
          className={`${styles.tab} ${activeView === 'myPaths' ? styles.tabActive : ''}`}
          onClick={() => setActiveView('myPaths')}
        >
          <span className={styles.tabIcon}>📚</span>
          My Paths
        </button>
        <button 
          className={`${styles.tab} ${activeView === 'wizard' ? styles.tabActive : ''}`}
          onClick={() => setActiveView('wizard')}
        >
          <span className={styles.tabIcon}>🧙‍♂️</span>
          Wizard
        </button>
        <button 
          className={`${styles.tab} ${activeView === 'progress' ? styles.tabActive : ''}`}
          onClick={() => setActiveView('progress')}
        >
          <span className={styles.tabIcon}>📊</span>
          Progress
        </button>
      </div>

      <div className={styles.content}>
        {/* Explore Paths View */}
        {activeView === 'explore' && (
          <>
            {/* Search and Filters */}
            <div className={styles.searchSection}>
              <div className={styles.searchBar}>
                <span className={styles.searchIcon}>🔍</span>
                <input
                  type="text"
                  className={styles.searchInput}
                  placeholder="Search learning pathways..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className={styles.filters}>
                {categories.map(category => (
                  <button
                    key={category}
                    className={`${styles.filterButton} ${selectedCategory === category ? styles.filterActive : ''}`}
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Pathways Grid */}
            <div className={styles.pathwaysGrid}>
              {filteredPaths.map(path => (
                <div key={path.id} className={styles.pathwayCard}>
                  <div className={styles.pathwayHeader}>
                    <h3 className={styles.pathwayTitle}>{path.title}</h3>
                    <div 
                      className={styles.difficultyBadge}
                      style={{ backgroundColor: getDifficultyColor(path.difficulty) }}
                    >
                      {path.difficulty}
                    </div>
                  </div>
                  <p className={styles.pathwayDescription}>{path.description}</p>
                  
                  <div className={styles.pathwayMeta}>
                    <span className={styles.metaItem}>
                      <span className={styles.metaIcon}>⏱️</span>
                      {path.estimatedTime}
                    </span>
                    <span className={styles.metaItem}>
                      <span className={styles.metaIcon}>📚</span>
                      {path.steps.length} steps
                    </span>
                    <span className={styles.metaItem}>
                      <span className={styles.metaIcon}>📂</span>
                      {path.category}
                    </span>
                  </div>

                  {path.progress !== undefined && (
                    <div className={styles.progressSection}>
                      <div className={styles.progressBar}>
                        <div 
                          className={styles.progressFill}
                          style={{ width: `${path.progress}%` }}
                        />
                      </div>
                      <span className={styles.progressText}>{path.progress}% complete</span>
                    </div>
                  )}

                  {path.tags && (
                    <div className={styles.tags}>
                      {path.tags.slice(0, 3).map(tag => (
                        <span key={tag} className={styles.tag}>#{tag}</span>
                      ))}
                      {path.tags.length > 3 && (
                        <span className={styles.tag}>+{path.tags.length - 3} more</span>
                      )}
                    </div>
                  )}

                  <div className={styles.pathwayActions}>
                    <button 
                      className={styles.viewButton}
                      onClick={() => setSelectedPath(path)}
                    >
                      View Details
                    </button>
                    <button className={styles.startButton}>
                      {path.progress ? 'Continue' : 'Start Learning'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* My Paths View */}
        {activeView === 'myPaths' && (
          <div className={styles.myPathsView}>
            <div className={styles.sectionHeader}>
              <h2>My Learning Pathways</h2>
              <p>Track your progress across all enrolled pathways</p>
            </div>

            <div className={styles.pathwaysGrid}>
              {learningPaths
                .filter(path => path.progress !== undefined && path.progress > 0)
                .map(path => (
                  <div key={path.id} className={`${styles.pathwayCard} ${styles.myPathCard}`}>
                    <div className={styles.pathwayHeader}>
                      <h3 className={styles.pathwayTitle}>{path.title}</h3>
                      <div 
                        className={styles.difficultyBadge}
                        style={{ backgroundColor: getDifficultyColor(path.difficulty) }}
                      >
                        {path.difficulty}
                      </div>
                    </div>
                    
                    <div className={styles.progressSection}>
                      <div className={styles.progressBar}>
                        <div 
                          className={styles.progressFill}
                          style={{ width: `${path.progress}%` }}
                        />
                      </div>
                      <span className={styles.progressText}>{path.progress}% complete</span>
                    </div>

                    <div className={styles.stepsSummary}>
                      <h4>Current Steps:</h4>
                      {path.steps.slice(0, 3).map(step => (
                        <div key={step.id} className={styles.stepItem}>
                          <span className={`${styles.stepStatus} ${styles[`status${step.status.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join('')}`]}`}>
                            {step.status === 'completed' ? '✅' : 
                             step.status === 'in-progress' ? '🔄' : 
                             step.status === 'available' ? '📋' : '🔒'}
                          </span>
                          <span className={styles.stepTitle}>{step.title}</span>
                          <span className={styles.stepTime}>({step.timeEstimate})</span>
                        </div>
                      ))}
                    </div>

                    <div className={styles.pathwayActions}>
                      <button className={styles.continueButton}>
                        Continue Learning
                      </button>
                      <button className={styles.viewButton}>
                        View Progress
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Wizard View */}
        {activeView === 'wizard' && (
          <div className={styles.wizardView}>
            <div className={styles.wizardHeader}>
              <h2>Create Custom Learning Pathway</h2>
              <div className={styles.wizardProgress}>
                <div className={styles.progressSteps}>
                  {['Template', 'Content', 'Structure', 'Review'].map((step, index) => (
                    <div 
                      key={step}
                      className={`${styles.progressStep} ${wizardStep >= index ? styles.progressStepActive : ''}`}
                    >
                      <div className={styles.stepNumber}>{index + 1}</div>
                      <span className={styles.stepLabel}>{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className={styles.wizardContent}>
              {wizardStep === 0 && (
                <div className={styles.templateSelection}>
                  <h3>Choose a Template</h3>
                  <p>Select a pathway template to get started quickly, or create from scratch</p>
                  
                  <div className={styles.templatesGrid}>
                    {wizardTemplates.map(template => (
                      <div key={template.id} className={styles.templateCard}>
                        <div className={styles.templateIcon}>{template.thumbnail}</div>
                        <h4>{template.name}</h4>
                        <p>{template.description}</p>
                        <div className={styles.templateMeta}>
                          <span className={styles.templateDifficulty} style={{ color: getDifficultyColor(template.difficulty) }}>
                            {template.difficulty}
                          </span>
                          <span>{template.estimatedTime}</span>
                        </div>
                        <div className={styles.templateFeatures}>
                          {template.features.slice(0, 2).map(feature => (
                            <span key={feature} className={styles.templateFeature}>{feature}</span>
                          ))}
                        </div>
                        <button className={styles.selectTemplateButton}>
                          Use Template
                        </button>
                      </div>
                    ))}
                    <div className={styles.templateCard}>
                      <div className={styles.templateIcon}>🎯</div>
                      <h4>Start from Scratch</h4>
                      <p>Create a completely custom pathway tailored to your needs</p>
                      <div className={styles.templateMeta}>
                        <span>Custom</span>
                        <span>Flexible</span>
                      </div>
                      <button 
                        className={styles.selectTemplateButton}
                        onClick={() => setWizardStep(1)}
                      >
                        Start Custom
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {wizardStep === 1 && (
                <div className={styles.contentStep}>
                  <h3>Define Your Pathway</h3>
                  <div className={styles.form}>
                    <div className={styles.formGroup}>
                      <label>Pathway Title</label>
                      <input
                        type="text"
                        className={styles.formInput}
                        placeholder="e.g., Machine Learning for Beginners"
                        value={wizardData.title}
                        onChange={(e) => setWizardData(prev => ({ ...prev, title: e.target.value }))}
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label>Description</label>
                      <textarea
                        className={styles.formTextarea}
                        placeholder="Describe what learners will achieve..."
                        value={wizardData.description}
                        onChange={(e) => setWizardData(prev => ({ ...prev, description: e.target.value }))}
                        rows={4}
                      />
                    </div>
                    <div className={styles.formRow}>
                      <div className={styles.formGroup}>
                        <label>Category</label>
                        <select
                          className={styles.formSelect}
                          value={wizardData.category}
                          onChange={(e) => setWizardData(prev => ({ ...prev, category: e.target.value }))}
                        >
                          <option value="">Select category</option>
                          {categories.filter(c => c !== 'all').map(category => (
                            <option key={category} value={category}>{category}</option>
                          ))}
                        </select>
                      </div>
                      <div className={styles.formGroup}>
                        <label>Difficulty</label>
                        <select
                          className={styles.formSelect}
                          value={wizardData.difficulty}
                          onChange={(e) => setWizardData(prev => ({ ...prev, difficulty: e.target.value as any }))}
                        >
                          <option value="beginner">Beginner</option>
                          <option value="intermediate">Intermediate</option>
                          <option value="advanced">Advanced</option>
                        </select>
                      </div>
                      <div className={styles.formGroup}>
                        <label>Estimated Time</label>
                        <input
                          type="text"
                          className={styles.formInput}
                          placeholder="e.g., 4-6 weeks"
                          value={wizardData.estimatedTime}
                          onChange={(e) => setWizardData(prev => ({ ...prev, estimatedTime: e.target.value }))}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {wizardStep === 2 && (
                <div className={styles.structureStep}>
                  <h3>Structure Your Pathway</h3>
                  <p>Add learning steps and organize content flow</p>
                  
                  <div className={styles.stepsBuilder}>
                    <div className={styles.stepsHeader}>
                      <h4>Learning Steps</h4>
                      <button className={styles.addStepButton}>
                        <span>➕</span>
                        Add Step
                      </button>
                    </div>
                    
                    <div className={styles.stepsPreview}>
                      <div className={styles.stepPreview}>
                        <div className={styles.stepIcon}>📚</div>
                        <div className={styles.stepContent}>
                          <h5>Introduction & Setup</h5>
                          <p>Getting started with the fundamentals</p>
                          <span className={styles.stepType}>Content • 30 min</span>
                        </div>
                      </div>
                      <div className={styles.stepPreview}>
                        <div className={styles.stepIcon}>💻</div>
                        <div className={styles.stepContent}>
                          <h5>Hands-on Practice</h5>
                          <p>Apply concepts with guided exercises</p>
                          <span className={styles.stepType}>Exercise • 2 hours</span>
                        </div>
                      </div>
                      <div className={styles.stepPreview}>
                        <div className={styles.stepIcon}>🚀</div>
                        <div className={styles.stepContent}>
                          <h5>Final Project</h5>
                          <p>Build something amazing to showcase your skills</p>
                          <span className={styles.stepType}>Project • 1 week</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {wizardStep === 3 && (
                <div className={styles.reviewStep}>
                  <h3>Review & Publish</h3>
                  <p>Review your pathway before making it available</p>
                  
                  <div className={styles.reviewSummary}>
                    <div className={styles.summaryCard}>
                      <h4>{wizardData.title || 'Untitled Pathway'}</h4>
                      <p>{wizardData.description || 'No description provided'}</p>
                      <div className={styles.summaryMeta}>
                        <span>Category: {wizardData.category || 'Uncategorized'}</span>
                        <span>Difficulty: {wizardData.difficulty}</span>
                        <span>Duration: {wizardData.estimatedTime || 'Not specified'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className={styles.wizardActions}>
              {wizardStep > 0 && (
                <button 
                  className={styles.wizardButton}
                  onClick={() => setWizardStep(prev => prev - 1)}
                >
                  Previous
                </button>
              )}
              {wizardStep < 3 ? (
                <button 
                  className={`${styles.wizardButton} ${styles.wizardButtonPrimary}`}
                  onClick={() => setWizardStep(prev => prev + 1)}
                  disabled={wizardStep === 1 && (!wizardData.title || !wizardData.description)}
                >
                  Next
                </button>
              ) : (
                <button 
                  className={`${styles.wizardButton} ${styles.wizardButtonSuccess}`}
                  onClick={handleCreatePath}
                  disabled={!wizardData.title || !wizardData.description}
                >
                  <span className={styles.buttonIcon}>🚀</span>
                  Create Pathway
                </button>
              )}
            </div>
          </div>
        )}

        {/* Progress View */}
        {activeView === 'progress' && (
          <div className={styles.progressView}>
            <div className={styles.sectionHeader}>
              <h2>Learning Progress Dashboard</h2>
              <p>Track your overall learning journey and achievements</p>
            </div>

            <div className={styles.progressStats}>
              <div className={styles.statCard}>
                <div className={styles.statIcon}>📚</div>
                <div className={styles.statContent}>
                  <h3>{learningPaths.filter(p => p.progress && p.progress > 0).length}</h3>
                  <p>Active Pathways</p>
                </div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statIcon}>✅</div>
                <div className={styles.statContent}>
                  <h3>{learningPaths.reduce((sum, p) => sum + p.steps.filter(s => s.status === 'completed').length, 0)}</h3>
                  <p>Steps Completed</p>
                </div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statIcon}>⏱️</div>
                <div className={styles.statContent}>
                  <h3>47</h3>
                  <p>Hours Learned</p>
                </div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statIcon}>🏆</div>
                <div className={styles.statContent}>
                  <h3>12</h3>
                  <p>Achievements</p>
                </div>
              </div>
            </div>

            <div className={styles.recentActivity}>
              <h3>Recent Activity</h3>
              <div className={styles.activityFeed}>
                <div className={styles.activityItem}>
                  <div className={styles.activityIcon}>✅</div>
                  <div className={styles.activityContent}>
                    <span className={styles.activityTitle}>Completed "Machine Learning Basics"</span>
                    <span className={styles.activityTime}>2 hours ago</span>
                  </div>
                </div>
                <div className={styles.activityItem}>
                  <div className={styles.activityIcon}>🔄</div>
                  <div className={styles.activityContent}>
                    <span className={styles.activityTitle}>Started "Cloud Deployment" project</span>
                    <span className={styles.activityTime}>1 day ago</span>
                  </div>
                </div>
                <div className={styles.activityItem}>
                  <div className={styles.activityIcon}>🏆</div>
                  <div className={styles.activityContent}>
                    <span className={styles.activityTitle}>Earned "First Model" achievement</span>
                    <span className={styles.activityTime}>3 days ago</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Path Details Modal */}
      {selectedPath && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3>{selectedPath.title}</h3>
              <button 
                className={styles.modalClose}
                onClick={() => setSelectedPath(null)}
              >
                ✕
              </button>
            </div>
            <div className={styles.modalBody}>
              <p>{selectedPath.description}</p>
              <div className={styles.pathDetails}>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Difficulty:</span>
                  <span 
                    className={styles.detailValue}
                    style={{ color: getDifficultyColor(selectedPath.difficulty) }}
                  >
                    {selectedPath.difficulty}
                  </span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Duration:</span>
                  <span className={styles.detailValue}>{selectedPath.estimatedTime}</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Steps:</span>
                  <span className={styles.detailValue}>{selectedPath.steps.length} learning steps</span>
                </div>
              </div>

              <div className={styles.stepsOverview}>
                <h4>Learning Steps</h4>
                {selectedPath.steps.map((step, index) => (
                  <div key={step.id} className={styles.stepOverview}>
                    <div className={styles.stepNumber}>{index + 1}</div>
                    <div className={styles.stepDetails}>
                      <h5>{step.title}</h5>
                      <p>{step.description}</p>
                      <div className={styles.stepMeta}>
                        <span className={styles.stepType}>{step.type}</span>
                        <span className={styles.stepTime}>{step.timeEstimate}</span>
                      </div>
                    </div>
                    <div className={`${styles.stepStatus} ${styles[`status${step.status.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join('')}`]}`}>
                      {step.status === 'completed' ? '✅' : 
                       step.status === 'in-progress' ? '🔄' : 
                       step.status === 'available' ? '📋' : '🔒'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className={styles.modalActions}>
              <button 
                className={styles.modalButton}
                onClick={() => setSelectedPath(null)}
              >
                Close
              </button>
              <button className={`${styles.modalButton} ${styles.modalButtonPrimary}`}>
                {selectedPath.progress ? 'Continue Path' : 'Start Path'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}