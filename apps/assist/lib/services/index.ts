// Main exports for OurSynth-Eco noteflow services
// Provides centralized access to all services and types

// Core types
export * from '../types/core';

// Individual services
export { noteService } from './noteService';
export { notebookService } from './notebookService';
export { mindMapService } from './mindMapService';
export { exportService } from './exportService';
export { collaborationService } from './collaborationService';
export { userService } from './userService';
export { authService } from './authService';
export { voiceCommandService } from './voiceCommandService';
export { wizardContextRegistry } from './wizardContextRegistry';

// Service registry (recommended way to access services)
export { serviceRegistry } from './serviceRegistry';

// Convenience re-exports
export default serviceRegistry;