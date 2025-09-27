// PROMOTED from import-staging/src/features/oai/AgentPushPanel.tsx on 2025-09-08T20:34:32.046Z
// TODO: Review for token + design lint compliance.
import React, { useState } from 'react';
import { Paper, Typography, TextField, Button, Stack } from '@mui/material';

export default function AgentPushPanel() {
  const [action, setAction] = useState('');
  const [params, setParams] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePush = async () => {
    setLoading(true);
    setResult('');
    try {
      const res = await fetch('/api/agent/push', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, params: params ? JSON.parse(params) : {} }),
      });
      const data = await res.json();
      setResult(data.message || data.error || '');
    } catch (err: any) {
      setResult('Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper variant="outlined" sx={{ p: 3, mb: 4, bgcolor: '#23283a' }}>
      <Typography variant="h6" mb={2} color="primary">Push Action to Agent</Typography>
      <Stack spacing={2}>
        <TextField
          label="Action Name"
          value={action}
          onChange={e => setAction(e.target.value)}
          fullWidth
        />
        <TextField
          label="Params (JSON)"
          value={params}
          onChange={e => setParams(e.target.value)}
          fullWidth
          multiline
          minRows={2}
        />
        <Button variant="contained" color="primary" onClick={handlePush} disabled={loading || !action.trim()}>
          {loading ? 'Pushing...' : 'Push to Agent'}
        </Button>
        {result && <Typography color="secondary">{result}</Typography>}
      </Stack>
    </Paper>
  );
}
