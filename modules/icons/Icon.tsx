/** Auto-generated from icon.svg. DO NOT EDIT DIRECTLY. */
import * as React from 'react';
export interface IconProps extends React.SVGProps<SVGSVGElement> { size?: number; title?: string; }
export const Icon: React.FC<IconProps> = ({ size = 24, title = 'Icon', ...props }) => (
  <svg role="img" width={size} height={size} aria-label={title} viewBox="0 0 320 320" xmlns="http://www.w3.org/2000/svg" {...props}>
    <title id="title">OurSynth icon</title>
    <desc id="desc">A friendly robot inside an iridescent ring with glass body, neon edge, and glossy sweep.</desc>
    <defs>
      <linearGradient id="edge" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="var(--logo-edge-start)" />
        <stop offset="100%" stopColor="var(--logo-edge-end)" />
      </linearGradient>
      <linearGradient id="gloss" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="var(--logo-gloss-top)" />
        <stop offset="50%" stopColor="var(--logo-gloss-mid)" />
        <stop offset="100%" stopColor="rgba(255,255,255,0)" />
      </linearGradient>
      <filter id="innerShadow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur in="SourceAlpha" stdDeviation="3" result="blur" />
        <feOffset dy="1" result="offset" />
        <feComposite in="offset" in2="SourceAlpha" operator="arithmetic" k2={-1} k3={1} result="inset" />
        <feColorMatrix in="inset" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.45 0" result="shadow" />
        <feBlend in="SourceGraphic" in2="shadow" mode="normal" />
      </filter>
      <g id="robot">
        <rect x="110" y="92" width="100" height="84" rx="20" ry="20" fill="currentColor" filter="url(#innerShadow)" />
        <rect x="110" y="92" width="100" height="84" rx="20" ry="20" fill="none" stroke="url(#edge)" strokeWidth="var(--logo-stroke)" opacity="0.9" />
        <circle cx="140" cy="130" r="8" fill="currentColor" />
        <circle cx="180" cy="130" r="8" fill="currentColor" />
        <rect x="120" y="176" width="80" height="56" rx="18" ry="18" fill="currentColor" filter="url(#innerShadow)" />
        <rect x="120" y="176" width="80" height="56" rx="18" ry="18" fill="none" stroke="url(#edge)" strokeWidth="var(--logo-stroke)" opacity="0.85" />
        <path d="M120 192c-12 0-20 10-20 22s8 22 20 22" fill="none" stroke="url(#edge)" strokeWidth="var(--logo-stroke)" />
        <path d="M200 192c12 0 20 10 20 22s-8 22-20 22" fill="none" stroke="url(#edge)" strokeWidth="var(--logo-stroke)" />
        <clipPath id="headClip"><rect x="110" y="92" width="100" height="84" rx="20" ry="20" /></clipPath>
        <rect x="110" y="92" width="100" height="30" fill="currentColor" clipPath="url(#headClip)" />
        <clipPath id="torsoClip"><rect x="120" y="176" width="80" height="56" rx="18" ry="18" /></clipPath>
        <rect x="120" y="176" width="80" height="22" fill="currentColor" clipPath="url(#torsoClip)" />
      </g>
    </defs>
    <circle cx="160" cy="160" r="132" fill="none" stroke="url(#edge)" strokeWidth="8" opacity="0.9" />
    <circle cx="160" cy="160" r="132" fill="none" stroke="currentColor" strokeOpacity="0.12" strokeWidth="1" />
    <use href="#robot" />
    <ellipse cx="160" cy="120" rx="120" ry="26" fill="currentColor" opacity="0.6" />
  </svg>
);
