# Smart Bookmark App

A real-time bookmark manager built with Next.js, Supabase, and Tailwind CSS. Save, organize, and access your favorite links with Google OAuth authentication and live updates across all your devices.

## 🚀 Live Demo

[View Live App](https://your-app.vercel.app) *(Update this after deployment)*

## ✨ Features

- **Google OAuth Authentication**: Secure sign-in using Google accounts only (no email/password)
- **Add Bookmarks**: Save URLs with custom titles
- **Private Bookmarks**: Each user's bookmarks are completely private
- **Real-time Updates**: Bookmarks sync instantly across all open tabs and devices
- **Delete Bookmarks**: Remove bookmarks you no longer need
- **Responsive Design**: Works beautifully on desktop, tablet, and mobile
- **Dark Mode Support**: Automatically adapts to system preferences

## 🛠️ Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Authentication & Database**: [Supabase](https://supabase.com/)
  - PostgreSQL database
  - Real-time subscriptions
  - Row Level Security (RLS)
  - Google OAuth integration
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Language**: TypeScript
- **Deployment**: [Vercel](https://vercel.com/)

## 📋 Prerequisites

- Node.js 18+ and npm
- A Supabase account (free tier works fine)
- A Google Cloud account for OAuth credentials

## 🏗️ Local Development Setup

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/smart-bookmark-app.git
cd smart-bookmark-app
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to the SQL Editor and run the schema from [SETUP_DATABASE.md](./SETUP_DATABASE.md)
3. Enable Google OAuth provider in Authentication → Providers
4. Enable Realtime for the `bookmarks` table in Database → Replication

### 4. Configure Environment Variables

Create a `.env.local` file in the root directory:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

You can find these values in your Supabase project settings under API.

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## 🚢 Deployment to Vercel

### Option 1: Deploy via Vercel Dashboard

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com/) and sign in
3. Click "Add New Project"
4. Import your GitHub repository
5. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
6. Click "Deploy"

### Option 2: Deploy via Vercel CLI

```bash
npm install -g vercel
vercel login
vercel
```

Follow the prompts and add your environment variables when asked.

### Important: Update OAuth Redirect URLs

After deployment, add your Vercel URL to Google OAuth:

1. Go to Google Cloud Console
2. Navigate to your OAuth 2.0 credentials
3. Add to Authorized redirect URIs:
   ```
   https://your-project.supabase.co/auth/v1/callback
   https://your-app.vercel.app/auth/callback
   ```

## 📁 Project Structure

```
smart-bookmark-app/
├── app/
│   ├── auth/
│   │   └── callback/
│   │       └── route.ts          # OAuth callback handler
│   ├── login/
│   │   └── page.tsx              # Login page
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Home page (bookmarks)
├── components/
│   ├── AddBookmarkForm.tsx       # Form to add new bookmarks
│   ├── BookmarkItem.tsx          # Individual bookmark display
│   ├── BookmarkList.tsx          # List with real-time updates
│   ├── GoogleSignInButton.tsx    # Google OAuth button
│   └── LogoutButton.tsx          # Sign out button
├── utils/
│   └── supabase/
│       ├── client.ts             # Browser Supabase client
│       ├── server.ts             # Server Supabase client
│       └── middleware.ts         # Auth middleware
├── middleware.ts                 # Next.js middleware
├── .env.local.example            # Environment variables template
├── SETUP_DATABASE.md             # Database setup instructions
└── README.md                     # This file
```

## 🔧 Problems Encountered and Solutions

### Problem 1: Real-time Updates Not Working Initially

**Issue**: Bookmarks weren't updating in real-time across different browser tabs.

**Root Cause**: The Realtime feature wasn't enabled for the bookmarks table in Supabase.

**Solution**: 
1. Went to Database → Replication in Supabase dashboard
2. Enabled replication for the `bookmarks` table
3. Updated the subscription code to properly filter by `user_id`
4. Added proper cleanup in the `useEffect` hook to prevent memory leaks

**Code Implementation**:
```typescript
const channel = supabase
  .channel('bookmarks-changes')
  .on('postgres_changes', {
    event: '*',
    schema: 'public',
    table: 'bookmarks',
    filter: `user_id=eq.${userId}`,
  }, (payload) => {
    // Handle INSERT, UPDATE, DELETE events
  })
  .subscribe()
```

### Problem 2: OAuth Redirect Loop

**Issue**: After Google OAuth login, users were stuck in a redirect loop.

**Root Cause**: The auth callback route wasn't properly handling the code exchange and environment detection.

**Solution**:
1. Implemented proper code exchange using `exchangeCodeForSession`
2. Added environment detection for local vs production
3. Used `x-forwarded-host` header for Vercel deployments
4. Ensured correct redirect URLs in both Google Console and Supabase

**Key Learning**: Always check both `x-forwarded-host` header and `NODE_ENV` when handling OAuth redirects in serverless environments.

### Problem 3: Bookmarks Visible to Other Users

**Issue**: During testing, realized that without proper RLS policies, bookmarks could potentially be accessed by other users.

**Root Cause**: Initially created the table without comprehensive Row Level Security policies.

**Solution**:
1. Enabled RLS on the bookmarks table
2. Created separate policies for SELECT, INSERT, UPDATE, and DELETE
3. Each policy checks `auth.uid() = user_id` to ensure users only access their own data
4. Added cascade delete so bookmarks are removed if user account is deleted

**Security Implementation**:
```sql
create policy "Users can view their own bookmarks"
  on public.bookmarks for select
  using (auth.uid() = user_id);
```

### Problem 4: Slow Bookmark Queries

**Issue**: As the number of bookmarks grew during testing, queries became slower.

**Root Cause**: No database index on the `user_id` column which is used in every query.

**Solution**:
Added an index on `user_id`:
```sql
create index bookmarks_user_id_idx on public.bookmarks(user_id);
```

**Result**: Query performance improved significantly, especially for users with many bookmarks.

### Problem 5: TypeScript Errors with Supabase Types

**Issue**: TypeScript couldn't infer correct types for Supabase queries.

**Root Cause**: Not using the latest Supabase SSR package properly.

**Solution**:
1. Updated to `@supabase/ssr` package for better Next.js App Router support
2. Created separate client utilities for browser and server contexts
3. Added proper TypeScript interfaces for database types
4. Used explicit type annotations where needed

### Problem 6: Dark Mode Styling Inconsistencies

**Issue**: Some UI elements didn't adapt properly to dark mode.

**Root Cause**: Incomplete dark mode class coverage in Tailwind.

**Solution**:
- Added `dark:` variants to all color classes
- Ensured proper contrast in both light and dark modes
- Tested all components in both themes
- Used CSS variables for consistent theming

## 🧪 Testing Checklist

- [x] User can sign in with Google
- [x] User can add bookmarks with title and URL
- [x] Bookmarks are private (other users can't see them)
- [x] Real-time updates work (open in two tabs and test)
- [x] User can delete bookmarks
- [x] App works on mobile devices
- [x] Dark mode adapts properly
- [x] Deployed successfully on Vercel

## 🔐 Security Features

- **Row Level Security**: All database queries are protected by RLS policies
- **User Isolation**: Each user can only access their own bookmarks
- **OAuth Only**: No password storage, using Google's secure authentication
- **HTTPS Only**: All production traffic encrypted
- **Environment Variables**: Sensitive keys stored securely

## 🎨 UI/UX Features

- Clean, modern design with gradient backgrounds
- Responsive layout that works on all screen sizes
- Loading states for better user feedback
- Confirmation dialogs before deleting bookmarks
- Empty state messaging
- Hover effects and smooth transitions
- Automatic dark mode based on system preferences

## 📝 License

MIT License - feel free to use this project for learning or as a template for your own applications.

## 🙏 Acknowledgments

- [Supabase](https://supabase.com/) for the excellent backend-as-a-service
- [Vercel](https://vercel.com/) for seamless deployment
- [Next.js](https://nextjs.org/) for the powerful React framework
- [Tailwind CSS](https://tailwindcss.com/) for utility-first styling

## 📧 Contact

If you have questions or feedback, please open an issue on GitHub.

---

**Built with ❤️ using Next.js and Supabase**
