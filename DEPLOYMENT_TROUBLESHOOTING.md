# 🚀 Deployment Troubleshooting Guide

## Current Issue
- **Error**: `Failed to load resource: the server responded with a status of 500`
- **Root Cause**: Backend returning HTML error pages instead of JSON responses
- **Backend URL**: `https://carbon-footprint-calculatorabcd.onrender.com`

## ✅ Fixes Applied
1. ✅ Updated CORS configuration to be more permissive
2. ✅ Added better error handling in frontend
3. ✅ Added health check endpoint
4. ✅ Improved database initialization
5. ✅ Added debugging for API URL configuration

## 🔧 Steps to Deploy Fixed Backend

### 1. Commit and Push Backend Changes
```bash
git add backend/
git commit -m "Fix: Add better error handling, CORS, and database initialization"
git push
```

### 2. Redeploy on Render
- Go to your Render dashboard
- Find your `carbon-footprint-calculatorabcd` service  
- Click "Manual Deploy" or wait for auto-deploy
- Monitor the deploy logs for any errors

### 3. Set Environment Variables on Render
Make sure these are set in your Render service:
- `DATABASE_URL` - Your PostgreSQL connection string
- `JWT_SECRET_KEY` - A secure random string
- `FLASK_ENV` - Set to `production`

### 4. Test Backend Endpoints
After deployment, test these URLs in your browser:

1. **Root endpoint**: `https://carbon-footprint-calculatorabcd.onrender.com/`
   - Should return JSON with API info

2. **Health check**: `https://carbon-footprint-calculatorabcd.onrender.com/api/health`
   - Should return: `{"status": "healthy", "message": "Backend is running"}`

## 🌐 Frontend Deployment (Vercel)

### 1. Get Your Vercel URL
- After deploying to Vercel, note your actual URL (e.g., `https://your-app-name.vercel.app`)

### 2. Update Backend CORS
If your Vercel URL is different from `carbon-footprint-calculator-p1km.vercel.app`, update the CORS origins in `backend/app.py`:

```python
"origins": [
    "http://localhost:5173",
    "http://localhost:3000", 
    "https://*.vercel.app",
    "https://your-actual-vercel-url.vercel.app",  # Replace with your URL
    "https://vercel.app"
]
```

### 3. Verify Environment Variables
Make sure your `.env` file in `calculator/` directory has:
```
VITE_API_URL=https://carbon-footprint-calculatorabcd.onrender.com
```

### 4. Redeploy Frontend
```bash
cd calculator
npm run build
# Then deploy to Vercel (automatic if connected to Git)
```

## 🐛 Common Issues & Solutions

### Issue 1: 500 Internal Server Error
**Cause**: Database connection issues
**Solution**: 
- Check Render logs for database connection errors
- Verify `DATABASE_URL` environment variable is set correctly
- Make sure PostgreSQL addon is connected

### Issue 2: CORS Errors
**Cause**: Frontend domain not allowed in backend CORS
**Solution**:
- Add your Vercel URL to CORS origins in `backend/app.py`
- Redeploy backend

### Issue 3: API URL Not Found
**Cause**: Environment variable not set correctly
**Solution**:
- Verify `VITE_API_URL` in Vercel environment variables
- Check that `.env` file is not ignored in Git (it should be for security)
- Set environment variable directly in Vercel dashboard

## 🔍 Testing the Fix

### 1. Test Backend Directly
Open these URLs in browser:
- `https://carbon-footprint-calculatorabcd.onrender.com/`
- `https://carbon-footprint-calculatorabcd.onrender.com/api/health`

### 2. Test Registration
Use browser developer tools to monitor network requests:
1. Open your Vercel-deployed frontend
2. Try to register a user
3. Check Network tab for the API request
4. Should see JSON response instead of HTML

### 3. Check Console Logs
- Open browser developer console
- Look for API configuration logs (if in development mode)
- Should show the correct API URL

## 📞 Next Steps
1. Deploy the updated backend to Render
2. Wait for deployment to complete (~2-3 minutes)
3. Test the backend endpoints
4. If backend is working, test the frontend registration
5. If still issues, check Render logs for specific error messages

The main issue was likely database connection problems on Render. The backend code has been updated to handle these more gracefully and provide better error messages.
