import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Mic, MicOff } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { voiceCommandService } from "@/services/voiceCommandService";
import { Note } from "@/services/noteService";
import { VoiceCommandHelp } from "./VoiceCommandHelp";

interface VoiceCommand {
  command: string;
  args: string[];
}

interface VoiceCommandManagerProps {
  userId: string;
  currentNote?: Note | null;
  onCommandExecuted: (command?: VoiceCommand) => void;
}

export function VoiceCommandManager({ userId, currentNote, onCommandExecuted }: VoiceCommandManagerProps) {
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);
  const { toast } = useToast();

  const handleCommandExecuted = useCallback(() => {
    onCommandExecuted();
  }, [onCommandExecuted]);

  useEffect(() => {
    if (typeof window !== "undefined" && "webkitSpeechRecognition" in window) {
      // @ts-ignore
      const recognitionInstance = new webkitSpeechRecognition();
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;

      recognitionInstance.onstart = () => {
        setIsListening(true);
        toast({
          title: "Voice Commands Active",
          description: "Listening for commands..."
        });
      };

      recognitionInstance.onend = () => {
        setIsListening(false);
      };

      recognitionInstance.onerror = (event: any) => {
        console.error("Speech recognition error", event);
        setIsListening(false);
        toast({
          title: "Voice Recognition Error",
          description: "There was an error with voice recognition.",
          variant: "destructive"
        });
      };

      recognitionInstance.onresult = async (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0])
          .map(result => result.transcript)
          .join("");

        const command = voiceCommandService.parseCommand(transcript);
        if (command) {
          const response = await voiceCommandService.executeCommand(command, userId, currentNote);
          toast({
            title: "Command Executed",
            description: response
          });
          handleCommandExecuted();
        }
      };

      setRecognition(recognitionInstance);
    }
  }, [userId, currentNote, toast, handleCommandExecuted]);

  const toggleListening = () => {
    if (!recognition) {
      toast({
        title: "Not Supported",
        description: "Voice recognition is not supported in your browser.",
        variant: "destructive"
      });
      return;
    }

    if (isListening) {
      recognition.stop();
    } else {
      recognition.start();
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant={isListening ? "default" : "outline"}
        size="sm"
        onClick={toggleListening}
        className={isListening ? "bg-red-500 hover:bg-red-600" : ""}
      >
        {isListening ? (
          <MicOff className="h-4 w-4 mr-2" />
        ) : (
          <Mic className="h-4 w-4 mr-2" />
        )}
        {isListening ? "Stop Listening" : "Start Voice Commands"}
      </Button>
      <VoiceCommandHelp />
    </div>
  );
}
