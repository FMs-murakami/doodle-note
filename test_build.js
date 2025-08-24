// Test build to verify markdown link conversion
const { build } = require('./scripts/build');
const fs = require('fs-extra');

async function testBuild() {
  try {
    console.log('Running build to test markdown link conversion...\n');
    
    // Clean up any existing dist directory
    if (await fs.pathExists('dist')) {
      await fs.remove('dist');
    }
    
    // Run build
    await build();
    
    // Check if the authentication.html file was created and contains converted links
    const authFile = 'dist/docs/api/authentication.html';
    if (await fs.pathExists(authFile)) {
      const content = await fs.readFile(authFile, 'utf8');
      
      console.log('Checking converted links in authentication.html...\n');
      
      // Check for converted links
      const checks = [
        {
          description: 'Same directory link (endpoints.md → endpoints.html)',
          pattern: 'href="endpoints.html"',
          found: content.includes('href="endpoints.html"')
        },
        {
          description: 'Parent directory link (../guides/security.md → ../guides/security.html)',
          pattern: 'href="../guides/security.html"',
          found: content.includes('href="../guides/security.html"')
        },
        {
          description: 'Parent directory link (../guides/troubleshooting.md → ../guides/troubleshooting.html)',
          pattern: 'href="../guides/troubleshooting.html"',
          found: content.includes('href="../guides/troubleshooting.html"')
        }
      ];
      
      let allPassed = true;
      
      checks.forEach(check => {
        console.log(`${check.found ? '✅' : '❌'} ${check.description}`);
        if (!check.found) {
          allPassed = false;
        }
      });
      
      if (allPassed) {
        console.log('\n🎉 All markdown links were converted correctly!');
      } else {
        console.log('\n❌ Some markdown links were not converted correctly.');
        console.log('\nGenerated HTML content (relevant section):');
        
        // Find and display the "関連ドキュメント" section
        const relatedDocsMatch = content.match(/<h2[^>]*>関連ドキュメント<\/h2>([\s\S]*?)(?=<h[1-6]|$)/);
        if (relatedDocsMatch) {
          console.log(relatedDocsMatch[0]);
        }
      }
      
    } else {
      console.log('❌ Authentication HTML file was not created');
    }
    
  } catch (error) {
    console.error('Build test failed:', error.message);
  }
}

testBuild();