
import { useState, KeyboardEvent } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Mic, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading?: boolean;
  maxLength?: number;
}

export function ChatInput({ onSendMessage, isLoading, maxLength = 1000 }: ChatInputProps) {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (message.trim() && message.length <= maxLength) {
      onSendMessage(message.trim());
      setMessage("");
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= maxLength) {
      setMessage(value);
    }
  };

  const charactersRemaining = maxLength - message.length;
  const isOverLimit = charactersRemaining < 0;
  const showCharacterCount = message.length > (maxLength * 0.8);

  return (
    <div className="flex flex-col gap-2 p-4 border-t bg-background">
      <div className="flex items-end gap-2">
        <div className="flex-1 relative">
          <Textarea
            value={message}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            className={cn(
              "min-h-[60px] resize-none pr-12",
              isOverLimit && "border-destructive"
            )}
            disabled={isLoading}
            maxLength={maxLength}
            aria-label="Chat message input"
          />
          {showCharacterCount && (
            <span 
              className={cn(
                "absolute bottom-2 right-2 text-xs",
                isOverLimit ? "text-destructive" : "text-muted-foreground"
              )}
              aria-live="polite"
            >
              {charactersRemaining}
            </span>
          )}
        </div>
        <div className="flex gap-2">
          <Button
            disabled={isLoading}
            title="Voice input (coming soon)"
            aria-label="Voice input"
            className="h-9 w-9 inline-flex items-center justify-center rounded-md hover:bg-accent"
          >
            <Mic className="h-4 w-4" />
          </Button>
          <Button
            onClick={handleSend}
            disabled={!message.trim() || isLoading || isOverLimit}
            aria-label="Send message"
            className="h-9 w-9 inline-flex items-center justify-center rounded-md"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
