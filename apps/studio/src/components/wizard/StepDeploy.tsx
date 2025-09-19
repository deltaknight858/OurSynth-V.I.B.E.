import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  styled,
  keyframes,
  Chip
} from '@mui/material';
import { 
  Rocket,
  Cloud,
  GitHub,
  Storage,
  CheckCircle,
  Construction
} from '@mui/icons-material';

const fadeInScale = keyframes`
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`;

const StyledStrong = styled('strong')(({ theme }) => ({
  color: '#a020f0',
}));

const DeployCard = styled(Card)<{ selected?: boolean }>(({ theme, selected }) => ({
  cursor: 'pointer',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  background: selected 
    ? 'linear-gradient(135deg, rgba(160, 32, 240, 0.15) 0%, rgba(255, 255, 255, 0.1) 100%)'
    : 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)',
  backdropFilter: 'blur(10px)',
  border: selected 
    ? '2px solid #a020f0'
    : '2px solid rgba(255, 255, 255, 0.1)',
  borderRadius: '16px',
  marginBottom: theme.spacing(2),
  position: 'relative',
  animation: `${fadeInScale} 0.4s ease-out`,
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 12px 24px rgba(160, 32, 240, 0.2)',
    borderColor: selected ? '#a020f0' : 'rgba(160, 32, 240, 0.5)',
  }
}));

const deployOptions = [
  {
    id: 'azure-static',
    name: 'Azure Static Web Apps',
    description: 'Deploy directly to Azure with automatic CI/CD',
    icon: Storage,
    features: ['Free tier available', 'Custom domains', 'GitHub integration', 'Global CDN'],
    color: '#0078d4',
    recommended: true,
    comingSoon: false
  },
  {
    id: 'github-pages',
    name: 'GitHub Pages',
    description: 'Host your static site for free on GitHub',
    icon: GitHub,
    features: ['Free hosting', 'Custom domains', 'HTTPS included', 'Version control'],
    color: '#24292e',
    recommended: false,
    comingSoon: true
  },
  {
    id: 'netlify',
    name: 'Netlify',
    description: 'Modern web deployment platform',
    icon: Cloud,
    features: ['Form handling', 'Edge functions', 'Split testing', 'Analytics'],
    color: '#00c7b7',
    recommended: false,
    comingSoon: true
  }
];

interface StepDeployProps {
  wizardState: {
    deploymentConfig: any;
  };
  updateState: (updates: any) => void;
}

export default function StepDeploy({ wizardState, updateState }: StepDeployProps) {
  const [selectedOption, setSelectedOption] = useState('');

  const handleOptionSelect = (optionId: string) => {
    setSelectedOption(optionId);
    updateState({ 
      deploymentConfig: { 
        platform: optionId,
        configured: true 
      } 
    });
  };

  return (
    <Box sx={{ width: '100%', maxWidth: '700px' }}>
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, mb: 2 }}>
          <Rocket sx={{ fontSize: 48, color: '#a020f0' }} />
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
          Deploy Your App
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
          Choose where to deploy your application. We&apos;ll handle the deployment configuration!
        </Typography>
      </Box>

      {/* Deploy Options */}
      <Box sx={{ mb: 4 }}>
        {deployOptions.map((option, index) => {
          const IconComponent = option.icon;
          const isSelected = selectedOption === option.id;
          
          return (
            <DeployCard
              key={option.id}
              selected={isSelected}
              onClick={() => !option.comingSoon && handleOptionSelect(option.id)}
              sx={{ 
                animationDelay: `${index * 0.1}s`,
                animationFillMode: 'both',
                opacity: option.comingSoon ? 0.6 : 1,
                cursor: option.comingSoon ? 'not-allowed' : 'pointer'
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 3 }}>
                  {/* Icon */}
                  <Box
                    sx={{
                      minWidth: 64,
                      height: 64,
                      borderRadius: '16px',
                      background: `linear-gradient(135deg, ${option.color}20 0%, ${option.color}10 100%)`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: `2px solid ${option.color}40`,
                    }}
                  >
                    <IconComponent sx={{ fontSize: 32, color: option.color }} />
                  </Box>

                  {/* Content */}
                  <Box sx={{ flex: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                      <Typography
                        variant="h6"
                        sx={{ color: 'white', fontWeight: 600 }}
                      >
                        {option.name}
                      </Typography>
                      {option.recommended && (
                        <Chip
                          label="Recommended"
                          size="small"
                          sx={{
                            background: 'linear-gradient(135deg, #a020f0 0%, #ff6b35 100%)',
                            color: 'white',
                            fontWeight: 600,
                            fontSize: '0.7rem'
                          }}
                        />
                      )}
                      {option.comingSoon && (
                        <Chip
                          label="Coming Soon"
                          size="small"
                          icon={<Construction sx={{ fontSize: 14 }} />}
                          sx={{
                            background: 'rgba(255, 193, 7, 0.2)',
                            color: '#ffc107',
                            fontWeight: 600,
                            fontSize: '0.7rem',
                            '& .MuiChip-icon': {
                              color: '#ffc107'
                            }
                          }}
                        />
                      )}
                      {isSelected && !option.comingSoon && (
                        <CheckCircle sx={{ color: '#a020f0', fontSize: 24 }} />
                      )}
                    </Box>

                    <Typography
                      variant="body2"
                      sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 2, lineHeight: 1.5 }}
                    >
                      {option.description}
                    </Typography>

                    {/* Features */}
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {option.features.map((feature) => (
                        <Chip
                          key={feature}
                          label={feature}
                          size="small"
                          variant="outlined"
                          sx={{
                            borderColor: 'rgba(255, 255, 255, 0.2)',
                            color: 'rgba(255, 255, 255, 0.8)',
                            fontSize: '0.7rem',
                            height: 24
                          }}
                        />
                      ))}
                    </Box>
                  </Box>
                </Box>
              </CardContent>
            </DeployCard>
          );
        })}
      </Box>

      {/* Configuration Preview */}
      {selectedOption && (
        <Box
          sx={{
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            p: 3,
            animation: 'slideUp 0.3s ease-out',
            '@keyframes slideUp': {
              from: { opacity: 0, transform: 'translateY(20px)' },
              to: { opacity: 1, transform: 'translateY(0)' }
            }
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <CheckCircle sx={{ color: '#a020f0' }} />
            <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
              Deployment Configuration
            </Typography>
          </Box>
          
          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 2 }}>
            Your app will be deployed to{' '}
            <StyledStrong>
              {deployOptions.find(opt => opt.id === selectedOption)?.name}
            </StyledStrong>
            {' '}with the following setup:
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
              • Automatic build and deployment pipeline
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
              • Custom domain configuration (optional)
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
              • SSL certificate provisioning
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
              • Environment variable management
            </Typography>
          </Box>
        </Box>
      )}
    </Box>
  );
}
