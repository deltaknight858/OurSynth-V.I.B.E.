import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  TextField,
  InputAdornment,
  styled,
  keyframes,
  Checkbox,
  FormControlLabel,
  Badge
} from '@mui/material';
import { 
  Extension,
  Search,
  CheckCircle,
  Add,
  Web,
  DataObject,
  Navigation,
  Dashboard,
  Input,
  ViewModule,
  TableChart,
  BarChart,
  Image,
  VideoCall,
  NotificationsActive
} from '@mui/icons-material';

const slideInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const ComponentCard = styled(Card)<{ selected?: boolean }>(({ theme, selected }) => ({
  cursor: 'pointer',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  background: selected 
    ? 'linear-gradient(135deg, rgba(160, 32, 240, 0.2) 0%, rgba(255, 255, 255, 0.1) 100%)'
    : 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.04) 100%)',
  backdropFilter: 'blur(10px)',
  border: selected 
    ? '2px solid #a020f0'
    : '2px solid rgba(255, 255, 255, 0.1)',
  borderRadius: '16px',
  position: 'relative',
  height: '180px',
  animation: `${slideInUp} 0.4s ease-out`,
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: selected 
      ? '0 20px 40px rgba(160, 32, 240, 0.4)' 
      : '0 16px 32px rgba(160, 32, 240, 0.2)',
    borderColor: selected ? '#a020f0' : 'rgba(160, 32, 240, 0.4)',
  }
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    background: 'rgba(255, 255, 255, 0.05)',
    backdropFilter: 'blur(10px)',
    borderRadius: '12px',
    '& fieldset': {
      borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    '&:hover fieldset': {
      borderColor: 'rgba(160, 32, 240, 0.5)',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#a020f0',
    },
  },
  '& .MuiInputLabel-root': {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  '& .MuiOutlinedInput-input': {
    color: 'white',
  },
}));

const CategoryChip = styled(Chip)<{ active?: boolean }>(({ theme, active }) => ({
  background: active 
    ? 'linear-gradient(135deg, #a020f0 0%, #ff6b35 100%)'
    : 'rgba(255, 255, 255, 0.1)',
  color: active ? 'white' : 'rgba(255, 255, 255, 0.7)',
  border: active ? 'none' : '1px solid rgba(255, 255, 255, 0.2)',
  fontWeight: active ? 600 : 400,
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  '&:hover': {
    background: active 
      ? 'linear-gradient(135deg, #8f1ce6 0%, #e55a2b 100%)'
      : 'rgba(160, 32, 240, 0.2)',
    color: 'white',
  }
}));

const components = [
  // Layout & Navigation
  { 
    id: 'app-bar', 
    name: 'App Bar', 
    category: 'layout', 
    icon: Navigation, 
    description: 'Top navigation with branding and menu',
    color: '#2196f3',
    popular: true,
    preview: 'Header with logo and nav items'
  },
  { 
    id: 'sidebar', 
    name: 'Sidebar Navigation', 
    category: 'layout', 
    icon: ViewModule, 
    description: 'Collapsible side navigation menu',
    color: '#2196f3',
    popular: false,
    preview: 'Expandable left navigation'
  },
  { 
    id: 'footer', 
    name: 'Footer', 
    category: 'layout', 
    icon: Web, 
    description: 'Bottom section with links and info',
    color: '#2196f3',
    popular: true,
    preview: 'Links, copyright, social icons'
  },

  // Forms & Input
  { 
    id: 'contact-form', 
    name: 'Contact Form', 
    category: 'forms', 
    icon: Input, 
    description: 'Complete contact form with validation',
    color: '#4caf50',
    popular: true,
    preview: 'Name, email, message fields'
  },
  { 
    id: 'search-bar', 
    name: 'Search Bar', 
    category: 'forms', 
    icon: Search, 
    description: 'Advanced search with filters',
    color: '#4caf50',
    popular: true,
    preview: 'Search input with autocomplete'
  },
  { 
    id: 'login-form', 
    name: 'Login Form', 
    category: 'forms', 
    icon: Input, 
    description: 'User authentication form',
    color: '#4caf50',
    popular: true,
    preview: 'Username, password, remember me'
  },

  // Data Display
  { 
    id: 'data-table', 
    name: 'Data Table', 
    category: 'data', 
    icon: TableChart, 
    description: 'Sortable table with pagination',
    color: '#ff9800',
    popular: true,
    preview: 'Rows, columns, sort, filter'
  },
  { 
    id: 'chart-dashboard', 
    name: 'Chart Dashboard', 
    category: 'data', 
    icon: BarChart, 
    description: 'Multiple charts and metrics',
    color: '#ff9800',
    popular: false,
    preview: 'Line charts, bar charts, KPIs'
  },
  { 
    id: 'data-cards', 
    name: 'Data Cards', 
    category: 'data', 
    icon: Dashboard, 
    description: 'Information cards with statistics',
    color: '#ff9800',
    popular: true,
    preview: 'Metric cards with icons'
  },

  // Media & Content
  { 
    id: 'hero-section', 
    name: 'Hero Section', 
    category: 'content', 
    icon: Image, 
    description: 'Landing page hero with CTA',
    color: '#e91e63',
    popular: true,
    preview: 'Large image, title, subtitle, button'
  },
  { 
    id: 'image-gallery', 
    name: 'Image Gallery', 
    category: 'content', 
    icon: Image, 
    description: 'Responsive photo gallery',
    color: '#e91e63',
    popular: false,
    preview: 'Grid of images with lightbox'
  },
  { 
    id: 'video-player', 
    name: 'Video Player', 
    category: 'content', 
    icon: VideoCall, 
    description: 'Custom video player controls',
    color: '#e91e63',
    popular: false,
    preview: 'Video with custom controls'
  },

  // Interactive
  { 
    id: 'notification-system', 
    name: 'Notifications', 
    category: 'interactive', 
    icon: NotificationsActive, 
    description: 'Toast notifications and alerts',
    color: '#9c27b0',
    popular: true,
    preview: 'Success, error, info alerts'
  },
  { 
    id: 'modal-dialogs', 
    name: 'Modal Dialogs', 
    category: 'interactive', 
    icon: DataObject, 
    description: 'Popup modals and confirmations',
    color: '#9c27b0',
    popular: true,
    preview: 'Confirmation, info dialogs'
  }
];

