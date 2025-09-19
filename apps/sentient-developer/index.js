const express = require('express');
const bodyParser = require('body-parser');
const { apiKeyAuth, limiter } = require('./middleware');
const {
  ingestGitHubIssue,
  ingestSlackMessage,
  ingestBugReport
} = require('./services');
const { generateCode } = require('./CodeGenerationService');
const { generateAndRunTests } = require('./TestingService');
const { deployCode } = require('./DeploymentService');
const app = express();
const port = process.env.PORT || 4001;

app.use(bodyParser.json());
app.use(limiter);
app.use(apiKeyAuth);

// TaskIngestionService: Receives tasks via HTTP POST
app.post('/ingest-task', (req, res) => {
  const { description, files } = req.body;
  if (!description || !Array.isArray(files)) {
    return res.status(400).json({ error: 'Task must include description and files array.' });
  }
  console.log('[TaskIngestionService] Received task:', { description, files });
  res.json({ status: 'received', description, files });
});

// GitHub issue ingestion
app.post('/ingest-github', async (req, res) => {
  const result = await ingestGitHubIssue(req.body);
  res.json(result);
});

// Slack message ingestion
app.post('/ingest-slack', async (req, res) => {
  const result = await ingestSlackMessage(req.body);
  res.json(result);
});

// Bug tracker ingestion
app.post('/ingest-bug', async (req, res) => {
  const result = await ingestBugReport(req.body);
  res.json(result);
});

// Code generation
app.post('/generate-code', async (req, res) => {
  const result = await generateCode(req.body);
  res.json(result);
});

// Testing
app.post('/run-tests', async (req, res) => {
  const result = await generateAndRunTests(req.body);
  res.json(result);
});

// Deployment
app.post('/deploy', async (req, res) => {
  const result = await deployCode(req.body);
  res.json(result);
});

app.get('/', (req, res) => {
  res.send('Sentient Developer TaskIngestionService is running.');
});

app.listen(port, () => {
  console.log(`Sentient Developer listening on port ${port}`);
});
