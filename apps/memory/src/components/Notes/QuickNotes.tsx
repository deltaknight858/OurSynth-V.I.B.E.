import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { PlusCircle, Pin, Search, X, Maximize2, Zap } from 'lucide-react';
import { Note } from '@/services/noteService';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { QuickNotesMaximizeWrapper } from './QuickNotesMaximizeWrapper';

interface QuickNotesProps {
  notes: Note[];
  onNoteSelect: (noteId: string) => void;
  onQuickNoteCreate: (note: Partial<Note>) => Promise<void>;
  onNotePinToggle: (noteId: string) => Promise<void>;
  userId: string;
  notebookId: string;
}

export function QuickNotes({
  notes,
  onNoteSelect,
  onQuickNoteCreate,
  onNotePinToggle,
  userId,
  notebookId,
}: QuickNotesProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [newNoteTitle, setNewNoteTitle] = useState("");
  const [newNoteContent, setNewNoteContent] = useState("");
  const [note, setNote] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  
  const toggleMaximize = () => {
    setIsMaximized(!isMaximized);
  };

  const pinnedNotes = notes.filter((note) => note.isPinned);
  const recentNotes = notes
    .filter((note) => !note.isPinned)
    .sort((a, b) => {
      if (!a.lastModified && !b.lastModified) return 0;
      if (!a.lastModified) return 1;
      if (!b.lastModified) return -1;
      const dateA = a.lastModified ? new Date(a.lastModified).getTime() : 0;
      const dateB = b.lastModified ? new Date(b.lastModified).getTime() : 0;
      return dateB - dateA;
    })
    .slice(0, 5);

  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleQuickNoteCreate = async () => {
    if (!newNoteTitle.trim()) return;

    const newNote: Partial<Note> = {
      title: newNoteTitle,
      content: newNoteContent,
      userId,
      notebookId,
      tags: [],
      category: "quick-note",
      attachments: [],
    };

    await onQuickNoteCreate(newNote);
    setNewNoteTitle("");
    setNewNoteContent("");
    setIsCreating(false);
  };

  return (
    <QuickNotesMaximizeWrapper
      isPageMaximized={isMaximized}
      onPageMaximizeChange={toggleMaximize}
      title='Quick Notes'
    >
      <Card className='border-none shadow-md overflow-hidden bg-gradient-to-br from-primary/5 to-background'>
        <CardHeader className='pb-2'>
          <div className='flex justify-between items-center'>
            <CardTitle className='text-xl flex items-center gap-2'>
              <Zap className='h-5 w-5 text-yellow-500' />
              Quick Notes
            </CardTitle>
            <Button
              variant='ghost'
              size='sm'
              onClick={toggleMaximize}
              className='h-8 w-8 p-0'
            >
              <Maximize2 className='h-4 w-4' />
            </Button>
          </div>
          <CardDescription>
            Quickly capture your thoughts
          </CardDescription>
        </CardHeader>
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="fixed bottom-4 right-4 z-50 space-y-4"
        >
          <Sheet>
            <SheetTrigger asChild>
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Button
                  variant="default"
                  size="icon"
                  className="rounded-full h-12 w-12 shadow-lg"
                >
                  <PlusCircle className="h-6 w-6" />
                </Button>
              </motion.div>
            </SheetTrigger>
            <SheetContent side="right" className="w-[400px] sm:w-[540px]">
              <SheetHeader>
                <SheetTitle>Quick Notes</SheetTitle>
              </SheetHeader>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="mt-4 space-y-4"
              >
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search all notes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>

                <AnimatePresence mode="wait">
                  {searchTerm ? (
                    <ScrollArea className="h-[500px]">
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="space-y-2"
                      >
                        {filteredNotes.map((note, index) => (
                          <motion.div
                            key={note.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                          >
                            <Card
                              className="cursor-pointer hover:bg-muted/50 transition-colors"
                              onClick={() => onNoteSelect(note.id!)}
                            >
                              <CardContent className="p-3">
                                <div className="flex justify-between items-start">
                                  <h3 className="font-medium">{note.title}</h3>
                                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        onNotePinToggle(note.id!);
                                      }}
                                    >
                                      <Pin
                                        className={`h-4 w-4 ${
                                          note.isPinned ? "fill-current" : ""
                                        }`}
                                      />
                                    </Button>
                                  </motion.div>
                                </div>
                                <p className="text-sm text-muted-foreground line-clamp-2">
                                  {note.content}
                                </p>
                              </CardContent>
                            </Card>
                          </motion.div>
                        ))}
                      </motion.div>
                    </ScrollArea>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <AnimatePresence mode="wait">
                        {isCreating ? (
                          <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                          >
                            <Card>
                              <CardContent className="p-3 space-y-3">
                                <div className="flex justify-between items-center">
                                  <Input
                                    placeholder="Note title..."
                                    value={newNoteTitle}
                                    onChange={(e) => setNewNoteTitle(e.target.value)}
                                    className="border-0 bg-transparent px-0 text-lg font-medium"
                                  />
                                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => setIsCreating(false)}
                                    >
                                      <X className="h-4 w-4" />
                                    </Button>
                                  </motion.div>
                                </div>
                                <Textarea
                                  placeholder="Start writing..."
                                  value={newNoteContent}
                                  onChange={(e) => setNewNoteContent(e.target.value)}
                                  className="border-0 bg-transparent resize-none"
                                  rows={4}
                                />
                                <motion.div
                                  className="flex justify-end"
                                  whileHover={{ scale: 1.02 }}
                                >
                                  <Button onClick={handleQuickNoteCreate}>Save</Button>
                                </motion.div>
                              </CardContent>
                            </Card>
                          </motion.div>
                        ) : (
                          <motion.div whileHover={{ scale: 1.02 }}>
                            <Button
                              variant="outline"
                              className="w-full"
                              onClick={() => setIsCreating(true)}
                            >
                              <PlusCircle className="mr-2 h-4 w-4" />
                              New Quick Note
                            </Button>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {pinnedNotes.length > 0 && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="space-y-2 mt-4"
                        >
                          <h3 className="font-medium flex items-center gap-2">
                            <Pin className="h-4 w-4" />
                            Pinned Notes
                          </h3>
                          {pinnedNotes.map((note, index) => (
                            <motion.div
                              key={note.id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.05 }}
                            >
                              <Card
                                className="cursor-pointer hover:bg-muted/50 transition-colors"
                                onClick={() => onNoteSelect(note.id!)}
                              >
                                <CardContent className="p-3">
                                  <div className="flex justify-between items-start">
                                    <h3 className="font-medium">{note.title}</h3>
                                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          onNotePinToggle(note.id!);
                                        }}
                                      >
                                        <Pin className="h-4 w-4 fill-current" />
                                      </Button>
                                    </motion.div>
                                  </div>
                                  <p className="text-sm text-muted-foreground line-clamp-2">
                                    {note.content}
                                  </p>
                                </CardContent>
                              </Card>
                            </motion.div>
                          ))}
                        </motion.div>
                      )}

                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="space-y-2 mt-4"
                      >
                        <h3 className="font-medium">Recent Notes</h3>
                        {recentNotes.map((note, index) => (
                          <motion.div
                            key={note.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                          >
                            <Card
                              className="cursor-pointer hover:bg-muted/50 transition-colors"
                              onClick={() => onNoteSelect(note.id!)}
                            >
                              <CardContent className="p-3">
                                <div className="flex justify-between items-start">
                                  <h3 className="font-medium">{note.title}</h3>
                                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        onNotePinToggle(note.id!);
                                      }}
                                    >
                                      <Pin
                                        className={`h-4 w-4 ${
                                          note.isPinned ? "fill-current" : ""
                                        }`}
                                      />
                                    </Button>
                                  </motion.div>
                                </div>
                                <p className="text-sm text-muted-foreground line-clamp-2">
                                  {note.content}
                                </p>
                              </CardContent>
                            </Card>
                          </motion.div>
                        ))}
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </SheetContent>
          </Sheet>
        </motion.div>
      </Card>
    </QuickNotesMaximizeWrapper>
  );
}