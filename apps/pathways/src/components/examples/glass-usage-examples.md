/* 
Glass Morphism Usage Examples

1. Basic Glass Card:
*/
<div className="glass" style={{ padding: '2rem', margin: '1rem' }}>
  <h3>Glass Morphism Card</h3>
  <p>Content with backdrop blur effect</p>
</div>

/* 
2. Interactive Glass Card with Hover:
*/
<div className="glass-card" style={{ padding: '1.5rem' }}>
  <h4>Hover me!</h4>
  <p>This card lifts on hover</p>
</div>

/* 
3. Data Visualization with Animated Nodes:
*/
<div className="glass" style={{ position: 'relative', padding: '2rem', height: '200px' }}>
  <h4>Live Data</h4>
  {/* Animated data points */}
  <div className="data-node" style={{ top: '60px', left: '50px' }} />
  <div className="data-node" style={{ top: '80px', left: '100px', animationDelay: '0.5s' }} />
  <div className="data-node" style={{ top: '40px', left: '150px', animationDelay: '1s' }} />
</div>

/* 
4. Glass Button:
*/
<button className="glass-button" style={{ padding: '0.75rem 1.5rem', color: 'white', border: 'none' }}>
  Click Me
</button>

/* 
5. Dark Glass Variant:
*/
<div className="glass-dark" style={{ padding: '2rem' }}>
  <h4>Dark Glass Theme</h4>
  <p>Perfect for dark backgrounds</p>
</div>

/* 
6. With Material-UI Components:
*/
import { Box, Typography } from '@mui/material';

<Box className="glass" sx={{ padding: 3, margin: 2 }}>
  <Typography variant="h5" sx={{ color: 'white', mb: 2 }}>
    MUI + Glass Morphism
  </Typography>
  <Typography sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
    Combining MUI components with glass styles
  </Typography>
</Box>
