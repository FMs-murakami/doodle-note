const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

try {
  console.log('Running build...');
  const rootDir = path.join(__dirname, '..');
  execSync('node scripts/build.js', { stdio: 'inherit', cwd: rootDir });
  
  console.log('\nChecking results...');
  
  const distPath = path.join(rootDir, 'dist');
  if (fs.existsSync(distPath)) {
    console.log('✅ dist directory created');
    
    const files = fs.readdirSync(distPath, { recursive: true });
    console.log('Files in dist:', files);
    
    if (fs.existsSync(path.join(distPath, 'index.html'))) {
      console.log('✅ index.html exists');
    }
    
    if (fs.existsSync(path.join(distPath, 'docs/README.html'))) {
      console.log('✅ README.html converted');
    }
  } else {
    console.log('❌ dist directory not created');
  }
} catch (error) {
  console.error('Build failed:', error.message);
}