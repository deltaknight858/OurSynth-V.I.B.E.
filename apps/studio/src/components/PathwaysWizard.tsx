import React, { useState, useEffect } from 'react';
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  Button,
  Typography,
  Container,
  Zoom,
  styled,
  keyframes
} from '@mui/material';
import { AutoAwesome, Rocket } from '@mui/icons-material';
import StepOverview from './wizard/StepOverview';
import StepVibe from './wizard/StepVibe';
import StepAIEngine from './wizard/StepAIEngine';
import StepComponents from './wizard/StepComponents';
import StepAssets from './wizard/StepAssets';
import StepDeploy from './wizard/StepDeploy';

// Entrance animation keyframes
const spinIn = keyframes`
  0% {
    transform: scale(0.3) rotate(-180deg);
    opacity: 0;
  }
  50% {
    transform: scale(1.05) rotate(-90deg);
    opacity: 0.8;
  }
  100% {
    transform: scale(1) rotate(0deg);
    opacity: 1;
  }
`;

const glassEffect = keyframes`
  0% { backdrop-filter: blur(0px); }
  100% { backdrop-filter: blur(20px); }
`;

// Styled Components
const WizardContainer = styled(Box)(({ theme }) => ({
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  background: 'linear-gradient(135deg, rgba(160, 32, 240, 0.1) 0%, rgba(0, 0, 0, 0.8) 100%)',
  backdropFilter: 'blur(20px)',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 9999,
  animation: `${glassEffect} 0.8s ease-out`,
}));

const WizardShell = styled(Container)(({ theme }) => ({
  background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
  backdropFilter: 'blur(30px)',
  border: '1px solid rgba(160, 32, 240, 0.3)',
  borderRadius: '24px',
  padding: theme.spacing(4),
  minHeight: '70vh',
  maxWidth: '900px',
  position: 'relative',
  boxShadow: '0 20px 40px rgba(160, 32, 240, 0.2)',
  animation: `${spinIn} 1.2s cubic-bezier(0.68, -0.55, 0.265, 1.55)`,
}));

const StepContent = styled(Box)(({ theme }) => ({
  minHeight: '400px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  padding: theme.spacing(3),
  animation: 'fadeIn 0.5s ease-in-out',
  '@keyframes fadeIn': {
    from: { opacity: 0, transform: 'translateY(20px)' },
    to: { opacity: 1, transform: 'translateY(0)' }
  }
}));

const NavigationButtons = styled(Box)(({ theme }) => ({
  position: 'absolute',
  bottom: theme.spacing(3),
  right: theme.spacing(3),
  display: 'flex',
  gap: theme.spacing(2),
}));

const StepIcon = styled('span')(({ theme }) => ({
  fontSize: '18px',
}));

const StyledButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(135deg, #a020f0 0%, #7b1fa2 100%)',
  color: 'white',
  padding: '12px 24px',
  borderRadius: '12px',
  textTransform: 'none',
  fontSize: '16px',
  fontWeight: 600,
  boxShadow: '0 4px 15px rgba(160, 32, 240, 0.4)',
  '&:hover': {
    background: 'linear-gradient(135deg, #b429f5 0%, #8e24aa 100%)',
    boxShadow: '0 6px 20px rgba(160, 32, 240, 0.6)',
    transform: 'translateY(-2px)',
  },
  '&:disabled': {
    background: 'rgba(255, 255, 255, 0.1)',
    color: 'rgba(255, 255, 255, 0.5)',
    boxShadow: 'none',
  },
  transition: 'all 0.3s ease',
}));

// Wizard Steps Configuration
const wizardSteps = [
  { label: 'Overview', icon: '🎯' },
  { label: 'Vibe', icon: '🎨' },
  { label: 'AI Engine', icon: '🤖' },
  { label: 'Components', icon: '🧩' },
  { label: 'Assets', icon: '🖼️' },
  { label: 'Deploy', icon: '🚀' }
];

interface WizardState {
  appDescription: string;
  selectedTheme: string;
  selectedEngine: string;
  engineConfig: {
    apiKey: string;
    endpoint?: string;
    projectId?: string;
  };
  selectedComponents: string[];
  autoSelectEnabled: boolean;
  selectedImage: string;
  deploymentConfig: any;
}

interface PathwaysWizardProps {
  open: boolean;
  onClose: () => void;
  onComplete: (config: WizardState) => void;
}

