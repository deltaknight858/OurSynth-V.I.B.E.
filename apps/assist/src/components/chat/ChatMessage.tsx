
import { cn } from "@/lib/utils";
import { ChatMessage as ChatMessageType } from "@/types/chat";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Bot, User, ThumbsUp, ThumbsDown, Minus, Globe2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ChatMessageProps {
  message: ChatMessageType;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isBot = message.sender === "bot";

  const getSentimentIcon = () => {
    switch (message.sentiment) {
      case "positive":
        return <ThumbsUp className="h-3 w-3" />;
      case "negative":
        return <ThumbsDown className="h-3 w-3" />;
      default:
        return <Minus className="h-3 w-3" />;
    }
  };

  return (
    <div className={cn("flex w-full gap-3 py-3", isBot ? "flex-row" : "flex-row-reverse")}>
      <Avatar className={cn("h-10 w-10 glass neon-glow", isBot ? "border-primary/50" : "border-secondary/50")}>
        {isBot ? <Bot className={cn("h-5 w-5", "neon-cyan")} /> : <User className={cn("h-5 w-5", "neon-purple")} />}
      </Avatar>
      <div className="flex flex-col gap-2 max-w-[80%]">
        <Card className={cn("w-full glass-card hover:neon-glow transition-all duration-300", 
          isBot ? "border-primary/30 hover:border-primary/50" : "border-secondary/30 hover:border-secondary/50")}>
          <CardContent className="p-4">
            <p className={cn("text-sm leading-relaxed", 
              isBot ? "text-foreground" : "text-foreground")}>{message.content}</p>
          </CardContent>
        </Card>
        <div className="flex gap-2 items-center text-xs text-muted-foreground">
          {message.sentiment && (
            <Badge className="h-6 px-3 gap-1.5 glass border-transparent hover:neon-glow transition-all duration-200">
              {getSentimentIcon()}
              <span className="capitalize font-medium">{message.sentiment}</span>
            </Badge>
          )}
          {message.language && (
            <Badge className="h-6 px-3 gap-1.5 glass border-primary/30 text-primary hover:neon-glow transition-all duration-200">
              <Globe2 className="h-3 w-3" />
              <span className="uppercase font-medium">{message.language}</span>
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
}
