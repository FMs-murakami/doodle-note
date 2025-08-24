#!/usr/bin/env node

/**
 * Test that the build process works with absolute paths
 */

const fs = require('fs-extra');
const path = require('path');
const { loadConfig } = require('./scripts/config');
const { generateEnhancedSidebar } = require('./scripts/sidebar');

async function testBuildIntegration() {
  console.log('🧪 Testing build integration with absolute paths...\n');
  
  try {
    // Load actual config
    console.log('1. Loading configuration...');
    const config = await loadConfig();
    console.log('✅ Configuration loaded successfully');
    
    // Test sidebar generation
    console.log('\n2. Testing sidebar generation...');
    const sidebarHtml = generateEnhancedSidebar(config, null, true);
    
    // Check that sidebar contains absolute paths
    const hasAbsolutePaths = sidebarHtml.includes('href="/docs/') || sidebarHtml.includes('href="/');
    console.log(`✅ Sidebar generated with ${hasAbsolutePaths ? 'absolute' : 'relative'} paths`);
    
    // Test specific pages from config
    console.log('\n3. Testing specific pages...');
    const tests = [
      {
        description: 'README page has absolute path',
        check: () => sidebarHtml.includes('/docs/README.html')
      },
      {
        description: 'Setup pages have absolute paths',
        check: () => sidebarHtml.includes('/docs/setup/') && sidebarHtml.includes('.html')
      },
      {
        description: 'API pages have absolute paths',
        check: () => sidebarHtml.includes('/docs/api/') && sidebarHtml.includes('.html')
      },
      {
        description: 'No relative paths (../) in sidebar',
        check: () => !sidebarHtml.includes('../')
      },
      {
        description: 'Search functionality is included',
        check: () => sidebarHtml.includes('search-input') && sidebarHtml.includes('search-results')
      }
    ];
    
    let allPassed = true;
    
    tests.forEach((test, index) => {
      const passed = test.check();
      
      if (!passed) {
        allPassed = false;
      }
      
      console.log(`  Test ${index + 1}: ${test.description}`);
      console.log(`    Status: ${passed ? '✅ PASS' : '❌ FAIL'}`);
    });
    
    console.log(`\n4. Overall result: ${allPassed ? '🎉 ALL TESTS PASSED' : '❌ SOME TESTS FAILED'}`);
    
    // Show sample of generated HTML
    console.log('\n5. Sample of generated sidebar HTML:');
    console.log('='.repeat(50));
    const lines = sidebarHtml.split('\n');
    const sampleLines = lines.slice(0, 20).join('\n');
    console.log(sampleLines);
    if (lines.length > 20) {
      console.log('... (truncated)');
    }
    console.log('='.repeat(50));
    
    return allPassed;
    
  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
    return false;
  }
}

// Run the test
if (require.main === module) {
  testBuildIntegration().then(success => {
    process.exit(success ? 0 : 1);
  });
}

module.exports = { testBuildIntegration };