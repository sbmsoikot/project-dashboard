# Deployment Guide for nittosolutions.com

This guide covers deployment options for the Project Dashboard to be accessible at `homepark.nittosolutions.com`.

## 🎯 Recommended Deployment Strategy

### Option 1: Railway (Most Cost-Effective)
**Cost**: $5/month (after free tier)
**Domain**: `homepark.nittosolutions.com`
**Setup Time**: 30 minutes

### Option 2: Render (Free Tier Available)
**Cost**: Free tier available, $7/month for paid plan
**Domain**: `homepark.nittosolutions.com`
**Setup Time**: 45 minutes

### Option 3: AWS (Your Domain Provider)
**Cost**: ~$15-20/month (EC2 + RDS)
**Domain**: `homepark.nittosolutions.com`
**Setup Time**: 2 hours

## 🚀 Quick Start: Railway Deployment (Recommended)

### Step 1: Prepare Your Repository

1. **Push your code to GitHub** (if not already done):
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Create a `.env.production` file** in your root directory:
   ```bash
   # Backend Environment Variables
   DATABASE_URL=postgresql://postgres:password@railway-postgres:5432/project_dashboard
   SECRET_KEY=your-super-secret-production-key-here
   ACCESS_TOKEN_EXPIRE_MINUTES=30
   ALLOWED_ORIGINS=https://homepark.nittosolutions.com,https://www.homepark.nittosolutions.com
   
   # Frontend Environment Variables
   REACT_APP_API_URL=https://your-backend-url.railway.app
   ```

### Step 2: Deploy to Railway

