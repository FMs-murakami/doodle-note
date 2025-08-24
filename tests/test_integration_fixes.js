/**
 * Integration test for the documentation site fixes
 * Tests the complete build process with the new changes
 */

const fs = require('fs-extra');
const path = require('path');
const { build } = require('../scripts/build');

/**
 * Test the complete build process
 */
async function testBuildProcess() {
  console.log('🔨 Testing build process with fixes...');
  
  const testOutputDir = path.join(__dirname, '..', 'test-dist');
  
  try {
    // Set test output directory
    process.env.OUTPUT_DIR = testOutputDir;
    
    // Clean up any existing test output
    if (await fs.pathExists(testOutputDir)) {
      await fs.remove(testOutputDir);
    }
    
    // Run the build process
    console.log('  Running build...');
    await build();
    
    // Verify build outputs
    console.log('  Verifying build outputs...');
    
    const checks = [
      {
        path: path.join(testOutputDir, 'index.html'),
        desc: 'Index page generated',
        contentChecks: [
          { test: (content) => !content.includes('<h1 class="page-title">'), desc: 'No page title in index' },
          { test: (content) => content.includes('id="navigation"'), desc: 'Navigation container present' }
        ]
      },
      {
        path: path.join(testOutputDir, 'assets', 'css', 'style.css'),
        desc: 'CSS copied with table alignment',
        contentChecks: [
          { test: (content) => content.includes('.text-center'), desc: 'Table alignment CSS present' }
        ]
      },
      {
        path: path.join(testOutputDir, 'assets', 'js', 'main.js'),
        desc: 'Main JS copied',
        contentChecks: [
          { test: (content) => content.includes('loadSiteConfig'), desc: 'Config loading function present' }
        ]
      },
      {
        path: path.join(testOutputDir, 'assets', 'js', 'sidebar.js'),
        desc: 'Sidebar JS copied',
        contentChecks: [
          { test: (content) => content.includes('SidebarManager'), desc: 'SidebarManager class present' }
        ]
      },
      {
        path: path.join(testOutputDir, 'config', 'config.json'),
        desc: 'Config copied for client-side loading',
        contentChecks: []
      },
      {
        path: path.join(testOutputDir, 'docs', 'sample01.png'),
        desc: 'Sample image copied',
        contentChecks: []
      },
      {
        path: path.join(testOutputDir, 'docs', 'README.html'),
        desc: 'README page generated',
        contentChecks: [
          { test: (content) => !content.includes('<h1 class="page-title">'), desc: 'No page title header' },
          { test: (content) => content.includes('docs/sample01.png'), desc: 'Image path resolved correctly' },
          { test: (content) => content.includes('class="text-'), desc: 'Table alignment classes applied' }
        ]
      }
    ];
    
    let passed = 0;
    let failed = 0;
    
    for (const check of checks) {
      if (await fs.pathExists(check.path)) {
        console.log(`    ✅ ${check.desc}`);
        passed++;
        
        // Run content checks if any
        if (check.contentChecks && check.contentChecks.length > 0) {
          try {
            const content = await fs.readFile(check.path, 'utf8');
            
            for (const contentCheck of check.contentChecks) {
              if (contentCheck.test(content)) {
                console.log(`      ✅ ${contentCheck.desc}`);
              } else {
                console.log(`      ❌ ${contentCheck.desc}`);
                failed++;
              }
            }
          } catch (error) {
            console.log(`      ❌ Failed to read file for content checks: ${error.message}`);
            failed++;
          }
        }
      } else {
        console.log(`    ❌ ${check.desc} - File not found: ${check.path}`);
        failed++;
      }
    }
    
    console.log(`\n  Build test results: ${passed} passed, ${failed} failed`);
    
    // Clean up test output
    if (await fs.pathExists(testOutputDir)) {
      await fs.remove(testOutputDir);
    }
    
    return failed === 0;
    
  } catch (error) {
    console.error('  Build process test FAILED:', error.message);
    
    // Clean up test output on error
    if (await fs.pathExists(testOutputDir)) {
      await fs.remove(testOutputDir);
    }
    
    return false;
  } finally {
    // Reset output directory
    delete process.env.OUTPUT_DIR;
  }
}

/**
 * Test specific markdown processing
 */
async function testMarkdownProcessing() {
  console.log('📝 Testing markdown processing...');
  
  try {
    const { convertMarkdownToHtml } = require('../scripts/markdown');
    
    // Test markdown with image and table
    const testMarkdown = `# Test Page

## Image Test
![Test Image](./sample01.png)

## Table Test
| Left | Center | Right |
|:-----|:------:|------:|
| L1   |   C1   |    R1 |
| L2   |   C2   |    R2 |
`;
    
    const result = await convertMarkdownToHtml(testMarkdown, 'docs/test.md');
    
    const checks = [
      { test: result.html.includes('src="docs/sample01.png"'), desc: 'Image path resolved correctly' },
      { test: result.html.includes('loading="lazy"'), desc: 'Lazy loading added to images' },
      { test: result.html.includes('class="text-left"'), desc: 'Left alignment class added' },
      { test: result.html.includes('class="text-center"'), desc: 'Center alignment class added' },
      { test: result.html.includes('class="text-right"'), desc: 'Right alignment class added' }
    ];
    
    let passed = 0;
    let failed = 0;
    
    checks.forEach((check) => {
      if (check.test) {
        console.log(`  ✅ ${check.desc}`);
        passed++;
      } else {
        console.log(`  ❌ ${check.desc}`);
        failed++;
      }
    });
    
    console.log(`  Markdown processing results: ${passed} passed, ${failed} failed\n`);
    return failed === 0;
    
  } catch (error) {
    console.error('  Markdown processing test FAILED:', error.message);
    return false;
  }
}

/**
 * Run all integration tests
 */
async function runIntegrationTests() {
  console.log('🧪 Running integration tests for documentation site fixes...\n');
  
  const tests = [
    testMarkdownProcessing,
    testBuildProcess
  ];
  
  let totalPassed = 0;
  let totalFailed = 0;
  
  for (const test of tests) {
    const result = await test();
    if (result) {
      totalPassed++;
    } else {
      totalFailed++;
    }
  }
  
  console.log(`🎉 Integration Test Summary: ${totalPassed} test suites passed, ${totalFailed} failed`);
  
  if (totalFailed === 0) {
    console.log('✅ All integration tests passed! The build process works correctly with the fixes.');
  } else {
    console.log('❌ Some integration tests failed. Please review the issues above.');
  }
  
  return totalFailed === 0;
}

// Run tests if this file is executed directly
if (require.main === module) {
  runIntegrationTests().catch(console.error);
}

module.exports = {
  runIntegrationTests,
  testBuildProcess,
  testMarkdownProcessing
};