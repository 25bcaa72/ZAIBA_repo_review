@echo off
title Push to GitHub
color 0B

echo ========================================
echo   🚀 PUSH TO GITHUB
echo ========================================
echo.
echo This will push your portfolio to GitHub
echo Repository: https://github.com/25bcaa72/ZAIBIA_FINAL_PROJECT.git
echo.
echo If you get authentication errors:
echo 1. Make sure you're logged into GitHub
echo 2. Or use GitHub token for authentication
echo.
echo Press any key to push to GitHub...
pause > nul

echo.
echo 🔄 Adding files...
git add .

echo.
echo 📝 Committing changes...
git commit -m "Portfolio website - ready for deployment"

echo.
echo 🚀 Pushing to GitHub...
git push -u origin main

echo.
if %ERRORLEVEL% EQU 0 (
    echo ✅ SUCCESS! Your portfolio is now on GitHub!
    echo 🌐 Repository: https://github.com/25bcaa72/ZAIBIA_FINAL_PROJECT
    echo.
    echo 📋 Next step: Deploy on Render
    echo 1. Go to: https://render.com
    echo 2. Connect this repository
    echo 3. Start command: node server.js
) else (
    echo ❌ Push failed!
    echo.
    echo 💡 Solutions:
    echo 1. Check if repository exists: https://github.com/25bcaa72/ZAIBIA_FINAL_PROJECT
    echo 2. Make sure repository is PUBLIC
    echo 3. Check GitHub authentication
    echo 4. Try: git push -u origin main --force
)

echo.
pause
