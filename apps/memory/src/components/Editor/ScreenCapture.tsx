
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Camera } from "lucide-react";
import html2canvas from "html2canvas";

interface ScreenCaptureProps {
  onCapture: (blob: Blob) => void;
}

export function ScreenCapture({ onCapture }: ScreenCaptureProps) {
  const [isCapturing, setIsCapturing] = useState(false);

  const captureScreen = async () => {
    try {
      setIsCapturing(true);
      const canvas = await html2canvas(document.body);
      canvas.toBlob((blob) => {
        if (blob) {
          onCapture(blob);
        }
      }, "image/png");
    } catch (error) {
      console.error("Error capturing screen:", error);
    } finally {
      setIsCapturing(false);
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={captureScreen}
      disabled={isCapturing}
    >
      <Camera size={16} />
    </Button>
  );
}
