// Vercel serverless function
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const { Sequelize } = require('sequelize');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database connection (using SQLite for simplicity)
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: ':memory:', // In-memory database for demo
  logging: false
});

// Simple health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Car Enthusiasts API is running',
    timestamp: new Date().toISOString()
  });
});

// Simple posts endpoint
app.get('/api/posts', (req, res) => {
  res.json([
    {
      id: 1,
      caption: "Welcome to Car Enthusiasts!",
      imageUrl: "/assets/default-car.jpg",
      userId: {
        id: 1,
        username: "admin",
        firstName: "Admin",
        lastName: "User"
      },
      likes: [],
      comments: [],
      createdAt: new Date().toISOString()
    }
  ]);
});

// Export for Vercel
module.exports = app;
