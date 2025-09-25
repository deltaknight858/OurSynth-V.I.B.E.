'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import clsx from 'clsx'
import styled, { keyframes } from 'styled-components'
import Logo from './Logo'
import BottomNavbar from './layout/BottomNavbar'

// Keyframe animations
const glowPulse = keyframes`
  0%, 100% {
    box-shadow: 0 0 8px rgba(0, 255, 204, 0.3), 0 0 12px rgba(160, 32, 240, 0.2);
  }
  50% {
    box-shadow: 0 0 12px rgba(0, 255, 204, 0.6), 0 0 20px rgba(160, 32, 240, 0.4);
  }
`

const underlineGlow = keyframes`
  from {
    width: 0;
    opacity: 0;
  }
  to {
    width: 100%;
    opacity: 1;
  }
`

// Styled Components
const LayoutContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`

const FrostedHeader = styled.header`
  position: sticky;
  top: 0;
  width: 100%;
  z-index: 1000;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 0 0 12px 12px;
  padding: 0.5rem 1rem;
  transition: all 0.3s ease;
  
  &.scrolled {
    padding: 0.3rem 1rem;
    background: rgba(255, 255, 255, 0.15);
    box-shadow: 
      0 0 12px rgba(0, 255, 204, 0.2), 
      0 0 24px rgba(160, 32, 240, 0.1);
  }
`

const HeaderContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-lg);
  
  /* Add gradient border under logo area */
  border-bottom: 2px solid;
  border-image: linear-gradient(135deg, #00FFCC 0%, #A020F0 50%, #0066FF 100%) 1;
  
  @media (max-width: 768px) {
    flex-wrap: wrap;
    gap: var(--spacing-md);
  }
`

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  
  a {
    text-decoration: none;
    display: flex;
    align-items: center;
  }
`

const Navigation = styled.nav`
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  
  @media (max-width: 768px) {
    order: 3;
    flex-basis: 100%;
    justify-content: center;
  }
`

const IconButton = styled(Link)<{ $isActive: boolean }>`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 12px 16px;
  border-radius: 8px;
  color: ${props => props.$isActive ? 'white' : 'rgba(255, 255, 255, 0.8)'};
  font-weight: 500;
  font-size: 0.8rem;
  transition: all 0.3s ease;
  text-decoration: none;
  background: ${props => props.$isActive 
    ? 'linear-gradient(135deg, #00FFCC, #A020F0)' 
    : 'transparent'};
  border: 1px solid ${props => props.$isActive 
    ? 'rgba(255, 255, 255, 0.3)' 
    : 'transparent'};
  min-width: 44px; /* Touch target accessibility */
  
  .icon {
    font-size: 1.4rem;
    transition: all 0.3s ease;
    filter: drop-shadow(0 0 4px rgba(0, 255, 204, 0.3));
  }
  
  &:hover {
    background: linear-gradient(90deg, #00FFCC, #A020F0);
    color: white;
    transform: translateY(-2px);
    box-shadow: 
      0 0 8px rgba(0, 255, 204, 0.6), 
      0 0 16px rgba(160, 32, 240, 0.4),
      inset 0 1px 0 rgba(255, 255, 255, 0.2);
    
    .icon {
      transform: scale(1.1);
      filter: drop-shadow(0 0 8px rgba(0, 255, 204, 0.8));
    }
  }
  
  &:active {
    transform: translateY(0);
    box-shadow: 
      inset 0 2px 4px rgba(0, 0, 0, 0.2),
      0 0 8px rgba(0, 255, 204, 0.4);
  }
  
  &:focus {
    outline: 2px solid var(--accent-color);
    outline-offset: 2px;
  }
`

const Tooltip = styled.div<{ $visible: boolean }>`
  position: absolute;
  bottom: -35px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.9);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.7rem;
  white-space: nowrap;
  z-index: 1001;
  opacity: ${props => props.$visible ? 1 : 0};
  visibility: ${props => props.$visible ? 'visible' : 'hidden'};
  transition: all 0.3s ease;
  
  &::before {
    content: '';
    position: absolute;
    top: -4px;
    left: 50%;
    transform: translateX(-50%);
    border: 4px solid transparent;
    border-bottom-color: rgba(0, 0, 0, 0.9);
  }
  
  &::after {
    content: '';
    position: absolute;
    bottom: 2px;
    left: 50%;
    transform: translateX(-50%);
    width: 80%;
    height: 1px;
    background: linear-gradient(90deg, transparent, #00FFCC, #A020F0, transparent);
  }
`

const Controls = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
`

const GlowButton = styled.button<{ $isActive?: boolean; $variant?: 'preview' | 'profile' }>`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  border-radius: 8px;
  background: ${props => {
    if (props.$variant === 'profile') return 'rgba(255, 255, 255, 0.1)';
    return props.$isActive ? 'linear-gradient(90deg, #00FFCC, #A020F0)' : 'rgba(255, 255, 255, 0.1)';
  }};
  color: ${props => props.$isActive ? 'white' : 'var(--text-secondary)'};
  border: 1px solid rgba(255, 255, 255, 0.2);
  font-weight: 500;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  cursor: pointer;
  
  .icon {
    font-size: 1rem;
  }
  
  &:hover {
    background: linear-gradient(90deg, #00FFCC, #A020F0);
    color: white;
    transform: translateY(-2px);
    box-shadow: 
      0 0 8px rgba(0, 255, 204, 0.6), 
      0 0 12px rgba(160, 32, 240, 0.4);
  }
  
  &:active {
    transform: translateY(0);
  }
`

const MainContent = styled.main`
  flex: 1;
  padding: var(--spacing-lg) 0;
`

const MobileMenuToggle = styled.button`
  display: none;
  background: var(--glass-background);
  border: var(--glass-border);
  border-radius: var(--glass-border-radius);
  padding: var(--spacing-sm);
  color: var(--text-primary);
  
  @media (max-width: 768px) {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`

// Types
interface LayoutProps {
  children: React.ReactNode
}

type ViewMode = 'preview' | 'code'

const navigationLinks = [
  { 
    href: '/marketplace', 
    label: 'Marketplace', 
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M6 2L3 6v14c0 1.1.9 2 2 2h14c0-1.1-.9-2-2-2V6l-3-4H6z"/>
        <line x1="3" y1="6" x2="21" y2="6"/>
        <path d="M16 10a4 4 0 01-8 0"/>
      </svg>
    ), 
    ariaLabel: 'Browse marketplace' 
  },
  { 
    href: '/templates', 
    label: 'Templates', 
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="7" height="7"/>
        <rect x="14" y="3" width="7" height="7"/>
        <rect x="14" y="14" width="7" height="7"/>
        <rect x="3" y="14" width="7" height="7"/>
      </svg>
    ), 
    ariaLabel: 'View templates' 
  },
  { 
    href: '/studio', 
    label: 'Studio', 
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
      </svg>
    ), 
    ariaLabel: 'Open studio' 
  },
]

