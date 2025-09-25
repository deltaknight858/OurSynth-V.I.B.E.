'use client';

import React, { useState, useEffect } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  Typography, 
  Paper,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Checkbox,
  Collapse,
  Chip
} from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import HomeIcon from '@mui/icons-material/Home';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LoginIcon from '@mui/icons-material/Login';
import SettingsIcon from '@mui/icons-material/Settings';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import AddIcon from '@mui/icons-material/Add';
import WebIcon from '@mui/icons-material/Web';

interface Step4PageTemplatesProps {
  data: {
    pages: string[];
  };
  onChange: (newData: Partial<{ pages: string[] }>) => void;
  onNext: () => void;
}

const predefinedPages = [
  {
    id: 'home',
    label: 'Home',
    description: 'Landing page with hero section',
    icon: <HomeIcon />
  },
  {
    id: 'dashboard',
    label: 'Dashboard',
    description: 'Main application interface',
    icon: <DashboardIcon />
  },
  {
    id: 'auth',
    label: 'Login/Signup',
    description: 'Authentication pages',
    icon: <LoginIcon />
  },
  {
    id: 'settings',
    label: 'Settings',
    description: 'User preferences and configuration',
    icon: <SettingsIcon />
  },
  {
    id: 'wizard',
    label: 'Wizard Flow',
    description: 'Multi-step guided process',
    icon: <AccountTreeIcon />
  }
];

