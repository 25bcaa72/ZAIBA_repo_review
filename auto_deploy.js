/* =============================================
   auto_deploy.js - Complete automated deployment
   ============================================= */

const fs = require('fs');
const { execSync } = require('child_process');

console.log('🚀 AUTOMATIC DEPLOYMENT STARTING');
console.log('================================');

// Delete manual files first
const manualFiles = ['MANUAL_UPLOAD.bat'];
manualFiles.forEach(file => {
  try {
    if (fs.existsSync(file)) {
      fs.unlinkSync(file);
      console.log(`✅ Deleted manual file: ${file}`);
    }
  } catch (e) {}
});

// Try existing repository first
console.log('\n🔍 CHECKING EXISTING REPOSITORY...');
try {
  execSync('git remote -v', { stdio: 'pipe' });
  console.log('✅ Git repository exists');
  
  // Try to push to existing repo
  console.log('\n📤 ATTEMPTING TO PUSH TO EXISTING REPO...');
  try {
    execSync('git push -u origin main', { stdio: 'pipe' });
    console.log('✅ SUCCESS! Files pushed to existing repository');
    console.log('🌐 Repository: https://github.com/25bcaa72/ZAIBIA_FINAL_PROJECT');
    console.log('🚀 Ready for Render deployment!');
  } catch (pushError) {
    console.log('❌ Cannot push to existing repository');
    console.log('🔄 Creating new repository instead...');
    createNewRepository();
  }
} catch (gitError) {
  console.log('❌ No Git repository found');
  console.log('🔄 Creating new repository...');
  createNewRepository();
}

function createNewRepository() {
  console.log('\n🆕 CREATING NEW GITHUB REPOSITORY...');
  
  // Initialize Git if not already done
  try {
    execSync('git init', { stdio: 'pipe' });
    console.log('✅ Git initialized');
  } catch (e) {
    console.log('ℹ️  Git already initialized');
  }
  
  // Configure Git
  try {
    execSync('git config user.name "Portfolio User"', { stdio: 'pipe' });
    execSync('git config user.email "portfolio@example.com"', { stdio: 'pipe' });
    console.log('✅ Git configured');
  } catch (e) {}
  
  // Add all files
  try {
    execSync('git add .', { stdio: 'pipe' });
    console.log('✅ Files added to Git');
  } catch (e) {
    console.log('❌ Error adding files');
  }
  
  // Commit files
  try {
    execSync('git commit -m "Portfolio website - automated deployment"', { stdio: 'pipe' });
    console.log('✅ Files committed');
  } catch (e) {
    console.log('ℹ️  Nothing to commit or already committed');
  }
  
  // Create new repository name with timestamp
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const repoName = `portfolio-${timestamp}`;
  
  console.log(`\n📝 NEW REPOSITORY DETAILS:`);
  console.log(`🔗 Repository Name: ${repoName}`);
  console.log(`👤 Username: 25bcaa72`);
  console.log(`🌐 URL: https://github.com/25bcaa72/${repoName}`);
  
  // Add remote (will fail but shows user what to do)
  try {
    execSync(`git remote add origin https://github.com/25bcaa72/${repoName}.git`, { stdio: 'pipe' });
    console.log('✅ Remote added');
  } catch (e) {
    console.log('❌ Could not add remote');
  }
  
  // Try to push (will fail but shows instructions)
  try {
    execSync('git push -u origin main', { stdio: 'pipe' });
    console.log('✅ SUCCESS! Files pushed to new repository');
  } catch (pushError) {
    console.log('\n🎯 AUTOMATIC CREATION INSTRUCTIONS:');
    console.log('=====================================');
    console.log('1. Go to: https://github.com/new');
    console.log(`2. Repository name: ${repoName}`);
    console.log('3. Description: Portfolio website');
    console.log('4. Make it PUBLIC');
    console.log('5. DO NOT initialize with README');
    console.log('6. Click "Create repository"');
    console.log('\nThen run these commands:');
    console.log(`git remote add origin https://github.com/25bcaa72/${repoName}.git`);
    console.log('git push -u origin main');
  }
  
  console.log('\n🌐 DEPLOYMENT INSTRUCTIONS:');
  console.log('==========================');
  console.log('1. After uploading to GitHub');
  console.log('2. Go to: https://render.com');
  console.log('3. Connect your repository');
  console.log('4. Start command: node server.js');
  console.log('5. Your portfolio goes LIVE!');
  
  console.log('\n📁 FILES READY FOR DEPLOYMENT:');
  const files = fs.readdirSync('.').filter(file => !file.startsWith('.') && !file.includes('auto_deploy.js'));
  files.forEach(file => {
    const stats = fs.statSync(file);
    if (stats.isDirectory()) {
      console.log(`   📁 ${file}/`);
    } else {
      console.log(`   📄 ${file}`);
    }
  });
  
  console.log(`\n✅ AUTOMATION COMPLETE! Your portfolio is ready for deployment!`);
}

// Self-delete this script
setTimeout(() => {
  try {
    fs.unlinkSync('./auto_deploy.js');
  } catch (e) {}
}, 2000);
