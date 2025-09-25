'use client'

import React, { useState, useMemo } from 'react'
import { useDrag } from 'react-dnd'
import styled, { keyframes, css } from 'styled-components'

// Types
interface Component {
  id: string
  type: string
  name: string
  icon: string
  color: string
  category: string
  description: string
  isFavorite?: boolean
  defaultProps?: Record<string, unknown>
}

interface ComponentPaletteProps {
  components: Component[]
  onToggleFavorite: (componentId: string) => void
}

// Keyframe animations
const neonGlow = keyframes`
  0%, 100% {
    box-shadow: 
      0 0 8px rgba(0, 255, 204, 0.4), 
      0 0 16px rgba(160, 32, 240, 0.3),
      inset 0 1px 0 rgba(255, 255, 255, 0.1);
  }
  50% {
    box-shadow: 
      0 0 12px rgba(0, 255, 204, 0.6), 
      0 0 24px rgba(160, 32, 240, 0.5),
      inset 0 1px 0 rgba(255, 255, 255, 0.2);
  }
`

const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`

const iconFloat = keyframes`
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-2px);
  }
`

// Styled Components
const PaletteContainer = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  padding: var(--spacing-lg);
  overflow-y: auto;
  max-height: calc(100vh - 200px);
  
  /* Custom scrollbar */
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: linear-gradient(180deg, #00FFCC, #A020F0);
    border-radius: 3px;
  }
`

const PaletteHeader = styled.div`
  margin-bottom: var(--spacing-lg);
`

const PaletteTitle = styled.h3`
  background: var(--primary-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-size: 1.3rem;
  font-weight: 700;
  margin: 0 0 var(--spacing-md) 0;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -4px;
    left: 0;
    width: 60px;
    height: 2px;
    background: var(--primary-gradient);
    border-radius: 1px;
    animation: ${neonGlow} 2s ease-in-out infinite;
  }
`

const SearchInput = styled.input`
  width: 100%;
  padding: var(--spacing-sm) var(--spacing-md);
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  color: var(--text-primary);
  font-size: 0.9rem;
  transition: all 0.3s ease;
  
  &::placeholder {
    color: var(--text-muted);
  }
  
  &:focus {
    outline: none;
    background: rgba(255, 255, 255, 0.1);
    border-color: var(--accent-color);
    box-shadow: 
      0 0 8px rgba(0, 255, 204, 0.3), 
      0 0 16px rgba(160, 32, 240, 0.2);
  }
`

const CategorySection = styled.div<{ $isOpen: boolean }>`
  margin-bottom: var(--spacing-md);
`

const CategoryHeader = styled.button<{ $isOpen: boolean }>`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-sm) var(--spacing-md);
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: var(--text-primary);
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
  min-height: 44px; /* Touch target accessibility */
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.3);
    box-shadow: 
      0 0 8px rgba(0, 255, 204, 0.2), 
      0 0 16px rgba(160, 32, 240, 0.1);
  }
  
  &:focus {
    outline: 2px solid var(--accent-color);
    outline-offset: 2px;
    background: rgba(255, 255, 255, 0.1);
  }
  
  .chevron {
    transition: transform 0.3s ease;
    transform: ${props => props.$isOpen ? 'rotate(180deg)' : 'rotate(0deg)'};
    filter: drop-shadow(0 0 4px rgba(0, 255, 204, 0.5));
  }
`

const CategoryContent = styled.div<{ $isOpen: boolean }>`
  overflow: hidden;
  transition: all 0.3s ease;
  max-height: ${props => props.$isOpen ? '1000px' : '0'};
  opacity: ${props => props.$isOpen ? '1' : '0'};
  
  ${props => props.$isOpen && css`
    animation: ${slideIn} 0.3s ease-out;
  `}
`

const ComponentGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) 0;
`

const ComponentCard = styled.div<{ $isDragging: boolean; $color: string; $isFavorite: boolean }>`
  position: relative;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  padding: var(--spacing-md);
  cursor: grab;
  transition: all 0.3s ease;
  opacity: ${props => props.$isDragging ? 0.5 : 1};
  min-height: 80px;
  min-width: 44px; /* Touch target accessibility */
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  
  ${props => props.$isFavorite && `
    border-color: var(--accent-color);
    background: rgba(0, 255, 204, 0.1);
    box-shadow: 0 0 8px rgba(0, 255, 204, 0.3);
  `}
  
  &:hover {
    background: rgba(255, 255, 255, 0.15);
    transform: translateY(-2px);
    box-shadow: 
      0 0 12px ${props => props.$color}40,
      0 0 24px ${props => props.$color}20,
      inset 0 1px 0 rgba(255, 255, 255, 0.2);
    border-color: ${props => props.$color};
    
    .component-icon {
      animation: ${iconFloat} 1s ease-in-out infinite;
    }
  }
  
  &:active {
    cursor: grabbing;
    transform: translateY(0);
  }
  
  &:focus {
    outline: 2px solid var(--accent-color);
    outline-offset: 2px;
  }
  
  /* Keyboard navigation */
  &:focus-visible {
    background: rgba(255, 255, 255, 0.2);
    border-color: var(--accent-color);
  }
