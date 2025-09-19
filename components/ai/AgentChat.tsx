// PROMOTED from import-staging/src/features/oai/AgentChat.tsx on 2025-09-08T20:34:32.043Z
// TODO: Review for token + design lint compliance.
import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Paper, Stack, CircularProgress } from '@mui/material';

export default function AgentChat() {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;
    setMessages(msgs => [...msgs, { role: 'user', content: input }]);
    setLoading(true);
    setInput('');
    try {
      // Replace with your backend AI endpoint
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, { role: 'user', content: input }] }),
      });
      const data = await res.json();
      setMessages(msgs => [...msgs, { role: 'assistant', content: data.reply || data.error || 'No response.' }]);
    } catch (err: any) {
      setMessages(msgs => [...msgs, { role: 'assistant', content: 'Error: ' + err.message }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper variant="outlined" sx={{ p: 3, mb: 4, bgcolor: '#23283a' }}>
      <Typography variant="h6" mb={2} color="primary">AI Agent Chat</Typography>
      <Box sx={{ minHeight: 180, maxHeight: 320, overflowY: 'auto', mb: 2, bgcolor: '#181c24', borderRadius: 2, p: 2 }}>
        {messages.length === 0 && <Typography color="text.secondary">No messages yet. Start the conversation!</Typography>}
        {messages.map((msg, i) => (
          <Box key={i} sx={{ mb: 1, textAlign: msg.role === 'user' ? 'right' : 'left' }}>
            <Typography variant="body2" color={msg.role === 'user' ? 'secondary' : 'primary'}>
              <b>{msg.role === 'user' ? 'You' : 'Agent'}:</b> {msg.content}
            </Typography>
          </Box>
        ))}
        {loading && <CircularProgress size={20} sx={{ mt: 1 }} />}
      </Box>
      <Stack direction="row" spacing={2}>
        <TextField
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') sendMessage(); }}
          placeholder="Type your message..."
          fullWidth
          disabled={loading}
        />
        <Button variant="contained" color="primary" onClick={sendMessage} disabled={loading || !input.trim()}>
          Send
        </Button>
      </Stack>
    </Paper>
  );
}
