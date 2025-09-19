'use client';

import React, { useState, useEffect } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  Typography, 
  Paper,
  RadioGroup,
  FormControlLabel,
  Radio,
  Collapse,
  Stack
} from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import PaletteIcon from '@mui/icons-material/Palette';

interface Step3StylingThemeProps {
  data: {
    theme: string;
    customNotes?: string;
    primaryColor?: string;
    secondaryColor?: string;
  };
  onChange: (newData: Partial<{ theme: string; customNotes?: string; primaryColor?: string; secondaryColor?: string }>) => void;
  onNext: () => void;
}

const themeOptions = [
  {
    value: 'electric-glass',
    label: 'Electric Glass',
    description: 'Vibrant gradients with glass morphism effects'
  },
  {
    value: 'white-minimalist',
    label: 'White Minimalist',
    description: 'Clean, simple design with subtle accents'
  },
  {
    value: 'dark-utility',
    label: 'Dark Utility',
    description: 'Professional dark theme with utility focus'
  },
  {
    value: 'custom-palette',
    label: 'Custom Palette...',
    description: 'Define your own color scheme'
  }
];

export default function Step3StylingTheme({ data, onChange, onNext }: Step3StylingThemeProps) {
  const [selectedTheme, setSelectedTheme] = useState(data.theme || '');
  const [customNotes, setCustomNotes] = useState(data.customNotes || '');
  const [primaryColor, setPrimaryColor] = useState(data.primaryColor || '#22d3ee');
  const [secondaryColor, setSecondaryColor] = useState(data.secondaryColor || '#ec4899');
  const [isValid, setIsValid] = useState(false);

  // Validate form data
  useEffect(() => {
    if (!selectedTheme) {
      setIsValid(false);
      return;
    }

    if (selectedTheme === 'custom-palette') {
      // For custom theme, require both colors to be defined
      const validColors = primaryColor && secondaryColor && 
                         primaryColor.length > 0 && secondaryColor.length > 0;
      setIsValid(validColors);
    } else {
      // For predefined themes, just need theme selection
      setIsValid(true);
    }
  }, [selectedTheme, primaryColor, secondaryColor]);

  // Handle theme selection change
  const handleThemeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const theme = event.target.value;
    setSelectedTheme(theme);
    
  const updateData: Record<string, unknown> = { theme };
    
    // Clear custom data if not custom theme
    if (theme !== 'custom-palette') {
      updateData.customNotes = undefined;
      updateData.primaryColor = undefined;
      updateData.secondaryColor = undefined;
    } else {
      // Set default colors for custom theme
      updateData.primaryColor = primaryColor;
      updateData.secondaryColor = secondaryColor;
      updateData.customNotes = customNotes;
    }
    
    onChange(updateData);
  };

  // Handle custom notes change
  const handleNotesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const notes = event.target.value;
    setCustomNotes(notes);
    onChange({ customNotes: notes });
  };

  // Handle color picker changes
  const handlePrimaryColorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const color = event.target.value;
    setPrimaryColor(color);
    onChange({ primaryColor: color });
  };

  const handleSecondaryColorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const color = event.target.value;
    setSecondaryColor(color);
    onChange({ secondaryColor: color });
  };

  // Handle Next button click
  const handleNext = () => {
    if (isValid) {
      onNext();
    }
  };

  const isCustomTheme = selectedTheme === 'custom-palette';

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
        <PaletteIcon sx={{ mr: 2, fontSize: '2rem', color: '#ec4899' }} />
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
          Styling & Theme
        </Typography>
      </Box>

      <Typography 
        variant="body1" 
        color="text.secondary" 
        sx={{ textAlign: 'center', mb: 4 }}
      >
        Choose the visual theme that best matches your project&apos;s aesthetic
      </Typography>

      <Box sx={{ mb: 4 }}>
        <RadioGroup
          value={selectedTheme}
          onChange={handleThemeChange}
          sx={{ gap: 1 }}
        >
          {themeOptions.map((option) => (
            <FormControlLabel
              key={option.value}
              value={option.value}
              control={
                <Radio
                  sx={{
                    color: '#22d3ee',
                    '&.Mui-checked': {
                      color: '#ec4899',
                    },
                  }}
                />
              }
              label={
                <Box>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    {option.label}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {option.description}
                  </Typography>
                </Box>
              }
              sx={{
                mb: 1,
                p: 2,
                borderRadius: 2,
                border: selectedTheme === option.value 
                  ? '2px solid #ec4899' 
                  : '2px solid transparent',
                backgroundColor: selectedTheme === option.value 
                  ? 'rgba(236, 72, 153, 0.05)' 
                  : 'transparent',
                '&:hover': {
                  backgroundColor: 'rgba(34, 211, 238, 0.05)',
                  borderColor: '#22d3ee',
                },
                transition: 'all 0.2s ease',
              }}
            />
          ))}
        </RadioGroup>

        <Collapse in={isCustomTheme}>
          <Box sx={{ mt: 3, p: 3, backgroundColor: 'rgba(132, 204, 22, 0.05)', borderRadius: 2 }}>
            <Typography variant="h6" sx={{ mb: 3, color: '#84cc16', fontWeight: 600 }}>
              Custom Palette Configuration
            </Typography>
            
            <Stack spacing={3}>
              <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                <Box sx={{ flex: 1, minWidth: 200 }}>
                  <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                    Primary Color
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <input
                      type="color"
                      value={primaryColor}
                      onChange={handlePrimaryColorChange}
                      style={{
                        width: 50,
                        height: 40,
                        border: 'none',
                        borderRadius: 8,
                        cursor: 'pointer',
                      }}
                    />
                    <TextField
                      size="small"
                      value={primaryColor}
                      onChange={handlePrimaryColorChange}
                      placeholder="#22d3ee"
                      sx={{ flex: 1 }}
                    />
                  </Box>
                </Box>

                <Box sx={{ flex: 1, minWidth: 200 }}>
                  <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                    Secondary Color
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <input
                      type="color"
                      value={secondaryColor}
                      onChange={handleSecondaryColorChange}
                      style={{
                        width: 50,
                        height: 40,
                        border: 'none',
                        borderRadius: 8,
                        cursor: 'pointer',
                      }}
                    />
                    <TextField
                      size="small"
                      value={secondaryColor}
                      onChange={handleSecondaryColorChange}
                      placeholder="#ec4899"
                      sx={{ flex: 1 }}
                    />
                  </Box>
                </Box>
              </Box>

              <TextField
                label="Design Notes (Optional)"
                variant="outlined"
                fullWidth
                multiline
                rows={3}
                value={customNotes}
                onChange={handleNotesChange}
                placeholder="Describe your vision, brand guidelines, or specific styling requirements..."
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

              {/* Color Preview */}
              <Box>
                <Typography variant="body2" sx={{ mb: 2, fontWeight: 500 }}>
                  Color Preview
                </Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Box
                    sx={{
                      width: 80,
                      height: 40,
                      borderRadius: 1,
                      background: `linear-gradient(45deg, ${primaryColor} 30%, ${secondaryColor} 90%)`,
                      border: '1px solid rgba(0,0,0,0.1)',
                    }}
                  />
                  <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <Typography variant="caption" color="text.secondary">
                      Gradient preview with your colors
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Stack>
          </Box>
        </Collapse>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          {selectedTheme ? `Selected: ${themeOptions.find(t => t.value === selectedTheme)?.label}` : 'No theme selected'}
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
