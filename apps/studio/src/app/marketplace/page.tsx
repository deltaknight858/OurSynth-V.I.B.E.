'use client'

import React, { useState, useEffect } from 'react'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import styled from 'styled-components'
import clsx from 'clsx'

// Types
interface App {
  id: string
  name: string
  description?: string
  price: number
  rating: number
  thumbnail_url?: string
  category?: string
  created_at: string
}

// Styled Components
const MarketplaceContainer = styled.div`
  padding: var(--spacing-lg) 0;
`

const SearchSection = styled.div`
  background: var(--glass-background);
  backdrop-filter: var(--glass-backdrop-filter);
  border: var(--glass-border);
  border-radius: var(--glass-border-radius);
  padding: var(--spacing-xl);
  margin-bottom: var(--spacing-xl);
`

const SearchInput = styled.input`
  width: 100%;
  padding: var(--spacing-md);
  background: var(--glass-background-dark);
  border: var(--glass-border);
  border-radius: var(--glass-border-radius);
  color: var(--text-primary);
  font-size: 1rem;
  transition: var(--transition-normal);
  
  &::placeholder {
    color: var(--text-muted);
  }
  
  &:focus {
    outline: none;
    border-color: var(--accent-color);
    box-shadow: 0 0 0 2px rgba(0, 255, 204, 0.2);
  }
`

const FilterSection = styled.div`
  display: flex;
  gap: var(--spacing-md);
  margin-top: var(--spacing-md);
  flex-wrap: wrap;
  align-items: center;
`

const FilterButton = styled.button<{ $active?: boolean }>`
  padding: var(--spacing-sm) var(--spacing-md);
  background: ${props => props.$active ? 'var(--accent-color)' : 'var(--glass-background-dark)'};
  color: ${props => props.$active ? 'var(--background-primary)' : 'var(--text-secondary)'};
  border: var(--glass-border);
  border-radius: var(--glass-border-radius);
  font-weight: 500;
  transition: var(--transition-normal);
  cursor: pointer;
  
  &:hover {
    background: ${props => props.$active ? 'var(--accent-color)' : 'var(--glass-background)'};
    color: ${props => props.$active ? 'var(--background-primary)' : 'var(--accent-color)'};
    transform: translateY(-1px);
  }
`

const ProductsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: var(--spacing-lg);
  margin-top: var(--spacing-xl);
`

const ProductCard = styled.div`
  background: var(--glass-background);
  backdrop-filter: var(--glass-backdrop-filter);
  border: var(--glass-border);
  border-radius: var(--glass-border-radius);
  box-shadow: var(--glass-box-shadow);
  overflow: hidden;
  transition: var(--transition-normal);
  cursor: pointer;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: var(--glass-box-shadow-strong);
    border-color: var(--accent-color);
  }
`

const ProductThumbnail = styled.div<{ $backgroundImage?: string }>`
  height: 200px;
  background: ${props => props.$backgroundImage 
    ? `url(${props.$backgroundImage})` 
    : 'var(--primary-gradient)'};
  background-size: cover;
  background-position: center;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.3);
  }
`

const ThumbnailPlaceholder = styled.div`
  font-size: 3rem;
  color: white;
  position: relative;
  z-index: 1;
`

const ProductInfo = styled.div`
  padding: var(--spacing-lg);
`

const ProductName = styled.h3`
  color: var(--text-primary);
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: var(--spacing-sm);
  line-height: 1.3;
`

const ProductDescription = styled.p`
  color: var(--text-secondary);
  font-size: 0.9rem;
  line-height: 1.5;
  margin-bottom: var(--spacing-md);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`

const ProductFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: var(--spacing-md);
`

const ProductPrice = styled.div`
  color: var(--accent-color);
  font-size: 1.1rem;
  font-weight: 600;
`

const StarRating = styled.div`
  display: flex;
  gap: 2px;
  align-items: center;
`

const Star = styled.span<{ $filled: boolean }>`
  color: ${props => props.$filled ? '#fbbf24' : 'var(--text-muted)'};
  font-size: 1rem;
`

