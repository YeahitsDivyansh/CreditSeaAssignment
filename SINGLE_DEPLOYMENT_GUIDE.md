# 🚀 CreditSea Single Deployment Guide for Vercel

This guide will walk you through deploying your CreditSea fullstack application as a **single deployment** on Vercel.

## 📋 Prerequisites

Before starting, make sure you have:

- [ ] A Vercel account (sign up at [vercel.com](https://vercel.com))
- [ ] A MongoDB Atlas account with your connection string ready
- [ ] Git repository with your code
- [ ] Node.js installed locally (for testing)

## 🗄️ Step 1: MongoDB Atlas Setup (Already Done!)

Since you mentioned you already have the MongoDB URI, you can skip this step. Just make sure your MongoDB Atlas cluster is:

- [ ] Accessible from anywhere (0.0.0.0/0)
- [ ] Has a database user with read/write permissions
- [ ] Connection string is ready

## 🚀 Step 2: Single Deployment on Vercel

### 2.1 Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "New Project"
3. Import your Git repository
4. **Important**: Leave the root directory as the default (don't change it)
5. Vercel will automatically detect both frontend and backend

### 2.2 Configure Build Settings

Vercel should auto-detect your setup, but verify these settings:

- **Framework Preset**: Other (or let Vercel auto-detect)
- **Root Directory**: `.` (root of your project)
- **Build Command**: Leave empty (Vercel will use the vercel.json config)
- **Output Directory**: Leave empty
- **Install Command**: `npm install`

### 2.3 Set Environment Variables

In your Vercel project dashboard, go to "Settings" → "Environment Variables" and add:

```env
# MongoDB Configuration (use your actual connection string)
MONGODB_URI=mongodb+srv://username:password@your-cluster.mongodb.net/creditsea?retryWrites=true&w=majority

# Server Configuration
NODE_ENV=production
PORT=5000

# File Upload Configuration
MAX_FILE_SIZE=10485760
ALLOWED_FILE_TYPES=application/xml,text/xml

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Frontend URL (will be your single deployment URL)
FRONTEND_URL=https://your-project-name.vercel.app

# Frontend Environment Variables
VITE_API_URL=/api
VITE_NODE_ENV=production
```

### 2.4 Deploy

1. Click "Deploy"
2. Wait for deployment to complete
3. Your single URL will be something like: `https://creditsea-assignment-xxx.vercel.app`

## 🧪 Step 3: Test Your Deployment

### 3.1 Test Backend API

1. Visit `https://your-project-name.vercel.app/api/health`
2. You should see a JSON response with API status
3. Test the root API endpoint: `https://your-project-name.vercel.app/api/`

### 3.2 Test Frontend

1. Visit your main URL: `https://your-project-name.vercel.app`
2. Try uploading a sample XML file
3. Check if the data is being processed correctly

### 3.3 Test Full Integration

1. Upload a credit report XML file
2. Verify it appears in the reports list
3. Check if you can view report details
4. Test all CRUD operations

## 🔧 How It Works

With the single deployment setup:

- **Frontend**: Served from the root URL (`https://your-project.vercel.app`)
- **Backend API**: Available at `/api/*` routes (`https://your-project.vercel.app/api/...`)
- **Database**: Connected via your MongoDB Atlas URI
- **File Uploads**: Handled by the backend API
- **Static Assets**: Served by Vercel's CDN

## 🚨 Troubleshooting

### Common Issues and Solutions

#### Build Failures

- **Issue**: Dependencies not found
- **Solution**: Ensure all dependencies are in both `client/package.json` and `server/package.json`

#### API Not Working

- **Issue**: Frontend can't connect to backend
- **Solution**: Check that `VITE_API_URL=/api` is set correctly

#### Database Connection Issues

- **Issue**: MongoDB connection fails
- **Solution**: Verify your MongoDB URI and network access settings

#### File Upload Issues

- **Issue**: Files not uploading
- **Solution**: Check file size limits and allowed file types in environment variables

### Getting Help

- Check Vercel deployment logs in the dashboard
- Review MongoDB Atlas logs
- Test locally with production environment variables
- Check browser console for frontend errors

## 📝 Final Checklist

Before going live, ensure:

- [ ] Single deployment successful
- [ ] Backend API accessible at `/api/health`
- [ ] Frontend loads correctly
- [ ] Database connected and working
- [ ] File upload functionality working
- [ ] All CRUD operations working
- [ ] Environment variables properly configured
- [ ] CORS configured correctly
- [ ] SSL certificates active

## 🎉 Congratulations!

Your CreditSea application is now deployed as a single project on Vercel!

**Your URL:**

- **Main Application**: `https://your-project-name.vercel.app`
- **API Health**: `https://your-project-name.vercel.app/api/health`
- **API Root**: `https://your-project-name.vercel.app/api/`

## 📊 Benefits of Single Deployment

- **Simpler Management**: One project, one URL, one deployment
- **Cost Effective**: Single Vercel project (free tier)
- **Easier Maintenance**: All environment variables in one place
- **Faster Setup**: No need to manage cross-references between projects
- **Better Performance**: No CORS issues between frontend and backend

## 📚 Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)

---

**Need Help?** If you encounter any issues during deployment, check the troubleshooting section above or refer to the official documentation.
