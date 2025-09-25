
import React, { useState, useRef, useEffect } from 'react';
import { Box, Typography, TextField, Button, Paper, List, ListItem, ListItemText, Divider } from '@mui/material';
import { useOurSynthAI } from '../OurSynthAIContext';

const ElectricPurple = '#a259ff';

const ChatInterface: React.FC = () => {
  const { messages, sendMessage, generateComponent, explainCode } = useOurSynthAI();
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [codeExplanation, setCodeExplanation] = useState('');
  const [status, setStatus] = useState('');
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    setSending(true);
    setStatus('Sending message to AI...');
    await sendMessage(input);
    setInput('');
    setStatus('');
    setSending(false);
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setStatus('Generating component via Pathways Generator...');
    const { code, explanation } = await generateComponent(prompt);
    setGeneratedCode(code);
    setStatus(explanation);
  };

  const handleExplainCode = async () => {
    if (!generatedCode.trim()) return;
    setStatus('Requesting code explanation from AI...');
    const explanation = await explainCode(generatedCode);
    setCodeExplanation(explanation);
    setStatus('');
  };

  return (
    <Paper elevation={6} sx={{ maxWidth: 480, mx: 'auto', mt: 6, p: 2, borderRadius: 3, background: `linear-gradient(90deg, ${ElectricPurple} 0%, #6a00f4 100%)` }}>
      <Typography variant="h6" fontWeight={700} color="#fff" mb={2}>
        OurSynth AI Chat
      </Typography>
      {status && (
        <Typography variant="body2" color="#fff" mb={2}>
          {status}
        </Typography>
      )}
      <List ref={listRef} sx={{ maxHeight: 180, overflowY: 'auto', bgcolor: 'transparent', mb: 2 }}>
        {messages.map((msg, idx) => (
          <ListItem key={idx} sx={{ justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start' }}>
            <ListItemText
              primary={msg.text}
              sx={{
                bgcolor: msg.sender === 'user' ? '#fff2' : '#fff4',
                color: '#fff',
                borderRadius: 2,
                px: 2,
                py: 1,
                maxWidth: '80%',
                textAlign: msg.sender === 'user' ? 'right' : 'left',
              }}
            />
          </ListItem>
        ))}
      </List>
      <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
        <TextField
          variant="outlined"
          placeholder="Type your message..."
          value={input}
          onChange={e => setInput(e.target.value)}
          fullWidth
          sx={{ bgcolor: '#fff1', borderRadius: 2, input: { color: '#fff' } }}
          onKeyDown={e => { if (e.key === 'Enter') handleSend(); }}
          disabled={sending}
        />
        <Button variant="contained" color="secondary" onClick={handleSend} disabled={sending || !input.trim()} sx={{ bgcolor: ElectricPurple }}>
          Send
        </Button>
      </Box>
      <Divider sx={{ my: 2, bgcolor: '#fff3' }} />
      <Typography variant="subtitle1" color="#fff" mb={1}>
        Pathways Generator
      </Typography>
      <TextField
        variant="outlined"
        placeholder="Describe the component to generate..."
        value={prompt}
        onChange={e => setPrompt(e.target.value)}
        fullWidth
        sx={{ bgcolor: '#fff1', borderRadius: 2, input: { color: '#fff' }, mb: 1 }}
      />
      <Button variant="contained" color="primary" onClick={handleGenerate} disabled={!prompt.trim()} sx={{ width: '100%', mb: 2, bgcolor: ElectricPurple }}>
        Generate Component
      </Button>
      {generatedCode && (
        <Box sx={{ bgcolor: '#222', color: '#fff', borderRadius: 2, p: 2, mb: 2, fontSize: '0.9rem', maxHeight: 120, overflowY: 'auto' }}>
          <Typography variant="caption" color="#a259ff" fontWeight={700}>
            Generated Code:
          </Typography>
          <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', margin: 0 }}>{generatedCode}</pre>
          <Button variant="outlined" color="secondary" onClick={handleExplainCode} sx={{ mt: 1, bgcolor: ElectricPurple, color: '#fff' }}>
            Explain Code
          </Button>
        </Box>
      )}
      {codeExplanation && (
        <Box sx={{ bgcolor: '#fff1', color: '#222', borderRadius: 2, p: 2, mb: 2, fontSize: '0.95rem' }}>
          <Typography variant="caption" color="#a259ff" fontWeight={700}>
            Code Explanation:
          </Typography>
          <Typography variant="body2">{codeExplanation}</Typography>
        </Box>
      )}
    </Paper>
  );
};

export default ChatInterface;
