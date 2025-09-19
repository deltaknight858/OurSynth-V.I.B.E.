import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  styled,
  keyframes
} from '@mui/material';
import { Palette, CheckCircle } from '@mui/icons-material';

const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const glowPulse = keyframes`
  0%, 100% {
    box-shadow: 0 0 20px rgba(160, 32, 240, 0.4);
  }
  50% {
    box-shadow: 0 0 30px rgba(160, 32, 240, 0.8);
  }
`;

const ThemeCard = styled(Card)<{ selected?: boolean }>(({ theme, selected }) => ({
  cursor: 'pointer',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  background: selected 
    ? 'linear-gradient(135deg, rgba(160, 32, 240, 0.2) 0%, rgba(255, 255, 255, 0.1) 100%)'
    : 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
  backdropFilter: 'blur(10px)',
  border: selected 
    ? '2px solid #a020f0'
    : '2px solid rgba(255, 255, 255, 0.1)',
  borderRadius: '16px',
  position: 'relative',
  overflow: 'visible',
  minHeight: '200px',
  animation: `${fadeInUp} 0.6s ease-out`,
  ...(selected && {
    animation: `${glowPulse} 2s infinite`,
  }),
  '&:hover': {
    transform: 'translateY(-8px) scale(1.02)',
    boxShadow: '0 20px 40px rgba(160, 32, 240, 0.3)',
    ...(selected && {
      boxShadow: '0 25px 50px rgba(160, 32, 240, 0.5)',
    })
  }
}));

const CheckIcon = styled(CheckCircle)(({ theme }) => ({
  position: 'absolute',
  top: -10,
  right: -10,
  fontSize: 32,
  color: '#a020f0',
  background: 'white',
  borderRadius: '50%',
  zIndex: 1,
}));

const ColorPreview = styled(Box)(({ theme }) => ({
  height: '60px',
  borderRadius: '8px',
  marginBottom: theme.spacing(2),
  position: 'relative',
  overflow: 'hidden',
}));

const themes = [
  {
    id: 'dark-neon',
    name: 'Dark Neon',
    description: 'Cyberpunk vibes with electric accents',
    gradient: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)',
    accent: '#00f5ff',
    text: '#ffffff',
    preview: {
      primary: '#00f5ff',
      secondary: '#ff0080',
      background: '#0a0a0a',
      surface: '#1a1a2e'
    }
  },
  {
    id: 'soft-minimal',
    name: 'Soft Minimalist',
    description: 'Clean and elegant with subtle tones',
    gradient: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 50%, #dee2e6 100%)',
    accent: '#6c63ff',
    text: '#2d3748',
    preview: {
      primary: '#6c63ff',
      secondary: '#a78bfa',
      background: '#f8f9fa',
      surface: '#ffffff'
    }
  },
  {
    id: 'retro-pixels',
    name: 'Retro Pixels',
    description: '80s inspired with vibrant colors',
    gradient: 'linear-gradient(135deg, #ff006e 0%, #8338ec 50%, #3a86ff 100%)',
    accent: '#ffbe0b',
    text: '#ffffff',
    preview: {
      primary: '#ff006e',
      secondary: '#ffbe0b',
      background: '#240046',
      surface: '#3c096c'
    }
  },
  {
    id: 'corporate-blue',
    name: 'Corporate Blue',
    description: 'Professional and trustworthy',
    gradient: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 50%, #60a5fa 100%)',
    accent: '#f59e0b',
    text: '#ffffff',
    preview: {
      primary: '#3b82f6',
      secondary: '#f59e0b',
      background: '#1e3a8a',
      surface: '#1e40af'
    }
  }
];

interface StepVibeProps {
  wizardState: {
    selectedTheme: string;
  };
  updateState: (updates: any) => void;
}

