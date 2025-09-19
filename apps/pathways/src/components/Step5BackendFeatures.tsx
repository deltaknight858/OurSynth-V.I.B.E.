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
  ListItemText,
  Switch,
  FormControlLabel,
  Collapse,
  Chip,
  Divider
} from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import SecurityIcon from '@mui/icons-material/Security';
import StorageIcon from '@mui/icons-material/Storage';
import ApiIcon from '@mui/icons-material/Api';
import NetworkCheckIcon from '@mui/icons-material/NetworkCheck';
import ExtensionIcon from '@mui/icons-material/Extension';
import DeveloperModeIcon from '@mui/icons-material/DeveloperMode';

interface Step5BackendFeaturesProps {
  data: {
    backendFeatures: string[];
  };
  onChange: (newData: Partial<{ backendFeatures: string[] }>) => void;
  onNext: () => void;
}

const predefinedFeatures = [
  {
    id: 'authentication',
    label: 'Authentication',
    description: 'User login, signup, and session management',
    icon: <SecurityIcon />
  },
  {
    id: 'supabase',
    label: 'Supabase',
    description: 'Database, storage, and real-time subscriptions',
    icon: <StorageIcon />
  },
  {
    id: 'api-endpoints',
    label: 'API Endpoints',
    description: 'RESTful API routes and middleware',
    icon: <ApiIcon />
  },
  {
    id: 'realtime-websocket',
    label: 'Real-time/WebSocket',
    description: 'Live updates and bidirectional communication',
    icon: <NetworkCheckIcon />
  }
];

