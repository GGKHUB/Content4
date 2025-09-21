#!/bin/bash

echo "🚀 Building Car Enthusiasts App for Production"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Install client dependencies
echo "📦 Installing client dependencies..."
cd client
npm install
cd ..

# Build Angular app
echo "🔨 Building Angular application..."
cd client
npm run build --configuration production
cd ..

# Create uploads directory
echo "📁 Creating uploads directory..."
mkdir -p server/uploads

echo "✅ Build complete! Ready for deployment."
echo "📋 To start the app: npm start"
