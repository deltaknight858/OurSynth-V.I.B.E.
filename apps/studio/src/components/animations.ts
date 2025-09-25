import { keyframes } from 'styled-components';

export const animations = {
  fadeIn: keyframes`
    from { opacity: 0; }
    to { opacity: 1; }
  `,
  
  slideInFromTop: keyframes`
    from {
      opacity: 0;
      transform: translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  `,
  
  slideInFromLeft: keyframes`
    from {
      opacity: 0;
      transform: translateX(-20px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  `,
  
  scaleIn: keyframes`
    from {
      opacity: 0;
      transform: scale(0.9);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  `,
  
  bounce: keyframes`
    0%, 20%, 50%, 80%, 100% {
      transform: translateY(0);
    }
    40% {
      transform: translateY(-10px);
    }
    60% {
      transform: translateY(-5px);
    }
  `,
  
  pulse: keyframes`
    0% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.05);
    }
    100% {
      transform: scale(1);
    }
  `,
  
  shimmer: keyframes`
    0% {
      background-position: -200% 0;
    }
    100% {
      background-position: 200% 0;
    }
  `
};

export const animationPresets = {
  default: {
    name: 'Default',
    css: `
      animation: \${animations.fadeIn} 0.3s ease-out;
    `
  },
  
  popIn: {
    name: 'Pop In',
    css: `
      animation: \${animations.scaleIn} 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
    `
  },
  
  slideDown: {
    name: 'Slide Down',
    css: `
      animation: \${animations.slideInFromTop} 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    `
  },
  
  slideLeft: {
    name: 'Slide Left',
    css: `
      animation: \${animations.slideInFromLeft} 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    `
  },
  
  bouncy: {
    name: 'Bouncy',
    css: `
      animation: \${animations.bounce} 1s ease-out;
    `
  },
  
  gentle: {
    name: 'Gentle Pulse',
    css: `
      animation: \${animations.pulse} 2s ease-in-out infinite;
    `
  },
  
  shimmer: {
    name: 'Shimmer',
    css: `
      background: linear-gradient(
        90deg,
        rgba(255,255,255,0) 0%,
        rgba(255,255,255,0.1) 50%,
        rgba(255,255,255,0) 100%
      );
      background-size: 200% 100%;
      animation: \${animations.shimmer} 2s linear infinite;
    `
  }
};
