const { execSync } = require('child_process');
const fs = require('fs');

try {
  console.log('Running build...');
  execSync('node scripts/build.js', { stdio: 'inherit', cwd: '/workspace' });
  
  console.log('\nChecking results...');
  
  if (fs.existsSync('/workspace/dist')) {
    console.log('✅ dist directory created');
    
    const files = fs.readdirSync('/workspace/dist', { recursive: true });
    console.log('Files in dist:', files);
    
    if (fs.existsSync('/workspace/dist/index.html')) {
      console.log('✅ index.html exists');
    }
    
    if (fs.existsSync('/workspace/dist/docs/README.html')) {
      console.log('✅ README.html converted');
    }
  } else {
    console.log('❌ dist directory not created');
  }
} catch (error) {
  console.error('Build failed:', error.message);
}