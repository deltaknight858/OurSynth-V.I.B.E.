'use client'

import React from 'react'
import { ThemeProvider } from '@/components/ThemeProvider'
import {
  GlassContainer,
  GradientText,
  AccentButton,
  GlassCard,
  Container
} from '@/components/styled/StyledComponents'

interface ThemedExampleProps {
  children?: React.ReactNode
}

export function ThemedExample({ children }: ThemedExampleProps) {
  return (
    <ThemeProvider>
      <Container>
        <GlassContainer>
          <GradientText>OurSynth</GradientText>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
            Experience the future of music synthesis with glass-morphism design.
          </p>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
            <GlassCard>
              <h3 style={{ color: 'var(--accent-color)', marginBottom: '1rem' }}>
                Synth Engine
              </h3>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                Advanced synthesis capabilities with real-time processing.
              </p>
              <AccentButton>
                Start Synthesizing
              </AccentButton>
            </GlassCard>
            
            <GlassCard>
              <h3 style={{ color: 'var(--accent-color)', marginBottom: '1rem' }}>
                Effects Chain
              </h3>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                Professional-grade effects with glass-morphism controls.
              </p>
              <AccentButton>
                Configure Effects
              </AccentButton>
            </GlassCard>
          </div>
          
          {children}
        </GlassContainer>
      </Container>
    </ThemeProvider>
  )
}
