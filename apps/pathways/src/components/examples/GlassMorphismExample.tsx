// Example usage of glass morphism styles

import React from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';

export default function GlassMorphismExample() {
  return (
    <Box sx={{ 
      padding: 4, 
      background: 'linear-gradient(135deg, rgba(74, 144, 226, 0.3) 0%, rgba(80, 39, 176, 0.3) 100%)',
      minHeight: '100vh',
      position: 'relative'
    }}>
      {/* Basic Glass Card */}
      <div className="glass" style={{ padding: '2rem', marginBottom: '2rem', maxWidth: '400px' }}>
        <Typography variant="h5" sx={{ color: 'white', marginBottom: 2 }}>
          Glass Morphism Card
        </Typography>
        <Typography sx={{ color: 'rgba(255, 255, 255, 0.8)', marginBottom: 3 }}>
          This is a basic glass morphism card with backdrop blur and transparent background.
        </Typography>
        <Button 
          variant="contained" 
          className="glass-button"
          sx={{ color: 'white' }}
        >
          Glass Button
        </Button>
      </div>

      {/* Glass Card with Hover Effect */}
      <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '2rem', maxWidth: '400px' }}>
        <Typography variant="h6" sx={{ color: 'white', marginBottom: 1 }}>
          Interactive Glass Card
        </Typography>
        <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
          This card has hover effects and will lift when you hover over it.
        </Typography>
      </div>

      {/* Dark Glass Variant */}
      <div className="glass-dark" style={{ padding: '2rem', marginBottom: '2rem', maxWidth: '400px' }}>
        <Typography variant="h6" sx={{ color: 'white', marginBottom: 1 }}>
          Dark Glass Variant
        </Typography>
        <Typography sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
          This uses the dark glass variant with different opacity and colors.
        </Typography>
      </div>

      {/* Data Nodes Example */}
      <Box sx={{ position: 'relative', width: '200px', height: '200px', marginTop: 4 }}>
        <Paper 
          className="glass" 
          sx={{ 
            padding: 3, 
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <Typography variant="h6" sx={{ color: 'white' }}>
            Data Visualization
          </Typography>
          
          {/* Animated Data Nodes */}
          <div 
            className="data-node" 
            style={{ top: '20px', left: '30px' }}
          />
          <div 
            className="data-node" 
            style={{ top: '50px', left: '80px', animationDelay: '0.5s' }}
          />
          <div 
            className="data-node" 
            style={{ top: '30px', left: '120px', animationDelay: '1s' }}
          />
          <div 
            className="data-node" 
            style={{ top: '70px', left: '150px', animationDelay: '1.5s' }}
          />
          <div 
            className="data-node" 
            style={{ top: '90px', left: '50px', animationDelay: '2s' }}
          />
        </Paper>
      </Box>

      {/* Multiple Glass Elements */}
      <Box sx={{ display: 'flex', gap: 2, marginTop: 4, flexWrap: 'wrap' }}>
        <div className="glass" style={{ padding: '1rem', flex: '1', minWidth: '150px' }}>
          <Typography variant="body2" sx={{ color: 'white' }}>
            Glass Element 1
          </Typography>
        </div>
        <div className="glass" style={{ padding: '1rem', flex: '1', minWidth: '150px' }}>
          <Typography variant="body2" sx={{ color: 'white' }}>
            Glass Element 2
          </Typography>
        </div>
        <div className="glass" style={{ padding: '1rem', flex: '1', minWidth: '150px' }}>
          <Typography variant="body2" sx={{ color: 'white' }}>
            Glass Element 3
          </Typography>
        </div>
      </Box>
    </Box>
  );
}

// Usage in your pages:
// import GlassMorphismExample from '@/components/GlassMorphismExample';
// 
// export default function HomePage() {
//   return <GlassMorphismExample />;
// }