`

const ComponentIcon = styled.div<{ $color: string }>`
  font-size: 1.5rem;
  margin-bottom: var(--spacing-xs);
  background: linear-gradient(135deg, ${props => props.$color}, #A020F0);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  filter: drop-shadow(0 0 4px ${props => props.$color}60);
  transition: all 0.3s ease;
`

const ComponentName = styled.div`
  color: var(--text-primary);
  font-weight: 500;
  font-size: 0.8rem;
  margin-bottom: var(--spacing-xs);
`

const FavoriteButton = styled.button<{ $isFavorite: boolean }>`
  position: absolute;
  top: 4px;
  right: 4px;
  background: transparent;
  border: none;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.3s ease;
  color: ${props => props.$isFavorite ? '#FFD700' : 'rgba(255, 255, 255, 0.4)'};
  
  &:hover {
    transform: scale(1.2);
    color: #FFD700;
    filter: drop-shadow(0 0 4px #FFD700);
  }
`

const Tooltip = styled.div<{ $visible: boolean }>`
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.9);
  color: white;
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: 4px;
  font-size: 0.7rem;
  white-space: nowrap;
  z-index: 1000;
  opacity: ${props => props.$visible ? 1 : 0};
  visibility: ${props => props.$visible ? 'visible' : 'hidden'};
  transition: all 0.3s ease;
  margin-bottom: 4px;
  max-width: 200px;
  white-space: normal;
  text-align: center;
  
  &::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border: 4px solid transparent;
    border-top-color: rgba(0, 0, 0, 0.9);
  }
  
  &::before {
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

const LivePreview = styled.div<{ $visible: boolean; $color: string }>`
  position: absolute;
  bottom: 120%;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.95);
  border: 1px solid ${props => props.$color};
  border-radius: 8px;
  padding: var(--spacing-sm);
  z-index: 1001;
  opacity: ${props => props.$visible ? 1 : 0};
  visibility: ${props => props.$visible ? 'visible' : 'hidden'};
  transition: all 0.3s ease;
  min-width: 120px;
  min-height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(12px);
  box-shadow: 
    0 0 12px ${props => props.$color}40,
    0 0 24px ${props => props.$color}20;
  
  &::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border: 6px solid transparent;
    border-top-color: ${props => props.$color};
  }
`

const FavoritesSection = styled.div`
  margin-bottom: var(--spacing-lg);
`

const FavoritesTitle = styled.h4`
  color: var(--text-primary);
  font-size: 1rem;
  font-weight: 600;
  margin: 0 0 var(--spacing-sm) 0;
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  
  &::before {
    content: '⭐';
    font-size: 0.8rem;
  }
`

// Draggable Component Card
function DraggableComponentCard({ 
  component, 
  onToggleFavorite 
}: { 
  component: Component
  onToggleFavorite: (id: string) => void 
}) {
  const [hoveredTooltip, setHoveredTooltip] = useState(false)
  const [showLivePreview, setShowLivePreview] = useState(false)
  
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'component',
    item: { 
      id: component.id, 
      type: component.type, 
      name: component.name,
      color: component.color 
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }))

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      // Could trigger drag start or other action
    }
    if (e.key === 'f' || e.key === 'F') {
      e.preventDefault()
      onToggleFavorite(component.id)
    }
  }

  const renderLivePreview = () => {
    // Simple component preview based on type
    const previewMap: Record<string, string> = {
      input: '📝 Input Field',
      processor: '⚙️ Data Processing',
      output: '📊 Output Display',
      database: '🗄️ Data Storage',
      api: '🔌 API Integration',
      auth: '🔐 Authentication',
      ui: '🎨 UI Component',
      logic: '🧠 Business Logic',
      chart: '📈 Chart Display',
      notification: '🔔 Alert System',
      timer: '⏱️ Timer Control',
      file: '📎 File Handler'
    }
    
    return previewMap[component.type] || '🔧 Component'
  }

  return (
    <ComponentCard
      ref={drag as React.LegacyRef<HTMLDivElement>}
      $isDragging={isDragging}
      $color={component.color}
      $isFavorite={component.isFavorite || false}
      onMouseEnter={() => {
        setHoveredTooltip(true)
        setShowLivePreview(true)
      }}
      onMouseLeave={() => {
        setHoveredTooltip(false)
        setShowLivePreview(false)
      }}
      onFocus={() => {
        setHoveredTooltip(true)
        setShowLivePreview(true)
      }}
      onBlur={() => {
        setHoveredTooltip(false)
        setShowLivePreview(false)
      }}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`${component.name} component. ${component.description}. ${component.isFavorite ? 'Favorited' : 'Not favorited'}. Press F to toggle favorite.`}
    >
      <FavoriteButton
        $isFavorite={component.isFavorite || false}
        onClick={(e) => {
          e.stopPropagation()
          onToggleFavorite(component.id)
        }}
        aria-label={`${component.isFavorite ? 'Remove from' : 'Add to'} favorites`}
      >
        ★
      </FavoriteButton>
      
      <ComponentIcon 
        className="component-icon"
        $color={component.color}
      >
        {component.icon}
      </ComponentIcon>
      
      <ComponentName>{component.name}</ComponentName>
      
      <Tooltip $visible={hoveredTooltip}>
        {component.description}
      </Tooltip>
      
      <LivePreview $visible={showLivePreview} $color={component.color}>
        {renderLivePreview()}
      </LivePreview>
    </ComponentCard>
  )
}

