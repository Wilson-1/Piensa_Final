const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'build')));

// Store the current work time (in a real app, you'd use a database)
let currentWorkTime = 25;
let currentBreakTime = 5;

// Endpoint for ESP32 to send work time
app.post('/api/setWorkTime', (req, res) => {
  try {
    const { workTime } = req.body;
    
    if (!workTime || typeof workTime !== 'number' || workTime < 25) {
      return res.status(400).json({ 
        error: 'Invalid work time. Must be a number >= 25 minutes.' 
      });
    }
    
    currentWorkTime = workTime;
    currentBreakTime = Math.round(workTime * 0.2); 
    console.log(`Updated work time to: ${workTime} minutes, break time to: ${currentBreakTime} minutes`);
    
    res.json({ 
      success: true, 
      message: `Work time updated to ${workTime} minutes, break time to ${currentBreakTime} minutes`,
      workTime: currentWorkTime,
      breakTime: currentBreakTime
    });
  } catch (error) {
    console.error('Error setting work time:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Endpoint to get current work time
app.get('/api/getWorkTime', (req, res) => {
  res.json({ 
    workTime: currentWorkTime, 
    breakTime: currentBreakTime,
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'ESP32 Pomodoro Server is running',
    currentWorkTime: currentWorkTime,
    currentBreakTime: currentBreakTime
  });
});

// Handle React routing, return all requests to React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 ESP32 endpoint: http://localhost:${PORT}/api/setWorkTime`);
  console.log(`🔍 Health check: http://localhost:${PORT}/api/health`);
}); 