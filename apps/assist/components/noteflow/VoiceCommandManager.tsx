'use client';
import { useState, useEffect, useCallback } from 'react';
import { NoteflowButton } from './NoteflowButton';
import styles from './VoiceCommandManager.module.css';

interface VoiceCommand {
  command: string;
  args: string[];
}

interface VoiceCommandManagerProps {
  userId: string;
  currentNote?: any;
  onCommandExecuted: (command?: VoiceCommand) => void;
  disabled?: boolean;
}

// Mic icons as SVG components
const MicIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 1a4 4 0 0 0-4 4v7a4 4 0 0 0 8 0V5a4 4 0 0 0-4-4z"/>
    <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
    <line x1="12" y1="19" x2="12" y2="23"/>
    <line x1="8" y1="23" x2="16" y2="23"/>
  </svg>
);

const MicOffIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="1" y1="1" x2="23" y2="23"/>
    <path d="M9 9v3a3 3 0 0 0 5.12 2.12l1.27-1.27A5 5 0 0 1 7 12V9"/>
    <path d="M15 5v1a3 3 0 0 1-2.12 2.88"/>
    <line x1="12" y1="19" x2="12" y2="23"/>
    <line x1="8" y1="23" x2="16" y2="23"/>
    <path d="M19 10v2a7 7 0 0 1-2.12 5.88"/>
  </svg>
);

export function VoiceCommandManager({ 
  userId, 
  currentNote, 
  onCommandExecuted, 
  disabled = false 
}: VoiceCommandManagerProps) {
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);
  const [isSupported, setIsSupported] = useState(false);

  const handleCommandExecuted = useCallback(() => {
    onCommandExecuted();
  }, [onCommandExecuted]);

  useEffect(() => {
    // Check if speech recognition is supported
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      setIsSupported(true);
      
      // @ts-ignore - webkitSpeechRecognition is not in TypeScript types
      const recognitionInstance = new window.webkitSpeechRecognition();
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = 'en-US';

      recognitionInstance.onstart = () => {
        setIsListening(true);
        console.log('Voice recognition started');
      };

      recognitionInstance.onend = () => {
        setIsListening(false);
        console.log('Voice recognition ended');
      };

      recognitionInstance.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        
        // Handle specific error types
        if (event.error === 'not-allowed') {
          console.error('Microphone permission denied');
        } else if (event.error === 'no-speech') {
          console.log('No speech detected');
        }
      };

      recognitionInstance.onresult = async (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0])
          .map((result: any) => result.transcript)
          .join('');

        console.log('Voice transcript:', transcript);

        // Simple command parsing (we'll enhance this later)
        const command = parseSimpleCommand(transcript);
        if (command) {
          console.log('Executing command:', command);
          handleCommandExecuted();
        }
      };

      setRecognition(recognitionInstance);
    } else {
      setIsSupported(false);
      console.warn('Speech recognition not supported in this browser');
    }
  }, [userId, currentNote, handleCommandExecuted]);

  const parseSimpleCommand = (transcript: string): VoiceCommand | null => {
    const lowerTranscript = transcript.toLowerCase().trim();
    
    // Basic command patterns
    if (lowerTranscript.includes('save note') || lowerTranscript.includes('save this')) {
      return { command: 'save', args: [] };
    }
    
    if (lowerTranscript.includes('new note')) {
      return { command: 'create', args: ['note'] };
    }
    
    if (lowerTranscript.includes('add tag')) {
      const tagMatch = lowerTranscript.match(/add tag (.+)/);
      if (tagMatch) {
        return { command: 'add_tag', args: [tagMatch[1]] };
      }
    }
    
    return null;
  };

  const toggleListening = () => {
    if (!recognition || !isSupported) {
      console.warn('Speech recognition not available');
      return;
    }

    if (isListening) {
      recognition.stop();
    } else {
      try {
        recognition.start();
      } catch (error) {
        console.error('Failed to start recognition:', error);
      }
    }
  };

  if (!isSupported) {
    return (
      <div className={styles.voiceCommandManager}>
        <NoteflowButton
          variant="outline"
          size="sm"
          disabled={true}
          startIcon={<MicOffIcon />}
        >
          Voice Not Supported
        </NoteflowButton>
      </div>
    );
  }

  return (
    <div className={styles.voiceCommandManager}>
      <NoteflowButton
        variant={isListening ? 'primary' : 'outline'}
        size="sm"
        onClick={toggleListening}
        disabled={disabled}
        startIcon={isListening ? <MicOffIcon /> : <MicIcon />}
        className={isListening ? styles.listening : ''}
      >
        {isListening ? 'Stop Listening' : 'Voice Commands'}
      </NoteflowButton>
    </div>
  );
}