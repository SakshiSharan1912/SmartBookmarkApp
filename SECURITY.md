# Security Policy

## Reporting a Vulnerability

If you discover a security vulnerability in the Smart Bookmark App, please report it by:

1. **DO NOT** open a public issue
2. Email the details to: [your-email@example.com]
3. Include:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)

## Response Time

- We aim to respond to security reports within 48 hours
- We'll provide updates every 72 hours until the issue is resolved

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| Latest  | :white_check_mark: |
| Older   | :x:                |

We only support the latest version deployed on the main branch.

## Security Measures

This application implements several security measures:

### Authentication
- OAuth 2.0 via Google (no password storage)
- Supabase handles all authentication securely
- Sessions managed via HTTP-only cookies

### Database Security
- Row Level Security (RLS) enabled on all tables
- Users can only access their own data
- Prepared statements prevent SQL injection
- All queries filtered by authenticated user ID

### Network Security
- HTTPS enforced in production (via Vercel)
- Environment variables for sensitive data
- No API keys exposed to client

### Data Privacy
- Bookmarks are private to each user
- No data sharing between users
- User data encrypted in transit and at rest (Supabase)

### Best Practices
- Dependencies regularly updated
- TypeScript for type safety
- Input validation on forms
- XSS protection via React
- CSRF protection via Supabase auth

## Known Limitations

1. This is a demo application - use caution with sensitive bookmarks
2. Free tier has rate limits
3. No data backup system (backup handled by Supabase)

## Responsible Disclosure

We appreciate responsible disclosure of security vulnerabilities. We will:
- Acknowledge your report
- Keep you informed of our progress
- Credit you in the fix (if desired)
- Not take legal action against researchers who follow this policy

Thank you for helping keep Smart Bookmark App secure! 🔒
