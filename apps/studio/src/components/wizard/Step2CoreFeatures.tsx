import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Chip } from '@mui/material';

interface Step2Props {
  onNext: (features: string[]) => void;
  initialFeatures?: string[];
}

const Step2CoreFeatures: React.FC<Step2Props> = ({ onNext, initialFeatures = [] }) => {
  const [featureInput, setFeatureInput] = useState('');
  const [features, setFeatures] = useState<string[]>(initialFeatures);

  const handleAddFeature = () => {
    const trimmed = featureInput.trim();
    if (trimmed && !features.includes(trimmed)) {
      setFeatures([...features, trimmed]);
      setFeatureInput('');
    }
  };

  const handleDeleteFeature = (feature: string) => {
    setFeatures(features.filter(f => f !== feature));
  };

  return (
    <Box sx={{ maxWidth: 480, mx: 'auto', mt: 6, p: 3, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 3 }}>
      <Typography variant="h5" color="primary" fontWeight={700} mb={2}>
        OurSynth Wizard: Step 2
      </Typography>
      <Typography variant="body1" mb={3}>
        List the core features your application should have. Add each feature and press Enter or click Add.
      </Typography>
      <TextField
        label="Add a feature"
        variant="outlined"
        fullWidth
        value={featureInput}
        onChange={e => setFeatureInput(e.target.value)}
        onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddFeature(); } }}
        margin="normal"
      />
      <Button variant="contained" color="primary" sx={{ mt: 1, mb: 2 }} onClick={handleAddFeature} disabled={!featureInput.trim()}>
        Add Feature
      </Button>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
        {features.map(feature => (
          <Chip key={feature} label={feature} onDelete={() => handleDeleteFeature(feature)} color="secondary" />
        ))}
      </Box>
      <Button variant="contained" color="primary" sx={{ mt: 2, width: '100%' }} onClick={() => onNext(features)} disabled={features.length === 0}>
        Next
      </Button>
    </Box>
  );
};

export default Step2CoreFeatures;
