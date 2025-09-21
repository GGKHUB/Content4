#!/bin/bash

echo "🚀 Deploying Car Enthusiasts App as Static Site"

# Build the Angular app
echo "📦 Building Angular app..."
cd client
npm install
npm run build
cd ..

# Create a simple server for the static files
echo "🔧 Creating static server..."
cat > server-static.js << 'EOF'
const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 5000;

// Serve static files from Angular build
app.use(express.static(path.join(__dirname, '../client/dist')));

// API routes (simplified)
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Car Enthusiasts API is running' });
});

// Serve Angular app for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

app.listen(PORT, () => {
  console.log(`🚗 Car Enthusiasts App running on port ${PORT}`);
});
EOF

echo "✅ Static deployment ready!"
echo "📋 To start: node server-static.js"