// SVG Icons for controls
const EyeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
)

const UserIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
)

// Enhanced Navigation Button Component
function NavButton({ 
  href, 
  label, 
  icon, 
  ariaLabel, 
  isActive 
}: { 
  href: string
  label: string
  icon: React.ReactNode
  ariaLabel: string
  isActive: boolean 
}) {
  const [showTooltip, setShowTooltip] = useState(false)

  return (
    <IconButton
      href={href}
      $isActive={isActive}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      onFocus={() => setShowTooltip(true)}
      onBlur={() => setShowTooltip(false)}
      aria-label={ariaLabel}
      role="button"
      tabIndex={0}
    >
      <span className="icon">{icon}</span>
      <span>{label}</span>
      <Tooltip $visible={showTooltip}>
        {label}
      </Tooltip>
    </IconButton>
  )
}

export function Layout({ children }: LayoutProps) {
  const pathname = usePathname()
  const [viewMode, setViewMode] = useState<ViewMode>('preview')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  const isActiveLink = (href: string) => {
    return pathname === href || (href !== '/' && pathname.startsWith(href))
  }

  // Handle scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <LayoutContainer>
      <FrostedHeader className={isScrolled ? 'scrolled' : ''}>
        <HeaderContent>
          {/* Logo */}
          <LogoContainer>
            <Link href="/">
              <Logo />
            </Link>
          </LogoContainer>

          {/* Mobile Menu Toggle */}
          <MobileMenuToggle
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="6" x2="21" y2="6"/>
              <line x1="3" y1="12" x2="21" y2="12"/>
              <line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
          </MobileMenuToggle>

          {/* Navigation */}
          <Navigation 
            className={clsx({ 'mobile-hidden': !isMobileMenuOpen })}
            role="navigation"
            aria-label="Main navigation"
          >
            {navigationLinks.map((link) => (
              <NavButton
                key={link.href}
                href={link.href}
                label={link.label}
                icon={link.icon}
                ariaLabel={link.ariaLabel}
                isActive={isActiveLink(link.href)}
              />
            ))}
          </Navigation>

          {/* Controls */}
          <Controls>
            <GlowButton
              $isActive={viewMode === 'preview'}
              onClick={() => setViewMode('preview')}
              aria-label="Toggle preview mode"
              onMouseEnter={(e) => {
                const tooltip = e.currentTarget.querySelector('.tooltip') as HTMLElement
                if (tooltip) tooltip.style.opacity = '1'
              }}
              onMouseLeave={(e) => {
                const tooltip = e.currentTarget.querySelector('.tooltip') as HTMLElement
                if (tooltip) tooltip.style.opacity = '0'
              }}
            >
              <span className="icon"><EyeIcon /></span>
              <span>Preview</span>
              <div className="tooltip" style={{
                position: 'absolute',
                bottom: '-35px',
                left: '50%',
                transform: 'translateX(-50%)',
                background: 'rgba(0, 0, 0, 0.9)',
                color: 'white',
                padding: '4px 8px',
                borderRadius: '4px',
                fontSize: '0.7rem',
                whiteSpace: 'nowrap',
                opacity: '0',
                transition: 'opacity 0.3s ease',
                pointerEvents: 'none',
                zIndex: 1002
              }}>
                Toggle Preview
                <div style={{
                  position: 'absolute',
                  bottom: '2px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '80%',
                  height: '1px',
                  background: 'linear-gradient(90deg, transparent, #00FFCC, #A020F0, transparent)'
                }}></div>
              </div>
            </GlowButton>
            
            <GlowButton
              $variant="profile"
              onClick={() => {/* Handle profile/logout */}}
              aria-label="User profile"
            >
              <span className="icon"><UserIcon /></span>
            </GlowButton>
          </Controls>
        </HeaderContent>
      </FrostedHeader>

      {/* Main Content */}
      <MainContent>
        {children}
      </MainContent>

      <BottomNavbar />
    </LayoutContainer>
  )
}

// Additional styles for mobile menu
const mobileMenuStyles = `
  @media (max-width: 768px) {
    .mobile-hidden {
      display: none;
    }
    
    .mobile-hidden.open {
      display: flex;
    }
  }
`

// Inject mobile styles
if (typeof document !== 'undefined') {
  const style = document.createElement('style')
  style.textContent = mobileMenuStyles
  document.head.appendChild(style)
}
