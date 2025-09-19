import React, { useState } from 'react';
import OurSynthWizard from './OurSynthWizard';
import StepComponents from './StepComponents';
import { Box, Button } from '@mui/material';

const WizardContainer: React.FC = () => {
  const [wizardStep, setWizardStep] = useState(1);
  const [wizardState, setWizardState] = useState({
    selectedComponents: [],
    autoSelectEnabled: false,
  });

  const updateState = (updates: any) => {
    setWizardState(prev => ({ ...prev, ...updates }));
  };

  return (
    <Box sx={{ width: '100%', maxWidth: '1000px', mx: 'auto', mt: 4 }}>
      {wizardStep === 1 && (
        <OurSynthWizard />
      )}
      {wizardStep === 2 && (
        <StepComponents wizardState={wizardState} updateState={updateState} />
      )}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
        {wizardStep === 1 && (
          <Button variant="contained" color="primary" onClick={() => setWizardStep(2)}>
            Next: Choose Components
          </Button>
        )}
        {wizardStep === 2 && (
          <Button variant="contained" color="primary" onClick={() => setWizardStep(1)}>
            Back to App Setup
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default WizardContainer;
