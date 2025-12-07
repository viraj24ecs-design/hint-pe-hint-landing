# Hint Pe Hint - Deployment Guide

## 🚀 Deploy to Vercel

### Method 1: Deploy with Serverless Backend (All-in-One)

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Ready for Vercel deployment"
   git push origin main
   ```

2. **Deploy on Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Click "Import Project"
   - Select your GitHub repository
   - Vercel will auto-detect the Vite config

3. **Add Environment Variables in Vercel:**
   - Go to Project Settings → Environment Variables
   - Add these variables:
     - `MONGODB_URI` = `mongodb+srv://virajwanjari123_db_user:eWuLQD1usRdkm7EI@cluster0.cxozapz.mongodb.net/hint-pe-hint?retryWrites=true&w=majority`
     - `JWT_SECRET` = `your-super-secret-jwt-key-change-this-in-production`

4. **Deploy!** 
   - Click "Deploy"
   - Your app will be live at `https://your-app.vercel.app`

### Method 2: Deploy Frontend + Backend Separately (Recommended for Production)

#### Frontend (Vercel):
1. Push to GitHub
2. Import to Vercel
3. Update `src/contexts/AuthContext.tsx` to use your backend URL:
   ```typescript
   const API_URL = process.env.VITE_API_URL || 'https://your-backend.onrender.com/api/auth';
   ```

#### Backend (Render.com - Free):
1. Go to [render.com](https://render.com)
2. Click "New +" → "Web Service"
3. Connect your GitHub repo
4. Settings:
   - **Build Command:** `npm install`
   - **Start Command:** `node server/server.cjs`
   - **Environment Variables:**
     - Add `MONGODB_URI`
     - Add `JWT_SECRET`
     - Add `PORT=5001`
5. Deploy!

## 📝 Important Notes

### Before Deploying:
- [ ] Make sure `.env` is in `.gitignore` ✅ (already added)
- [ ] Update CORS origins in `server/server.cjs` to include your Vercel domain
- [ ] Test locally with `npm run dev` and `npm run server`

### After Deploying:
- Update MongoDB Atlas Network Access to allow connections from anywhere (0.0.0.0/0) or add Vercel/Render IPs
- Test signup/login on production

## 🔧 Local Development

```bash
# Install dependencies
npm install

# Run frontend (port 8080)
npm run dev

# Run backend (port 5001) - in separate terminal
npm run server
```

Visit: `http://localhost:8080`

## 🗄️ MongoDB Atlas Setup

Already configured! Connection string in `.env`

To view data:
1. Download [MongoDB Compass](https://www.mongodb.com/products/compass)
2. Connect with: `mongodb+srv://virajwanjari123_db_user:eWuLQD1usRdkm7EI@cluster0.cxozapz.mongodb.net/hint-pe-hint`

## 📊 View User Activity

GET `http://localhost:5001/api/auth/users-activity`

Shows all users with login counts and timestamps.
