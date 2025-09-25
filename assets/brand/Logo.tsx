import * as React from "react";

export const Logo = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 560 360" xmlns="http://www.w3.org/2000/svg" {...props}>
    <title id="title">OurSynth logo</title>
    <desc id="desc">Glass robot inside an iridescent ring with a glossy wordmark below.</desc>
    <defs>
      <linearGradient id="edge" x1={0} y1={0} x2={1} y2={1}>
        <stop offset="0%" stopColor="var(--logo-edge-start)" />
        <stop offset="100%" stopColor="var(--logo-edge-end)" />
      </linearGradient>
      <linearGradient id="gloss" x1={0} y1={0} x2={0} y2={1}>
        <stop offset="0%" stopColor="var(--logo-gloss-top)" />
        <stop offset="50%" stopColor="var(--logo-gloss-mid)" />
        <stop offset="100%" stopColor="rgba(255,255,255,0)" />
      </linearGradient>
      <filter id="innerShadow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur in="SourceAlpha" stdDeviation={3} result="blur" />
        <feOffset dy={1} result="offset" />
        <feComposite
          in="offset"
          in2="SourceAlpha"
          operator="arithmetic"
          k2={-1}
          k3={1}
          result="inset"
        />
        <feColorMatrix
          in="inset"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.45 0"
          result="shadow"
        />
        <feBlend in="SourceGraphic" in2="shadow" mode="normal" />
      </filter>
      <g id="robot">
        <rect
          x={-50}
          y={-84}
          width={100}
          height={84}
          rx={20}
          ry={20}
          fill="var(--logo-glass-fill)"
          filter="url(#innerShadow)"
        />
        <rect
          x={-50}
          y={-84}
          width={100}
          height={84}
          rx={20}
          ry={20}
          fill="none"
          stroke="url(#edge)"
          strokeWidth="var(--logo-stroke)"
          opacity={0.9}
        />
        <circle cx={-20} cy={-46} r={8} fill="var(--logo-eye)" />
        <circle cx={20} cy={-46} r={8} fill="var(--logo-eye)" />
        <rect
          x={-40}
          y={0}
          width={80}
          height={56}
          rx={18}
          ry={18}
          fill="var(--logo-glass-fill)"
          filter="url(#innerShadow)"
        />
        <rect
          x={-40}
          y={0}
          width={80}
          height={56}
          rx={18}
          ry={18}
          fill="none"
          stroke="url(#edge)"
          strokeWidth="var(--logo-stroke)"
          opacity={0.85}
        />
        <path
          d="M-40 16c-12 0-20 10-20 22s8 22 20 22"
          fill="none"
          stroke="url(#edge)"
          strokeWidth="var(--logo-stroke)"
          strokeLinecap="round"
        />
        <path
          d="M40 16c12 0 20 10 20 22s-8 22-20 22"
          fill="none"
          stroke="url(#edge)"
          strokeWidth="var(--logo-stroke)"
          strokeLinecap="round"
        />
        <clipPath id="hClip">
          <rect x={-50} y={-84} width={100} height={84} rx={20} ry={20} />
        </clipPath>
        <rect x={-50} y={-84} width={100} height={30} fill="url(#gloss)" clipPath="url(#hClip)" />
        <clipPath id="tClip">
          <rect x={-40} y={0} width={80} height={56} rx={18} ry={18} />
        </clipPath>
        <rect x={-40} y={0} width={80} height={22} fill="url(#gloss)" clipPath="url(#tClip)" />
      </g>
    </defs>
    <g transform="translate(280 160)">
      <circle cx={0} cy={0} r={132} fill="none" stroke="url(#edge)" strokeWidth={8} opacity={0.9} />
      <circle
        cx={0}
        cy={0}
        r={132}
        fill="none"
        stroke="currentColor"
        strokeOpacity={0.12}
        strokeWidth={1}
      />
      <use href="#robot" transform="scale(0.8) translate(0, 20)" />
      <ellipse cx={0} cy={-28} rx={88} ry={18} fill="url(#gloss)" opacity={0.6} />
    </g>
    <g transform="translate(280 320)">
      <text
        x={0}
        y={0}
        textAnchor="middle"
        dominantBaseline="middle"
        fontFamily="Inter, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Ubuntu, Cantarell, 'Noto Sans'"
        fontSize={56}
        fontWeight={600}
        letterSpacing={0.2}
      >
        OurSynth
      </text>
      <rect x={-170} y={-34} width={340} height={22} fill="url(#gloss)" opacity={0.8} />
    </g>
  </svg>
);
