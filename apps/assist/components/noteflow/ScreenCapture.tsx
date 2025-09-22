'use client';
import { useState } from 'react';
import { NoteflowButton } from './NoteflowButton';
import styles from './ScreenCapture.module.css';

interface ScreenCaptureProps {
  onCapture: (blob: Blob) => void;
  disabled?: boolean;
}

// Camera icon as SVG component
const CameraIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
    <circle cx="12" cy="13" r="4"/>
  </svg>
);

export function ScreenCapture({ onCapture, disabled = false }: ScreenCaptureProps) {
  const [isCapturing, setIsCapturing] = useState(false);

  const captureScreen = async () => {
    try {
      setIsCapturing(true);
      
      // Dynamic import of html2canvas to avoid SSR issues
      const html2canvas = (await import('html2canvas')).default;
      
      const canvas = await html2canvas(document.body, {
        height: window.innerHeight,
        width: window.innerWidth,
        scrollX: 0,
        scrollY: 0,
      });
      
      canvas.toBlob((blob: Blob | null) => {
        if (blob) {
          onCapture(blob);
        }
      }, 'image/png');
    } catch (error) {
      console.error('Error capturing screen:', error);
      // TODO: Add toast notification for error
    } finally {
      setIsCapturing(false);
    }
  };

  return (
    <div className={styles.screenCapture}>
      <NoteflowButton
        variant="outline"
        size="sm"
        onClick={captureScreen}
        disabled={disabled || isCapturing}
        startIcon={<CameraIcon />}
        className={isCapturing ? styles.capturing : ''}
      >
        {isCapturing ? 'Capturing...' : 'Screen Capture'}
      </NoteflowButton>
    </div>
  );
}