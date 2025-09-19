
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
    <div className={cn("flex w-full gap-2 py-2", isBot ? "flex-row" : "flex-row-reverse")}>
      <Avatar className={cn("h-8 w-8", isBot ? "bg-primary" : "bg-muted")}>
        {isBot ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
      </Avatar>
      <div className="flex flex-col gap-1 max-w-[80%]">
        <Card className={cn("w-full", isBot ? "bg-muted" : "bg-primary text-primary-foreground")}>
          <CardContent className="p-3">
            <p className="text-sm">{message.content}</p>
          </CardContent>
        </Card>
        <div className="flex gap-2 items-center text-xs text-muted-foreground">
          {message.sentiment && (
            <Badge className="h-5 px-2 gap-1 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80">
              {getSentimentIcon()}
              <span className="capitalize">{message.sentiment}</span>
            </Badge>
          )}
          {message.language && (
            <Badge className="h-5 px-2 gap-1 text-foreground">
              <Globe2 className="h-3 w-3" />
              <span className="uppercase">{message.language}</span>
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
}
