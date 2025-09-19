import express from 'express';
import bodyParser from 'body-parser';

const app = express();
const PORT = process.env.AGENT_PORT || 5050;

app.use(bodyParser.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', agent: 'OurSynth AI', time: new Date().toISOString() });
});

// Receive push commands from orchestrator
app.post('/push', (req, res) => {
  const { action, params } = req.body;
  console.log(`[Agent] Received action: ${action}`, params);
  // Simulate processing
  setTimeout(() => {
    res.json({ status: 'completed', message: `Action '${action}' processed by OurSynth agent.`, params });
  }, 500);
});

app.listen(PORT, () => {
  console.log(`OurSynth Agent listening on port ${PORT}`);
});
