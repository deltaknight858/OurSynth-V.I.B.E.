// Authentication and rate limiting middleware
const rateLimit = require('express-rate-limit');

// Simple API key auth
function apiKeyAuth(req, res, next) {
  const apiKey = req.headers['x-api-key'];
  if (apiKey !== process.env.SENTIENT_DEV_API_KEY) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
}

const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30, // limit each IP to 30 requests per minute
  message: 'Too many requests, please try again later.'
});

module.exports = { apiKeyAuth, limiter };
