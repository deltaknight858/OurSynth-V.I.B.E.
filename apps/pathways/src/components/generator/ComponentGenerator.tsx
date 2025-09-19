'use client';

import { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  Snackbar,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Send,
  Save,
  ContentCopy,
  AutoAwesome as AIIcon,
} from '@mui/icons-material';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabaseClient';
import CodePreview from './CodePreview';
import ProviderSelector from './ProviderSelector';

interface GeneratedComponent {
  code: string;
  prompt: string;
  provider?: string;
  model?: string;
  timestamp?: string;
}

export default function ComponentGenerator() {
  const { user } = useAuth();
  const [prompt, setPrompt] = useState('');
  const [selectedProvider, setSelectedProvider] = useState('openai');
  const [selectedModel, setSelectedModel] = useState('gpt-3.5-turbo');
  const [generatedComponent, setGeneratedComponent] = useState<GeneratedComponent | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [title, setTitle] = useState('');

  // Helper function to generate component name from prompt
  const generateComponentName = (prompt: string): string => {
    return prompt
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join('')
      .replace(/[^a-zA-Z0-9]/g, '')
      .substring(0, 30) // Limit length
      + 'Component';
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Please enter a component description');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/generate-component', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          prompt,
          provider: selectedProvider,
          model: selectedModel,
        }),
      });

      if (!response.ok) {
        let errorMessage = 'Failed to generate component';
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch (parseError) {
          // If response is not JSON (e.g., HTML error page), use status text
          errorMessage = `Server error (${response.status}): ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      let data;
      try {
        data = await response.json();
      } catch (parseError) {
        throw new Error('Invalid response format from server');
      }
      setGeneratedComponent(data);
      
      // Auto-generate title from prompt
      const autoTitle = prompt.slice(0, 50) + (prompt.length > 50 ? '...' : '');
      setTitle(autoTitle);
    } catch (err) {
      let errorMessage = err instanceof Error ? err.message : 'Failed to generate component. Please try again.';
      
      // Handle specific error cases
      if (errorMessage.includes('quota') || errorMessage.includes('429')) {
        errorMessage = '🚫 OpenAI API quota exceeded. Please try switching to Vertex AI provider or try again later.';
      } else if (errorMessage.includes('Invalid response format')) {
        errorMessage = '⚠️ Server returned an invalid response. Please try again.';
      } else if (errorMessage.includes('Server error')) {
        errorMessage = '🔧 ' + errorMessage + ' Please try switching providers or refresh the page.';
      }
      
      setError(errorMessage);
      console.error('Component generation error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!generatedComponent || !user || !title.trim()) {
      setError('Please provide a title for your component');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const { error } = await supabase.from('user_components').insert({
        user_id: user.id,
        title: title.trim(),
        prompt: generatedComponent.prompt,
        generated_code: generatedComponent.code,
      });

      if (error) throw error;

      setSuccess('Component saved successfully!');
      setTitle('');
      setGeneratedComponent(null);
      setPrompt('');
    } catch (err) {
      setError('Failed to save component. Please try again.');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleCopyCode = () => {
    if (generatedComponent) {
      navigator.clipboard.writeText(generatedComponent.code);
      setSuccess('Code copied to clipboard!');
    }
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3, space: 3, position: 'relative', zIndex: 1 }}>
      {/* Generator Section */}
      <Paper 
        className="glass-card" 
        sx={{ 
          p: 4, 
          mb: 3,
        }}
      >

        {/* AI Provider Selector */}
        <ProviderSelector
          selectedProvider={selectedProvider}
          selectedModel={selectedModel}
          onProviderChange={setSelectedProvider}
          onModelChange={setSelectedModel}
          disabled={loading}
        />

        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <TextField
            fullWidth
            multiline
            rows={3}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe your component... (e.g., 'A modern card component with electric purple energy and glass morphism')"
            disabled={loading}
            variant="outlined"
            className="electric-input"
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                borderRadius: '12px',
                '& fieldset': {
                  borderColor: 'rgba(160, 32, 240, 0.3)',
                },
                '&:hover fieldset': {
                  borderColor: 'rgba(160, 32, 240, 0.5)',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#a020f0',
                },
              },
              '& .MuiInputBase-input': {
                color: '#000000',
                fontSize: '1rem',
              },
              '& .MuiInputBase-input::placeholder': {
                color: 'rgba(0, 0, 0, 0.6)',
                opacity: 1,
              },
            }}
          />
          <Button
            variant="contained"
            onClick={handleGenerate}
            disabled={loading || !prompt.trim()}
            startIcon={loading ? <CircularProgress size={20} /> : <Send />}
            className="electric-button"
            sx={{ minWidth: 140, height: 'fit-content', py: 2 }}
          >
            {loading ? 'Generating...' : 'Generate'}
          </Button>
        </Box>
      </Paper>

      {/* Generated Component Section */}
      {generatedComponent && (
        <Paper className="glass-card" sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Box>
              <Typography variant="h5" sx={{ color: 'white' }}>
                Generated Component
              </Typography>
              {generatedComponent.provider && (
                <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                  Generated by {generatedComponent.provider}
                  {generatedComponent.model && ` using ${generatedComponent.model}`}
                  {generatedComponent.timestamp && ` at ${new Date(generatedComponent.timestamp).toLocaleTimeString()}`}
                </Typography>
              )}
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Tooltip title="Copy Code">
                <IconButton onClick={handleCopyCode} sx={{ color: 'white' }}>
                  <ContentCopy />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>

          <CodePreview 
            code={generatedComponent.code}
            fileName={`${selectedProvider === 'openai' ? 'OpenAI' : 'Vertex AI'} Generated Component`}
            language="typescript"
          />

          {user && (
            <Box sx={{ mt: 3, pt: 3, borderTop: '1px solid rgba(255, 255, 255, 0.12)' }}>
              <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
                Save Component
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <TextField
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Component title..."
                  disabled={saving}
                  sx={{
                    flex: 1,
                    '& .MuiInputBase-input': {
                      color: 'white',
                    },
                    '& .MuiInputBase-input::placeholder': {
                      color: 'rgba(255, 255, 255, 0.5)',
                    },
                  }}
                />
                <Button
                  variant="contained"
                  onClick={handleSave}
                  disabled={saving || !title.trim()}
                  startIcon={saving ? <CircularProgress size={20} /> : <Save />}
                  sx={{ minWidth: 120 }}
                >
                  {saving ? 'Saving...' : 'Save'}
                </Button>
              </Box>
            </Box>
          )}
        </Paper>
      )}

      {/* Snackbars */}
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
      >
        <Alert onClose={() => setError(null)} severity="error">
          {error}
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!success}
        autoHideDuration={4000}
        onClose={() => setSuccess(null)}
      >
        <Alert onClose={() => setSuccess(null)} severity="success">
          {success}
        </Alert>
      </Snackbar>
    </Box>
  );
}
