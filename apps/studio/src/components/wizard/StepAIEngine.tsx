import React, { useState } from 'react';
import {
  Box,
  Typography,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  TextField,
  Alert,
  Chip,
  Card,
  CardContent,
  styled,
  keyframes,
  Button,
  CircularProgress
} from '@mui/material';
import { 
  Psychology, 
  CheckCircle, 
  Warning,
  CloudQueue,
  SmartToy,
  Build,
  ApiOutlined
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

const EngineCard = styled(Card)<{ selected?: boolean }>(({ theme, selected }) => ({
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

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    background: 'rgba(255, 255, 255, 0.05)',
    backdropFilter: 'blur(10px)',
    borderRadius: '12px',
    '& fieldset': {
      borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    '&:hover fieldset': {
      borderColor: 'rgba(160, 32, 240, 0.5)',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#a020f0',
    },
  },
  '& .MuiInputLabel-root': {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  '& .MuiOutlinedInput-input': {
    color: 'white',
  },
}));

const engines = [
  {
    id: 'azure-openai',
    name: 'Azure OpenAI',
    description: 'Enterprise-grade OpenAI models with Azure security and compliance',
    icon: CloudQueue,
    features: ['GPT-4 Turbo', 'Enterprise Security', 'Global Scale', 'GDPR Compliant'],
    color: '#0078d4',
    recommended: true,
    requiresApiKey: true,
    keyLabel: 'Azure OpenAI API Key',
    keyPlaceholder: 'sk-...',
    endpointRequired: true,
    endpointLabel: 'Azure OpenAI Endpoint',
    endpointPlaceholder: 'https://your-resource.openai.azure.com/'
  },
  {
    id: 'vertex-ai',
    name: 'Google Vertex AI',
    description: 'Google\'s unified ML platform with Gemini Pro and PaLM models',
    icon: SmartToy,
    features: ['Gemini Pro', 'AutoML', 'Model Garden', 'Vertex Search'],
    color: '#4285f4',
    recommended: false,
    requiresApiKey: true,
    keyLabel: 'Service Account JSON',
    keyPlaceholder: 'Paste your service account JSON here...',
    projectRequired: true,
    projectLabel: 'Google Cloud Project ID',
    projectPlaceholder: 'your-project-id'
  },
  {
    id: 'custom-model',
    name: 'Custom Model',
    description: 'Bring your own model API endpoint (OpenAI compatible)',
    icon: Build,
    features: ['Your Model', 'Custom Endpoint', 'Full Control', 'Cost Effective'],
    color: '#ff6b35',
    recommended: false,
    requiresApiKey: true,
    keyLabel: 'API Key',
    keyPlaceholder: 'your-api-key',
    endpointRequired: true,
    endpointLabel: 'API Endpoint',
    endpointPlaceholder: 'https://api.yourmodel.com/v1'
  }
];

interface StepAIEngineProps {
  wizardState: {
    selectedEngine: string;
    engineConfig: {
      apiKey: string;
      endpoint?: string;
      projectId?: string;
    };
  };
  updateState: (updates: any) => void;
}

export default function StepAIEngine({ wizardState, updateState }: StepAIEngineProps) {
  const [validating, setValidating] = useState(false);
  const [validationStatus, setValidationStatus] = useState<'none' | 'success' | 'error'>('none');
  const [validationMessage, setValidationMessage] = useState('');

  const handleEngineSelect = (engineId: string) => {
    updateState({ 
      selectedEngine: engineId,
      engineConfig: {
        apiKey: '',
        endpoint: '',
        projectId: ''
      }
    });
    setValidationStatus('none');
  };

  const handleConfigChange = (field: string, value: string) => {
    updateState({
      engineConfig: {
        ...wizardState.engineConfig,
        [field]: value
      }
    });
    setValidationStatus('none');
  };

  const validateConfiguration = async () => {
    if (!wizardState.selectedEngine) return;
    
    const engine = engines.find(e => e.id === wizardState.selectedEngine);
    if (!engine) return;

    // Basic validation
    if (!wizardState.engineConfig.apiKey.trim()) {
      setValidationStatus('error');
      setValidationMessage('API key is required');
      return;
    }

    if (engine.endpointRequired && !wizardState.engineConfig.endpoint?.trim()) {
      setValidationStatus('error');
      setValidationMessage('Endpoint URL is required');
      return;
    }

    if (engine.projectRequired && !wizardState.engineConfig.projectId?.trim()) {
      setValidationStatus('error');
      setValidationMessage('Project ID is required');
      return;
    }

    setValidating(true);
    setValidationMessage('');

    try {
      // Simulate API validation (in real implementation, this would make an actual test call)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock successful validation
      setValidationStatus('success');
      setValidationMessage('Configuration validated successfully! Ready to generate amazing apps.');
    } catch (error) {
      setValidationStatus('error');
      setValidationMessage('Failed to validate configuration. Please check your credentials.');
    } finally {
      setValidating(false);
    }
  };

  const selectedEngine = engines.find(e => e.id === wizardState.selectedEngine);

  return (
    <Box sx={{ width: '100%', maxWidth: '700px' }}>
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, mb: 2 }}>
          <Psychology sx={{ fontSize: 48, color: '#a020f0' }} />
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
          Choose Your AI Engine
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
          Select the AI model that will power your app generation. Each has unique strengths!
        </Typography>
      </Box>

      {/* Engine Selection */}
      <Box sx={{ mb: 4 }}>
        {engines.map((engine, index) => {
          const IconComponent = engine.icon;
          const isSelected = wizardState.selectedEngine === engine.id;
          
          return (
            <EngineCard
              key={engine.id}
              selected={isSelected}
              onClick={() => handleEngineSelect(engine.id)}
              sx={{ 
                animationDelay: `${index * 0.1}s`,
                animationFillMode: 'both'
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
                      background: `linear-gradient(135deg, ${engine.color}20 0%, ${engine.color}10 100%)`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: `2px solid ${engine.color}40`,
                    }}
                  >
                    <IconComponent sx={{ fontSize: 32, color: engine.color }} />
                  </Box>

                  {/* Content */}
                  <Box sx={{ flex: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                      <Typography
                        variant="h6"
                        sx={{ color: 'white', fontWeight: 600 }}
                      >
                        {engine.name}
                      </Typography>
                      {engine.recommended && (
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
                      {isSelected && (
                        <CheckCircle sx={{ color: '#a020f0', fontSize: 24 }} />
                      )}
                    </Box>

                    <Typography
                      variant="body2"
                      sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 2, lineHeight: 1.5 }}
                    >
                      {engine.description}
                    </Typography>

                    {/* Features */}
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {engine.features.map((feature) => (
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
            </EngineCard>
          );
        })}
      </Box>

      {/* Configuration Form */}
      {selectedEngine && (
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
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <ApiOutlined sx={{ color: '#a020f0' }} />
            <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
              Configure {selectedEngine.name}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* API Key */}
            <StyledTextField
              fullWidth
              label={selectedEngine.keyLabel}
              placeholder={selectedEngine.keyPlaceholder}
              value={wizardState.engineConfig.apiKey}
              onChange={(e) => handleConfigChange('apiKey', e.target.value)}
              type={selectedEngine.id === 'vertex-ai' ? 'text' : 'password'}
              multiline={selectedEngine.id === 'vertex-ai'}
              rows={selectedEngine.id === 'vertex-ai' ? 4 : 1}
            />

            {/* Endpoint (if required) */}
            {selectedEngine.endpointRequired && (
              <StyledTextField
                fullWidth
                label={selectedEngine.endpointLabel}
                placeholder={selectedEngine.endpointPlaceholder}
                value={wizardState.engineConfig.endpoint || ''}
                onChange={(e) => handleConfigChange('endpoint', e.target.value)}
              />
            )}

            {/* Project ID (if required) */}
            {selectedEngine.projectRequired && (
              <StyledTextField
                fullWidth
                label={selectedEngine.projectLabel}
                placeholder={selectedEngine.projectPlaceholder}
                value={wizardState.engineConfig.projectId || ''}
                onChange={(e) => handleConfigChange('projectId', e.target.value)}
              />
            )}

            {/* Validation Button */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
              <Button
                variant="contained"
                onClick={validateConfiguration}
                disabled={validating || !wizardState.engineConfig.apiKey.trim()}
                startIcon={validating ? <CircularProgress size={16} /> : <CheckCircle />}
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
                  },
                  '&:disabled': {
                    background: 'rgba(255, 255, 255, 0.1)',
                    color: 'rgba(255, 255, 255, 0.5)',
                  }
                }}
              >
                {validating ? 'Testing Connection...' : 'Test Configuration'}
              </Button>
            </Box>

            {/* Validation Status */}
            {validationStatus !== 'none' && (
              <Alert
                severity={validationStatus === 'success' ? 'success' : 'error'}
                icon={validationStatus === 'success' ? <CheckCircle /> : <Warning />}
                sx={{
                  background: validationStatus === 'success' 
                    ? 'rgba(76, 175, 80, 0.1)' 
                    : 'rgba(244, 67, 54, 0.1)',
                  color: validationStatus === 'success' ? '#4caf50' : '#f44336',
                  border: `1px solid ${validationStatus === 'success' ? '#4caf50' : '#f44336'}40`,
                  borderRadius: '8px',
                  '& .MuiAlert-icon': {
                    color: validationStatus === 'success' ? '#4caf50' : '#f44336',
                  }
                }}
              >
                {validationMessage}
              </Alert>
            )}
          </Box>
        </Box>
      )}
    </Box>
  );
}
