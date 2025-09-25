import React from 'react';
import styled from 'styled-components';

const PaletteWrapper = styled.aside`
  flex: 0 0 280px;           /* fixed ideal width */
  min-width: 240px;          /* won't shrink past this */
  max-width: 320px;          /* won't grow past this */
  overflow-y: auto;          /* scroll when content overflows */
  background: rgba(255,255,255,0.05);
  backdrop-filter: blur(12px);
  border-right: 1px solid rgba(255,255,255,0.1);
  
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

const Category = styled.div`
  margin: 1rem 0;
`;

const CategoryHeader = styled.h3`
  margin: 0.5rem 1rem;
  font-size: 1rem;
  color: #fff;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ComponentCard = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin: 0.5rem 1rem;
  padding: 0.75rem;
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 8px;
  cursor: grab;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255,255,255,0.1);
    border-color: #a020f0;
    box-shadow: 0 0 12px rgba(160,32,240,0.4);
    transform: translateY(-1px);
  }
  
  &:active {
    cursor: grabbing;
    transform: scale(0.98);
  }
`;

const IconWrapper = styled.div`
  flex-shrink: 0;           /* never collapse */
  width: 1.5rem;            /* scalable unit */
  height: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  
  svg {
    width: 100%;
    height: 100%;
    filter: drop-shadow(0 0 6px #a020f0);
  }
`;

const ComponentName = styled.span`
  color: #ffffff;
  font-size: 0.9rem;
  font-weight: 500;
  flex: 1;
  min-width: 0; /* Allow text to truncate */
  
  /* Truncate long names */
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const ComponentBadge = styled.div`
  flex-shrink: 0;
  background: rgba(160,32,240,0.2);
  color: #a020f0;
  padding: 0.2rem 0.4rem;
  border-radius: 4px;
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
`;

export const ResponsiveComponentPalette: React.FC<{ 
  children: React.ReactNode;
}> = ({ children }) => (
  <PaletteWrapper>
    {children}
  </PaletteWrapper>
);

// Export reusable styled components for the existing ComponentPalette
export { Category, CategoryHeader, ComponentCard, IconWrapper, ComponentName, ComponentBadge };

export default ResponsiveComponentPalette;
