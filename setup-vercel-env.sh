#!/bin/bash
# Script to configure Vercel environment variables for ASTERBOT Dashboard

echo "🚀 Setting up Vercel environment variables..."
echo ""

# Check if vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI is not installed. Installing..."
    npm install -g vercel
fi

# Login to Vercel
echo "📝 Logging into Vercel..."
vercel login

# Change to dashboard directory
cd "$(dirname "$0")"

echo ""
echo "🔧 Adding environment variables..."
echo ""

# Add each environment variable
echo "DB_HOST=147.93.127.165" | vercel env add DB_HOST production
echo "DB_PORT=5432" | vercel env add DB_PORT production
echo "DB_NAME=ichigo" | vercel env add DB_NAME production
echo "DB_USER=noor" | vercel env add DB_USER production
echo "DB_PASSWORD=MyDB123456" | vercel env add DB_PASSWORD production
echo "DB_SCHEMA=ichigo" | vercel env add DB_SCHEMA production

echo ""
echo "✅ Environment variables configured!"
echo ""
echo "🔄 Redeploying to production..."
vercel --prod

echo ""
echo "✨ Done! Your dashboard should be working now."
echo "🌐 Check your deployment URL in a few moments."

