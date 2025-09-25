import React, { useState } from 'react';
import { Box, Typography, Button, CircularProgress, List, ListItem, ListItemText } from '@mui/material';

interface Step3Props {
  appName: string;
  description: string;
  features: string[];
  onFinish: () => void;
}

const Step3AISuggestions: React.FC<Step3Props> = ({ appName, description, features, onFinish }) => {
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchAISuggestions = async () => {
    setLoading(true);
    setError(null);
    try {
      // Replace with actual OpenAI API call
      // For now, mock suggestions
      await new Promise(res => setTimeout(res, 1200));
      setSuggestions([
        'Home Page',
        'Dashboard',
        'Settings',
        'Feature: ' + features.join(', '),
        'Profile',
        'Help Center',
      ]);
    } catch (err) {
      setError('Failed to fetch AI suggestions.');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchAISuggestions();
    // eslint-disable-next-line
  }, []);

  return (
    <Box sx={{ maxWidth: 480, mx: 'auto', mt: 6, p: 3, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 3 }}>
      <Typography variant="h5" color="primary" fontWeight={700} mb={2}>
        OurSynth Wizard: Step 3
      </Typography>
      <Typography variant="body1" mb={3}>
        Based on your inputs, here are suggested pages and components for your application:
      </Typography>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 120 }}>
          <CircularProgress color="primary" />
        </Box>
      ) : error ? (
        <Typography color="error" mb={2}>{error}</Typography>
      ) : (
        <List>
          {suggestions.map((suggestion, idx) => (
            <ListItem key={idx}>
              <ListItemText primary={suggestion} />
            </ListItem>
          ))}
        </List>
      )}
      <Button variant="contained" color="primary" sx={{ mt: 3, width: '100%' }} onClick={onFinish}>
        Finish
      </Button>
    </Box>
  );
};

export default Step3AISuggestions;
