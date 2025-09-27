
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Mic, Square } from "lucide-react";

interface MediaRecorderProps {
  onRecordingComplete: (blob: Blob) => void;
}

declare global {
  interface Window {
    MediaRecorder: typeof MediaRecorder;
  }
}

export function MediaRecorder({ onRecordingComplete }: MediaRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      if (window.MediaRecorder) {
        const mediaRecorder = new window.MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        chunksRef.current = [];

        mediaRecorder.ondataavailable = (e) => {
          if (e.data.size > 0) {
            chunksRef.current.push(e.data);
          }
        };

        mediaRecorder.onstop = () => {
          const blob = new Blob(chunksRef.current, { type: "audio/webm" });
          onRecordingComplete(blob);
          stream.getTracks().forEach(track => track.stop());
        };

        mediaRecorder.start();
        setIsRecording(true);
      }
    } catch (error) {
      console.error("Error starting recording:", error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  return (
    <div className="flex gap-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={isRecording ? stopRecording : startRecording}
      >
        {isRecording ? <Square size={16} /> : <Mic size={16} />}
      </Button>
    </div>
  );
}
