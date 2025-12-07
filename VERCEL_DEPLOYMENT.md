# Vercel Deployment Guide

## Prerequisites
1. GitHub account
2. Vercel account (sign up at vercel.com)
3. MongoDB Atlas database (already set up)

## Step 1: Prepare Your Repository

### Update .gitignore
Make sure your `.gitignore` includes:
```
.env
node_modules/
dist/
.vercel
```

### Commit your changes
```bash
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

## Step 2: Deploy to Vercel

### Option A: Deploy via Vercel Dashboard (Easiest)

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **"Add New Project"**
3. Import your GitHub repository: `viraj24ecs-design/hint-pe-hint-landing`
4. Configure your project:
   - **Framework Preset**: Vite
   - **Root Directory**: ./
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `dist` (auto-detected)

5. **Add Environment Variables** (IMPORTANT!):
   Click "Environment Variables" and add:
   
   ```
   MONGODB_URI=mongodb+srv://virajwanjari123_db_user:eWuLQD1usRdkm7EI@cluster0.cxozapz.mongodb.net/hint-pe-hint?retryWrites=true&w=majority
   JWT_SECRET=hint-pe-hint-secret-key-2025-change-this-in-production
   ```

6. Click **"Deploy"**
7. Wait 2-3 minutes for deployment to complete

### Option B: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Follow the prompts:
# - Set up and deploy? Yes
# - Which scope? (Select your account)
# - Link to existing project? No
# - Project name? hint-pe-hint-landing
# - Directory? ./
# - Override settings? No

# Add environment variables
vercel env add MONGODB_URI
# Paste: mongodb+srv://virajwanjari123_db_user:eWuLQD1usRdkm7EI@cluster0.cxozapz.mongodb.net/hint-pe-hint?retryWrites=true&w=majority

vercel env add JWT_SECRET
# Paste: hint-pe-hint-secret-key-2025-change-this-in-production

# Deploy to production
vercel --prod
```

## Step 3: Verify Deployment

After deployment, Vercel will give you a URL like: `https://hint-pe-hint-landing.vercel.app`

Test these endpoints:
1. **Frontend**: `https://your-app.vercel.app` - Should load the homepage
2. **API Test**: `https://your-app.vercel.app/api/auth/test` - Should return error or auth message
3. **Signup/Login**: Try creating an account and logging in

## Step 4: Configure MongoDB Atlas for Vercel

1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Click on your cluster → **Network Access**
3. Click **"Add IP Address"**
4. Select **"Allow Access from Anywhere"** (0.0.0.0/0)
   - Or add Vercel's IP ranges for better security
5. Click **"Confirm"**

## Troubleshooting

### Issue: API routes return 404
- Check `vercel.json` is in the root directory
- Verify the `api/` folder exists with `auth.js`
- Check Vercel function logs

### Issue: MongoDB connection fails
- Verify `MONGODB_URI` is set in Vercel environment variables
- Check MongoDB Atlas allows connections from anywhere (0.0.0.0/0)
- Check database username and password are correct

### Issue: CORS errors
- The API is configured to allow all origins in production
- Check browser console for specific error messages

### View Logs
Go to your Vercel dashboard → Project → Deployments → Click on latest deployment → Functions → View logs

## Environment Variables Needed on Vercel

Required:
- `MONGODB_URI` - Your MongoDB Atlas connection string
- `JWT_SECRET` - Secret key for JWT tokens (use a strong random string)

## Local Development vs Production

### Local Development
- Frontend: `http://localhost:5173` (Vite dev server)
- Backend: `http://localhost:5001` (Express server)
- Run: `npm run dev` (frontend) + `npm run server` (backend)

### Production (Vercel)
- Frontend: `https://your-app.vercel.app`
- Backend: `https://your-app.vercel.app/api/*` (Serverless functions)
- Automatic deployment on git push

## Custom Domain (Optional)

1. Go to Vercel Dashboard → Your Project → Settings → Domains
2. Add your custom domain (e.g., hintpehint.com)
3. Follow DNS configuration instructions
4. SSL certificate is automatically provisioned

## Continuous Deployment

After initial setup, every push to `main` branch will automatically deploy to Vercel!

```bash
git add .
git commit -m "Update feature"
git push origin main
```

Vercel will automatically:
1. Detect the push
2. Build your project
3. Deploy to production
4. Update your live URL

## Important Notes

1. **Never commit `.env` file** - It's in `.gitignore`
2. **Environment variables** must be set in Vercel dashboard
3. **MongoDB Atlas** must allow Vercel's IP ranges
4. **Serverless functions** have a 10-second timeout limit
5. **Cold starts** - First request might be slower (serverless nature)

## Support

If you encounter issues:
1. Check Vercel deployment logs
2. Check browser console for frontend errors
3. Verify environment variables are set correctly
4. Ensure MongoDB Atlas network access is configured
