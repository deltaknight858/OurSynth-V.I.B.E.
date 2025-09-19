import { DefaultTheme } from 'styled-components'

// Define the theme interface
export interface OurSynthTheme {
  colors: {
    primaryGradient: string
    accent: string
    accentSecondary: string
    accentTertiary: string
    background: {
      primary: string
      secondary: string
      glass: {
        background: string
        backgroundLight: string
        backgroundDark: string
        backdropFilter: string
        backdropFilterStrong: string
        border: string
        borderRadius: string
        boxShadow: string
      }
    }
    text: {
      primary: string
      secondary: string
      muted: string
      accent: string
    }
  }
  spacing: {
    xs: string
    sm: string
    md: string
    lg: string
    xl: string
    xxl: string
  }
  breakpoints: {
    mobile: string
    tablet: string
    desktop: string
    large: string
  }
  shadows: {
    soft: string
    medium: string
    strong: string
    glow: string
    glowStrong: string
  }
  transitions: {
    fast: string
    normal: string
    slow: string
  }
  fonts: {
    primary: string
    mono: string
  }
}

// Define the theme object
export const theme: OurSynthTheme = {
  colors: {
    primaryGradient: 'linear-gradient(90deg, #00FFCC, #A020F0, #0080FF)',
    accent: '#00FFCC',
    accentSecondary: '#A020F0',
    accentTertiary: '#0080FF',
    background: {
      primary: 'rgba(15, 15, 30, 0.95)',
      secondary: 'rgba(20, 20, 40, 0.9)',
      glass: {
        background: 'rgba(255, 255, 255, 0.1)',
        backgroundLight: 'rgba(255, 255, 255, 0.15)',
        backgroundDark: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(10px) saturate(180%)',
        backdropFilterStrong: 'blur(20px) saturate(200%)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        borderRadius: '12px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
      },
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#B8BCC8',
      muted: '#6B7280',
      accent: '#00FFCC',
    },
  },
  spacing: {
    xs: '0.25rem',   // 4px
    sm: '0.5rem',    // 8px
    md: '1rem',      // 16px
    lg: '1.5rem',    // 24px
    xl: '2rem',      // 32px
    xxl: '3rem',     // 48px
  },
  breakpoints: {
    mobile: '768px',
    tablet: '1024px',
    desktop: '1280px',
    large: '1920px',
  },
  shadows: {
    soft: '0 2px 8px rgba(0, 0, 0, 0.1)',
    medium: '0 4px 16px rgba(0, 0, 0, 0.15)',
    strong: '0 8px 32px rgba(0, 0, 0, 0.25)',
    glow: '0 0 20px rgba(0, 255, 204, 0.3)',
    glowStrong: '0 0 30px rgba(0, 255, 204, 0.5)',
  },
  transitions: {
    fast: '0.15s ease',
    normal: '0.3s ease',
    slow: '0.5s ease',
  },
  fonts: {
    primary: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif',
    mono: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
  },
}

// CSS custom properties for use in CSS modules or global styles
export const cssVariables = `
  :root {
    /* Colors */
    --primary-gradient: ${theme.colors.primaryGradient};
    --accent-color: ${theme.colors.accent};
    --accent-secondary: ${theme.colors.accentSecondary};
    --accent-tertiary: ${theme.colors.accentTertiary};
    
    /* Backgrounds */
    --background-primary: ${theme.colors.background.primary};
    --background-secondary: ${theme.colors.background.secondary};
    
    /* Glass Effects */
    --glass-background: ${theme.colors.background.glass.background};
    --glass-background-light: ${theme.colors.background.glass.backgroundLight};
    --glass-background-dark: ${theme.colors.background.glass.backgroundDark};
    --glass-backdrop-filter: ${theme.colors.background.glass.backdropFilter};
    --glass-backdrop-filter-strong: ${theme.colors.background.glass.backdropFilterStrong};
    --glass-border: ${theme.colors.background.glass.border};
    --glass-border-radius: ${theme.colors.background.glass.borderRadius};
    --glass-box-shadow: ${theme.colors.background.glass.boxShadow};
    
    /* Typography */
    --text-primary: ${theme.colors.text.primary};
    --text-secondary: ${theme.colors.text.secondary};
    --text-muted: ${theme.colors.text.muted};
    --text-accent: ${theme.colors.text.accent};
    --font-primary: ${theme.fonts.primary};
    --font-mono: ${theme.fonts.mono};
    
    /* Spacing */
    --space-xs: ${theme.spacing.xs};
    --space-sm: ${theme.spacing.sm};
    --space-md: ${theme.spacing.md};
    --space-lg: ${theme.spacing.lg};
    --space-xl: ${theme.spacing.xl};
    --space-xxl: ${theme.spacing.xxl};
    
    /* Shadows */
    --shadow-soft: ${theme.shadows.soft};
    --shadow-medium: ${theme.shadows.medium};
    --shadow-strong: ${theme.shadows.strong};
    --shadow-glow: ${theme.shadows.glow};
    --shadow-glow-strong: ${theme.shadows.glowStrong};
    
    /* Transitions */
    --transition-fast: ${theme.transitions.fast};
    --transition-normal: ${theme.transitions.normal};
    --transition-slow: ${theme.transitions.slow};
    
    /* Breakpoints */
    --breakpoint-mobile: ${theme.breakpoints.mobile};
    --breakpoint-tablet: ${theme.breakpoints.tablet};
    --breakpoint-desktop: ${theme.breakpoints.desktop};
    --breakpoint-large: ${theme.breakpoints.large};
    --text-secondary: ${theme.colors.text.secondary};
    --text-muted: ${theme.colors.text.muted};
    --spacing-xs: ${theme.spacing.xs};
    --spacing-sm: ${theme.spacing.sm};
    --spacing-md: ${theme.spacing.md};
    --spacing-lg: ${theme.spacing.lg};
    --spacing-xl: ${theme.spacing.xl};
    --spacing-xxl: ${theme.spacing.xxl};
    --shadow-soft: ${theme.shadows.soft};
    --shadow-medium: ${theme.shadows.medium};
    --shadow-strong: ${theme.shadows.strong};
    --shadow-glow: ${theme.shadows.glow};
  }
`