export default function Step5BackendFeatures({ data, onChange, onNext }: Step5BackendFeaturesProps) {
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>(data.backendFeatures || []);
  const [showOtherField, setShowOtherField] = useState(false);
  const [otherFeature, setOtherFeature] = useState('');
  const [isValid, setIsValid] = useState(false);

  // Initialize other field if there are custom features
  useEffect(() => {
    const customFeatures = data.backendFeatures.filter(feature => 
      !predefinedFeatures.some(p => p.id === feature)
    );
    if (customFeatures.length > 0) {
      setShowOtherField(true);
      setOtherFeature(customFeatures.join(', '));
    }
  }, [data.backendFeatures]);

  // Validate form data
  useEffect(() => {
    const hasSelection = selectedFeatures.length > 0;
    const otherFieldValid = !showOtherField || otherFeature.trim().length > 0;
    setIsValid(hasSelection && otherFieldValid);
  }, [selectedFeatures, showOtherField, otherFeature]);

  // Handle predefined feature toggle
  const handleFeatureToggle = (featureId: string) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    let updatedFeatures: string[];
    
    if (event.target.checked) {
      updatedFeatures = [...selectedFeatures, featureId];
    } else {
      updatedFeatures = selectedFeatures.filter(id => id !== featureId);
    }
    
    setSelectedFeatures(updatedFeatures);
    updateData(updatedFeatures);
  };

  // Handle "Other..." switch toggle
  const handleOtherToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = event.target.checked;
    setShowOtherField(isChecked);
    
    if (!isChecked) {
      setOtherFeature('');
      // Remove custom features from selection
      const predefinedOnly = selectedFeatures.filter(feature => 
        predefinedFeatures.some(p => p.id === feature)
      );
      setSelectedFeatures(predefinedOnly);
      updateData(predefinedOnly);
    }
  };

  // Handle other feature text field change
  const handleOtherFeatureChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setOtherFeature(value);
    
    // Update features with custom ones
    const predefinedSelected = selectedFeatures.filter(feature => 
      predefinedFeatures.some(p => p.id === feature)
    );
    
    const customFeatures = value.trim() 
      ? value.split(',').map(feature => feature.trim()).filter(feature => feature.length > 0)
      : [];
    
    const allFeatures = [...predefinedSelected, ...customFeatures];
    setSelectedFeatures(allFeatures);
    updateData(allFeatures);
  };

  // Update parent component data
  const updateData = (features: string[]) => {
    onChange({ backendFeatures: features });
  };

  // Handle Next button click
  const handleNext = () => {
    if (isValid) {
      onNext();
    }
  };

  // Get display name for feature
  const getFeatureDisplayName = (featureId: string) => {
    const predefined = predefinedFeatures.find(p => p.id === featureId);
    return predefined ? predefined.label : featureId;
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
        <DeveloperModeIcon sx={{ mr: 2, fontSize: '2rem', color: '#ec4899' }} />
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
          Backend Features
        </Typography>
      </Box>

      <Typography 
        variant="body1" 
        color="text.secondary" 
        sx={{ textAlign: 'center', mb: 4 }}
      >
        Configure the backend services and features for your application
      </Typography>

      <Box sx={{ mb: 4 }}>
        <List sx={{ bgcolor: 'transparent' }}>
          {predefinedFeatures.map((feature) => {
            const isSelected = selectedFeatures.includes(feature.id);
            
            return (
              <ListItem 
                key={feature.id}
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
                  px: 2,
                  py: 1,
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                  {React.cloneElement(feature.icon, { 
                    sx: { color: isSelected ? '#ec4899' : '#22d3ee', fontSize: '1.5rem' } 
                  })}
                </Box>
                <ListItemText 
                  primary={
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      {feature.label}
                    </Typography>
                  }
                  secondary={
                    <Typography variant="body2" color="text.secondary">
                      {feature.description}
                    </Typography>
                  }
                  sx={{ flex: 1 }}
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={isSelected}
                      onChange={handleFeatureToggle(feature.id)}
                      sx={{
                        '& .MuiSwitch-switchBase.Mui-checked': {
                          color: '#ec4899',
                        },
                        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                          backgroundColor: '#ec4899',
                        },
                        '& .MuiSwitch-track': {
                          backgroundColor: '#22d3ee',
                        },
                      }}
                    />
                  }
                  label=""
                  sx={{ m: 0 }}
                />
              </ListItem>
            );
          })}

          <Divider sx={{ my: 2 }} />

          {/* Other Feature Option */}
          <ListItem 
            sx={{
              borderRadius: 2,
              border: showOtherField 
                ? '2px solid #84cc16' 
                : '2px solid transparent',
              backgroundColor: showOtherField 
                ? 'rgba(132, 204, 22, 0.05)' 
                : 'transparent',
              '&:hover': {
                backgroundColor: 'rgba(132, 204, 22, 0.05)',
                borderColor: '#84cc16',
              },
              transition: 'all 0.2s ease',
              px: 2,
              py: 1,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
              <ExtensionIcon sx={{ color: '#84cc16', fontSize: '1.5rem' }} />
            </Box>
            <ListItemText 
              primary={
                <Typography variant="body1" sx={{ fontWeight: 600, fontStyle: 'italic' }}>
                  Other...
                </Typography>
              }
              secondary={
                <Typography variant="body2" color="text.secondary">
                  Custom backend features and integrations
                </Typography>
              }
              sx={{ flex: 1 }}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={showOtherField}
                  onChange={handleOtherToggle}
                  sx={{
                    '& .MuiSwitch-switchBase.Mui-checked': {
                      color: '#84cc16',
                    },
                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                      backgroundColor: '#84cc16',
                    },
                    '& .MuiSwitch-track': {
                      backgroundColor: '#a3a3a3',
                    },
                  }}
                />
              }
              label=""
              sx={{ m: 0 }}
            />
          </ListItem>
        </List>

        <Collapse in={showOtherField}>
          <Box sx={{ mt: 3, p: 3, backgroundColor: 'rgba(132, 204, 22, 0.05)', borderRadius: 2 }}>
            <TextField
              label="Custom Backend Features"
              variant="outlined"
              fullWidth
              value={otherFeature}
              onChange={handleOtherFeatureChange}
              placeholder="GraphQL, Redis caching, Email service, Payment processing..."
              helperText="Enter custom features separated by commas"
              multiline
              rows={2}
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

      {/* Selected Features Summary */}
      {selectedFeatures.length > 0 && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" sx={{ mb: 2, fontWeight: 500 }}>
            Selected Backend Features ({selectedFeatures.length}):
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {selectedFeatures.map((featureId) => (
              <Chip
                key={featureId}
                label={getFeatureDisplayName(featureId)}
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
          {selectedFeatures.length === 0 
            ? 'No backend features selected' 
            : `${selectedFeatures.length} ${selectedFeatures.length === 1 ? 'feature' : 'features'} selected`
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
