const express = require('express');
const connectDB = require('./config/db');
const taskRoutes = require('./routes/taskRoutes');

// Initialize Express
const app = express();

// Middleware
app.use(express.json());

// API Routes
app.use('/api/tasks', taskRoutes);

// Export as a serverless function
module.exports = app;
