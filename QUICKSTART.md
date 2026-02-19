# Smart Bookmark App - Quick Start Guide

## For Evaluators

This guide will help you quickly set up and test the Smart Bookmark App.

### ⚡ Quick Setup (5 minutes)

#### 1. Install Dependencies
```bash
npm install
```

#### 2. Set Up Supabase

1. **Create a Supabase account**: https://supabase.com (free tier)
2. **Create a new project** (choose any name and password)
3. **Run the database setup**:
   - Go to SQL Editor in Supabase dashboard
   - Copy and paste the SQL from `SETUP_DATABASE.md`
   - Click "Run"

4. **Enable Realtime**:
   - Go to Database → Replication
   - Find the `bookmarks` table
   - Toggle it on

5. **Set up Google OAuth**:
   - Go to Authentication → Providers
   - Enable Google
   - You can use your own Google Cloud credentials or contact me for test credentials

#### 3. Configure Environment

1. Copy `.env.local.example` to `.env.local`
2. Get your Supabase credentials:
   - Go to Project Settings → API
   - Copy Project URL and anon/public key
3. Update `.env.local`:
```bash
NEXT_PUBLIC_SUPABASE_URL=your_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key_here
```

#### 4. Run the App

```bash
npm run dev
```

Open http://localhost:3000

### 🧪 Testing Features

1. **Sign In**: Click "Sign in with Google" (use your Google account)
2. **Add Bookmark**: Fill in title and URL, click "Add Bookmark"
3. **Real-time Test**: 
   - Open the app in another browser tab
   - Add a bookmark in one tab
   - Watch it appear instantly in the other tab!
4. **Delete**: Click the "Delete" button on any bookmark

### 📱 Testing on Multiple Devices

The real-time feature works across different devices too:
- Open the app on your phone
- Open it on your computer
- Add a bookmark on one device
- See it appear on the other instantly!

### 🚀 Deployment

The app is designed for Vercel deployment:

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel
```

Or connect your GitHub repo to Vercel dashboard for automatic deployments.

### 📋 Requirements Checklist

- ✅ Google OAuth sign-in (no email/password)
- ✅ Add bookmarks (URL + title)
- ✅ Private bookmarks (user isolation via RLS)
- ✅ Real-time updates (Supabase Realtime)
- ✅ Delete bookmarks
- ✅ Vercel deployment ready
- ✅ Comprehensive README with problems & solutions

### 🔍 Code Highlights

- **Real-time Implementation**: See `components/BookmarkList.tsx` (lines 33-58)
- **Google OAuth**: See `components/GoogleSignInButton.tsx`
- **RLS Security**: See database setup in `SETUP_DATABASE.md`
- **Server/Client Architecture**: Check `utils/supabase/` directory

### 💡 Tips

- The app uses Next.js App Router (not Pages Router)
- All authentication is handled by Supabase
- Real-time updates use WebSocket connections
- Dark mode works automatically based on system preferences

### ❓ Troubleshooting

**Real-time not working?**
- Make sure Realtime is enabled in Supabase for the bookmarks table

**OAuth redirect error?**
- Check that redirect URLs match in Google Console and Supabase

**Can't see bookmarks?**
- Make sure you're signed in
- Check browser console for errors
- Verify RLS policies are set up correctly

### 📞 Support

If you encounter any issues, check:
1. The detailed README.md
2. SETUP_DATABASE.md for database setup
3. Browser console for error messages

---

**Estimated setup time**: 5-10 minutes
**Estimated testing time**: 5 minutes
