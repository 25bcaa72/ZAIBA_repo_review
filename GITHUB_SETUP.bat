@echo off
title GitHub Repository Setup
color 0B

echo ========================================
echo   🚀 GITHUB REPOSITORY SETUP
echo ========================================
echo.
echo This script will help you create a GitHub repository
echo and push your portfolio website automatically.
echo.
echo BEFORE YOU START:
echo 1. Make sure you have a GitHub account
echo 2. Replace "YOUR_USERNAME" with your actual GitHub username
echo 3. Have your GitHub token ready (if required)
echo.
echo Press any key to continue...
pause > nul

echo.
echo 🔄 Setting up GitHub repository...
echo.

REM Replace YOUR_USERNAME with your actual GitHub username
set USERNAME=YOUR_USERNAME

echo 📝 Creating repository on GitHub...
echo.
echo MANUAL STEPS (since GitHub API requires authentication):
echo 1. Go to: https://github.com/new
echo 2. Repository name: portfolio
echo 3. Description: My portfolio website
echo 4. Make it PUBLIC
echo 5. DO NOT initialize with README
echo 6. Click "Create repository"
echo.
echo After creating the repository, press any key to continue...
pause > nul

echo.
echo 🚀 Pushing to GitHub...
echo.

REM Add remote and push
git branch -M main
git remote add origin https://github.com/%USERNAME%/portfolio.git
git push -u origin main

echo.
echo ✅ SUCCESS! Your portfolio is now on GitHub!
echo.
echo 📋 Next steps:
echo 1. Go to: https://render.com
echo 2. Connect your GitHub repository
echo 3. Deploy with command: node server.js
echo 4. Your website will be live!
echo.
echo 🌐 Your portfolio URL will be: https://portfolio.onrender.com
echo.
pause