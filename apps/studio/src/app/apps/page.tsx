'use client'

import React, { useState, useEffect } from 'react'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import styled from 'styled-components'
import AppCard from '@/components/AppCard'
import clsx from 'clsx'

// Types
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
  created_at: string
}

// Styled Components
const AppsContainer = styled.div`
  padding: var(--spacing-lg) 0;
  min-height: 100vh;
`

const HeroSection = styled.div`
  background: var(--glass-background);
  backdrop-filter: var(--glass-backdrop-filter);
  border: var(--glass-border);
  border-radius: var(--glass-border-radius);
  padding: var(--spacing-xl);
  margin-bottom: var(--spacing-xl);
  text-align: center;
`

const HeroTitle = styled.h1`
  background: var(--primary-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-size: 2.5rem;
  margin-bottom: var(--spacing-md);
  font-weight: 700;
`

const HeroSubtitle = styled.p`
  color: var(--text-secondary);
  font-size: 1.1rem;
  max-width: 600px;
  margin: 0 auto var(--spacing-lg);
  line-height: 1.6;
`

const FeaturedSection = styled.div`
  margin-bottom: var(--spacing-xl);
`

const SectionTitle = styled.h2`
  color: var(--text-primary);
  font-size: 1.8rem;
  font-weight: 600;
  margin-bottom: var(--spacing-lg);
  text-align: center;
`

const FeaturedCarousel = styled.div`
  display: flex;
  gap: var(--spacing-lg);
  overflow-x: auto;
  padding: var(--spacing-md) 0;
  scroll-snap-type: x mandatory;
  
  &::-webkit-scrollbar {
    height: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: var(--accent-color);
    border-radius: 4px;
  }
`

const FeaturedCard = styled.div`
  min-width: 300px;
  background: var(--glass-background);
  backdrop-filter: var(--glass-backdrop-filter);
  border: var(--glass-border);
  border-radius: var(--glass-border-radius);
  padding: var(--spacing-lg);
  scroll-snap-align: start;
  transition: var(--transition-normal);
  
  &:hover {
    transform: translateY(-4px);
    border-color: var(--accent-color);
  }
`

const FilterSection = styled.div`
  background: var(--glass-background);
  backdrop-filter: var(--glass-backdrop-filter);
  border: var(--glass-border);
  border-radius: var(--glass-border-radius);
  padding: var(--spacing-lg);
  margin-bottom: var(--spacing-xl);
  display: flex;
  gap: var(--spacing-md);
  flex-wrap: wrap;
  align-items: center;
`

const SearchInput = styled.input`
  flex: 1;
  min-width: 250px;
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
  }
`

const CategorySelect = styled.select`
  padding: var(--spacing-md);
  background: var(--glass-background-dark);
  border: var(--glass-border);
  border-radius: var(--glass-border-radius);
  color: var(--text-primary);
  font-size: 1rem;
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: var(--accent-color);
  }
`

const AppsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: var(--spacing-lg);
`

const LoadingState = styled.div`
  text-align: center;
  padding: var(--spacing-xl);
  color: var(--text-secondary);
`

const ErrorState = styled.div`
  text-align: center;
  padding: var(--spacing-xl);
  background: var(--glass-background);
  border: var(--glass-border);
  border-radius: var(--glass-border-radius);
  color: var(--text-secondary);
`

const StatsBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-lg);
  color: var(--text-secondary);
  font-size: 0.9rem;
`

