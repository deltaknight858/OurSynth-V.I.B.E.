"use client";

import { ReactNode } from 'react';
import ResponsiveNav from '@/components/ResponsiveNav';
// import CommandCenter from '@packages/ui/src/components/CommandCenter';
import GlobalBottomNavBar from '@packages/ui/src/components/GlobalBottomNavBar';
import StyledComponentsRegistry from '@/lib/styled-components-registry';
import { OurSynthAIProvider } from '../../../../packages/ui/src/OurSynthAIContext';

interface ClientLayoutProps {
  children: ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  return (
    <StyledComponentsRegistry>
      <OurSynthAIProvider>
        <div 
          className="app-container" 
          style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <ResponsiveNav />
          <main 
            style={{
              flex: 1,
              padding: 'var(--spacing-md)',
            }}
          >
            {children}
          </main>
          {/* <CommandCenter appContext="studio" /> */}
          <GlobalBottomNavBar />
        </div>
      </OurSynthAIProvider>
    </StyledComponentsRegistry>
  );
}