const categories = [
  { id: 'all', name: 'All Components', count: components.length },
  { id: 'layout', name: 'Layout & Nav', count: components.filter(c => c.category === 'layout').length },
  { id: 'forms', name: 'Forms & Input', count: components.filter(c => c.category === 'forms').length },
  { id: 'data', name: 'Data Display', count: components.filter(c => c.category === 'data').length },
  { id: 'content', name: 'Media & Content', count: components.filter(c => c.category === 'content').length },
  { id: 'interactive', name: 'Interactive', count: components.filter(c => c.category === 'interactive').length },
];

interface StepComponentsProps {
  wizardState: {
    selectedComponents: string[];
    autoSelectEnabled: boolean;
  };
  updateState: (updates: any) => void;
}

export default function StepComponents({ wizardState, updateState }: StepComponentsProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [filteredComponents, setFilteredComponents] = useState(components);

  useEffect(() => {
    let filtered = components;

    // Filter by category
    if (activeCategory !== 'all') {
      filtered = filtered.filter(component => component.category === activeCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(component =>
        component.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        component.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredComponents(filtered);
  }, [searchQuery, activeCategory]);

  // Auto-select popular components when auto-select is enabled
  useEffect(() => {
    if (wizardState.autoSelectEnabled && wizardState.selectedComponents.length === 0) {
      const popularComponents = components.filter(c => c.popular).map(c => c.id);
      updateState({ selectedComponents: popularComponents });
    }
  }, [wizardState.autoSelectEnabled]);

  const handleComponentToggle = (componentId: string) => {
    const currentSelection = wizardState.selectedComponents || [];
    const isSelected = currentSelection.includes(componentId);
    
    const newSelection = isSelected
      ? currentSelection.filter(id => id !== componentId)
      : [...currentSelection, componentId];
    
    updateState({ selectedComponents: newSelection });
  };

  const handleAutoSelectToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
    const enabled = event.target.checked;
    updateState({ autoSelectEnabled: enabled });
    
    if (enabled) {
      const popularComponents = components.filter(c => c.popular).map(c => c.id);
      updateState({ selectedComponents: popularComponents });
    }
  };

  return (
    <Box sx={{ width: '100%', maxWidth: '1000px' }}>
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, mb: 2 }}>
          <Extension sx={{ fontSize: 48, color: '#a020f0' }} />
        </Box>
        <Typography 
          variant="h4" 
          sx={{ 
            color: 'white', 
            fontWeight: 600, 
            mb: 1,
            background: 'linear-gradient(135deg, #ffffff 0%, #a020f0 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Choose Components
        </Typography>
        <Typography 
          variant="h6" 
          sx={{ 
            color: 'rgba(255, 255, 255, 0.7)',
            fontWeight: 300,
            maxWidth: '600px',
            mx: 'auto'
          }}
        >
          Select the building blocks for your app. We&apos;ll customize them to match your style!
        </Typography>
      </Box>

      {/* Controls */}
      <Box sx={{ mb: 4 }}>
        {/* Search and Auto-Select */}
        <Box sx={{ display: 'flex', gap: 3, mb: 3, alignItems: 'center', flexWrap: 'wrap' }}>
          <StyledTextField
            placeholder="Search components..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search sx={{ color: 'rgba(255, 255, 255, 0.5)' }} />
                </InputAdornment>
              ),
            }}
            sx={{ flex: 1, minWidth: '200px' }}
          />
          
          <FormControlLabel
            control={
              <Checkbox
                checked={wizardState.autoSelectEnabled || false}
                onChange={handleAutoSelectToggle}
                sx={{
                  color: 'rgba(255, 255, 255, 0.5)',
                  '&.Mui-checked': {
                    color: '#a020f0',
                  },
                }}
              />
            }
            label={
              <Typography sx={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.9rem' }}>
                Auto-select popular
              </Typography>
            }
          />
        </Box>

        {/* Category Filters */}
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {categories.map((category) => (
            <CategoryChip
              key={category.id}
              label={`${category.name} (${category.count})`}
              active={activeCategory === category.id}
              onClick={() => setActiveCategory(category.id)}
            />
          ))}
        </Box>
      </Box>

      {/* Selection Summary */}
      {wizardState.selectedComponents && wizardState.selectedComponents.length > 0 && (
        <Box
          sx={{
            mb: 4,
            p: 3,
            background: 'rgba(160, 32, 240, 0.1)',
            border: '1px solid rgba(160, 32, 240, 0.3)',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: 2
          }}
        >
          <CheckCircle sx={{ color: '#a020f0' }} />
          <Typography sx={{ color: 'white', fontWeight: 600 }}>
            {wizardState.selectedComponents.length} components selected
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', ml: 'auto' }}>
            {wizardState.selectedComponents.slice(0, 3).map(id => {
              const component = components.find(c => c.id === id);
              return component ? (
                <Chip
                  key={id}
                  label={component.name}
                  size="small"
                  sx={{
                    background: 'rgba(160, 32, 240, 0.2)',
                    color: 'white',
                    fontSize: '0.7rem'
                  }}
                />
              ) : null;
            })}
            {wizardState.selectedComponents.length > 3 && (
              <Chip
                label={`+${wizardState.selectedComponents.length - 3} more`}
                size="small"
                sx={{
                  background: 'rgba(160, 32, 240, 0.2)',
                  color: 'white',
                  fontSize: '0.7rem'
                }}
              />
            )}
          </Box>
        </Box>
      )}

      {/* Components Grid */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, gap: 3 }}>
        {filteredComponents.map((component, index) => {
          const IconComponent = component.icon;
          const isSelected = wizardState.selectedComponents?.includes(component.id) || false;
          
          return (
            <Box key={component.id}>
              <ComponentCard
                selected={isSelected}
                onClick={() => handleComponentToggle(component.id)}
                sx={{ 
                  animationDelay: `${index * 0.05}s`,
                  animationFillMode: 'both'
                }}
              >
                <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
                  {/* Header */}
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: '12px',
                        background: `linear-gradient(135deg, ${component.color}20 0%, ${component.color}10 100%)`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: `2px solid ${component.color}40`,
                      }}
                    >
                      <IconComponent sx={{ fontSize: 24, color: component.color }} />
                    </Box>
                    
                    {isSelected && (
                      <CheckCircle sx={{ color: '#a020f0', fontSize: 24 }} />
                    )}
                    
                    {component.popular && !isSelected && (
                      <Badge
                        badgeContent="Popular"
                        sx={{
                          '& .MuiBadge-badge': {
                            background: 'linear-gradient(135deg, #ff6b35 0%, #f7931e 100%)',
                            color: 'white',
                            fontSize: '0.6rem',
                            fontWeight: 600,
                            transform: 'rotate(15deg)',
                            transformOrigin: 'center',
                          }
                        }}
                      />
                    )}
                  </Box>

                  {/* Content */}
                  <Typography
                    variant="h6"
                    sx={{ 
                      color: 'white', 
                      fontWeight: 600,
                      mb: 1,
                      fontSize: '1rem'
                    }}
                  >
                    {component.name}
                  </Typography>
                  
                  <Typography
                    variant="body2"
                    sx={{ 
                      color: 'rgba(255, 255, 255, 0.7)',
                      fontSize: '0.85rem',
                      lineHeight: 1.4,
                      mb: 2,
                      flexGrow: 1
                    }}
                  >
                    {component.description}
                  </Typography>

                  {/* Preview */}
                  <Typography
                    variant="caption"
                    sx={{
                      color: 'rgba(255, 255, 255, 0.5)',
                      fontSize: '0.7rem',
                      fontStyle: 'italic',
                      borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                      pt: 1,
                      mt: 'auto'
                    }}
                  >
                    {component.preview}
                  </Typography>
                </CardContent>
              </ComponentCard>
            </Box>
          );
        })}
      </Box>

      {/* Empty State */}
      {filteredComponents.length === 0 && (
        <Box
          sx={{
            textAlign: 'center',
            py: 8,
            color: 'rgba(255, 255, 255, 0.5)',
          }}
        >
          <Search sx={{ fontSize: 64, mb: 2 }} />
          <Typography variant="h6" sx={{ mb: 1 }}>
            No components found
          </Typography>
          <Typography variant="body2">
            Try adjusting your search or category filter
          </Typography>
        </Box>
      )}
    </Box>
  );
}
