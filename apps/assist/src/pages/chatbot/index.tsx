
import { useEffect, useState, useRef } from "react";
import Head from "next/head";
import { useAuth } from "@/contexts/AuthContext";
import { ChatMessage as ChatMessageType } from "@/types/chat";
import { ChatMessage } from "@/components/chat/ChatMessage";
import { ChatInput } from "@/components/chat/ChatInput";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { createChatSession, sendMessage, subscribeToMessages } from "@/services/chat";
import { ElementRef } from "react";
import { Loader2, RefreshCw, Download, Settings } from "lucide-react";

export default function ChatbotPage() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [sessionId, setSessionId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const scrollAreaRef = useRef<ElementRef<typeof ScrollArea>>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    const initSession = async () => {
      if (user) {
        try {
          setError(null);
          setIsInitializing(true);
          const newSessionId = await createChatSession(user.id);
          setSessionId(newSessionId);
          
          unsubscribe = subscribeToMessages(newSessionId, (newMessages) => {
            setMessages(newMessages);
            requestAnimationFrame(() => {
              if (scrollAreaRef.current) {
                const scrollableNode = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
                if (scrollableNode) {
                  scrollableNode.scrollTop = scrollableNode.scrollHeight;
                }
              }
            });
          });
        } catch (error) {
          setError("Failed to initialize chat session. Please try again.");
          console.error("Error initializing chat session:", error);
          
          if (reconnectTimeoutRef.current) {
            clearTimeout(reconnectTimeoutRef.current);
          }
          reconnectTimeoutRef.current = setTimeout(initSession, 5000);
        } finally {
          setIsInitializing(false);
        }
      }
    };

    initSession();
    
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, [user]);

  const handleSendMessage = async (content: string) => {
    if (!user || !sessionId) return;

    setIsLoading(true);
    setError(null);
    
    try {
      const userMessage: ChatMessageType = {
        id: Date.now().toString(),
        content,
        timestamp: Date.now(),
        sender: "user",
  userId: user.id
      };

      await sendMessage(sessionId, userMessage);

      setTimeout(async () => {
        const botMessage: ChatMessageType = {
          id: (Date.now() + 1).toString(),
          content: "I'm processing your message. This is a placeholder response while the AI integration is being implemented.",
          timestamp: Date.now() + 1,
          sender: "bot",
          userId: user.id
        };
        await sendMessage(sessionId, botMessage);
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      setError("Failed to send message. Please try again.");
      console.error("Error sending message:", error);
      setIsLoading(false);
    }
  };

  const handleNewSession = async () => {
    if (!user) return;
    
    setMessages([]);
    setIsInitializing(true);
    
    try {
  const newSessionId = await createChatSession(user.id);
      setSessionId(newSessionId);
      setIsInitializing(false);
    } catch (error) {
      setError("Failed to create a new session. Please try again.");
      console.error("Error creating new session:", error);
      setIsInitializing(false);
    }
  };

  const handleExportChat = () => {
    if (!messages.length) return;
    
    const chatText = messages.map(msg => {
      const sender = msg.sender === "user" ? "You" : "Chatbot";
      return `${sender} (${new Date(msg.timestamp).toLocaleString()}):\n${msg.content}\n`;
    }).join("\n");
    
    const blob = new Blob([chatText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `chat-export-${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!user) {
    return (
      <>
        <Head>
          <title>Chatbot - EbFlo</title>
          <meta name="description" content="Intelligent AI-powered chatbot assistant" />
        </Head>
        <div className="container mx-auto px-4 py-6">
          <Card className="p-4 text-center">
            Please sign in to use the chatbot.
          </Card>
        </div>
      </>
    );
  }

  if (isInitializing) {
    return (
      <>
        <Head>
          <title>Chatbot - EbFlo</title>
          <meta name="description" content="Intelligent AI-powered chatbot assistant" />
        </Head>
        <div className="container mx-auto px-4 py-6 h-[calc(100vh-theme(spacing.32))]">
          <Card className="h-full flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="h-8 w-8 animate-spin" />
              <p className="text-muted-foreground">Initializing chat session...</p>
            </div>
          </Card>
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Chatbot - EbFlo</title>
        <meta name="description" content="Intelligent AI-powered chatbot assistant" />
      </Head>
      <div className="container mx-auto px-4 py-6 h-[calc(100vh-theme(spacing.32))]">
        <Card className="h-full flex flex-col">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>AI Assistant</CardTitle>
                <CardDescription>Chat with our intelligent assistant</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={handleNewSession}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  New Chat
                </Button>
                <Button variant="outline" size="sm" onClick={handleExportChat} disabled={!messages.length}>
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
                <Button variant="ghost" size="icon">
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          
          {error && (
            <Alert variant="destructive" className="mx-4 my-2">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <ScrollArea ref={scrollAreaRef} className="flex-1 px-4 py-2">
            <div className="space-y-4">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-[50vh] text-center">
                  <div className="max-w-md space-y-4">
                    <h3 className="text-xl font-semibold">Welcome to EbFlo Chatbot</h3>
                    <p className="text-muted-foreground">
                      Ask me anything about development, coding, or general questions. I'm here to help!
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      <Button variant="outline" onClick={() => handleSendMessage("What can you help me with?")}>
                        What can you do?
                      </Button>
                      <Button variant="outline" onClick={() => handleSendMessage("How do I use React hooks?")}>
                        React hooks help
                      </Button>
                      <Button variant="outline" onClick={() => handleSendMessage("Explain async/await in JavaScript")}>
                        Explain async/await
                      </Button>
                      <Button variant="outline" onClick={() => handleSendMessage("What's new in Next.js 14?")}>
                        Next.js 14 features
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                messages.map((message) => (
                  <ChatMessage key={message.id} message={message} />
                ))
              )}
              {isLoading && (
                <div className="flex justify-center py-4">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              )}
            </div>
          </ScrollArea>
          
          <div className="p-4 border-t">
            <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
          </div>
        </Card>
      </div>
    </>
  );
}
