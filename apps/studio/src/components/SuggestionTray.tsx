// ⭐️ Phase 3: Magic Suggestion UI
import React, { useEffect, useState } from 'react';
import { Box, Typography, IconButton, Drawer, Button, Tooltip } from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import PreviewIcon from '@mui/icons-material/Preview';

// Mock user/session ID
const USER_ID = 'demo-user';

async function fetchProactiveSuggestions() {
  const res = await fetch('/api/generate/proactive-poll?userId=' + USER_ID);
  if (!res.ok) return null;
  return await res.json();
}

export const SuggestionTray: React.FC<{ onInsertComponent?: (component: any) => void }> = ({ onInsertComponent }) => {
  const [open, setOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [components, setComponents] = useState<Record<string, string>>({});
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    const poll = setInterval(async () => {
      const data = await fetchProactiveSuggestions();
      if (data && data.components) {
        setComponents(data.components);
        setSuggestions(data.suggestions || []);
      }
    }, 5000); // Poll every 5s
    return () => clearInterval(poll);
  }, []);

  return (
    <Box sx={{ position: 'fixed', right: 32, bottom: 32, zIndex: 1500 }}>
      <Tooltip title="AI Suggestions Available!">
        <IconButton onClick={() => setOpen(true)} sx={{ bgcolor: '#a259ff', color: '#fff', boxShadow: '0 0 16px #a259ff88' }}>
          <AutoAwesomeIcon />
        </IconButton>
      </Tooltip>
      <Drawer anchor="right" open={open} onClose={() => setOpen(false)}>
        <Box sx={{ width: 340, p: 3 }}>
          <Typography variant="h6" color="#a259ff" fontWeight={700} mb={2}>
            Magic Suggestions
          </Typography>
          {Object.keys(components).length === 0 ? (
            <Typography variant="body2">No suggestions yet. Keep designing!</Typography>
          ) : (
            Object.entries(components).map(([name, code]) => (
              <Box key={name} sx={{ mb: 2, p: 2, bgcolor: '#f3f0ff', borderRadius: 2, boxShadow: '0 2px 8px #a259ff22' }}>
                <Typography variant="subtitle1" color="#a259ff" fontWeight={600}>{name}</Typography>
                <Button startIcon={<PreviewIcon />} sx={{ mt: 1 }} onClick={() => setSelected(name)}>
                  Preview
                </Button>
                {/* Insert button would trigger adding to canvas */}
                <Button
                  variant="contained"
                  color="primary"
                  sx={{ mt: 1, ml: 1 }}
                  onClick={() => {
                    if (onInsertComponent) {
                      // Pass the component data (name, code, etc.)
                      onInsertComponent({
                        name,
                        code,
                        type: 'ai',
                        displayName: name,
                        color: '#a259ff',
                      });
                    }
                  }}
                >
                  Insert
                </Button>
                {selected === name && (
                  <Box sx={{ mt: 2, bgcolor: '#222', color: '#fff', p: 2, borderRadius: 2 }}>
                    <Typography variant="caption" color="#a259ff">Preview:</Typography>
                    <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', margin: 0 }}>{code}</pre>
                  </Box>
                )}
              </Box>
            ))
          )}
          {suggestions.length > 0 && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2" color="#a259ff">Other Suggestions:</Typography>
              {suggestions.map((s, idx) => (
                <Typography key={idx} variant="body2" sx={{ color: '#555', mb: 1 }}>{s}</Typography>
              ))}
            </Box>
          )}
        </Box>
      </Drawer>
    </Box>
  );
};

export default SuggestionTray;
