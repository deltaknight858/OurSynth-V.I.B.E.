import React, { ReactNode } from 'react';
import styled from 'styled-components';

const LayoutContainer = styled.div`
  display: flex;
  flex-direction: row;
  height: 100vh;
  width: 100vw;
  background: var(--background-primary);
  background-image: 
    radial-gradient(circle at 20% 80%, rgba(160, 32, 240, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(0, 255, 204, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 40% 40%, rgba(0, 128, 255, 0.05) 0%, transparent 50%);
  overflow: hidden;
  position: fixed;
  top: 0;
  left: 0;
  backdrop-filter: blur(20px);
`;

export default function EditorLayout({ children }: { children: ReactNode }) {
  return <LayoutContainer>{children}</LayoutContainer>;
}
