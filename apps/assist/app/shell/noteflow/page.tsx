'use client';
import { useState, useEffect } from 'react';
import { MediaRecorder } from '../../../components/noteflow/MediaRecorder';
import { ScreenCapture } from '../../../components/noteflow/ScreenCapture';
import { VoiceCommandManager } from '../../../components/noteflow/VoiceCommandManager';
import { serviceRegistry } from '../../../lib/services/serviceRegistry';
import { Note, TaskInfo, MediaAttachment } from '../../../lib/types/core';
import styles from './NoteFlow.module.css';

// Legacy interface for memory nodes (mindmap visualization)
interface MemoryNode {
  id: string;
  title: string;
  content?: string;
  summary?: string;
  tags?: string[];
  createdAt: Date;
  connections?: number;
}

export default function NoteFlowPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newNote, setNewNote] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [activeView, setActiveView] = useState<'notes' | 'taskflow' | 'mindmap' | 'search'>('notes');
  const [isSearching, setIsSearching] = useState(false);
  
  // Wizard context state
  const [showWizardItems, setShowWizardItems] = useState(true);
  const [wizardContext, setWizardContext] = useState<any>(null);

  const [memoryNodes, setMemoryNodes] = useState<MemoryNode[]>([
    {
      id: 'node-1',
      title: 'AI Integration Patterns',
      content: 'Collection of notes about AI integration in OurSynth',
      summary: 'Patterns and best practices for AI service integration',
      tags: ['ai', 'integration'],
      createdAt: new Date('2025-09-20T15:00:00.000Z'),
      connections: 3
    },
    {
      id: 'node-2',
      title: 'Memory Architecture',
      content: 'Design principles for the memory system',
      summary: 'Core concepts for contextual memory management',
      tags: ['memory', 'architecture'],
      createdAt: new Date('2025-09-20T16:00:00.000Z'),
      connections: 5
    }
  ]);

  // Initialize services and load data
  useEffect(() => {
    initializeServices();
  }, []);

  const initializeServices = async () => {
    try {
      setLoading(true);
      
      // Initialize service registry
      const initResult = await serviceRegistry.initialize();
      if (!initResult.success) {
        throw new Error(initResult.error || 'Failed to initialize services');
      }

      // Set view context
      serviceRegistry.setViewContext({ activeView: 'notes' });

      // Load notes
      await loadNotes();

      // Load wizard context
      const wizardContextData = serviceRegistry.wizardContextRegistry.getCurrentContext();
      setWizardContext(wizardContextData);

    } catch (error) {
      console.error('Failed to initialize services:', error);
      setError(error instanceof Error ? error.message : 'Failed to initialize');
    } finally {
      setLoading(false);
    }
  };

  const loadNotes = async () => {
    try {
      const result = await serviceRegistry.getCurrentViewItems();
      if (result.success && result.data) {
        setNotes(result.data as Note[]);
      } else {
        console.error('Failed to load notes:', result.error);
      }
    } catch (error) {
      console.error('Error loading notes:', error);
    }
  };

  // Get all unique tags
  const allTags = Array.from(
    new Set(notes.flatMap(note => note.tags || []))
  );

  const filteredNotes = notes.filter(note => {
    const matchesSearch = !searchQuery || 
      note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (note.tags || []).some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesTags = selectedTags.length === 0 ||
      selectedTags.every(tag => (note.tags || []).includes(tag));

    return matchesSearch && matchesTags;
  });

  const handleAddNote = async () => {
    if (!newNote.trim()) return;

    try {
      // Extract tags and note type
      const tags = extractTags(newNote);
      const isTaskFlow = newNote.includes('TaskFlow') || tags.includes('taskflow');
      
      const noteData = {
        content: newNote.trim(),
        tags: tags.length > 0 ? tags : undefined,
        noteType: isTaskFlow ? 'taskflow' as const : 'standard' as const,
        taskInfo: isTaskFlow ? {
          title: newNote.split('\n')[0].replace('#', '').trim() || 'New TaskFlow',
          status: 'todo' as const,
          priority: 'medium' as const,
          subtasks: [
            { id: `${Date.now()}_1`, title: 'Initial task', completed: false }
          ]
        } : undefined
      };

      // Create note using service registry
      const result = await serviceRegistry.createItemWithWizardContext(noteData, 'note');
      
      if (result.success && result.data) {
        // Update local state
        setNotes(prev => [result.data as Note, ...prev]);
        setNewNote('');
        
        // Update wizard context if applicable
        if (wizardContext?.currentProject) {
          const updatedContext = serviceRegistry.wizardContextRegistry.getCurrentContext();
          setWizardContext(updatedContext);
        }
      } else {
        console.error('Failed to create note:', result.error);
        setError(result.error || 'Failed to create note');
      }
    } catch (error) {
      console.error('Error creating note:', error);
      setError('Failed to create note');
    }
  };

  const extractTags = (content: string): string[] => {
    const hashtagRegex = /#(\w+)/g;
    const matches = content.match(hashtagRegex);
    return matches ? matches.map(tag => tag.slice(1)) : [];
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    
    try {
      // Use service registry for global search
      const result = await serviceRegistry.globalSearch(searchQuery, {
        includeWizardGenerated: showWizardItems,
        itemTypes: ['note']
      });

      if (result.success && result.data) {
        setNotes(result.data.notes as Note[]);
        setActiveView('search');
      } else {
        console.error('Search failed:', result.error);
      }
    } catch (error) {
      console.error('Error during search:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  // Multimedia handlers
  const handleAudioRecording = async (blob: Blob) => {
    try {
      // Create a URL for the audio blob
      const audioUrl = URL.createObjectURL(blob);
      const timestamp = new Date().toISOString();
      
      const audioAttachment: MediaAttachment = {
        id: `audio-${Date.now()}`,
        kind: 'audio',
        url: audioUrl,
        mime: blob.type,
        meta: { 
          size: blob.size,
          duration: 0, // Would be calculated in real implementation
          createdAt: timestamp
        }
      };

      // Create audio note using service
      const noteData = {
        content: `🎤 Audio Recording - ${new Date().toLocaleTimeString()}`,
        tags: ['audio', 'voice-recording'],
        attachments: [audioAttachment]
      };

      const result = await serviceRegistry.createItemWithWizardContext(noteData, 'note');
      
      if (result.success && result.data) {
        setNotes(prev => [result.data as Note, ...prev]);
        console.log('Audio recording added to notes');
      } else {
        console.error('Failed to create audio note:', result.error);
      }
    } catch (error) {
      console.error('Error handling audio recording:', error);
    }
  };

  const handleScreenCapture = async (blob: Blob) => {
    try {
      const imageUrl = URL.createObjectURL(blob);
      const timestamp = new Date().toISOString();
      
      const imageAttachment: MediaAttachment = {
        id: `screen-${Date.now()}`,
        kind: 'image',
        url: imageUrl,
        mime: blob.type,
        meta: {
          size: blob.size,
          createdAt: timestamp,
          captureType: 'screen'
        }
      };

      // Create screen capture note using service
      const noteData = {
        content: `📸 Screen Capture - ${new Date().toLocaleTimeString()}`,
        tags: ['screenshot', 'visual'],
        attachments: [imageAttachment]
      };

      const result = await serviceRegistry.createItemWithWizardContext(noteData, 'note');
      
      if (result.success && result.data) {
        setNotes(prev => [result.data as Note, ...prev]);
        console.log('Screen capture added to notes');
      } else {
        console.error('Failed to create screen capture note:', result.error);
      }
    } catch (error) {
      console.error('Error handling screen capture:', error);
    }
  };

  // Voice command handler
  const handleVoiceCommand = async (command?: any) => {
    if (!command) return;
    
    try {
      const currentUserId = serviceRegistry.authService.getCurrentUserId();
      if (!currentUserId) {
        console.error('No authenticated user for voice command');
        return;
      }

      const result = await serviceRegistry.voiceCommandService.executeCommand(
        command, 
        currentUserId,
        notes,
        setNotes
      );
      
      console.log('Voice command result:', result);
      
      // Reload notes after voice command execution
      await loadNotes();
      
    } catch (error) {
      console.error('Error executing voice command:', error);
    }
  };

  // View switching with service integration
  const handleViewChange = async (newView: 'notes' | 'taskflow' | 'mindmap' | 'search') => {
    if (newView === 'search') {
      setActiveView(newView);
      return;
    }

    try {
      // Map taskflow to notes view with filter
      const serviceView = newView === 'taskflow' ? 'notes' : newView;
      const result = await serviceRegistry.switchView(serviceView);
      
      if (result.success && result.data) {
        if (newView === 'taskflow') {
          // Filter for taskflow notes only
          const taskflowNotes = (result.data as Note[]).filter(note => note.noteType === 'taskflow');
          setNotes(taskflowNotes);
        } else {
          setNotes(result.data as Note[]);
        }
        setActiveView(newView);
      } else {
        console.error('Failed to switch view:', result.error);
      }
    } catch (error) {
      console.error('Error switching view:', error);
    }
  };

  // Delete note handler
  const handleDeleteNote = async (noteId: string) => {
    try {
      const result = await serviceRegistry.noteService.delete(noteId);
      
      if (result.success) {
        setNotes(prev => prev.filter(note => note.id !== noteId));
        
        // Remove from wizard tracking if applicable
        await serviceRegistry.wizardContextRegistry.removeWizardItem(noteId);
        
        console.log('Note deleted successfully');
      } else {
        console.error('Failed to delete note:', result.error);
      }
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  // Early return for loading state
  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
          <p>Initializing NoteFlow services...</p>
        </div>
      </div>
    );
  }

  // Early return for error state
  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.errorContainer}>
          <h2>Error</h2>
          <p>{error}</p>
          <button onClick={initializeServices} className={styles.retryButton}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>NoteFlow Memory Agent</h1>
          <p className={styles.subtitle}>
            Intelligent note management with semantic connections and mindmap visualization
          </p>
          {wizardContext?.currentProject && (
            <div className={styles.wizardContext}>
              <span className={styles.wizardBadge}>
                🧙‍♂️ {wizardContext.currentProject.name} 
                ({wizardContext.currentProject.type})
              </span>
            </div>
          )}
        </div>
        <div className={styles.headerActions}>
          <span className={styles.badge}>
            {notes.length} notes • {memoryNodes.length} memory nodes
            {wizardContext?.activeItems?.length > 0 && 
              ` • ${wizardContext.activeItems.length} wizard items`
            }
          </span>
          <button 
            className={styles.wizardToggle}
            onClick={() => setShowWizardItems(!showWizardItems)}
            title={showWizardItems ? 'Hide wizard items' : 'Show wizard items'}
          >
            {showWizardItems ? '🔮✓' : '🔮'}
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className={styles.tabs}>
        <button 
          className={`${styles.tab} ${activeView === 'notes' ? styles.tabActive : ''}`}
          onClick={() => handleViewChange('notes')}
        >
          <span className={styles.tabIcon}>📝</span>
          Notes
        </button>
        <button 
          className={`${styles.tab} ${activeView === 'taskflow' ? styles.tabActive : ''}`}
          onClick={() => handleViewChange('taskflow')}
        >
          <span className={styles.tabIcon}>✅</span>
          TaskFlow
        </button>
        <button 
          className={`${styles.tab} ${activeView === 'mindmap' ? styles.tabActive : ''}`}
          onClick={() => handleViewChange('mindmap')}
        >
          <span className={styles.tabIcon}>🧠</span>
          Mindmap
        </button>
        <button 
          className={`${styles.tab} ${activeView === 'search' ? styles.tabActive : ''}`}
          onClick={() => handleViewChange('search')}
        >
          <span className={styles.tabIcon}>🔍</span>
          Search
        </button>
      </div>

      <div className={styles.content}>
        {activeView === 'notes' && (
          <>
            {/* Note Input */}
            <div className={styles.noteInput}>
              <div className={styles.inputGroup}>
                <textarea
                  className={styles.textarea}
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Add a memory note... Use #tags for automatic categorization"
                  rows={3}
                />
                <div className={styles.inputActions}>
                  <div className={styles.multimediaControls}>
                    <MediaRecorder onRecordingComplete={handleAudioRecording} />
                    <ScreenCapture onCapture={handleScreenCapture} />
                    <VoiceCommandManager 
                      userId="current-user" 
                      onCommandExecuted={handleVoiceCommand}
                    />
                  </div>
                  <button 
                    className={styles.addButton}
                    onClick={handleAddNote}
                    disabled={!newNote.trim()}
                  >
                    <span className={styles.buttonIcon}>➕</span>
                    Add Note
                  </button>
                </div>
              </div>
              <div className={styles.inputHint}>
                <span>💡 Tip: Use #hashtags to auto-categorize your notes</span>
              </div>
            </div>

            {/* Tag Filter */}
            {allTags.length > 0 && (
              <div className={styles.tagFilter}>
                <div className={styles.filterHeader}>
                  <span className={styles.filterLabel}>Filter by tags:</span>
                  {selectedTags.length > 0 && (
                    <button 
                      className={styles.clearTags}
                      onClick={() => setSelectedTags([])}
                    >
                      Clear all
                    </button>
                  )}
                </div>
                <div className={styles.tagList}>
                  {allTags.map(tag => (
                    <button
                      key={tag}
                      className={`${styles.tagButton} ${selectedTags.includes(tag) ? styles.tagSelected : ''}`}
                      onClick={() => handleTagToggle(tag)}
                    >
                      #{tag}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Notes List */}
            <div className={styles.notesList}>
              {filteredNotes.length === 0 ? (
                <div className={styles.emptyState}>
                  <div className={styles.emptyIcon}>📝</div>
                  <h3>No notes found</h3>
                  <p>
                    {searchQuery || selectedTags.length > 0 
                      ? 'Try adjusting your search or tag filters'
                      : 'Start by adding your first memory note above'
                    }
                  </p>
                </div>
              ) : (
                filteredNotes.map(note => (
                  <div key={note.id} className={styles.noteCard}>
                    <div className={styles.noteContent}>
                      <p className={styles.noteText}>{note.content}</p>
                      
                      {/* Display attachments */}
                      {note.attachments && note.attachments.length > 0 && (
                        <div className={styles.attachments}>
                          {note.attachments.map(attachment => (
                            <div key={attachment.id} className={styles.attachment}>
                              {attachment.kind === 'image' && (
                                <img src={attachment.url} alt="Attachment" />
                              )}
                              {attachment.kind === 'audio' && (
                                <audio controls src={attachment.url}>
                                  Your browser does not support audio playback.
                                </audio>
                              )}
                              {attachment.kind === 'video' && (
                                <video controls width="200" src={attachment.url}>
                                  Your browser does not support video playback.
                                </video>
                              )}
                              {attachment.kind === 'file' && (
                                <div className={styles.attachmentIcon}>
                                  📄
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                      
                      <div className={styles.noteMeta}>
                        <span className={styles.noteTime}>
                          {note.timestamp.toLocaleString()}
                        </span>
                        {note.tags && note.tags.length > 0 && (
                          <div className={styles.noteTags}>
                            {note.tags.map(tag => (
                              <span key={tag} className={styles.noteTag}>
                                #{tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className={styles.noteActions}>
                      <button className={styles.actionButton} title="View connections">
                        🔗
                      </button>
                      <button className={styles.actionButton} title="Edit note">
                        ✏️
                      </button>
                      <button 
                        className={styles.actionButton} 
                        title="Delete note"
                        onClick={() => handleDeleteNote(note.id)}
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}

        {activeView === 'taskflow' && (
          <>
            {/* TaskFlow Input */}
            <div className={styles.noteInput}>
              <div className={styles.inputHeader}>
                <h2 className={styles.sectionTitle}>Create New TaskFlow</h2>
                <div className={styles.inputActions}>
                  <VoiceCommandManager onCommand={handleVoiceCommand} />
                  <MediaRecorder onRecordingComplete={(audioBlob) => console.log('Audio recorded:', audioBlob)} />
                  <ScreenCapture onCapture={(imageUrl) => console.log('Screen captured:', imageUrl)} />
                </div>
              </div>
              
              <div className={styles.inputGroup}>
                <textarea
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Create a new TaskFlow... Use # for tags, describe tasks and assignments..."
                  className={styles.noteTextarea}
                  rows={6}
                />
                <button 
                  onClick={handleAddNote}
                  className={styles.addButton}
                  disabled={!newNote.trim()}
                >
                  Create TaskFlow ✅
                </button>
              </div>
            </div>

            {/* TaskFlow List */}
            <div className={styles.notesGrid}>
              {filteredNotes.filter(note => note.noteType === 'taskflow').length === 0 ? (
                <div className={styles.emptyState}>
                  <div className={styles.emptyStateIcon}>✅</div>
                  <h3>No TaskFlows yet</h3>
                  <p>Create your first TaskFlow to organize tasks and assignments.</p>
                </div>
              ) : (
                filteredNotes.filter(note => note.noteType === 'taskflow').map(note => (
                  <div key={note.id} className={`${styles.noteCard} ${styles.taskflowCard}`}>
                    <div className={styles.noteContent}>
                      {/* TaskFlow Header */}
                      {note.taskInfo && (
                        <div className={styles.taskflowHeader}>
                          <div className={styles.taskflowTitle}>
                            <span className={styles.taskflowIcon}>✅</span>
                            <h3>{note.taskInfo.title}</h3>
                          </div>
                          <div className={styles.taskflowMeta}>
                            <span className={`${styles.taskStatus} ${styles[`status-${note.taskInfo.status}`]}`}>
                              {note.taskInfo.status}
                            </span>
                            {note.taskInfo.priority && (
                              <span className={`${styles.taskPriority} ${styles[`priority-${note.taskInfo.priority}`]}`}>
                                {note.taskInfo.priority}
                              </span>
                            )}
                            {note.taskInfo.assignedAgent && (
                              <span className={styles.assignedAgent}>
                                👤 {note.taskInfo.assignedAgent}
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                      
                      {/* Subtasks */}
                      {note.taskInfo?.subtasks && note.taskInfo.subtasks.length > 0 && (
                        <div className={styles.subtasksList}>
                          <h4>Tasks:</h4>
                          {note.taskInfo.subtasks.map(subtask => (
                            <div key={subtask.id} className={styles.subtaskItem}>
                              <input 
                                type="checkbox" 
                                checked={subtask.completed}
                                onChange={() => {
                                  // Update subtask completion
                                  const updatedNotes = notes.map(n => 
                                    n.id === note.id && n.taskInfo 
                                      ? {
                                          ...n,
                                          taskInfo: {
                                            ...n.taskInfo,
                                            subtasks: n.taskInfo.subtasks?.map(st =>
                                              st.id === subtask.id 
                                                ? { ...st, completed: !st.completed }
                                                : st
                                            )
                                          }
                                        }
                                      : n
                                  );
                                  setNotes(updatedNotes);
                                }}
                              />
                              <span className={subtask.completed ? styles.completedTask : ''}>
                                {subtask.title}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      {/* Note Content */}
                      <div className={styles.noteText}>
                        {note.content.split('\n').map((line, index) => (
                          <div key={index}>{line}</div>
                        ))}
                      </div>
                      
                      {/* Attachments */}
                      {note.attachments && note.attachments.length > 0 && (
                        <div className={styles.attachments}>
                          {note.attachments.map(attachment => (
                            <div key={attachment.id} className={styles.attachment}>
                              {attachment.kind === 'image' && (
                                <img src={attachment.url} alt="Attachment" />
                              )}
                              {attachment.kind === 'audio' && (
                                <audio controls src={attachment.url}>
                                  Your browser does not support audio playback.
                                </audio>
                              )}
                              {attachment.kind === 'video' && (
                                <video controls width="200" src={attachment.url}>
                                  Your browser does not support video playback.
                                </video>
                              )}
                              {attachment.kind === 'file' && (
                                <div className={styles.attachmentIcon}>
                                  📄
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                      
                      <div className={styles.noteMeta}>
                        <span className={styles.noteTime}>
                          {note.timestamp.toLocaleString()}
                        </span>
                        {note.tags && note.tags.length > 0 && (
                          <div className={styles.noteTags}>
                            {note.tags.map(tag => (
                              <span key={tag} className={styles.noteTag}>
                                #{tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className={styles.noteActions}>
                      <button className={styles.actionButton} title="Edit TaskFlow">
                        ✏️
                      </button>
                      <button className={styles.actionButton} title="Share TaskFlow">
                        📤
                      </button>
                      <button 
                        className={styles.actionButton} 
                        title="Delete TaskFlow"
                        onClick={() => handleDeleteNote(note.id)}
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}

        {activeView === 'mindmap' && (
          <div className={styles.mindmapView}>
            <div className={styles.mindmapHeader}>
              <h2 className={styles.sectionTitle}>Memory Network Visualization</h2>
              <div className={styles.mindmapControls}>
                <button className={styles.controlButton}>🔍 Zoom In</button>
                <button className={styles.controlButton}>🔍 Zoom Out</button>
                <button className={styles.controlButton}>🎯 Center</button>
                <button className={styles.controlButton}>⚙️ Settings</button>
              </div>
            </div>
            
            <div className={styles.mindmapContainer}>
              {/* Placeholder for actual mindmap visualization */}
              <div className={styles.mindmapPlaceholder}>
                <div className={styles.mindmapDemo}>
                  {memoryNodes.map((node, index) => (
                    <div 
                      key={node.id} 
                      className={styles.memoryNode}
                      data-node-index={index}
                    >
                      <div className={styles.nodeContent}>
                        <h4 className={styles.nodeTitle}>{node.title}</h4>
                        <p className={styles.nodeSummary}>{node.summary}</p>
                        <div className={styles.nodeStats}>
                          <span>{node.connections} connections</span>
                          <span>{node.tags?.length || 0} tags</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className={styles.mindmapInfo}>
                  <h3>Interactive Memory Network</h3>
                  <p>Visual representation of your notes and their semantic connections</p>
                  <div className={styles.featureList}>
                    <div className={styles.feature}>✨ AI-powered semantic linking</div>
                    <div className={styles.feature}>🔍 Interactive exploration</div>
                    <div className={styles.feature}>📊 Connection strength visualization</div>
                    <div className={styles.feature}>🎨 Customizable layouts</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeView === 'search' && (
          <div className={styles.searchView}>
            <div className={styles.searchHeader}>
              <h2 className={styles.sectionTitle}>Semantic Search</h2>
              <form onSubmit={handleSearch} className={styles.searchForm}>
                <div className={styles.searchInputGroup}>
                  <input
                    type="text"
                    className={styles.searchInput}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search notes by content, context, or semantic similarity..."
                  />
                  <button 
                    type="submit" 
                    className={styles.searchButton}
                    disabled={isSearching}
                  >
                    {isSearching ? '🔄' : '🔍'}
                  </button>
                </div>
              </form>
            </div>

            <div className={styles.searchResults}>
              {isSearching ? (
                <div className={styles.searchLoading}>
                  <div className={styles.loadingSpinner}></div>
                  <p>Processing semantic search with Google Cloud Vertex AI...</p>
                </div>
              ) : searchQuery ? (
                <div className={styles.resultsContainer}>
                  <div className={styles.resultsHeader}>
                    <h3>Search Results for "{searchQuery}"</h3>
                    <span className={styles.resultCount}>{filteredNotes.length} results found</span>
                  </div>
                  {filteredNotes.map(note => (
                    <div key={note.id} className={styles.resultCard}>
                      <div className={styles.resultContent}>
                        <p className={styles.resultText}>{note.content}</p>
                        <div className={styles.resultMeta}>
                          <span className={styles.resultTime}>
                            {note.timestamp.toLocaleString()}
                          </span>
                          <span className={styles.resultRelevance}>Relevance: 94%</span>
                        </div>
                      </div>
                      <div className={styles.resultActions}>
                        <button className={styles.viewButton}>View in Context</button>
                        <button className={styles.connectButton}>Show Connections</button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className={styles.searchEmpty}>
                  <div className={styles.searchEmptyIcon}>🔍</div>
                  <h3>Semantic Search</h3>
                  <p>Search your memory notes using AI-powered semantic understanding</p>
                  <div className={styles.searchFeatures}>
                    <div className={styles.searchFeature}>
                      <span className={styles.featureIcon}>🧠</span>
                      <span>Understands context and meaning</span>
                    </div>
                    <div className={styles.searchFeature}>
                      <span className={styles.featureIcon}>🔗</span>
                      <span>Finds related concepts automatically</span>
                    </div>
                    <div className={styles.searchFeature}>
                      <span className={styles.featureIcon}>⚡</span>
                      <span>Powered by Google Cloud Vertex AI</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}