const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

connectDB().catch((err) => {
  console.error('MongoDB startup failed:', err.message);
});

// Routes
const authRoutes = require('./routes/authRoutes');
const emergencyRoutes = require('./routes/emergencyRoutes');
const trustedContactsRouter = require('./routes/trustedContacts');
const liveLocationRoutes = require('./routes/LiveLocationRoutes');
const redZoneRoutes = require('./routes/redZoneRoutes');
const incidentRoutes = require('./routes/incidentRoutes');

require('./models/Incident');

app.use('/api/auth', authRoutes);
app.use('/api/emergency', emergencyRoutes);
app.use('/api/trustedContacts', trustedContactsRouter);
app.use('/api/live', liveLocationRoutes);
app.use('/api/redzones', redZoneRoutes);
app.use('/api/incident', incidentRoutes);

// Health check route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Safety App Backend is running!',
    timestamp: new Date().toISOString(),
    status: 'OK'
  });
});

// 404 handler for undefined routes
app.use((req, res) => {
  res.status(404).json({
    message: 'Route not found',
    requestedPath: req.originalUrl,
    availableRoutes: [
      'GET /',
      'GET /api/auth/test',
      'POST /api/auth/login',
      'POST /api/auth/signup',
      'GET /api/emergency/test',
      'POST /api/emergency/sos'
    ]
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}`);
  console.log(`Auth API: http://localhost:${PORT}/api/auth/test`);
  console.log(`Emergency API: http://localhost:${PORT}/api/emergency/test`);
});



