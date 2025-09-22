// Quick test to verify service imports work
import { noteService } from './noteService';
import { notebookService } from './notebookService';
import { mindMapService } from './mindMapService';
import { serviceRegistry } from './serviceRegistry';

console.log('Services loaded successfully:', {
  noteService: !!noteService,
  notebookService: !!notebookService,
  mindMapService: !!mindMapService,
  serviceRegistry: !!serviceRegistry
});

export { serviceRegistry as default };