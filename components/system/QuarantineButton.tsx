"use client";

import React, { useState } from "react";
import { HaloButton } from "@/components/system/HaloButton";
import { QuarantineIcon } from "@/components/icons/QuarantineIcon";

interface QuarantineButtonProps {
  sourcePath: string;
  onComplete?: (result: { success: boolean; message: string }) => void;
}

export function QuarantineButton({ sourcePath, onComplete }: QuarantineButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    if (!confirm(`Are you sure you want to quarantine the asset at: ${sourcePath}? This action cannot be easily undone.`)) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/agents/quarantine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sourcePath }),
      });
      const result = await response.json();
      onComplete?.(result);
    } catch (error) {
      const message = error instanceof Error ? error.message : "An unknown error occurred.";
      onComplete?.({ success: false, message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <HaloButton variant="secondary" onClick={handleClick} disabled={isLoading}>
      <QuarantineIcon className="inline mr-2" size={16} />
      {isLoading ? "Quarantining..." : "Quarantine"}
    </HaloButton>
  );
}