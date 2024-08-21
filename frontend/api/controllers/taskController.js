const mongoose = require('mongoose');
const Task = require('../models/Task');

// Helper function to find a task by ID with error handling
const findTaskById = async (id, res) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400).json({ message: 'Invalid task ID' });
    return null;
  }
  
  const task = await Task.findById(id);
  if (!task) {
    res.status(404).json({ message: 'Task not found' });
    return null;
  }
  
  return task;
};

// GET: Fetch all tasks
const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch tasks', error: error.message });
  }
};

// POST: Create a new task
const createTask = async (req, res) => {
  const { title, description, status } = req.body;

  // Validate required fields
  if (!title || !status) {
    return res.status(400).json({ message: 'Title and status are required' });
  }

  try {
    const newTask = new Task({ title, description, status });
    await newTask.save();
    res.status(201).json(newTask);
  } catch (error) {
    res.status(400).json({ message: 'Failed to create task', error: error.message });
  }
};

// PUT: Update a task
const updateTask = async (req, res) => {
  const { id } = req.params;
  const { title, description, status } = req.body;

  try {
    const task = await findTaskById(id, res);
    if (!task) return;

    // Update fields if provided, else retain old values
    task.title = title || task.title;
    task.description = description || task.description;
    task.status = status || task.status;

    await task.save();
    res.json(task);
  } catch (error) {
    res.status(400).json({ message: 'Failed to update task', error: error.message });
  }
};

// DELETE: Remove a task
const deleteTask = async (req, res) => {
  const { id } = req.params;

  try {
    const task = await findTaskById(id, res);
    if (!task) return;

    await Task.deleteOne({ _id: id });
    res.json({ message: 'Task removed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete task', error: error.message });
  }
};

module.exports = { getTasks, createTask, updateTask, deleteTask };
