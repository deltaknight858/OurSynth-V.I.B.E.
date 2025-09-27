import { FileText, Image, Video, Music, Link as LinkIcon, Code, Book, File, BrainCircuit, ListTodo, Lightbulb, Target, CheckSquare, Headphones, Globe, Table, Calendar, MessageSquare, Copy, Columns, FileCode, Database, FileImage, FileClock, FileAudio, FileCheck, Text, Hash, AlignLeft, LucideIcon } from "lucide-react";

export interface NodeTemplate {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  className?: string;
  headerStyle?: string;
  contentStyle?: string;
  contentPreviewStyle?: string;
  iconBackground?: string;
  borderStyle?: string;
  copyButtonStyle?: string;
  defaultWidth?: string;
  contentPlaceholder?: string;
  lineNumbersEnabled?: boolean;
  aiPrompt?: string;
  connectionColor?: string; // Added for explicit connection styling
}

export const nodeTemplates: NodeTemplate[] = [
  {
    id: "default",
    name: "Note",
    icon: FileText,
    className: "bg-gradient-to-br from-primary/5 to-background border-primary/20 hover:shadow-primary/10",
    description: "Standard note template",
    aiPrompt: "Suggest related topics for this note",
    contentStyle: "px-3 py-2 rounded-md bg-background/80",
    headerStyle: "border-b border-primary/10 pb-2",
    borderStyle: "border-l-2 border-primary",
    copyButtonStyle: "hover:bg-primary/10",
    contentPlaceholder: "Add your note content here...",
    connectionColor: "var(--primary)",
  },
  {
    id: "idea",
    name: "Idea",
    icon: Lightbulb,
    className: "bg-gradient-to-br from-yellow-500/10 to-background border-yellow-500/20 hover:shadow-yellow-500/10",
    description: "For brainstorming and ideas",
    aiPrompt: "Help me brainstorm more ideas related to this",
    contentStyle: "px-3 py-2 rounded-md bg-yellow-500/5",
    headerStyle: "border-b border-yellow-500/10 pb-2",
    borderStyle: "border-l-2 border-yellow-500",
    iconBackground: "bg-yellow-500/10",
    copyButtonStyle: "hover:bg-yellow-500/10",
    contentPreviewStyle: "italic",
    contentPlaceholder: "Capture your brilliant idea here...",
    connectionColor: "var(--yellow-500)",
  },
  {
    id: "task",
    name: "Task",
    icon: ListTodo,
    className: "bg-gradient-to-br from-green-500/10 to-background border-green-500/20 hover:shadow-green-500/10",
    description: "For tasks and todos",
    aiPrompt: "Break this task into smaller subtasks",
    contentStyle: "px-3 py-2 rounded-md bg-green-500/5 space-y-1",
    headerStyle: "border-b border-green-500/10 pb-2 flex items-center",
    borderStyle: "border-l-2 border-green-500",
    iconBackground: "bg-green-500/10",
    copyButtonStyle: "hover:bg-green-500/10",
    contentPreviewStyle: "list-disc list-inside",
    contentPlaceholder: `- Task to complete
- Another task
- Final task`,
    connectionColor: "var(--green-500)",
  },
  {
    id: "checklist",
    name: "Checklist",
    icon: CheckSquare,
    className: "bg-gradient-to-br from-teal-500/10 to-background border-teal-500/20 hover:shadow-teal-500/10",
    description: "For tracking progress",
    aiPrompt: "Help me organize this checklist better",
    contentStyle: "px-3 py-2 rounded-md bg-teal-500/5 space-y-1",
    headerStyle: "border-b border-teal-500/10 pb-2",
    borderStyle: "border-l-2 border-teal-500",
    iconBackground: "bg-teal-500/10",
    copyButtonStyle: "hover:bg-teal-500/10",
    contentPreviewStyle: "list-none",
    contentPlaceholder: `☐ Item to check
☐ Another item
☐ Final item`,
    connectionColor: "var(--teal-500)",
  },
  {
    id: "audio",
    name: "Audio Note",
    icon: Headphones,
    className: "bg-gradient-to-br from-violet-500/10 to-background border-violet-500/20 hover:shadow-violet-500/10",
    description: "For voice notes and audio",
    aiPrompt: "Suggest key points from this audio note",
    contentStyle: "px-3 py-2 rounded-md bg-violet-500/5",
    headerStyle: "border-b border-violet-500/10 pb-2",
    borderStyle: "border-l-2 border-violet-500",
    iconBackground: "bg-violet-500/10",
    copyButtonStyle: "hover:bg-violet-500/10",
    contentPreviewStyle: "italic",
    contentPlaceholder: "Transcription of audio content...",
    connectionColor: "var(--violet-500)",
  },
  {
    id: "link",
    name: "Web Link",
    icon: Globe,
    className: "bg-gradient-to-br from-sky-500/10 to-background border-sky-500/20 hover:shadow-sky-500/10",
    description: "For web references",
    aiPrompt: "Find related resources to this link",
    contentStyle: "px-3 py-2 rounded-md bg-sky-500/5 underline-offset-2",
    headerStyle: "border-b border-sky-500/10 pb-2",
    borderStyle: "border-l-2 border-sky-500",
    iconBackground: "bg-sky-500/10",
    copyButtonStyle: "hover:bg-sky-500/10",
    contentPreviewStyle: "underline text-sky-500",
    contentPlaceholder: "https://example.com",
    connectionColor: "var(--sky-500)",
  },
  {
    id: "goal",
    name: "Goal",
    icon: Target,
    className: "bg-gradient-to-br from-blue-500/10 to-background border-blue-500/20 hover:shadow-blue-500/10",
    description: "For goals and objectives",
    aiPrompt: "Help me break down this goal into actionable steps",
    contentStyle: "px-3 py-2 rounded-md bg-blue-500/5",
    headerStyle: "border-b border-blue-500/10 pb-2",
    borderStyle: "border-l-2 border-blue-500",
    iconBackground: "bg-blue-500/10",
    copyButtonStyle: "hover:bg-blue-500/10",
    contentPreviewStyle: "font-medium",
    contentPlaceholder: "Define your goal and target date...",
    connectionColor: "var(--blue-500)",
  },
  {
    id: "concept",
    name: "Concept",
    icon: BrainCircuit,
    className: "bg-gradient-to-br from-purple-500/10 to-background border-purple-500/20 hover:shadow-purple-500/10",
    description: "For complex concepts",
    aiPrompt: "Explain this concept in simpler terms",
    contentStyle: "px-3 py-2 rounded-md bg-purple-500/5",
    headerStyle: "border-b border-purple-500/10 pb-2",
    borderStyle: "border-l-2 border-purple-500",
    iconBackground: "bg-purple-500/10",
    copyButtonStyle: "hover:bg-purple-500/10",
    contentPlaceholder: "Define the concept and key principles...",
    connectionColor: "var(--purple-500)",
  },
  {
    id: "image",
    name: "Image",
    icon: FileImage,
    className: "bg-gradient-to-br from-pink-500/10 to-background border-pink-500/20 hover:shadow-pink-500/10",
    description: "For image notes",
    aiPrompt: "Describe what you see in this image",
    contentStyle: "px-3 py-2 rounded-md bg-pink-500/5",
    headerStyle: "border-b border-pink-500/10 pb-2",
    borderStyle: "border-l-2 border-pink-500",
    iconBackground: "bg-pink-500/10",
    copyButtonStyle: "hover:bg-pink-500/10",
    contentPreviewStyle: "italic text-muted-foreground",
    contentPlaceholder: "Image description or caption...",
    connectionColor: "var(--pink-500)",
  },
  {
    id: "code",
    name: "Code",
    icon: FileCode,
    className: "bg-gradient-to-br from-red-500/10 to-background border-red-500/20 hover:shadow-red-500/10",
    description: "For code snippets",
    aiPrompt: "Explain what this code does",
    contentStyle: "px-3 py-2 rounded-md bg-red-500/5 font-mono text-xs relative overflow-hidden",
    headerStyle: "border-b border-red-500/10 pb-2",
    borderStyle: "border-l-2 border-red-500",
    iconBackground: "bg-red-500/10",
    copyButtonStyle: "hover:bg-red-500/10 absolute right-2 top-2",
    contentPreviewStyle: "font-mono whitespace-pre overflow-x-auto scrollbar-thin scrollbar-thumb-red-500/20",
    lineNumbersEnabled: true,
    contentPlaceholder: `function example() {
  // Your code here
  return true;
}`,
    connectionColor: "var(--red-500)",
  },
  {
    id: "table",
    name: "Table",
    icon: Table,
    className: "bg-gradient-to-br from-emerald-500/10 to-background border-emerald-500/20 hover:shadow-emerald-500/10",
    description: "For structured data",
    aiPrompt: "Help me organize this data better",
    contentStyle: "px-3 py-2 rounded-md bg-emerald-500/5 grid grid-cols-2 gap-1 text-xs",
    headerStyle: "border-b border-emerald-500/10 pb-2",
    borderStyle: "border-l-2 border-emerald-500",
    iconBackground: "bg-emerald-500/10",
    copyButtonStyle: "hover:bg-emerald-500/10",
    contentPreviewStyle: "border border-emerald-500/10 rounded",
    contentPlaceholder: `Header 1 | Header 2
-------- | --------
Data 1   | Data 2
Data 3   | Data 4`,
    connectionColor: "var(--emerald-500)",
  },
  {
    id: "event",
    name: "Event",
    icon: FileClock,
    className: "bg-gradient-to-br from-indigo-500/10 to-background border-indigo-500/20 hover:shadow-indigo-500/10",
    description: "For events and deadlines",
    aiPrompt: "Suggest a timeline for this event",
    contentStyle: "px-3 py-2 rounded-md bg-indigo-500/5",
    headerStyle: "border-b border-indigo-500/10 pb-2",
    borderStyle: "border-l-2 border-indigo-500",
    iconBackground: "bg-indigo-500/10",
    copyButtonStyle: "hover:bg-indigo-500/10",
    contentPreviewStyle: "font-medium",
    contentPlaceholder: `Event: Title
Date: MM/DD/YYYY
Time: 00:00
Location: Place`,
    connectionColor: "var(--indigo-500)",
  },
  {
    id: "chat",
    name: "Discussion",
    icon: MessageSquare,
    className: "bg-gradient-to-br from-rose-500/10 to-background border-rose-500/20 hover:shadow-rose-500/10",
    description: "For discussions and comments",
    aiPrompt: "Summarize the key points of this discussion",
    contentStyle: "px-3 py-2 rounded-md bg-rose-500/5 space-y-2",
    headerStyle: "border-b border-rose-500/10 pb-2",
    borderStyle: "border-l-2 border-rose-500",
    iconBackground: "bg-rose-500/10",
    copyButtonStyle: "hover:bg-rose-500/10",
    contentPreviewStyle: "italic",
    contentPlaceholder: `User 1: Message
User 2: Reply
User 1: Response`,
    connectionColor: "var(--rose-500)",
  },
  {
    id: "markdown",
    name: "Markdown",
    icon: AlignLeft,
    className: "bg-gradient-to-br from-amber-500/10 to-background border-amber-500/20 hover:shadow-amber-500/10",
    description: "For markdown text",
    aiPrompt: "Help me format this markdown better",
    contentStyle: "px-3 py-2 rounded-md bg-amber-500/5 font-mono text-xs",
    headerStyle: "border-b border-amber-500/10 pb-2",
    borderStyle: "border-l-2 border-amber-500",
    iconBackground: "bg-amber-500/10",
    copyButtonStyle: "hover:bg-amber-500/10",
    contentPreviewStyle: "whitespace-pre-wrap",
    contentPlaceholder: `# Heading

**Bold text** and *italic text*

- List item 1
- List item 2`,
    connectionColor: "var(--amber-500)",
  },
  {
    id: "database",
    name: "Database",
    icon: Database,
    className: "bg-gradient-to-br from-cyan-500/10 to-background border-cyan-500/20 hover:shadow-cyan-500/10",
    description: "For database schema",
    aiPrompt: "Help me optimize this database schema",
    contentStyle: "px-3 py-2 rounded-md bg-cyan-500/5 font-mono text-xs",
    headerStyle: "border-b border-cyan-500/10 pb-2",
    borderStyle: "border-l-2 border-cyan-500",
    iconBackground: "bg-cyan-500/10",
    copyButtonStyle: "hover:bg-cyan-500/10",
    contentPreviewStyle: "whitespace-pre-wrap",
    contentPlaceholder: `Table Users {
  id int [pk]
  name varchar
  email varchar
}`,
    connectionColor: "var(--cyan-500)",
  },
  {
    id: "tags",
    name: "Tags",
    icon: Hash,
    className: "bg-gradient-to-br from-fuchsia-500/10 to-background border-fuchsia-500/20 hover:shadow-fuchsia-500/10",
    description: "For tag collections",
    aiPrompt: "Suggest related tags for this collection",
    contentStyle: "px-3 py-2 rounded-md bg-fuchsia-500/5 flex flex-wrap gap-1",
    headerStyle: "border-b border-fuchsia-500/10 pb-2",
    borderStyle: "border-l-2 border-fuchsia-500",
    iconBackground: "bg-fuchsia-500/10",
    copyButtonStyle: "hover:bg-fuchsia-500/10",
    contentPreviewStyle: "flex flex-wrap gap-1",
    contentPlaceholder: "#tag1 #tag2 #tag3 #tag4",
    connectionColor: "var(--fuchsia-500)",
  }
];

export const getTemplateByType = (type: string): NodeTemplate => {
  return nodeTemplates.find(template => template.id === type) || nodeTemplates[0];
};

export const getAiPromptForType = (type: string): string => {
  const template = getTemplateByType(type);
  return template.aiPrompt || "How can I help you with this note?";
};
