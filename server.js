const express = require('express');
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');

const app = express();
const PORT = process.env.PORT || 3002;

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Servir archivos estáticos desde build
app.use(express.static(path.join(__dirname, 'build')));

// API Routes - Proxy to NestJS backend
app.use('/api', (req, res) => {
  // Redirect API calls to NestJS backend
  const backendUrl = `http://localhost:3000${req.originalUrl}`;
  
  fetch(backendUrl, {
    method: req.method,
    headers: {
      'Content-Type': 'application/json',
      ...req.headers
    },
    body: req.method !== 'GET' ? JSON.stringify(req.body) : undefined
  })
  .then(response => response.json())
  .then(data => res.json(data))
  .catch(error => {
    console.error('Proxy error:', error);
    res.status(500).json({ error: 'Internal server error' });
  });
});

// Catch all handler para React Router
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Error handling
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`🚀 Frontend server running on http://localhost:${PORT}`);
  console.log(`📡 Proxying API requests to http://localhost:3002`);
});

module.exports = app;
