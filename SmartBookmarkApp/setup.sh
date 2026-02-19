#!/bin/bash

# Smart Bookmark App - Development Setup Script
# This script automates the initial setup process

echo "🚀 Setting up Smart Bookmark App..."
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null
then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

echo "✅ Node.js found: $(node --version)"
echo ""

# Check if npm is installed
if ! command -v npm &> /dev/null
then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ npm found: $(npm --version)"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed successfully"
echo ""

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "⚠️  .env.local not found"
    echo "📝 Creating .env.local from template..."
    cp .env.local.example .env.local
    echo "✅ Created .env.local"
    echo ""
    echo "⚠️  IMPORTANT: Edit .env.local and add your Supabase credentials:"
    echo "   - NEXT_PUBLIC_SUPABASE_URL"
    echo "   - NEXT_PUBLIC_SUPABASE_ANON_KEY"
    echo ""
else
    echo "✅ .env.local already exists"
    echo ""
fi

echo "📚 Next steps:"
echo ""
echo "1. Set up Supabase:"
echo "   - Create account at https://supabase.com"
echo "   - Create a new project"
echo "   - Run SQL from SETUP_DATABASE.md"
echo "   - Enable Realtime for bookmarks table"
echo "   - Enable Google OAuth provider"
echo ""
echo "2. Configure environment:"
echo "   - Edit .env.local with your Supabase credentials"
echo ""
echo "3. Run the development server:"
echo "   npm run dev"
echo ""
echo "4. Open http://localhost:3000"
echo ""
echo "📖 For detailed instructions, see:"
echo "   - README.md (comprehensive guide)"
echo "   - QUICKSTART.md (quick setup)"
echo "   - SETUP_DATABASE.md (database setup)"
echo ""
echo "✨ Setup complete! Happy coding!"
