import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const CanvasWrapper = styled.main`
  flex: 1 1 auto;
  min-width: 0;
  overflow: auto;
  background:
    repeating-linear-gradient(45deg, rgba(255,255,255,0.02), rgba(255,255,255,0.02) 20px, transparent 20px, transparent 40px),
    linear-gradient(135deg, #0f1419, #1a202c);
// ...full code as provided in previous response...
'use client';
  backdrop-filter: blur(8px);
  &::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 0;
    background-image:
      linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
    background-size: 24px 24px;
    pointer-events: none;
    z-index: 0;
  }
  > * { position: relative; z-index: 1; }
`;

const Section = styled.div<{ selected?: boolean }>`
  margin: 32px auto;
  max-width: 720px;
  background: rgba(0,212,255,0.08);
  border-radius: 16px;
  box-shadow: 0 2px 24px rgba(0,212,255,0.08);
  border: 2px solid ${({ selected }) => selected ? '#22c55e' : 'rgba(0,212,255,0.18)'};
  padding: 32px 24px;
  cursor: pointer;
  transition: border 0.2s;
  position: relative;
`;
const SectionLabel = styled.div`
  position: absolute;
  top: -18px; left: 24px;
  background: #0f1419;
  color: #22c55e;
  font-weight: 700;
  font-size: 1rem;
  padding: 2px 12px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(34,197,94,0.12);
`;
const AddSectionButton = styled.button`
  display: block;
  margin: 24px auto 0 auto;
  background: linear-gradient(90deg,#00d4ff,#22c55e);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 10px 24px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 2px 12px rgba(0,212,255,0.12);
  transition: background 0.2s;
  &:hover { background: linear-gradient(90deg,#22c55e,#00d4ff); }
`;
const DragHandle = styled.span`
  position: absolute;
  left: 8px; top: 8px;
  font-size: 1.2rem;
  color: #00d4ff;
  cursor: grab;
  user-select: none;
  z-index: 2;
`;
const ModalOverlay = styled.div`
  position: fixed; top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.45);
  z-index: 1000;
  display: flex; align-items: center; justify-content: center;
`;
const Modal = styled.div`
  background: #181f2a;
  border-radius: 16px;
  box-shadow: 0 4px 32px #00d4ff44;
  padding: 32px 40px;
  min-width: 340px;
  color: var(--text-primary);
`;
const LayoutOption = styled.button`
  display: flex; align-items: center; gap: 16px;
  background: rgba(0,212,255,0.08);
  border: 2px solid #00d4ff;
  border-radius: 12px;
  color: #00d4ff;
  font-size: 1.1rem;
  font-weight: 500;
  margin-bottom: 18px;
  padding: 16px 24px;
  cursor: pointer;
  transition: background 0.2s, border 0.2s;
  &:hover { background: rgba(34,197,94,0.12); border-color: #22c55e; color: #22c55e; }
`;
const Tooltip = styled.div`
  position: absolute;
  top: -32px; left: 50%;
  transform: translateX(-50%);
  background: #222c;
  color: #b3e5fc;
  padding: 6px 14px;
  border-radius: 8px;
  font-size: 0.95rem;
  pointer-events: none;
  white-space: nowrap;
  z-index: 10;
`;
const ContextMenu = styled.div`
  position: absolute;
  top: 32px; right: 24px;
  background: #222c;
  color: #b3e5fc;
  border-radius: 8px;
  box-shadow: 0 2px 12px #00d4ff44;
  padding: 8px 0;
  min-width: 140px;
  z-index: 20;
  font-size: 0.98rem;
`;
const ContextMenuItem = styled.button`
  width: 100%;
  background: none;
  border: none;
  color: inherit;
  padding: 8px 18px;
  text-align: left;
  cursor: pointer;
  font-size: inherit;
  &:hover { background: #00d4ff22; color: #22c55e; }
`;
const SectionContent = styled.div`
  margin-top: 18px;
  min-height: 48px;
  background: rgba(0,212,255,0.04);
  border-radius: 8px;
  padding: 12px;
`;

const BODY_LAYOUTS = [
  { key: 'hero', label: 'Hero Section', preview: '🦸 Large headline, call-to-action, image', help: 'A bold intro section for your site.' },
  { key: 'gallery', label: 'Gallery', preview: '🖼️ Grid of images or cards', help: 'Showcase images or products in a grid.' },
  { key: 'form', label: 'Form', preview: '📝 Input fields, submit button', help: 'Collect user info with a form.' },
  { key: 'list', label: 'List', preview: '📋 List of items or features', help: 'Display items or features in a list.' },
];

