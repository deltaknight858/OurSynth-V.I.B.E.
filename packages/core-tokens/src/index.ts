import tokens from './tokens.json';

export const colors = tokens.colors;
export const spacing = tokens.spacing;
export const typography = tokens.typography;
export const borderRadius = tokens.borderRadius;
export const shadows = tokens.shadows;
export const animation = tokens.animation;

export default tokens;

// Type definitions
export interface VibeTokens {
  colors: typeof tokens.colors;
  spacing: typeof tokens.spacing;
  typography: typeof tokens.typography;
  borderRadius: typeof tokens.borderRadius;
  shadows: typeof tokens.shadows;
  animation: typeof tokens.animation;
}