const LoadingState = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-xxl);
  color: var(--text-secondary);
  
  .spinner {
    width: 40px;
    height: 40px;
    border: 3px solid var(--glass-background);
    border-top: 3px solid var(--accent-color);
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`

const ErrorState = styled.div`
  background: var(--glass-background);
  border: var(--glass-border);
  border-radius: var(--glass-border-radius);
  padding: var(--spacing-xl);
  text-align: center;
  color: var(--text-secondary);
`

const categories = ['All', 'Synthesizers', 'Samples', 'Effects', 'Templates', 'Utilities']

export default function MarketplacePage() {
  const [apps, setApps] = useState<App[]>([])
  const [filteredApps, setFilteredApps] = useState<App[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')

  useEffect(() => {
    fetchApps()
  }, [])

  useEffect(() => {
    filterApps()
  }, [apps, searchTerm, selectedCategory]) // filterApps is stable, no need to include

  const fetchApps = async () => {
    try {
      setLoading(true)
      
      // If Supabase is not configured, use mock data
      if (!isSupabaseConfigured) {
        console.log('Supabase not configured, using mock data')
        setApps(mockApps)
        setError(null)
        return
      }

      const { data, error } = await supabase
        .from('apps')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        // Check if it's a table not found error (PGRST106)
        if (error.code === 'PGRST106' || error.message?.includes('relation') || error.message?.includes('does not exist')) {
          console.log('Apps table does not exist yet, using mock data for development')
          setApps(mockApps)
          setError(null)
          setLoading(false)
          return
        }
        throw error
      }

      setApps(data || [])
      setError(null)
    } catch (err) {
      console.error('Error fetching apps:', err)
      setError('Failed to load marketplace items. Please try again later.')
      // Fallback mock data for development
      setApps(mockApps)
    } finally {
      setLoading(false)
    }
  }

  const filterApps = () => {
    let filtered = apps

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(app =>
        app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.description?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(app => 
        app.category?.toLowerCase() === selectedCategory.toLowerCase()
      )
    }

    setFilteredApps(filtered)
  }

  const renderStars = (rating: number) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 !== 0

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<Star key={i} $filled={true}>★</Star>)
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<Star key={i} $filled={true}>☆</Star>)
      } else {
        stars.push(<Star key={i} $filled={false}>☆</Star>)
      }
    }

    return stars
  }

  const formatPrice = (price: number) => {
    return price === 0 ? 'Free' : `$${price.toFixed(2)}`
  }

  if (loading) {
    return (
      <div className="container">
        <LoadingState>
          <div>
            <div className="spinner"></div>
            <p style={{ marginTop: 'var(--spacing-md)' }}>Loading marketplace...</p>
          </div>
        </LoadingState>
      </div>
    )
  }

  return (
    <div className="container">
      <MarketplaceContainer>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-xl)' }}>
          <h1 className="gradient-text" style={{ fontSize: '2.5rem', marginBottom: 'var(--spacing-md)' }}>
            UI Marketplace
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
            Discover and purchase professional UI components, templates, and design tools created by the community.
          </p>
        </div>

        {/* Search and Filters */}
        <SearchSection>
          <SearchInput
            type="text"
            placeholder="Search for components, templates, icons..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          
          <FilterSection>
            <span style={{ color: 'var(--text-secondary)', fontWeight: '500' }}>Categories:</span>
            {categories.map((category) => (
              <FilterButton
                key={category}
                $active={selectedCategory === category}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </FilterButton>
            ))}
          </FilterSection>
        </SearchSection>

        {/* Error State */}
        {error && (
          <ErrorState>
            <h3 style={{ color: 'var(--accent-color)', marginBottom: 'var(--spacing-md)' }}>
              Oops! Something went wrong
            </h3>
            <p>{error}</p>
            <button 
              onClick={fetchApps}
              style={{
                marginTop: 'var(--spacing-md)',
                padding: 'var(--spacing-sm) var(--spacing-md)',
                background: 'var(--accent-color)',
                color: 'var(--background-primary)',
                border: 'none',
                borderRadius: 'var(--glass-border-radius)',
                cursor: 'pointer'
              }}
            >
              Try Again
            </button>
          </ErrorState>
        )}

        {/* Products Grid */}
        {!error && (
          <>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: 'var(--spacing-md)',
              color: 'var(--text-secondary)'
            }}>
              <span>{filteredApps.length} items found</span>
              {searchTerm && (
                <span>Results for &ldquo;{searchTerm}&rdquo;</span>
              )}
            </div>

            {filteredApps.length === 0 ? (
              <ErrorState>
                <h3 style={{ color: 'var(--accent-color)', marginBottom: 'var(--spacing-md)' }}>
                  No items found
                </h3>
                <p>Try adjusting your search terms or category filter.</p>
              </ErrorState>
            ) : (
              <ProductsGrid>
                {filteredApps.map((app) => (
                  <ProductCard key={app.id}>
                    <ProductThumbnail $backgroundImage={app.thumbnail_url}>
                      {!app.thumbnail_url && (
                        <ThumbnailPlaceholder>
                          {getComponentIcon(app.category)}
                        </ThumbnailPlaceholder>
                      )}
                    </ProductThumbnail>
                    
                    <ProductInfo>
                      <ProductName>{app.name}</ProductName>
                      
                      {app.description && (
                        <ProductDescription>{app.description}</ProductDescription>
                      )}
                      
                      <ProductFooter>
                        <ProductPrice>{formatPrice(app.price)}</ProductPrice>
                        
                        <StarRating>
                          {renderStars(app.rating)}
                          <span style={{ 
                            marginLeft: 'var(--spacing-xs)', 
                            color: 'var(--text-muted)', 
                            fontSize: '0.9rem' 
                          }}>
                            {app.rating.toFixed(1)}
                          </span>
                        </StarRating>
                      </ProductFooter>
                    </ProductInfo>
                  </ProductCard>
                ))}
              </ProductsGrid>
            )}
          </>
        )}
      </MarketplaceContainer>
    </div>
  )
}

// Helper function to get icon based on category
function getComponentIcon(category?: string): string {
  switch (category) {
    case 'Component Libraries': return '🧩';
    case 'Templates': return '📄';
    case 'Animations': return '✨';
    case 'E-commerce': return '🛒';
    case 'Icons': return '⭐';
    case 'Components': return '🔧';
    case 'Mobile': return '📱';
    case 'Data Viz': return '📊';
    case 'Design Tools': return '🎨';
    default: return '🖼️';
  }
}

// Mock data for development/fallback
const mockApps: App[] = [
  {
    id: '1',
    name: 'Modern UI Kit',
    description: 'Complete set of modern UI components with buttons, cards, and forms',
    price: 29.99,
    rating: 4.8,
    category: 'Component Libraries',
    created_at: '2024-01-15T10:00:00Z'
  },
  {
    id: '2',
    name: 'Dashboard Templates',
    description: 'Professional dashboard layouts for admin panels and analytics',
    price: 0,
    rating: 4.6,
    category: 'Templates',
    created_at: '2024-01-14T10:00:00Z'
  },
  {
    id: '3',
    name: 'Animation Pack',
    description: 'Smooth CSS animations and micro-interactions for better UX',
    price: 15.99,
    rating: 4.9,
    category: 'Animations',
    created_at: '2024-01-13T10:00:00Z'
  },
  {
    id: '4',
    name: 'E-commerce Components',
    description: 'Shopping cart, product cards, and checkout form components',
    price: 24.99,
    rating: 4.7,
    category: 'E-commerce',
    created_at: '2024-01-12T10:00:00Z'
  },
  {
    id: '5',
    name: 'Icon Collection Pro',
    description: 'Over 2000 professional icons in multiple styles and formats',
    price: 49.99,
    rating: 4.5,
    category: 'Icons',
    created_at: '2024-01-11T10:00:00Z'
  },
  {
    id: '6',
    name: 'Landing Page Builder',
    description: 'Pre-built sections for creating stunning landing pages quickly',
    price: 19.99,
    rating: 4.4,
    category: 'Templates',
    created_at: '2024-01-10T10:00:00Z'
  },
  {
    id: '7',
    name: 'Form Components',
    description: 'Advanced form elements with validation and styling',
    price: 0,
    rating: 4.3,
    category: 'Components',
    created_at: '2024-01-09T10:00:00Z'
  },
  {
    id: '8',
    name: 'Mobile UI Kit',
    description: 'Mobile-first components optimized for touch interfaces',
    price: 34.99,
    rating: 4.7,
    category: 'Mobile',
    created_at: '2024-01-08T10:00:00Z'
  },
  {
    id: '9',
    name: 'Data Visualization',
    description: 'Charts, graphs, and data display components',
    price: 39.99,
    rating: 4.6,
    category: 'Data Viz',
    created_at: '2024-01-07T10:00:00Z'
  },
  {
    id: '10',
    name: 'Color Palette Generator',
    description: 'Tool for creating and managing color schemes for your designs',
    price: 12.99,
    rating: 4.2,
    category: 'Design Tools',
    created_at: '2024-01-06T10:00:00Z'
  }
]
