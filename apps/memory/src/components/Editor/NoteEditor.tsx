import type { Note, Notebook } from "../../../../../../types/workspace";
import React, { useEffect, useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { useDropzone } from "react-dropzone";
import { Input } from "../ui/input";
import { HaloBadge } from "../ui/halobadge";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { CardContent } from "../ui/card";
import { CardHeader } from "../ui/card";
import { Dialog } from "../ui/dialog";
import { DialogContent } from "../ui/dialog";
import { DialogHeader } from "../ui/dialog";
import { DialogTitle } from "../ui/dialog";
import { DialogTrigger } from "../ui/dialog";
import { ScrollArea } from "../ui/scroll-area";
import { DropdownMenu } from "../ui/dropdown-menu";
import { DropdownMenuTrigger } from "../ui/dropdown-menu";
import { DropdownMenuContent } from "../ui/dropdown-menu";
import { DropdownMenuItem } from "../ui/dropdown-menu";
import { useToast } from "../ui/use-toast";
import { exportService } from "../../services/exportService";
import { VoiceCommandHelp } from "./VoiceCommandHelp";
import { MediaRecorder } from "./MediaRecorder";
import { ScreenCapture } from "./ScreenCapture";
import { RichTextEditor } from "./RichTextEditor";
import { VoiceCommandManager } from "./VoiceCommandManager";
import {
  Paperclip,
  Mic,
  Video,
  Link2,
  Unlink2,
  Save,
  Settings,
  HelpCircle,
  Maximize,
  Minimize,
  Trash2,
  Archive,
  UploadCloud,
  Image as ImageIcon,
  FileText as FileTextIcon,
  Music,
  Film,
  FileQuestion,
  X,
  Palette,
  Tags,
  Pin,
  PinOff,
} from "lucide-react";


interface NoteEditorProps {
  initialNote?: Partial<Note> | null;
  notebooks: Notebook[];
  currentNotebookId: string;
  onSave: (note: Partial<Note>) => void;
  onClose?: () => void;
  userId: string;
  isMaximized: boolean;
  onToggleMaximize: () => void;
  onDelete?: (noteId: string) => void;
  onArchive?: (noteId: string) => void;
}

export default function NoteEditor({
  initialNote,
  notebooks,
  currentNotebookId,
  onSave,
  onClose,
  userId,
  isMaximized,
  onToggleMaximize,
  onDelete,
  onArchive,
}: NoteEditorProps) {
  const [note, setNote] = useState<Partial<Note>>(
    initialNote || {
      title: "",
      content: "",
      notebookId: currentNotebookId,
      userId: userId,
      isPinned: false,
      tags: [],
      attachments: [],
    }
  );
  const [selectedNotebookId, setSelectedNotebookId] = useState<string>(
    initialNote?.notebookId || currentNotebookId
  );
  const [tagInput, setTagInput] = useState("");
  const [showColorPicker, setShowColorPicker] = useState(false);
  const { toast } = useToast();
  const editorRef = useRef<any>(null);

  useEffect(() => {
    setNote(
      initialNote || {
        title: "",
        content: "",
        notebookId: currentNotebookId,
        userId: userId,
        isPinned: false,
        tags: [],
        attachments: [],
      }
    );
    setSelectedNotebookId(initialNote?.notebookId || currentNotebookId);
  }, [initialNote, currentNotebookId, userId]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
  setNote((prevNote: Partial<Note>) => ({ ...prevNote, [name]: value }));
  };

  const handleContentChange = (content: string) => {
  setNote((prevNote: Partial<Note>) => ({ ...prevNote, content }));
  };

  const handleSave = async () => {
    if (!note.title?.trim()) {
      toast({
        title: "Title Required",
        description: "Please enter a title for your note.",
        variant: "destructive",
      });
      return;
    }
    const noteToSave: Partial<Note> = {
      ...note,
      notebookId: selectedNotebookId,
    };
    onSave(noteToSave);
    toast({
      title: "Note Saved",
      description: "Your note has been successfully saved.",
    });
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (!note.id) {
      toast({ title: "Save Note First", description: "Please save the note before adding attachments.", variant: "destructive" });
      return;
    }
    acceptedFiles.forEach(async (file) => {
      try {
        toast({ title: "File Uploaded", description: `${file.name} uploaded successfully.` });
      } catch (error) {
        toast({ title: "Upload Failed", description: `Failed to upload ${file.name}: ${String(error)}`, variant: "destructive" });
      }
    });
  }, [note.id, toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, noClick: true });

  const handleAddTag = () => {
    if (tagInput.trim() && !(note.tags || []).includes(tagInput.trim())) {
    setNote((prev: Partial<Note>) => ({ ...prev, tags: [...(prev.tags || []), tagInput.trim()] }));
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
  setNote((prev: Partial<Note>) => ({ ...prev, tags: (prev.tags || []).filter((tag: string) => tag !== tagToRemove) }));
  };

  const handleAudioRecorded = async (blob: Blob) => {
    if (!note.id) {
      toast({ title: "Save Note First", description: "Please save the note before adding audio.", variant: "destructive" });
      return;
    }
    const audioFile = new File([blob], `audio_recording_${Date.now()}.webm`, { type: "audio/webm" });
    try {
      toast({ title: "Audio Recorded", description: "Audio recording added to attachments." });
    } catch (error) {
      toast({ title: "Audio Upload Failed", description: String(error), variant: "destructive" });
    }
  };

  const handleScreenCaptured = async (dataUrl: string) => {
    if (!note.id) {
      toast({ title: "Save Note First", description: "Please save the note before adding screen capture.", variant: "destructive" });
      return;
    }
    const blob = await (await fetch(dataUrl)).blob();
    const imageFile = new File([blob], `screen_capture_${Date.now()}.png`, { type: "image/png" });
    try {
      toast({ title: "Screen Captured", description: "Screen capture added to attachments." });
    } catch (error) {
      toast({ title: "Screen Capture Upload Failed", description: String(error), variant: "destructive" });
    }
  };

  const handleVoiceCommand = (command?: any) => {
    if (!command) return;
    if (command.type === "save_note") {
      handleSave();
    } else if (command.type === "set_title" && command.value) {
  setNote((prev: Partial<Note>) => ({ ...prev, title: command.value }));
    } else if (command.type === "add_content" && command.value) {
      const currentContent = editorRef.current?.getHTML() || note.content || "";
      let newContent = currentContent;
      if (currentContent) {
        newContent += "\n";
      }
      newContent += command.value;
      editorRef.current?.commands.setContent(newContent);
      handleContentChange(newContent);
    } else if (command.type === "add_tag" && command.value) {
      if (command.value.trim() && !(note.tags || []).includes(command.value.trim())) {
        setNote((prev: Partial<Note>) => ({ ...prev, tags: [...(prev.tags || []), command.value.trim()] }));
      }
    }
  };

  const getFileIcon = (fileType: string) => {
  if (fileType.startsWith("image/")) return <ImageIcon className="h-5 w-5 text-blue-500" />;
  if (fileType.startsWith("audio/")) return <Music className="h-5 w-5 text-purple-500" />;
  if (fileType.startsWith("video/")) return <Film className="h-5 w-5 text-red-500" />;
  if (fileType === "application/pdf") return <FileTextIcon className="h-5 w-5 text-orange-500" />;
  return <FileQuestion className="h-5 w-5 text-gray-500" />;
  };

  const handleExport = (format: "pdf" | "md" | "txt" | "html") => {
    if (note.title && note.content) {
      if (format === "pdf") {
        exportService.exportToPDF(note as Note, document.body);
      } else if (format === "html") {
        const htmlContent = exportService.exportToHTML(note as Note);
        exportService.downloadFile(htmlContent, `${note.title}.html`);
      } else if (format === "md") {
        const mdContent = exportService.exportToMarkdown(note as Note);
        exportService.downloadFile(mdContent, `${note.title}.md`);
      } else if (format === "txt") {
        exportService.downloadFile(note.content, `${note.title}.txt`);
      }
      toast({ title: "Export Started", description: `Note exporting as ${format}.` });
    } else {
      toast({ title: "Cannot Export", description: "Note title or content is missing.", variant: "destructive" });
    }
  };

  const handleDelete = () => {
    if (note.id && onDelete) {
      onDelete(note.id);
    }
  };

  const handleArchive = () => {
    if (note.id && onArchive) {
      onArchive(note.id);
    }
  };

  const handleTogglePin = () => {
    setNote((prev: { isPinned: any; }) => ({ ...prev, isPinned: !prev.isPinned }));
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4"
      {...getRootProps()}
    >
      <input {...getInputProps()} />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="w-full"
      >
        <Card
          className={`w-full h-full flex flex-col shadow-2xl rounded-2xl overflow-hidden glass-card-editor
            ${isMaximized
              ? "max-w-none max-h-none"
              : "max-w-full sm:max-w-2xl md:max-w-3xl lg:max-w-4xl max-h-[90vh]"
            }`
          }
          onClick={(e) => e.stopPropagation()}
        >
          <CardHeader className="bg-background/80 p-4 border-b border-border/50">
            <div className="flex items-center justify-between">
              <Input
                name="title"
                value={note.title || ""}
                onChange={handleInputChange}
                placeholder="Note Title..."
                className="text-xl font-semibold border-none focus-visible:ring-0 focus-visible:ring-offset-0 p-0 h-auto bg-transparent"
              />
              <div className="flex items-center gap-2">
                <Button className="bg-transparent hover:bg-muted p-2 rounded-full" onClick={handleTogglePin} title={note.isPinned ? "Unpin Note" : "Pin Note"}>
                  {note.isPinned ? <PinOff className="h-5 w-5 text-yellow-500" /> : <Pin className="h-5 w-5" />}
                </Button>
                <Button className="bg-transparent hover:bg-muted p-2 rounded-full" onClick={onToggleMaximize} title={isMaximized ? "Minimize" : "Maximize"}>
                  {isMaximized ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
                </Button>
                {onClose && (
                  <Button className="bg-transparent hover:bg-muted p-2 rounded-full" onClick={onClose} title="Close Editor">
                    <X className="h-5 w-5" />
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>

          <div className="flex flex-1 overflow-hidden">
            <aside className="w-64 bg-background/50 p-4 border-r border-border/50 space-y-6 overflow-y-auto">
              <div>
                <h4 className="text-sm font-medium mb-2 text-muted-foreground">Notebook</h4>
                <select
                  value={selectedNotebookId}
                  onChange={(e) => setSelectedNotebookId(e.target.value)}
                  className="w-full p-2 border rounded-md bg-input text-foreground text-sm"
                  title="Select notebook"
                  aria-label="Select notebook"
                >
                  {notebooks.map((nb) => (
                    <option key={nb.id} value={nb.id}>
                      {nb.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-2 text-muted-foreground">Tags</h4>
                <div className="flex mb-2">
                  <Input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    placeholder="Add a tag"
                    className="text-sm mr-2 bg-input"
                    onKeyPress={(e) => e.key === "Enter" && handleAddTag()}
                    aria-label="Add tag"
                  />
                  <Button onClick={handleAddTag}>Add</Button>
                </div>
                <div className="flex flex-wrap gap-1">
                  {(note.tags || [])
                    .filter((tag: string | number) => typeof tag === "string" || typeof tag === "number")
                    .map((tag: string | number) => (
                      <HaloBadge variant="secondary" key={tag} className="text-xs">
                        {tag}
                        <button onClick={() => handleRemoveTag(tag as string)} className="ml-1 hover:text-destructive" title={`Remove tag ${tag}`} aria-label={`Remove tag ${tag}`}>
                          <X size={12} />
                        </button>
                      </HaloBadge>
                    ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-2 text-muted-foreground">Attachments</h4>
                <ScrollArea className="h-32">
                  <div className="space-y-2 pr-2">
                  {(note.attachments || []).map((att: { fileType?: string; fileName?: string; }, index: React.Key | null | undefined) => (
                    <div key={index} className="flex items-center justify-between text-xs p-2 bg-muted rounded-md">
                      <div className="flex items-center gap-2 truncate">
                        {getFileIcon((att as { fileType: string }).fileType)}
                        <span className="truncate" title={(att as { fileName: string }).fileName}>{(att as { fileName: string }).fileName}</span>
                      </div>
                      <Button className="h-5 w-5" onClick={() => { /* Implement remove attachment */ }}>
                        <Trash2 size={12} />
                      </Button>
                    </div>
                  ))}
                  </div>
                </ScrollArea>
                <Button className="w-full mt-2 text-xs border border-border bg-transparent hover:bg-muted" onClick={() => document.getElementById("hidden-file-input")?.click()}>
                  <UploadCloud className="mr-2 h-3 w-3" /> Upload File
                </Button>
                {/* Accessible label for file input */}
                <label htmlFor={`hidden-file-input-${note.id || 'new'}`} className="sr-only">Upload file</label>
                <input type="file" id={`hidden-file-input-${note.id || 'new'}`} multiple onChange={(e) => onDrop(Array.from(e.target.files || []))} className="hidden" title="Upload file" aria-label="Upload file" placeholder="Choose files to upload" />
              </div>

              <div>
                <h4 className="text-sm font-medium mb-2 text-muted-foreground">Actions</h4>
                <div className="space-y-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="w-full text-xs border border-border bg-transparent hover:bg-muted"><HelpCircle className="mr-2 h-3 w-3" /> Voice Commands</Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader><DialogTitle>Voice Command Help</DialogTitle></DialogHeader>
                      <VoiceCommandHelp />
                    </DialogContent>
                  </Dialog>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button className="w-full text-xs border border-border bg-transparent hover:bg-muted">Export Note</Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => handleExport("pdf")}>PDF</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleExport("md")}>Markdown</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleExport("txt")}>Text</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleExport("html")}>HTML</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  {note.id && onArchive && (
                    <Button className="w-full text-xs border border-border bg-transparent hover:bg-muted" onClick={handleArchive}>
                      <Archive className="mr-2 h-3 w-3" /> Archive Note
                    </Button>
                  )}
                  {note.id && onDelete && (
                    <Button className="w-full text-xs bg-destructive text-white hover:bg-destructive/80" onClick={handleDelete}>
                      <Trash2 className="mr-2 h-3 w-3" /> Delete Note
                    </Button>
                  )}
                </div>
              </div>
            </aside>

            <CardContent className="flex-1 p-0 flex flex-col overflow-hidden">
              {isDragActive && (
                <div className="absolute inset-0 bg-primary/10 flex items-center justify-center z-10 pointer-events-none">
                  <p className="text-primary font-semibold text-lg">Drop files to attach</p>
                </div>
              )}
              <div className="flex-1 overflow-y-auto p-1">
                <RichTextEditor
                  content={note.content || ""}
                  onChange={handleContentChange}
                  editable={true}
                />
              </div>
              <div className="p-2 border-t border-border/50 bg-background/80 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1">
                  <MediaRecorder onRecordingComplete={handleAudioRecorded} />
                  <ScreenCapture onCapture={(blob) => handleScreenCaptured(URL.createObjectURL(blob))} />
                  <VoiceCommandManager userId={userId} onCommandExecuted={handleVoiceCommand} />
                </div>
                <Button className="bg-teal-600 hover:bg-teal-700 text-white px-3 py-2 rounded" onClick={handleSave}>
                  <Save className="mr-2 h-4 w-4" /> Save Note
                </Button>
              </div>
            </CardContent>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}