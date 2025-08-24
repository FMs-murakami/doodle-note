// Simple test to verify markdown link conversion
const { convertMarkdownToHtml } = require('./scripts/markdown');

async function testSimple() {
  try {
    console.log('Testing markdown link conversion...\n');
    
    const markdown = '[API Endpoints](endpoints.md)';
    const currentPage = 'docs/api/authentication.md';
    
    const result = await convertMarkdownToHtml(markdown, currentPage);
    console.log('Input markdown:', markdown);
    console.log('Current page:', currentPage);
    console.log('Output HTML:', result.html);
    
    // Check if the link was converted correctly
    if (result.html.includes('endpoints.html')) {
      console.log('✅ SUCCESS: Link was converted to .html');
    } else {
      console.log('❌ FAILED: Link was not converted');
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testSimple();