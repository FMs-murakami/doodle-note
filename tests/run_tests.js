#!/usr/bin/env node

/**
 * Test runner for URL generation and build process
 */

const fs = require('fs-extra');
const path = require('path');
const { getPageUrl, generateBreadcrumb } = require('../scripts/sidebar');
const { convertMarkdownToHtml } = require('../scripts/markdown');
const { build } = require('../scripts/build');

/**
 * Test markdown link conversion functionality
 */
async function testMarkdownLinkConversion() {
  console.log('🧪 Testing markdown link conversion...\n');
  
  const testCases = [
    {
      description: 'Same directory link',
      currentPage: 'docs/api/authentication.md',
      markdown: '[API Endpoints](endpoints.md)',
      expectedHref: 'endpoints.html'
    },
    {
      description: 'Parent directory link',
      currentPage: 'docs/api/authentication.md',
      markdown: '[Security Guide](../guides/security.md)',
      expectedHref: '../guides/security.html'
    },
    {
      description: 'Nested directory link',
      currentPage: 'docs/README.md',
      markdown: '[Setup Guide](setup/environment.md)',
      expectedHref: 'setup/environment.html'
    },
    {
      description: 'External URL (should not change)',
      currentPage: 'docs/api/authentication.md',
      markdown: '[GitHub](https://github.com/example/repo)',
      expectedHref: 'https://github.com/example/repo'
    },
    {
      description: 'Non-markdown file (should not change)',
      currentPage: 'docs/api/authentication.md',
      markdown: '[Image](../images/diagram.png)',
      expectedHref: '../images/diagram.png'
    }
  ];

  let passed = 0;
  let failed = 0;

  for (const testCase of testCases) {
    try {
      const { html } = await convertMarkdownToHtml(testCase.markdown, testCase.currentPage);
      
      // Extract href from the generated HTML
      const linkMatch = html.match(/<a href="([^"]*)"[^>]*>/);
      
      if (!linkMatch) {
        console.log(`Test: ${testCase.description}`);
        console.log(`  ❌ FAIL - No link found in HTML output`);
        console.log(`  HTML: ${html}\n`);
        failed++;
        continue;
      }
      
      const actualHref = linkMatch[1];
      const isPass = actualHref === testCase.expectedHref;
      
      console.log(`Test: ${testCase.description}`);
      console.log(`  Current page: ${testCase.currentPage}`);
      console.log(`  Markdown: ${testCase.markdown}`);
      console.log(`  Expected href: ${testCase.expectedHref}`);
      console.log(`  Actual href: ${actualHref}`);
      console.log(`  Status: ${isPass ? '✅ PASS' : '❌ FAIL'}\n`);
      
      if (isPass) {
        passed++;
      } else {
        failed++;
      }
      
    } catch (error) {
      console.log(`Test: ${testCase.description}`);
      console.log(`  ❌ FAIL - Error: ${error.message}\n`);
      failed++;
    }
  }

  console.log(`Markdown Link Conversion Tests: ${passed} passed, ${failed} failed\n`);
  return failed === 0;
}

/**
 * Test URL generation functionality
 */
function testUrlGeneration() {
  console.log('🧪 Testing URL generation...\n');
  
  const testCases = [
    {
      description: 'Same directory (docs/)',
      currentPage: 'docs/README.md',
      targetPage: { path: 'docs/api-spec.md' },
      expected: 'api-spec.html'
    },
    {
      description: 'From subdirectory to docs root',
      currentPage: 'docs/setup/environment.md',
      targetPage: { path: 'docs/README.md' },
      expected: '../README.html'
    },
    {
      description: 'From subdirectory to another subdirectory',
      currentPage: 'docs/setup/environment.md',
      targetPage: { path: 'docs/api/endpoints.md' },
      expected: '../api/endpoints.html'
    },
    {
      description: 'From docs root to subdirectory',
      currentPage: 'docs/README.md',
      targetPage: { path: 'docs/setup/environment.md' },
      expected: 'setup/environment.html'
    },
    {
      description: 'No current path (for index pages)',
      currentPage: '',
      targetPage: { path: 'docs/README.md' },
      expected: 'docs/README.html'
    },
    {
      description: 'Deep subdirectory navigation',
      currentPage: 'docs/setup/windows.md',
      targetPage: { path: 'docs/guides/troubleshooting.md' },
      expected: '../guides/troubleshooting.html'
    }
  ];

  let passed = 0;
  let failed = 0;

  testCases.forEach((testCase, index) => {
    const result = getPageUrl(testCase.targetPage, testCase.currentPage);
    const isPass = result === testCase.expected;
    
    console.log(`Test ${index + 1}: ${testCase.description}`);
    console.log(`  Current: ${testCase.currentPage || '(none)'}`);
    console.log(`  Target:  ${testCase.targetPage.path}`);
    console.log(`  Expected: ${testCase.expected}`);
    console.log(`  Got:      ${result}`);
    console.log(`  Status:   ${isPass ? '✅ PASS' : '❌ FAIL'}\n`);
    
    if (isPass) {
      passed++;
    } else {
      failed++;
    }
  });

  console.log(`URL Generation Tests: ${passed} passed, ${failed} failed\n`);
  return failed === 0;
}