interface DraggableSectionProps {
  id: string;
  index: number;
  moveSection: (dragIndex: number, hoverIndex: number) => void;
  selected: boolean;
  label: string;
  children: React.ReactNode;
  onClick: () => void;
  tooltip: string;
  onContextMenu?: (e: React.MouseEvent) => void;
  onDropComponent?: (item: any, index: number) => void;
  isOver: boolean;
}

function DraggableSection({ id, index, moveSection, selected, label, children, onClick, tooltip, onContextMenu, onDropComponent, isOver }: DraggableSectionProps) {
  const [{ isDragging }, drag] = useDrag({
    type: 'section',
    item: { index },
    collect: monitor => ({ isDragging: monitor.isDragging() })
  });
  const [, drop] = useDrop({
    accept: 'component',
    drop: (item) => onDropComponent && onDropComponent(item, index),
    collect: monitor => ({ isOver: monitor.isOver() })
  });
  
  const dragDropRef = (el: HTMLDivElement | null) => {
    drag(el);
    drop(el);
  };
  
  return (
    <div ref={dragDropRef} style={{ opacity: isDragging ? 0.5 : 1, position: 'relative', boxShadow: isOver ? '0 0 0 4px #22c55e' : undefined }}>
      <DragHandle title="Drag to reorder">☰</DragHandle>
      <Section selected={selected} onClick={onClick} title={tooltip} onContextMenu={onContextMenu}>
        <SectionLabel>{label}</SectionLabel>
        <SectionContent>{children}</SectionContent>
        {tooltip && <Tooltip>{tooltip}</Tooltip>}
      </Section>
    </div>
  );
}

interface CanvasContainerProps {
  selectedSection: any;
  setSelectedSection: (section: any) => void;
  setBodyLayout: (layout: any) => void;
  bodyLayout: any;
}

