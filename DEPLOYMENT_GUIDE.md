# 🚀 Deployment Guide - Car Enthusiasts Social Media App

This guide will help you deploy your car enthusiasts social media application to the cloud so all users can access it.

## 📋 Prerequisites

- GitHub account
- Railway account (free tier available)
- Basic understanding of environment variables

## 🎯 Deployment Options

### Option 1: Railway (Recommended) - Easiest & Free

Railway is the easiest way to deploy your full-stack application with built-in database hosting.

#### Step 1: Prepare Your Repository

1. **Update dependencies and lock file**:
   ```bash
   npm install
   ```

2. **Push your code to GitHub** (if not already done):
   ```bash
   git add .
   git commit -m "Add deployment configuration"
   git push origin main
   ```

3. **Verify all deployment files are present**:
   - ✅ `Dockerfile` (Node.js 20)
   - ✅ `railway.json`
   - ✅ `ecosystem.config.js`
   - ✅ `env.example`
   - ✅ `.nvmrc` (Node.js version)
   - ✅ `package-lock.json` (updated)

#### Step 2: Deploy to Railway

1. **Go to [Railway.app](https://railway.app)**
2. **Sign up/Login** with your GitHub account
3. **Click "New Project"** → **"Deploy from GitHub repo"**
4. **Select your repository** from the list
5. **Railway will automatically detect** it's a Node.js app and use the Dockerfile

#### Step 3: Set Up Database

1. **In your Railway project dashboard**, click **"+ New"** → **"Database"** → **"PostgreSQL"**
2. **Railway will create** a PostgreSQL database automatically
3. **Copy the DATABASE_URL** from the database service

#### Step 4: Configure Environment Variables

1. **Go to your app service** in Railway dashboard
2. **Click "Variables" tab**
3. **Add these environment variables**:

   ```
   NODE_ENV=production
   PORT=5000
   JWT_SECRET=your-super-secret-jwt-key-change-this
   DATABASE_URL=postgresql://postgres:password@host:port/database
   ```

   **Important**: Replace `your-super-secret-jwt-key-change-this` with a strong, random secret!

#### Step 5: Deploy

1. **Railway will automatically deploy** when you push to GitHub
2. **Wait for deployment** to complete (usually 2-3 minutes)
3. **Your app will be available** at the provided Railway URL

#### Step 6: Initialize Database

1. **Go to your app service** → **"Deployments"** tab
2. **Click on the latest deployment** → **"View Logs"**
3. **The database will be automatically initialized** on first run

### Option 2: Render (Alternative)

If you prefer Render over Railway:

1. **Go to [Render.com](https://render.com)**
2. **Connect your GitHub repository**
3. **Create a new Web Service**
4. **Use these settings**:
   - **Build Command**: `npm run build`
   - **Start Command**: `npm start`
   - **Environment**: Node
5. **Add PostgreSQL database** from Render's database section
6. **Set environment variables** as shown above

### Option 3: Vercel + Railway (Advanced)

For maximum performance:

1. **Deploy backend to Railway** (as above)
2. **Deploy frontend to Vercel**:
   - Go to [Vercel.com](https://vercel.com)
   - Import your repository
   - Set **Root Directory** to `client`
   - Set **Build Command** to `npm run build`
   - Set **Output Directory** to `dist`

## 🔧 Local Testing Before Deployment

Test your production build locally:

```bash
# Install dependencies
npm run install-all

# Build the application
npm run build

# Start production server
npm start
```

Visit `http://localhost:5000` to test.

## 🌐 Custom Domain (Optional)

### With Railway:

1. **Go to your app service** → **"Settings"** → **"Domains"**
2. **Add your custom domain**
3. **Update DNS records** as instructed
4. **SSL certificate** will be automatically provisioned

### With Render:

1. **Go to your service** → **"Settings"** → **"Custom Domains"**
2. **Add your domain**
3. **Follow DNS configuration** instructions

## 🔒 Security Checklist

Before going live, ensure:

- [ ] **Strong JWT secret** (use a password generator)
- [ ] **HTTPS enabled** (automatic with Railway/Render)
- [ ] **Environment variables** properly set
- [ ] **Database credentials** secure
- [ ] **File upload limits** configured
- [ ] **CORS settings** appropriate for production

## 📊 Monitoring & Maintenance

### Railway:
- **Built-in monitoring** in dashboard
- **Automatic deployments** on git push
- **Logs available** in real-time

### Render:
- **Metrics dashboard** available
- **Automatic deployments** on git push
- **Logs and monitoring** included

## 🚨 Troubleshooting

### Common Issues:

1. **Node.js version errors**:
   - ✅ **Fixed**: Updated to Node.js 20 in Dockerfile
   - ✅ **Fixed**: Added `.nvmrc` file
   - ✅ **Fixed**: Added engine requirements

2. **Package lock file out of sync**:
   - Run `npm install` locally to update `package-lock.json`
   - Commit and push the updated lock file

3. **Build fails**:
   - ✅ **Fixed**: Updated Angular build budgets
   - ✅ **Fixed**: Corrected build commands
   - Check `package.json` dependencies

4. **Database connection fails**:
   - Verify `DATABASE_URL` is correct
   - Check database service is running
   - Ensure PostgreSQL is selected (not SQLite)

5. **App doesn't load**:
   - Check environment variables
   - Verify build completed successfully
   - Check logs for errors
   - ✅ **Fixed**: Added static file serving

6. **File uploads not working**:
   - Ensure uploads directory exists
   - Check file size limits (10MB)
   - Verify multer configuration

### Quick Fixes:

```bash
# 1. Update dependencies
npm install

# 2. Test build locally
npm run build

# 3. Commit and push
git add .
git commit -m "Fix deployment issues"
git push origin main
```

### Getting Help:

- **Railway**: [Railway Discord](https://discord.gg/railway)
- **Render**: [Render Community](https://community.render.com)
- **Detailed Guide**: See `DEPLOYMENT_TROUBLESHOOTING.md`
- **General**: Check application logs first

## 🎉 Success!

Once deployed, your car enthusiasts social media app will be accessible to users worldwide! Share the URL with your community and start building your car enthusiast network.

---

**Need help?** Check the logs in your hosting platform's dashboard for detailed error messages.
