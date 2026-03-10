const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const crewRoutes = require('./routes/crew');
const inventoryRoutes = require('./routes/inventory');
const vesselRoutes = require('./routes/vessels');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/crew', crewRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/vessels', vesselRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

module.exports = app;
