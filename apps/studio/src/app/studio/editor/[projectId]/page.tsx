// Studio Editor Page Scaffold
// Full-featured visual editor with responsive flex layout (no media queries)

'use client';

import { useParams } from 'next/navigation';
import { useState } from 'react';
import dynamic from 'next/dynamic';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { ProjectProvider } from '@/contexts/ProjectProvider';
import CanvasContainer from '@/components/CanvasContainer';
import SaveIndicator from '@/components/SaveIndicator';
import styled from 'styled-components';
import type { Node } from '@/types/projects';
import EditorLayout from '@/components/EditorLayout';
import ResizablePanel from '@/components/ResizablePanel';
import SiteStructurePanel from '@/components/SiteStructurePanel';
import InspectorPanel from '@/components/InspectorPanel';

const CodeView = dynamic(() => import('@/components/CodeView'), {
  ssr: false,
  loading: () => <div style={{ color: 'white', padding: '2rem', textAlign: 'center' }}>Loading Code Editor...</div>,
});

const EditorToolbar = styled.header`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding: 0.75rem 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 60px;
  z-index: 100;
`;

const ProjectInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  
  h1 {
    font-size: 1.125rem;
    font-weight: 600;
    color: #ffffff;
    margin: 0;
  }
  
  p {
    font-size: 0.875rem;
    color: rgba(255, 255, 255, 0.7);
    margin: 0;
  }
`;

const ViewModeToggle = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 0.5rem;
  padding: 0.25rem;
`;

const ModeButton = styled.button<{ $active: boolean }>`
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  border-radius: 0.375rem;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  
  ${props => props.$active ? `
    background: rgba(255, 255, 255, 0.1);
    color: #ffffff;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  ` : `
    background: transparent;
    color: rgba(255, 255, 255, 0.7);
    
    &:hover {
      color: #ffffff;
      background: rgba(255, 255, 255, 0.05);
    }
  `}
`;

const ActionButtons = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const ActionButton = styled.button<{ $variant?: 'primary' | 'secondary' }>`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  border-radius: 0.375rem;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  
  ${props => props.$variant === 'primary' ? `
    background: linear-gradient(135deg, #10b981, #059669);
    color: #ffffff;
    
    &:hover {
      background: linear-gradient(135deg, #059669, #047857);
      box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
    }
  ` : `
    background: rgba(255, 255, 255, 0.1);
    color: #ffffff;
    
    &:hover {
      background: rgba(255, 255, 255, 0.2);
      box-shadow: 0 4px 12px rgba(255, 255, 255, 0.1);
    }
  `}
`;

const LayoutContainer = styled.div`
  height: calc(100vh - 60px); /* subtract toolbar height */
  overflow: hidden;
`;

export default function StudioEditorPage() {
  const { projectId } = useParams();
  const [viewMode, setViewMode] = useState<'design' | 'code'>('design');
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [selectedSection, setSelectedSection] = useState<number>(1); // Default to Body
  const [bodyLayout, setBodyLayout] = useState<string | null>(null);

  if (isNaN(Number(projectId))) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1a1a2e, #16213e, #0f3460)',
        color: '#ffffff'
      }}>
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#ef4444', marginBottom: '0.5rem' }}>
            Invalid Project
          </h1>
          <p style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
            The project ID is not valid.
          </p>
        </div>
      </div>
    );
  }

  return (
    <ProjectProvider projectId={Number(projectId)}>
      <DndProvider backend={HTML5Backend}>
        <EditorToolbar>
          <ProjectInfo>
            <div>
              <h1>Studio Editor</h1>
              <p>Visual component builder • Development Mode (Offline)</p>
            </div>
          </ProjectInfo>

          <ViewModeToggle>
            <ModeButton
              $active={viewMode === 'design'}
              onClick={() => setViewMode('design')}
            >
              Design
            </ModeButton>
            <ModeButton
              $active={viewMode === 'code'}
              onClick={() => setViewMode('code')}
            >
              Code
            </ModeButton>
          </ViewModeToggle>

          <ActionButtons>
            <SaveIndicator />
            <ActionButton>
              <EyeIcon />
              Preview
            </ActionButton>
            <ActionButton $variant="primary">
              <DownloadIcon />
              Export
            </ActionButton>
          </ActionButtons>
        </EditorToolbar>
        <LayoutContainer>
          {viewMode === 'design' ? (
            <EditorLayout>
              <ResizablePanel side="left" defaultSize={280} minSize={48}>
                <SiteStructurePanel />
              </ResizablePanel>
              <CanvasContainer
                selectedSection={selectedSection}
                setSelectedSection={setSelectedSection}
                bodyLayout={bodyLayout}
                setBodyLayout={setBodyLayout}
              />
              <ResizablePanel side="right" defaultSize={300} minSize={48}>
                <InspectorPanel selectedSection={selectedSection} bodyLayout={bodyLayout} />
              </ResizablePanel>
            </EditorLayout>
          ) : (
            <CodeView />
          )}
        </LayoutContainer>
      </DndProvider>
    </ProjectProvider>
  );
}

// ========================================
// ICONS
// ========================================

function EyeIcon() {
  return (
    <svg style={{ width: '1rem', height: '1rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg style={{ width: '1rem', height: '1rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  );
}
