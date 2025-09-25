'use client';

import React, { useState, useEffect } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  Typography, 
  Paper,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Collapse
} from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

interface Step2CoreDependenciesProps {
  data: {
    dependencies: string[];
  };
  onChange: (newData: Partial<{ dependencies: string[] }>) => void;
  onNext: () => void;
}

const coreDependencies = [
  'Next.js',
  'React',
  'Tailwind CSS',
  'MUI (Glass)'
];

export default function Step2CoreDependencies({ data, onChange, onNext }: Step2CoreDependenciesProps) {
  const [selectedDependencies, setSelectedDependencies] = useState<string[]>(data.dependencies);
  const [showOtherField, setShowOtherField] = useState(false);
  const [otherDependency, setOtherDependency] = useState('');
  const [isValid, setIsValid] = useState(false);

  // Initialize other field if there are custom dependencies
  useEffect(() => {
    const customDeps = data.dependencies.filter(dep => !coreDependencies.includes(dep));
    if (customDeps.length > 0) {
      setShowOtherField(true);
      setOtherDependency(customDeps.join(', '));
    }
  }, [data.dependencies]);

  // Validate form data
  useEffect(() => {
    const hasSelection = selectedDependencies.length > 0;
    const otherFieldValid = !showOtherField || otherDependency.trim().length > 0;
    setIsValid(hasSelection && otherFieldValid);
  }, [selectedDependencies, showOtherField, otherDependency]);

  // Handle core dependency checkbox changes
  const handleDependencyChange = (dependency: string) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    let updatedDependencies: string[];
    
    if (event.target.checked) {
      updatedDependencies = [...selectedDependencies, dependency];
    } else {
      updatedDependencies = selectedDependencies.filter(dep => dep !== dependency);
    }
    
    setSelectedDependencies(updatedDependencies);
    updateData(updatedDependencies);
  };

  // Handle "Other..." checkbox change
  const handleOtherChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setShowOtherField(event.target.checked);
    
    if (!event.target.checked) {
      setOtherDependency('');
      // Remove any custom dependencies
      const coreOnly = selectedDependencies.filter(dep => coreDependencies.includes(dep));
      setSelectedDependencies(coreOnly);
      updateData(coreOnly);
    }
  };

  // Handle other dependency text field change
  const handleOtherTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setOtherDependency(value);
    
    // Update dependencies with custom ones
    const coreSelected = selectedDependencies.filter(dep => coreDependencies.includes(dep));
    const customDeps = value.trim() 
      ? value.split(',').map(dep => dep.trim()).filter(dep => dep.length > 0)
      : [];
    
    const allDependencies = [...coreSelected, ...customDeps];
    setSelectedDependencies(allDependencies);
    updateData(allDependencies);
  };

  // Update parent component data
  const updateData = (dependencies: string[]) => {
    onChange({ dependencies });
  };

  // Handle Next button click
  const handleNext = () => {
    if (isValid) {
      onNext();
    }
  };

  return (
    <Paper 
      elevation={3}
      sx={{
        p: 4,
        maxWidth: 600,
        mx: 'auto',
        mt: 4,
        background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 3
      }}
    >
      <Typography 
        variant="h4" 
        component="h1" 
        gutterBottom
        sx={{
          background: 'linear-gradient(45deg, #22d3ee 30%, #ec4899 90%)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontWeight: 'bold',
          textAlign: 'center',
          mb: 3
        }}
      >
        Core Dependencies
      </Typography>

      <Typography 
        variant="body1" 
        color="text.secondary" 
        sx={{ textAlign: 'center', mb: 4 }}
      >
        Select the core technologies you want to include in your project
      </Typography>

      <Box sx={{ mb: 4 }}>
        <FormGroup>
          {coreDependencies.map((dependency) => (
            <FormControlLabel
              key={dependency}
              control={
                <Checkbox
                  checked={selectedDependencies.includes(dependency)}
                  onChange={handleDependencyChange(dependency)}
                  sx={{
                    color: '#22d3ee',
                    '&.Mui-checked': {
                      color: '#ec4899',
                    },
                    '&.Mui-checked:hover': {
                      backgroundColor: 'rgba(236, 72, 153, 0.1)',
                    },
                  }}
                />
              }
              label={
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {dependency}
                </Typography>
              }
              sx={{
                mb: 1,
                '&:hover': {
                  backgroundColor: 'rgba(34, 211, 238, 0.05)',
                  borderRadius: 1,
                },
              }}
            />
          ))}
          
          <FormControlLabel
            control={
              <Checkbox
                checked={showOtherField}
                onChange={handleOtherChange}
                sx={{
                  color: '#84cc16',
                  '&.Mui-checked': {
                    color: '#84cc16',
                  },
                  '&.Mui-checked:hover': {
                    backgroundColor: 'rgba(132, 204, 22, 0.1)',
                  },
                }}
              />
            }
            label={
              <Typography variant="body1" sx={{ fontWeight: 500, fontStyle: 'italic' }}>
                Other...
              </Typography>
            }
            sx={{
              mt: 2,
              '&:hover': {
                backgroundColor: 'rgba(132, 204, 22, 0.05)',
                borderRadius: 1,
              },
            }}
          />
        </FormGroup>

        <Collapse in={showOtherField}>
          <Box sx={{ mt: 2, ml: 4 }}>
            <TextField
              label="Custom Dependencies"
              variant="outlined"
              fullWidth
              value={otherDependency}
              onChange={handleOtherTextChange}
              placeholder="Enter custom dependencies (comma-separated)..."
              helperText="Separate multiple dependencies with commas"
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

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          {selectedDependencies.length} {selectedDependencies.length === 1 ? 'dependency' : 'dependencies'} selected
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
