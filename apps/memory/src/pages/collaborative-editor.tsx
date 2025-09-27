import CollaborativeEditor from "../components/Collaboration/CollaborativeEditor";
import { useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../contexts/AuthContext";

export default function CollaborativeEditorPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [content, setContent] = useState("");
  // For demo, use query param ?noteId=... or fallback
  const noteId = router.query.noteId || "demo-note";

  if (!user) {
    return <div className="p-8 text-center">Sign in to use collaborative editing.</div>;
  }

  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Collaborative Editor</h1>
      <CollaborativeEditor
        noteId={noteId as string}
        content={content}
        onChange={setContent}
      />
    </div>
  );
}