/**
 * Test breadcrumb generation
 */
function testBreadcrumbGeneration() {
  console.log('🧪 Testing breadcrumb generation...\n');
  
  const testCases = [
    {
      description: 'Root level page',
      page: { path: 'docs/README.md', title: 'ドキュメント一覧' },
      expectedIndexPath: '../index.html'
    },
    {
      description: 'Subdirectory page',
      page: { path: 'docs/setup/environment.md', title: '開発環境セットアップ' },
      expectedIndexPath: '../../index.html'
    },
    {
      description: 'Deep subdirectory page',
      page: { path: 'docs/api/authentication.md', title: 'API認証仕様' },
      expectedIndexPath: '../../index.html'
    }
  ];

  let passed = 0;
  let failed = 0;

  testCases.forEach((testCase, index) => {
    const breadcrumbHtml = generateBreadcrumb(testCase.page, { site: { title: 'Test' } });
    const isPass = breadcrumbHtml.includes(`href="${testCase.expectedIndexPath}"`);
    
    console.log(`Breadcrumb Test ${index + 1}: ${testCase.description}`);
    console.log(`  Page: ${testCase.page.path}`);
    console.log(`  Expected index path: ${testCase.expectedIndexPath}`);
    console.log(`  Contains expected path: ${isPass ? '✅ PASS' : '❌ FAIL'}`);
    
    if (!isPass) {
      console.log(`  Generated HTML: ${breadcrumbHtml}`);
    }
    console.log('');
    
    if (isPass) {
      passed++;
    } else {
      failed++;
    }
  });

  console.log(`Breadcrumb Tests: ${passed} passed, ${failed} failed\n`);
  return failed === 0;
}

/**
 * Test build process and verify output structure
 */
async function testBuildProcess() {
  console.log('🧪 Testing build process...\n');
  
  try {
    // Clean up any existing dist directory
    if (await fs.pathExists('dist')) {
      await fs.remove('dist');
    }
    
    // Run build
    console.log('Running build process...');
    await build();
    
    // Verify expected files exist
    const expectedFiles = [
      'dist/index.html',
      'dist/docs/README.html',
      'dist/docs/setup/environment.html',
      'dist/docs/setup/deployment.html',
      'dist/docs/api/authentication.html',
      'dist/docs/api/endpoints.html'
    ];
    
    let allFilesExist = true;
    
    for (const filePath of expectedFiles) {
      const exists = await fs.pathExists(filePath);
      console.log(`  ${exists ? '✅' : '❌'} ${filePath}`);
      if (!exists) {
        allFilesExist = false;
      }
    }
    
    // Check if assets are copied
    const assetExists = await fs.pathExists('dist/assets');
    console.log(`  ${assetExists ? '✅' : '❌'} dist/assets/`);
    
    if (!allFilesExist || !assetExists) {
      console.log('\n❌ Build process test FAILED\n');
      return false;
    }
    
    console.log('\n✅ Build process test PASSED\n');
    return true;
    
  } catch (error) {
    console.error('❌ Build process failed:', error.message);
    return false;
  }
}

/**
 * Main test runner
 */
async function runTests() {
  console.log('🚀 Running comprehensive tests...\n');
  
  // Import enhanced breadcrumb tests
  const { testEnhancedBreadcrumbs } = require('./test_enhanced_breadcrumbs');
  
  const results = {
    urlGeneration: testUrlGeneration(),
    breadcrumbGeneration: testBreadcrumbGeneration(),
    markdownLinkConversion: await testMarkdownLinkConversion(),
    enhancedBreadcrumbs: await testEnhancedBreadcrumbs(),
    buildProcess: await testBuildProcess()
  };
  
  const allPassed = Object.values(results).every(result => result === true);
  
  console.log('📊 Test Summary:');
  console.log(`  URL Generation: ${results.urlGeneration ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`  Breadcrumb Generation: ${results.breadcrumbGeneration ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`  Markdown Link Conversion: ${results.markdownLinkConversion ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`  Enhanced Breadcrumbs: ${results.enhancedBreadcrumbs ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`  Build Process: ${results.buildProcess ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`\n${allPassed ? '🎉 All tests passed!' : '💥 Some tests failed!'}`);
  
  process.exit(allPassed ? 0 : 1);
}

// Run tests if this script is executed directly
if (require.main === module) {
  runTests().catch(error => {
    console.error('Test runner failed:', error);
    process.exit(1);
  });
}

module.exports = { testUrlGeneration, testBreadcrumbGeneration, testMarkdownLinkConversion, testBuildProcess, runTests };