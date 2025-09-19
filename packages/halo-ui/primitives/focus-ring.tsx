import React from 'react';

export interface FocusRingProps extends React.HTMLAttributes<HTMLDivElement> {
  inset?: boolean;
  radius?: number;
}

export const FocusRing: React.FC<FocusRingProps> = ({ inset = false, radius = 6, ...rest }) => {
  return <div data-halo-focus data-inset={inset ? 'true':'false'} data-radius={radius} className="halo-focus-ring" {...rest} />;
};

// Inject a lightweight style block once (idempotent)
if (typeof document !== 'undefined' && !document.getElementById('halo-focus-ring-styles')) {
  const styleEl = document.createElement('style');
  styleEl.id = 'halo-focus-ring-styles';
  styleEl.textContent = `
  .halo-focus-ring{position:absolute;pointer-events:none;transition:box-shadow 120ms ease;
    box-shadow:0 0 0 2px var(--focus-ring-color, var(--color-brand)), 0 0 12px 2px var(--focus-ring-glow, rgba(124,77,255,0.5));}
  .halo-focus-ring[data-inset="false"]{inset:-2px;}
  .halo-focus-ring[data-inset="true"]{inset:0;}
  .halo-focus-ring{border-radius:var(--halo-focus-radius, 6px);} 
  .halo-focus-ring[data-radius]{border-radius:var(--halo-focus-radius, 6px);} 
  `;
  document.head.appendChild(styleEl);
}

FocusRing.displayName = 'FocusRing';