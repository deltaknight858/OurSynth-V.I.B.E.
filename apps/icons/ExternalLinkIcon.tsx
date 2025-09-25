import React from "react";

export function ExternalLinkIcon({ className = "", ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M9 2H14V7M14 2L7 9M5.5 4.5H3C2.44772 4.5 2 4.94772 2 5.5V13C2 13.5523 2.44772 14 3 14H10.5C11.0523 14 11.5 13.5523 11.5 13V10.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
import React from 'react';

export interface ExternalLinkIconProps {
  size?: number;
  className?: string;
  color?: string;
}

export const ExternalLinkIcon: React.FC<ExternalLinkIconProps> = ({ 
  size = 16, 
  className = "", 
  color = "currentColor" 
}) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path 
        d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" 
        stroke={color} 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      <path 
        d="m15 3 6 6" 
        stroke={color} 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      <path 
        d="M21 3h-6v6" 
        stroke={color} 
        strokeWidth="2" 
        strokeLinecap="round" 

        strokeLinejoin="round"
      />
    </svg>
  );
}

};

export default ExternalLinkIcon;

