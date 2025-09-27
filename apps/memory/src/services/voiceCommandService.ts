import { noteService } from "./noteService";
import { notebookService } from "./notebookService";
import { collaborationService } from "./collaborationService";

type CommandAction = "create" | "edit" | "delete" | "search" | "export" | "link" | "share" | "navigate";
type CommandTarget = "note" | "notebook" | "tag" | "attachment";

interface VoiceCommand {
  action: CommandAction;
  target: CommandTarget;
  params?: Record<string, any>;
}

const COMMAND_PATTERNS = {
  createNote: /^create (a )?new note( called| titled)? (.+)$/i,
  createNotebook: /^create (a )?new notebook( called| titled)? (.+)$/i,
  addTag: /^add tag (.+)$/i,
  searchNotes: /^search( for)? (.+)$/i,
  exportNote: /^export( note)?( as)? (pdf|html|markdown)$/i,
  shareNote: /^share( note)?( with)? (.+@.+\..+)$/i,
  deleteNote: /^delete( this)? note$/i,
  linkNotes: /^link( this)?( note)?( to)? (.+)$/i
};

export const voiceCommandService = {
  parseCommand(transcript: string): VoiceCommand | null {
    if (COMMAND_PATTERNS.createNote.test(transcript)) {
      const [, , , title] = transcript.match(COMMAND_PATTERNS.createNote) || [];
      return {
        action: "create",
        target: "note",
        params: { title }
      };
    }

    if (COMMAND_PATTERNS.createNotebook.test(transcript)) {
      const [, , , title] = transcript.match(COMMAND_PATTERNS.createNotebook) || [];
      return {
        action: "create",
        target: "notebook",
        params: { title }
      };
    }

    if (COMMAND_PATTERNS.addTag.test(transcript)) {
      const [, tag] = transcript.match(COMMAND_PATTERNS.addTag) || [];
      return {
        action: "create",
        target: "tag",
        params: { tag }
      };
    }

    if (COMMAND_PATTERNS.searchNotes.test(transcript)) {
      const [, , query] = transcript.match(COMMAND_PATTERNS.searchNotes) || [];
      return {
        action: "search",
        target: "note",
        params: { query }
      };
    }

    if (COMMAND_PATTERNS.exportNote.test(transcript)) {
      const [, , , format] = transcript.match(COMMAND_PATTERNS.exportNote) || [];
      return {
        action: "export",
        target: "note",
        params: { format }
      };
    }

    if (COMMAND_PATTERNS.shareNote.test(transcript)) {
      const [, , , email] = transcript.match(COMMAND_PATTERNS.shareNote) || [];
      return {
        action: "share",
        target: "note",
        params: { email }
      };
    }

    if (COMMAND_PATTERNS.deleteNote.test(transcript)) {
      return {
        action: "delete",
        target: "note"
      };
    }

    if (COMMAND_PATTERNS.linkNotes.test(transcript)) {
      const [, , , , targetTitle] = transcript.match(COMMAND_PATTERNS.linkNotes) || [];
      return {
        action: "link",
        target: "note",
        params: { targetTitle }
      };
    }

    return null;
  },

  async executeCommand(command: VoiceCommand, userId: string, currentNote?: any): Promise<string> {
    try {
      switch (command.action) {
        case "create":
          if (command.target === "note" && command.params?.title) {
            await noteService.createNote({
              title: command.params.title,
              content: "",
              tags: [],
              category: "default",
              notebookId: "default",
              userId,
              isPinned: false,
              attachments: []
            });
            return `Created new note: ${command.params.title}`;
          }
          if (command.target === "notebook" && command.params?.title) {
            await notebookService.createNotebook({
              title: command.params.title,
              userId
            });
            return `Created new notebook: ${command.params.title}`;
          }
          if (command.target === "tag" && command.params?.tag && currentNote?.id) {
            await noteService.updateNote(currentNote.id, {
              tags: [...(currentNote.tags || []), command.params.tag]
            });
            return `Added tag: ${command.params.tag}`;
          }
          break;

        case "delete":
          if (command.target === "note" && currentNote?.id) {
            await noteService.deleteNote(currentNote.id);
            return "Note deleted";
          }
          break;

        case "share":
          if (command.target === "note" && currentNote?.id && command.params?.email) {
            await collaborationService.createSession({
              mindMapId: currentNote.id, // Use mindMapId
              userId: command.params.email, // The user to share with
              userName: command.params.email, // Use email as placeholder name
              isActive: true, // Mark as active for the purpose of sharing/inviting
            });
            return `Note shared with ${command.params.email}`;
          }
          break;

        default:
          return "Command not recognized";
      }

      return "Action completed";
    } catch (error) {
      console.error("Error executing voice command:", error);
      return "Error executing command";
    }
  },

  async shareNote(noteId: string, email: string): Promise<void> {
    try {
      await collaborationService.createSession({
        mindMapId: noteId,
        userId: "system", // Or perhaps the inviting user's ID
        isActive: true, // This might represent an invitation or shared status
      });
      
      console.log(`Note ${noteId} shared with ${email}`);
    } catch (error) {
      console.error("Error sharing note:", error);
      throw error;
    }
  },
};
