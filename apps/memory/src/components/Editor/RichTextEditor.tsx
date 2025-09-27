import { Editor, EditorContent, useEditor, EditorEvents } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import { HaloButton } from "../ui/HaloButton";
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Link as LinkIcon,
  Quote,
  Code,
  Heading,
  CheckSquare,
} from "lucide-react";
import { useEffect } from "react";

export type EditorInstance = Editor | null;

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  onEditorInstance?: (instance: EditorInstance) => void; // New prop
  editable?: boolean;
}

export function RichTextEditor({
  content,
  onChange,
  onEditorInstance, // New prop
  editable = true,
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-primary underline cursor-pointer",
        },
      }),
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
    ],
    content: content,
    editable: editable,
    onUpdate: ({ editor: currentEditor }: EditorEvents["update"]) => {
      onChange(currentEditor.getHTML());
    },
  });

  useEffect(() => {
    if (onEditorInstance && editor) {
      onEditorInstance(editor);
    }
  }, [editor, onEditorInstance]);

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  if (!editor) {
    return null;
  }

  const toggleLink = () => {
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("URL", previousUrl);

    if (url === null) {
      return;
    }

    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  return (
    <div className="border rounded-md">
      <div className="flex flex-wrap gap-1 p-2 border-b">
        <HaloButton
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={editor.isActive("bold") ? "bg-muted" : ""}
        >
          <Bold className="h-4 w-4" />
        </HaloButton>
        <HaloButton
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={editor.isActive("italic") ? "bg-muted" : ""}
        >
          <Italic className="h-4 w-4" />
        </HaloButton>
        <HaloButton
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={editor.isActive("strike") ? "bg-muted" : ""}
        >
          <Underline className="h-4 w-4" />
        </HaloButton>
        <HaloButton
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editor.isActive("bulletList") ? "bg-muted" : ""}
        >
          <List className="h-4 w-4" />
        </HaloButton>
        <HaloButton
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={editor.isActive("orderedList") ? "bg-muted" : ""}
        >
          <ListOrdered className="h-4 w-4" />
        </HaloButton>
        <HaloButton
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleTaskList().run()}
          className={editor.isActive("taskList") ? "bg-muted" : ""}
        >
          <CheckSquare className="h-4 w-4" />
        </HaloButton>
        <HaloButton
          variant="ghost"
          size="sm"
          onClick={toggleLink}
          className={editor.isActive("link") ? "bg-muted" : ""}
        >
          <LinkIcon className="h-4 w-4" />
        </HaloButton>
        <HaloButton
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={editor.isActive("blockquote") ? "bg-muted" : ""}
        >
          <Quote className="h-4 w-4" />
        </HaloButton>
        <HaloButton
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={editor.isActive("codeBlock") ? "bg-muted" : ""}
        >
          <Code className="h-4 w-4" />
        </HaloButton>
        <HaloButton
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={editor.isActive("heading", { level: 2 }) ? "bg-muted" : ""}
        >
          <Heading className="h-4 w-4" />
        </HaloButton>
      </div>
      <EditorContent 
        editor={editor} 
        className="prose prose-sm max-w-none p-4 min-h-[300px] focus:outline-none"
      />
    </div>
  );
}
