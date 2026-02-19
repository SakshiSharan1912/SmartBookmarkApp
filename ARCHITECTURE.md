# Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Client (Browser)                     │
│  ┌────────────┐  ┌──────────────┐  ┌──────────────────┐    │
│  │ Next.js UI │  │ React State  │  │ Supabase Client  │    │
│  │ Components │←→│  Management  │←→│   (WebSocket)     │    │
│  └────────────┘  └──────────────┘  └──────────────────┘    │
└─────────────────────────────────┬───────────────────────────┘
                                  │ HTTPS
┌─────────────────────────────────┼───────────────────────────┐
│                    Vercel Edge Network                       │
│  ┌────────────────────────────────────────────────────────┐ │
│  │           Next.js App Router (Server)                  │ │
│  │  • Server Components    • API Routes                   │ │
│  │  • Server Actions      • Middleware                    │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────┬───────────────────────────┘
                                  │ API Calls
┌─────────────────────────────────┼───────────────────────────┐
│                        Supabase Backend                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐  │
│  │  PostgreSQL  │  │  Auth Server │  │ Realtime Server  │  │
│  │   Database   │  │  (OAuth 2.0) │  │   (WebSocket)    │  │
│  │     (RLS)     │  └──────────────┘  └──────────────────┘  │
│  └──────────────┘                                            │
└──────────────────────────────────────────────────────────────┘
                                  │
┌─────────────────────────────────┼───────────────────────────┐
│                      Google OAuth 2.0                        │
└──────────────────────────────────────────────────────────────┘
```

## Data Flow

### 1. Authentication Flow

```
User clicks "Sign in with Google"
    ↓
Redirect to Google OAuth consent screen
    ↓
User approves
    ↓
Redirect to /auth/callback with code
    ↓
Exchange code for session (Supabase)
    ↓
Set HTTP-only cookie
    ↓
Redirect to home page
    ↓
User is authenticated
```

### 2. Add Bookmark Flow

```
User submits form
    ↓
Client sends INSERT to Supabase
    ↓
Supabase validates RLS policy (user_id matches)
    ↓
Insert into database
    ↓
Realtime trigger fires
    ↓
WebSocket broadcasts to all connected clients
    ↓
All tabs update instantly
```

### 3. Real-time Update Flow

```
Component mounts
    ↓
Subscribe to Realtime channel
    ↓
Filter: user_id = current user
    ↓
Listen for: INSERT, UPDATE, DELETE events
    ↓
On event: Update local React state
    ↓
Component re-renders with new data
    ↓
On unmount: Unsubscribe and cleanup
```

## Component Hierarchy

```
app/layout.tsx (Root)
│
├── app/login/page.tsx
│   └── GoogleSignInButton.tsx
│
└── app/page.tsx (Protected)
    ├── LogoutButton.tsx
    ├── AddBookmarkForm.tsx
    └── BookmarkList.tsx
        └── BookmarkItem.tsx (multiple)
```

## State Management

### Server State
- **Source**: Supabase PostgreSQL
- **Fetching**: Server Components fetch initial data
- **Caching**: Next.js automatic caching
- **Revalidation**: Real-time subscriptions

### Client State
- **Framework**: React useState hooks
- **Scope**: Component-level (no global state needed)
- **Updates**: Via Realtime subscriptions
- **Persistence**: None (fetched from server)

## Security Layers

### Layer 1: Authentication
- Google OAuth 2.0
- Supabase Auth manages sessions
- HTTP-only cookies prevent XSS

### Layer 2: Authorization
- Row Level Security (RLS) policies
- Database-level enforcement
- Cannot be bypassed by client

### Layer 3: Network
- HTTPS only in production
- Vercel provides SSL/TLS
- Secure headers via Next.js

### Layer 4: Input Validation
- TypeScript type checking
- HTML5 form validation
- React prevents XSS

## Database Schema

```sql
Table: bookmarks
├── id (uuid, primary key)
├── created_at (timestamp)
├── user_id (uuid, foreign key → auth.users)
├── title (text)
└── url (text)

Indexes:
└── bookmarks_user_id_idx (user_id)

RLS Policies:
├── SELECT: auth.uid() = user_id
├── INSERT: auth.uid() = user_id
├── UPDATE: auth.uid() = user_id
└── DELETE: auth.uid() = user_id
```

## API Routes

| Route                    | Method | Purpose                   |
|-------------------------|--------|---------------------------|
| `/`                     | GET    | Home page (bookmarks)     |
| `/login`                | GET    | Login page                |
| `/auth/callback`        | GET    | OAuth callback handler    |

Note: CRUD operations use Supabase client directly, not Next.js API routes.

## Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL
├── Used by: Client & Server
├── Purpose: Supabase API endpoint
└── Public: Yes (safe to expose)

NEXT_PUBLIC_SUPABASE_ANON_KEY
├── Used by: Client & Server
├── Purpose: Supabase authentication
├── Public: Yes (RLS protects data)
└── Note: Not a secret key
```

## Performance Optimizations

### Server-Side
- Server Components reduce JavaScript
- Automatic code splitting
- Edge runtime where possible

### Client-Side
- React 18 concurrent features
- Optimistic UI updates possible
- WebSocket for efficient real-time

### Network
- CDN via Vercel
- Static page optimization
- Automatic compression

### Database
- Indexed queries (user_id)
- Connection pooling (Supabase)
- RLS with efficient policies

## Deployment Architecture

```
Git Push → GitHub
    ↓
Webhook triggers Vercel
    ↓
Vercel Build Process:
├── Install dependencies
├── TypeScript compilation
├── Next.js build
└── Optimize assets
    ↓
Deploy to Edge Network
    ↓
Cache invalidation
    ↓
Live at domain
```

## Scalability Considerations

### Current Limits (Free Tier)
- Supabase: 500MB database, 2GB bandwidth
- Vercel: 100GB bandwidth, 100 serverless function executions

### To Scale Up
1. Upgrade Supabase plan for more connections
2. Upgrade Vercel for higher limits
3. Add database read replicas
4. Implement caching layer (Redis)
5. Add CDN for static assets

## Technology Decisions

### Why Next.js App Router?
- Server Components for better performance
- Built-in routing
- Great developer experience
- Vercel optimization

### Why Supabase?
- PostgreSQL database
- Built-in authentication
- Real-time out of the box
- Row Level Security
- Free tier generous

### Why Tailwind CSS?
- Utility-first approach
- No CSS conflicts
- Great for rapid development
- Built-in dark mode

## Monitoring & Debugging

### Production Monitoring
- Vercel Analytics: Page views, performance
- Vercel Logs: Server-side errors
- Supabase Dashboard: Database queries, auth events

### Local Development
- React DevTools: Component inspection
- Next.js Dev Mode: Hot reload, error overlay
- Browser DevTools: Network, console, storage
- Supabase Studio: Database inspection

---

This architecture prioritizes simplicity, security, and real-time capabilities while remaining easy to understand and maintain.
