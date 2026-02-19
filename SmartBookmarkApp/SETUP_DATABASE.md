# Database Schema Setup

This document explains how to set up your Supabase database for the Smart Bookmark App.

## Prerequisites

1. Create a Supabase account at https://supabase.com
2. Create a new project in Supabase

## Setup Steps

### 1. Create the Bookmarks Table

Go to the SQL Editor in your Supabase dashboard and run the following SQL:

```sql
-- Create bookmarks table
create table public.bookmarks (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null,
  url text not null
);

-- Enable Row Level Security
alter table public.bookmarks enable row level security;

-- Create policy: Users can only see their own bookmarks
create policy "Users can view their own bookmarks"
  on public.bookmarks for select
  using (auth.uid() = user_id);

-- Create policy: Users can insert their own bookmarks
create policy "Users can insert their own bookmarks"
  on public.bookmarks for insert
  with check (auth.uid() = user_id);

-- Create policy: Users can update their own bookmarks
create policy "Users can update their own bookmarks"
  on public.bookmarks for update
  using (auth.uid() = user_id);

-- Create policy: Users can delete their own bookmarks
create policy "Users can delete their own bookmarks"
  on public.bookmarks for delete
  using (auth.uid() = user_id);

-- Create index for faster queries
create index bookmarks_user_id_idx on public.bookmarks(user_id);
```

### 2. Enable Realtime

Realtime must be enabled for instant bookmark synchronization across tabs and devices.

**For newer Supabase UI (February 2026+):**

1. **Navigate to Publications:**
   - In your Supabase dashboard left sidebar, click on "Database"
   - Click on "Publications" (you'll see it above "Roles" in the sidebar)

2. **Find the supabase_realtime publication:**
   - You should see a publication named "supabase_realtime"
   - Click on it to open

3. **Add the bookmarks table:**
   - Look for an option to add tables or manage tables
   - Find "bookmarks" in the list of available tables
   - Check the box or click "Add" to include it in the publication
   - Save the changes

**Alternative: If you see a Tables view with Realtime toggles:**

1. Go to "Database" → "Tables" in the left sidebar
2. Find the "bookmarks" table in the list
3. Look for a "Realtime" toggle switch or column
4. Enable it by clicking the toggle (it should turn green/blue)

**If Publications is empty or you need to create one:**

Run this SQL in the SQL Editor:
```sql
-- Add bookmarks table to realtime publication
alter publication supabase_realtime add table bookmarks;
```

**What this does:**
- Enables PostgreSQL's logical replication for the bookmarks table
- Allows Supabase to broadcast INSERT, UPDATE, and DELETE events in real-time
- Required for the real-time subscription feature to work in the app

**Verify it's working:**
After enabling, the app will receive live updates when bookmarks are added, modified, or deleted in any browser tab or device.

### 3. Configure Google OAuth

1. Go to Authentication → Providers in your Supabase dashboard
2. Enable Google provider
3. Follow Supabase's instructions to set up Google OAuth:
   - Create a Google Cloud Project
   - Configure OAuth consent screen
   - Create OAuth 2.0 credentials
   - Add authorized redirect URIs:
     - `https://your-project.supabase.co/auth/v1/callback`
     - `http://localhost:3000/auth/callback` (for local development)
4. Copy the Client ID and Client Secret to Supabase
5. Save the configuration

### 4. Get Your Environment Variables

After creating your project:

1. Go to Project Settings → API
2. Copy your Project URL → This is `NEXT_PUBLIC_SUPABASE_URL`
3. Copy your anon/public key → This is `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Create a `.env.local` file in your project root with these values

## Table Structure

### bookmarks

| Column      | Type      | Description                    |
|-------------|-----------|--------------------------------|
| id          | uuid      | Primary key                    |
| created_at  | timestamp | When the bookmark was created  |
| user_id     | uuid      | Foreign key to auth.users      |
| title       | text      | Bookmark title                 |
| url         | text      | Bookmark URL                   |

## Security Features

- **Row Level Security (RLS)**: Enabled on all tables
- **User Isolation**: Users can only access their own bookmarks
- **Cascade Delete**: Bookmarks are deleted if user is deleted
- **Authentication Required**: All operations require authenticated user

## Testing the Setup

1. Sign in to your app with Google
2. Try adding a bookmark
3. Open the app in another tab/browser
4. Add a bookmark in one tab
5. Verify it appears in real-time in the other tab
