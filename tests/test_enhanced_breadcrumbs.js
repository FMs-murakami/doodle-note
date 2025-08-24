#!/usr/bin/env node

/**
 * Test enhanced breadcrumb and sidebar functionality
 */

const path = require('path');
const fs = require('fs-extra');

// Set working directory to project root
process.chdir(path.join(__dirname, '..'));

const { loadConfig, findCategoryPath, getCategoryContents } = require('./scripts/config');
const { generateBreadcrumb, generateCategoryUrl } = require('./scripts/sidebar');

async function testEnhancedBreadcrumbs() {
  console.log('🧪 Testing Enhanced Breadcrumb and Sidebar Features\n');
  
  let testsPassed = 0;
  let totalTests = 0;
  
  function runTest(testName, testFn) {
    totalTests++;
    try {
      console.log(`${totalTests}️⃣ ${testName}...`);
      testFn();
      testsPassed++;
      console.log('✅ PASSED\n');
    } catch (error) {
      console.log(`❌ FAILED: ${error.message}\n`);
    }
  }
  
  try {
    // Load configuration
    const config = await loadConfig();
    
    // Test 1: Category path discovery
    runTest('Category path discovery', () => {
      const testFile = 'docs/test/20230414_mm.md';
      const categoryPath = findCategoryPath(config.pages, testFile);
      
      console.log(`  File: ${testFile}`);
      console.log(`  Path: ${categoryPath.map(p => p.category || p.title).join(' > ')}`);
      
      if (categoryPath.length < 3) {
        throw new Error('Expected hierarchical path with at least 3 levels');
      }
      
      const hasCategory = categoryPath.some(p => p.category === '成果報告会');
      const hasSubcategory = categoryPath.some(p => p.category === 'mm');
      
      if (!hasCategory || !hasSubcategory) {
        throw new Error('Category path missing expected categories');
      }
    });
    
    // Test 2: Category contents extraction
    runTest('Category contents extraction', () => {
      const contents = getCategoryContents(config.pages, ['成果報告会']);
      
      console.log(`  成果報告会 contains:`);
      console.log(`  - ${contents.subcategories.length} subcategories`);
      console.log(`  - ${contents.pages.length} direct pages`);
      
      if (contents.subcategories.length === 0) {
        throw new Error('Expected subcategories in 成果報告会');
      }
      
      const hasMmSubcategory = contents.subcategories.some(s => s.category === 'mm');
      if (!hasMmSubcategory) {
        throw new Error('Expected mm subcategory');
      }
    });
    
    // Test 3: Enhanced breadcrumb generation
    runTest('Enhanced breadcrumb generation', () => {
      const testPage = { 
        path: 'docs/test/20230414_mm.md', 
        title: '2023/04/14' 
      };
      
      const breadcrumb = generateBreadcrumb(testPage, config);
      
      console.log(`  Generated breadcrumb contains hierarchical path`);
      
      if (!breadcrumb.includes('成果報告会')) {
        throw new Error('Breadcrumb missing 成果報告会 category');
      }
      
      if (!breadcrumb.includes('mm')) {
        throw new Error('Breadcrumb missing mm subcategory');
      }
      
      if (!breadcrumb.includes('2023/04/14')) {
        throw new Error('Breadcrumb missing page title');
      }
      
      // Check for proper HTML structure
      if (!breadcrumb.includes('<nav class="breadcrumb"')) {
        throw new Error('Breadcrumb missing proper HTML structure');
      }
    });
    
    // Test 4: Category URL generation
    runTest('Category URL generation', () => {
      const testCases = [
        { path: ['成果報告会'], expected: 'category-成果報告会.html' },
        { path: ['成果報告会', 'mm'], expected: 'category-成果報告会-mm.html' },
        { path: ['開発関連', 'sub'], expected: 'category-開発関連-sub.html' }
      ];
      
      for (const testCase of testCases) {
        const url = generateCategoryUrl(testCase.path, '/');
        console.log(`  ${testCase.path.join(' > ')}: ${url}`);
        
        if (!url.includes('category-')) {
          throw new Error(`URL missing category- prefix: ${url}`);
        }
        
        if (!url.endsWith('.html')) {
          throw new Error(`URL missing .html extension: ${url}`);
        }
      }
    });
    
    // Test 5: Empty category handling
    runTest('Empty category handling', () => {
      const emptyContents = getCategoryContents(config.pages, ['NonExistent']);
      
      console.log(`  Non-existent category handling:`);
      console.log(`  - ${emptyContents.subcategories.length} subcategories`);
      console.log(`  - ${emptyContents.pages.length} pages`);
      
      if (emptyContents.subcategories.length !== 0 || emptyContents.pages.length !== 0) {
        throw new Error('Non-existent category should return empty results');
      }
    });
    
    // Test 6: Root level category contents
    runTest('Root level category contents', () => {
      const rootContents = getCategoryContents(config.pages, []);
      
      console.log(`  Root level contains:`);
      console.log(`  - ${rootContents.subcategories.length} top-level categories`);
      console.log(`  - ${rootContents.pages.length} top-level pages`);
      
      if (rootContents.subcategories.length === 0) {
        throw new Error('Expected top-level categories');
      }
      
      const hasExpectedCategories = rootContents.subcategories.some(s => 
        ['成果報告会', '開発関連', 'API', 'ガイド'].includes(s.category)
      );
      
      if (!hasExpectedCategories) {
        throw new Error('Missing expected top-level categories');
      }
    });
    
    console.log(`\n📊 Test Results: ${testsPassed}/${totalTests} tests passed`);
    
    if (testsPassed === totalTests) {
      console.log('\n🎉 All enhanced breadcrumb tests passed!');
      console.log('\nKey improvements verified:');
      console.log('• ✅ Hierarchical breadcrumb path generation');
      console.log('• ✅ Category content extraction');
      console.log('• ✅ Category URL generation');
      console.log('• ✅ Empty category handling');
      console.log('• ✅ Root level navigation');
      return true;
    } else {
      console.log('\n❌ Some tests failed. Please check the implementation.');
      return false;
    }
    
  } catch (error) {
    console.error('\n❌ Test suite failed:', error.message);
    if (error.stack) {
      console.error('Stack trace:', error.stack);
    }
    return false;
  }
}

// Run tests if called directly
if (require.main === module) {
  testEnhancedBreadcrumbs().then(success => {
    process.exit(success ? 0 : 1);
  });
}

module.exports = { testEnhancedBreadcrumbs };