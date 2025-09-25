'use client';
import { useState, useRef } from 'react';
import { NoteflowButton } from './NoteflowButton';
import styles from './MediaRecorder.module.css';

interface MediaRecorderProps {
  onRecordingComplete: (blob: Blob) => void;
  disabled?: boolean;
}

// Mic and Square icons as SVG components
const MicIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 1a4 4 0 0 0-4 4v7a4 4 0 0 0 8 0V5a4 4 0 0 0-4-4z"/>
    <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
    <line x1="12" y1="19" x2="12" y2="23"/>
    <line x1="8" y1="23" x2="16" y2="23"/>
  </svg>
);

const StopIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="6" y="6" width="12" height="12" rx="2"/>
  </svg>
);

declare global {
  interface Window {
    MediaRecorder: typeof MediaRecorder;
  }
}

export function MediaRecorder({ onRecordingComplete, disabled = false }: MediaRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

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
          const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
          onRecordingComplete(blob);
          stream.getTracks().forEach(track => track.stop());
          
          // Reset timer
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
          setRecordingTime(0);
        };

        mediaRecorder.start();
        setIsRecording(true);
        
        // Start timer
        intervalRef.current = setInterval(() => {
          setRecordingTime(prev => prev + 1);
        }, 1000);
      }
    } catch (error) {
      console.error('Error starting recording:', error);
      // TODO: Add toast notification for error
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={styles.mediaRecorder}>
      <NoteflowButton
        variant={isRecording ? 'secondary' : 'outline'}
        size="sm"
        onClick={isRecording ? stopRecording : startRecording}
        disabled={disabled}
        startIcon={isRecording ? <StopIcon /> : <MicIcon />}
        className={isRecording ? styles.recording : ''}
      >
        {isRecording ? `Recording ${formatTime(recordingTime)}` : 'Record Audio'}
      </NoteflowButton>
    </div>
  );
}