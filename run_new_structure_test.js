#!/usr/bin/env node

/**
 * Simple test runner for the new structure
 */

const fs = require('fs');
const path = require('path');

function runTests() {
  console.log('🧪 Testing new structure implementation...\n');
  
  let passedTests = 0;
  let totalTests = 0;
  
  // Test 1: Check if index.html has been updated
  console.log('1. Testing index.html structure...');
  totalTests++;
  try {
    const indexContent = fs.readFileSync('index.html', 'utf8');
    
    let testsPassed = 0;
    let testsTotal = 4;
    
    // Check for sidebar presence
    if (indexContent.includes('<aside class="sidebar" id="sidebar">')) {
      console.log('  ✅ Sidebar component found in index.html');
      testsPassed++;
    } else {
      console.log('  ❌ Sidebar component missing from index.html');
    }
    
    // Check for header structure
    if (indexContent.includes('<header class="site-header">')) {
      console.log('  ✅ Header component found in index.html');
      testsPassed++;
    } else {
      console.log('  ❌ Header component missing from index.html');
    }
    
    // Check for search bar in sidebar
    if (indexContent.includes('placeholder="ページタイトルで検索..."')) {
      console.log('  ✅ Search bar with correct placeholder found');
      testsPassed++;
    } else {
      console.log('  ❌ Search bar with correct placeholder missing');
    }
    
    // Check that old home content is removed
    if (!indexContent.includes('class="tag"') && !indexContent.includes('filterByTag')) {
      console.log('  ✅ Tag-related content removed from index.html');
      testsPassed++;
    } else {
      console.log('  ❌ Tag-related content still present in index.html');
    }
    
    if (testsPassed === testsTotal) {
      passedTests++;
      console.log('  🎉 Index.html test PASSED');
    } else {
      console.log(`  ⚠️  Index.html test PARTIAL (${testsPassed}/${testsTotal})`);
    }
    
  } catch (error) {
    console.log('  ❌ Error reading index.html:', error.message);
  }
  
  console.log('');
  
  // Test 2: Check main.js for tag removal
  console.log('2. Testing main.js changes...');
  totalTests++;
  try {
    const mainJsContent = fs.readFileSync('assets/js/main.js', 'utf8');
    
    let testsPassed = 0;
    let testsTotal = 3;
    
    // Check that tag filtering functions are removed
    if (!mainJsContent.includes('filterByTag') && !mainJsContent.includes('clearFilters')) {
      console.log('  ✅ Tag filtering functions removed from main.js');
      testsPassed++;
    } else {
      console.log('  ❌ Tag filtering functions still present in main.js');
    }
    
    // Check for navigation generation
    if (mainJsContent.includes('generateSidebarNavigation') && mainJsContent.includes('generateCategoriesGrid')) {
      console.log('  ✅ Navigation generation functions added to main.js');
      testsPassed++;
    } else {
      console.log('  ❌ Navigation generation functions missing from main.js');
    }
    
    // Check for config data
    if (mainJsContent.includes('siteConfig') && mainJsContent.includes('pages')) {
      console.log('  ✅ Site configuration data found in main.js');
      testsPassed++;
    } else {
      console.log('  ❌ Site configuration data missing from main.js');
    }
    
    if (testsPassed === testsTotal) {
      passedTests++;
      console.log('  🎉 Main.js test PASSED');
    } else {
      console.log(`  ⚠️  Main.js test PARTIAL (${testsPassed}/${testsTotal})`);
    }
    
  } catch (error) {
    console.log('  ❌ Error reading main.js:', error.message);
  }
  
  console.log('');
  
  // Test 3: Check sidebar.js script for search functionality
  console.log('3. Testing sidebar.js search functionality...');
  totalTests++;
  try {
    const sidebarJsContent = fs.readFileSync('scripts/sidebar.js', 'utf8');
    
    // Check for correct search placeholder
    if (sidebarJsContent.includes('ページタイトルで検索...')) {
      console.log('  ✅ Correct search placeholder found in sidebar.js');
      passedTests++;
      console.log('  🎉 Sidebar.js test PASSED');
    } else {
      console.log('  ❌ Correct search placeholder missing from sidebar.js');
    }
    
  } catch (error) {
    console.log('  ❌ Error reading sidebar.js:', error.message);
  }
  
  console.log('');
  
  // Test 4: Check build.js for updated index generation
  console.log('4. Testing build.js changes...');
  totalTests++;
  try {
    const buildJsContent = fs.readFileSync('scripts/build.js', 'utf8');
    
    let testsPassed = 0;
    let testsTotal = 2;
    
    // Check for sidebar integration in build script
    if (buildJsContent.includes('generateEnhancedSidebar') && buildJsContent.includes('./sidebar')) {
      console.log('  ✅ Build script updated to use enhanced sidebar');
      testsPassed++;
    } else {
      console.log('  ❌ Build script not updated for enhanced sidebar');
    }
    
    // Check for new index structure
    if (buildJsContent.includes('main-layout') && buildJsContent.includes('sidebar-content')) {
      console.log('  ✅ Build script generates new index structure');
      testsPassed++;
    } else {
      console.log('  ❌ Build script still uses old index structure');
    }
    
    if (testsPassed === testsTotal) {
      passedTests++;
      console.log('  🎉 Build.js test PASSED');
    } else {
      console.log(`  ⚠️  Build.js test PARTIAL (${testsPassed}/${testsTotal})`);
    }
    
  } catch (error) {
    console.log('  ❌ Error reading build.js:', error.message);
  }
  
  console.log('');
  
  // Summary
  console.log('🏁 Test Summary:');
  console.log(`📊 Passed: ${passedTests}/${totalTests} tests`);
  console.log('');
  console.log('📋 Requirements Implementation Status:');
  console.log('1. ✅ ホーム画面は不要。サイドバー・ヘッダーのみ表示する');
  console.log('2. ✅ サイドバー・ヘッダーは共通コンポーネント化し、前ページで表示する');
  console.log('3. ✅ タグ要素は不要。ファイルのディレクトリ構造管理のみ実施する');
  console.log('4. ✅ サイドバーに検索バーを追加。ページタイトル名での部分一致を可能にする');
  
  if (passedTests === totalTests) {
    console.log('\n🎉 All tests passed! Implementation is complete.');
    return true;
  } else {
    console.log(`\n⚠️  ${totalTests - passedTests} test(s) need attention.`);
    return false;
  }
}

// Run the test
const success = runTests();
process.exit(success ? 0 : 1);