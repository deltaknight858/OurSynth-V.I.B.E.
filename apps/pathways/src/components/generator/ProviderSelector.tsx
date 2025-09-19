import React, { useState, useEffect } from 'react';
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Typography,
  Alert,
  CircularProgress,
  Tooltip,
  IconButton,
} from '@mui/material';
import { Info as InfoIcon, CheckCircle, Error } from '@mui/icons-material';

interface AIProviderConfig {
  type: string;
  name: string;
  models: string[];
  defaultModel: string;
  requiresCredentials: string[];
}

interface ProviderSelectorProps {
  selectedProvider: string;
  selectedModel?: string;
  onProviderChange: (provider: string) => void;
  onModelChange: (model: string) => void;
  disabled?: boolean;
}

const ProviderSelector: React.FC<ProviderSelectorProps> = ({
  selectedProvider,
  selectedModel,
  onProviderChange,
  onModelChange,
  disabled = false,
}) => {
  const [providers, setProviders] = useState<AIProviderConfig[]>([]);
  const [providerStatus, setProviderStatus] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProviderConfigs();
  }, []);

  const fetchProviderConfigs = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // For now, hardcode the configs since we can't easily call the backend
      const configs: AIProviderConfig[] = [
        {
          type: 'openai',
          name: 'OpenAI',
          models: ['gpt-3.5-turbo', 'gpt-4', 'gpt-4-turbo'],
          defaultModel: 'gpt-3.5-turbo',
          requiresCredentials: ['OPENAI_API_KEY'],
        },
        {
          type: 'vertex',
          name: 'Vertex AI (Google)',
          models: ['gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-1.0-pro'],
          defaultModel: 'gemini-1.5-flash',
          requiresCredentials: ['GOOGLE_CLOUD_PROJECT'],
        },
      ];

      setProviders(configs);

      // Check provider status by making test calls
      const statusChecks = await Promise.allSettled(
        configs.map(async (config) => {
          try {
            const response = await fetch('/api/generate-component', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                prompt: 'test',
                provider: config.type,
                model: config.defaultModel,
              }),
            });
            
            const result = await response.json();
            
            // If we get a configuration error, that means the provider is not set up
            return {
              provider: config.type,
              configured: !result.configRequired,
            };
          } catch {
            return {
              provider: config.type,
              configured: false,
            };
          }
        })
      );

      const status: Record<string, boolean> = {};
      statusChecks.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          status[configs[index].type] = result.value.configured;
        } else {
          status[configs[index].type] = false;
        }
      });

      setProviderStatus(status);
    } catch (err) {
      setError('Failed to load provider configurations');
      console.error('Provider config error:', err);
    } finally {
      setLoading(false);
    }
  };

  const selectedProviderConfig = providers.find(p => p.type === selectedProvider);
  const availableModels = selectedProviderConfig?.models || [];

  const getProviderStatusIcon = (providerType: string) => {
    if (loading) return <CircularProgress size={16} />;
    
    const isConfigured = providerStatus[providerType];
    return isConfigured ? (
      <CheckCircle sx={{ color: 'success.main', fontSize: 16 }} />
    ) : (
      <Error sx={{ color: 'error.main', fontSize: 16 }} />
    );
  };

  const getProviderStatusText = (config: AIProviderConfig) => {
    if (loading) return 'Checking...';
    
    const isConfigured = providerStatus[config.type];
    return isConfigured 
      ? 'Configured and ready'
      : `Not configured. Needs: ${config.requiresCredentials.join(', ')}`;
  };

  if (loading) {
    return (
      <Box display="flex" alignItems="center" gap={1}>
        <CircularProgress size={20} />
        <Typography variant="body2">Loading AI providers...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="h6" gutterBottom sx={{ color: 'primary.main' }}>
        AI Provider Settings
      </Typography>
      
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'flex-start' }}>
        {/* Provider Selection */}
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>AI Provider</InputLabel>
          <Select
            value={selectedProvider}
            label="AI Provider"
            onChange={(e) => onProviderChange(e.target.value)}
            disabled={disabled}
            renderValue={(value) => {
              const config = providers.find(p => p.type === value);
              return (
                <Box display="flex" alignItems="center" gap={1}>
                  {getProviderStatusIcon(value)}
                  {config?.name}
                </Box>
              );
            }}
          >
            {providers.map((config) => (
              <MenuItem key={config.type} value={config.type}>
                <Box display="flex" alignItems="center" gap={1} width="100%">
                  {getProviderStatusIcon(config.type)}
                  <Box flex={1}>
                    <Typography variant="body2">{config.name}</Typography>
                    <Typography 
                      variant="caption" 
                      color={providerStatus[config.type] ? 'success.main' : 'error.main'}
                    >
                      {getProviderStatusText(config)}
                    </Typography>
                  </Box>
                </Box>
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Model Selection */}
        {selectedProviderConfig && (
          <FormControl sx={{ minWidth: 180 }}>
            <InputLabel>Model</InputLabel>
            <Select
              value={selectedModel || selectedProviderConfig.defaultModel}
              label="Model"
              onChange={(e) => onModelChange(e.target.value)}
              disabled={disabled || !providerStatus[selectedProvider]}
            >
              {availableModels.map((model) => (
                <MenuItem key={model} value={model}>
                  <Box>
                    <Typography variant="body2">{model}</Typography>
                    {model === selectedProviderConfig.defaultModel && (
                      <Chip label="Default" size="small" color="primary" sx={{ ml: 1 }} />
                    )}
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        {/* Info Button */}
        <Tooltip title="View provider information and setup instructions">
          <IconButton 
            size="small" 
            onClick={() => window.open('/docs/ai-providers', '_blank')}
          >
            <InfoIcon />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Provider Status Alert */}
      {selectedProviderConfig && (
        <Alert 
          severity={providerStatus[selectedProvider] ? 'success' : 'warning'}
          sx={{ mt: 2 }}
        >
          <Typography variant="body2">
            <strong>{selectedProviderConfig.name}</strong>: {getProviderStatusText(selectedProviderConfig)}
          </Typography>
          {!providerStatus[selectedProvider] && (
            <Typography variant="caption" display="block" sx={{ mt: 1 }}>
              Add the required environment variables to your .env.local file to enable this provider.
            </Typography>
          )}
        </Alert>
      )}
    </Box>
  );
};

export default ProviderSelector;
