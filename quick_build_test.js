const fs = require('fs');
const { execSync } = require('child_process');

console.log('Testing current build process...');

try {
  // Change to workspace directory and run build
  process.chdir('/workspace');
  
  console.log('Running: node scripts/build.js');
  const output = execSync('node scripts/build.js', { encoding: 'utf8' });
  console.log('Build output:', output);
  
  // Check results
  if (fs.existsSync('dist')) {
    console.log('✅ dist directory created');
    
    // List some key files
    const checkFiles = [
      'dist/index.html',
      'dist/docs/README.html', 
      'dist/docs/setup.html'
    ];
    
    checkFiles.forEach(file => {
      if (fs.existsSync(file)) {
        console.log(`✅ ${file} exists`);
        
        // Check if it has header and sidebar
        const content = fs.readFileSync(file, 'utf8');
        const hasHeader = content.includes('<header class="site-header">');
        const hasSidebar = content.includes('<aside class="sidebar"');
        console.log(`  - Header: ${hasHeader}, Sidebar: ${hasSidebar}`);
      } else {
        console.log(`❌ ${file} missing`);
      }
    });
  } else {
    console.log('❌ dist directory not created');
  }
  
} catch (error) {
  console.error('❌ Build failed:', error.message);
  if (error.stdout) console.log('stdout:', error.stdout.toString());
  if (error.stderr) console.log('stderr:', error.stderr.toString());
}