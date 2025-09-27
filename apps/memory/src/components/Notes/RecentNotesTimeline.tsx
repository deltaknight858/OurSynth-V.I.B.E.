import { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Heart, Clock, ChevronDown, ChevronUp, Pin, MoreHorizontal, Filter, SearchIcon, BookOpen, FileText, Tag, SortAsc, SortDesc, Calendar, List } from 'lucide-react';
import { Note, noteService } from "@/services/noteService";
import { Notebook } from "@/services/notebookService";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';

interface RecentNotesTimelineProps {
  notebooks: Notebook[];
  userId: string;
  onNoteSelect: (noteId: string) => void;
  currentNotebookId?: string;
}

export function RecentNotesTimeline({
  notebooks,
  userId,
  onNoteSelect,
  currentNotebookId
}: RecentNotesTimelineProps) {
  const [recentNotes, setRecentNotes] = useState<Note[]>([]);
  const [isExpanded, setIsExpanded] = useState(true); // Start expanded by default
  const [isLoading, setIsLoading] = useState(true);
  const [displayLimit, setDisplayLimit] = useState(10);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');
  const [viewMode, setViewMode] = useState<'timeline' | 'list'>('timeline');
  const [filterType, setFilterType] = useState<'all' | 'favorites'>('all');
  
  // Track favorites in local storage
  const [favorites, setFavorites] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('favoriteNotes');
      return stored ? JSON.parse(stored) : [];
    }
    return [];
  });
  
  // Track recently viewed notes
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      const stored = sessionStorage.getItem('recentlyViewedNotes');
      return stored ? JSON.parse(stored) : [];
    }
    return [];
  });
  
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
  
  // Update recently viewed when a note is selected
  const handleNoteSelect = useCallback((noteId: string) => {
    if (typeof window !== 'undefined') {
      const updated = [
        noteId,
        ...recentlyViewed.filter(id => id !== noteId)
      ].slice(0, 10);
      
      setRecentlyViewed(updated);
      sessionStorage.setItem('recentlyViewedNotes', JSON.stringify(updated));
    }
    
    onNoteSelect(noteId);
  }, [onNoteSelect, recentlyViewed]);

  // Use useCallback to memoize the fetch function
  const fetchRecentNotes = useCallback(async () => {
    setIsLoading(true);
    try {
      // Collect notes from all notebooks
      const allNotesPromises = notebooks.map(notebook => 
        noteService.getNotesByNotebook(notebook.id!)
      );
      
      const notesArrays = await Promise.all(allNotesPromises);
      
      // Flatten notes
      const allNotes = notesArrays.flat();
      
      setRecentNotes(allNotes);
    } catch (error) {
      console.error('Error fetching recent notes:', error);
    } finally {
      setIsLoading(false);
    }
  }, [notebooks]);

  useEffect(() => {
    if (notebooks.length > 0) {
      fetchRecentNotes();
    }
  }, [notebooks, fetchRecentNotes]);

  // Use useMemo for expensive computations
  const filteredAndSortedNotes = useMemo(() => {
    return recentNotes
      .filter(note => !activeFilter || note.notebookId === activeFilter)
      .filter(note => filterType === 'all' || (filterType === 'favorites' && favorites.includes(note.id!)))
      .filter(note => 
        !searchQuery || 
        note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (note.tags && note.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())))
      )
      .sort((a, b) => {
        if (!a.lastModified && !b.lastModified) return 0;
        if (!a.lastModified) return 1;
        if (!b.lastModified) return -1;
        const dateA = a.lastModified ? new Date(a.lastModified).getTime() : 0;
        const dateB = b.lastModified ? new Date(b.lastModified).getTime() : 0;
        return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
      });
  }, [recentNotes, activeFilter, searchQuery, sortOrder, filterType, favorites]);

  // Group notes by date - memoized for performance
  const groupedNotes = useMemo(() => {
    return filteredAndSortedNotes
      .slice(0, displayLimit)
      .reduce<Record<string, Note[]>>((groups, note) => {
        const date = note.lastModified 
          ? new Date(note.lastModified).toLocaleDateString()
          : 'Undated';
        if (!groups[date]) {
          groups[date] = [];
        }
        groups[date].push(note);
        return groups;
      }, {});
  }, [filteredAndSortedNotes, displayLimit]);

  // Find notebook by ID - memoized
  const getNotebookById = useCallback((notebookId: string) => {
    return notebooks.find(nb => nb.id === notebookId);
  }, [notebooks]);

  // Format date for display
  const formatDate = (dateString: string) => {
    if (dateString === 'Undated') return dateString;
    
    const date = new Date(dateString);
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === now.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString(undefined, { 
        weekday: 'long', 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent, noteId: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleNoteSelect(noteId);
    }
  };

  // Loading state with skeleton
  if (isLoading) {
    return (
      <div className='space-y-3'>
        <div className='flex items-center gap-2'>
          <Skeleton className='h-4 w-4 rounded-full' />
          <Skeleton className='h-4 w-24' />
        </div>
        <Card>
          <CardContent className='p-3'>
            <Skeleton className='h-8 w-full mb-3' />
            <div className='space-y-2'>
              {[1, 2, 3].map(i => (
                <Skeleton key={i} className='h-12 w-full' />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (recentNotes.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className='mb-6'
    >
      <div className='flex items-center justify-between mb-2'>
        <div className='flex items-center gap-2'>
          <Clock className='h-4 w-4 text-muted-foreground' />
          <h3 className='text-sm font-medium text-muted-foreground'>Note History</h3>
          {activeFilter && (
            <Badge variant='outline' className='text-xs'>
              {notebooks.find(nb => nb.id === activeFilter)?.title || 'Unknown Notebook'}
            </Badge>
          )}
          {filterType === 'favorites' && (
            <Badge variant='outline' className='text-xs bg-red-500/10 text-red-500 border-red-500/20'>
              Favorites
            </Badge>
          )}
        </div>
        <div className='flex items-center gap-1'>
          {/* Favorites filter toggle */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant='ghost'
                  size='sm'
                  className='h-7 w-7 p-0'
                  onClick={() => setFilterType(filterType === 'all' ? 'favorites' : 'all')}
                >
                  <Heart className={`h-3.5 w-3.5 ${filterType === 'favorites' ? 'fill-red-500 text-red-500' : ''}`} />
                </Button>
              </TooltipTrigger>
              <TooltipContent side='bottom'>
                <p>{filterType === 'favorites' ? 'Show all notes' : 'Show favorites only'}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          {/* View mode toggle */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant='ghost'
                  size='sm'
                  className='h-7 w-7 p-0'
                  onClick={() => setViewMode(viewMode === 'timeline' ? 'list' : 'timeline')}
                >
                  {viewMode === 'timeline' ? (
                    <Calendar className='h-3.5 w-3.5' />
                  ) : (
                    <List className='h-3.5 w-3.5' />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent side='bottom'>
                <p>Switch to {viewMode === 'timeline' ? 'list' : 'timeline'} view</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          {/* Sort order toggle */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant='ghost'
                  size='sm'
                  className='h-7 w-7 p-0'
                  onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
                >
                  {sortOrder === 'desc' ? (
                    <SortDesc className='h-3.5 w-3.5' />
                  ) : (
                    <SortAsc className='h-3.5 w-3.5' />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent side='bottom'>
                <p>{sortOrder === 'desc' ? 'Newest first' : 'Oldest first'}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          {/* Filter dropdown */}
          <DropdownMenu>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant='ghost'
                      size='sm'
                      className='h-7 w-7 p-0'
                    >
                      <Filter className='h-3.5 w-3.5' />
                    </Button>
                  </DropdownMenuTrigger>
                </TooltipTrigger>
                <TooltipContent side='bottom'>
                  <p>Filter by notebook</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <DropdownMenuContent align='end' className='w-48'>
              <DropdownMenuItem 
                onClick={() => setActiveFilter(null)}
                className={activeFilter === null ? 'bg-primary/10' : ''}
              >
                All Notebooks
              </DropdownMenuItem>
              {notebooks.map(notebook => (
                <DropdownMenuItem
                  key={notebook.id}
                  onClick={() => setActiveFilter(notebook.id || null)}
                  className={activeFilter === notebook.id ? 'bg-primary/10' : ''}
                >
                  <div className='flex items-center gap-2'>
                    <div 
                      className='w-2 h-2 rounded-full'
                      style={{ backgroundColor: notebook.color }}
                    />
                    <span>{notebook.title}</span>
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          
          {/* Expand/collapse button */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant='ghost'
                  size='sm'
                  className='h-7 w-7 p-0'
                  onClick={() => setIsExpanded(!isExpanded)}
                >
                  {isExpanded ? (
                    <ChevronUp className='h-4 w-4' />
                  ) : (
                    <ChevronDown className='h-4 w-4' />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent side='bottom'>
                <p>{isExpanded ? 'Collapse' : 'Expand'}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className='overflow-hidden'
          >
            <Card className='bg-background/60 backdrop-blur-sm border-dashed'>
              <CardContent className='p-3'>
                {/* Search input */}
                <div className='relative mb-3'>
                  <SearchIcon className='absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground' />
                  <Input 
                    placeholder='Search notes...'
                    className='pl-8 h-8 text-sm'
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
                <ScrollArea className='h-[220px]'>
                  {viewMode === 'timeline' ? (
                    <div className='relative pl-4 border-l border-primary/20'>
                      {Object.entries(groupedNotes).length > 0 ? (
                        Object.entries(groupedNotes).map(([date, notes], groupIndex) => (
                          <div key={date} className='mb-4'>
                            <div className='flex items-center mb-2'>
                              <div className='absolute w-2 h-2 rounded-full bg-primary -left-[4.5px]'></div>
                              <span className='text-xs font-medium'>{formatDate(date)}</span>
                            </div>
                            <div className='space-y-2'>
                              {notes.map((note, noteIndex) => {
                                const notebook = getNotebookById(note.notebookId);
                                const isRecent = recentlyViewed.includes(note.id!) && recentlyViewed.indexOf(note.id!) < 3;
                                const isFavorite = favorites.includes(note.id!);
                                
                                return (
                                  <motion.div
                                    key={note.id}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: noteIndex * 0.05 }}
                                    className='relative'
                                    whileHover={{ x: 2 }}
                                  >
                                    <TooltipProvider>
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <div 
                                            className={`pl-2 py-1 pr-2 rounded-md cursor-pointer transition-all hover:bg-primary/10 ${
                                              note.notebookId === currentNotebookId ? 'bg-primary/5' : ''
                                            } ${isRecent ? 'ring-1 ring-blue-500/20' : ''} ${
                                              isFavorite ? 'border-l-2 border-red-500/50' : ''
                                            }`}
                                            onClick={() => handleNoteSelect(note.id!)}
                                            onKeyDown={(e) => handleKeyDown(e, note.id!)}
                                            tabIndex={0}
                                            role='button'
                                            aria-label={`Open note: ${note.title}`}
                                          >
                                            <div className='flex items-center justify-between'>
                                              <div className='flex-1 truncate'>
                                                <span className='text-sm font-medium'>{note.title}</span>
                                              </div>
                                              <div className='flex items-center gap-1'>
                                                {note.isPinned && (
                                                  <Pin className='h-3 w-3 text-yellow-500' />
                                                )}
                                                {isFavorite && (
                                                  <Heart className='h-3 w-3 text-red-500 fill-red-500' />
                                                )}
                                                {isRecent && (
                                                  <Clock className='h-3 w-3 text-blue-400' />
                                                )}
                                                {note.category === 'quick-note' && (
                                                  <FileText className='h-3 w-3 text-muted-foreground' />
                                                )}
                                                {note.tags && note.tags.length > 0 && (
                                                  <Tag className='h-3 w-3 text-muted-foreground' />
                                                )}
                                                {notebook && (
                                                  <div 
                                                    className='w-2 h-2 rounded-full' 
                                                    style={{ backgroundColor: notebook.color }}
                                                  ></div>
                                                )}
                                              </div>
                                            </div>
                                            <p className='text-xs text-muted-foreground line-clamp-1'>{note.content}</p>
                                          </div>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                          <div className='space-y-1'>
                                            <p className='font-medium'>{note.title}</p>
                                            <div className='flex items-center gap-2'>
                                              <Button
                                                variant='ghost'
                                                size='sm'
                                                className='h-6 w-6 p-0'
                                                onClick={(e) => toggleFavorite(e, note.id!)}
                                              >
                                                <Heart 
                                                  className={`h-3 w-3 ${
                                                    isFavorite 
                                                      ? 'text-red-500 fill-red-500' 
                                                      : 'text-muted-foreground'
                                                  }`} 
                                                />
                                              </Button>
                                              {isRecent && (
                                                <Badge variant='outline' className='text-xs bg-blue-500/10 text-blue-500 border-blue-500/20'>
                                                  Recent
                                                </Badge>
                                              )}
                                            </div>
                                            {notebook && (
                                              <Badge 
                                                variant='outline' 
                                                className='text-xs'
                                                style={{ borderColor: notebook.color, color: notebook.color }}
                                              >
                                                {notebook.title}
                                              </Badge>
                                            )}
                                            {note.tags && note.tags.length > 0 && (
                                              <div className='flex flex-wrap gap-1'>
                                                {note.tags.slice(0, 3).map((tag, i) => (
                                                  <Badge key={i} variant='secondary' className='text-xs'>
                                                    {tag}
                                                  </Badge>
                                                ))}
                                                {note.tags.length > 3 && (
                                                  <Badge variant='secondary' className='text-xs'>
                                                    +{note.tags.length - 3}
                                                  </Badge>
                                                )}
                                              </div>
                                            )}
                                            <p className='text-xs text-muted-foreground'>
                                              {note.lastModified ? 
                                                new Date(note.lastModified).toLocaleTimeString([], { 
                                                  hour: '2-digit', 
                                                  minute: '2-digit' 
                                                }) : 
                                                'No date'
                                              }
                                            </p>
                                          </div>
                                        </TooltipContent>
                                      </Tooltip>
                                    </TooltipProvider>
                                  </motion.div>
                                );
                              })}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className='py-8 text-center'>
                          <BookOpen className='h-8 w-8 mx-auto mb-2 text-muted-foreground/50' />
                          <p className='text-sm text-muted-foreground'>
                            {searchQuery 
                              ? 'No notes match your search' 
                              : activeFilter 
                                ? 'No notes found in this notebook' 
                                : filterType === 'favorites'
                                  ? 'No favorite notes found'
                                  : 'No recent notes found'}
                          </p>
                          {!recentNotes.length && (
                            <Button 
                              variant='outline' 
                              size='sm'
                              className='mt-4'
                              onClick={() => {
                                if (currentNotebookId) {
                                  handleNoteSelect('new');
                                }
                              }}
                            >
                              Create your first note
                            </Button>
                          )}
                          {filterType === 'favorites' && filteredAndSortedNotes.length === 0 && recentNotes.length > 0 && (
                            <Button 
                              variant='outline' 
                              size='sm'
                              className='mt-4'
                              onClick={() => setFilterType('all')}
                            >
                              Show all notes
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                  ) : (
                    // List view
                    <div className='space-y-2'>
                      {filteredAndSortedNotes.slice(0, displayLimit).length > 0 ? (
                        filteredAndSortedNotes.slice(0, displayLimit).map((note, index) => {
                          const notebook = getNotebookById(note.notebookId);
                          const isRecent = recentlyViewed.includes(note.id!) && recentlyViewed.indexOf(note.id!) < 3;
                          const isFavorite = favorites.includes(note.id!);
                          
                          return (
                            <motion.div
                              key={note.id}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: index * 0.03 }}
                            >
                              <Card 
                                className={`cursor-pointer transition-all hover:bg-primary/5 ${
                                  note.notebookId === currentNotebookId ? 'border-primary/20' : ''
                                } ${isRecent ? 'ring-1 ring-blue-500/20' : ''} ${
                                  isFavorite ? 'border-l-2 border-red-500/50' : ''
                                }`}
                                onClick={() => handleNoteSelect(note.id!)}
                              >
                                <CardContent className='p-2'>
                                  <div className='flex items-center justify-between gap-2'>
                                    <div className='flex-1'>
                                      <div className='flex items-center gap-1'>
                                        <h4 className='text-sm font-medium'>{note.title}</h4>
                                        {note.isPinned && <Pin className='h-3 w-3 text-yellow-500' />}
                                        {isFavorite && <Heart className='h-3 w-3 text-red-500 fill-red-500' />}
                                        {isRecent && <Clock className='h-3 w-3 text-blue-400' />}
                                      </div>
                                      <p className='text-xs text-muted-foreground line-clamp-1'>{note.content}</p>
                                    </div>
                                    <div className='flex flex-col items-end'>
                                      <div className='flex items-center gap-1'>
                                        {notebook && (
                                          <div 
                                            className='w-2 h-2 rounded-full' 
                                            style={{ backgroundColor: notebook.color }}
                                          />
                                        )}
                                        <span className='text-xs text-muted-foreground'>
                                          {note.lastModified ? 
                                            new Date(note.lastModified).toLocaleDateString() 
                                            : 'No date'
                                          }
                                        </span>
                                      </div>
                                      <div className='flex items-center gap-1 mt-1'>
                                        {notebook && (
                                          <Badge 
                                            variant='outline' 
                                            className='text-xs'
                                            style={{ borderColor: notebook.color, color: notebook.color }}
                                          >
                                            {notebook.title}
                                          </Badge>
                                        )}
                                        <Button
                                          variant='ghost'
                                          size='sm'
                                          className='h-6 w-6 p-0'
                                          onClick={(e) => toggleFavorite(e, note.id!)}
                                        >
                                          <Heart 
                                            className={`h-3 w-3 ${
                                              isFavorite 
                                                ? 'text-red-500 fill-red-500' 
                                                : 'text-muted-foreground'
                                            }`} 
                                          />
                                        </Button>
                                      </div>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            </motion.div>
                          );
                        })
                      ) : (
                        <div className='py-8 text-center'>
                          <BookOpen className='h-8 w-8 mx-auto mb-2 text-muted-foreground/50' />
                          <p className='text-sm text-muted-foreground'>
                            {searchQuery 
                              ? 'No notes match your search' 
                              : activeFilter 
                                ? 'No notes found in this notebook' 
                                : filterType === 'favorites'
                                  ? 'No favorite notes found'
                                  : 'No recent notes found'}
                          </p>
                          {!recentNotes.length && (
                            <Button 
                              variant='outline' 
                              size='sm'
                              className='mt-4'
                              onClick={() => {
                                if (currentNotebookId) {
                                  handleNoteSelect('new');
                                }
                              }}
                            >
                              Create your first note
                            </Button>
                          )}
                          {filterType === 'favorites' && filteredAndSortedNotes.length === 0 && recentNotes.length > 0 && (
                            <Button 
                              variant='outline' 
                              size='sm'
                              className='mt-4'
                              onClick={() => setFilterType('all')}
                            >
                              Show all notes
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* View More button */}
                  {filteredAndSortedNotes.length > displayLimit && (
                    <div className='flex justify-center mt-4'>
                      <Button 
                        variant='ghost' 
                        size='sm'
                        className='text-xs h-6'
                        onClick={() => setDisplayLimit(prev => prev + 10)}
                      >
                        View More
                      </Button>
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}