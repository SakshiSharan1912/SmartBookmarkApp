# Deployment Guide

## Deploying to Vercel

### Prerequisites
- GitHub account
- Vercel account (free tier is fine)
- Completed Supabase setup

### Steps

#### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit: Smart Bookmark App"
git branch -M main
git remote add origin https://github.com/yourusername/smart-bookmark-app.git
git push -u origin main
```

#### 2. Deploy on Vercel

##### Option A: Vercel Dashboard (Recommended)

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click "Add New Project"
3. Import your `smart-bookmark-app` repository
4. Configure project:
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `./`
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `.next` (auto-detected)

5. Add Environment Variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   ```

6. Click "Deploy"

##### Option B: Vercel CLI

```bash
npm install -g vercel
vercel login
vercel --prod
```

When prompted, add your environment variables.

#### 3. Update OAuth Redirect URLs

After deployment, you'll get a URL like `https://your-app.vercel.app`

1. **Update Google OAuth**:
   - Go to Google Cloud Console
   - Navigate to your OAuth credentials
   - Add to Authorized redirect URIs:
     ```
     https://your-app.vercel.app/auth/callback
     ```

2. **Update Supabase** (if needed):
   - Go to Authentication → URL Configuration
   - Add your Vercel URL to Site URL and Redirect URLs

#### 4. Test the Deployment

1. Visit your Vercel URL
2. Try signing in with Google
3. Add a bookmark
4. Open in another browser/device
5. Verify real-time updates work

### Automatic Deployments

Vercel automatically deploys:
- **Production**: When you push to `main` branch
- **Preview**: When you create a pull request

### Environment Variables Best Practices

1. Never commit `.env.local` to GitHub
2. Use Vercel's environment variables UI
3. Different environments can have different values:
   - Production: Your main Supabase project
   - Preview: Could use a separate test Supabase project

### Custom Domain (Optional)

1. Go to your project settings on Vercel
2. Navigate to "Domains"
3. Add your custom domain
4. Follow DNS configuration instructions
5. Update OAuth redirect URLs with new domain

### Monitoring

Vercel provides:
- **Analytics**: Track page views and performance
- **Logs**: View function execution logs
- **Speed Insights**: Monitor Core Web Vitals

Access these in your project dashboard.

### Troubleshooting Deployment

**Build fails?**
- Check that all dependencies are in `package.json`
- Verify TypeScript has no errors locally
- Check build logs in Vercel dashboard

**OAuth not working in production?**
- Verify redirect URLs include your Vercel domain
- Check environment variables are set correctly
- Ensure HTTPS is used (Vercel provides this automatically)

**500 errors?**
- Check Vercel function logs
- Verify Supabase credentials are correct
- Ensure database schema is set up properly

### Rollback

If something goes wrong:
1. Go to Vercel dashboard
2. Navigate to "Deployments"
3. Find a previous working deployment
4. Click "..." → "Promote to Production"

### Performance Optimization

Vercel automatically provides:
- ✅ Global CDN
- ✅ Edge caching
- ✅ Automatic HTTPS
- ✅ Compression
- ✅ Image optimization

### Cost

This app runs entirely on free tiers:
- **Vercel**: Free for hobby projects
- **Supabase**: Free tier (up to 500MB database, 2GB bandwidth)
- **Google OAuth**: Free

### Continuous Deployment Workflow

```
Local Development → Git Push → Vercel Build → Automated Deploy
```

Every push to main triggers:
1. Vercel pulls latest code
2. Installs dependencies
3. Runs `npm run build`
4. Deploys to production
5. Sends you a notification

---

**Your app is now live and ready to use! 🚀**
