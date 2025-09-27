import { useEffect, useState } from "react";
import NoteEditor from "@/components/Editor/NoteEditor";
import { EditorMaximizeWrapper } from '@/components/Editor/EditorMaximizeWrapper';
import { MindMap } from "@/components/MindMap/MindMap";
import { NoteList } from "@/components/Notes/NoteList";
import { QuickNotes } from "@/components/Notes/QuickNotes";
import { NotebookSelector } from "@/components/Notebook/NotebookSelector";
import { Note, noteService } from "@/services/noteService";
import { Notebook, notebookService } from "@/services/notebookService";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle, Info, BookOpen, AlertCircle, Maximize2, Minimize2, UserPlus, LogIn } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { PageLayout } from "@/components/Layout/PageLayout";
import { useRouter } from "next/router";
import { RecentNotesTimeline } from "@/components/Notes/RecentNotesTimeline";
import { motion, AnimatePresence } from "framer-motion";
import { Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/components/ui/use-toast";

// Demo data for unauthenticated users
const demoNotebooks: Notebook[] = [
  {
    id: "demo-1",
    title: "Personal Notes",
    description: "My personal thoughts and ideas",
    color: "#3b82f6",
    userId: "demo",
    createdAt: new Date(),
    lastModified: new Date()
  },
  {
    id: "demo-2", 
    title: "Work Projects",
    description: "Project notes and meeting minutes",
    color: "#10b981",
    userId: "demo",
    createdAt: new Date(),
    lastModified: new Date()
  }
];

const demoNotes: Note[] = [
  {
    id: "demo-note-1",
    title: "Welcome to NoteFlow",
    content: "This is a demo note to show you how NoteFlow works. You can create, edit, and organize your notes easily.",
    notebookId: "demo-1",
    userId: "demo",
    createdAt: new Date(),
    lastModified: new Date(),
    tags: ["demo", "welcome"],
    isPinned: true
  },
  {
    id: "demo-note-2",
    title: "Meeting Notes Template",
    content: `# Meeting Notes

**Date:** 
**Attendees:** 
**Agenda:** 

## Discussion Points

## Action Items

## Next Steps`,
    notebookId: "demo-2",
    userId: "demo",
    createdAt: new Date(),
    lastModified: new Date(),
    tags: ["template", "meetings"]
  }
];

export default function NotesPage() {
  const { user, loading: authLoading, signInAnonymously } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [notes, setNotes] = useState<Note[]>([]);
  const [notebooks, setNotebooks] = useState<Notebook[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [selectedNotebookId, setSelectedNotebookId] = useState<string>();
  const [view, setView] = useState<"editor" | "mindmap">("editor");
  const [isMaximized, setIsMaximized] = useState(false);
  const [guestLoading, setGuestLoading] = useState(false);
  const [activeView, setActiveView] = useState<"editor" | "mindmap">("editor"); // Keep this if used for tab switching
  const [isMindMapMaximized, setIsMindMapMaximized] = useState(false); // Keep this for MindMap's own maximize
  const userId = user?.id || "demo";

  // Don't redirect unauthenticated users anymore - let them explore
  useEffect(() => {
    if (!authLoading && !user) {
      // Show demo data for unauthenticated users
      setNotebooks(demoNotebooks);
      setNotes(demoNotes);
      setSelectedNotebookId(demoNotebooks[0].id);
      return;
    }
  }, [user, authLoading]);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return; // Skip if no user (demo mode)
      
      try {
        const userNotebooks = await notebookService.getNotebooksByUser(userId);
        setNotebooks(userNotebooks);
        
        const { notebook: notebookIdFromUrl } = router.query;
        
        if (notebookIdFromUrl && typeof notebookIdFromUrl === "string") {
          const notebookExists = userNotebooks.some(nb => nb.id === notebookIdFromUrl);
          if (notebookExists) {
            setSelectedNotebookId(notebookIdFromUrl);
          } else if (userNotebooks.length > 0) {
            setSelectedNotebookId(userNotebooks[0].id);
          }
        } else if (userNotebooks.length > 0 && !selectedNotebookId) {
          setSelectedNotebookId(userNotebooks[0].id);
        }
      } catch (error) {
        console.error("Error fetching notebooks:", error);
      }
    };

    if (user && userId !== "demo") {
      fetchData();
    }
  }, [userId, router.query, selectedNotebookId, user]);

  useEffect(() => {
    const fetchNotes = async () => {
      if (!user || !selectedNotebookId) return; // Skip if no user (demo mode)
      
      try {
        const notebookNotes = await noteService.getNotesByNotebook(selectedNotebookId);
        setNotes(notebookNotes);
      } catch (error) {
        console.error("Error fetching notes:", error);
      }
    };

    if (user && selectedNotebookId && selectedNotebookId !== "demo-1" && selectedNotebookId !== "demo-2") {
      fetchNotes();
    } else if (!user && selectedNotebookId) {
      // Filter demo notes by selected notebook
      const filteredNotes = demoNotes.filter(note => note.notebookId === selectedNotebookId);
      setNotes(filteredNotes);
    }
  }, [user, selectedNotebookId]);

  const handleGuestSignUp = async () => {
    setGuestLoading(true);
    try {
      const { error } = await signInAnonymously();
      if (error) {
        toast({
          title: "Error",
          description: "Failed to create guest session. Please try again.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Welcome!",
          description: "You're now signed in as a guest. Start creating your notes!",
        });
      }
    } catch (error) {
      toast({
        title: "Error", 
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setGuestLoading(false);
    }
  };

  const handleNewNote = () => {
    if (!user) {
      toast({
        title: "Sign up to create notes",
        description: "Create a guest account to start taking notes",
        action: (
          <Button onClick={handleGuestSignUp} disabled={guestLoading}>
            {guestLoading ? "Creating..." : "Try as Guest"}
          </Button>
        ),
      });
      return;
    }
    setSelectedNote(null);
    setView("editor");
  };

  const handleNoteSelect = async (noteId: string) => {
    const note = notes.find((n) => n.id === noteId);
    if (note) {
      setSelectedNote(note);
      setView("editor");
    }
  };

  const handleNoteSave = (savedNote: Partial<Note>) => {
    if (!user) {
      toast({
        title: "Sign up to save notes",
        description: "Create an account to save your work",
        action: (
          <Button onClick={handleGuestSignUp} disabled={guestLoading}>
            {guestLoading ? "Creating..." : "Try as Guest"}
          </Button>
        ),
      });
      return;
    }
    
    if (savedNote.id) {
      setNotes((prevNotes) => {
        const noteIndex = prevNotes.findIndex((n) => n.id === savedNote.id);
        if (noteIndex >= 0) {
          const updatedNotes = [...prevNotes];
          updatedNotes[noteIndex] = savedNote as Note;
          return updatedNotes;
        }
        return [...prevNotes, savedNote as Note];
      });
    }
  };

  const handleQuickNoteCreate = async (note: Partial<Note>) => {
    if (!user) {
      toast({
        title: "Sign up to create notes",
        description: "Create an account to save your notes",
        action: (
          <Button onClick={handleGuestSignUp} disabled={guestLoading}>
            {guestLoading ? "Creating..." : "Try as Guest"}
          </Button>
        ),
      });
      return;
    }
    
    try {
      const noteId = await noteService.createNote(note as Omit<Note, "id" | "lastModified">);
      const newNote = { ...note, id: noteId } as Note;
      setNotes(prev => [...prev, newNote]);
      setSelectedNote(newNote);
      setView("editor");
    } catch (error) {
      console.error("Error creating quick note:", error);
    }
  };

  const handleNotePinToggle = async (noteId: string) => {
    if (!user) {
      toast({
        title: "Sign up to organize notes",
        description: "Create an account to pin and organize your notes",
        action: (
          <Button onClick={handleGuestSignUp} disabled={guestLoading}>
            {guestLoading ? "Creating..." : "Try as Guest"}
          </Button>
        ),
      });
      return;
    }
    
    try {
      await noteService.toggleNotePin(noteId);
      const updatedNotes = notes.map(note =>
        note.id === noteId ? { ...note, isPinned: !note.isPinned } : note
      );
      setNotes(updatedNotes);
    } catch (error) {
      console.error("Error toggling note pin:", error);
    }
  };

  const handleNotebookCreate = (notebook: Notebook) => {
    if (!user) {
      toast({
        title: "Sign up to create notebooks",
        description: "Create an account to organize your notes in notebooks",
        action: (
          <Button onClick={handleGuestSignUp} disabled={guestLoading}>
            {guestLoading ? "Creating..." : "Try as Guest"}
          </Button>
        ),
      });
      return;
    }
    setNotebooks(prev => [...prev, notebook]);
    setSelectedNotebookId(notebook.id);
  };

  const toggleMaximize = () => {
    setIsMaximized(!isMaximized);
  };

  const toggleMindMapMaximize = () => { // This is for the MindMap component's internal maximize
    setIsMindMapMaximized(!isMindMapMaximized);
  };

  if (authLoading) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <AnimatePresence>
        <motion.div
          className={`container mx-auto p-4 ${isMaximized ? 'h-screen fixed inset-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60' : ''}`}
          initial={false}
          animate={isMaximized ? { scale: 1 } : { scale: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {!user && !isMaximized && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <Alert className="bg-teal-500/10 border-teal-500/20">
                <Info className="h-4 w-4 text-teal-500" />
                <AlertDescription className="text-teal-700 dark:text-teal-300">
                  You&apos;re viewing a demo of NoteFlow. 
                  <Button 
                    variant="link" 
                    className="p-0 h-auto ml-1 text-teal-600 hover:text-teal-500"
                    onClick={handleGuestSignUp}
                    disabled={guestLoading}
                  >
                    {guestLoading ? "Creating guest account..." : "Try as guest"}
                  </Button>
                  {" "}or{" "}
                  <Button 
                    variant="link" 
                    className="p-0 h-auto text-teal-600 hover:text-teal-500"
                    onClick={() => router.push("/auth/register")}
                  >
                    create an account
                  </Button>
                  {" "}to save your work.
                </AlertDescription>
              </Alert>
            </motion.div>
          )}

          {!isMaximized && (
            <>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-6"
              >
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                  <div className="flex items-center gap-4">
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
                      {user ? "My Notes" : "NoteFlow Demo"}
                    </h1>
                    <NotebookSelector
                      notebooks={notebooks}
                      selectedNotebookId={selectedNotebookId}
                      onNotebookSelect={setSelectedNotebookId}
                      onNotebookCreate={handleNotebookCreate}
                      userId={userId}
                    />
                  </div>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div>
                          <Button 
                            onClick={handleNewNote} 
                            disabled={!selectedNotebookId}
                            className="w-full md:w-auto"
                            size="lg"
                          >
                            <PlusCircle className="mr-2" size={18} />
                            {user ? "Create New Note" : "Try Creating Note"}
                          </Button>
                        </div>
                      </TooltipTrigger>
                      {!selectedNotebookId && (
                        <TooltipContent>
                          <p>Select a notebook first to create notes</p>
                        </TooltipContent>
                      )}
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </motion.div>

              {user && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  <Card className="mb-6 overflow-hidden border-none bg-gradient-to-r from-primary/5 to-secondary/5 shadow-md">
                    <CardContent className="p-4">
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="flex items-center gap-2 mb-3">
                          <Clock size={18} className="text-primary" />
                          <h2 className="text-lg font-medium">Recent Note History</h2>
                        </div>
                        <RecentNotesTimeline 
                          notebooks={notebooks}
                          userId={userId}
                          onNoteSelect={handleNoteSelect}
                          currentNotebookId={selectedNotebookId}
                        />
                      </motion.div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </>
          )}

          {selectedNotebookId ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className={`grid ${isMaximized ? '' : 'grid-cols-1 lg:grid-cols-12'} gap-6`}
            >
              {!isMaximized && (
                <div className='lg:col-span-3'>
                  <NoteList
                    notes={notes}
                    onNoteSelect={handleNoteSelect}
                    selectedNoteId={selectedNote?.id}
                  />
                </div>
              )}
              <div className={isMaximized ? 'w-full h-full' : 'lg:col-span-9'}>
                <Card className='border-none shadow-md bg-gradient-to-b from-background to-background/80 backdrop-blur-sm'>
                  <CardContent className='p-4'>
                    <div className='flex justify-between items-center mb-4'>
                      <Tabs value={view} onValueChange={(v) => setView(v as 'editor' | 'mindmap')} className='w-full'>
                        <div className='flex justify-between items-center'>
                          <TabsList>
                            <TabsTrigger value='editor'>Editor</TabsTrigger>
                            <TabsTrigger value='mindmap'>Mind Map</TabsTrigger>
                          </TabsList>
                          {view === 'editor' && (
                            <Button
                              variant='ghost'
                              size='sm'
                              onClick={toggleMaximize}
                              className='ml-4'
                            >
                              {isMaximized ? (
                                <Minimize2 className='h-4 w-4' />
                              ) : (
                                <Maximize2 className='h-4 w-4' />
                              )}
                            </Button>
                          )}
                        </div>
                        <TabsContent value='editor' className={isMaximized ? 'h-[calc(100vh-200px)]' : ''}>
                          <EditorMaximizeWrapper
                            isPageMaximized={isMaximized}
                            onPageMaximizeChange={toggleMaximize}
                            title='Note Editor'
                          >
                            <NoteEditor 
                              userId={userId}
                              initialNote={selectedNote}
                              notebooks={notebooks}
                              currentNotebookId={selectedNotebookId || ""}
                              onSave={handleNoteSave}
                              isMaximized={isMaximized}
                              onToggleMaximize={toggleMaximize}
                            />
                          </EditorMaximizeWrapper>
                        </TabsContent>
                        <TabsContent value='mindmap' className={view === 'mindmap' ? 'h-[600px]' : ''}>
                          {selectedNote && ( /* Ensure selectedNote exists before rendering MindMap */
                            <MindMap 
                              key={selectedNote.id} // Ensure re-render on note change
                              initialNodes={[]} // MindMap fetches its own nodes based on noteId
                              initialEdges={[]} // MindMap fetches its own edges
                              noteId={selectedNote.id!} // Pass the ID of the selected note
                              onClose={() => setView("editor")} // Example: switch back to editor view
                              isMaximized={isMindMapMaximized} // Use MindMap's own maximize state
                              onToggleMaximize={toggleMindMapMaximize} // Pass the toggle for MindMap's maximize
                              // collaborationId={selectedNote.id} // Example, if using note ID for collab
                            />
                          )}
                        </TabsContent>
                      </Tabs>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-col items-center justify-center py-12 text-center"
            >
              <div className="max-w-md mx-auto">
                <BookOpen className="h-16 w-16 mx-auto mb-4 text-primary/40" />
                <h2 className="text-2xl font-bold mb-2">Get Started with Notes</h2>
                <p className="text-muted-foreground mb-6">
                  {user 
                    ? "Select an existing notebook or create a new one to start taking notes"
                    : "This is how NoteFlow organizes your notes. Sign up to create your own notebooks!"
                  }
                </p>
                
                <Alert variant="default" className="mb-4 bg-primary/5 border-primary/20">
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    {user 
                      ? "Your notebooks help organize different types of notes. Create one to get started!"
                      : "Notebooks help you organize different types of notes. Try creating an account to get started!"
                    }
                  </AlertDescription>
                </Alert>
                
                {!user && (
                  <div className="flex flex-col sm:flex-row gap-3 justify-center mb-4">
                    <Button onClick={handleGuestSignUp} disabled={guestLoading}>
                      <UserPlus className="mr-2 h-4 w-4" />
                      {guestLoading ? "Creating..." : "Try as Guest"}
                    </Button>
                    <Button variant="outline" onClick={() => router.push("/auth/register")}>
                      <LogIn className="mr-2 h-4 w-4" />
                      Create Account
                    </Button>
                  </div>
                )}
                
                {notebooks.length > 0 && (
                  <div className="grid grid-cols-2 gap-4">
                    {notebooks.slice(0, 4).map(notebook => (
                      <motion.div
                        key={notebook.id}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Card 
                          className="cursor-pointer h-full"
                          onClick={() => setSelectedNotebookId(notebook.id)}
                        >
                          <CardContent className="p-4 flex flex-col items-center justify-center text-center h-full">
                            <div 
                              className="w-3 h-3 rounded-full mb-2"
                              style={{ backgroundColor: notebook.color }}
                            />
                            <h3 className="font-medium text-sm">{notebook.title}</h3>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {selectedNotebookId && !isMaximized && user && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <QuickNotes
                notes={notes}
                onNoteSelect={handleNoteSelect}
                onQuickNoteCreate={handleQuickNoteCreate}
                onNotePinToggle={handleNotePinToggle}
                userId={userId}
                notebookId={selectedNotebookId}
              />
            </motion.div>
          )}

          {/* This section for activeView seems redundant if Tabs are used, but keeping logic if it's intended for a different full-page MindMap view */}
          {activeView === "mindmap" && selectedNote && !isMaximized && ( /* Added !isMaximized to avoid conflict with page-level maximize */
            <motion.div
              key="mindmap-full-view" // Different key if this is a separate instance
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`transition-all duration-300 ease-in-out ${
                isMindMapMaximized ? "fixed inset-0 z-50 bg-background" : "relative mt-6" // Added mt-6 for spacing
              }`}
            >
              <MindMap
                key={`full-${selectedNote.id}`} 
                initialNodes={[]} 
                initialEdges={[]} 
                noteId={selectedNote.id!}
                onClose={() => setActiveView("editor")} 
                isMaximized={isMindMapMaximized}
                onToggleMaximize={toggleMindMapMaximize}
              />
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </PageLayout>
  );
}
