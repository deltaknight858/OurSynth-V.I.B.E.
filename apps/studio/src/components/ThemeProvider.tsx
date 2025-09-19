'use client'

import React from 'react'
import { ThemeProvider as StyledThemeProvider } from 'styled-components'
import { theme } from '@/styles/theme'

interface ThemeProviderProps {
  children: React.ReactNode
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  return (
    <StyledThemeProvider theme={theme}>
      {children}
    </StyledThemeProvider>
  )
}

// Hook to use theme in components
export { useTheme } from 'styled-components'

// Export theme for direct access
export { theme } from '@/styles/theme'
