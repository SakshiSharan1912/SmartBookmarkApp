# Project Structure

```
SmartBookmarkApp/
│
├── 📱 app/                          # Next.js App Router
│   ├── auth/
│   │   └── callback/
│   │       └── route.ts             # OAuth callback handler
│   ├── login/
│   │   └── page.tsx                 # Login page with Google sign-in
│   ├── globals.css                  # Global styles with Tailwind
│   ├── layout.tsx                   # Root layout component
│   └── page.tsx                     # Home page (bookmarks list)
│
├── 🧩 components/                   # React components
│   ├── AddBookmarkForm.tsx          # Form to create new bookmarks
│   ├── BookmarkItem.tsx             # Single bookmark card
│   ├── BookmarkList.tsx             # List with real-time updates
│   ├── GoogleSignInButton.tsx       # Google OAuth button
│   └── LogoutButton.tsx             # Sign out functionality
│
├── 🔧 utils/                        # Utility functions
│   └── supabase/
│       ├── client.ts                # Browser Supabase client
│       ├── middleware.ts            # Auth refresh middleware
│       └── server.ts                # Server Supabase client
│
├── 📝 types/                        # TypeScript type definitions
│   └── database.types.ts            # Supabase database types
│
├── 📚 Documentation Files
│   ├── README.md                    # Main project documentation
│   ├── QUICKSTART.md                # Quick setup guide
│   ├── SETUP_DATABASE.md            # Database configuration
│   ├── DEPLOYMENT.md                # Vercel deployment guide
│   ├── ARCHITECTURE.md              # System architecture
│   ├── CONTRIBUTING.md              # Contribution guidelines
│   ├── SECURITY.md                  # Security policy
│   └── CHANGELOG.md                 # Version history
│
├── ⚙️ Configuration Files
│   ├── package.json                 # Dependencies and scripts
│   ├── tsconfig.json                # TypeScript configuration
│   ├── next.config.js               # Next.js configuration
│   ├── tailwind.config.ts           # Tailwind CSS configuration
│   ├── postcss.config.js            # PostCSS configuration
│   ├── vercel.json                  # Vercel deployment config
│   ├── middleware.ts                # Next.js middleware
│   └── .env.local.example           # Environment variables template
│
├── 🔒 Security & Legal
│   ├── .gitignore                   # Git ignore rules
│   └── LICENSE                      # MIT License
│
└── 🚀 Setup Scripts
    ├── setup.sh                     # Linux/Mac setup script
    └── setup.bat                    # Windows setup script
```

## File Count by Type

- **TypeScript/TSX files**: 15
- **Configuration files**: 7
- **Documentation files**: 8
- **Setup scripts**: 2
- **Total files**: 32

## Key Directories

### `/app` - Application Pages
All route-based React components using Next.js App Router.

### `/components` - Reusable UI Components
Client-side React components that can be reused across pages.

### `/utils` - Helper Functions
Supabase client utilities for browser and server contexts.

### `/types` - TypeScript Types
Shared TypeScript interfaces and type definitions.

## Code Organization

### Server Components
- `app/page.tsx` - Fetches initial data on server
- `app/layout.tsx` - Server-side layout wrapper

### Client Components
- All files in `/components/` - Interactive UI elements
- Uses `'use client'` directive

### API Routes
- `app/auth/callback/route.ts` - OAuth callback endpoint

### Middleware
- `middleware.ts` - Auth session refresh on every request

## Development Workflow

```
1. Developer writes code in /app or /components
2. TypeScript checks types
3. Next.js compiles (dev mode with hot reload)
4. Tailwind generates utility classes
5. App runs on http://localhost:3000
```

## Production Build

```
1. npm run build
2. Next.js optimizes:
   - Server Components
   - Client bundles
   - Static pages
   - Image optimization
3. Output to .next/ directory
4. Deployed to Vercel
```

## Import Paths

The project uses TypeScript path aliases:

```typescript
import { createClient } from '@/utils/supabase/client'
import BookmarkList from '@/components/BookmarkList'
```

Where `@/` maps to the project root.

## Styling Approach

- **Primary**: Tailwind CSS utility classes
- **Global styles**: `app/globals.css`
- **Dark mode**: Tailwind's `dark:` variant
- **No CSS modules**: All styling inline via Tailwind

## State Management

- **Server state**: Fetched via Supabase
- **Client state**: React useState hooks
- **Real-time**: Supabase Realtime subscriptions
- **No global state library**: Not needed for this app

## Testing Strategy

While automated tests aren't included in v1.0, you can test:

1. **Manual testing**: Use the checklist in README
2. **Real-time**: Open multiple tabs
3. **Auth**: Try different Google accounts
4. **Mobile**: Use browser dev tools responsive mode

## Future Expansion

Recommended structure for new features:

```
/lib              # Shared business logic
/hooks            # Custom React hooks
/actions          # Server actions
/api              # Additional API routes
/tests            # Unit and integration tests
/public           # Static assets (images, icons)
```

## Environment Files

```
.env.local           # Local development (git-ignored)
.env.local.example   # Template (committed to git)
.env.production      # Set in Vercel dashboard
```

---

This structure follows Next.js 14 best practices and is optimized for Vercel deployment.
