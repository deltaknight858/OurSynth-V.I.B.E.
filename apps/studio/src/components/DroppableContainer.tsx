import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useDrop } from 'react-dnd';
import type { Node } from '@/types/projects';

interface ContainerProps {
  node: Node;
  children?: React.ReactNode;
  onDrop: (item: unknown, x: number, y: number) => void;
}

const StyledContainer = styled.div<{ $isOver: boolean }>`
  position: relative;
  min-height: 50px;
  transition: all 0.2s ease;
  
  ${props => props.$isOver && `
    outline: 2px dashed #6366f1;
    background: rgba(99, 102, 241, 0.1);
  `}
`;

export function DroppableContainer({ node, children, onDrop }: ContainerProps) {
  const [{ isOver }, dropRef] = useDrop(() => ({
    accept: 'COMPONENT',
    drop: (item: unknown, monitor) => {
      const offset = monitor.getClientOffset();
      if (offset) {
        // Convert coordinates to container space
        const containerElement = document.getElementById(`container-${node.id}`);
        if (containerElement) {
          const containerRect = containerElement.getBoundingClientRect();
          const x = offset.x - containerRect.left;
          const y = offset.y - containerRect.top;
          onDrop(item, x, y);
        }
      }
      return undefined;
    },
    collect: (monitor) => ({
      isOver: monitor.isOver()
    })
  }), [node.id, onDrop]);

  return (
    <StyledContainer
      ref={dropRef as React.LegacyRef<HTMLDivElement>}
      id={`container-${node.id}`}
      $isOver={isOver}
      style={{
        ...node.props.style,
        position: 'relative'
      }}
    >
      {children}
    </StyledContainer>
  );
}
