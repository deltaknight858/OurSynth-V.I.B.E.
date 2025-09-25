import React from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  Button, 
  Chip,
  Stack
} from '@mui/material';

const SampleDashboardCard: React.FC = () => {
  return (
    <Card 
      sx={{ 
        maxWidth: 400, 
        m: 2, 
        boxShadow: 3,
        borderRadius: 2,
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white'
      }}
    >
      <CardContent>
        <Typography variant="h5" component="h2" gutterBottom>
          Dashboard Analytics
        </Typography>
        
        <Box sx={{ my: 2 }}>
          <Typography variant="h3" component="div" sx={{ fontWeight: 'bold' }}>
            12,543
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.8 }}>
            Total Users This Month
          </Typography>
        </Box>

        <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
          <Chip 
            label="+23%" 
            color="success" 
            size="small" 
            sx={{ backgroundColor: 'rgba(76, 175, 80, 0.8)' }}
          />
          <Chip 
            label="vs last month" 
            variant="outlined" 
            size="small"
            sx={{ borderColor: 'rgba(255,255,255,0.5)', color: 'white' }}
          />
        </Stack>

        <Button 
          variant="contained" 
          fullWidth
          sx={{ 
            backgroundColor: 'rgba(255,255,255,0.2)',
            '&:hover': {
              backgroundColor: 'rgba(255,255,255,0.3)'
            }
          }}
        >
          View Details
        </Button>
      </CardContent>
    </Card>
  );
};

export default SampleDashboardCard;