1. **Sign up** at [railway.app](https://railway.app)
2. **Connect your GitHub repository**
3. **Create PostgreSQL Database**:
   - Click "New Service" → "Database" → "PostgreSQL"
   - Note the connection string

4. **Deploy Backend**:
   - Click "New Service" → "GitHub Repo"
   - Select your repository
   - Set root directory to `backend`
   - Add environment variables:
     ```
     DATABASE_URL=postgresql://... (from step 3)
     SECRET_KEY=your-super-secret-production-key
     ACCESS_TOKEN_EXPIRE_MINUTES=30
     ALLOWED_ORIGINS=https://homepark.nittosolutions.com,https://www.homepark.nittosolutions.com
     ```
   - Set start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

5. **Deploy Frontend**:
   - Click "New Service" → "GitHub Repo"
   - Select your repository
   - Set root directory to `.` (root)
   - Add environment variable:
     ```
     REACT_APP_API_URL=https://your-backend-url.railway.app
     ```
   - Set build command: `npm install && npm run build`
   - Set start command: `npx serve -s dist -l $PORT`

### Step 3: Configure Custom Domain

1. **In Railway dashboard**:
   - Go to your frontend service
   - Click "Settings" → "Domains"
   - Add custom domain: `homepark.nittosolutions.com`

2. **Configure DNS in AWS Route 53**:
   - Log into AWS Console → Route 53
   - Select your hosted zone for `nittosolutions.com`
   - Create A record:
     ```
     Name: homepark
     Type: A
     Alias: Yes
     Route traffic to: Application and Classic Load Balancer
     Region: US East (N. Virginia)
     ```
   - Point to Railway's provided IP/CNAME

3. **Wait for DNS propagation** (5-15 minutes)

### Step 4: Initialize Database

1. **Access Railway's PostgreSQL**:
   - Go to your PostgreSQL service in Railway
   - Click "Connect" → "PostgreSQL"
   - Use the connection details

2. **Run database initialization**:
   ```bash
   # In Railway's terminal or locally with remote connection
   python init_db.py
   ```

## 🌐 Alternative: Render Deployment

### Step 1: Deploy Backend to Render

1. **Sign up** at [render.com](https://render.com)
2. **Create Web Service**:
   - Connect your GitHub repo
   - Set root directory to `backend`
   - Build command: `pip install -r requirements.txt`
   - Start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
   - Add environment variables (same as Railway)

3. **Create PostgreSQL Database**:
   - New → PostgreSQL
   - Copy connection string

### Step 2: Deploy Frontend to Render

1. **Create Static Site**:
   - New → Static Site
   - Connect your GitHub repo
   - Build command: `npm install && npm run build`
   - Publish directory: `dist`
   - Add environment variable: `REACT_APP_API_URL=https://your-backend-url.onrender.com`

2. **Configure Custom Domain**:
   - Add `homepark.nittosolutions.com`
   - Update DNS in AWS Route 53

## 🐳 Docker Deployment (Advanced)

### Option: Deploy to AWS EC2

1. **Launch EC2 Instance**:
   - Ubuntu 22.04 LTS
   - t3.micro (free tier) or t3.small
   - Security group: ports 80, 443, 22

2. **Install Docker and Docker Compose**:
   ```bash
   sudo apt update
   sudo apt install docker.io docker-compose
   sudo usermod -aG docker $USER
   ```

3. **Deploy with Docker Compose**:
   ```bash
   git clone your-repo
   cd project-dashboard
   docker-compose -f docker-compose.prod.yml up -d
   ```

4. **Configure Nginx for SSL**:
   ```bash
   sudo apt install nginx certbot python3-certbot-nginx
   sudo certbot --nginx -d homepark.nittosolutions.com
   ```

## 🔧 Environment Variables Setup

### Backend (.env)
```bash
DATABASE_URL=postgresql://user:password@host:port/database
SECRET_KEY=your-super-secret-production-key-here
ACCESS_TOKEN_EXPIRE_MINUTES=30
ALLOWED_ORIGINS=https://homepark.nittosolutions.com,https://www.homepark.nittosolutions.com
```

### Frontend (.env.production)
```bash
REACT_APP_API_URL=https://your-backend-url.com
```

## 🌍 DNS Configuration for nittosolutions.com

### AWS Route 53 Setup

1. **Log into AWS Console**
2. **Go to Route 53** → **Hosted zones**
3. **Select nittosolutions.com**
4. **Create A record**:
   ```
   Name: homepark
   Type: A
   Alias: Yes
   Route traffic to: Application and Classic Load Balancer
   ```

### Alternative: CNAME Record
```
Name: homepark
Type: CNAME
Value: your-app-url.railway.app
```

## 🔒 SSL/HTTPS Setup

### Railway/Render
- Automatic SSL certificates
- No additional configuration needed

### Custom Domain
- SSL certificate automatically provisioned
- Force HTTPS redirect recommended

## 📊 Cost Comparison

| Platform | Monthly Cost | Setup Time | Features |
|----------|-------------|------------|----------|
| **Railway** | $5 | 30 min | PostgreSQL, Auto-SSL, Easy setup |
| **Render** | Free → $7 | 45 min | PostgreSQL, Auto-SSL, Good free tier |
| **AWS EC2** | $15-20 | 2 hours | Full control, Your domain |
| **Vercel + Railway** | $5 | 40 min | Best performance, Separate services |

## 🚀 Recommended: Railway Deployment

**Why Railway is best for your use case:**
- ✅ Your domain works perfectly
- ✅ PostgreSQL included
- ✅ Automatic SSL
- ✅ Easy deployment
- ✅ Good performance
- ✅ Reasonable cost ($5/month)

## 🔧 Post-Deployment Checklist

- [ ] Database initialized with sample data
- [ ] Custom domain configured
- [ ] SSL certificate active
- [ ] Frontend connects to backend
- [ ] Admin login works (admin/admin123)
- [ ] All features functional
- [ ] Mobile responsive
- [ ] Performance optimized

## 🆘 Troubleshooting

### Common Issues

1. **CORS Errors**:
   - Check `ALLOWED_ORIGINS` includes your domain
   - Verify frontend API URL

2. **Database Connection**:
   - Verify `DATABASE_URL` format
   - Check database is running

3. **Domain Not Working**:
   - Wait for DNS propagation (up to 24 hours)
   - Check Route 53 configuration
   - Verify SSL certificate

### Getting Help

1. Check Railway/Render logs
2. Test API endpoints directly
3. Verify environment variables
4. Check browser console for errors

## 💰 Cost Optimization Tips

1. **Start with Railway's $5 plan**
2. **Monitor usage** to avoid overages
3. **Use free tiers** for development
4. **Consider serverless** for cost efficiency
5. **Optimize images** and assets

## 🎯 Next Steps

1. **Choose Railway deployment** (recommended)
2. **Follow the step-by-step guide**
3. **Configure your domain**
4. **Test all features**
5. **Monitor performance**

Your project dashboard will be live at `https://homepark.nittosolutions.com`! 🚀 