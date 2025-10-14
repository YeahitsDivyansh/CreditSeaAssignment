# 🚀 Quick Deployment Checklist for CreditSea on Vercel

## ✅ Pre-Deployment Setup

### 1. MongoDB Atlas Setup

- [ ] Create MongoDB Atlas account
- [ ] Create free cluster (M0 Sandbox)
- [ ] Create database user with read/write permissions
- [ ] Configure network access (allow all IPs: 0.0.0.0/0)
- [ ] Get connection string
- [ ] Test connection locally

### 2. Code Preparation

- [ ] Ensure all code is committed to Git
- [ ] Verify environment variables are properly configured
- [ ] Test application locally with production settings

## 🚀 Deployment Steps

### Step 1: Deploy Backend

1. [ ] Go to [vercel.com](https://vercel.com) → New Project
2. [ ] Import your Git repository
3. [ ] Set **Root Directory** to `server`
4. [ ] Set **Framework Preset** to "Other"
5. [ ] Add Environment Variables:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/creditsea
   NODE_ENV=production
   PORT=5000
   MAX_FILE_SIZE=10485760
   ALLOWED_FILE_TYPES=application/xml,text/xml
   RATE_LIMIT_WINDOW_MS=900000
   RATE_LIMIT_MAX_REQUESTS=100
   FRONTEND_URL=https://your-frontend-url.vercel.app
   ```
6. [ ] Click Deploy
7. [ ] Copy backend URL (e.g., `https://creditsea-backend-xxx.vercel.app`)

### Step 2: Deploy Frontend

1. [ ] Create new Vercel project
2. [ ] Import same Git repository
3. [ ] Set **Root Directory** to `client`
4. [ ] Set **Framework Preset** to "Vite"
5. [ ] Add Environment Variables:
   ```
   VITE_API_URL=https://your-backend-url.vercel.app/api
   VITE_NODE_ENV=production
   ```
6. [ ] Click Deploy
7. [ ] Copy frontend URL (e.g., `https://creditsea-frontend-xxx.vercel.app`)

### Step 3: Update Cross-References

1. [ ] Update backend `FRONTEND_URL` environment variable
2. [ ] Update frontend `VITE_API_URL` environment variable
3. [ ] Redeploy both projects

## 🧪 Testing Checklist

### Backend Testing

- [ ] Health check: `https://your-backend-url.vercel.app/health`
- [ ] Root endpoint: `https://your-backend-url.vercel.app/`
- [ ] API endpoints accessible

### Frontend Testing

- [ ] Frontend loads correctly
- [ ] File upload functionality works
- [ ] Reports list displays
- [ ] Report details view works
- [ ] All CRUD operations functional

### Integration Testing

- [ ] Upload XML file from frontend
- [ ] Verify data appears in reports list
- [ ] Check report details are displayed correctly
- [ ] Test delete functionality
- [ ] Verify error handling

## 🔧 Environment Variables Reference

### Backend Environment Variables

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/creditsea
NODE_ENV=production
PORT=5000
MAX_FILE_SIZE=10485760
ALLOWED_FILE_TYPES=application/xml,text/xml
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
FRONTEND_URL=https://your-frontend-url.vercel.app
```

### Frontend Environment Variables

```env
VITE_API_URL=https://your-backend-url.vercel.app/api
VITE_NODE_ENV=production
```

## 🚨 Common Issues & Solutions

### Build Failures

- **Issue**: Dependencies not found
- **Solution**: Ensure all dependencies are in package.json

### CORS Errors

- **Issue**: Frontend can't connect to backend
- **Solution**: Update FRONTEND_URL in backend environment variables

### Database Connection Issues

- **Issue**: MongoDB connection fails
- **Solution**: Check connection string and network access settings

### File Upload Issues

- **Issue**: Files not uploading
- **Solution**: Check file size limits and allowed file types

## 📊 Post-Deployment

### Monitoring Setup

- [ ] Enable Vercel Analytics
- [ ] Monitor API performance
- [ ] Set up error alerts
- [ ] Monitor database performance

### Security Checklist

- [ ] SSL certificates active
- [ ] CORS properly configured
- [ ] Rate limiting enabled
- [ ] Input validation working
- [ ] Error handling secure

## 🎉 Final URLs

- **Frontend**: `https://your-frontend-url.vercel.app`
- **Backend**: `https://your-backend-url.vercel.app`
- **API Health**: `https://your-backend-url.vercel.app/health`

---

**Total Estimated Time**: 30-45 minutes
**Difficulty Level**: Intermediate
**Prerequisites**: Vercel account, MongoDB Atlas account, Git repository
