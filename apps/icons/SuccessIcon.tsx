/** Auto-generated success icon - converted to semantic implementation */
import * as React from 'react';

export interface IconProps extends React.SVGProps<SVGSVGElement> { 
  size?: number; 
  title?: string; 
}

export const SuccessIcon: React.FC<IconProps> = ({ size = 24, title = 'SuccessIcon', ...props }) => (
  <svg 
    role="img" 
    width={size} 
    height={size} 
    aria-label={title} 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 32 32" 
    fill="none"
    {...props}
  >
    {/* Success: Neon checkmark */}
  <svg role="img" width={size} height={size} aria-label={title} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="none" {...props}>
    <circle cx="16" cy="16" r="13" stroke="currentColor" strokeWidth="2"/>
    <polyline points="10,17 15,22 22,11" stroke="currentColor" strokeWidth="2"/>
  </svg>
);
