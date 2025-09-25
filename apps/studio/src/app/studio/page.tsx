"use client";
// Imports
import React, { useState, useCallback, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import styled, { keyframes } from 'styled-components';
import { DroppedComponentBox, ErrorBox, EmptyProjectsBox, CanvasColumn, ComponentCount } from './StyledBoxes';
import { useProjects, useProject, Project } from '@/lib/projects';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { ComponentPalette } from '@/components/ComponentPalette';
import Logo from '@/components/Logo';
import { Title } from '@mui/icons-material';
import { SuggestionTray } from '@/components/SuggestionTray';

// Component types for the palette with enhanced data
const ENHANCED_COMPONENT_TYPES = [
  { id: '1', type: 'input', name: 'Input', icon: '', color: '#00ffcc', category: 'Inputs', description: 'Data input component for user interactions', isFavorite: false },
  { id: '2', type: 'processor', name: 'Processor', icon: '', color: '#a020f0', category: 'Logic', description: 'Process and transform data', isFavorite: false },
  { id: '3', type: 'output', name: 'Output', icon: '', color: '#ff6b6b', category: 'Outputs', description: 'Display processed results', isFavorite: false },
  { id: '4', type: 'database', name: 'Database', icon: '', color: '#4ecdc4', category: 'Data', description: 'Store and retrieve data', isFavorite: false },
  { id: '5', type: 'api', name: 'API', icon: '', color: '#45b7d1', category: 'Integration', description: 'Connect to external services', isFavorite: false },
  { id: '6', type: 'auth', name: 'Auth', icon: '', color: '#f7dc6f', category: 'Security', description: 'User authentication and authorization', isFavorite: false },
  { id: '7', type: 'ui', name: 'UI Component', icon: '', color: '#bb8fce', category: 'UI', description: 'User interface elements', isFavorite: false },
  { id: '8', type: 'logic', name: 'Logic', icon: '', color: '#85c1e9', category: 'Logic', description: 'Business logic and calculations', isFavorite: false },
  { id: '9', type: 'chart', name: 'Chart', icon: '', color: '#58d68d', category: 'Visualization', description: 'Data visualization and charts', isFavorite: false },
  { id: '10', type: 'notification', name: 'Notification', icon: '', color: '#f8c471', category: 'UI', description: 'User notifications and alerts', isFavorite: false },
  { id: '11', type: 'timer', name: 'Timer', icon: '', color: '#ec7063', category: 'Logic', description: 'Time-based operations', isFavorite: false },
  { id: '12', type: 'file', name: 'File Upload', icon: '📎', color: '#76d7c4', category: 'Inputs', description: 'File upload and management', isFavorite: false },
];

// Types
interface DroppedComponent {
  id: string;
  type: string;
  name: string;
  x: number;
  y: number;
  color: string;
  // Add other properties if needed
 }
const StudioContainer = styled.div`
 min-height: 100vh;
  background: var(--background-primary);
  padding: var(--spacing-lg) 0;
`;
const CanvasHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 2rem;
  background: #18181b;
  border-bottom: 1px solid #222;
`;
const CanvasTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: #00ffcc;
  margin: 0;
  letter-spacing: 0.05em;
  text-shadow: 0 0 8px #00ffcc44;
`;
const CanvasDropZoneStyled = styled.div`
  min-height: 400px;
  background: #222;
  border-radius: 12px;
  box-shadow: 0 2px 12px #0002;
  margin: 2rem 0;
  padding: 2rem;
  position: relative;
`;

// CanvasDropZone functional component
interface DropItem {
  type: string;
  name: string;
  color: string;
}

interface CanvasDropZoneProps {
  droppedComponents: DroppedComponent[];
  onDrop: (item: DropItem, offset: { x: number; y: number }) => void;
}

const CanvasDropZone: React.FC<CanvasDropZoneProps> = ({ droppedComponents, onDrop }) => {
  // Example: handle native HTML5 drop event and call onDrop with dummy data
  const handleDrop: React.DragEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    // You should implement logic to extract item and offset from the event
    // For now, just call onDrop with dummy data
    const item = { type: 'input', name: 'Input', color: '#00ffcc' };
    const offset = { x: e.clientX, y: e.clientY };
    onDrop(item, offset);
  };

  const handleDragOver: React.DragEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
  };

  return (
    <CanvasDropZoneStyled onDrop={handleDrop} onDragOver={handleDragOver}>
      {/* Render dropped components here */}
      {droppedComponents.map(comp => (
        <DroppedComponentBox
          key={comp.id}
          style={{ left: comp.x, top: comp.y, background: comp.color }}
        >
          {comp.name}
        </DroppedComponentBox>
      ))}
    </CanvasDropZoneStyled>
  );
};
const FooterHeader = styled.div`
  padding: 1rem 2rem;
  background: #18181b;
  border-top: 1px solid #222;
  color: #aaa;
  font-size: 1rem;
  text-align: center;
`;
const Header = styled.div`
  background: var(--glass-background);
  backdrop-filter: var(--glass-backdrop-filter);
  border: var(--glass-border);
  border-radius: var(--glass-border-radius);
  padding: var(--spacing-xl);
  margin-bottom: var(--spacing-xl);
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--spacing-md);
`;
const HeaderLeft = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
`;
const HeaderRight = styled.div`
  display: flex;
  gap: var(--spacing-md);
  align-items: center;
  flex-wrap: wrap;
