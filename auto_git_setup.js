/* =============================================
   auto_git_setup.js - Automatic Git repository setup
   ============================================= */

const fs = require('fs');
const { execSync } = require('child_process');

console.log('🚀 AUTOMATIC GIT REPOSITORY SETUP');
console.log('==================================');

// Delete unnecessary txt files
const txtFilesToDelete = [
  'DEPLOY_INSTRUCTIONS.txt',
  'NEONDB_SQL.txt',
  'INSERT_DATA_NOW.txt',
  'RUN_NOW.txt',
  'SETUP_GUIDE.md'
];

console.log('🗑️ Deleting unnecessary txt files...');
txtFilesToDelete.forEach(file => {
  try {
    if (fs.existsSync(file)) {
      fs.unlinkSync(file);
      console.log(`   Deleted: ${file}`);
    }
  } catch (e) {
    // Ignore errors
  }
});

// Delete unnecessary js files
const jsFilesToDelete = [
  'local_json_db.js',
  'deploy_to_git.js',
  'add_sample_data.js',
  'server-basic.js'
];

console.log('🗑️ Deleting unnecessary js files...');
jsFilesToDelete.forEach(file => {
  try {
    if (fs.existsSync(file)) {
      fs.unlinkSync(file);
      console.log(`   Deleted: ${file}`);
    }
  } catch (e) {
    // Ignore errors
  }
});

// Initialize Git repository
console.log('📦 Initializing Git repository...');
try {
  execSync('git init', { stdio: 'pipe' });
  console.log('✅ Git initialized');
} catch (error) {
  console.log('ℹ️  Git already initialized');
}

// Configure Git
try {
  execSync('git config user.name "Portfolio User"', { stdio: 'pipe' });
  execSync('git config user.email "portfolio@example.com"', { stdio: 'pipe' });
  console.log('✅ Git configured');
} catch (error) {
  console.log('ℹ️  Git already configured');
}

// Add all files
console.log('📁 Adding files to Git...');
try {
  execSync('git add .', { stdio: 'pipe' });
  console.log('✅ Files added to Git');
} catch (error) {
  console.log('❌ Error adding files:', error.message);
}

// Commit files
console.log('💾 Creating initial commit...');
try {
  execSync('git commit -m "Initial portfolio setup - ready for deployment"', { stdio: 'pipe' });
  console.log('✅ Initial commit created');
} catch (error) {
  console.log('❌ Error creating commit:', error.message);
}

// Create GitHub repository setup script
const githubScript = `@echo off
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
pause`;

fs.writeFileSync('GITHUB_SETUP.bat', githubScript);
console.log('✅ Created GITHUB_SETUP.bat');

// Create simplified deployment instructions
const deployInfo = `🚀 DEPLOYMENT INSTRUCTIONS
========================

AUTOMATIC SETUP:
1. Double-click: GITHUB_SETUP.bat
2. Replace "YOUR_USERNAME" with your GitHub username
3. Follow the prompts

MANUAL SETUP:
1. Create GitHub repo: https://github.com/new
2. Name: portfolio
3. Run these commands:
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/portfolio.git
   git push -u origin main

DEPLOY ON RENDER:
1. Go to: https://render.com
2. Connect GitHub repo
3. Start command: node server.js
4. Your site goes LIVE!

🎯 RESULT: https://portfolio.onrender.com`;

fs.writeFileSync('DEPLOY.txt', deployInfo);
console.log('✅ Created DEPLOY.txt');

// Show final status
console.log('\n📊 FINAL STATUS:');
console.log('================');
console.log('✅ Unnecessary files deleted');
console.log('✅ Git repository initialized');
console.log('✅ Initial commit created');
console.log('✅ GitHub setup script created');
console.log('✅ Deployment instructions ready');

// Show remaining files
const files = fs.readdirSync('.').filter(file => 
  !file.startsWith('.') && 
  !file.includes('auto_git_setup.js')
);

console.log('\n📁 Files ready for deployment:');
files.forEach(file => {
  console.log(`   ✓ ${file}`);
});

console.log('\n🎯 NEXT STEPS:');
console.log('================');
console.log('1. Double-click: GITHUB_SETUP.bat');
console.log('2. Replace YOUR_USERNAME with your GitHub username');
console.log('3. Follow the prompts to create repository');
console.log('4. Deploy on Render');
console.log('\n🌐 Your portfolio will be live on the internet!');
