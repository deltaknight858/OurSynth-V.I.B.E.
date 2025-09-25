import styled from 'styled-components'

// Glass morphism container
export const GlassContainer = styled.div`
  background: ${({ theme }) => theme.colors.background.glass.background};
  backdrop-filter: ${({ theme }) => theme.colors.background.glass.backdropFilter};
  border: ${({ theme }) => theme.colors.background.glass.border};
  border-radius: ${({ theme }) => theme.colors.background.glass.borderRadius};
  box-shadow: ${({ theme }) => theme.colors.background.glass.boxShadow};
  padding: ${({ theme }) => theme.spacing.lg};
`

// Gradient text component
export const GradientText = styled.h1`
  background: ${({ theme }) => theme.colors.primaryGradient};
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: bold;
  font-size: 2.5rem;
  line-height: 1.2;
`

// Accent button
export const AccentButton = styled.button`
  background: ${({ theme }) => theme.colors.accent};
  color: ${({ theme }) => theme.colors.background.primary};
  border: none;
  border-radius: 8px;
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: ${({ theme }) => theme.shadows.glow};

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.strong}, ${({ theme }) => theme.shadows.glow};
  }

  &:active {
    transform: translateY(0);
  }
`

// Glass card component
export const GlassCard = styled.div`
  ${({ theme }) => `
    background: ${theme.colors.background.glass.background};
    backdrop-filter: ${theme.colors.background.glass.backdropFilter};
    border: ${theme.colors.background.glass.border};
    border-radius: ${theme.colors.background.glass.borderRadius};
    box-shadow: ${theme.colors.background.glass.boxShadow};
    padding: ${theme.spacing.xl};
    margin: ${theme.spacing.md};
    transition: all 0.3s ease;
  `}

  &:hover {
    transform: translateY(-4px);
    box-shadow: ${({ theme }) => theme.shadows.strong};
  }
`

// Responsive container
export const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.spacing.md};

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: 0 ${({ theme }) => theme.spacing.lg};
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.desktop}) {
    padding: 0 ${({ theme }) => theme.spacing.xl};
  }
`
