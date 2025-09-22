// Voice Command Service for OurSynth-Eco Noteflow
// Adapted from the original NoteFlow prototype

type CommandAction = 'create' | 'edit' | 'delete' | 'search' | 'export' | 'link' | 'share' | 'save' | 'add_tag' | 'assign_task' | 'update_status' | 'create_taskflow';
type CommandTarget = 'note' | 'notebook' | 'tag' | 'attachment' | 'task' | 'taskflow';

interface VoiceCommand {
  action: CommandAction;
  target?: CommandTarget;
  params?: Record<string, any>;
}

interface TaskInfo {
  title: string;
  status: 'todo' | 'in-progress' | 'completed' | 'cancelled';
  assignedAgent?: string;
  priority?: 'low' | 'medium' | 'high' | 'critical';
  dueDate?: Date;
  subtasks?: Array<{
    id: string;
    title: string;
    completed: boolean;
  }>;
}

interface MemoryNote {
  id: string;
  content: string;
  tags?: string[];
  timestamp: Date;
  attachments?: any[];
  taskInfo?: TaskInfo; // TaskFlow enhancement
  noteType?: 'standard' | 'taskflow'; // Track note type
}

const COMMAND_PATTERNS = {
  createNote: /^create (a )?new note( called| titled)? (.+)$/i,
  createTaskFlow: /^create (a )?new task(flow)?( called| titled)? (.+)$/i,
  addTag: /^add tag (.+)$/i,
  searchNotes: /^search( for)? (.+)$/i,
  saveNote: /^save( this)?( note)?$/i,
  exportNote: /^export( note)?( as)? (pdf|html|markdown)$/i,
  deleteNote: /^delete( this)? note$/i,
  clearNotes: /^clear( all)? notes$/i,
  assignTask: /^assign task to (.+)$/i,
  updateTaskStatus: /^(mark|set) task (as )?(todo|in-progress|completed|cancelled)$/i,
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

    if (COMMAND_PATTERNS.createTaskFlow.test(cleanTranscript)) {
      const match = cleanTranscript.match(COMMAND_PATTERNS.createTaskFlow);
      const title = match?.[4] || 'New TaskFlow';
      return {
        action: 'create_taskflow',
        target: 'taskflow',
        params: { title }
      };
    }

    if (COMMAND_PATTERNS.assignTask.test(cleanTranscript)) {
      const match = cleanTranscript.match(COMMAND_PATTERNS.assignTask);
      const agent = match?.[1] || '';
      return {
        action: 'assign_task',
        target: 'task',
        params: { agent }
      };
    }

    if (COMMAND_PATTERNS.updateTaskStatus.test(cleanTranscript)) {
      const match = cleanTranscript.match(COMMAND_PATTERNS.updateTaskStatus);
      const status = match?.[3] || '';
      return {
        action: 'update_status',
        target: 'task',
        params: { status }
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
              attachments: [],
              noteType: 'standard'
            };
            setNotes([...currentNotes, newNote]);
            return `Created new note: ${command.params.title}`;
          }
          break;

        case 'create_taskflow':
          if (command.target === 'taskflow' && command.params?.title) {
            const newTaskFlow: MemoryNote = {
              id: Date.now().toString(),
              content: `# ${command.params.title}\n\nTaskFlow created via voice command.\n\n## Tasks\n- [ ] Initial task\n`,
              tags: ['taskflow', 'voice-created'],
              timestamp: new Date(),
              attachments: [],
              noteType: 'taskflow',
              taskInfo: {
                title: command.params.title,
                status: 'todo',
                priority: 'medium',
                subtasks: [{
                  id: Date.now().toString() + '_1',
                  title: 'Initial task',
                  completed: false
                }]
              }
            };
            setNotes([...currentNotes, newTaskFlow]);
            return `Created new TaskFlow: ${command.params.title}`;
          }
          break;

        case 'assign_task':
          if (command.params?.agent && currentNote?.noteType === 'taskflow') {
            const updatedNotes = currentNotes.map(note => 
              note.id === currentNote.id 
                ? { 
                    ...note, 
                    taskInfo: { 
                      ...note.taskInfo!, 
                      assignedAgent: command.params.agent 
                    } 
                  }
                : note
            );
            setNotes(updatedNotes);
            return `Assigned task to ${command.params.agent}`;
          }
          break;

        case 'update_status':
          if (command.params?.status && currentNote?.noteType === 'taskflow') {
            const validStatus = ['todo', 'in-progress', 'completed', 'cancelled'].includes(command.params.status);
            if (validStatus) {
              const updatedNotes = currentNotes.map(note => 
                note.id === currentNote.id 
                  ? { 
                      ...note, 
                      taskInfo: { 
                        ...note.taskInfo!, 
                        status: command.params.status 
                      } 
                    }
                  : note
              );
              setNotes(updatedNotes);
              return `Updated task status to ${command.params.status}`;
            }
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
      'Create new taskflow titled [title]',
      'Add tag [tagname]', 
      'Search for [query]',
      'Save note',
      'Export note as PDF/HTML/Markdown',
      'Delete note',
      'Clear all notes',
      'Assign task to [agent]',
      'Mark task as todo/in-progress/completed/cancelled'
    ];
  }
};