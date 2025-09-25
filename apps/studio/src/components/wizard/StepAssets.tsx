import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  styled,
  keyframes
} from '@mui/material';
import { Image, CloudUpload, Construction } from '@mui/icons-material';

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

interface StepAssetsProps {
  wizardState: {
    selectedImage: string;
  };
  updateState: (updates: any) => void;
}

export default function StepAssets({ wizardState, updateState }: StepAssetsProps) {
  return (
    <Box sx={{ width: '100%', maxWidth: '600px' }}>
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, mb: 2 }}>
          <Construction sx={{ fontSize: 48, color: '#a020f0' }} />
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
          Assets & Media
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
          Coming Soon! This step will handle image uploads, media management, and asset optimization.
        </Typography>
      </Box>

      {/* Placeholder Content */}
      <Card
        sx={{
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
          backdropFilter: 'blur(10px)',
          border: '2px dashed rgba(160, 32, 240, 0.3)',
          borderRadius: '16px',
          p: 4,
          textAlign: 'center',
          animation: `${fadeInUp} 0.6s ease-out`,
        }}
      >
        <Image sx={{ fontSize: 64, color: 'rgba(160, 32, 240, 0.5)', mb: 2 }} />
        <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
          Asset Management Coming Soon
        </Typography>
        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 3 }}>
          Future features will include:
        </Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2, mb: 3 }}>
          <Box sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
            • Image uploads & optimization
          </Box>
          <Box sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
            • Logo generation with AI
          </Box>
          <Box sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
            • Icon library integration
          </Box>
          <Box sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
            • Asset compression & CDN
          </Box>
        </Box>
        
        <Button
          variant="contained"
          startIcon={<CloudUpload />}
          onClick={() => updateState({ selectedImage: 'placeholder-selected' })}
          sx={{
            background: 'linear-gradient(135deg, #a020f0 0%, #ff6b35 100%)',
            color: 'white',
            fontWeight: 600,
            px: 3,
            py: 1,
            borderRadius: '8px',
            textTransform: 'none',
            '&:hover': {
              background: 'linear-gradient(135deg, #8f1ce6 0%, #e55a2b 100%)',
            }
          }}
        >
          Skip for Now (Use Default Assets)
        </Button>
      </Card>
    </Box>
  );
}
