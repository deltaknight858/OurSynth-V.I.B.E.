import React, { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Users, MessageCircle, Share2, Eye, Edit, Send } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { collaborationService, ChatMessage, UserData } from "@/services/collaborationService"; // Added ChatMessage, UserData
import { MindMapNode } from "@/services/mindMapService";
import { motion, AnimatePresence } from "framer-motion";

interface CollaborativeMindMapProps {
  collaborationId: string;
  userId: string;
  initialNodes: MindMapNode[];
  initialEdges: any[];
  onNodeClick: (nodeId: string) => void;
  onNodeDrag: (nodeId: string, position: { x: number; y: number }) => void;
  selectedNodeId: string | null;
}

interface CollaborativeUser {
  id: string;
  name: string;
  avatar?: string;
  cursor?: { x: number; y: number };
  isEditing?: string; // nodeId being edited
  lastSeen: Date;
}

export function CollaborativeMindMap({
  collaborationId,
  userId,
  initialNodes,
  initialEdges,
  onNodeClick,
  onNodeDrag,
  selectedNodeId
}: CollaborativeMindMapProps) {
  const { user } = useAuth();
  const [nodes] = useState<MindMapNode[]>(initialNodes);
  const [collaborators, setCollaborators] = useState<CollaborativeUser[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [shareEmail, setShareEmail] = useState("");

  // Real-time collaboration setup
  useEffect(() => {
    if (!user || !collaborationId) return;

    const setupCollaboration = async () => {
      try {
        // Join collaboration session
        await collaborationService.joinSession(collaborationId, {
          userId: user.id,
          userName: user.user_metadata?.full_name || user.email?.split("@")[0] || "Anonymous",
          avatar: user.user_metadata?.avatar_url
        });

        // Listen for real-time updates
        const unsubscribe = await collaborationService.subscribeToUpdates(collaborationId, { // Added await
          onUserJoined: (userData: UserData) => { // Added UserData type
            setCollaborators(prev => [...prev.filter(u => u.id !== userData.userId), {
              id: userData.userId,
              name: userData.userName,
              avatar: userData.avatar,
              lastSeen: new Date()
            }]);
          },
          onUserLeft: (userId: string) => { // Added string type
            setCollaborators(prev => prev.filter(u => u.id !== userId));
          },
          onCursorMove: (userId: string, position: { x: number; y: number }) => { // Added types
            setCollaborators(prev => prev.map(u => 
              u.id === userId ? { ...u, cursor: position } : u
            ));
          },
          onNodeEdit: (userId: string, nodeId: string) => { // Added types
            setCollaborators(prev => prev.map(u => 
              u.id === userId ? { ...u, isEditing: nodeId } : u
            ));
          },
          onChatMessage: (message: ChatMessage) => { // Added ChatMessage type
            setChatMessages(prev => [...prev, message]);
          }
        });

        return unsubscribe;
      } catch (error) {
        console.error("Failed to setup collaboration:", error);
      }
    };

    const cleanup = setupCollaboration();
    
    return () => {
      cleanup?.then(unsub => unsub?.());
      collaborationService.leaveSession(collaborationId, user.id);
    };
  }, [user, collaborationId]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !user) return;

    try {
      const messagePayload: Omit<ChatMessage, "id" | "timestamp"> = { // Use Omit for payload
        userId: user.id,
        userName: user.user_metadata?.full_name || user.email?.split("@")[0] || "Anonymous",
        content: newMessage.trim(),
        type: "message"
      };

      await collaborationService.sendChatMessage(collaborationId, messagePayload);
      setNewMessage("");
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const handleShareMindMap = async () => {
    if (!shareEmail.trim()) return;

    try {
      await collaborationService.shareMindMap(collaborationId, shareEmail, "editor");
      setShareEmail("");
      setIsShareDialogOpen(false);
      
      // Add system message
      const systemMessagePayload: Omit<ChatMessage, "id" | "timestamp"> = { // Use Omit for payload
        userId: "system",
        userName: "System",
        content: `${shareEmail} has been invited to collaborate`,
        type: "system"
      };
      const systemMessage: ChatMessage = {
        ...systemMessagePayload,
        id: crypto.randomUUID(),
        timestamp: new Date()
      };
      
      setChatMessages(prev => [...prev, systemMessage ]);
    } catch (error) {
      console.error("Failed to share mind map:", error);
    }
  };

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!user) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const position = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
    
    // Call onNodeClick/onNodeDrag handlers as needed
    collaborationService.updateCursor(collaborationId, user.id, position);
  }, [user, collaborationId]);

  const renderCollaboratorCursors = () => {
    return collaborators
      .filter(collab => collab.cursor && collab.id !== user?.id)
      .map(collab => (
        <motion.div
          key={collab.id}
          className="absolute pointer-events-none z-50"
          style={{
            left: collab.cursor!.x,
            top: collab.cursor!.y
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
        >
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 bg-primary rounded-full border-2 border-white shadow-lg" />
            <div className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap">
              {collab.name}
            </div>
          </div>
        </motion.div>
      ));
  };

  return (
    <div className="relative w-full h-full" onMouseMove={handleMouseMove}>
      {/* Collaboration Header */}
      <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
        <Card className="bg-background/95 backdrop-blur-sm">
          <CardContent className="p-3">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span className="text-sm font-medium">
                  {collaborators.length} collaborator{collaborators.length !== 1 ? 's' : ''}
                </span>
              </div>
              
              <div className="flex -space-x-2">
                {collaborators.slice(0, 3).map(collab => (
                  <Avatar key={collab.id} className="w-6 h-6 border-2 border-background">
                    <AvatarImage src={collab.avatar} />
                    <AvatarFallback className="text-xs">
                      {collab.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                ))}
                {collaborators.length > 3 && (
                  <div className="w-6 h-6 rounded-full bg-muted border-2 border-background flex items-center justify-center">
                    <span className="text-xs">+{collaborators.length - 3}</span>
                  </div>
                )}
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsChatOpen(!isChatOpen)}
                className="relative"
              >
                <MessageCircle className="h-4 w-4" />
                {chatMessages.length > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 text-xs">
                    {chatMessages.length}
                  </Badge>
                )}
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsShareDialogOpen(true)}
              >
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chat Panel */}
      <AnimatePresence>
        {isChatOpen && (
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            className="absolute top-4 right-4 z-20 w-80"
          >
            <Card className="bg-background/95 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center justify-between">
                  <span>Team Chat</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsChatOpen(false)}
                  >
                    ×
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <ScrollArea className="h-64">
                  <div className="space-y-3">
                    {chatMessages.map(message => (
                      <div
                        key={message.id}
                        className={`flex gap-2 ${
                          message.userId === user?.id ? "justify-end" : "justify-start"
                        }`}
                      >
                        {message.userId !== user?.id && message.type !== "system" && (
                          <Avatar className="w-6 h-6">
                            <AvatarFallback className="text-xs">
                              {message.userName.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                        )}
                        <div
                          className={`rounded-lg px-3 py-2 max-w-[80%] ${
                            message.type === "system"
                              ? "bg-muted text-muted-foreground text-center w-full"
                              : message.userId === user?.id
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted"
                          }`}
                        >
                          {message.type !== "system" && (
                            <div className="text-xs opacity-70 mb-1">
                              {message.userName}
                            </div>
                          )}
                          <p className="text-sm">{message.content}</p>
                          <div className="text-xs opacity-50 mt-1">
                            {message.timestamp.toLocaleTimeString()}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
                
                <div className="flex gap-2">
                  <Input
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    className="flex-1"
                  />
                  <Button
                    size="sm"
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Share Dialog */}
      <AnimatePresence>
        {isShareDialogOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 flex items-center justify-center z-30"
            onClick={() => setIsShareDialogOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <Card className="w-96">
                <CardHeader>
                  <CardTitle>Share Mind Map</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Invite by email
                    </label>
                    <Input
                      placeholder="Enter email address..."
                      value={shareEmail}
                      onChange={(e) => setShareEmail(e.target.value)}
                    />
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      onClick={handleShareMindMap}
                      disabled={!shareEmail.trim()}
                      className="flex-1"
                    >
                      Send Invitation
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setIsShareDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Collaborator Cursors */}
      <AnimatePresence>
        {renderCollaboratorCursors()}
      </AnimatePresence>

      {/* Node Edit Indicators */}
      {nodes.map(node => {
        const editor = collaborators.find(c => c.isEditing === node.id);
        if (!editor || editor.id === user?.id) return null;
        
        return (
          <motion.div
            key={`editing-${node.id}`}
            className="absolute pointer-events-none z-40"
            style={{
              left: node.position.x - 10,
              top: node.position.y - 10
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
          >
            <div className="flex items-center gap-1 bg-primary text-primary-foreground text-xs px-2 py-1 rounded shadow-lg">
              <Edit className="h-3 w-3" />
              {editor.name} is editing
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