export default function PathwaysWizard({ open, onClose, onComplete }: PathwaysWizardProps) {
  const [activeStep, setActiveStep] = useState(0);
  const [wizardState, setWizardState] = useState<WizardState>({
    appDescription: '',
    selectedTheme: '',
    selectedEngine: '',
    engineConfig: {
      apiKey: '',
      endpoint: '',
      projectId: ''
    },
    selectedComponents: [],
    autoSelectEnabled: false,
    selectedImage: '',
    deploymentConfig: {}
  });

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (open) {
      setIsVisible(true);
    }
  }, [open]);

  const handleNext = () => {
    if (activeStep === wizardSteps.length - 1) {
      // Final step - complete wizard
      onComplete(wizardState);
      handleClose();
    } else {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
      setActiveStep(0);
      setWizardState({
        appDescription: '',
        selectedTheme: '',
        selectedEngine: '',
        engineConfig: {
          apiKey: '',
          endpoint: '',
          projectId: ''
        },
        selectedComponents: [],
        autoSelectEnabled: false,
        selectedImage: '',
        deploymentConfig: {}
      });
    }, 300);
  };

  const updateWizardState = (updates: Partial<WizardState>) => {
    setWizardState(prev => ({ ...prev, ...updates }));
  };

  const isNextDisabled = () => {
    switch (activeStep) {
      case 0: return !wizardState.appDescription.trim();
      case 1: return !wizardState.selectedTheme;
      case 2: return !wizardState.selectedEngine || !wizardState.engineConfig.apiKey.trim();
      case 3: return wizardState.selectedComponents.length === 0;
      case 4: return !wizardState.selectedImage;
      case 5: return Object.keys(wizardState.deploymentConfig).length === 0;
      default: return false;
    }
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return <StepOverview wizardState={wizardState} updateState={updateWizardState} />;
      case 1:
        return <StepVibe wizardState={wizardState} updateState={updateWizardState} />;
      case 2:
        return <StepAIEngine wizardState={wizardState} updateState={updateWizardState} />;
      case 3:
        return <StepComponents wizardState={wizardState} updateState={updateWizardState} />;
      case 4:
        return <StepAssets wizardState={wizardState} updateState={updateWizardState} />;
      case 5:
        return <StepDeploy wizardState={wizardState} updateState={updateWizardState} />;
      default:
        return null;
    }
  };

  if (!open) return null;

  return (
    <Zoom in={isVisible} timeout={800}>
      <WizardContainer>
        <WizardShell>
          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, mb: 2 }}>
              <AutoAwesome sx={{ fontSize: 40, color: '#a020f0' }} />
              <Typography 
                variant="h3" 
                sx={{ 
                  background: 'linear-gradient(135deg, #a020f0 0%, #ffffff 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontWeight: 700,
                  letterSpacing: '-0.5px'
                }}
              >
                OurSynth Wizard
              </Typography>
            </Box>
            <Typography variant="h6" sx={{ color: 'rgba(255, 255, 255, 0.8)', fontWeight: 300 }}>
              Let&apos;s build something amazing together
            </Typography>
          </Box>

          {/* Stepper */}
          <Stepper 
            activeStep={activeStep} 
            sx={{ 
              mb: 4,
              '& .MuiStepLabel-root': {
                color: 'rgba(255, 255, 255, 0.6)',
              },
              '& .MuiStepLabel-active': {
                color: '#a020f0 !important',
              },
              '& .MuiStepLabel-completed': {
                color: '#a020f0 !important',
              },
              '& .MuiStepIcon-root': {
                color: 'rgba(255, 255, 255, 0.3)',
                '&.Mui-active': {
                  color: '#a020f0',
                },
                '&.Mui-completed': {
                  color: '#a020f0',
                }
              }
            }}
          >
            {wizardSteps.map((step, index) => (
              <Step key={step.label}>
                <StepLabel>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <StepIcon>{step.icon}</StepIcon>
                    {step.label}
                  </Box>
                </StepLabel>
              </Step>
            ))}
          </Stepper>

          {/* Step Content */}
          <StepContent key={activeStep}>
            {renderStepContent()}
          </StepContent>

          {/* Navigation */}
          <NavigationButtons>
            <StyledButton 
              onClick={handleClose}
              variant="outlined"
              sx={{ 
                background: 'transparent',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                color: 'white',
                '&:hover': {
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.5)',
                }
              }}
            >
              Cancel
            </StyledButton>
            
            {activeStep > 0 && (
              <StyledButton 
                onClick={handleBack}
                variant="outlined"
                sx={{ 
                  background: 'transparent',
                  border: '1px solid #a020f0',
                  color: '#a020f0',
                  '&:hover': {
                    background: 'rgba(160, 32, 240, 0.1)',
                  }
                }}
              >
                Back
              </StyledButton>
            )}
            
            <StyledButton 
              onClick={handleNext}
              disabled={isNextDisabled()}
              startIcon={activeStep === wizardSteps.length - 1 ? <Rocket /> : null}
            >
              {activeStep === wizardSteps.length - 1 ? 'Deploy App' : 'Next'}
            </StyledButton>
          </NavigationButtons>
        </WizardShell>
      </WizardContainer>
    </Zoom>
  );
}
