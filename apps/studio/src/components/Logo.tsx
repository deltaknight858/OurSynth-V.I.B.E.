'use client';

import React from 'react';
import styled from 'styled-components';

const LogoWrapper = styled.div`
  background: transparent; /* Remove the frosted glass background that washes out the icon */
  border-radius: 8px;
  padding: 4px 8px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.1); /* Subtle border */
  max-width: 56px;
  max-height: 56px;
  flex-shrink: 0;

  &:hover {
    background: rgba(255, 255, 255, 0.05); /* Only add background on hover */
    backdrop-filter: blur(8px); /* Only add blur on hover */
    box-shadow: 
      0 0 8px rgba(0, 255, 204, 0.6), 
      0 0 12px rgba(160, 32, 240, 0.4);
    transform: translateY(-1px);
  }
`;

const LogoImage = styled.img`
  width: auto;
  height: 48px; /* Increase size to show the robot better */
  display: block;
  object-fit: contain;
  filter: drop-shadow(0 0 4px rgba(0, 255, 204, 0.3));
  transition: filter 0.3s ease;

  ${LogoWrapper}:hover & {
    filter: drop-shadow(0 0 6px rgba(0, 255, 204, 0.5));
  }
`;

interface LogoProps {
  className?: string;
  alt?: string;
  variant?: 'oursynth' | 'studio' | 'marketplace' | 'templates';
}

const Logo: React.FC<LogoProps> = ({ className, alt, variant = 'oursynth' }) => {
  const getLogoSrc = () => {
    switch (variant) {
      case 'studio':
        return '/assets/studio-logo.svg';
      case 'marketplace':
        return '/assets/marketplace-logo.svg'; // Will create this next
      case 'templates':
        return '/assets/templates-logo.svg'; // Will create this next
      default:
        return '/assets/oursynth-logo.svg';
    }
  };

  const getAltText = () => {
    if (alt) return alt;
    switch (variant) {
      case 'studio':
        return 'OurSynth Studio';
      case 'marketplace':
        return 'OurSynth Marketplace';
      case 'templates':
        return 'OurSynth Templates';
      default:
        return 'OurSynth';
    }
  };

  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.target as HTMLImageElement;
    // Try the main logo if variant fails
    if (!target.src.includes('oursynth-logo.svg')) {
      target.src = '/assets/oursynth-logo.svg';
    } else if (target.src.includes('oursynth-logo.svg')) {
      // Fallback to your robot PNG if SVG fails
      target.src = '/assets/logo.png';
    } else if (target.src.includes('logo.png')) {
      // Fallback to public SVG if PNG fails
      target.src = '/assets/logo.svg';
    } else {
      // Final fallback - hide image and show inline SVG
      target.style.display = 'none';
      const wrapper = target.parentElement;
      if (wrapper) {
        wrapper.innerHTML = `
          <svg 
            width="40" 
            height="40" 
            viewBox="0 0 40 40" 
            style="filter: drop-shadow(0 0 4px rgba(0, 255, 204, 0.3));"
          >
            <defs>
              <linearGradient id="fallbackGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#A020F0;stop-opacity:1" />
                <stop offset="50%" style="stop-color:#00FFCC;stop-opacity:1" />
                <stop offset="100%" style="stop-color:#0066FF;stop-opacity:1" />
              </linearGradient>
            </defs>
            <circle cx="20" cy="20" r="18" fill="url(#fallbackGradient)" />
            <path d="M12 28c0-4.4 3.6-8 8-8s8 3.6 8 8M20 12c-2.2 0-4 1.8-4 4s1.8 4 4 4 4-1.8 4-4-1.8-4-4-4z" fill="white" opacity="0.9"/>
            <text x="20" y="14" text-anchor="middle" fill="white" font-size="8" font-weight="bold">♪</text>
          </svg>
        `;
      }
    }
  };

  return (
    <LogoWrapper className={className}>
      <LogoImage 
        src={getLogoSrc()} 
        alt={getAltText()}
        onError={handleError}
      />
    </LogoWrapper>
  );
};

export default Logo;
