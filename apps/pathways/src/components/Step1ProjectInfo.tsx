'use client';

import React, { useState, useEffect } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  Typography, 
  Paper 
} from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

interface Step1ProjectInfoProps {
  data: {
    projectName: string;
    description: string;
  };
  onChange: (newData: Partial<{ projectName: string; description: string }>) => void;
  onNext: () => void;
}

export default function Step1ProjectInfo({ data, onChange, onNext }: Step1ProjectInfoProps) {
  const [localData, setLocalData] = useState(data);
  const [isValid, setIsValid] = useState(false);

  // Validate form data
  useEffect(() => {
    const projectNameValid = localData.projectName.trim().length > 0;
    const descriptionValid = localData.description.trim().length > 0;
    setIsValid(projectNameValid && descriptionValid);
  }, [localData]);

  // Handle input changes
  const handleChange = (field: keyof typeof localData) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newValue = event.target.value;
    const updatedData = { ...localData, [field]: newValue };
    
    setLocalData(updatedData);
    onChange({ [field]: newValue });
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
        Project Information
      </Typography>

      <Typography 
        variant="body1" 
        color="text.secondary" 
        sx={{ textAlign: 'center', mb: 4 }}
      >
        Let&apos;s start with the basics about your project
      </Typography>

      <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <TextField
          label="Project Name"
          variant="outlined"
          fullWidth
          required
          value={localData.projectName}
          onChange={handleChange('projectName')}
          placeholder="Enter your project name..."
          error={localData.projectName.length === 0 && localData.projectName !== data.projectName}
          helperText={
            localData.projectName.length === 0 && localData.projectName !== data.projectName
              ? "Project name is required"
              : ""
          }
          sx={{
            '& .MuiOutlinedInput-root': {
              '&:hover fieldset': {
                borderColor: '#22d3ee',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#ec4899',
              },
            },
          }}
        />

        <TextField
          label="One-line Description"
          variant="outlined"
          fullWidth
          required
          multiline
          rows={2}
          value={localData.description}
          onChange={handleChange('description')}
          placeholder="Describe your project in one line..."
          error={localData.description.length === 0 && localData.description !== data.description}
          helperText={
            localData.description.length === 0 && localData.description !== data.description
              ? "Description is required"
              : `${localData.description.length} characters`
          }
          sx={{
            '& .MuiOutlinedInput-root': {
              '&:hover fieldset': {
                borderColor: '#22d3ee',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#ec4899',
              },
            },
          }}
        />

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
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
      </Box>
    </Paper>
  );
}
