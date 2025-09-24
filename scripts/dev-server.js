#!/usr/bin/env node

/**
 * Simple development server for V.I.B.E. demo
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;

const server = http.createServer((req, res) => {
  // Serve the demo.html file
  const filePath = path.join(__dirname, '..', 'demo.html');
  
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Error loading demo');
      return;
    }
    
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(data);
  });
});

server.listen(PORT, () => {
  console.log(`
🌐 V.I.B.E. Demo Server Running!

🔗 Open in browser: http://localhost:${PORT}

✨ Features visible in demo:
• Glass morphism UI with backdrop blur
• Neon color scheme (cyan, purple, orange)
• Interactive navigation with tier badges
• Animated effects and hover states
• Responsive grid layouts
• Typography hierarchy

Press Ctrl+C to stop the server
`);
});

process.on('SIGINT', () => {
  console.log('\n👋 V.I.B.E. demo server stopped');
  process.exit();
});