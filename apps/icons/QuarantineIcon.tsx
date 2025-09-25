import React from "react";

/**
 * A placeholder icon representing a quarantine or containment action.
 * The SVG path can be replaced with a final brand-aligned asset.
 */
export const QuarantineIcon = ({ className, size = 24 }: { className?: string; size?: number }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 12H21" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 3L20 12L12 21L4 12L12 3Z" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);