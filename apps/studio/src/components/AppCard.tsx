'use client'

import React from 'react'
import Link from 'next/link'
import styled from 'styled-components'

interface App {
  id: string
  name: string
  slug: string
  logo_url?: string
  price: number
  rating: number
  tagline: string
  description?: string
  category?: string
  featured?: boolean
  downloads?: number
}

interface AppCardProps {
  app: App
  featured?: boolean
}

// Styled Components
const Card = styled.div<{ $featured?: boolean }>`
  background: var(--glass-background);
  backdrop-filter: var(--glass-backdrop-filter);
  border: var(--glass-border);
  border-radius: var(--glass-border-radius);
  padding: var(--spacing-lg);
  transition: var(--transition-normal);
  position: relative;
  overflow: hidden;
  
  ${props => props.$featured && `
    border-color: var(--accent-color);
    box-shadow: 0 0 20px rgba(160, 32, 240, 0.2);
  `}
  
  &:hover {
    transform: translateY(-4px);
    border-color: var(--accent-color);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: var(--primary-gradient);
    opacity: ${props => props.$featured ? 1 : 0};
    transition: var(--transition-normal);
  }
  
  &:hover::before {
    opacity: 1;
  }
`

const AppHeader = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-md);
`

const AppLogo = styled.div<{ $logoUrl?: string }>`
  width: 48px;
  height: 48px;
  border-radius: var(--glass-border-radius);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  background: ${props => props.$logoUrl 
    ? `url(${props.$logoUrl}) center/cover` 
    : 'var(--primary-gradient)'};
  border: 1px solid rgba(255, 255, 255, 0.1);
`

const AppInfo = styled.div`
  flex: 1;
  min-width: 0;
`

const AppName = styled.h3`
  background: var(--primary-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-size: 1.2rem;
  font-weight: 600;
  margin: 0 0 var(--spacing-xs) 0;
  line-height: 1.3;
`

const AppTagline = styled.p`
  color: var(--text-secondary);
  font-size: 0.9rem;
  margin: 0;
  line-height: 1.4;
`

const AppMeta = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-md);
`

const PriceBadge = styled.span<{ $free?: boolean }>`
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 600;
  background: ${props => props.$free 
    ? 'linear-gradient(135deg, #22c55e, #16a34a)' 
    : 'var(--primary-gradient)'};
  color: white;
`

const Rating = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  color: var(--text-secondary);
  font-size: 0.9rem;
`

const Stars = styled.div`
  display: flex;
  gap: 2px;
`

const Star = styled.span<{ $filled?: boolean }>`
  color: ${props => props.$filled ? '#fbbf24' : '#374151'};
  font-size: 0.8rem;
`

const CategoryBadge = styled.span`
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 0.75rem;
  background: rgba(255, 255, 255, 0.1);
  color: var(--text-muted);
  border: 1px solid rgba(255, 255, 255, 0.1);
`

const AppDescription = styled.p`
  color: var(--text-secondary);
  font-size: 0.9rem;
  line-height: 1.5;
  margin-bottom: var(--spacing-md);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`

const AppActions = styled.div`
  display: flex;
  gap: var(--spacing-sm);
  align-items: center;
`

const ActionButton = styled(Link)<{ $primary?: boolean }>`
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--glass-border-radius);
  font-size: 0.9rem;
  font-weight: 500;
  text-decoration: none;
  transition: var(--transition-normal);
  border: 1px solid;
  text-align: center;
  
  ${props => props.$primary ? `
    background: var(--primary-gradient);
    border-color: transparent;
    color: white;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(160, 32, 240, 0.3);
    }
  ` : `
    background: transparent;
    border-color: rgba(255, 255, 255, 0.2);
    color: var(--text-primary);
    
    &:hover {
      border-color: var(--accent-color);
      background: rgba(255, 255, 255, 0.05);
    }
  `}
`

const DownloadCount = styled.span`
  color: var(--text-muted);
  font-size: 0.8rem;
  margin-left: auto;
`

const FeaturedBadge = styled.div`
  position: absolute;
  top: var(--spacing-sm);
  right: var(--spacing-sm);
  background: var(--primary-gradient);
  color: white;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`

// Helper function to get app icon based on category
function getAppIcon(category?: string): string {
  switch (category) {
    case 'Productivity': return '⚡';
    case 'Developer Tools': return '🛠️';
    case 'Design Tools': return '🎨';
    case 'Analytics': return '📊';
    case 'Communication': return '💬';
    case 'Utilities': return '🔧';
    default: return '📱';
  }
}

// Helper function to render star rating
function renderStars(rating: number) {
  const stars = []
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <Star key={i} $filled={i <= Math.floor(rating)}>
        ★
      </Star>
    )
  }
  return stars
}

// Helper function to format download count
function formatDownloads(downloads?: number): string {
  if (!downloads) return '0 downloads'
  if (downloads < 1000) return `${downloads} downloads`
  if (downloads < 1000000) return `${(downloads / 1000).toFixed(1)}k downloads`
  return `${(downloads / 1000000).toFixed(1)}M downloads`
}

export default function AppCard({ app, featured = false }: AppCardProps) {
  const isAppFeatured = featured || app.featured
  const isFree = app.price === 0

  return (
    <Card $featured={isAppFeatured}>
      {isAppFeatured && <FeaturedBadge>Featured</FeaturedBadge>}
      
      <AppHeader>
        <AppLogo $logoUrl={app.logo_url}>
          {!app.logo_url && getAppIcon(app.category)}
        </AppLogo>
        
        <AppInfo>
          <AppName>{app.name}</AppName>
          <AppTagline>{app.tagline}</AppTagline>
        </AppInfo>
      </AppHeader>

      <AppMeta>
        <PriceBadge $free={isFree}>
          {isFree ? 'Free' : `$${app.price}`}
        </PriceBadge>
        
        <Rating>
          <Stars>{renderStars(app.rating)}</Stars>
          <span>{app.rating.toFixed(1)}</span>
        </Rating>

        {app.category && (
          <CategoryBadge>{app.category}</CategoryBadge>
        )}
      </AppMeta>

      {app.description && (
        <AppDescription>{app.description}</AppDescription>
      )}

      <AppActions>
        <ActionButton 
          href={`/apps/${app.slug}`} 
          $primary
        >
          Learn More
        </ActionButton>
        
        <ActionButton href={`/apps/${app.slug}/install`}>
          {isFree ? 'Install' : 'Purchase'}
        </ActionButton>

        {app.downloads && (
          <DownloadCount>
            {formatDownloads(app.downloads)}
          </DownloadCount>
        )}
      </AppActions>
    </Card>
  )
}
