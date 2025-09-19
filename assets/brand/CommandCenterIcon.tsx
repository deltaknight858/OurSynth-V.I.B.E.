import * as React from 'react';

export const CommandCenterIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="none" {...props}>
    <circle cx={16} cy={16} r={12} stroke="currentColor" strokeWidth={2} />
    <path d="M16 16L24 10" stroke="currentColor" strokeWidth={2} />
    <circle cx={16} cy={16} r={2} fill="currentColor" />
  </svg>
);