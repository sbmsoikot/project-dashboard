#!/bin/bash

# Project Dashboard Deployment Script
# For deployment to homepark.nittosolutions.com

echo "🚀 Project Dashboard Deployment Script"
echo "======================================"
echo ""

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "❌ Git repository not found. Please initialize git first:"
    echo "   git init"
    echo "   git add ."
    echo "   git commit -m 'Initial commit'"
    echo "   git remote add origin <your-github-repo-url>"
    echo "   git push -u origin main"
    exit 1
fi

# Check if code is pushed to GitHub
echo "📋 Checking repository status..."
if ! git ls-remote --exit-code origin >/dev/null 2>&1; then
    echo "❌ No remote repository found. Please add your GitHub repository:"
    echo "   git remote add origin <your-github-repo-url>"
    exit 1
fi

echo "✅ Repository is ready for deployment"
echo ""

# Create production environment file
echo "🔧 Creating production environment file..."
cat > .env.production << EOF
# Production Environment Variables
# Update these values for your deployment

# Backend Configuration
DATABASE_URL=postgresql://postgres:password@railway-postgres:5432/project_dashboard
SECRET_KEY=your-super-secret-production-key-here-change-this
ACCESS_TOKEN_EXPIRE_MINUTES=30
ALLOWED_ORIGINS=https://homepark.nittosolutions.com,https://www.homepark.nittosolutions.com

# Frontend Configuration
REACT_APP_API_URL=https://your-backend-url.railway.app
EOF

echo "✅ Created .env.production file"
echo ""

# Check if all required files exist
echo "📁 Checking required files..."
required_files=(
    "backend/app/main.py"
    "backend/app/models.py"
    "backend/app/database.py"
    "backend/app/auth.py"
    "backend/requirements.txt"
    "backend/init_db.py"
    "src/App.tsx"
    "package.json"
    "vite.config.ts"
    "docker-compose.yml"
)

missing_files=()
for file in "${required_files[@]}"; do
    if [ ! -f "$file" ]; then
        missing_files+=("$file")
    fi
done

if [ ${#missing_files[@]} -gt 0 ]; then
    echo "❌ Missing required files:"
    for file in "${missing_files[@]}"; do
        echo "   - $file"
    done
    exit 1
fi

echo "✅ All required files found"
echo ""

# Test local build
echo "🔨 Testing local build..."
if ! npm run build >/dev/null 2>&1; then
    echo "❌ Frontend build failed. Please fix build errors first."
    exit 1
fi

echo "✅ Frontend builds successfully"
echo ""

# Test backend
echo "🐍 Testing backend..."
cd backend
if ! python -c "from app.main import app; print('✅ Backend imports successfully')" 2>/dev/null; then
    echo "❌ Backend test failed. Please fix import errors first."
    exit 1
fi
cd ..

echo "✅ Backend tests successfully"
echo ""

echo "🎉 Your project is ready for deployment!"
echo ""
echo "📋 Next Steps:"
echo "=============="
echo ""
echo "1. 🚀 Deploy to Railway (Recommended):"
echo "   - Go to https://railway.app"
echo "   - Sign up and connect your GitHub repository"
echo "   - Create PostgreSQL database"
echo "   - Deploy backend (root directory: backend)"
echo "   - Deploy frontend (root directory: .)"
echo "   - Configure custom domain: homepark.nittosolutions.com"
echo ""
echo "2. 🌐 Configure DNS in AWS Route 53:"
echo "   - Log into AWS Console → Route 53"
echo "   - Select nittosolutions.com hosted zone"
echo "   - Create A record for 'homepark'"
echo "   - Point to Railway's provided URL"
echo ""
echo "3. 🔧 Environment Variables to Set:"
echo "   Backend:"
echo "   - DATABASE_URL (from Railway PostgreSQL)"
echo "   - SECRET_KEY (generate a strong key)"
echo "   - ALLOWED_ORIGINS=https://homepark.nittosolutions.com"
echo ""
echo "   Frontend:"
echo "   - REACT_APP_API_URL=https://your-backend-url.railway.app"
echo ""
echo "4. 🗄️ Initialize Database:"
echo "   - Access Railway's PostgreSQL terminal"
echo "   - Run: python init_db.py"
echo ""
echo "5. ✅ Test Your Deployment:"
echo "   - Visit https://homepark.nittosolutions.com"
echo "   - Login with admin/admin123"
echo "   - Test all features"
echo ""
echo "📚 For detailed instructions, see DEPLOYMENT.md"
echo ""
echo "💰 Estimated Cost: $5/month (Railway)"
echo "⏱️  Setup Time: 30 minutes"
echo ""
echo "Good luck with your deployment! 🚀" 