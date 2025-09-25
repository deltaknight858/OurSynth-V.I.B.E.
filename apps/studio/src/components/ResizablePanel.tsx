'use client';

import React, { useState, ReactNode } from 'react';
import { ResizableBox } from 'react-resizable';
import styled, { css } from 'styled-components';

interface ResizablePanelProps {
  side: 'left' | 'right';
  defaultSize: number;
  minSize: number;
  collapsed?: boolean;
  collapsedIcon?: ReactNode;
  children: ReactNode;
}

const PanelContainer = styled.div<{ collapsed: boolean; side: 'left' | 'right'; width: number }>`
  display: flex;
  flex-direction: column;
  height: 100%;
  background: var(--glass-bg);
  ${({ side }) => side === 'left' ? 'border-right: 2px solid var(--glass-border);' : 'border-left: 2px solid var(--glass-border);'}
  transition: width 0.2s;
  overflow: hidden;
  width: ${({ width }) => width}px;
`;

const CollapseButton = styled.button<{ side: 'left' | 'right' }>`
  position: absolute;
  top: 12px;
  ${({ side }) => side === 'left' ? css`right: 8px;` : css`left: 8px;`}
  background: rgba(0,0,0,0.1);
  border: none;
  border-radius: 6px;
  color: var(--text-muted);
  cursor: pointer;
  z-index: 10;
  padding: 4px 8px;
  font-size: 1.1rem;
  transition: background 0.2s;
  &:hover {
    background: rgba(0,0,0,0.2);
    color: var(--text-primary);
  }
`;

export default function ResizablePanel({ side, defaultSize, minSize, children, collapsedIcon }: ResizablePanelProps) {
  const [size, setSize] = useState(defaultSize);
  const [collapsed, setCollapsed] = useState(false);

  const handleCollapse = () => setCollapsed(true);
  const handleExpand = () => setCollapsed(false);

  return (
    <div style={{ position: 'relative', height: '100%' }}>
      {collapsed ? (
        <PanelContainer collapsed={true} side={side} width={minSize}>
          <CollapseButton side={side} onClick={handleExpand} title="Expand">
            {collapsedIcon || (side === 'left' ? '▶' : '◀')}
          </CollapseButton>
        </PanelContainer>
      ) : (
        <ResizableBox
          width={size}
          height={Infinity}
          axis="x"
          minConstraints={[minSize, 0]}
          maxConstraints={[480, 0]}
          resizeHandles={[side === 'left' ? 'e' : 'w']}
          onResizeStop={(_event: any, { size }: { size: { width: number } }) => setSize(size.width)}
        >
          <PanelContainer collapsed={false} side={side} width={size}>
            <CollapseButton side={side} onClick={handleCollapse} title="Collapse">
              {side === 'left' ? '◀' : '▶'}
            </CollapseButton>
            {children}
          </PanelContainer>
        </ResizableBox>
      )}
    </div>
  );
}
