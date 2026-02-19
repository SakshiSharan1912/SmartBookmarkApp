@echo off
REM Smart Bookmark App - Development Setup Script for Windows
REM This script automates the initial setup process

echo 🚀 Setting up Smart Bookmark App...
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js is not installed. Please install Node.js 18+ first.
    exit /b 1
)

echo ✅ Node.js found
node --version
echo.

REM Check if npm is installed
where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ npm is not installed. Please install npm first.
    exit /b 1
)

echo ✅ npm found
npm --version
echo.

REM Install dependencies
echo 📦 Installing dependencies...
call npm install

if %ERRORLEVEL% NEQ 0 (
    echo ❌ Failed to install dependencies
    exit /b 1
)

echo ✅ Dependencies installed successfully
echo.

REM Check if .env.local exists
if not exist .env.local (
    echo ⚠️  .env.local not found
    echo 📝 Creating .env.local from template...
    copy .env.local.example .env.local
    echo ✅ Created .env.local
    echo.
    echo ⚠️  IMPORTANT: Edit .env.local and add your Supabase credentials:
    echo    - NEXT_PUBLIC_SUPABASE_URL
    echo    - NEXT_PUBLIC_SUPABASE_ANON_KEY
    echo.
) else (
    echo ✅ .env.local already exists
    echo.
)

echo 📚 Next steps:
echo.
echo 1. Set up Supabase:
echo    - Create account at https://supabase.com
echo    - Create a new project
echo    - Run SQL from SETUP_DATABASE.md
echo    - Enable Realtime for bookmarks table
echo    - Enable Google OAuth provider
echo.
echo 2. Configure environment:
echo    - Edit .env.local with your Supabase credentials
echo.
echo 3. Run the development server:
echo    npm run dev
echo.
echo 4. Open http://localhost:3000
echo.
echo 📖 For detailed instructions, see:
echo    - README.md (comprehensive guide)
echo    - QUICKSTART.md (quick setup)
echo    - SETUP_DATABASE.md (database setup)
echo.
echo ✨ Setup complete! Happy coding!
pause
