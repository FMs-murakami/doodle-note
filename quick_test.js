// Quick verification of the URL generation fix
const { getPageUrl } = require('./scripts/sidebar');

console.log('🔍 Quick URL Generation Verification\n');

// Test the key scenarios mentioned in the issue
const tests = [
  {
    name: 'Same directory navigation',
    current: 'docs/README.md',
    target: { path: 'docs/api-spec.md' },
    expected: 'api-spec.html'
  },
  {
    name: 'Subdirectory to parent',
    current: 'docs/setup/environment.md',
    target: { path: 'docs/README.md' },
    expected: '../README.html'
  },
  {
    name: 'Parent to subdirectory',
    current: 'docs/README.md',
    target: { path: 'docs/setup/environment.md' },
    expected: 'setup/environment.html'
  },
  {
    name: 'Between subdirectories',
    current: 'docs/setup/environment.md',
    target: { path: 'docs/api/endpoints.md' },
    expected: '../api/endpoints.html'
  }
];

tests.forEach(test => {
  const result = getPageUrl(test.target, test.current);
  const status = result === test.expected ? '✅' : '❌';
  
  console.log(`${status} ${test.name}`);
  console.log(`   From: ${test.current}`);
  console.log(`   To:   ${test.target.path}`);
  console.log(`   Expected: ${test.expected}`);
  console.log(`   Got:      ${result}`);
  console.log('');
});

console.log('✨ URL generation verification complete!');