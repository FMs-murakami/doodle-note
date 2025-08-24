// Simple URL generation test
const { getPageUrl } = require('./scripts/sidebar');

console.log('=== Simple URL Generation Test ===\n');

// Test the specific case mentioned in the issue
const testCases = [
  {
    description: 'Windows setup from environment setup (same dir)',
    current: 'docs/setup/environment.md',
    target: { path: 'docs/setup/windows.md' },
  },
  {
    description: 'Windows setup from docs root',
    current: 'docs/README.md',
    target: { path: 'docs/setup/windows.md' },
  },
  {
    description: 'API from setup directory',
    current: 'docs/setup/windows.md',
    target: { path: 'docs/api/endpoints.md' },
  }
];

testCases.forEach((test, i) => {
  const result = getPageUrl(test.target, test.current);
  console.log(`${i + 1}. ${test.description}`);
  console.log(`   Current: ${test.current}`);
  console.log(`   Target:  ${test.target.path}`);
  console.log(`   Result:  ${result}`);
  console.log('');
});

console.log('✅ URL generation test completed');