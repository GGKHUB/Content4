@echo off
echo 🚀 Car Enthusiasts App - Deployment Helper
echo ==========================================

REM Check if git is initialized
if not exist ".git" (
    echo ❌ Git repository not found. Please initialize git first:
    echo    git init
    echo    git add .
    echo    git commit -m "Initial commit"
    pause
    exit /b 1
)

REM Check if all required files exist
echo 🔍 Checking deployment files...

set missing_files=
if not exist "Dockerfile" set missing_files=%missing_files% Dockerfile
if not exist "railway.json" set missing_files=%missing_files% railway.json
if not exist "ecosystem.config.js" set missing_files=%missing_files% ecosystem.config.js
if not exist "env.example" set missing_files=%missing_files% env.example

if not "%missing_files%"=="" (
    echo ❌ Missing required files:%missing_files%
    pause
    exit /b 1
)

echo ✅ All deployment files found

REM Check if dependencies are installed
echo 📦 Checking dependencies...

if not exist "node_modules" (
    echo 📥 Installing dependencies...
    npm install
)

if not exist "client\node_modules" (
    echo 📥 Installing client dependencies...
    cd client
    npm install
    cd ..
)

echo ✅ Dependencies ready

REM Build the application
echo 🔨 Building application...
npm run build

if %errorlevel% neq 0 (
    echo ❌ Build failed. Please check the errors above.
    pause
    exit /b 1
)

echo ✅ Build successful

REM Check git status
echo 📋 Checking git status...
git status --porcelain > temp_status.txt
set /p git_status=<temp_status.txt
del temp_status.txt

if not "%git_status%"=="" (
    echo ⚠️  You have uncommitted changes. Please commit them before deploying:
    git status --short
    echo.
    echo To commit changes:
    echo    git add .
    echo    git commit -m "Prepare for deployment"
    echo    git push origin main
) else (
    echo ✅ Working directory clean
)

echo.
echo 🎉 Your app is ready for deployment!
echo.
echo Next steps:
echo 1. Push to GitHub: git push origin main
echo 2. Go to Railway.app and deploy from GitHub
echo 3. Add PostgreSQL database in Railway
echo 4. Set environment variables in Railway
echo 5. Your app will be live!
echo.
echo 📖 For detailed instructions, see DEPLOYMENT_GUIDE.md
pause
