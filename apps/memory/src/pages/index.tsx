import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/router";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  FileText, 
  BookOpen, 
  Brain, 
  Plus, 
  TrendingUp, 
  Clock, 
  Users,
  Zap,
  ArrowRight,
  PenTool,
  Target
} from "lucide-react";
import { motion } from "framer-motion";
import { noteService, Note } from "@/services/noteService";
import { notebookService } from "@/services/notebookService";

interface DashboardStats {
  totalNotes: number;
  totalNotebooks: number;
  recentNotes: Array<{
    id: string;
    title: string;
    createdAt: Date;
    notebookTitle?: string;
  }>;
}

// Moved features definition here
const features = [
  {
    title: "Smart Organization",
    description: "Organize notes with notebooks and tags",
    icon: Target,
    color: "text-blue-500"
  },
  {
    title: "Real-time Collaboration",
    description: "Work together with your team",
    icon: Users,
    color: "text-green-500"
  },
  {
    title: "AI-Powered",
    description: "Get intelligent suggestions and insights",
    icon: Zap,
    color: "text-yellow-500"
  }
];

export default function Dashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoadingStats, setIsLoadingStats] = useState(true);

  const loadDashboardData = useCallback(async () => {
    if (!user) return;

    try {
      setIsLoadingStats(true);
      
      // Load user's notebooks and notes
      const [notebooks, notes] = await Promise.all([
        notebookService.getUserNotebooks(user.id),
        noteService.getUserNotes(user.id)
      ]);

      // Get recent notes (last 5)
      const recentNotes = notes
        .sort((a: Note, b: Note) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime())
        .slice(0, 5)
        .map((note: Note) => {
          const notebook = notebooks.find((nb: any) => nb.id === note.notebookId);
          return {
            id: note.id!,
            title: note.title,
            createdAt: note.createdAt!,
            notebookTitle: notebook?.title
          };
        });

      setStats({
        totalNotes: notes.length,
        totalNotebooks: notebooks.length,
        recentNotes
      });
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      setIsLoadingStats(false);
    }
  }, [user]);

  useEffect(() => {
    if (!loading && !user) {
      // Don't redirect to login, allow access to dashboard
      return;
    }

    if (user) {
      loadDashboardData();
    }
  }, [user, loading, router, loadDashboardData]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-6">
          <Skeleton className="h-32 w-full" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Skeleton className="h-40" />
            <Skeleton className="h-40" />
            <Skeleton className="h-40" />
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Welcome Header for Non-Authenticated Users */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <h1 className="text-4xl font-bold mb-4">
            Welcome to NoteFlow
          </h1>
          <p className="text-muted-foreground text-lg mb-8">
            Your intelligent note-taking companion. Capture, organize, and connect your ideas.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              onClick={() => router.push("/auth/login")}
              className="bg-teal-500 hover:bg-teal-600"
            >
              Try as Guest
            </Button>
            <Button 
              size="lg"
              variant="outline"
              onClick={() => router.push("/auth/register")}
            >
              Create Account
            </Button>
            <Button 
              size="lg"
              variant="outline"
              onClick={() => router.push("/auth/login")}
            >
              Sign In
            </Button>
          </div>
        </motion.div>

        {/* Quick Preview Actions for Non-Authenticated Users */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <Card>
            <CardHeader className="text-center">
              <CardTitle>Explore NoteFlow</CardTitle>
              <CardDescription>
                See what you can do with our note-taking platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button
                  asChild
                  variant="outline"
                  className="h-auto p-6 flex flex-col items-center gap-3 hover:shadow-lg transition-all"
                >
                  <Link href="/notes">
                    <div className="p-3 rounded-full bg-blue-500 text-white">
                      <PenTool className="h-6 w-6" />
                    </div>
                    <div className="text-center">
                      <div className="font-medium">View Notes</div>
                      <div className="text-sm text-muted-foreground">
                        See the note-taking interface
                      </div>
                    </div>
                  </Link>
                </Button>

                <Button
                  asChild
                  variant="outline"
                  className="h-auto p-6 flex flex-col items-center gap-3 hover:shadow-lg transition-all"
                >
                  <Link href="/notebooks">
                    <div className="p-3 rounded-full bg-green-500 text-white">
                      <BookOpen className="h-6 w-6" />
                    </div>
                    <div className="text-center">
                      <div className="font-medium">Browse Notebooks</div>
                      <div className="text-sm text-muted-foreground">
                        Explore organization features
                      </div>
                    </div>
                  </Link>
                </Button>

                <Button
                  onClick={() => router.push("/auth/login")}
                  variant="outline"
                  className="h-auto p-6 flex flex-col items-center gap-3 hover:shadow-lg transition-all bg-teal-500/10 border-teal-500/30"
                >
                  <div className="p-3 rounded-full bg-teal-500 text-white">
                    <Brain className="h-6 w-6" />
                  </div>
                  <div className="text-center">
                    <div className="font-medium">Start as Guest</div>
                    <div className="text-sm text-muted-foreground">
                      Try all features instantly
                    </div>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Features Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader className="text-center">
              <CardTitle>Why Choose NoteFlow?</CardTitle>
              <CardDescription>
                Powerful features to enhance your productivity
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {features.map((feature, index) => (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="text-center"
                  >
                    <feature.icon className={`h-12 w-12 mx-auto mb-4 ${feature.color}`} />
                    <h3 className="font-medium mb-2 text-lg">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  const quickActions = [
    {
      title: "Create Note",
      description: "Start writing immediately",
      icon: PenTool,
      href: "/notes",
      color: "bg-blue-500",
      action: "new-note"
    },
    {
      title: "New Notebook",
      description: "Organize your thoughts",
      icon: BookOpen,
      href: "/notebooks",
      color: "bg-green-500",
      action: "new-notebook"
    },
    {
      title: "Mind Map",
      description: "Visualize connections",
      icon: Brain,
      href: "/notes",
      color: "bg-purple-500",
      action: "mind-map"
    }
  ];

  // const features = [ // Original position - moved up
  //   {
  //     title: "Smart Organization",
  //     description: "Organize notes with notebooks and tags",
  //     icon: Target,
  //     color: "text-blue-500"
  //   },
  //   {
  //     title: "Real-time Collaboration",
  //     description: "Work together with your team",
  //     icon: Users,
  //     color: "text-green-500"
  //   },
  //   {
  //     title: "AI-Powered",
  //     description: "Get intelligent suggestions and insights",
  //     icon: Zap,
  //     color: "text-yellow-500"
  //   }
  // ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold mb-2">
          Welcome back, {user.user_metadata?.full_name || user.email?.split("@")[0]}!
        </h1>
        <p className="text-muted-foreground text-lg">
          Ready to capture your next great idea?
        </p>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
      >
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Notes</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoadingStats ? <Skeleton className="h-8 w-16" /> : stats?.totalNotes || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Your knowledge base
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Notebooks</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoadingStats ? <Skeleton className="h-8 w-16" /> : stats?.totalNotebooks || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Organized collections
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Week</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoadingStats ? <Skeleton className="h-8 w-16" /> : stats?.recentNotes.length || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Recent activity
            </p>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Quick Actions
              </CardTitle>
              <CardDescription>
                Jump right into your workflow
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {quickActions.map((action, index) => (
                  <motion.div
                    key={action.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                  >
                    <Button
                      asChild
                      variant="outline"
                      className="h-auto p-6 flex flex-col items-center gap-3 hover:shadow-lg transition-all"
                    >
                      <Link href={action.href}>
                        <div className={`p-3 rounded-full ${action.color} text-white`}>
                          <action.icon className="h-6 w-6" />
                        </div>
                        <div className="text-center">
                          <div className="font-medium">{action.title}</div>
                          <div className="text-sm text-muted-foreground">
                            {action.description}
                          </div>
                        </div>
                      </Link>
                    </Button>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Features Overview */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Why Choose NoteFlow?</CardTitle>
              <CardDescription>
                Powerful features to enhance your productivity
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {features.map((feature, index) => (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    className="text-center"
                  >
                    <feature.icon className={`h-8 w-8 mx-auto mb-3 ${feature.color}`} />
                    <h3 className="font-medium mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Recent Notes
              </CardTitle>
              <CardDescription>
                Your latest work
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingStats ? (
                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <Skeleton className="h-4 w-4 rounded" />
                      <div className="space-y-1 flex-1">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-3 w-2/3" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : stats?.recentNotes.length ? (
                <div className="space-y-4">
                  {stats.recentNotes.map((note, index) => (
                    <motion.div
                      key={note.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                    >
                      <Link
                        href={`/notes?noteId=${note.id}`}
                        className="block p-3 rounded-lg border hover:bg-accent transition-colors"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium truncate">{note.title}</h4>
                            {note.notebookTitle && (
                              <Badge variant="secondary" className="mt-1 text-xs">
                                {note.notebookTitle}
                              </Badge>
                            )}
                            <p className="text-xs text-muted-foreground mt-1">
                              {new Date(note.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <ArrowRight className="h-4 w-4 text-muted-foreground flex-shrink-0 ml-2" />
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                  <Button asChild variant="outline" className="w-full">
                    <Link href="/notes">
                      View All Notes
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Link>
                  </Button>
                </div>
              ) : (
                <div className="text-center py-6">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground mb-4">No notes yet</p>
                  <Button asChild>
                    <Link href="/notes">
                      <Plus className="h-4 w-4 mr-2" />
                      Create Your First Note
                    </Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
