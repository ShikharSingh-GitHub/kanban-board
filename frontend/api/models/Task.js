const mongoose = require('mongoose');

// Define task schema with additional options
const taskSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, default: '', trim: true },
  status: { 
    type: String, 
    required: true, 
    enum: ['To Do', 'In Progress', 'Done'], 
    default: 'To Do' 
  },
}, {
  timestamps: true // Adds createdAt and updatedAt fields automatically
});

// Create and export the Task model
const Task = mongoose.model('Task', taskSchema);
module.exports = Task;
