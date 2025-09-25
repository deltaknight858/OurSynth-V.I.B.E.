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
  Chip
} from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import CloudIcon from '@mui/icons-material/Cloud';
import BlockIcon from '@mui/icons-material/Block';
import AccountTreeIcon from '@mui/icons-material/AccountTree';

interface Step6AIIntegrationProps {
  data: {
    aiProvider: string;
    notes?: string;
  };
  onChange: (newData: Partial<{ aiProvider: string; notes?: string }>) => void;
  onNext: () => void;
}

const aiProviderOptions = [
  {
    value: 'openai-gpt',
    label: 'OpenAI GPT',
    description: 'GPT-4, GPT-3.5 models with OpenAI API',
    icon: <SmartToyIcon />,
    color: '#10b981'
  },
  {
    value: 'vertex-ai',
    label: 'Vertex AI',
    description: 'Google Cloud AI platform with various models',
    icon: <CloudIcon />,
    color: '#3b82f6'
  },
  {
    value: 'none',
    label: 'None',
    description: 'No AI integration for this project',
    icon: <BlockIcon />,
    color: '#6b7280'
  },
  {
    value: 'hybrid',
    label: 'Hybrid',
    description: 'Multiple AI providers or custom integration',
    icon: <AccountTreeIcon />,
    color: '#8b5cf6'
  }
];

export default function Step6AIIntegration({ data, onChange, onNext }: Step6AIIntegrationProps) {
  const [selectedProvider, setSelectedProvider] = useState(data.aiProvider || '');
  const [notes, setNotes] = useState(data.notes || '');
  const [isValid, setIsValid] = useState(false);

  // Validate form data
  useEffect(() => {
    const hasProvider = selectedProvider.length > 0;
    setIsValid(hasProvider);
  }, [selectedProvider]);

  // Handle provider selection change
  const handleProviderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const provider = event.target.value;
    setSelectedProvider(provider);
    
  const updateData: Record<string, unknown> = { aiProvider: provider };
    
    // Include notes for hybrid option
    if (provider === 'hybrid') {
      updateData.notes = notes;
    } else {
      // Clear notes for non-hybrid options
      updateData.notes = undefined;
      setNotes('');
    }
    
    onChange(updateData);
  };

  // Handle notes change
  const handleNotesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const notesValue = event.target.value;
    setNotes(notesValue);
    onChange({ notes: notesValue });
  };

  // Handle Next button click
  const handleNext = () => {
    if (isValid) {
      onNext();
    }
  };

  const isHybridSelected = selectedProvider === 'hybrid';
  const selectedOption = aiProviderOptions.find(option => option.value === selectedProvider);

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
        <SmartToyIcon sx={{ mr: 2, fontSize: '2rem', color: '#ec4899' }} />
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
          AI Integration
        </Typography>
      </Box>

      <Typography 
        variant="body1" 
        color="text.secondary" 
        sx={{ textAlign: 'center', mb: 4 }}
      >
        Choose how you want to integrate AI capabilities into your application
      </Typography>

      <Box sx={{ mb: 4 }}>
        <RadioGroup
          value={selectedProvider}
          onChange={handleProviderChange}
          sx={{ gap: 1 }}
        >
          {aiProviderOptions.map((option) => (
            <FormControlLabel
              key={option.value}
              value={option.value}
              control={
                <Radio
                  sx={{
                    color: option.color,
                    '&.Mui-checked': {
                      color: option.color,
                    },
                  }}
                />
              }
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                  <Box sx={{ mr: 2 }}>
                    {React.cloneElement(option.icon, { 
                      sx: { color: option.color, fontSize: '1.5rem' } 
                    })}
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      {option.label}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {option.description}
                    </Typography>
                  </Box>
                  {option.value === 'openai-gpt' && (
                    <OpenInNewIcon sx={{ color: 'text.secondary', fontSize: '1rem', ml: 1 }} />
                  )}
                </Box>
              }
              sx={{
                mb: 1,
                p: 2,
                borderRadius: 2,
                border: selectedProvider === option.value 
                  ? `2px solid ${option.color}` 
                  : '2px solid transparent',
                backgroundColor: selectedProvider === option.value 
                  ? `${option.color}10` 
                  : 'transparent',
                '&:hover': {
                  backgroundColor: `${option.color}08`,
                  borderColor: option.color,
                },
                transition: 'all 0.2s ease',
                width: '100%',
                m: 0,
                mb: 1,
              }}
            />
          ))}
        </RadioGroup>

        <Collapse in={isHybridSelected}>
          <Box sx={{ mt: 3, p: 3, backgroundColor: 'rgba(139, 92, 246, 0.05)', borderRadius: 2, border: '1px solid rgba(139, 92, 246, 0.2)' }}>
            <Typography variant="h6" sx={{ mb: 2, color: '#8b5cf6', fontWeight: 600, display: 'flex', alignItems: 'center' }}>
              <AccountTreeIcon sx={{ mr: 1 }} />
              Hybrid Integration Details
            </Typography>
            
            <TextField
              label="Integration Notes (Optional)"
              variant="outlined"
              fullWidth
              multiline
              rows={4}
              value={notes}
              onChange={handleNotesChange}
              placeholder="Describe your hybrid AI integration approach:
• Which AI providers will you use?
• How will they work together?
• Specific use cases for each provider
• Custom model requirements
• Fallback strategies"
              helperText="Provide details about your multi-provider AI strategy, custom models, or specific integration requirements"
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': {
                    borderColor: '#8b5cf6',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#8b5cf6',
                  },
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#8b5cf6',
                },
              }}
            />

            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 500, color: '#8b5cf6' }}>
                Hybrid Examples:
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {[
                  'OpenAI + Vertex AI',
                  'Multiple Models',
                  'Custom Fine-tuning',
                  'Local + Cloud',
                  'Specialized Providers'
                ].map((example) => (
                  <Chip
                    key={example}
                    label={example}
                    size="small"
                    sx={{
                      backgroundColor: 'rgba(139, 92, 246, 0.1)',
                      color: '#8b5cf6',
                      border: '1px solid rgba(139, 92, 246, 0.3)',
                    }}
                  />
                ))}
              </Box>
            </Box>
          </Box>
        </Collapse>
      </Box>

      {/* Selected Provider Summary */}
      {selectedProvider && (
        <Box sx={{ mb: 3, p: 2, backgroundColor: 'rgba(34, 211, 238, 0.05)', borderRadius: 2 }}>
          <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
            Selected AI Integration:
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Chip
              icon={selectedOption?.icon}
              label={selectedOption?.label}
              sx={{
                background: `linear-gradient(45deg, ${selectedOption?.color}20, ${selectedOption?.color}40)`,
                color: selectedOption?.color,
                fontWeight: 600,
                border: `1px solid ${selectedOption?.color}`,
              }}
            />
            {isHybridSelected && notes && (
              <Typography variant="body2" color="text.secondary" sx={{ ml: 2 }}>
                + Custom integration notes
              </Typography>
            )}
          </Box>
        </Box>
      )}

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          {selectedProvider 
            ? `Selected: ${selectedOption?.label}` 
            : 'No AI provider selected'
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