export default function Step4PageTemplates({ data, onChange, onNext }: Step4PageTemplatesProps) {
  const [selectedPages, setSelectedPages] = useState<string[]>(data.pages || []);
  const [showCustomField, setShowCustomField] = useState(false);
  const [customPageName, setCustomPageName] = useState('');
  const [isValid, setIsValid] = useState(false);

  // Initialize custom pages if any exist
  useEffect(() => {
    const customPages = data.pages.filter(page => !predefinedPages.some(p => p.id === page));
    if (customPages.length > 0) {
      setShowCustomField(true);
      setCustomPageName(customPages.join(', '));
    }
  }, [data.pages]);

  // Validate form data
  useEffect(() => {
    const hasSelection = selectedPages.length > 0;
    const customFieldValid = !showCustomField || customPageName.trim().length > 0;
    setIsValid(hasSelection && customFieldValid);
  }, [selectedPages, showCustomField, customPageName]);

  // Handle predefined page selection
  const handlePageToggle = (pageId: string) => () => {
    let updatedPages: string[];
    
    if (selectedPages.includes(pageId)) {
      updatedPages = selectedPages.filter(id => id !== pageId);
    } else {
      updatedPages = [...selectedPages, pageId];
    }
    
    setSelectedPages(updatedPages);
    updateData(updatedPages);
  };

  // Handle "Add Custom Page" checkbox
  const handleCustomToggle = () => {
    const newShowCustom = !showCustomField;
    setShowCustomField(newShowCustom);
    
    if (!newShowCustom) {
      setCustomPageName('');
      // Remove custom pages from selection
      const predefinedOnly = selectedPages.filter(page => 
        predefinedPages.some(p => p.id === page)
      );
      setSelectedPages(predefinedOnly);
      updateData(predefinedOnly);
    }
  };

  // Handle custom page name input
  const handleCustomPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setCustomPageName(value);
    
    // Update pages with custom ones
    const predefinedSelected = selectedPages.filter(page => 
      predefinedPages.some(p => p.id === page)
    );
    
    const customPages = value.trim() 
      ? value.split(',').map(page => page.trim()).filter(page => page.length > 0)
      : [];
    
    const allPages = [...predefinedSelected, ...customPages];
    setSelectedPages(allPages);
    updateData(allPages);
  };

  // Update parent component data
  const updateData = (pages: string[]) => {
    onChange({ pages });
  };

  // Handle Next button click
  const handleNext = () => {
    if (isValid) {
      onNext();
    }
  };

  // Get display name for page
  const getPageDisplayName = (pageId: string) => {
    const predefined = predefinedPages.find(p => p.id === pageId);
    return predefined ? predefined.label : pageId;
  };

  return (
    <Paper 
      elevation={3}
      sx={{
        p: 4,
        maxWidth: 700,
        mx: 'auto',
        mt: 4,
        background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 3
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 3 }}>
        <WebIcon sx={{ mr: 2, fontSize: '2rem', color: '#ec4899' }} />
        <Typography 
          variant="h4" 
          component="h1" 
          sx={{
            background: 'linear-gradient(45deg, #22d3ee 30%, #ec4899 90%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: 'bold'
          }}
        >
          Page Templates
        </Typography>
      </Box>

      <Typography 
        variant="body1" 
        color="text.secondary" 
        sx={{ textAlign: 'center', mb: 4 }}
      >
        Select the pages you want to include in your application
      </Typography>

      <Box sx={{ mb: 4 }}>
        <List sx={{ bgcolor: 'transparent' }}>
          {predefinedPages.map((page) => {
            const isSelected = selectedPages.includes(page.id);
            
            return (
              <ListItem 
                key={page.id} 
                disablePadding
                sx={{
                  mb: 1,
                  borderRadius: 2,
                  border: isSelected 
                    ? '2px solid #ec4899' 
                    : '2px solid transparent',
                  backgroundColor: isSelected 
                    ? 'rgba(236, 72, 153, 0.05)' 
                    : 'transparent',
                  '&:hover': {
                    backgroundColor: 'rgba(34, 211, 238, 0.05)',
                    borderColor: '#22d3ee',
                  },
                  transition: 'all 0.2s ease',
                }}
              >
                <ListItemButton 
                  onClick={handlePageToggle(page.id)}
                  sx={{ borderRadius: 2 }}
                >
                  <ListItemIcon>
                    <Checkbox
                      edge="start"
                      checked={isSelected}
                      tabIndex={-1}
                      disableRipple
                      sx={{
                        color: '#22d3ee',
                        '&.Mui-checked': {
                          color: '#ec4899',
                        },
                      }}
                    />
                  </ListItemIcon>
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    {React.cloneElement(page.icon, { 
                      sx: { color: isSelected ? '#ec4899' : '#22d3ee' } 
                    })}
                  </ListItemIcon>
                  <ListItemText 
                    primary={
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        {page.label}
                      </Typography>
                    }
                    secondary={
                      <Typography variant="body2" color="text.secondary">
                        {page.description}
                      </Typography>
                    }
                  />
                </ListItemButton>
              </ListItem>
            );
          })}

          {/* Add Custom Page Option */}
          <ListItem 
            disablePadding
            sx={{
              mt: 2,
              borderRadius: 2,
              border: showCustomField 
                ? '2px solid #84cc16' 
                : '2px solid transparent',
              backgroundColor: showCustomField 
                ? 'rgba(132, 204, 22, 0.05)' 
                : 'transparent',
              '&:hover': {
                backgroundColor: 'rgba(132, 204, 22, 0.05)',
                borderColor: '#84cc16',
              },
              transition: 'all 0.2s ease',
            }}
          >
            <ListItemButton 
              onClick={handleCustomToggle}
              sx={{ borderRadius: 2 }}
            >
              <ListItemIcon>
                <Checkbox
                  edge="start"
                  checked={showCustomField}
                  tabIndex={-1}
                  disableRipple
                  sx={{
                    color: '#84cc16',
                    '&.Mui-checked': {
                      color: '#84cc16',
                    },
                  }}
                />
              </ListItemIcon>
              <ListItemIcon sx={{ minWidth: 40 }}>
                <AddIcon sx={{ color: '#84cc16' }} />
              </ListItemIcon>
              <ListItemText 
                primary={
                  <Typography variant="body1" sx={{ fontWeight: 600, fontStyle: 'italic' }}>
                    Add Custom Page...
                  </Typography>
                }
                secondary={
                  <Typography variant="body2" color="text.secondary">
                    Define your own page routes
                  </Typography>
                }
              />
            </ListItemButton>
          </ListItem>
        </List>

        <Collapse in={showCustomField}>
          <Box sx={{ mt: 2, ml: 2, mr: 2 }}>
            <TextField
              label="Custom Page Routes"
              variant="outlined"
              fullWidth
              value={customPageName}
              onChange={handleCustomPageChange}
              placeholder="about, contact, blog, products..."
              helperText="Enter page names separated by commas (e.g., about, contact, blog)"
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': {
                    borderColor: '#84cc16',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#84cc16',
                  },
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#84cc16',
                },
              }}
            />
          </Box>
        </Collapse>
      </Box>

      {/* Selected Pages Summary */}
      {selectedPages.length > 0 && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" sx={{ mb: 2, fontWeight: 500 }}>
            Selected Pages ({selectedPages.length}):
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {selectedPages.map((pageId) => (
              <Chip
                key={pageId}
                label={getPageDisplayName(pageId)}
                size="small"
                sx={{
                  background: 'linear-gradient(45deg, #22d3ee 30%, #ec4899 90%)',
                  color: 'white',
                  fontWeight: 500,
                }}
              />
            ))}
          </Box>
        </Box>
      )}

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          {selectedPages.length === 0 
            ? 'No pages selected' 
            : `${selectedPages.length} ${selectedPages.length === 1 ? 'page' : 'pages'} selected`
          }
        </Typography>
        
        <Button
          variant="contained"
          endIcon={<ArrowForwardIcon />}
          onClick={handleNext}
          disabled={!isValid}
          sx={{
            background: isValid 
              ? 'linear-gradient(45deg, #22d3ee 30%, #ec4899 90%)'
              : 'rgba(0,0,0,0.12)',
            color: isValid ? 'white' : 'rgba(0,0,0,0.26)',
            fontWeight: 'bold',
            px: 4,
            py: 1.5,
            borderRadius: 2,
            textTransform: 'none',
            fontSize: '1.1rem',
            transition: 'all 0.3s ease',
            '&:hover': isValid ? {
              background: 'linear-gradient(45deg, #0891b2 30%, #be185d 90%)',
              transform: 'translateY(-2px)',
              boxShadow: '0 8px 25px rgba(34, 211, 238, 0.3)',
            } : {},
            '&:disabled': {
              background: 'rgba(0,0,0,0.12)',
              color: 'rgba(0,0,0,0.26)',
            }
          }}
        >
          Next
        </Button>
      </Box>
    </Paper>
  );
}
