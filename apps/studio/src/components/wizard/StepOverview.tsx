import React from 'react';
import {
  Box,
  Typography,
  TextField,
  styled,
  keyframes
} from '@mui/material';
import { Chat, Lightbulb } from '@mui/icons-material';

const bounceIn = keyframes`
  0% {
    transform: scale(0.3);
    opacity: 0;
  }
  50% {
    transform: scale(1.05);
    opacity: 0.8;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
`;

const ChatBubble = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, rgba(160, 32, 240, 0.2) 0%, rgba(255, 255, 255, 0.1) 100%)',
  border: '2px solid rgba(160, 32, 240, 0.3)',
  borderRadius: '24px',
  padding: theme.spacing(3),
  maxWidth: '600px',
  width: '100%',
  backdropFilter: 'blur(10px)',
  boxShadow: '0 8px 32px rgba(160, 32, 240, 0.2)',
  animation: `${bounceIn} 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55)`,
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    bottom: '-10px',
    left: '30px',
    width: 0,
    height: 0,
    borderLeft: '15px solid transparent',
    borderRight: '15px solid transparent',
    borderTop: '15px solid rgba(160, 32, 240, 0.3)',
  }
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    background: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '16px',
    '& fieldset': {
      borderColor: 'rgba(160, 32, 240, 0.3)',
      borderWidth: '2px',
    },
    '&:hover fieldset': {
      borderColor: 'rgba(160, 32, 240, 0.5)',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#a020f0',
      borderWidth: '2px',
    },
  },
  '& .MuiInputBase-input': {
    color: 'white',
    fontSize: '18px',
    padding: '20px',
  },
  '& .MuiInputLabel-root': {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: '16px',
    '&.Mui-focused': {
      color: '#a020f0',
    },
  },
}));

interface StepOverviewProps {
  wizardState: {
    appDescription: string;
  };
  updateState: (updates: any) => void;
}

export default function StepOverview({ wizardState, updateState }: StepOverviewProps) {
  const handleDescriptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    updateState({ appDescription: event.target.value });
  };

  const examplePrompts = [
    "A task management app for freelancers with time tracking",
    "An e-commerce store for handmade jewelry with custom sizing",
    "A recipe sharing platform with meal planning features",
    "A fitness tracking app with social challenges",
    "A portfolio website for photographers with booking system"
  ];

  const [currentExample, setCurrentExample] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentExample((prev) => (prev + 1) % examplePrompts.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, width: '100%' }}>
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, mb: 2 }}>
          <Lightbulb sx={{ fontSize: 48, color: '#a020f0' }} />
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
          What&apos;s Your Vision?
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
          Describe your app idea in one sentence. Don&apos;t worry about technical details—just tell me what you want to build.
        </Typography>
      </Box>

      {/* Chat Bubble Input */}
      <ChatBubble>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 3 }}>
          <Chat sx={{ color: '#a020f0', mt: 1 }} />
          <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.9)', fontWeight: 500 }}>
            Hi there! I&apos;m OurSynth AI, your personal app creation assistant. Let&apos;s start with the basics—what would you like to build today?
          </Typography>
        </Box>
        
        <StyledTextField
          fullWidth
          multiline
          rows={3}
          placeholder="Describe your app in one sentence..."
          value={wizardState.appDescription}
          onChange={handleDescriptionChange}
          sx={{ mb: 2 }}
        />
        
        <Typography 
          variant="body2" 
          sx={{ 
            color: 'rgba(255, 255, 255, 0.6)',
            fontSize: '14px',
            textAlign: 'center'
          }}
        >
          💡 {wizardState.appDescription.length}/500 characters
        </Typography>
      </ChatBubble>

      {/* Example Prompts */}
      <Box sx={{ textAlign: 'center', maxWidth: '600px' }}>
        <Typography 
          variant="body2" 
          sx={{ 
            color: 'rgba(255, 255, 255, 0.5)',
            mb: 2,
            fontSize: '14px'
          }}
        >
          Need inspiration? Try something like:
        </Typography>
        
        <Box
          sx={{
            minHeight: '60px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(160, 32, 240, 0.1)',
            borderRadius: '12px',
            border: '1px solid rgba(160, 32, 240, 0.2)',
            px: 3,
            py: 2,
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            '&:hover': {
              background: 'rgba(160, 32, 240, 0.15)',
              border: '1px solid rgba(160, 32, 240, 0.4)',
              transform: 'translateY(-2px)',
            }
          }}
          onClick={() => updateState({ appDescription: examplePrompts[currentExample] })}
        >
          <Typography
            variant="body1"
            sx={{
              color: 'rgba(255, 255, 255, 0.8)',
              fontStyle: 'italic',
              textAlign: 'center',
              animation: 'fadeIn 0.5s ease-in-out',
              '@keyframes fadeIn': {
                from: { opacity: 0 },
                to: { opacity: 1 }
              }
            }}
            key={currentExample} // Force re-render for animation
          >
            &quot;{examplePrompts[currentExample]}&quot;
          </Typography>
        </Box>
        
        <Typography 
          variant="caption" 
          sx={{ 
            color: 'rgba(255, 255, 255, 0.4)',
            mt: 1,
            display: 'block',
            fontSize: '12px'
          }}
        >
          Click to use this example, or write your own
        </Typography>
      </Box>

      {/* Progress Indicator */}
      {wizardState.appDescription.length > 0 && (
        <Box
          sx={{
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
            variant="body2"
            sx={{ color: '#a020f0', fontWeight: 600, textAlign: 'center' }}
          >
            ✨ Great! Ready to choose your app&apos;s vibe?
          </Typography>
        </Box>
      )}
    </Box>
  );
}
