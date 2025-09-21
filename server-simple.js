const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from Angular build
app.use(express.static(path.join(__dirname, 'client/dist')));

// Simple API endpoints
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Car Enthusiasts API is running',
    timestamp: new Date().toISOString()
  });
});

// Mock posts data
app.get('/api/posts', (req, res) => {
  res.json([
    {
      id: 1,
      caption: "Welcome to Car Enthusiasts! 🚗",
      imageUrl: "/assets/default-avatar.png",
      userId: {
        id: 1,
        username: "admin",
        firstName: "Admin",
        lastName: "User",
        profilePicture: "/assets/default-avatar.png"
      },
      likes: [],
      comments: [],
      createdAt: new Date().toISOString()
    },
    {
      id: 2,
      caption: "Check out this amazing car! 🏎️",
      imageUrl: "/assets/default-avatar.png",
      userId: {
        id: 2,
        username: "carfan",
        firstName: "Car",
        lastName: "Fan",
        profilePicture: "/assets/default-avatar.png"
      },
      likes: [],
      comments: [],
      createdAt: new Date().toISOString()
    }
  ]);
});

// Mock user data
app.get('/api/users/:userId', (req, res) => {
  res.json({
    id: req.params.userId,
    username: "user" + req.params.userId,
    firstName: "User",
    lastName: req.params.userId,
    bio: "Car enthusiast",
    location: "Unknown",
    favoriteCarBrand: "Toyota",
    profilePicture: "/assets/default-avatar.png",
    joinDate: new Date().toISOString()
  });
});

// Serve Angular app for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/dist/index.html'));
});

app.listen(PORT, () => {
  console.log(`🚗 Car Enthusiasts App running on port ${PORT}`);
  console.log(`🌐 Open http://localhost:${PORT} to view the app`);
});
