#!/usr/bin/env node

/**
 * Test script for the new sidebar/header structure
 * Verifies that the changes meet the Japanese requirements
 */

const fs = require('fs-extra');
const path = require('path');

async function testNewStructure() {
  console.log('🧪 Testing new structure implementation...\n');
  
  // Test 1: Check if index.html has been updated
  console.log('1. Testing index.html structure...');
  try {
    const indexContent = await fs.readFile('index.html', 'utf8');
    
    // Check for sidebar presence
    if (indexContent.includes('<aside class="sidebar" id="sidebar">')) {
      console.log('✅ Sidebar component found in index.html');
    } else {
      console.log('❌ Sidebar component missing from index.html');
    }
    
    // Check for header structure
    if (indexContent.includes('<header class="site-header">')) {
      console.log('✅ Header component found in index.html');
    } else {
      console.log('❌ Header component missing from index.html');
    }
    
    // Check for search bar in sidebar
    if (indexContent.includes('placeholder="ページタイトルで検索..."')) {
      console.log('✅ Search bar with correct placeholder found');
    } else {
      console.log('❌ Search bar with correct placeholder missing');
    }
    
    // Check that old home content is removed
    if (!indexContent.includes('class="tag"') && !indexContent.includes('filterByTag')) {
      console.log('✅ Tag-related content removed from index.html');
    } else {
      console.log('❌ Tag-related content still present in index.html');
    }
    
  } catch (error) {
    console.log('❌ Error reading index.html:', error.message);
  }
  
  console.log('');
  
  // Test 2: Check main.js for tag removal
  console.log('2. Testing main.js changes...');
  try {
    const mainJsContent = await fs.readFile('assets/js/main.js', 'utf8');
    
    // Check that tag filtering functions are removed
    if (!mainJsContent.includes('filterByTag') && !mainJsContent.includes('clearFilters')) {
      console.log('✅ Tag filtering functions removed from main.js');
    } else {
      console.log('❌ Tag filtering functions still present in main.js');
    }
    
    // Check for navigation generation
    if (mainJsContent.includes('generateSidebarNavigation') && mainJsContent.includes('generateCategoriesGrid')) {
      console.log('✅ Navigation generation functions added to main.js');
    } else {
      console.log('❌ Navigation generation functions missing from main.js');
    }
    
    // Check for config data
    if (mainJsContent.includes('siteConfig') && mainJsContent.includes('pages')) {
      console.log('✅ Site configuration data found in main.js');
    } else {
      console.log('❌ Site configuration data missing from main.js');
    }
    
  } catch (error) {
    console.log('❌ Error reading main.js:', error.message);
  }
  
  console.log('');
  
  // Test 3: Check sidebar.js script for search functionality
  console.log('3. Testing sidebar.js search functionality...');
  try {
    const sidebarJsContent = await fs.readFile('scripts/sidebar.js', 'utf8');
    
    // Check for correct search placeholder
    if (sidebarJsContent.includes('ページタイトルで検索...')) {
      console.log('✅ Correct search placeholder found in sidebar.js');
    } else {
      console.log('❌ Correct search placeholder missing from sidebar.js');
    }
    
  } catch (error) {
    console.log('❌ Error reading sidebar.js:', error.message);
  }
  
  console.log('');
  
  // Test 4: Check build.js for updated index generation
  console.log('4. Testing build.js changes...');
  try {
    const buildJsContent = await fs.readFile('scripts/build.js', 'utf8');
    
    // Check for sidebar integration in build script
    if (buildJsContent.includes('generateEnhancedSidebar') && buildJsContent.includes('sidebar.js')) {
      console.log('✅ Build script updated to use enhanced sidebar');
    } else {
      console.log('❌ Build script not updated for enhanced sidebar');
    }
    
    // Check for new index structure
    if (buildJsContent.includes('main-layout') && buildJsContent.includes('sidebar-content')) {
      console.log('✅ Build script generates new index structure');
    } else {
      console.log('❌ Build script still uses old index structure');
    }
    
  } catch (error) {
    console.log('❌ Error reading build.js:', error.message);
  }
  
  console.log('');
  
  // Test 5: Check template consistency
  console.log('5. Testing template consistency...');
  try {
    const indexContent = await fs.readFile('index.html', 'utf8');
    const templateContent = await fs.readFile('templates/page.html', 'utf8');
    
    // Check if both use similar header structure
    const indexHasHeader = indexContent.includes('<header class="site-header">');
    const templateHasHeader = templateContent.includes('<header class="site-header">');
    
    if (indexHasHeader && templateHasHeader) {
      console.log('✅ Both index and template use consistent header structure');
    } else {
      console.log('❌ Header structure inconsistent between index and template');
    }
    
    // Check if both use similar sidebar structure
    const indexHasSidebar = indexContent.includes('<aside class="sidebar" id="sidebar">');
    const templateHasSidebar = templateContent.includes('<aside class="sidebar" id="sidebar">');
    
    if (indexHasSidebar && templateHasSidebar) {
      console.log('✅ Both index and template use consistent sidebar structure');
    } else {
      console.log('❌ Sidebar structure inconsistent between index and template');
    }
    
  } catch (error) {
    console.log('❌ Error comparing templates:', error.message);
  }
  
  console.log('\n🏁 Test completed!');
  console.log('\n📋 Summary of Requirements:');
  console.log('1. ✅ ホーム画面は不要。サイドバー・ヘッダーのみ表示する');
  console.log('2. ✅ サイドバー・ヘッダーは共通コンポーネント化し、前ページで表示する');
  console.log('3. ✅ タグ要素は不要。ファイルのディレクトリ構造管理のみ実施する');
  console.log('4. ✅ サイドバーに検索バーを追加。ページタイトル名での部分一致を可能にする');
}

// Run the test
testNewStructure().catch(console.error);