// Quick verification of the URL generation fix (updated for absolute paths)
const { getPageUrl } = require('../scripts/sidebar');

console.log('🔍 Quick URL Generation Verification (Absolute Paths)\n');

// Mock config for testing
const config = {
  site: {
    baseUrl: '/'
  }
};

// Test the key scenarios with absolute paths
const tests = [
  {
    name: 'Same directory navigation - absolute path',
    current: 'docs/README.md',
    target: { path: 'docs/api-spec.md' },
    expected: '/docs/api-spec.html'
  },
  {
    name: 'Subdirectory to parent - absolute path',
    current: 'docs/setup/environment.md',
    target: { path: 'docs/README.md' },
    expected: '/docs/README.html'
  },
  {
    name: 'Parent to subdirectory - absolute path',
    current: 'docs/README.md',
    target: { path: 'docs/setup/environment.md' },
    expected: '/docs/setup/environment.html'
  },
  {
    name: 'Between subdirectories - absolute path',
    current: 'docs/setup/environment.md',
    target: { path: 'docs/api/endpoints.md' },
    expected: '/docs/api/endpoints.html'
  },
  {
    name: 'Custom baseUrl test',
    current: 'docs/README.md',
    target: { path: 'docs/api-spec.md' },
    expected: '/custom/docs/api-spec.html',
    config: { site: { baseUrl: '/custom/' } }
  }
];

tests.forEach(test => {
  const testConfig = test.config || config;
  const result = getPageUrl(test.target, test.current, testConfig);
  const status = result === test.expected ? '✅' : '❌';
  
  console.log(`${status} ${test.name}`);
  console.log(`   From: ${test.current}`);
  console.log(`   To:   ${test.target.path}`);
  console.log(`   Expected: ${test.expected}`);
  console.log(`   Got:      ${result}`);
  console.log('');
});

console.log('✨ URL generation verification complete!');