export default function CanvasContainer({ selectedSection, setSelectedSection, setBodyLayout, bodyLayout }: CanvasContainerProps) {
  const [sections, setSections] = useState([
    { id: 'header', label: 'Header', type: 'header' },
    { id: 'body', label: 'Body', type: 'body', layout: bodyLayout || null },
    { id: 'footer', label: 'Footer', type: 'footer' },
  ]);
  const [showLayoutModal, setShowLayoutModal] = useState(false);
  const [hoveredLayout, setHoveredLayout] = useState<string | null>(null);
  const [contextMenuIdx, setContextMenuIdx] = useState<number | null>(null);
  const [renameValue, setRenameValue] = useState('');
  const [sectionContents, setSectionContents] = useState<Record<string, any[]>>({});
  const contextMenuRef = useRef<HTMLDivElement>(null);

  // Reorder sections
  const moveSection = (from: number, to: number) => {
    const updated = [...sections];
    const [moved] = updated.splice(from, 1);
    updated.splice(to, 0, moved);
    setSections(updated);
  };

  // Add new section
  const addSection = () => {
    const newId = `body${sections.filter(s => s.type === 'body').length + 1}`;
    setSections([...sections.slice(0, -1), { id: newId, label: 'Body', type: 'body', layout: null }, sections[sections.length - 1]]);
  };

  // Select section
  const handleSelect = (idx: number) => {
    setSelectedSection(idx);
    if (sections[idx].type === 'body' && !sections[idx].layout) setShowLayoutModal(true);
  };

  // Set layout for selected body section
  const handleLayoutChoose = (layoutKey: string) => {
    const idx = selectedSection;
    const updated = [...sections];
    updated[idx].layout = layoutKey;
    setSections(updated);
    setBodyLayout(layoutKey);
    setShowLayoutModal(false);
  };

  // Section actions
  const handleContextMenu = (idx: number, e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenuIdx(idx);
    setRenameValue(sections[idx].label);
  };
  const handleRename = () => {
    if (contextMenuIdx !== null) {
      const updated = [...sections];
      updated[contextMenuIdx].label = renameValue;
      setSections(updated);
      setContextMenuIdx(null);
    }
  };
  const handleDuplicate = () => {
    if (contextMenuIdx !== null) {
      const section = sections[contextMenuIdx];
      const newSection = { ...section, id: section.id + '_copy', label: section.label + ' Copy' };
      setSections([...sections.slice(0, contextMenuIdx + 1), newSection, ...sections.slice(contextMenuIdx + 1)]);
      setContextMenuIdx(null);
    }
  };
  const handleDelete = () => {
    setSections(sections.filter((_, idx) => idx !== contextMenuIdx));
    setContextMenuIdx(null);
  };

  // Handle drop from palette
  const handleDropComponent = (item: any, idx: number) => {
    const sectionId = sections[idx].id;
    setSectionContents(prev => ({
      ...prev,
      [sectionId]: [...(prev[sectionId] || []), item]
    }));
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <CanvasWrapper>
        {sections.map((section, idx) => (
          <DraggableSection
            key={section.id}
            id={section.id}
            index={idx}
            moveSection={moveSection}
            selected={selectedSection === idx}
            label={section.label}
            onClick={() => handleSelect(idx)}
            tooltip={section.type === 'body' && section.layout ? BODY_LAYOUTS.find(l => l.key === section.layout)?.help || '' : ''}
            onContextMenu={e => handleContextMenu(idx, e)}
            onDropComponent={handleDropComponent}
            isOver={false} // will be set by useDrop
          >
            {/* Render dropped components for this section */}
            {(sectionContents[section.id] || []).map((comp, i) => (
              <div key={i} style={{ margin: '8px 0', color: '#22c55e', fontWeight: 500 }}>
                {comp.displayName || comp.type}
              </div>
            ))}
            {section.type === 'header' && <div style={{ color: '#00d4ff', fontWeight: 600, fontSize: '1.1rem' }}>Your site header (logo, navigation)</div>}
            {section.type === 'body' && section.layout ? (
              <div style={{ color: '#22c55e', fontWeight: 600, fontSize: '1.1rem' }}>
                {BODY_LAYOUTS.find(l => l.key === section.layout)?.label}
                <div style={{ marginTop: 8, color: '#b3e5fc', fontSize: '0.95rem' }}>
                  {BODY_LAYOUTS.find(l => l.key === section.layout)?.preview}
                </div>
              </div>
            ) : section.type === 'body' ? (
              <div style={{ color: '#b3e5fc', fontWeight: 500, fontSize: '1.05rem' }}>
                Click to choose a body layout
              </div>
            ) : null}
            {section.type === 'footer' && <div style={{ color: '#00d4ff', fontWeight: 600, fontSize: '1.1rem' }}>Your site footer (copyright, links)</div>}
          </DraggableSection>
        ))}
        <AddSectionButton onClick={addSection} title="Add another body section">+ Add Section</AddSectionButton>
        {showLayoutModal && (
          <ModalOverlay>
            <Modal>
              <h2 style={{ color: '#00d4ff', marginBottom: 24 }}>Choose a Body Layout <span title="What is a layout?" style={{marginLeft:8,cursor:'help'}}>?</span></h2>
              {BODY_LAYOUTS.map(layout => (
                <LayoutOption
                  key={layout.key}
                  onClick={() => handleLayoutChoose(layout.key)}
                  onMouseEnter={() => setHoveredLayout(layout.key)}
                  onMouseLeave={() => setHoveredLayout(null)}
                  title={layout.help}
                >
                  <span>{layout.label}</span>
                  <span style={{ fontSize: '1.2rem', color: '#b3e5fc' }}>{layout.preview}</span>
                  {hoveredLayout === layout.key && <Tooltip>{layout.help}</Tooltip>}
                </LayoutOption>
              ))}
              <AddSectionButton onClick={() => setShowLayoutModal(false)}>Cancel</AddSectionButton>
            </Modal>
          </ModalOverlay>
        )}
        {contextMenuIdx !== null && (
          <ContextMenu ref={contextMenuRef}>
            <ContextMenuItem as="input" value={renameValue} onChange={e => setRenameValue(e.target.value)} style={{marginBottom:8}} />
            <ContextMenuItem onClick={handleRename}>Rename</ContextMenuItem>
            <ContextMenuItem onClick={handleDuplicate}>Duplicate</ContextMenuItem>
            <ContextMenuItem onClick={handleDelete}>Delete</ContextMenuItem>
            <ContextMenuItem onClick={() => setContextMenuIdx(null)}>Cancel</ContextMenuItem>
          </ContextMenu>
        )}
      </CanvasWrapper>
    </DndProvider>
  );
}
