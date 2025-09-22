'use client';
import { useState, useEffect } from 'react';
import { MediaRecorder } from '../../../components/noteflow/MediaRecorder';
import { ScreenCapture } from '../../../components/noteflow/ScreenCapture';
import { VoiceCommandManager } from '../../../components/noteflow/VoiceCommandManager';
import { voiceCommandService } from '../../../lib/services/voiceCommandService';
import styles from './NoteFlow.module.css';

interface TaskInfo {
  title: string;
  status: 'todo' | 'in-progress' | 'completed' | 'cancelled';
  assignedAgent?: string;
  priority?: 'low' | 'medium' | 'high' | 'critical';
  dueDate?: Date;
  subtasks?: Array<{
    id: string;
    title: string;
    completed: boolean;
  }>;
}

interface MemoryNote {
  id: string;
  content: string;
  tags?: string[];
  timestamp: Date;
  attachments?: MediaAttachment[];
  taskInfo?: TaskInfo; // TaskFlow enhancement
  noteType?: 'standard' | 'taskflow'; // Track note type
}

interface MediaAttachment {
  id: string;
  kind: 'image' | 'audio' | 'video' | 'file';
  url: string;
  mime?: string;
  meta?: Record<string, unknown>;
}

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
  const [notes, setNotes] = useState<MemoryNote[]>([
    {
      id: '1',
      content: 'Exploring Google Cloud AI integration patterns for workflow automation. Key insight: Vertex AI provides excellent semantic embedding capabilities for memory systems.',
      tags: ['google-cloud', 'vertex-ai', 'workflows'],
      timestamp: new Date('2025-09-20T15:30:00.000Z'),
      noteType: 'standard'
    },
    {
      id: '2', 
      content: 'Memory capsules should maintain contextual relationships. Each note can connect to multiple other notes through semantic similarity and explicit links.',
      tags: ['memory', 'capsules', 'architecture'],
      timestamp: new Date('2025-09-20T16:15:00.000Z'),
      noteType: 'standard'
    },
    {
      id: '3',
      content: '# OurSynth Platform Development\n\nKey development tasks for the OurSynth ecosystem integration.\n\n## Tasks\n- [ ] Integrate TaskFlow with NoteFlow\n- [ ] Update shell navigation\n- [ ] Add pathways wizard support',
      tags: ['taskflow', 'development', 'integration'],
      timestamp: new Date('2025-09-20T17:00:00.000Z'),
      noteType: 'taskflow',
      taskInfo: {
        title: 'OurSynth Platform Development',
        status: 'in-progress',
        assignedAgent: 'AI Development Agent',
        priority: 'high',
        subtasks: [
          { id: '3_1', title: 'Integrate TaskFlow with NoteFlow', completed: false },
          { id: '3_2', title: 'Update shell navigation', completed: false },
          { id: '3_3', title: 'Add pathways wizard support', completed: false }
        ]
      }
    }
  ]);

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

  const [newNote, setNewNote] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [activeView, setActiveView] = useState<'notes' | 'taskflow' | 'mindmap' | 'search'>('notes');
  const [isSearching, setIsSearching] = useState(false);

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

    const note: MemoryNote = {
      id: Date.now().toString(),
      content: newNote.trim(),
      timestamp: new Date(),
      tags: extractTags(newNote)
    };

    setNotes(prev => [note, ...prev]);
    setNewNote('');

    // Simulate AI processing for semantic connections
    setTimeout(() => {
      console.log('Processing semantic connections for new note...');
    }, 500);
  };

  const extractTags = (content: string): string[] => {
    const hashtagRegex = /#(\w+)/g;
    const matches = content.match(hashtagRegex);
    return matches ? matches.map(tag => tag.slice(1)) : [];
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    
    // Simulate semantic search
    setTimeout(() => {
      setIsSearching(false);
      setActiveView('search');
    }, 800);
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

      // Add audio note
      const audioNote: MemoryNote = {
        id: Date.now().toString(),
        content: `🎤 Audio Recording - ${new Date().toLocaleTimeString()}`,
        timestamp: new Date(),
        tags: ['audio', 'voice-recording'],
        attachments: [audioAttachment]
      };

      setNotes(prev => [audioNote, ...prev]);
      console.log('Audio recording added to notes');
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

      const screenNote: MemoryNote = {
        id: Date.now().toString(),
        content: `📸 Screen Capture - ${new Date().toLocaleTimeString()}`,
        timestamp: new Date(),
        tags: ['screenshot', 'visual'],
        attachments: [imageAttachment]
      };

      setNotes(prev => [screenNote, ...prev]);
      console.log('Screen capture added to notes');
    } catch (error) {
      console.error('Error handling screen capture:', error);
    }
  };

  const handleVoiceCommand = async (command?: any) => {
    if (!command) return;
    
    try {
      const result = await voiceCommandService.executeCommand(
        command, 
        'current-user', // Would come from auth context in real app
        notes,
        setNotes
      );
      console.log('Voice command result:', result);
    } catch (error) {
      console.error('Error executing voice command:', error);
    }
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>NoteFlow Memory Agent</h1>
          <p className={styles.subtitle}>
            Intelligent note management with semantic connections and mindmap visualization
          </p>
        </div>
        <div className={styles.headerActions}>
          <span className={styles.badge}>
            {notes.length} notes • {memoryNodes.length} memory nodes
          </span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className={styles.tabs}>
        <button 
          className={`${styles.tab} ${activeView === 'notes' ? styles.tabActive : ''}`}
          onClick={() => setActiveView('notes')}
        >
          <span className={styles.tabIcon}>📝</span>
          Notes
        </button>
        <button 
          className={`${styles.tab} ${activeView === 'taskflow' ? styles.tabActive : ''}`}
          onClick={() => setActiveView('taskflow')}
        >
          <span className={styles.tabIcon}>✅</span>
          TaskFlow
        </button>
        <button 
          className={`${styles.tab} ${activeView === 'mindmap' ? styles.tabActive : ''}`}
          onClick={() => setActiveView('mindmap')}
        >
          <span className={styles.tabIcon}>🧠</span>
          Mindmap
        </button>
        <button 
          className={`${styles.tab} ${activeView === 'search' ? styles.tabActive : ''}`}
          onClick={() => setActiveView('search')}
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
                      <button className={styles.actionButton} title="Delete note">
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
                        onClick={() => {
                          const filteredNotes = notes.filter(n => n.id !== note.id);
                          setNotes(filteredNotes);
                        }}
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