// Final comprehensive test for markdown link conversion
const { build } = require('./scripts/build');
const { convertMarkdownToHtml } = require('./scripts/markdown');
const fs = require('fs-extra');

async function testFinal() {
  console.log('🧪 Final comprehensive test for markdown link conversion...\n');
  
  try {
    // Test 1: Direct function test
    console.log('1. Testing convertMarkdownToHtml function directly...');
    
    const testMarkdown = `
## 関連ドキュメント

- [APIエンドポイント仕様](endpoints.md)
- [セキュリティガイドライン](../guides/security.md)
- [トラブルシューティング](../guides/troubleshooting.md)
- [外部リンク](https://example.com)
- [画像ファイル](../images/diagram.png)
`;
    
    const result = await convertMarkdownToHtml(testMarkdown, 'docs/api/authentication.md');
    console.log('Generated HTML:');
    console.log(result.html);
    
    // Check for expected conversions
    const checks = [
      { pattern: 'href="endpoints.html"', description: 'Same directory .md → .html' },
      { pattern: 'href="../guides/security.html"', description: 'Parent directory .md → .html' },
      { pattern: 'href="../guides/troubleshooting.html"', description: 'Parent directory .md → .html' },
      { pattern: 'href="https://example.com"', description: 'External URL unchanged' },
      { pattern: 'href="../images/diagram.png"', description: 'Non-markdown file unchanged' }
    ];
    
    let directTestPassed = true;
    checks.forEach(check => {
      const found = result.html.includes(check.pattern);
      console.log(`  ${found ? '✅' : '❌'} ${check.description}`);
      if (!found) directTestPassed = false;
    });
    
    console.log(`\nDirect function test: ${directTestPassed ? '✅ PASSED' : '❌ FAILED'}\n`);
    
    // Test 2: Build process test
    console.log('2. Testing full build process...');
    
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
      
      console.log('Checking converted links in built authentication.html...');
      
      const buildChecks = [
        { pattern: 'href="endpoints.html"', description: 'Same directory link converted' },
        { pattern: 'href="../guides/security.html"', description: 'Parent directory link converted' },
        { pattern: 'href="../guides/troubleshooting.html"', description: 'Parent directory link converted' }
      ];
      
      let buildTestPassed = true;
      buildChecks.forEach(check => {
        const found = content.includes(check.pattern);
        console.log(`  ${found ? '✅' : '❌'} ${check.description}`);
        if (!found) buildTestPassed = false;
      });
      
      console.log(`\nBuild process test: ${buildTestPassed ? '✅ PASSED' : '❌ FAILED'}\n`);
      
      // Show relevant section if there are failures
      if (!buildTestPassed) {
        console.log('Generated HTML content (関連ドキュメント section):');
        const relatedDocsMatch = content.match(/<h2[^>]*>関連ドキュメント<\/h2>([\s\S]*?)(?=<h[1-6]|<\/article>|$)/);
        if (relatedDocsMatch) {
          console.log(relatedDocsMatch[0]);
        }
      }
      
      // Overall result
      const overallPassed = directTestPassed && buildTestPassed;
      console.log(`\n🎯 Overall Result: ${overallPassed ? '🎉 ALL TESTS PASSED!' : '❌ SOME TESTS FAILED'}`);
      
      if (overallPassed) {
        console.log('\n✨ Markdown link conversion is working correctly!');
        console.log('   - .md links are converted to .html links');
        console.log('   - Relative paths are preserved');
        console.log('   - External URLs and non-markdown files are unchanged');
      }
      
    } else {
      console.log('❌ Authentication HTML file was not created during build');
    }
    
  } catch (error) {
    console.error('Test failed with error:', error.message);
    console.error(error.stack);
  }
}

testFinal();