import React, { PropsWithChildren } from 'react';

export interface ScrollAreaProps extends PropsWithChildren<{ height?: number | string }>{ }

export const ScrollArea: React.FC<ScrollAreaProps> = ({ height = 240, children }) => {
  const styleVar = typeof height === 'number' ? `${height}px` : height;
  return (
    <div className="halo-scroll-area" data-halo-scroll data-maxh={styleVar}>
      {children}
    </div>
  );
};

// Inject a lightweight style block once (idempotent)
if (typeof document !== 'undefined' && !document.getElementById('halo-scroll-area-styles')) {
  const styleEl = document.createElement('style');
  styleEl.id = 'halo-scroll-area-styles';
  styleEl.textContent = `
    .halo-scroll-area{overflow:auto; max-height:attr(data-maxh);
      scrollbar-width: thin;
    }
    .halo-scroll-area::-webkit-scrollbar{height:10px;width:10px}
    .halo-scroll-area::-webkit-scrollbar-track{background:var(--scrollbar-track, rgba(255,255,255,0.06));border-radius:var(--radius-sm,6px)}
    .halo-scroll-area::-webkit-scrollbar-thumb{background:var(--scrollbar-thumb, rgba(255,255,255,0.18));border-radius:var(--radius-sm,6px);border:2px solid transparent;background-clip:content-box}
    .halo-scroll-area:hover::-webkit-scrollbar-thumb{background:var(--scrollbar-thumb-hover, rgba(255,255,255,0.28))}
  `;
  document.head.appendChild(styleEl);
}