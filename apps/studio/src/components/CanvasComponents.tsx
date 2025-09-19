import styled from 'styled-components';

export const CanvasContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  overflow: auto;
  background: #1a1a1a;
  background-image: 
    linear-gradient(to right, rgba(255,255,255,.05) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(255,255,255,.05) 1px, transparent 1px);
  background-size: 8px 8px;
`;

export const AlignmentGuide = styled.div<{ $orientation: 'vertical' | 'horizontal'; $position: number }>`
  position: absolute;
  background-color: #6366f1;
  pointer-events: none;
  z-index: 9999;

  ${props => props.$orientation === 'vertical' ? `
    width: 1px;
    height: 100%;
    left: ${props.$position}px;
    top: 0;
  ` : `
    width: 100%;
    height: 1px;
    top: ${props.$position}px;
    left: 0;
  `}
`;

export const ResizeHandle = styled.div<{ $position: string }>`
  position: absolute;
  width: 8px;
  height: 8px;
  background-color: #6366f1;
  border: 1px solid #ffffff;
  border-radius: 50%;
  z-index: 1000;
  cursor: ${props => {
    switch (props.$position) {
      case 'nw': return 'nw-resize';
      case 'n': return 'n-resize';
      case 'ne': return 'ne-resize';
      case 'e': return 'e-resize';
      case 'se': return 'se-resize';
      case 's': return 's-resize';
      case 'sw': return 'sw-resize';
      case 'w': return 'w-resize';
      default: return 'move';
    }
  }};

  ${props => {
    switch (props.$position) {
      case 'nw': return 'top: -4px; left: -4px;';
      case 'n': return 'top: -4px; left: 50%; transform: translateX(-50%);';
      case 'ne': return 'top: -4px; right: -4px;';
      case 'e': return 'top: 50%; right: -4px; transform: translateY(-50%);';
      case 'se': return 'bottom: -4px; right: -4px;';
      case 's': return 'bottom: -4px; left: 50%; transform: translateX(-50%);';
      case 'sw': return 'bottom: -4px; left: -4px;';
      case 'w': return 'top: 50%; left: -4px; transform: translateY(-50%);';
      default: return '';
    }
  }}
`;

export const ComponentWrapper = styled.div<{ 
  $isSelected: boolean;
  $isDragging: boolean;
}>`
  position: absolute;
  user-select: none;
  transition: box-shadow 0.2s ease;
  
  ${props => props.$isSelected && `
    outline: 2px solid #6366f1;
    box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.3);
  `}

  ${props => props.$isDragging && `
    opacity: 0.7;
    cursor: move;
  `}
`;
