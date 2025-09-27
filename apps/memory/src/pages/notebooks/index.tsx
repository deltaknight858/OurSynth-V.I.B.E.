import { useEffect, useState } from "react";
import { PageLayout } from "@/components/Layout/PageLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Notebook, notebookService } from "@/services/notebookService";
import { useAuth } from "@/contexts/AuthContext";
import { Plus, Pencil, Trash2, Loader2, BookOpen, Info, UserPlus, LogIn } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/router";
import { Alert, AlertDescription } from "@/components/ui/alert";

const demoNotebooksData: Notebook[] = [
  {
    id: "demo-nb-1",
    title: "Demo Personal Notebook",
    description: "A place for your brilliant ideas and thoughts.",
    color: "#8B5CF6", // Violet
    userId: "demo",
    createdAt: new Date(),
    lastModified: new Date(),
  },
  {
    id: "demo-nb-2",
    title: "Demo Work Projects",
    description: "Keep track of your work-related tasks and projects.",
    color: "#10B981", // Emerald
    userId: "demo",
    createdAt: new Date(),
    lastModified: new Date(),
  },
  {
    id: "demo-nb-3",
    title: "Demo Travel Plans",
    description: "Plan your next adventure here!",
    color: "#3B82F6", // Blue
    userId: "demo",
    createdAt: new Date(),
    lastModified: new Date(),
  },
];

