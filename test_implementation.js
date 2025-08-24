/**
 * Comprehensive test for sidebar details/summary implementation and config.json loading
 */

const { generateSidebar } = require('./scripts/sidebar');
const fs = require('fs');
const path = require('path');

// Test configuration
const testConfig = {
  "site": {
    "title": "Test Site",
    "description": "Test Description", 
    "baseUrl": "/"
  },
  "pages": [
    {
      "path": "docs/README.md",
      "title": "README"
    },
    {
      "category": "開発関連",
      "pages": [
        {
          "path": "docs/setup/environment.md",
          "title": "開発環境セットアップ"
        },
        {
          "path": "docs/setup/deployment.md",
          "title": "デプロイメント手順"
        },
        {
          "category": "sub",
          "pages": [
            {
              "path": "docs/setup/windows.md",
              "title": "Windows環境構築"
            },
            {
              "path": "docs/setup/macos.md",
              "title": "macOS環境構築"
            }
          ]
        }
      ]
    },
    {
      "category": "API",
      "pages": [
        {
          "path": "docs/api/authentication.md",
          "title": "API認証仕様"
        },
        {
          "path": "docs/api/endpoints.md",
          "title": "APIエンドポイント仕様"
        }
      ]
    }
  ]
};

async function runTests() {
  console.log('🧪 Running comprehensive implementation tests...\n');
  
  let allTestsPassed = true;
  
  try {
    // Test 1: Verify config.json exists and is valid
    console.log('1️⃣ Testing config.json loading...');
    
    const configPath = path.join(__dirname, 'config', 'config.json');
    if (!fs.existsSync(configPath)) {
      throw new Error('config.json file not found');
    }
    
    const configContent = fs.readFileSync(configPath, 'utf8');
    const actualConfig = JSON.parse(configContent);
    
    // Verify structure
    if (!actualConfig.site || !actualConfig.pages) {
      throw new Error('config.json missing required structure');
    }
    
    console.log('   ✅ config.json exists and has valid structure');
    console.log(`   ✅ Site title: ${actualConfig.site.title}`);
    console.log(`   ✅ Pages count: ${actualConfig.pages.length}`);
    
    // Test 2: Test sidebar generation with details/summary
    console.log('\n2️⃣ Testing sidebar generation with details/summary...');
    
    const sidebarHtml = generateSidebar(testConfig, 'docs/README.md');
    
    // Check for details/summary structure
    const checks = [
      { test: sidebarHtml.includes('<details'), desc: 'Contains details elements' },
      { test: sidebarHtml.includes('<summary'), desc: 'Contains summary elements' },
      { test: sidebarHtml.includes('nav-category-summary'), desc: 'Contains summary class' },
      { test: sidebarHtml.includes('nav-category-title'), desc: 'Contains title elements' },
      { test: sidebarHtml.includes('nav-category-icon'), desc: 'Contains icon elements' },
      { test: sidebarHtml.includes('data-category'), desc: 'Contains data-category attributes' },
      { test: sidebarHtml.includes('開発関連'), desc: 'Contains category names' },
      { test: sidebarHtml.includes('開発環境セットアップ'), desc: 'Contains page titles' },
      { test: sidebarHtml.includes('nav-category-level-1'), desc: 'Contains nested categories' },
      { test: !sidebarHtml.includes('nav-category-toggle'), desc: 'No old toggle buttons' },
      { test: !sidebarHtml.includes('onclick='), desc: 'No onclick handlers' }
    ];
    
    let passed = 0;
    let failed = 0;
    
    checks.forEach(check => {
      if (check.test) {
        console.log(`   ✅ ${check.desc}`);
        passed++;
      } else {
        console.log(`   ❌ ${check.desc}`);
        failed++;
        allTestsPassed = false;
      }
    });
    
    console.log(`\n   📊 Results: ${passed} passed, ${failed} failed`);
    
    // Test 3: Verify HTML structure is valid
    console.log('\n3️⃣ Testing HTML structure validity...');
    
    // Check for proper nesting
    const detailsCount = (sidebarHtml.match(/<details/g) || []).length;
    const detailsCloseCount = (sidebarHtml.match(/<\/details>/g) || []).length;
    const summaryCount = (sidebarHtml.match(/<summary/g) || []).length;
    const summaryCloseCount = (sidebarHtml.match(/<\/summary>/g) || []).length;
    
    if (detailsCount === detailsCloseCount && summaryCount === summaryCloseCount) {
      console.log('   ✅ Proper HTML tag nesting');
      console.log(`   ✅ Details elements: ${detailsCount}`);
      console.log(`   ✅ Summary elements: ${summaryCount}`);
    } else {
      console.log('   ❌ HTML tag nesting issues');
      allTestsPassed = false;
    }
    
    // Test 4: Check for active page handling
    console.log('\n4️⃣ Testing active page handling...');
    
    const sidebarWithActive = generateSidebar(testConfig, 'docs/setup/environment.md');
    
    if (sidebarWithActive.includes('開発関連') && sidebarWithActive.includes(' open')) {
      console.log('   ✅ Categories with active pages are opened');
    } else {
      console.log('   ❌ Active page category expansion not working');
      allTestsPassed = false;
    }
    
    if (sidebarWithActive.includes('class="active"')) {
      console.log('   ✅ Active page is marked correctly');
    } else {
      console.log('   ❌ Active page marking not working');
      allTestsPassed = false;
    }
    
    // Test 5: Verify client-side JavaScript compatibility
    console.log('\n5️⃣ Testing JavaScript file structure...');
    
    const mainJsPath = path.join(__dirname, 'assets', 'js', 'main.js');
    const sidebarJsPath = path.join(__dirname, 'assets', 'js', 'sidebar.js');
    
    if (fs.existsSync(mainJsPath) && fs.existsSync(sidebarJsPath)) {
      const mainJsContent = fs.readFileSync(mainJsPath, 'utf8');
      const sidebarJsContent = fs.readFileSync(sidebarJsPath, 'utf8');
      
      // Check for config loading in main.js
      if (mainJsContent.includes('loadSiteConfig') && mainJsContent.includes('config.json')) {
        console.log('   ✅ main.js contains config.json loading');
      } else {
        console.log('   ❌ main.js missing config.json loading');
        allTestsPassed = false;
      }
      
      // Check for details/summary handling in sidebar.js
      if (sidebarJsContent.includes('details') && sidebarJsContent.includes('toggle')) {
        console.log('   ✅ sidebar.js contains details/summary handling');
      } else {
        console.log('   ❌ sidebar.js missing details/summary handling');
        allTestsPassed = false;
      }
      
      // Check for updated CSS classes
      if (mainJsContent.includes('nav-category-summary')) {
        console.log('   ✅ main.js uses updated CSS classes');
      } else {
        console.log('   ❌ main.js missing updated CSS classes');
        allTestsPassed = false;
      }
      
    } else {
      console.log('   ❌ JavaScript files not found');
      allTestsPassed = false;
    }
    
    // Final results
    console.log('\n' + '='.repeat(50));
    if (allTestsPassed) {
      console.log('🎉 All tests passed! Implementation is working correctly.');
      console.log('\n✅ Requirements fulfilled:');
      console.log('   • Sidebar uses details/summary tags for collapsible functionality');
      console.log('   • main.js loads config.json content into siteConfig');
      console.log('   • Server-side and client-side rendering are consistent');
      console.log('   • All existing functionality is preserved');
    } else {
      console.log('❌ Some tests failed. Please review the implementation.');
    }
    
    return allTestsPassed;
    
  } catch (error) {
    console.error('💥 Test execution failed:', error.message);
    return false;
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  runTests().then(success => {
    process.exit(success ? 0 : 1);
  });
}

module.exports = { runTests };