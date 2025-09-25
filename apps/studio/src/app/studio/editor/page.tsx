// Studio Editor Page with Development Mode Project Context
'use client';

import { useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import ProjectProvider from '@/contexts/ProjectProvider';
import CanvasContainer from '@/components/CanvasContainer';
import EditorLayout from '@/components/EditorLayout';
import ResizablePanel from '@/components/ResizablePanel';
import SiteStructurePanel from '@/components/SiteStructurePanel';
import InspectorPanel from '@/components/InspectorPanel';

// Ensure CSS is loaded
import '../../../styles/theme.css';

export default function StudioEditor() {
  const [selectedSection, setSelectedSection] = useState<number>(1);
  const [bodyLayout, setBodyLayout] = useState<string | null>(null);
  
  // Development mode project ID
  const projectId = 1;

  return (
    <ProjectProvider projectId={projectId}>
      <DndProvider backend={HTML5Backend}>
        <EditorLayout>
          <ResizablePanel side="left" defaultSize={280} minSize={48} collapsedIcon={<span>📁</span>}>
            <SiteStructurePanel />
          </ResizablePanel>
          <CanvasContainer
            selectedSection={selectedSection}
            setSelectedSection={setSelectedSection}
            bodyLayout={bodyLayout}
            setBodyLayout={setBodyLayout}
          />
          <ResizablePanel side="right" defaultSize={300} minSize={48} collapsedIcon={<span>⚙️</span>}>
            <InspectorPanel
              selectedSection={selectedSection}
              bodyLayout={bodyLayout}
            />
          </ResizablePanel>
        </EditorLayout>
      </DndProvider>
    </ProjectProvider>
  );
}