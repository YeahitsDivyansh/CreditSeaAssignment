# 🚀 CreditSea Deployment Guide for Vercel

This guide will walk you through deploying your CreditSea fullstack application on Vercel step by step.

## 📋 Prerequisites

Before starting, make sure you have:

- [ ] A Vercel account (sign up at [vercel.com](https://vercel.com))
- [ ] A MongoDB Atlas account (sign up at [mongodb.com/atlas](https://mongodb.com/atlas))
- [ ] Git repository with your code
- [ ] Node.js installed locally (for testing)

## 🗄️ Step 1: Set Up MongoDB Atlas Database

### 1.1 Create MongoDB Atlas Account

1. Go to [mongodb.com/atlas](https://mongodb.com/atlas)
2. Sign up for a free account
3. Create a new project called "CreditSea"

### 1.2 Create a Database Cluster

1. Click "Build a Database"
2. Choose "FREE" tier (M0 Sandbox)
3. Select a cloud provider and region close to your users
4. Name your cluster (e.g., "creditsea-cluster")
5. Click "Create Cluster"

### 1.3 Configure Database Access

1. Go to "Database Access" in the left sidebar
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Create a username and strong password (save these!)
5. Set privileges to "Read and write to any database"
6. Click "Add User"

### 1.4 Configure Network Access

1. Go to "Network Access" in the left sidebar
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (0.0.0.0/0)
4. Click "Confirm"

### 1.5 Get Connection String

1. Go to "Database" in the left sidebar
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Copy the connection string
5. Replace `<password>` with your database user password
6. Replace `<dbname>` with `creditsea` (or your preferred database name)

**Example connection string:**

```
mongodb+srv://username:password@creditsea-cluster.xxxxx.mongodb.net/creditsea?retryWrites=true&w=majority
```

## 🔧 Step 2: Prepare Your Code for Deployment

### 2.1 Update Environment Variables

Create production environment files:

**For Backend (`server/.env.production`):**

```env
# MongoDB Configuration
MONGODB_URI=mongodb+srv://username:password@creditsea-cluster.xxxxx.mongodb.net/creditsea?retryWrites=true&w=majority

# Server Configuration
PORT=5000
NODE_ENV=production

# File Upload Configuration
MAX_FILE_SIZE=10485760
ALLOWED_FILE_TYPES=application/xml,text/xml

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Frontend URL (will be updated after frontend deployment)
FRONTEND_URL=https://your-frontend-url.vercel.app
```

**For Frontend (`client/.env.production`):**

```env
# API Configuration (will be updated after backend deployment)
VITE_API_URL=https://your-backend-url.vercel.app/api

# Environment
VITE_NODE_ENV=production
```

### 2.2 Update API Service Configuration

Update `client/src/services/api.js` to use environment variables:

```javascript
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Rest of your API configuration...
```

## 🚀 Step 3: Deploy Backend to Vercel

### 3.1 Deploy Backend

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "New Project"
3. Import your Git repository
4. **Important**: Set the root directory to `server`
5. Configure the project:
   - **Framework Preset**: Other
   - **Root Directory**: `server`
   - **Build Command**: Leave empty (Vercel will auto-detect)
   - **Output Directory**: Leave empty
   - **Install Command**: `npm install`

### 3.2 Set Environment Variables for Backend

In your Vercel project dashboard:

1. Go to "Settings" → "Environment Variables"
2. Add the following variables:
   ```
   MONGODB_URI = mongodb+srv://username:password@creditsea-cluster.xxxxx.mongodb.net/creditsea?retryWrites=true&w=majority
   NODE_ENV = production
   PORT = 5000
   MAX_FILE_SIZE = 10485760
   ALLOWED_FILE_TYPES = application/xml,text/xml
   RATE_LIMIT_WINDOW_MS = 900000
   RATE_LIMIT_MAX_REQUESTS = 100
   FRONTEND_URL = https://your-frontend-url.vercel.app (update after frontend deployment)
   ```

### 3.3 Deploy

1. Click "Deploy"
2. Wait for deployment to complete
3. Copy the deployment URL (e.g., `https://creditsea-backend-xxxxx.vercel.app`)

## 🎨 Step 4: Deploy Frontend to Vercel

### 4.1 Deploy Frontend

1. Create a new Vercel project
2. Import the same Git repository
3. **Important**: Set the root directory to `client`
4. Configure the project:
   - **Framework Preset**: Vite
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

### 4.2 Set Environment Variables for Frontend

In your frontend Vercel project dashboard:

1. Go to "Settings" → "Environment Variables"
2. Add the following variables:
   ```
   VITE_API_URL = https://your-backend-url.vercel.app/api
   VITE_NODE_ENV = production
   ```

### 4.3 Deploy

1. Click "Deploy"
2. Wait for deployment to complete
3. Copy the deployment URL (e.g., `https://creditsea-frontend-xxxxx.vercel.app`)

## 🔄 Step 5: Update Cross-References

### 5.1 Update Backend Environment Variables

1. Go back to your backend Vercel project
2. Update the `FRONTEND_URL` environment variable with your frontend URL
3. Redeploy the backend

### 5.2 Update Frontend Environment Variables

1. Go back to your frontend Vercel project
2. Update the `VITE_API_URL` environment variable with your backend URL
3. Redeploy the frontend

## 🧪 Step 6: Test Your Deployment

### 6.1 Test Backend

1. Visit `https://your-backend-url.vercel.app/health`
2. You should see a JSON response with API status
3. Test the root endpoint: `https://your-backend-url.vercel.app/`

### 6.2 Test Frontend

1. Visit your frontend URL
2. Try uploading a sample XML file
3. Check if the data is being processed correctly

### 6.3 Test Full Integration

1. Upload a credit report XML file
2. Verify it appears in the reports list
3. Check if you can view report details
4. Test all CRUD operations

## 🔧 Step 7: Configure Custom Domains (Optional)

### 7.1 Add Custom Domain

1. In your Vercel project dashboard, go to "Settings" → "Domains"
2. Add your custom domain
3. Follow Vercel's DNS configuration instructions
4. Wait for SSL certificate to be issued

## 📊 Step 8: Monitor and Maintain

### 8.1 Set Up Monitoring

1. Enable Vercel Analytics in your project settings
2. Monitor API performance and errors
3. Set up alerts for critical issues

### 8.2 Database Monitoring

1. Monitor your MongoDB Atlas cluster
2. Set up alerts for connection issues
3. Monitor database performance and storage usage

## 🚨 Troubleshooting

### Common Issues and Solutions

#### Backend Deployment Issues

- **Build Failures**: Check that all dependencies are in `package.json`
- **Environment Variables**: Ensure all required variables are set
- **MongoDB Connection**: Verify connection string and network access

#### Frontend Deployment Issues

- **Build Failures**: Check Vite configuration and dependencies
- **API Connection**: Verify `VITE_API_URL` is correct
- **CORS Issues**: Ensure backend CORS is configured for your frontend domain

#### Database Issues

- **Connection Timeouts**: Check MongoDB Atlas network access settings
- **Authentication Errors**: Verify username and password
- **Database Not Found**: Ensure database name is correct in connection string

### Getting Help

- Check Vercel deployment logs in the dashboard
- Review MongoDB Atlas logs
- Test locally with production environment variables
- Check browser console for frontend errors

## 📝 Final Checklist

Before going live, ensure:

- [ ] Backend deployed and accessible
- [ ] Frontend deployed and accessible
- [ ] Database connected and working
- [ ] File upload functionality working
- [ ] All CRUD operations working
- [ ] Environment variables properly configured
- [ ] CORS configured correctly
- [ ] SSL certificates active
- [ ] Monitoring set up
- [ ] Error handling working
- [ ] Rate limiting configured
- [ ] Security measures in place

## 🎉 Congratulations!

Your CreditSea application is now deployed on Vercel!

**Your URLs:**

- Frontend: `https://your-frontend-url.vercel.app`
- Backend: `https://your-backend-url.vercel.app`
- API Health: `https://your-backend-url.vercel.app/health`

## 📚 Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
- [Express.js Deployment Best Practices](https://expressjs.com/en/advanced/best-practice-performance.html)

---

**Need Help?** If you encounter any issues during deployment, check the troubleshooting section above or refer to the official documentation.
