# 🔧 Deployment Troubleshooting Guide

## Common Deployment Issues and Solutions

### 1. Node.js Version Issues

**Problem**: `npm warn EBADENGINE` errors about unsupported Node.js version

**Solution**: 
- ✅ **Fixed**: Updated Dockerfile to use Node.js 20
- ✅ **Fixed**: Added `.nvmrc` file specifying Node.js 20
- ✅ **Fixed**: Added engine requirements in `package.json`

### 2. Package Lock File Out of Sync

**Problem**: `npm ci` fails with "package.json and package-lock.json are in sync"

**Solution**:
```bash
# Run this locally to update the lock file
npm install

# Then commit and push the updated package-lock.json
git add package-lock.json
git commit -m "Update package-lock.json"
git push origin main
```

### 3. Build Failures

**Problem**: Angular build fails during deployment

**Solutions**:
- ✅ **Fixed**: Updated Angular build budgets in `angular.json`
- ✅ **Fixed**: Corrected build command in Dockerfile
- ✅ **Fixed**: Set proper output path for Angular build

### 4. Database Connection Issues

**Problem**: App can't connect to database in production

**Solutions**:
- Ensure `DATABASE_URL` environment variable is set correctly
- For Railway: Use the provided PostgreSQL connection string
- For Render: Use the internal database URL
- Check database service is running and accessible

### 5. File Upload Issues

**Problem**: Image uploads not working in production

**Solutions**:
- Ensure uploads directory exists: `mkdir -p server/uploads`
- Check file size limits (currently 10MB)
- Verify multer configuration
- Check file permissions

### 6. CORS Issues

**Problem**: Frontend can't communicate with backend

**Solutions**:
- Set `CORS_ORIGIN` environment variable to your domain
- For development: `CORS_ORIGIN=http://localhost:4200`
- For production: `CORS_ORIGIN=https://yourdomain.com`

### 7. Environment Variables Missing

**Problem**: App crashes due to missing environment variables

**Required Variables**:
```
NODE_ENV=production
PORT=5000
JWT_SECRET=your-super-secret-jwt-key
DATABASE_URL=postgresql://user:pass@host:port/db
```

### 8. Memory Issues

**Problem**: App runs out of memory during build or runtime

**Solutions**:
- Increase memory limit in hosting platform
- Use `--max-old-space-size=4096` for Node.js
- Optimize build process (already done)

### 9. Static File Serving Issues

**Problem**: Angular app not loading in production

**Solutions**:
- ✅ **Fixed**: Added static file serving in server
- ✅ **Fixed**: Added catch-all route for Angular routing
- ✅ **Fixed**: Proper build output configuration

### 10. SSL/HTTPS Issues

**Problem**: Mixed content or SSL errors

**Solutions**:
- Railway and Render provide automatic SSL
- Ensure all API calls use HTTPS
- Check CORS settings for HTTPS domains

## Quick Fixes

### Reset and Redeploy
```bash
# 1. Update dependencies
npm install

# 2. Build locally to test
npm run build

# 3. Commit changes
git add .
git commit -m "Fix deployment issues"
git push origin main

# 4. Redeploy (automatic with Railway/Render)
```

### Check Deployment Logs
- **Railway**: Go to your app → Deployments → View Logs
- **Render**: Go to your service → Logs tab
- Look for specific error messages

### Test Locally
```bash
# Test production build locally
npm run build
npm start

# Visit http://localhost:5000
```

## Still Having Issues?

1. **Check the logs** in your hosting platform
2. **Compare with working local setup**
3. **Verify all environment variables** are set
4. **Test database connection** separately
5. **Check file permissions** and paths

## Platform-Specific Notes

### Railway
- Automatic deployments on git push
- Built-in PostgreSQL database
- Automatic SSL certificates
- Environment variables in dashboard

### Render
- Automatic deployments on git push
- Separate database service needed
- Automatic SSL certificates
- Environment variables in service settings

### Vercel (Frontend only)
- Deploy only the `client` folder
- Set build command: `npm run build`
- Set output directory: `dist`
- Use Railway/Render for backend
