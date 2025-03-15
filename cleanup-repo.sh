#!/bin/bash

# Script to clean up git repository by removing unwanted tracked files
# This script will:
# 1. Remove files from git tracking (but keep them locally)
# 2. Commit the changes
# 3. Provide instructions for pushing the changes

echo "🧹 Starting repository cleanup..."

# Remove the dist directory from git tracking (but keep it locally)
echo "📁 Removing dist/ directory from git tracking..."
git rm -r --cached dist/

# Remove node_modules from git tracking (if somehow tracked)
echo "📁 Removing node_modules/ directory from git tracking (if tracked)..."
git rm -r --cached node_modules/ 2>/dev/null || echo "node_modules/ not tracked (good!)"

# Remove .DS_Store files
echo "🗑️  Removing .DS_Store files from git tracking..."
find . -name ".DS_Store" -exec git rm --cached {} \; 2>/dev/null || echo "No .DS_Store files tracked"

# Optional: Remove other files you don't want to track
# Uncomment and modify these lines as needed

# echo "📄 Removing specific data files from git tracking..."
# git rm --cached profile.json reviews.json reviews.csv profile.csv reviews_rows.csv 2>/dev/null

# echo "📄 Removing specific config files from git tracking..."
# git rm --cached magic-mcp.config.json 21st-dev-config.json 2>/dev/null

echo "✅ Files have been removed from git tracking (but kept locally)"
echo "📝 Now you should commit these changes:"
echo "   git commit -m \"Remove unwanted files from git tracking\""
echo "   git push"

echo "🔍 To verify what files are still being tracked, you can run:"
echo "   git ls-files"

echo "🧹 Cleanup complete!"
