<<<<<<< HEAD
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
=======
// Public API surface for @oursynth/core-tokens (V.I.B.E. version)
export * from './components/system/HaloButton.js';
export * from './state/agent/agentSessionStore.js';
// re-export minimal halo-ui
export * from './halo-ui-proxy.js';

// Capsule Suite Components
export * from './components/capsules/MeshCapsules.js';
export * from './components/capsules/TimeMachine.js';
export * from './components/store/GenerateWithPathways.js';
export * from './components/wizard/DiffViewer.js';
export * from './components/wizard/PromptForm.js';
export { default as WizardStream} from './components/wizard/WizardStream.js';
>>>>>>> main
