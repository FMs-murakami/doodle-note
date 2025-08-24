#!/usr/bin/env node

/**
 * Test that config.yaml changes are automatically reflected in the sidebar
 */

const { generateSidebar } = require('./scripts/sidebar');

// Mock config with test pages
const testConfig = {
  site: {
    title: 'Test Site',
    baseUrl: '/'
  },
  pages: [
    {
      path: 'docs/README.md',
      title: 'README'
    },
    {
      category: 'テストカテゴリ',
      pages: [
        {
          path: 'docs/test/new-page.md',
          title: '新しいページ'
        },
        {
          path: 'docs/test/another-page.md',
          title: 'もう一つのページ'
        }
      ]
    },
    {
      category: 'API',
      pages: [
        {
          path: 'docs/api/authentication.md',
          title: 'API認証仕様'
        }
      ]
    }
  ]
};

console.log('🧪 Testing config.yaml integration...\n');

// Generate sidebar HTML
const sidebarHtml = generateSidebar(testConfig, null);

console.log('Generated sidebar HTML:');
console.log('='.repeat(50));
console.log(sidebarHtml);
console.log('='.repeat(50));

// Test that all pages are included
const tests = [
  {
    description: 'README page is included',
    check: () => sidebarHtml.includes('README') && sidebarHtml.includes('/docs/README.html')
  },
  {
    description: 'Test category is included',
    check: () => sidebarHtml.includes('テストカテゴリ')
  },
  {
    description: 'New page is included with absolute path',
    check: () => sidebarHtml.includes('新しいページ') && sidebarHtml.includes('/docs/test/new-page.html')
  },
  {
    description: 'Another page is included with absolute path',
    check: () => sidebarHtml.includes('もう一つのページ') && sidebarHtml.includes('/docs/test/another-page.html')
  },
  {
    description: 'API category is included',
    check: () => sidebarHtml.includes('API')
  },
  {
    description: 'API authentication page is included with absolute path',
    check: () => sidebarHtml.includes('API認証仕様') && sidebarHtml.includes('/docs/api/authentication.html')
  },
  {
    description: 'Sidebar has proper navigation structure',
    check: () => sidebarHtml.includes('<nav class="sidebar-nav"') && sidebarHtml.includes('</nav>')
  },
  {
    description: 'Categories use details/summary structure',
    check: () => sidebarHtml.includes('<details class="nav-category"') && sidebarHtml.includes('<summary class="nav-category-summary">')
  }
];

let allPassed = true;

tests.forEach((test, index) => {
  const passed = test.check();
  
  if (!passed) {
    allPassed = false;
  }
  
  console.log(`Test ${index + 1}: ${test.description}`);
  console.log(`  Status: ${passed ? '✅ PASS' : '❌ FAIL'}\n`);
});

console.log(`Overall: ${allPassed ? '🎉 ALL TESTS PASSED' : '❌ SOME TESTS FAILED'}`);

if (!allPassed) {
  process.exit(1);
}