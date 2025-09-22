'use client';
import { useState, useEffect } from 'react';
import AppLayout from "../components/AppLayout";
import { serviceRegistry } from "./apps/assist/lib/services/serviceRegistry";
import { Notebook, Note } from "./apps/assist/lib/types/core";

export default function Notebooks() {
  const [notebooks, setNotebooks] = useState<Notebook[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedNotebook, setSelectedNotebook] = useState<Notebook | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newNotebookTitle, setNewNotebookTitle] = useState('');
  const [newNotebookDescription, setNewNotebookDescription] = useState('');
  const [wizardContext, setWizardContext] = useState<any>(null);

  useEffect(() => {
    initializeNotebooks();
  }, []);

  const initializeNotebooks = async () => {
    try {
      setLoading(true);
      
      // Initialize service registry
      const initResult = await serviceRegistry.initialize();
      if (!initResult.success) {
        throw new Error(initResult.error || 'Failed to initialize services');
      }

      // Set view context
      serviceRegistry.setViewContext({ activeView: 'notebooks' });

      // Load notebooks
      await loadNotebooks();

      // Load wizard context
      const wizardContextData = serviceRegistry.wizardContextRegistry.getCurrentContext();
      setWizardContext(wizardContextData);

    } catch (error) {
      console.error('Failed to initialize notebooks:', error);
      setError(error instanceof Error ? error.message : 'Failed to initialize');
    } finally {
      setLoading(false);
    }
  };

  const loadNotebooks = async () => {
    try {
      const result = await serviceRegistry.getCurrentViewItems();
      if (result.success && result.data) {
        setNotebooks(result.data as Notebook[]);
      } else {
        console.error('Failed to load notebooks:', result.error);
      }
    } catch (error) {
      console.error('Error loading notebooks:', error);
    }
  };

  const handleCreateNotebook = async () => {
    if (!newNotebookTitle.trim()) return;

    try {
      const notebookData = {
        title: newNotebookTitle.trim(),
        description: newNotebookDescription.trim() || undefined,
        tags: ['created-manually'],
        initialNotes: [],
      };

      const result = await serviceRegistry.createItemWithWizardContext(notebookData, 'notebook');
      
      if (result.success && result.data) {
        setNotebooks(prev => [result.data as Notebook, ...prev]);
        setNewNotebookTitle('');
        setNewNotebookDescription('');
        setShowCreateForm(false);
        
        // Update wizard context if applicable
        if (wizardContext?.currentProject) {
          const updatedContext = serviceRegistry.wizardContextRegistry.getCurrentContext();
          setWizardContext(updatedContext);
        }
      } else {
        console.error('Failed to create notebook:', result.error);
        setError(result.error || 'Failed to create notebook');
      }
    } catch (error) {
      console.error('Error creating notebook:', error);
      setError('Failed to create notebook');
    }
  };

  const handleSelectNotebook = async (notebook: Notebook) => {
    setSelectedNotebook(notebook);
    
    // Load notes for this notebook
    try {
      const result = await serviceRegistry.notebookService.getNotes(notebook.id);
      if (result.success && result.data) {
        setNotes(result.data);
      }
    } catch (error) {
      console.error('Error loading notebook notes:', error);
    }
  };

  const handleDeleteNotebook = async (notebookId: string) => {
    try {
      const result = await serviceRegistry.notebookService.delete(notebookId);
      
      if (result.success) {
        setNotebooks(prev => prev.filter(nb => nb.id !== notebookId));
        
        if (selectedNotebook?.id === notebookId) {
          setSelectedNotebook(null);
          setNotes([]);
        }
        
        // Remove from wizard tracking if applicable
        await serviceRegistry.wizardContextRegistry.removeWizardItem(notebookId);
        
        console.log('Notebook deleted successfully');
      } else {
        console.error('Failed to delete notebook:', result.error);
      }
    } catch (error) {
      console.error('Error deleting notebook:', error);
    }
  };

  if (loading) {
    return (
      <AppLayout title="Notebooks">
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <div>Loading notebooks...</div>
        </div>
      </AppLayout>
    );
  }

  if (error) {
    return (
      <AppLayout title="Notebooks">
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <h2>Error</h2>
          <p>{error}</p>
          <button onClick={initializeNotebooks} style={{ padding: '0.5rem 1rem', marginTop: '1rem' }}>
            Retry
          </button>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout title="Notebooks">
      <div style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <h1>Notebooks</h1>
            <p>Organize your notes into notebooks for better structure and collaboration.</p>
            {wizardContext?.currentProject && (
              <div style={{ marginTop: '1rem', padding: '0.5rem 1rem', backgroundColor: '#f0f9ff', borderRadius: '6px', fontSize: '0.9rem' }}>
                🧙‍♂️ <strong>Wizard Context:</strong> {wizardContext.currentProject.name} 
                ({wizardContext.currentProject.type})
              </div>
            )}
          </div>
          <button
            onClick={() => setShowCreateForm(true)}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            + Create Notebook
          </button>
        </div>

        {showCreateForm && (
          <div style={{ 
            marginBottom: '2rem', 
            padding: '1.5rem', 
            border: '1px solid #e5e7eb', 
            borderRadius: '8px',
            backgroundColor: '#fafafa'
          }}>
            <h3>Create New Notebook</h3>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                Title *
              </label>
              <input
                type="text"
                value={newNotebookTitle}
                onChange={(e) => setNewNotebookTitle(e.target.value)}
                placeholder="Enter notebook title..."
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '1rem'
                }}
              />
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                Description
              </label>
              <textarea
                value={newNotebookDescription}
                onChange={(e) => setNewNotebookDescription(e.target.value)}
                placeholder="Enter notebook description..."
                rows={3}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '1rem',
                  resize: 'vertical'
                }}
              />
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button
                onClick={handleCreateNotebook}
                disabled={!newNotebookTitle.trim()}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: newNotebookTitle.trim() ? '#10b981' : '#9ca3af',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: newNotebookTitle.trim() ? 'pointer' : 'not-allowed'
                }}
              >
                Create
              </button>
              <button
                onClick={() => {
                  setShowCreateForm(false);
                  setNewNotebookTitle('');
                  setNewNotebookDescription('');
                }}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: '#6b7280',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: selectedNotebook ? '1fr 2fr' : '1fr', gap: '2rem' }}>
          {/* Notebooks List */}
          <div>
            <div style={{ marginBottom: '1rem' }}>
              <h2>Your Notebooks ({notebooks.length})</h2>
              {wizardContext?.activeItems && (
                <p style={{ fontSize: '0.9rem', color: '#6b7280' }}>
                  Including {wizardContext.activeItems.filter((item: any) => item.type === 'notebook').length} wizard-generated
                </p>
              )}
            </div>

            {notebooks.length === 0 ? (
              <div style={{ 
                padding: '3rem', 
                textAlign: 'center', 
                border: '2px dashed #d1d5db', 
                borderRadius: '8px',
                backgroundColor: '#fafafa'
              }}>
                <h3 style={{ color: '#6b7280' }}>No notebooks yet</h3>
                <p style={{ color: '#9ca3af', marginBottom: '1.5rem' }}>
                  Create your first notebook to organize your notes
                </p>
                <button
                  onClick={() => setShowCreateForm(true)}
                  style={{
                    padding: '0.75rem 1.5rem',
                    backgroundColor: '#3b82f6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer'
                  }}
                >
                  Create Notebook
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {notebooks.map((notebook) => (
                  <div
                    key={notebook.id}
                    style={{
                      padding: '1.5rem',
                      border: selectedNotebook?.id === notebook.id ? '2px solid #3b82f6' : '1px solid #e5e7eb',
                      borderRadius: '8px',
                      backgroundColor: selectedNotebook?.id === notebook.id ? '#f0f9ff' : 'white',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onClick={() => handleSelectNotebook(notebook)}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div style={{ flex: 1 }}>
                        <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem' }}>
                          {notebook.wizardMeta?.isWizardGenerated && '🧙‍♂️ '}
                          {notebook.title}
                        </h3>
                        {notebook.description && (
                          <p style={{ margin: '0 0 1rem 0', color: '#6b7280' }}>
                            {notebook.description}
                          </p>
                        )}
                        <div style={{ fontSize: '0.9rem', color: '#9ca3af' }}>
                          {notebook.notes.length} notes • Created {notebook.createdAt.toLocaleDateString()}
                          {notebook.tags && notebook.tags.length > 0 && (
                            <span> • {notebook.tags.map(tag => `#${tag}`).join(' ')}</span>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteNotebook(notebook.id);
                        }}
                        style={{
                          padding: '0.5rem',
                          backgroundColor: '#ef4444',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '0.9rem'
                        }}
                        title="Delete notebook"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Selected Notebook Details */}
          {selectedNotebook && (
            <div>
              <div style={{ marginBottom: '1.5rem' }}>
                <h2>{selectedNotebook.title}</h2>
                {selectedNotebook.description && (
                  <p style={{ color: '#6b7280', marginBottom: '1rem' }}>
                    {selectedNotebook.description}
                  </p>
                )}
                <div style={{ fontSize: '0.9rem', color: '#9ca3af' }}>
                  {notes.length} notes • Last updated {selectedNotebook.updatedAt.toLocaleDateString()}
                  {selectedNotebook.wizardMeta?.isWizardGenerated && (
                    <div style={{ marginTop: '0.5rem', padding: '0.25rem 0.5rem', backgroundColor: '#ddd6fe', borderRadius: '4px' }}>
                      Generated by {selectedNotebook.wizardMeta.pathwaysContext?.template || 'Pathways Wizard'}
                    </div>
                  )}
                </div>
              </div>

              {notes.length === 0 ? (
                <div style={{ 
                  padding: '2rem', 
                  textAlign: 'center', 
                  border: '1px dashed #d1d5db', 
                  borderRadius: '6px',
                  backgroundColor: '#fafafa'
                }}>
                  <p style={{ color: '#6b7280' }}>This notebook is empty</p>
                  <p style={{ color: '#9ca3af', fontSize: '0.9rem' }}>
                    Add notes to this notebook from the NoteFlow page
                  </p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {notes.map((note) => (
                    <div
                      key={note.id}
                      style={{
                        padding: '1rem',
                        border: '1px solid #e5e7eb',
                        borderRadius: '6px',
                        backgroundColor: 'white'
                      }}
                    >
                      <div style={{ marginBottom: '0.5rem' }}>
                        {note.title && (
                          <h4 style={{ margin: '0 0 0.5rem 0' }}>{note.title}</h4>
                        )}
                        <p style={{ margin: 0, lineHeight: '1.5' }}>
                          {note.content.length > 200 
                            ? note.content.substring(0, 200) + '...' 
                            : note.content
                          }
                        </p>
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#9ca3af', display: 'flex', justifyContent: 'space-between' }}>
                        <span>
                          {note.timestamp.toLocaleDateString()} • {note.noteType || 'standard'}
                          {note.tags && note.tags.length > 0 && (
                            <span> • {note.tags.map(tag => `#${tag}`).join(' ')}</span>
                          )}
                        </span>
                        {note.wizardMeta?.isWizardGenerated && (
                          <span title="Generated by Pathways Wizard">🧙‍♂️</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Feature Highlights */}
        <div style={{ marginTop: '3rem', padding: '2rem', backgroundColor: '#f9fafb', borderRadius: '8px' }}>
          <h2>Feature Highlights</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginTop: '1rem' }}>
            <div>
              <h3 style={{ color: '#1f2937', marginBottom: '0.5rem' }}>📚 Notebook Organization</h3>
              <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>
                Group related notes together in themed notebooks for better organization and context.
              </p>
            </div>
            <div>
              <h3 style={{ color: '#1f2937', marginBottom: '0.5rem' }}>🧙‍♂️ Wizard Integration</h3>
              <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>
                Notebooks created through the Pathways wizard maintain their project context and relationships.
              </p>
            </div>
            <div>
              <h3 style={{ color: '#1f2937', marginBottom: '0.5rem' }}>🤝 Rights-aware Sharing</h3>
              <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>
                Share notebooks with team members with granular permission controls for collaborative editing.
              </p>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