export default function StepVibe({ wizardState, updateState }: StepVibeProps) {
  const handleThemeSelect = (themeId: string) => {
    updateState({ selectedTheme: themeId });
  };

  return (
    <Box sx={{ width: '100%', maxWidth: '800px' }}>
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, mb: 2 }}>
          <Palette sx={{ fontSize: 48, color: '#a020f0' }} />
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
          Choose Your Vibe
        </Typography>
        <Typography 
          variant="h6" 
          sx={{ 
            color: 'rgba(255, 255, 255, 0.7)',
            fontWeight: 300,
            maxWidth: '500px',
            mx: 'auto'
          }}
        >
          Pick a theme that matches your app&apos;s personality. You can always customize it later!
        </Typography>
      </Box>

      {/* Theme Cards Grid */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 3 }}>
        {themes.map((theme, index) => (
          <Box key={theme.id}>
            <ThemeCard
              selected={wizardState.selectedTheme === theme.id}
              onClick={() => handleThemeSelect(theme.id)}
              sx={{ 
                animationDelay: `${index * 0.1}s`,
                animationFillMode: 'both'
              }}
            >
              {wizardState.selectedTheme === theme.id && <CheckIcon />}
              
              <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
                {/* Color Preview */}
                <ColorPreview sx={{ background: theme.gradient }}>
                  {/* Mini color swatches */}
                  <Box sx={{ 
                    position: 'absolute',
                    bottom: 8,
                    right: 8,
                    display: 'flex',
                    gap: 0.5
                  }}>
                    {Object.entries(theme.preview).map(([key, color]) => (
                      <Box
                        key={key}
                        sx={{
                          width: 16,
                          height: 16,
                          borderRadius: '50%',
                          background: color,
                          border: '1px solid rgba(255, 255, 255, 0.3)',
                          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
                        }}
                      />
                    ))}
                  </Box>
                </ColorPreview>

                {/* Theme Info */}
                <Typography 
                  variant="h6" 
                  sx={{ 
                    color: 'white',
                    fontWeight: 600,
                    mb: 1,
                    fontSize: '1.1rem'
                  }}
                >
                  {theme.name}
                </Typography>
                
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: 'rgba(255, 255, 255, 0.7)',
                    fontSize: '0.9rem',
                    lineHeight: 1.4,
                    flexGrow: 1
                  }}
                >
                  {theme.description}
                </Typography>

                {/* Typography Preview */}
                <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      color: 'rgba(255, 255, 255, 0.5)',
                      fontSize: '0.75rem',
                      mb: 1,
                      display: 'block'
                    }}
                  >
                    Preview:
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Box 
                      sx={{ 
                        fontSize: '0.8rem',
                        color: theme.preview.primary,
                        fontWeight: 600
                      }}
                    >
                      Primary Button
                    </Box>
                    <Box 
                      sx={{ 
                        fontSize: '0.7rem',
                        color: theme.text === '#ffffff' ? 'rgba(255, 255, 255, 0.8)' : 'rgba(45, 55, 72, 0.8)'
                      }}
                    >
                      Body text sample
                    </Box>
                  </Box>
                </Box>
              </CardContent>
            </ThemeCard>
          </Box>
        ))}
      </Box>

      {/* Selection Confirmation */}
      {wizardState.selectedTheme && (
        <Box
          sx={{
            mt: 4,
            textAlign: 'center',
            background: 'rgba(160, 32, 240, 0.1)',
            border: '1px solid rgba(160, 32, 240, 0.3)',
            borderRadius: '12px',
            px: 3,
            py: 2,
            animation: 'slideUp 0.3s ease-out',
            '@keyframes slideUp': {
              from: { opacity: 0, transform: 'translateY(10px)' },
              to: { opacity: 1, transform: 'translateY(0)' }
            }
          }}
        >
          <Typography
            variant="body1"
            sx={{ color: '#a020f0', fontWeight: 600 }}
          >
            🎨 Perfect choice! {themes.find(t => t.id === wizardState.selectedTheme)?.name} it is.
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: 'rgba(255, 255, 255, 0.7)', mt: 0.5 }}
          >
            Ready to power up with AI?
          </Typography>
        </Box>
      )}
    </Box>
  );
}
