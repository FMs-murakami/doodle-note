// Test URL generation
const { getPageUrl } = require('../scripts/sidebar');

// Test cases
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
  // Additional test cases for the specific issues mentioned in the request
  {
    description: 'Windows setup from same directory (should not duplicate paths)',
    currentPage: 'docs/setup/environment.md',
    targetPage: { path: 'docs/setup/windows.md' },
    expected: 'windows.html'
  },
  {
    description: 'Windows setup from docs root (should not duplicate paths)',
    currentPage: 'docs/README.md',
    targetPage: { path: 'docs/setup/windows.md' },
    expected: 'setup/windows.html'
  },
  {
    description: 'macOS setup from Windows setup (same directory)',
    currentPage: 'docs/setup/windows.md',
    targetPage: { path: 'docs/setup/macos.md' },
    expected: 'macos.html'
  }
];

console.log('Testing URL generation...\n');

let allPassed = true;

testCases.forEach((testCase, index) => {
  const result = getPageUrl(testCase.targetPage, testCase.currentPage);
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