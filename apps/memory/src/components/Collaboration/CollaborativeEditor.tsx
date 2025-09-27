import { useEffect, useState, useRef } from "react";
import { RichTextEditor, EditorInstance } from "../Editor/RichTextEditor";
import { collaborationService } from "../../services/collaborationService";
// Update the import to use available components from @oursynth/halo-ui
import { Avatar } from "../ui/avatar";
import { HaloBadge } from "../ui/halobadge";
import { Users } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

interface CollaborativeEditorProps {
  noteId: string; // This is effectively the mindMapId for collaboration context
  content: string;
  onChange: (content: string) => void;
}

interface CollaborativeUser {
  id: string;
  name: string;
  isActive: boolean;
  lastSeen: Date;
}

export default function CollaborativeEditor({ noteId, content, onChange }: CollaborativeEditorProps) {
  const { user } = useAuth();
  const [collaborators, setCollaborators] = useState<CollaborativeUser[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const editorRef = useRef<EditorInstance | null>(null);

  useEffect(() => {
    if (!user || !noteId) return;

    const setupCollaboration = async () => {
      try {
        await collaborationService.createSession({
          mindMapId: noteId,
          userId: user.id,
          userName: user.user_metadata?.full_name || user.email?.split("@")[0] || "Anonymous",
          isActive: true,
        });

        const activeSessions = await collaborationService.getActiveSessions(noteId);
        setCollaborators(activeSessions.map(session => ({
          id: session.userId,
          name: session.userName || "Anonymous",
          isActive: session.isActive,
          lastSeen: session.lastActivity ? new Date(session.lastActivity) : new Date(),
        })));

        setIsConnected(true);
      } catch (error) {
        console.error("Failed to setup collaboration:", error);
      }
    };

    setupCollaboration();

    return () => {
      if (user) {
        collaborationService.createSession({
          mindMapId: noteId,
          userId: user.id,
          isActive: false,
        }).catch(console.error);
      }
    };
  }, [user, noteId]);

  const handleLocalContentChange = async (newContent: string) => {
    if (newContent !== content) {
      onChange(newContent);

      if (user && noteId) {
        try {
          await collaborationService.createSession({
            mindMapId: noteId,
            userId: user.id,
            userName: user.user_metadata?.full_name || user.email?.split("@")[0] || "Anonymous",
            isActive: true,
          });
        } catch (error) {
          console.error("Error updating collaborative activity:", error);
        }
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Users size={16} />
        <div className="flex gap-1">
          {collaborators.map((collaborator) => (
            <Avatar key={collaborator.id} className="w-6 h-6">
              {collaborator.name.substring(0, 2).toUpperCase()}
            </Avatar>
          ))}
        </div>
  <HaloBadge style={{ marginLeft: 8 }}>
          {collaborators.length} active
  </HaloBadge>
      </div>
      <RichTextEditor
        content={content}
        onChange={handleLocalContentChange}
        onEditorInstance={(instance: EditorInstance) => {
          editorRef.current = instance;
          // Initial content is passed as a prop to RichTextEditor
        }}
      />
    </div>
  );
}