`;
const ProjectName = styled.div`
  color: var(--text-secondary);
  font-size: 1rem;
  font-weight: 500;
`;
/* Duplicate ProjectSelect styled component removed */
const Button = styled.button<{ $variant?: 'primary' | 'secondary' | 'danger' }>`
  padding: var(--spacing-sm) var(--spacing-md);
  background: ${props => {
    switch (props.$variant) {
      case 'primary': return 'var(--primary-gradient)';
      case 'secondary': return 'var(--secondary-gradient)';
      case 'danger': return 'var(--danger-gradient)';
      default: return 'var(--glass-background-dark)';
    }
  }};
  color: ${props => props.$variant === 'primary' || props.$variant === 'danger'
    ? 'white' : 'var(--text-primary)'};
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  box-shadow: ${props => props.$variant === 'primary'
    ? '0 0 8px #00ffcc44' : props.$variant === 'danger'
    ? '0 0 8px #ff6b6b44' : 'none'};
  transition: background 0.2s, box-shadow 0.2s;
  &:hover {
    opacity: 0.85;
  }
`

// ...existing styled components for grid/cards/spinner...

const StudioLayout = styled.div`
  display: flex;
  gap: var(--spacing-xl);
  align-items: flex-start;
  margin: var(--spacing-xl) 0;
