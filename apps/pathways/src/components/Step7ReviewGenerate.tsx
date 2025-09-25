'use client';

import React from 'react';
import { 
  Box, 
  Button, 
  Typography, 
  Paper,
  Card,
  CardContent,
  CardHeader,
  List,
  ListItem,
  ListItemText,
  Chip,
  Divider,
  IconButton,
  Stack
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import CodeIcon from '@mui/icons-material/Code';
import DownloadIcon from '@mui/icons-material/Download';
import InfoIcon from '@mui/icons-material/Info';
import BuildIcon from '@mui/icons-material/Build';
import PaletteIcon from '@mui/icons-material/Palette';
import WebIcon from '@mui/icons-material/Web';
import DeveloperModeIcon from '@mui/icons-material/DeveloperMode';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

interface Step7ReviewGenerateProps {
  data: Record<string, unknown>;
  onEdit: (stepIndex: number) => void;
  onGenerate: () => void;
  onExport: () => void;
}

export default function Step7ReviewGenerate({ data, onEdit, onGenerate, onExport }: Step7ReviewGenerateProps) {
  
  const sections = [
    {
      stepIndex: 0,
      title: 'Project Information',
      icon: <InfoIcon />,
      color: '#22d3ee',
      data: {
        'Project Name': data.projectName || 'Not specified',
        'Description': data.description || 'Not specified'
      }
    },
    {
      stepIndex: 1,
      title: 'Core Dependencies',
      icon: <BuildIcon />,
      color: '#10b981',
      data: {
        'Dependencies': data.dependencies?.length > 0 ? data.dependencies : ['None selected']
      }
    },
    {
      stepIndex: 2,
      title: 'Styling & Theme',
      icon: <PaletteIcon />,
      color: '#8b5cf6',
      data: {
        'Theme': data.theme || 'Not selected',
        ...(data.primaryColor && { 'Primary Color': data.primaryColor }),
        ...(data.secondaryColor && { 'Secondary Color': data.secondaryColor }),
        ...(data.customNotes && { 'Notes': data.customNotes })
      }
    },
    {
      stepIndex: 3,
      title: 'Page Templates',
      icon: <WebIcon />,
      color: '#f59e0b',
      data: {
        'Pages': data.pages?.length > 0 ? data.pages : ['None selected']
      }
    },
    {
      stepIndex: 4,
      title: 'Backend Features',
      icon: <DeveloperModeIcon />,
      color: '#ef4444',
      data: {
        'Features': data.backendFeatures?.length > 0 ? data.backendFeatures : ['None selected']
      }
    },
    {
      stepIndex: 5,
      title: 'AI Integration',
      icon: <SmartToyIcon />,
      color: '#ec4899',
      data: {
        'AI Provider': data.aiProvider || 'Not selected',
        ...(data.notes && { 'Integration Notes': data.notes })
      }
    }
  ];

  const renderValue = (key: string, value: unknown) => {
    if (Array.isArray(value)) {
      return (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
          {value.map((item, index) => (
            <Chip
              key={index}
              label={item}
              size="small"
              sx={{
                backgroundColor: 'rgba(34, 211, 238, 0.1)',
                color: '#22d3ee',
                border: '1px solid rgba(34, 211, 238, 0.3)',
              }}
            />
          ))}
        </Box>
      );
    }

    if (key.toLowerCase().includes('color')) {
      return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
          <Box
            sx={{
              width: 20,
              height: 20,
              backgroundColor: value,
              borderRadius: 1,
              border: '1px solid rgba(0,0,0,0.1)',
            }}
          />
          <Typography variant="body2" color="text.secondary">
            {value}
          </Typography>
        </Box>
      );
    }

    return (
      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
        {value}
      </Typography>
    );
  };

  const hasData = sections.some(section => 
    Object.values(section.data).some(value => 
      Array.isArray(value) ? value.length > 0 && value[0] !== 'None selected' : 
      value && value !== 'Not specified' && value !== 'Not selected'
    )
  );

  return (
    <Paper 
      elevation={3}
      sx={{
        p: 4,
        maxWidth: 900,
        mx: 'auto',
        mt: 4,
        background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 3
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 4 }}>
        <CheckCircleIcon sx={{ mr: 2, fontSize: '2rem', color: '#10b981' }} />
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
          Review & Generate
        </Typography>
      </Box>

      <Typography 
        variant="body1" 
        color="text.secondary" 
        sx={{ textAlign: 'center', mb: 4 }}
      >
        Review your project configuration and generate your application code
      </Typography>

      {/* Configuration Summary */}
      <Box sx={{ mb: 4 }}>
        <Stack spacing={2}>
          {sections.map((section) => (
            <Card 
              key={section.stepIndex}
              sx={{
                background: 'rgba(255,255,255,0.05)',
                backdropFilter: 'blur(5px)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 2,
              }}
            >
              <CardHeader
                avatar={
                  <Box sx={{ 
                    p: 1, 
                    borderRadius: 1, 
                    backgroundColor: `${section.color}20`,
                    color: section.color 
                  }}>
                    {section.icon}
                  </Box>
                }
                title={
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {section.title}
                  </Typography>
                }
                action={
                  <IconButton 
                    onClick={() => onEdit(section.stepIndex)}
                    sx={{ 
                      color: section.color,
                      '&:hover': {
                        backgroundColor: `${section.color}20`,
                      }
                    }}
                  >
                    <EditIcon />
                  </IconButton>
                }
                sx={{ pb: 1 }}
              />
              <CardContent sx={{ pt: 0 }}>
                <List dense>
                  {Object.entries(section.data).map(([key, value]) => (
                    <ListItem key={key} sx={{ px: 0, py: 0.5 }}>
                      <ListItemText
                        primary={
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {key}:
                          </Typography>
                        }
                        secondary={renderValue(key, value)}
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          ))}
        </Stack>
      </Box>

      {/* Configuration Status */}
      <Box sx={{ mb: 4, p: 3, backgroundColor: 'rgba(16, 185, 129, 0.1)', borderRadius: 2, border: '1px solid rgba(16, 185, 129, 0.3)' }}>
        <Typography variant="h6" sx={{ mb: 2, color: '#10b981', fontWeight: 600, display: 'flex', alignItems: 'center' }}>
          <CheckCircleIcon sx={{ mr: 1 }} />
          Configuration Status
        </Typography>
        
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {sections.map((section) => {
            const hasValidData = Object.values(section.data).some(value => 
              Array.isArray(value) ? value.length > 0 && value[0] !== 'None selected' : 
              value && value !== 'Not specified' && value !== 'Not selected'
            );
            
            return (
              <Chip
                key={section.stepIndex}
                icon={section.icon}
                label={section.title}
                size="small"
                sx={{
                  backgroundColor: hasValidData ? 'rgba(16, 185, 129, 0.2)' : 'rgba(107, 114, 128, 0.2)',
                  color: hasValidData ? '#10b981' : '#6b7280',
                  border: `1px solid ${hasValidData ? 'rgba(16, 185, 129, 0.5)' : 'rgba(107, 114, 128, 0.5)'}`,
                }}
              />
            );
          })}
        </Box>

        {!hasData && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2, fontStyle: 'italic' }}>
            Complete the wizard steps above to enable code generation
          </Typography>
        )}
      </Box>

      <Divider sx={{ mb: 4 }} />

      {/* Action Buttons */}
      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
        <Button
          variant="contained"
          size="large"
          startIcon={<CodeIcon />}
          onClick={onGenerate}
          disabled={!hasData}
          sx={{
            background: hasData 
              ? 'linear-gradient(45deg, #22d3ee 30%, #ec4899 90%)'
              : 'rgba(0,0,0,0.12)',
            color: hasData ? 'white' : 'rgba(0,0,0,0.26)',
            fontWeight: 'bold',
            px: 4,
            py: 1.5,
            borderRadius: 2,
            textTransform: 'none',
            fontSize: '1.1rem',
            minWidth: 180,
            transition: 'all 0.3s ease',
            '&:hover': hasData ? {
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
          Generate Code
        </Button>

        <Button
          variant="outlined"
          size="large"
          startIcon={<DownloadIcon />}
          onClick={onExport}
          disabled={!hasData}
          sx={{
            borderColor: hasData ? '#84cc16' : 'rgba(0,0,0,0.12)',
            color: hasData ? '#84cc16' : 'rgba(0,0,0,0.26)',
            fontWeight: 'bold',
            px: 4,
            py: 1.5,
            borderRadius: 2,
            textTransform: 'none',
            fontSize: '1.1rem',
            minWidth: 180,
            transition: 'all 0.3s ease',
            '&:hover': hasData ? {
              borderColor: '#65a30d',
              backgroundColor: 'rgba(132, 204, 22, 0.1)',
              color: '#65a30d',
              transform: 'translateY(-2px)',
            } : {},
            '&:disabled': {
              borderColor: 'rgba(0,0,0,0.12)',
              color: 'rgba(0,0,0,0.26)',
            }
          }}
        >
          Export Config
        </Button>
      </Box>

      {hasData && (
        <Typography 
          variant="body2" 
          color="text.secondary" 
          sx={{ textAlign: 'center', mt: 3, fontStyle: 'italic' }}
        >
          Ready to generate your application! Click &quot;Generate Code&quot; to create your project files.
        </Typography>
      )}
    </Paper>
  );
}
