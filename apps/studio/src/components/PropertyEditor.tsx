import React from 'react';
import styled from 'styled-components';

const EditorWrapper = styled.aside`
  flex: 0 0 280px;
  min-width: 240px;
  max-width: 320px;
  overflow-y: auto;
  background: rgba(255,255,255,0.05);
  backdrop-filter: blur(12px);
  border-left: 1px solid rgba(255,255,255,0.1);
  padding: 1rem;
  
  /* Custom scrollbar */
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(255,255,255,0.05);
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(255,255,255,0.2);
    border-radius: 3px;
    
    &:hover {
      background: rgba(255,255,255,0.3);
    }
  }
`;

const EditorTitle = styled.h2`
  color: #ffffff;
  font-size: 1.2rem;
  font-weight: 600;
  margin: 0 0 1rem 0;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid rgba(255,255,255,0.1);
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 200px;
  text-align: center;
  color: rgba(255,255,255,0.6);
  font-size: 0.9rem;
  
  .icon {
    font-size: 2rem;
    margin-bottom: 0.5rem;
    opacity: 0.5;
  }
`;

export const PropertyEditor: React.FC<{ 
  children?: React.ReactNode;
  title?: string;
}> = ({ children, title = "Properties" }) => (
  <EditorWrapper>
    <EditorTitle>{title}</EditorTitle>
    {children || (
      <EmptyState>
        <div className="icon">🎛️</div>
        <div>Select a component to edit its properties</div>
      </EmptyState>
    )}
  </EditorWrapper>
);

export default PropertyEditor;