`;

import type { ComponentDefinition } from '@oursynth/shared-types';

interface AIComponent extends Partial<ComponentDefinition> {
  displayName?: string;
}

export default function StudioPage() {
  // State and hooks
  // Handler to insert AI-generated component from SuggestionTray
  const handleInsertComponent = (component: AIComponent) => {
    // Insert at default position (e.g., x:100, y:100) and assign a unique id
    const newComponent = {
      id: `${component.type || 'ai'}-${Date.now()}`,
      type: component.type || 'ai',
      name: component.displayName || component.name || 'AI Component',
      x: 100,
      y: 100,
      color: component.color || '#a259ff',
    };
    setDroppedComponents(prev => [...prev, newComponent]);
  };
  const [droppedComponents, setDroppedComponents] = useState<DroppedComponent[]>([]);
  const [currentProjectId, setCurrentProjectId] = useState<string | null>(null);
  const [projectName, setProjectName] = useState('Untitled Project');
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [user, setUser] = useState<unknown>(null);
  const [components, setComponents] = useState(ENHANCED_COMPONENT_TYPES);

  // Projects hooks
  const { projects, loading: projectsLoading, error: projectsError, createProject } = useProjects('all');
  const { project, saveProjectData } = useProject(currentProjectId ? Number(currentProjectId) : null);

  // Project grid quick actions
  const handleEditProject = (projectId: string) => {
    setCurrentProjectId(projectId);
  };
  const handleDuplicateProject = async (project: Project) => {
    if (!user || !project) return;
    try {
      const newProject = await createProject({
        name: `${project.name} (Copy)`,
        description: project.description,
        project_data: project.project_data
      });
      if (newProject) {
        setCurrentProjectId(newProject.id ? String(newProject.id) : null);
      }
    } catch (error) {
      alert('Failed to duplicate project.');
    }
  };
  const handleDeleteProject = async (projectId: string) => {
    // Implement delete logic here (e.g., Supabase call)
    alert('Delete functionality not implemented yet.');
  };

  // Handle component favorites
  const handleToggleFavorite = useCallback((componentId: string) => {
    setComponents(prev => prev.map(comp =>
      comp.id === componentId
        ? { ...comp, isFavorite: !comp.isFavorite }
        : comp
    ));
  }, []);

  // Get current user
  useEffect(() => {
    const getUser = async () => {
      if (isSupabaseConfigured) {
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);
      }
    };
    getUser();

    if (isSupabaseConfigured) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        (event, session) => {
          setUser(session?.user ?? null);
        }
      );
      return () => subscription.unsubscribe();
    }
  }, []);

  // Load project data when project changes
  useEffect(() => {
    if (project) {
      setProjectName(project.name);
      if (project.project_data?.canvas) {
        setDroppedComponents(project.project_data.canvas);
      }
    }
  }, [project]);

  // Auto-save functionality
  useEffect(() => {
    if (!currentProjectId || !user) return;

    const saveTimeout = setTimeout(async () => {
      if (droppedComponents.length > 0) {
        setIsAutoSaving(true);
        try {
          await saveProjectData({
            canvas: droppedComponents,
            lastModified: new Date().toISOString(),
            version: '1.0'
          });
          setLastSaved(new Date());
        } catch (error) {
          console.error('Auto-save failed:', error);
        } finally {
          setIsAutoSaving(false);
        }
      }
    }, 2000); // Auto-save after 2 seconds of inactivity

    return () => clearTimeout(saveTimeout);
  }, [droppedComponents, currentProjectId, user, saveProjectData]);

  const handleDrop = useCallback((item: DropItem, offset: { x: number; y: number }) => {
    const newComponent: DroppedComponent = {
      id: `${item.type}-${Date.now()}`,
      type: item.type,
      name: item.name,
      x: offset.x - 60,
      y: offset.y - 20,
      color: item.color
    };
    setDroppedComponents(prev => [...prev, newComponent]);
  }, []);

  const handleNewProject = async () => {
    if (!user) {
      alert('Please sign in to create projects');
      return;
    }
    try {
      const newProject = await createProject({
        name: 'New Project',
        description: 'Created in Studio',
        project_data: {
          canvas: [],
          version: '1.0',
          createdAt: new Date().toISOString()
        }
      });
      if (newProject) {
        setCurrentProjectId(newProject.id.toString());
        setProjectName(newProject.name);
        setDroppedComponents([]);
        setLastSaved(new Date());
      }
    } catch (error) {
      console.error('Failed to create project:', error);
      alert('Failed to create project. Please try again.');
    }
  };

  // ...existing code for grid/cards/spinner...

  return (
    <DndProvider backend={HTML5Backend}>
      <StudioContainer className="container">
        <Header>
          <HeaderLeft>
            <Title>Studio</Title>
            {currentProjectId && (
              <ProjectName>
                {projectName} {isAutoSaving && '(Saving...)'}
              </ProjectName>
            )}
          </HeaderLeft>
          <HeaderRight>
            <Button 
              $variant="primary" 
              onClick={handleNewProject}
              disabled={!user}
            >
              + New Project
            </Button>
          </HeaderRight>
        </Header>

        {/* Project Grid Section */}
        {projectsLoading ? (
          <div>Loading...</div>
        ) : projectsError ? (
          <ErrorBox>
            Error loading projects. Please try again.
          </ErrorBox>
        ) : (
          <div>
            {projects && projects.length > 0 ? (
              projects.map((project: Project) => (
                <div key={project.id}>
                  <span>{project.name}</span>
                  <Button $variant="primary" onClick={() => handleEditProject(String(project.id))}>Edit</Button>
                  <Button $variant="secondary" onClick={() => handleDuplicateProject(project)}>Duplicate</Button>
                  <Button $variant="danger" onClick={() => handleDeleteProject(String(project.id))}>Delete</Button>
                </div>
              ))
            ) : (
              <EmptyProjectsBox>
                No projects found. Create a new project to get started!
              </EmptyProjectsBox>
            )}
          </div>
        )}

        <StudioLayout>
          <ComponentPalette 
            components={components}
            onToggleFavorite={handleToggleFavorite}
          />
          <CanvasColumn>
            <CanvasHeader>
              <CanvasTitle>
                Canvas
                {currentProjectId && (
                  <ComponentCount>
                    {droppedComponents.length} components
                  </ComponentCount>
                )}
              </CanvasTitle>
            </CanvasHeader>
            <CanvasDropZone 
              droppedComponents={droppedComponents}
              onDrop={handleDrop}
            />
          </CanvasColumn>
          {/* SuggestionTray for AI-generated components */}
          <SuggestionTray onInsertComponent={handleInsertComponent} />
        </StudioLayout>
        
        <FooterHeader>
          <Logo variant="studio" />
        </FooterHeader>
      </StudioContainer>
    </DndProvider>
  );
}

/* Duplicate ProjectName styled component removed */

const ProjectSelect = styled.select`
  padding: var(--spacing-sm) var(--spacing-md);
  background: var(--glass-background-dark);
  border: var(--glass-border);
  border-radius: var(--glass-border-radius);
  color: var(--text-primary);
  font-size: 0.9rem;
  cursor: pointer;
  min-width: 200px;
  
  &:focus {
    outline: none;
    border-color: var(--accent-color);
  }
`

// (Removed duplicate Button styled component declaration)
// Creates a new project in Supabase and returns the created project object
async function createProject({
  name,
  description,
  project_data,
}: {
  name: string;
  description: string;
  project_data: { canvas: never[]; version: string; createdAt: string };
}) {
  const { data, error } = await supabase
    .from('projects')
    .insert([
      {
        name,
        description,
        project_data,
        created_at: project_data.createdAt,
      },
    ])
    .select()
    .single();

  if (error) {
    throw error;
  }
  return data;
}


