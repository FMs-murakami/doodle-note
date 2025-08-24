#!/usr/bin/env node

// Quick test to verify absolute path generation
const { getPageUrl } = require('./scripts/sidebar');

// Mock config
const config = {
  site: {
    baseUrl: '/'
  }
};

// Test cases
const tests = [
  {
    description: 'Basic absolute path',
    page: { path: 'docs/README.md' },
    expected: '/docs/README.html'
  },
  {
    description: 'Nested path',
    page: { path: 'docs/setup/environment.md' },
    expected: '/docs/setup/environment.html'
  },
  {
    description: 'Custom baseUrl',
    page: { path: 'docs/README.md' },
    config: { site: { baseUrl: '/custom/' } },
    expected: '/custom/docs/README.html'
  }
];

console.log('🧪 Testing absolute path generation...\n');

let allPassed = true;

tests.forEach((test, index) => {
  const testConfig = test.config || config;
  const result = getPageUrl(test.page, '', testConfig);
  const passed = result === test.expected;
  
  if (!passed) {
    allPassed = false;
  }
  
  console.log(`Test ${index + 1}: ${test.description}`);
  console.log(`  Expected: ${test.expected}`);
  console.log(`  Got:      ${result}`);
  console.log(`  Status:   ${passed ? '✅ PASS' : '❌ FAIL'}\n`);
});

console.log(`Overall: ${allPassed ? '🎉 ALL TESTS PASSED' : '❌ SOME TESTS FAILED'}`);

if (!allPassed) {
  process.exit(1);
}