// Mock data for development/fallback
const mockApps: App[] = [
  {
    id: '1',
    name: 'Form Builder Pro',
    slug: 'form-builder-pro',
    tagline: 'Create beautiful forms with drag & drop',
    description: 'Professional form builder with advanced validation and styling options',
    price: 29.99,
    rating: 4.8,
    category: 'Productivity',
    featured: true,
    downloads: 1200,
    created_at: '2024-01-15T10:00:00Z'
  },
  {
    id: '2',
    name: 'Component Inspector',
    slug: 'component-inspector',
    tagline: 'Debug and analyze your UI components',
    description: 'Developer tool for inspecting component properties and performance',
    price: 0,
    rating: 4.6,
    category: 'Developer Tools',
    featured: true,
    downloads: 890,
    created_at: '2024-01-14T10:00:00Z'
  },
  {
    id: '3',
    name: 'Animation Studio',
    slug: 'animation-studio',
    tagline: 'Create stunning animations visually',
    description: 'Timeline-based animation editor for web interfaces',
    price: 49.99,
    rating: 4.9,
    category: 'Design Tools',
    featured: true,
    downloads: 650,
    created_at: '2024-01-13T10:00:00Z'
  },
  {
    id: '4',
    name: 'Theme Generator',
    slug: 'theme-generator',
    tagline: 'Generate consistent design systems',
    description: 'Create and export design tokens and theme configurations',
    price: 19.99,
    rating: 4.7,
    category: 'Design Tools',
    featured: true,
    downloads: 1100,
    created_at: '2024-01-12T10:00:00Z'
  },
  {
    id: '5',
    name: 'Responsive Preview',
    slug: 'responsive-preview',
    tagline: 'Test designs across all devices',
    description: 'Live preview your designs on different screen sizes',
    price: 0,
    rating: 4.5,
    category: 'Developer Tools',
    downloads: 2300,
    created_at: '2024-01-11T10:00:00Z'
  },
  {
    id: '6',
    name: 'Color Palette Pro',
    slug: 'color-palette-pro',
    tagline: 'Advanced color scheme generation',
    description: 'AI-powered color palette generator with accessibility checking',
    price: 24.99,
    rating: 4.4,
    category: 'Design Tools',
    downloads: 780,
    created_at: '2024-01-10T10:00:00Z'
  },
  {
    id: '7',
    name: 'Layout Assistant',
    slug: 'layout-assistant',
    tagline: 'Smart layout suggestions and guides',
    description: 'AI assistant for creating balanced and professional layouts',
    price: 39.99,
    rating: 4.6,
    category: 'Productivity',
    downloads: 520,
    created_at: '2024-01-09T10:00:00Z'
  },
  {
    id: '8',
    name: 'Export Manager',
    slug: 'export-manager',
    tagline: 'Export to any format or framework',
    description: 'Convert your designs to React, Vue, HTML/CSS, and more',
    price: 59.99,
    rating: 4.8,
    category: 'Developer Tools',
    downloads: 340,
    created_at: '2024-01-08T10:00:00Z'
  }
]

export default function AppsPage() {
  const [apps, setApps] = useState<App[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('')

  useEffect(() => {
    fetchApps()
  }, [])

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
        // Check if it's a table not found error
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
      setError('Failed to load apps. Please try again later.')
      // Fallback mock data for development
      setApps(mockApps)
    } finally {
      setLoading(false)
    }
  }

  // Filter apps based on search and category
  const filteredApps = apps.filter(app => {
    const matchesSearch = !searchTerm || 
      app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.tagline.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.description?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesCategory = !selectedCategory || app.category === selectedCategory

    return matchesSearch && matchesCategory
  })

  const featuredApps = apps.filter(app => app.featured).slice(0, 4)
  const categories = Array.from(new Set(apps.map(app => app.category).filter(Boolean)))

  if (loading) {
    return (
      <div className="container">
        <LoadingState>
          <div style={{ fontSize: '2rem', marginBottom: 'var(--spacing-md)' }}>🚀</div>
          <p>Loading apps...</p>
        </LoadingState>
      </div>
    )
  }

  return (
    <div className="container">
      <AppsContainer>
        {/* Hero Section */}
        <HeroSection>
          <HeroTitle>Explore OurSynth Apps</HeroTitle>
          <HeroSubtitle>
            Supercharge your design workflow with powerful apps and tools built by the community. 
            From form builders to animation studios, find everything you need to create amazing user interfaces.
          </HeroSubtitle>
        </HeroSection>

        {/* Featured Apps Carousel */}
        {featuredApps.length > 0 && (
          <FeaturedSection>
            <SectionTitle>✨ Featured Apps</SectionTitle>
            <FeaturedCarousel>
              {featuredApps.map((app) => (
                <FeaturedCard key={app.id}>
                  <AppCard app={app} featured />
                </FeaturedCard>
              ))}
            </FeaturedCarousel>
          </FeaturedSection>
        )}

        {/* Search and Filters */}
        <FilterSection>
          <SearchInput
            type="text"
            placeholder="Search apps by name, category, or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          
          <CategorySelect
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </CategorySelect>
        </FilterSection>

        {/* Apps Grid */}
        <div>
          <StatsBar>
            <span>
              {filteredApps.length} app{filteredApps.length !== 1 ? 's' : ''} found
            </span>
            {searchTerm && (
              <span>Results for &quot;{searchTerm}&quot;</span>
            )}
          </StatsBar>

          {error && (
            <ErrorState>
              <h3 style={{ color: 'var(--accent-color)', marginBottom: 'var(--spacing-md)' }}>
                {error}
              </h3>
              <p>Using sample data for demonstration.</p>
            </ErrorState>
          )}

          {filteredApps.length === 0 ? (
            <ErrorState>
              <h3 style={{ color: 'var(--accent-color)', marginBottom: 'var(--spacing-md)' }}>
                No apps found
              </h3>
              <p>Try adjusting your search terms or category filter.</p>
            </ErrorState>
          ) : (
            <AppsGrid>
              {filteredApps.map((app) => (
                <AppCard key={app.id} app={app} />
              ))}
            </AppsGrid>
          )}
        </div>
      </AppsContainer>
    </div>
  )
}
