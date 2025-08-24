// Debug URL generation issues
const { getPageUrl } = require('./scripts/sidebar');
const { loadConfig } = require('./scripts/config');

async function debugUrlGeneration() {
  console.log('=== URL Generation Debug ===\n');
  
  const config = await loadConfig();
  
  // Test cases that might show the duplication issue
  const testCases = [
    {
      description: 'Windows setup page from index',
      currentPage: '',
      targetPage: { path: 'docs/setup/windows.md' },
    },
    {
      description: 'Windows setup page from docs/README.md',
      currentPage: 'docs/README.md',
      targetPage: { path: 'docs/setup/windows.md' },
    },
    {
      description: 'Windows setup page from another setup page',
      currentPage: 'docs/setup/environment.md',
      targetPage: { path: 'docs/setup/windows.md' },
    },
    {
      description: 'API page from setup page',
      currentPage: 'docs/setup/windows.md',
      targetPage: { path: 'docs/api/endpoints.md' },
    }
  ];
  
  testCases.forEach((testCase, index) => {
    const result = getPageUrl(testCase.targetPage, testCase.currentPage);
    
    console.log(`Test ${index + 1}: ${testCase.description}`);
    console.log(`  Current: "${testCase.currentPage || '(empty)'}"`);
    console.log(`  Target:  "${testCase.targetPage.path}"`);
    console.log(`  Result:  "${result}"`);
    console.log('');
  });
  
  // Also test with the actual config structure
  console.log('=== Config Structure Analysis ===\n');
  console.log('Pages structure:');
  console.log(JSON.stringify(config.pages, null, 2));
}

debugUrlGeneration().catch(console.error);