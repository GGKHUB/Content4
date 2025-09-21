#!/bin/bash

# Car Enthusiasts App - Deployment Script
# This script helps you deploy your application

echo "🚀 Car Enthusiasts App - Deployment Helper"
echo "=========================================="

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "❌ Git repository not found. Please initialize git first:"
    echo "   git init"
    echo "   git add ."
    echo "   git commit -m 'Initial commit'"
    exit 1
fi

# Check if all required files exist
echo "🔍 Checking deployment files..."

required_files=("Dockerfile" "railway.json" "ecosystem.config.js" "env.example")
missing_files=()

for file in "${required_files[@]}"; do
    if [ ! -f "$file" ]; then
        missing_files+=("$file")
    fi
done

if [ ${#missing_files[@]} -ne 0 ]; then
    echo "❌ Missing required files:"
    printf '   - %s\n' "${missing_files[@]}"
    exit 1
fi

echo "✅ All deployment files found"

# Check if dependencies are installed
echo "📦 Checking dependencies..."

if [ ! -d "node_modules" ]; then
    echo "📥 Installing dependencies..."
    npm install
fi

if [ ! -d "client/node_modules" ]; then
    echo "📥 Installing client dependencies..."
    cd client && npm install && cd ..
fi

echo "✅ Dependencies ready"

# Build the application
echo "🔨 Building application..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed. Please check the errors above."
    exit 1
fi

echo "✅ Build successful"

# Check git status
echo "📋 Checking git status..."
if [ -n "$(git status --porcelain)" ]; then
    echo "⚠️  You have uncommitted changes. Please commit them before deploying:"
    git status --short
    echo ""
    echo "To commit changes:"
    echo "   git add ."
    echo "   git commit -m 'Prepare for deployment'"
    echo "   git push origin main"
else
    echo "✅ Working directory clean"
fi

echo ""
echo "🎉 Your app is ready for deployment!"
echo ""
echo "Next steps:"
echo "1. Push to GitHub: git push origin main"
echo "2. Go to Railway.app and deploy from GitHub"
echo "3. Add PostgreSQL database in Railway"
echo "4. Set environment variables in Railway"
echo "5. Your app will be live!"
echo ""
echo "📖 For detailed instructions, see DEPLOYMENT_GUIDE.md"
