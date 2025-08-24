// Test URL generation
const { getPageUrl } = require('../scripts/sidebar');

// Mock config object for testing
const mockConfig = {
  site: {
    baseUrl: '/'
  }
};

// Test cases (updated for absolute paths)
const testCases = [
  {
    description: 'Same directory (docs/) - absolute path',
    currentPage: 'docs/README.md',
    targetPage: { path: 'docs/api-spec.md' },
    expected: '/docs/api-spec.html'
  },
  {
    description: 'From subdirectory to docs root - absolute path',
    currentPage: 'docs/setup/environment.md',
    targetPage: { path: 'docs/README.md' },
    expected: '/docs/README.html'
  },
  {
    description: 'From subdirectory to another subdirectory - absolute path',
    currentPage: 'docs/setup/environment.md',
    targetPage: { path: 'docs/api/endpoints.md' },
    expected: '/docs/api/endpoints.html'
  },
  {
    description: 'From docs root to subdirectory - absolute path',
    currentPage: 'docs/README.md',
    targetPage: { path: 'docs/setup/environment.md' },
    expected: '/docs/setup/environment.html'
  },
  {
    description: 'No current path (for index pages) - absolute path',
    currentPage: '',
    targetPage: { path: 'docs/README.md' },
    expected: '/docs/README.html'
  },
  // Additional test cases for the specific issues mentioned in the request
  {
    description: 'Windows setup from same directory - absolute path',
    currentPage: 'docs/setup/environment.md',
    targetPage: { path: 'docs/setup/windows.md' },
    expected: '/docs/setup/windows.html'
  },
  {
    description: 'Windows setup from docs root - absolute path',
    currentPage: 'docs/README.md',
    targetPage: { path: 'docs/setup/windows.md' },
    expected: '/docs/setup/windows.html'
  },
  {
    description: 'macOS setup from Windows setup (same directory) - absolute path',
    currentPage: 'docs/setup/windows.md',
    targetPage: { path: 'docs/setup/macos.md' },
    expected: '/docs/setup/macos.html'
  },
  // Test with custom baseUrl
  {
    description: 'Custom baseUrl test',
    currentPage: 'docs/README.md',
    targetPage: { path: 'docs/api-spec.md' },
    expected: '/custom/docs/api-spec.html',
    config: { site: { baseUrl: '/custom/' } }
  }
];

console.log('Testing URL generation...\n');

let allPassed = true;

testCases.forEach((testCase, index) => {
  const config = testCase.config || mockConfig;
  const result = getPageUrl(testCase.targetPage, testCase.currentPage, config);
  const passed = result === testCase.expected;
  
  if (!passed) {
    allPassed = false;
  }
  
  console.log(`Test ${index + 1}: ${testCase.description}`);
  console.log(`  Current: ${testCase.currentPage || '(none)'}`);
  console.log(`  Target:  ${testCase.targetPage.path}`);
  console.log(`  Expected: ${testCase.expected}`);
  console.log(`  Got:      ${result}`);
  console.log(`  Status:   ${passed ? '✅ PASS' : '❌ FAIL'}\n`);
});

console.log(`Overall result: ${allPassed ? '🎉 ALL TESTS PASSED' : '❌ SOME TESTS FAILED'}`);

// Export for use in other test files
module.exports = { testCases, allPassed };