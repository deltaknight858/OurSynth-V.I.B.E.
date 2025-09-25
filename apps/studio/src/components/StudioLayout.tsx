import React from 'react';
import styled from 'styled-components';

const Layout = styled.div`
  display: flex;
  flex-direction: row;
  height: 100vh;          /* full viewport height */
  overflow: hidden;        /* prevent body scroll */
  background: linear-gradient(135deg, #1a1a2e, #16213e, #0f3460);
  
  /* Debug visualization - shows layout boundaries */
  > * {
    position: relative;
    
    &::before {
      content: '';
      position: absolute;
      top: 0;
      right: 0;
      width: 2px;
      height: 100%;
      background: rgba(255, 255, 255, 0.1);
      z-index: 1000;
      pointer-events: none;
    }
    
    &:last-child::before {
      display: none;
    }
  }
`;

export const StudioLayout: React.FC<{ 
  palette: React.ReactNode; 
  canvas: React.ReactNode; 
  editor: React.ReactNode; 
}> = ({ palette, canvas, editor }) => (
  <Layout>
    {palette}
    {canvas}
    {editor}
  </Layout>
);

export default StudioLayout;
