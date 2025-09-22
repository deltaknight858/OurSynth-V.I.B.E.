// Voice Command Service for OurSynth-Eco Noteflow
// Adapted from the original NoteFlow prototype

type CommandAction = 'create' | 'edit' | 'delete' | 'search' | 'export' | 'link' | 'share' | 'save' | 'add_tag';
type CommandTarget = 'note' | 'notebook' | 'tag' | 'attachment';

interface VoiceCommand {
  action: CommandAction;
  target?: CommandTarget;
  params?: Record<string, any>;
}

interface MemoryNote {
  id: string;
  content: string;
  tags?: string[];
  timestamp: Date;
  attachments?: any[];
}

const COMMAND_PATTERNS = {
  createNote: /^create (a )?new note( called| titled)? (.+)$/i,
  addTag: /^add tag (.+)$/i,
  searchNotes: /^search( for)? (.+)$/i,
  saveNote: /^save( this)?( note)?$/i,
  exportNote: /^export( note)?( as)? (pdf|html|markdown)$/i,
  deleteNote: /^delete( this)? note$/i,
  clearNotes: /^clear( all)? notes$/i,
};

export const voiceCommandService = {
  parseCommand(transcript: string): VoiceCommand | null {
    const cleanTranscript = transcript.trim();
    
    if (COMMAND_PATTERNS.createNote.test(cleanTranscript)) {
      const match = cleanTranscript.match(COMMAND_PATTERNS.createNote);
      const title = match?.[3] || 'New Note';
      return {
        action: 'create',
        target: 'note',
        params: { title }
      };
    }

    if (COMMAND_PATTERNS.addTag.test(cleanTranscript)) {
      const match = cleanTranscript.match(COMMAND_PATTERNS.addTag);
      const tag = match?.[1] || '';
      return {
        action: 'add_tag',
        target: 'tag',
        params: { tag }
      };
    }

    if (COMMAND_PATTERNS.searchNotes.test(cleanTranscript)) {
      const match = cleanTranscript.match(COMMAND_PATTERNS.searchNotes);
      const query = match?.[2] || '';
      return {
        action: 'search',
        target: 'note',
        params: { query }
      };
    }

    if (COMMAND_PATTERNS.saveNote.test(cleanTranscript)) {
      return {
        action: 'save',
        target: 'note'
      };
    }

    if (COMMAND_PATTERNS.exportNote.test(cleanTranscript)) {
      const match = cleanTranscript.match(COMMAND_PATTERNS.exportNote);
      const format = match?.[3] || 'html';
      return {
        action: 'export',
        target: 'note',
        params: { format }
      };
    }

    if (COMMAND_PATTERNS.deleteNote.test(cleanTranscript)) {
      return {
        action: 'delete',
        target: 'note'
      };
    }

    if (COMMAND_PATTERNS.clearNotes.test(cleanTranscript)) {
      return {
        action: 'delete',
        target: 'note',
        params: { all: true }
      };
    }

    return null;
  },

  async executeCommand(
    command: VoiceCommand, 
    userId: string, 
    currentNotes: MemoryNote[], 
    setNotes: (notes: MemoryNote[]) => void,
    currentNote?: MemoryNote
  ): Promise<string> {
    try {
      switch (command.action) {
        case 'create':
          if (command.target === 'note' && command.params?.title) {
            const newNote: MemoryNote = {
              id: Date.now().toString(),
              content: `# ${command.params.title}\n\nNew note created via voice command.`,
              tags: ['voice-created'],
              timestamp: new Date(),
              attachments: []
            };
            setNotes([...currentNotes, newNote]);
            return `Created new note: ${command.params.title}`;
          }
          break;

        case 'add_tag':
          if (command.params?.tag && currentNote) {
            const updatedNotes = currentNotes.map(note => 
              note.id === currentNote.id 
                ? { ...note, tags: [...(note.tags || []), command.params.tag] }
                : note
            );
            setNotes(updatedNotes);
            return `Added tag "${command.params.tag}" to current note`;
          }
          return 'No current note selected to add tag to';

        case 'search':
          if (command.params?.query) {
            const searchQuery = command.params.query.toLowerCase();
            const matchingNotes = currentNotes.filter(note =>
              note.content.toLowerCase().includes(searchQuery) ||
              note.tags?.some(tag => tag.toLowerCase().includes(searchQuery))
            );
            return `Found ${matchingNotes.length} notes matching "${command.params.query}"`;
          }
          break;

        case 'save':
          // In a real implementation, this would save to backend
          return 'Note saved successfully';

        case 'export':
          if (command.params?.format && currentNote) {
            // In a real implementation, this would trigger export
            return `Exporting current note as ${command.params.format}`;
          }
          return 'No current note to export';

        case 'delete':
          if (command.params?.all) {
            setNotes([]);
            return 'All notes cleared';
          } else if (currentNote) {
            const filteredNotes = currentNotes.filter(note => note.id !== currentNote.id);
            setNotes(filteredNotes);
            return 'Current note deleted';
          }
          return 'No current note to delete';

        default:
          return 'Command not recognized';
      }
    } catch (error) {
      console.error('Error executing voice command:', error);
      return 'Error executing command';
    }
    
    return 'Command executed';
  },

  // Helper function to get available commands
  getAvailableCommands(): string[] {
    return [
      'Create new note titled [title]',
      'Add tag [tagname]', 
      'Search for [query]',
      'Save note',
      'Export note as PDF/HTML/Markdown',
      'Delete note',
      'Clear all notes'
    ];
  }
};