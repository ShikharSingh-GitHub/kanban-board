const mongoose = require('mongoose');

// Database connection function
const connectDB = async () => {
  try {
    // Connect to MongoDB using the URI from environment variables
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected successfully');
  } catch (error) {
    // Log full error details for better debugging
    console.error('MongoDB connection failed:', error);
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectDB;
