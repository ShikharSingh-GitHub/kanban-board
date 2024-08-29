const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('../config/db');
const taskRoutes = require('../routes/taskRoutes');
const serverless = require('serverless-http');

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/tasks', taskRoutes);

module.exports.handler = serverless(app);