// Main Component Palette
export function ComponentPalette({ components, onToggleFavorite }: ComponentPaletteProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [openCategories, setOpenCategories] = useState<Set<string>>(new Set(['Inputs']))

  // Group components by category and apply search filter
  const { filteredComponents, categories, favorites } = useMemo(() => {
    const filtered = components.filter(component =>
      component.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      component.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      component.description.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const categoryMap = new Map<string, Component[]>()
    const favoritesList: Component[] = []

    filtered.forEach(component => {
      if (component.isFavorite) {
        favoritesList.push(component)
      }
      
      if (!categoryMap.has(component.category)) {
        categoryMap.set(component.category, [])
      }
      categoryMap.get(component.category)!.push(component)
    })

    return {
      filteredComponents: filtered,
      categories: Array.from(categoryMap.entries()),
      favorites: favoritesList
    }
  }, [components, searchTerm])

  const toggleCategory = (category: string) => {
    setOpenCategories(prev => {
      const newSet = new Set(prev)
      if (newSet.has(category)) {
        newSet.delete(category)
      } else {
        newSet.add(category)
      }
      return newSet
    })
  }

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setSearchTerm('')
    }
  }

  return (
    <PaletteContainer role="region" aria-label="Component Palette">
      <PaletteHeader>
        <PaletteTitle>Component Palette</PaletteTitle>
        <SearchInput
          type="text"
          placeholder="Search components... (ESC to clear)"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleSearchKeyDown}
          aria-label="Search components"
        />
      </PaletteHeader>

      {favorites.length > 0 && (
        <FavoritesSection role="region" aria-label="Favorite Components">
          <FavoritesTitle>Favorites</FavoritesTitle>
          <ComponentGrid role="grid" aria-label="Favorite components grid">
            {favorites.map(component => (
              <DraggableComponentCard
                key={`fav-${component.id}`}
                component={component}
                onToggleFavorite={onToggleFavorite}
              />
            ))}
          </ComponentGrid>
        </FavoritesSection>
      )}

      {categories.map(([category, categoryComponents]) => (
        <CategorySection key={category} $isOpen={openCategories.has(category)}>
          <CategoryHeader 
            onClick={() => toggleCategory(category)}
            $isOpen={openCategories.has(category)}
            aria-expanded={openCategories.has(category)}
            aria-controls={`category-${category}`}
          >
            <span>{category} ({categoryComponents.length})</span>
            <span className="chevron" aria-hidden="true">▼</span>
          </CategoryHeader>
          
          <CategoryContent 
            $isOpen={openCategories.has(category)}
            id={`category-${category}`}
            role="region"
            aria-label={`${category} components`}
          >
            <ComponentGrid role="grid" aria-label={`${category} components grid`}>
              {categoryComponents.map(component => (
                <DraggableComponentCard
                  key={component.id}
                  component={component}
                  onToggleFavorite={onToggleFavorite}
                />
              ))}
            </ComponentGrid>
          </CategoryContent>
        </CategorySection>
      ))}
    </PaletteContainer>
  )
}
