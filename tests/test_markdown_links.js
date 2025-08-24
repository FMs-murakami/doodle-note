/**
 * Test markdown link conversion functionality
 */

const { convertMarkdownToHtml } = require('../scripts/markdown');

// Test cases for markdown link conversion
const testCases = [
  {
    description: 'Same directory link',
    currentPage: 'docs/api/authentication.md',
    markdown: '[API Endpoints](endpoints.md)',
    expectedHref: 'endpoints.html'
  },
  {
    description: 'Parent directory link',
    currentPage: 'docs/api/authentication.md',
    markdown: '[Security Guide](../guides/security.md)',
    expectedHref: '../guides/security.html'
  },
  {
    description: 'Nested directory link',
    currentPage: 'docs/README.md',
    markdown: '[Setup Guide](setup/environment.md)',
    expectedHref: 'setup/environment.html'
  },
  {
    description: 'Multiple levels up',
    currentPage: 'docs/setup/advanced/config.md',
    markdown: '[API Guide](../../api/endpoints.md)',
    expectedHref: '../../api/endpoints.html'
  },
  {
    description: 'External URL (should not change)',
    currentPage: 'docs/api/authentication.md',
    markdown: '[GitHub](https://github.com/example/repo)',
    expectedHref: 'https://github.com/example/repo'
  },
  {
    description: 'Non-markdown file (should not change)',
    currentPage: 'docs/api/authentication.md',
    markdown: '[Image](../images/diagram.png)',
    expectedHref: '../images/diagram.png'
  },
  {
    description: 'Link with title attribute',
    currentPage: 'docs/api/authentication.md',
    markdown: '[API Endpoints](endpoints.md "API Documentation")',
    expectedHref: 'endpoints.html',
    expectedTitle: 'API Documentation'
  }
];

async function runTests() {
  console.log('Testing markdown link conversion...\n');
  
  let passedTests = 0;
  let totalTests = testCases.length;
  
  for (let i = 0; i < testCases.length; i++) {
    const testCase = testCases[i];
    
    try {
      const { html } = await convertMarkdownToHtml(testCase.markdown, testCase.currentPage);
      
      // Extract href from the generated HTML
      const linkMatch = html.match(/<a href="([^"]*)"(?:\s+title="([^"]*)")?[^>]*>/);
      
      if (!linkMatch) {
        console.log(`Test ${i + 1}: ${testCase.description}`);
        console.log(`  ❌ FAIL - No link found in HTML output`);
        console.log(`  HTML: ${html}\n`);
        continue;
      }
      
      const actualHref = linkMatch[1];
      const actualTitle = linkMatch[2];
      
      let passed = actualHref === testCase.expectedHref;
      
      // Check title if expected
      if (testCase.expectedTitle) {
        passed = passed && actualTitle === testCase.expectedTitle;
      }
      
      console.log(`Test ${i + 1}: ${testCase.description}`);
      console.log(`  Current page: ${testCase.currentPage}`);
      console.log(`  Markdown: ${testCase.markdown}`);
      console.log(`  Expected href: ${testCase.expectedHref}`);
      console.log(`  Actual href: ${actualHref}`);
      
      if (testCase.expectedTitle) {
        console.log(`  Expected title: ${testCase.expectedTitle}`);
        console.log(`  Actual title: ${actualTitle || '(none)'}`);
      }
      
      console.log(`  Status: ${passed ? '✅ PASS' : '❌ FAIL'}\n`);
      
      if (passed) {
        passedTests++;
      }
      
    } catch (error) {
      console.log(`Test ${i + 1}: ${testCase.description}`);
      console.log(`  ❌ FAIL - Error: ${error.message}\n`);
    }
  }
  
  console.log(`\nTest Results: ${passedTests}/${totalTests} tests passed`);
  
  if (passedTests === totalTests) {
    console.log('🎉 All tests passed!');
    process.exit(0);
  } else {
    console.log('❌ Some tests failed');
    process.exit(1);
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  runTests().catch(error => {
    console.error('Test execution failed:', error);
    process.exit(1);
  });
}

module.exports = { runTests };