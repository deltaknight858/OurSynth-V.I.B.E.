import { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Search as SearchIcon, Calendar, Tag, SortAsc, Pin, FileText, 
  List, Rows, Star, Clock, BookOpen, Filter, ChevronDown, ChevronUp,
  Calendar as CalendarIcon, Bookmark, Edit, Heart, ChevronRight
} from "lucide-react";
import { Note, noteService } from "@/services/noteService"; // Assuming noteService is correctly imported
import { Notebook, notebookService } from "@/services/notebookService"; // Assuming notebookService is correctly imported
import { useAuth } from "@/contexts/AuthContext"; // Assuming useAuth is correctly imported
import { useToast } from "@/components/ui/use-toast"; // Assuming useToast is correctly imported

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Kbd } from '@/components/ui/kbd';
import { formatDistanceToNow } from 'date-fns';

interface NoteListProps {
  notes: Note[];
  onNoteSelect: (noteId: string) => void;
  selectedNoteId?: string;
  // Add other props if they are passed from parent, e.g., recentlyViewed from a prop
  recentlyViewedProp?: Note[]; 
}

export function NoteList({ notes: initialNotes, onNoteSelect, selectedNoteId, recentlyViewedProp }: NoteListProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [notes, setNotes] = useState<Note[]>(initialNotes);
  const [allNotes, setAllNotes] = useState<Note[]>(initialNotes); // Initialize with prop or fetch
  const [notebooks, setNotebooks] = useState<Notebook[]>([]); // Initialize or fetch
  const [pinnedNotes, setPinnedNotes] = useState<Note[]>([]);
  const [favoriteNotes, setFavoriteNotes] = useState<Note[]>([]);
  const [recentlyViewedNotes, setRecentlyViewedNotes] = useState<Note[]>(recentlyViewedProp || []);


  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('');
  const [sortBy, setSortBy] = useState<'date' | 'title' | 'pinned' | 'favorites'>('date');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [filter, setFilter] = useState<'all' | 'pinned' | 'recent' | 'favorites'>('all');
  const [groupBy, setGroupBy] = useState<'none' | 'date' | 'tags'>('none');
  const [showRecentlyEdited, setShowRecentlyEdited] = useState(true);
  const [favorites, setFavorites] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('favoriteNotes');
      return stored ? JSON.parse(stored) : [];
    }
    return [];
  });
  const [keyboardShortcutsVisible, setKeyboardShortcutsVisible] = useState(false);
  const [loadingNotes, setLoadingNotes] = useState(false); // Added loading state
  const [currentSelectedNotebookId, setSelectedNotebookId] = useState<string | undefined>(undefined);


  const allTags = Array.from(new Set(notes.flatMap(note => note.tags || [])));
  
  // Track recently viewed notes in session storage
  const [recentlyViewed, setRecentlyViewedState] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      const stored = sessionStorage.getItem('recentlyViewedNotes');
      return stored ? JSON.parse(stored) : [];
    }
    return [];
  });
  
  // Update recently viewed when a note is selected
  useEffect(() => {
    if (selectedNoteId && typeof window !== 'undefined') {
      const updated = [
        selectedNoteId,
        ...recentlyViewed.filter(id => id !== selectedNoteId)
      ].slice(0, 10);
      
      setRecentlyViewedState(updated);
      sessionStorage.setItem('recentlyViewedNotes', JSON.stringify(updated));
    }
  }, [selectedNoteId, recentlyViewed]);

  // Toggle favorite status of a note
  const toggleFavorite = useCallback((e: React.MouseEvent, noteId: string) => {
    e.stopPropagation(); // Prevent note selection when clicking favorite icon
    
    setFavorites(prev => {
      const isFavorite = prev.includes(noteId);
      const updated = isFavorite
        ? prev.filter(id => id !== noteId)
        : [...prev, noteId];
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('favoriteNotes', JSON.stringify(updated));
      }
      
      return updated;
    });
  }, []);

  // Apply filters to notes - memoized for performance
  const filteredNotes = useMemo(() => {
    return notes.filter(note => {
      const matchesSearch = 
        note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (note.tags && note.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())));
      
      const matchesTag = !selectedTag || (note.tags && note.tags.includes(selectedTag));
      
      const matchesFilter = 
        filter === 'all' ? true :
        filter === 'pinned' ? note.isPinned :
        filter === 'recent' ? recentlyViewed.includes(note.id!) :
        filter === 'favorites' ? favorites.includes(note.id!) :
        true;
      
      return matchesSearch && matchesTag && matchesFilter;
    });
  }, [notes, searchTerm, selectedTag, filter, recentlyViewed, favorites]);

  // Get recently edited notes
  const recentlyEditedNotes = useMemo(() => {
    if (!showRecentlyEdited) return [];
    
    return [...notes]
      .filter(note => note.lastModified) // Filter out notes without dates
      .sort((a, b) => {
        const dateA = new Date(a.lastModified!).getTime();
        const dateB = new Date(b.lastModified!).getTime();
        return dateB - dateA;
      })
      .slice(0, 3);
  }, [notes, showRecentlyEdited]);

  // Sort notes based on selected sort option
  const sortedNotes = filteredNotes.sort((a, b) => {
    if (!a.lastModified && !b.lastModified) return 0;
    if (!a.lastModified) return 1;
    if (!b.lastModified) return -1;
    return new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime();
  });

  // Group notes by selected grouping option
  const groupedNotes = useMemo(() => {
    if (groupBy === 'none') {
      return { 'All Notes': sortedNotes };
    } else if (groupBy === 'date') {
      return sortedNotes.reduce<Record<string, Note[]>>((groups, note) => {
        // Handle undefined lastModified
        const date = note.lastModified 
          ? new Date(note.lastModified).toLocaleDateString(undefined, {
              month: 'short',
              day: 'numeric'
            })
          : 'Undated';
          
        if (!groups[date]) {
          groups[date] = [];
        }
        groups[date].push(note);
        return groups;
      }, {});
    } else if (groupBy === 'tags') {
      const tagged = sortedNotes.reduce<Record<string, Note[]>>((groups, note) => {
        if (note.tags && note.tags.length > 0) {
          note.tags.forEach(tag => {
            if (!groups[tag]) {
              groups[tag] = [];
            }
            if (!groups[tag].some(n => n.id === note.id)) {
              groups[tag].push(note);
            }
          });
        }
        return groups;
      }, {});
      
      // Add a group for notes without tags
      const untagged = sortedNotes.filter(note => !note.tags || note.tags.length === 0);
      if (untagged.length > 0) {
        tagged['Untagged'] = untagged;
      }
      
      return tagged;
    }
    
    return { 'All Notes': sortedNotes };
  }, [sortedNotes, groupBy]);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent, noteId: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onNoteSelect(noteId);
    }
  };

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in input fields
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      
      // Ctrl/Cmd + F for search focus
      if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        e.preventDefault();
        const searchInput = document.querySelector('input[placeholder="Search notes..."]') as HTMLInputElement;
        if (searchInput) {
          searchInput.focus();
        }
      }
      
      // Ctrl/Cmd + P to toggle pinned filter
      if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
        e.preventDefault();
        setFilter(prev => prev === 'pinned' ? 'all' : 'pinned');
      }
      
      // Ctrl/Cmd + H to toggle favorites filter
      if ((e.ctrlKey || e.metaKey) && e.key === 'h') {
        e.preventDefault();
        setFilter(prev => prev === 'favorites' ? 'all' : 'favorites');
      }
      
      // Ctrl/Cmd + R to toggle recent filter
      if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
        e.preventDefault();
        setFilter(prev => prev === 'recent' ? 'all' : 'recent');
      }
      
      // ? to toggle keyboard shortcuts help
      if (e.key === '?' && !e.ctrlKey && !e.metaKey && !e.altKey && !e.shiftKey) {
        e.preventDefault();
        setKeyboardShortcutsVisible(prev => !prev);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    const fetchInitialNotes = async () => {
      if (user) {
        try {
          setLoadingNotes(true);
          const userNotebooks = await notebookService.getNotebooksByUser(user.id);
          setNotebooks(userNotebooks);

          if (userNotebooks.length > 0) {
            const initialSelectedNotebookIdToUse = currentSelectedNotebookId || userNotebooks[0].id!;
            if (!currentSelectedNotebookId) {
              setSelectedNotebookId(initialSelectedNotebookIdToUse);
            }
            const notesForNotebook = await noteService.getNotesByNotebook(initialSelectedNotebookIdToUse);
            setNotes(notesForNotebook);

            // Fetch all notes for search and other categorizations
            const allNotesPromises = userNotebooks.map(nb => noteService.getNotesByNotebook(nb.id!));
            const notesArrays = await Promise.all(allNotesPromises);
            const allUserNotesData = notesArrays.flat();
            setAllNotes(allUserNotesData);
            // setFilteredNotes(allUserNotesData); // Initialize filtered notes - This was causing issues, filteredNotes is derived

            // Initialize pinned, favorite, recently viewed from all notes
            setPinnedNotes(allUserNotesData.filter(note => note.isPinned));

            const storedFavorites = localStorage.getItem("favoriteNotes");
            const favoriteIds = storedFavorites ? JSON.parse(storedFavorites) : [];
            setFavoriteNotes(allUserNotesData.filter(note => favoriteIds.includes(note.id!)));
            
            // Update recentlyViewed state based on the prop or session storage
            const sessionRecentlyViewedIds = recentlyViewed; // from state updated by session storage
            setRecentlyViewedNotes(allUserNotesData.filter(note => sessionRecentlyViewedIds.includes(note.id!))
              .sort((a, b) => sessionRecentlyViewedIds.indexOf(a.id!) - sessionRecentlyViewedIds.indexOf(b.id!))
            );


          } else {
            setNotes([]);
            setAllNotes([]);
            // setFilteredNotes([]);
          }
        } catch (err) {
          console.error("Error fetching initial notes:", err);
          toast({ title: "Error", description: "Failed to load notes.", variant: "destructive" });
        } finally {
          setLoadingNotes(false);
        }
      }
    };
    fetchInitialNotes();
  }, [user, toast, currentSelectedNotebookId, recentlyViewed]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in input fields
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      
      // Ctrl/Cmd + F for search focus
      if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        e.preventDefault();
        const searchInput = document.querySelector('input[placeholder="Search notes..."]') as HTMLInputElement;
        if (searchInput) {
          searchInput.focus();
        }
      }
      
      // Ctrl/Cmd + P to toggle pinned filter
      if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
        e.preventDefault();
        setFilter(prev => prev === 'pinned' ? 'all' : 'pinned');
      }
      
      // Ctrl/Cmd + H to toggle favorites filter
      if ((e.ctrlKey || e.metaKey) && e.key === 'h') {
        e.preventDefault();
        setFilter(prev => prev === 'favorites' ? 'all' : 'favorites');
      }
      
      // Ctrl/Cmd + R to toggle recent filter
      if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
        e.preventDefault();
        setFilter(prev => prev === 'recent' ? 'all' : 'recent');
      }
      
      // ? to toggle keyboard shortcuts help
      if (e.key === '?' && !e.ctrlKey && !e.metaKey && !e.altKey && !e.shiftKey) {
        e.preventDefault();
        setKeyboardShortcutsVisible(prev => !prev);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className='h-full relative'
    >
      <Card className='h-full border-none shadow-md bg-gradient-to-b from-background to-background/80 backdrop-blur-sm'>
        <CardHeader className='p-3 pb-0'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-2'>
              <CardTitle className='text-lg font-medium'>Your Notes</CardTitle>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant='ghost'
                      size='sm'
                      className='h-6 w-6 p-0 rounded-full'
                      onClick={() => setKeyboardShortcutsVisible(true)}
                    >
                      <span className='text-xs text-muted-foreground'>?</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side='bottom'>
                    <p>Keyboard shortcuts</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className='flex items-center gap-1'>
              <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as 'list' | 'grid')}>
                <TabsList className='h-8'>
                  <TabsTrigger value='list' className='px-2 h-7'>
                    <List className='h-4 w-4' />
                  </TabsTrigger>
                  <TabsTrigger value='grid' className='px-2 h-7'>
                    <Rows className='h-4 w-4' />
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className='p-3 space-y-3'>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className='flex gap-2'
          >
            <div className='relative flex-1'>
              <SearchIcon className='absolute left-2 top-2.5 h-4 w-4 text-muted-foreground' />
              <Input
                placeholder='Search notes...'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className='pl-8 h-9'
              />
            </div>
            <Select value={sortBy} onValueChange={(value: 'date' | 'title' | 'pinned' | 'favorites') => setSortBy(value)}>
              <SelectTrigger className='w-[120px] h-9'>
                <SelectValue placeholder='Sort by' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='pinned'>
                  <span className='flex items-center gap-2'>
                    <Pin className='h-4 w-4' />
                    Pinned
                  </span>
                </SelectItem>
                <SelectItem value='favorites'>
                  <span className='flex items-center gap-2'>
                    <Heart className='h-4 w-4' />
                    Favorites
                  </span>
                </SelectItem>
                <SelectItem value='date'>
                  <span className='flex items-center gap-2'>
                    <Calendar className='h-4 w-4' />
                    Date
                  </span>
                </SelectItem>
                <SelectItem value='title'>
                  <span className='flex items-center gap-2'>
                    <SortAsc className='h-4 w-4' />
                    Title
                  </span>
                </SelectItem>
              </SelectContent>
            </Select>
          </motion.div>

          {/* Keyboard shortcuts dialog */}
          {keyboardShortcutsVisible && (
            <div className='fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center'
                 onClick={() => setKeyboardShortcutsVisible(false)}>
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className='bg-card border rounded-lg shadow-lg p-4 max-w-md w-full'
                onClick={(e) => e.stopPropagation()}
              >
                <div className='flex justify-between items-center mb-4'>
                  <h3 className='text-lg font-medium'>Keyboard Shortcuts</h3>
                  <Button
                    variant='ghost'
                    size='sm'
                    className='h-6 w-6 p-0 rounded-full'
                    onClick={() => setKeyboardShortcutsVisible(false)}
                  >
                    &times;
                  </Button>
                </div>
                <div className='space-y-2'>
                  <div className='flex justify-between'>
                    <span>Focus search</span>
                    <div>
                      <Kbd>Ctrl</Kbd> + <Kbd>F</Kbd>
                    </div>
                  </div>
                  <div className='flex justify-between'>
                    <span>Toggle pinned filter</span>
                    <div>
                      <Kbd>Ctrl</Kbd> + <Kbd>P</Kbd>
                    </div>
                  </div>
                  <div className='flex justify-between'>
                    <span>Toggle favorites filter</span>
                    <div>
                      <Kbd>Ctrl</Kbd> + <Kbd>H</Kbd>
                    </div>
                  </div>
                  <div className='flex justify-between'>
                    <span>Toggle recent filter</span>
                    <div>
                      <Kbd>Ctrl</Kbd> + <Kbd>R</Kbd>
                    </div>
                  </div>
                  <div className='flex justify-between'>
                    <span>Show this help</span>
                    <div>
                      <Kbd>?</Kbd>
                    </div>
                  </div>
                </div>
                <div className='mt-4 text-xs text-muted-foreground text-center'>
                  Tip: On Mac, use <Kbd>⌘</Kbd> instead of <Kbd>Ctrl</Kbd>
                </div>
              </motion.div>
            </div>
          )}

          {allTags.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className='flex gap-2 flex-wrap'
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Badge
                  variant={selectedTag === '' ? 'default' : 'outline'}
                  className='cursor-pointer'
                  onClick={() => setSelectedTag('')}
                >
                  All
                </Badge>
              </motion.div>
              {allTags.map(tag => (
                <motion.div
                  key={tag}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Badge
                    variant={selectedTag === tag ? 'default' : 'outline'}
                    className='cursor-pointer'
                    onClick={() => setSelectedTag(tag)}
                  >
                    {tag}
                  </Badge>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Recently Edited Section */}
          <AnimatePresence>
            {showRecentlyEdited && recentlyEditedNotes.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className='overflow-hidden'
              >
                <div className='mb-2'>
                  <div className='flex items-center gap-2'>
                    <Edit className='h-4 w-4 text-primary' />
                    <h3 className='text-sm font-medium'>Recently Edited</h3>
                  </div>
                  <div className='mt-1 space-y-1'>
                    {recentlyEditedNotes.map((note) => (
                      <motion.div
                        key={`recent-${note.id}`}
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        whileHover={{ x: 2 }}
                        className={`p-2 rounded-md cursor-pointer transition-all ${
                          note.id === selectedNoteId
                            ? 'bg-primary/10 border-primary/20'
                            : 'hover:bg-muted'
                        }`}
                        onClick={() => onNoteSelect(note.id!)}
                        onKeyDown={(e) => handleKeyDown(e, note.id!)}
                        tabIndex={0}
                        role='button'
                        aria-label={`Open note: ${note.title}`}
                      >
                        <div className='flex items-center justify-between'>
                          <span className='text-sm font-medium truncate'>{note.title}</span>
                          <div className='flex items-center gap-1'>
                            {note.isPinned && <Pin className='h-3 w-3 text-yellow-500' />}
                            <span className='text-xs text-muted-foreground'>
                              {note.lastModified ? 
                                new Date(note.lastModified).toLocaleTimeString([], { 
                                  hour: '2-digit', 
                                  minute: '2-digit' 
                                }) : 
                                'No date'
                              }
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
                <div className='h-px bg-border my-2'></div>
              </motion.div>
            )}
          </AnimatePresence>

          <ScrollArea className='h-[calc(100vh-320px)]'>
            <AnimatePresence mode='wait'>
              <motion.div
                key={`${searchTerm}-${selectedTag}-${sortBy}-${filter}-${viewMode}-${groupBy}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                {Object.entries(groupedNotes).length > 0 ? (
                  Object.entries(groupedNotes).map(([groupName, groupNotes]) => (
                    <div key={groupName} className='mb-4'>
                      {Object.keys(groupedNotes).length > 1 && (
                        <div className='flex items-center gap-2 mb-2'>
                          {groupBy === 'date' ? (
                            <CalendarIcon className='h-4 w-4 text-primary' />
                          ) : groupBy === 'tags' ? (
                            <Tag className='h-4 w-4 text-primary' />
                          ) : null}
                          <h3 className='text-sm font-medium'>{groupName}</h3>
                          <Badge variant='outline' className='text-xs'>
                            {groupNotes.length}
                          </Badge>
                        </div>
                      )}
                      <div className={viewMode === 'list' ? 'space-y-2' : 'grid grid-cols-2 gap-2'}>
                        {groupNotes.map((note, index) => (
                          <motion.div
                            key={note.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            whileHover={{ scale: 1.02, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                            className={`rounded-lg cursor-pointer transition-all border ${
                              note.id === selectedNoteId
                                ? 'bg-primary/10 border-primary/20'
                                : 'hover:bg-muted border-transparent'
                            }`}
                          >
                            <div 
                              className={viewMode === 'list' ? 'p-3' : 'p-2'}
                              onClick={() => onNoteSelect(note.id!)}
                              onKeyDown={(e) => handleKeyDown(e, note.id!)}
                              tabIndex={0}
                              role='button'
                              aria-label={`Open note: ${note.title}`}
                            >
                              <div className='flex items-center justify-between mb-1'>
                                <h3 className={`font-medium ${viewMode === 'grid' ? 'text-sm' : ''} truncate`}>
                                  {note.title}
                                </h3>
                                <div className='flex items-center gap-1'>
                                  {note.isPinned && (
                                    <TooltipProvider>
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <Pin className='h-3 w-3 text-yellow-500' />
                                        </TooltipTrigger>
                                        <TooltipContent>
                                          <p>Pinned Note</p>
                                        </TooltipContent>
                                      </Tooltip>
                                    </TooltipProvider>
                                  )}
                                  {note.category === 'quick-note' && (
                                    <TooltipProvider>
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <FileText className='h-3 w-3 text-muted-foreground' />
                                        </TooltipTrigger>
                                        <TooltipContent>
                                          <p>Quick Note</p>
                                        </TooltipContent>
                                      </Tooltip>
                                    </TooltipProvider>
                                  )}
                                  {recentlyViewed.includes(note.id!) && recentlyViewed.indexOf(note.id!) < 3 && (
                                    <TooltipProvider>
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <Clock className='h-3 w-3 text-blue-400' />
                                        </TooltipTrigger>
                                        <TooltipContent>
                                          <p>Recently Viewed</p>
                                        </TooltipContent>
                                      </Tooltip>
                                    </TooltipProvider>
                                  )}
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Button
                                          variant='ghost'
                                          size='sm'
                                          className='h-4 w-4 p-0'
                                          onClick={(e) => toggleFavorite(e, note.id!)}
                                        >
                                          <Heart 
                                            className={`h-3 w-3 ${
                                              favorites.includes(note.id!) 
                                                ? 'text-red-500 fill-red-500' 
                                                : 'text-muted-foreground'
                                            }`} 
                                          />
                                        </Button>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p>{favorites.includes(note.id!) ? 'Remove from' : 'Add to'} favorites</p>
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                </div>
                              </div>
                              <p className={`text-sm text-muted-foreground ${viewMode === 'list' ? 'line-clamp-2' : 'line-clamp-1'}`}>
                                {note.content}
                              </p>
                              {note.tags && note.tags.length > 0 && viewMode === 'list' && (
                                <motion.div
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  className='flex gap-1 mt-2 flex-wrap'
                                >
                                  {note.tags.map(tag => (
                                    <Badge key={tag} variant='secondary' className='text-xs'>
                                      {tag}
                                    </Badge>
                                  ))}
                                </motion.div>
                              )}
                              <div className='flex justify-between items-center mt-2'>
                                <div className='text-xs text-muted-foreground'>
                                  {note.lastModified ? 
                                    new Date(note.lastModified).toLocaleDateString(undefined, { 
                                      month: 'short', 
                                      day: 'numeric' 
                                    }) : 
                                    'No date'
                                  }
                                </div>
                                {note.tags && note.tags.length > 0 && viewMode === 'grid' && (
                                  <Badge variant='outline' className='text-xs'>
                                    {note.tags.length} {note.tags.length === 1 ? 'tag' : 'tags'}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  ))
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className='flex flex-col items-center justify-center py-12 text-center'
                  >
                    <BookOpen className='h-12 w-12 mb-4 text-muted-foreground/40' />
                    <h3 className='text-lg font-medium mb-1'>No notes found</h3>
                    <p className='text-sm text-muted-foreground mb-4 max-w-xs'>
                      {searchTerm 
                        ? 'Try adjusting your search or filters'
                        : filter === 'pinned'
                          ? 'Pin notes to see them here'
                          : filter === 'recent'
                            ? 'Recently viewed notes will appear here'
                            : filter === 'favorites'
                              ? 'Mark notes as favorites to see them here'
                              : 'Create your first note to get started'}
                    </p>
                    <Button 
                      variant='outline' 
                      size='sm'
                      onClick={() => {
                        setSearchTerm('');
                        setSelectedTag('');
                        setFilter('all');
                        setGroupBy('none');
                      }}
                    >
                      Clear filters
                    </Button>
                  </motion.div>
                )}
              </motion.div>
            </AnimatePresence>
          </ScrollArea>
        </CardContent>
      </Card>
      
      {/* Quick access floating button for favorites */}
      {favorites.length > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className='absolute bottom-4 right-4'
        >
          <DropdownMenu>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <DropdownMenuTrigger asChild>
                    <Button
                      size='sm'
                      className='h-10 w-10 rounded-full shadow-lg bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 p-0'
                    >
                      <Heart className='h-5 w-5 text-white' />
                    </Button>
                  </DropdownMenuTrigger>
                </TooltipTrigger>
                <TooltipContent side='left'>
                  <p>Quick access to favorites</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <DropdownMenuContent align='end' className='w-56'>
              <div className='text-sm font-medium px-2 py-1.5 text-muted-foreground'>
                Favorite Notes
              </div>
              {notes.filter(note => favorites.includes(note.id!)).slice(0, 5).map(note => (
                <DropdownMenuItem
                  key={note.id}
                  onClick={() => onNoteSelect(note.id!)}
                  className='flex flex-col items-start'
                >
                  <div className='font-medium truncate w-full'>{note.title}</div>
                  <div className='text-xs text-muted-foreground truncate w-full'>{note.content}</div>
                </DropdownMenuItem>
              ))}
              {favorites.length > 5 && (
                <DropdownMenuItem
                  onClick={() => {
                    setFilter('favorites');
                    setSearchTerm('');
                    setSelectedTag('');
                  }}
                  className='border-t'
                >
                  <div className='flex items-center w-full justify-between'>
                    <span>View all favorites</span>
                    <ChevronRight className='h-4 w-4' />
                  </div>
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </motion.div>
      )}
    </motion.div>
  );
}