export default function NotebooksPage() {
  const [notebooks, setNotebooks] = useState<Notebook[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingNotebook, setEditingNotebook] = useState<Notebook | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [guestLoading, setGuestLoading] = useState(false);
  const [newNotebook, setNewNotebook] = useState({
    title: "",
    description: "",
    color: "#" + Math.floor(Math.random()*16777215).toString(16)
  });
  
  const { user, loading: authLoading, signInAnonymously } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  
  useEffect(() => {
    if (!authLoading && !user) {
      // Show demo data for unauthenticated users
      setNotebooks(demoNotebooksData);
      return;
    }

    const fetchNotebooks = async () => {
      if (!user?.id) return;
      
      try {
        setIsLoading(true);
        const userNotebooks = await notebookService.getNotebooksByUser(user.id);
        setNotebooks(userNotebooks);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch notebooks. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (user?.id) {
      fetchNotebooks();
    }
  }, [user, authLoading, toast]);

  const handleOpenNotebook = async (notebookId: string) => {
    if (!user) {
       toast({
        title: "Explore Notes",
        description: "You're viewing a demo. Sign up or try as guest to interact with notes.",
        action: (
          <Button onClick={handleGuestSignUp} disabled={guestLoading}>
            {guestLoading ? "Creating..." : "Try as Guest"}
          </Button>
        ),
      });
      // Potentially navigate to a demo notes view for this notebook if implemented
      // For now, just show a toast.
      return;
    }
    router.push(`/notes?notebook=${notebookId}`);
  };

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
          description: "You're now signed in as a guest. Start creating your notebooks!",
        });
        // Re-fetch notebooks for the new guest user
        if (user?.id) {
            const userNotebooks = await notebookService.getNotebooksByUser(user.id);
            setNotebooks(userNotebooks);
        }
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

  const handleCreateNotebook = async () => {
    if (!user?.id) {
      toast({
        title: "Sign up to create notebooks",
        description: "Create an account to save your notebooks.",
        action: (
          <Button onClick={handleGuestSignUp} disabled={guestLoading}>
            {guestLoading ? "Creating..." : "Try as Guest"}
          </Button>
        ),
      });
      return;
    }

    if (!newNotebook.title.trim()) return;
    
    setIsLoading(true);
    try {
      const notebookId = await notebookService.createNotebook({
        ...newNotebook,
        userId: user.id
      });
      
      const createdNotebook: Notebook = {
        ...newNotebook,
        id: notebookId,
        userId: user.id,
        createdAt: new Date(),
        lastModified: new Date()
      };
      
      setNotebooks(prev => [...prev, createdNotebook]);
      setNewNotebook({
        title: "",
        description: "",
        color: "#" + Math.floor(Math.random()*16777215).toString(16)
      });
      setIsDialogOpen(false);
      toast({
        title: "Success",
        description: "Notebook created successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create notebook. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateNotebook = async () => {
    if (!editingNotebook?.id || !user?.id) {
       toast({
        title: "Sign up to edit notebooks",
        description: "Create an account to save changes to your notebooks.",
         action: (
          <Button onClick={handleGuestSignUp} disabled={guestLoading}>
            {guestLoading ? "Creating..." : "Try as Guest"}
          </Button>
        ),
      });
      return;
    }
    setIsLoading(true);
    try {
      await notebookService.updateNotebook(editingNotebook.id, editingNotebook);
      setNotebooks(prev =>
        prev.map(nb =>
          nb.id === editingNotebook.id ? editingNotebook : nb
        )
      );
      setEditingNotebook(null);
      toast({
        title: "Success",
        description: "Notebook updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update notebook. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteNotebook = async (notebookId: string) => {
    if (!user?.id) {
      toast({
        title: "Sign up to delete notebooks",
        description: "Create an account to manage your notebooks.",
        action: (
          <Button onClick={handleGuestSignUp} disabled={guestLoading}>
            {guestLoading ? "Creating..." : "Try as Guest"}
          </Button>
        ),
      });
      return;
    }
    setIsLoading(true);
    try {
      await notebookService.deleteNotebook(notebookId);
      setNotebooks(prev => prev.filter(nb => nb.id !== notebookId));
      toast({
        title: "Success",
        description: "Notebook deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete notebook. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading) {
    return (
      <PageLayout>
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="container mx-auto p-4">
        {!user && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <Alert className="bg-teal-500/10 border-teal-500/20">
              <Info className="h-4 w-4 text-teal-500" />
              <AlertDescription className="text-teal-700 dark:text-teal-300">
                You&apos;re viewing a demo. 
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
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">{user ? "My Notebooks" : "Demo Notebooks"}</h1>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button disabled={isLoading}>
                <Plus className="mr-2" size={16} />
                New Notebook
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Notebook</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <Input
                  placeholder="Notebook Title"
                  value={newNotebook.title}
                  onChange={(e) =>
                    setNewNotebook((prev) => ({ ...prev, title: e.target.value }))
                  }
                  autoFocus
                />
                <Input
                  placeholder="Description (optional)"
                  value={newNotebook.description}
                  onChange={(e) =>
                    setNewNotebook((prev) => ({ ...prev, description: e.target.value }))
                  }
                />
                <Input
                  type="color"
                  value={newNotebook.color}
                  onChange={(e) =>
                    setNewNotebook((prev) => ({ ...prev, color: e.target.value }))
                  }
                  className="h-10 p-1"
                />
                <Button
                  onClick={handleCreateNotebook}
                  disabled={!newNotebook.title.trim() || isLoading}
                  className="w-full"
                >
                  {isLoading || guestLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : null}
                  {guestLoading ? "Creating Guest Account..." : "Create Notebook"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {isLoading && notebooks.length === 0 && user && (
           <div className="flex items-center justify-center min-h-[200px]">
             <Loader2 className="h-8 w-8 animate-spin text-primary" />
           </div>
        )}

        {!isLoading && notebooks.length === 0 && (
          <div className="text-center py-10">
            <BookOpen className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-2 text-sm font-medium text-foreground">
              {user ? "No notebooks yet" : "No demo notebooks"}
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {user ? "Get started by creating a new notebook." : "Sign up or try as guest to create notebooks."}
            </p>
            {!user && (
                 <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
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
          </div>
        )}

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
          <AnimatePresence>
            {notebooks.map((notebook) => (
              <motion.div
                key={notebook.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
                whileHover={{ scale: 1.02 }}
                className='cursor-pointer'
                onClick={() => handleOpenNotebook(notebook.id!)}
              >
                <Card className='h-full hover:shadow-lg transition-all duration-200 border-2 hover:border-primary/50'>
                  <CardHeader className='flex flex-row items-center justify-between'>
                    <div className='flex items-center gap-2'>
                      <div
                        className='w-4 h-4 rounded-full'
                        style={{ backgroundColor: notebook.color }}
                      />
                      <CardTitle>{notebook.title}</CardTitle>
                    </div>
                    <div className='flex gap-2' onClick={(e) => e.stopPropagation()}>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant='ghost'
                              size='icon'
                              onClick={() => setEditingNotebook(notebook)}
                              disabled={isLoading || guestLoading}
                            >
                              <Pencil className='h-4 w-4' />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Edit notebook</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant='ghost'
                              size='icon'
                              onClick={() => handleDeleteNotebook(notebook.id!)}
                              disabled={isLoading || guestLoading}
                            >
                              <Trash2 className='h-4 w-4' />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Delete notebook</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </CardHeader>
                  <CardContent className='flex flex-col space-y-4'>
                    <p className='text-muted-foreground'>
                      {notebook.description || 'No description'}
                    </p>
                    <Button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenNotebook(notebook.id!);
                      }}
                      className='mt-auto w-full'
                      disabled={isLoading || guestLoading}
                    >
                      <BookOpen className='mr-2 h-4 w-4' />
                      Open Notebook
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <Dialog open={!!editingNotebook} onOpenChange={(open) => !open && setEditingNotebook(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Notebook</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <Input
                placeholder="Notebook Title"
                value={editingNotebook?.title || ""}
                onChange={(e) =>
                  setEditingNotebook(prev => prev ? { ...prev, title: e.target.value } : null)
                }
              />
              <Input
                placeholder="Description (optional)"
                value={editingNotebook?.description || ""}
                onChange={(e) =>
                  setEditingNotebook(prev => prev ? { ...prev, description: e.target.value } : null)
                }
              />
              <Input
                type="color"
                value={editingNotebook?.color || "#000000"}
                onChange={(e) =>
                  setEditingNotebook(prev => prev ? { ...prev, color: e.target.value } : null)
                }
                className="h-10 p-1"
              />
              <Button
                onClick={handleUpdateNotebook}
                disabled={!editingNotebook?.title || isLoading || guestLoading}
                className="w-full"
              >
                {isLoading || guestLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : null}
                 {guestLoading ? "Creating Guest Account..." : "Update Notebook"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </PageLayout>
  );
}
