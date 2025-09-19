import React, { useState } from 'react';
import { Box, Typography, TextField, Button } from '@mui/material';

interface Step1Props {
  onNext: (data: { name: string; description: string }) => void;
  initialName?: string;
  initialDescription?: string;
}

const Step1NameAndDescription: React.FC<Step1Props> = ({ onNext, initialName = '', initialDescription = '' }) => {
  const [name, setName] = useState(initialName);
  const [description, setDescription] = useState(initialDescription);

  const handleNext = () => {
    if (name.trim()) {
      onNext({ name, description });
    }
  };

  return (
    <Box sx={{ maxWidth: 480, mx: 'auto', mt: 6, p: 3, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 3 }}>
      <Typography variant="h5" color="primary" fontWeight={700} mb={2}>
        OurSynth Wizard: Step 1
      </Typography>
      <Typography variant="body1" mb={3}>
        Name your new application and provide a brief description to get started.
      </Typography>
      <TextField
        label="Application Name"
        variant="outlined"
        fullWidth
        value={name}
        onChange={e => setName(e.target.value)}
        margin="normal"
        required
      />
      <TextField
        label="Description"
        variant="outlined"
        fullWidth
        value={description}
        onChange={e => setDescription(e.target.value)}
        margin="normal"
        multiline
        rows={3}
      />
      <Button
        variant="contained"
        color="primary"
        sx={{ mt: 2, width: '100%' }}
        onClick={handleNext}
        disabled={!name.trim()}
      >
        Next
      </Button>
    </Box>
  );
};

export default Step1NameAndDescription;
