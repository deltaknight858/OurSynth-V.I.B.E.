'use client'

import React, { useState, useEffect } from 'react';
import { TemplateSelector } from '@/templates';
import { supabase } from '@/lib/supabase';
import type { Template } from '../../types/templates';
import type { UserProject } from '@/types/projects';
import {
  PageContainer,
  TemplatesContainer,
  Header,
  Title,
  Subtitle,
  SearchSection,
  SearchInput,
  FilterSection,
  FilterTag,
  TemplatesGrid,
  TemplateCard,
  PreviewImage,
  PlayIcon,
  CardContent,
  CardTitle,
  CardDescription,
  CardMeta,
  Price,
  Rating,
  Stars,
  Tags,
  Tag,
  UseTemplateButton,
  LoadingSpinner,
  StatusMessage
} from '@/components/styled/TemplatesPage';


// Mock templates data for fallback
const mockTemplates: Template[] = [
  {
    id: '1',
    name: 'Dashboard Layout',
    description: 'Modern admin dashboard with sidebar navigation and data widgets',
    price: 0,
    rating: 4.8,
    tags: ['dashboard', 'admin', 'layout', 'charts'],
    created_at: new Date().toISOString(),
    downloads_count: 0,
    author_id: 'demo',
    is_featured: true,
    is_active: true,
    component_data: {},
    thumbnail_url: '',
  },
  {
    id: '2',
    name: 'Landing Page Kit',
    description: 'Complete landing page template with hero section and call-to-action',
    price: 0,
    rating: 4.6,
    tags: ['landing', 'marketing', 'responsive', 'conversion'],
    created_at: new Date().toISOString(),
    downloads_count: 0,
    author_id: 'demo',
    is_featured: false,
    is_active: true,
    component_data: {},
    thumbnail_url: '',
  },
  {
    id: '3',
    name: 'E-commerce Store',
    description: 'Product catalog with shopping cart and checkout components',
    price: 0,
    rating: 4.7,
    tags: ['ecommerce', 'shopping', 'products', 'payments'],
    created_at: new Date().toISOString(),
    downloads_count: 0,
    author_id: 'demo',
    is_featured: false,
    is_active: true,
    component_data: {},
    thumbnail_url: '',
  },
  {
    id: '4',
    name: 'Blog Template',
    description: 'Clean blog layout with article listings and reading experience',
    price: 0,
    rating: 4.9,
    tags: ['blog', 'content', 'articles', 'responsive'],
    created_at: new Date().toISOString(),
    downloads_count: 0,
    author_id: 'demo',
    is_featured: false,
    is_active: true,
    component_data: {},
    thumbnail_url: '',
  },
  {
    id: '5',
    name: 'Portfolio Showcase',
    description: 'Creative portfolio template for designers and developers',
    price: 0,
    rating: 4.5,
    tags: ['portfolio', 'creative', 'showcase', 'gallery'],
    created_at: new Date().toISOString(),
    downloads_count: 0,
    author_id: 'demo',
    is_featured: false,
    is_active: true,
    component_data: {},
    thumbnail_url: '',
  },
  {
    id: '6',
    name: 'Social Media App',
    description: 'Social platform interface with feeds, profiles, and messaging',
    price: 0,
    rating: 4.4,
    tags: ['social', 'feeds', 'messaging', 'profiles'],
    created_at: new Date().toISOString(),
    downloads_count: 0,
    author_id: 'demo',
    is_featured: false,
    is_active: true,
    component_data: {},
    thumbnail_url: '',
  },
  {
    id: '7',
    name: 'SaaS Application',
    description: 'Software-as-a-Service app template with user management',
    price: 0,
    rating: 4.6,
    tags: ['saas', 'subscription', 'users', 'billing'],
    created_at: new Date().toISOString(),
    downloads_count: 0,
    author_id: 'demo',
    is_featured: false,
    is_active: true,
    component_data: {},
    thumbnail_url: '',
  },
  {
    id: '8',
    name: 'Mobile App UI',
    description: 'Mobile-first interface components and navigation patterns',
    price: 0,
    rating: 4.7,
    tags: ['mobile', 'app', 'ui', 'touch'],
    created_at: new Date().toISOString(),
    downloads_count: 0,
    author_id: 'demo',
    is_featured: false,
    is_active: true,
    component_data: {},
    thumbnail_url: '',
  }
];

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTag, setSelectedTag] = useState<string>('')
  const [usingTemplate, setUsingTemplate] = useState<string>('')
  const [statusMessage, setStatusMessage] = useState<{
    type: 'success' | 'error'
    message: string
  } | null>(null)

  // Get current user
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    // Check for user session
    const getUser = async () => {
      if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        const { data: { user } } = await supabase.auth.getUser()
        setUser(user)
      }
    }
    getUser()

    // Listen for auth changes
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        (event, session) => {
          setUser(session?.user ?? null)
        }
      )
      return () => subscription.unsubscribe()
    }
  }, [])

  useEffect(() => {
    fetchTemplates()
  }, [])

  const fetchTemplates = async () => {
    setLoading(true)
    
    if (!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)) {
      // Use mock data if Supabase is not configured
      setTemplates(mockTemplates)
      setLoading(false)
      return
    }

    try {
      const { data, error } = await supabase
        .from('templates')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        // Check if it's a table not found error (PGRST106)
        if (error.code === 'PGRST106' || error.message?.includes('relation') || error.message?.includes('does not exist')) {
          console.log('Templates table does not exist yet, using mock data for development')
          setTemplates(mockTemplates)
          setLoading(false)
          return
        }
        throw error
      }

      // Transform the data to match our Template interface
      const transformedTemplates = (data || []).map(template => ({
        ...template,
        price: 0, // Templates are free, or you can add a price column later
        rating: 4.5 // Default rating, or add rating functionality later
      }))

      setTemplates(transformedTemplates)
    } catch (error) {
      console.error('Error fetching templates:', error)
      // Fallback to mock data
      setTemplates(mockTemplates)
    } finally {
      setLoading(false)
    }
  }

  const handleUseTemplate = async (template: Template) => {
    if (!user) {
      setStatusMessage({
        type: 'error',
        message: 'Please sign in to use templates'
      })
      setTimeout(() => setStatusMessage(null), 3000)
      return
    }

    setUsingTemplate(template.id)

    try {
      if (!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)) {
        // Simulate template usage for demo
        setTimeout(() => {
          setStatusMessage({
            type: 'success',
            message: `Template "${template.name}" added to your projects! (Demo mode)`
          })
          setUsingTemplate('')
          setTimeout(() => setStatusMessage(null), 3000)
        }, 1500)
        return
      }

      // Create a new project from the template
      const now = new Date().toISOString();
      const projectData: UserProject = {
        id: 0,
        user_id: user.id,
        name: `${template.name} - Copy`,
        description: template.description,
        template_id: template.id,
        thumbnail_url: template.thumbnail_url,
        is_public: false,
        created_at: now,
        updated_at: now,
        nodes: [],
        components: [],
        settings: {},
      }

      const { data, error } = await supabase
        .from('user_projects')
        .insert([projectData])
        .select()

      if (error) throw error

      setStatusMessage({
        type: 'success',
        message: `Template "${template.name}" added to your projects!`
      })
      
      setTimeout(() => setStatusMessage(null), 3000)
    } catch (error) {
      console.error('Error using template:', error)
      setStatusMessage({
        type: 'error',
        message: 'Failed to use template. Please try again.'
      })
      setTimeout(() => setStatusMessage(null), 3000)
    } finally {
      setUsingTemplate('')
    }
  }

  // Get all unique tags from templates
  const allTags = Array.from(new Set(templates.flatMap(t => t.tags || [])))

  // Filter templates based on search and tag
  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (template.description || '').toLowerCase().includes(searchTerm.toLowerCase())
    const matchesTag = !selectedTag || template.tags?.includes(selectedTag)
    return matchesSearch && matchesTag
  })

  const renderStars = (rating: number) => {
    return '★'.repeat(Math.floor(rating)) + '☆'.repeat(5 - Math.floor(rating))
  }

  if (loading) {
    return (
      <TemplatesContainer className="container">
        <div style={{ textAlign: 'center', padding: '4rem 0' }}>
          <LoadingSpinner style={{ margin: '0 auto' }} />
          <p style={{ color: 'var(--text-secondary)', marginTop: 'var(--spacing-md)' }}>
            Loading templates...
          </p>
        </div>
      </TemplatesContainer>
    )
  }

  return (
    <TemplatesContainer className="container">
      <Header>
        <Title>Project Templates</Title>
        <Subtitle>
          Kickstart your next project with professional templates from the community
        </Subtitle>
      </Header>

      {statusMessage && (
        <StatusMessage $type={statusMessage.type}>
          {statusMessage.message}
        </StatusMessage>
      )}

      <SearchSection>
        <SearchInput
          type="text"
          placeholder="Search templates by name or technology..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        
        {allTags.length > 0 && (
          <FilterSection>
            <FilterTag
              $active={!selectedTag}
              onClick={() => setSelectedTag('')}
            >
              All Templates
            </FilterTag>
            {allTags.map(tag => (
              <FilterTag
                key={tag}
                $active={selectedTag === tag}
                onClick={() => setSelectedTag(selectedTag === tag ? '' : tag)}
              >
                {tag}
              </FilterTag>
            ))}
          </FilterSection>
        )}
      </SearchSection>

      <TemplatesGrid>
        {filteredTemplates.map(template => (
          <TemplateCard key={template.id}>
            <PreviewImage $backgroundImage={template.thumbnail_url}>
              <PlayIcon>▶</PlayIcon>
            </PreviewImage>
            
            <CardContent>
              <CardTitle>{template.name}</CardTitle>
              
              {template.description && (
                <CardDescription>{template.description}</CardDescription>
              )}
              
              <CardMeta>
                <Price>{template.price > 0 ? `$${template.price.toFixed(2)}` : 'Free'}</Price>
                <Rating>
                  <Stars>{renderStars(template.rating)}</Stars>
                  <span>{template.rating}</span>
                </Rating>
              </CardMeta>
              
              {template.tags && template.tags.length > 0 && (
                <Tags>
                  {template.tags.slice(0, 3).map((tag: string) => (
                    <Tag key={tag}>{tag}</Tag>
                  ))}
                  {template.tags.length > 3 && (
                    <Tag>+{template.tags.length - 3} more</Tag>
                  )}
                </Tags>
              )}
              
              <UseTemplateButton
                onClick={() => handleUseTemplate(template)}
                disabled={usingTemplate === template.id}
                $loading={usingTemplate === template.id}
              >
                {usingTemplate === template.id ? (
                  <>
                    <LoadingSpinner />
                    Using Template...
                  </>
                ) : (
                  'Use Template'
                )}
              </UseTemplateButton>
            </CardContent>
          </TemplateCard>
        ))}
      </TemplatesGrid>

      {filteredTemplates.length === 0 && (
        <div style={{ textAlign: 'center', padding: '4rem 0' }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
            No templates found matching your search.
          </p>
        </div>
      )}
    </TemplatesContainer>
  )
}
