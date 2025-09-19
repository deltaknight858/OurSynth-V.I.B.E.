"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Box, Typography, TextField, Paper, Fade, List, ListItem, ListItemText, IconButton, Chip, ListItemButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import { styled } from '@mui/material/styles';
import { useOurSynthAI } from '../OurSynthAIContext';

const ElectricPurple = '#a259ff';

const Overlay = styled(Fade)(({ theme }) => ({
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  zIndex: 2000,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  pointerEvents: 'auto',
}));

const CommandBar = styled(Paper)(({ theme }) => ({
  width: '100%',
  maxWidth: 600,
  margin: '0 auto',
  background: `linear-gradient(90deg, ${ElectricPurple} 0%, #6a00f4 100%)`,
  boxShadow: '0 4px 32px rgba(162,89,255,0.25)',
  borderRadius: 16,
  padding: theme.spacing(3, 4),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'stretch',
  backdropFilter: 'blur(12px)',
}));

const CommandInput = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    background: 'rgba(255,255,255,0.08)',
    color: '#fff',
    fontWeight: 600,
    fontSize: '1.2rem',
    borderRadius: 10,
    boxShadow: '0 2px 8px #a259ff33',
    '& fieldset': {
      borderColor: ElectricPurple,
    },
    '&:hover fieldset': {
      borderColor: '#6a00f4',
    },
    '&.Mui-focused fieldset': {
      borderColor: ElectricPurple,
    },
  },
  '& .MuiInputLabel-root': {
    color: '#fff',
    fontWeight: 500,
  },
}));

const actionsByContext: Record<string, string[]> = {
  studio: [
    'Add New Component',
    'Generate Page from Description',
    'Deploy to Vercel',
  ],
  domains: [
    'Search for Domain',
    'Check DNS Status',
  ],
  pathways: [
    'Generate React Component',
    'Review AI Prompt',
  ],
  deploy: [
    'Start Deployment',
    'View Logs',
  ],
};

export const CommandCenter = ({ appContext = 'studio' }: { appContext?: string }) => {
  const { sendMessage } = useOurSynthAI();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [status, setStatus] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>(actionsByContext[appContext] || []);
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>(suggestions);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [aiSuggestions, setAISuggestions] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);

  // Fuzzy search/autocomplete
  useEffect(() => {
    if (!input.trim()) {
      setFilteredSuggestions(suggestions);
      setAISuggestions([]);
      return;
    }
    const lower = input.toLowerCase();
    setFilteredSuggestions(suggestions.filter(s => s.toLowerCase().includes(lower)));
    // Simulate real-time AI feedback
    if (input.length > 2) {
      setAISuggestions([
        `AI Suggestion: "${input}" could be a new page or action`,
        `Try "Generate ${input}" or "Explain ${input}"`,
      ]);
    } else {
      setAISuggestions([]);
    }
  }, [input, suggestions]);

  useEffect(() => {
    setSuggestions(actionsByContext[appContext] || []);
  }, [appContext]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen(true);
        setTimeout(() => inputRef.current?.focus(), 100);
      }
      if (e.key === 'Escape') {
        setOpen(false);
        setInput('');
        setStatus('');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Voice command activation (stub)
  const handleVoiceCommand = () => {
    if (!('webkitSpeechRecognition' in window)) {
      setStatus('Voice recognition not supported in this browser.');
      return;
    }
    if (!recognitionRef.current) {
      // @ts-ignore
      recognitionRef.current = new window.webkitSpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';
      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setStatus('Voice command received.');
      };
      recognitionRef.current.onerror = (event: any) => {
        setStatus('Voice recognition error.');
      };
    }
    recognitionRef.current.start();
    setStatus('Listening for voice command...');
  };

  const handleCommand = async (cmd: string) => {
    setStatus('Processing command...');
    await sendMessage(cmd);
    setStatus('');
    setOpen(false);
    setInput('');
  };

  const toggleFavorite = (action: string) => {
    setFavorites(favs => favs.includes(action) ? favs.filter(f => f !== action) : [...favs, action]);
  };

  return (
    <Overlay in={open} unmountOnExit>
      <Box sx={{ width: '100vw', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'auto' }}>
        <CommandBar>
          <Typography variant="h6" color="#fff" fontWeight={700} mb={2}>
            OurSynth Command Center
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CommandInput
              inputRef={inputRef}
              label="Type a command..."
              variant="outlined"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && input.trim()) {
                  handleCommand(input);
                }
              }}
              fullWidth
              autoFocus
              InputProps={{ startAdornment: <SearchIcon sx={{ color: ElectricPurple }} /> }}
            />
            <IconButton onClick={handleVoiceCommand} sx={{ color: ElectricPurple }} title="Voice Command">
              <span role="img" aria-label="mic">🎤</span>
            </IconButton>
          </Box>
          {status && (
            <Typography variant="body2" color="#fff" mt={2}>{status}</Typography>
          )}
          {favorites.length > 0 && (
            <Box sx={{ mt: 2, mb: 1, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {favorites.map((fav, idx) => (
                <Chip key={idx} label={fav} color="secondary" icon={<StarIcon />} onClick={() => handleCommand(fav)} />
              ))}
            </Box>
          )}
          {(filteredSuggestions.length > 0 || aiSuggestions.length > 0) && (
            <List sx={{ mt: 2, bgcolor: 'transparent' }}>
                {filteredSuggestions.map((action, idx) => (
                  <ListItem key={idx}>
                    <ListItemButton onClick={() => handleCommand(action)}>
                      <ListItemText primary={action} sx={{ color: '#fff' }} />
                    </ListItemButton>
                    <IconButton onClick={e => { e.stopPropagation(); toggleFavorite(action); }} sx={{ color: ElectricPurple }}>
                      {favorites.includes(action) ? <StarIcon /> : <StarBorderIcon />}
                    </IconButton>
                  </ListItem>
              ))}
              {aiSuggestions.map((suggestion, idx) => (
                <ListItem key={`ai-${idx}`}>
                  <ListItemText primary={suggestion} sx={{ color: ElectricPurple }} />
                </ListItem>
              ))}
            </List>
          )}
          <Typography variant="caption" color="#fff" mt={2}>
            Tip: Press Ctrl+K or Cmd+K to open, Esc to close
          </Typography>
        </CommandBar>
      </Box>
    </Overlay>
  );
};

export default CommandCenter;
