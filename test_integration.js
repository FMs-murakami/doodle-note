#!/usr/bin/env node

/**
 * Integration test to verify generated HTML has correct links
 */

const fs = require('fs-extra');
const path = require('path');
const { build } = require('./scripts/build');

/**
 * Parse HTML and extract links from sidebar
 */
function extractSidebarLinks(htmlContent) {
  const sidebarRegex = /<aside class="sidebar"[\s\S]*?<\/aside>/;
  const sidebarMatch = htmlContent.match(sidebarRegex);
  
  if (!sidebarMatch) {
    return [];
  }
  
  const linkRegex = /<a href="([^"]*)"[^>]*>([^<]*)<\/a>/g;
  const links = [];
  let match;
  
  while ((match = linkRegex.exec(sidebarMatch[0])) !== null) {
    links.push({
      href: match[1],
      text: match[2]
    });
  }
  
  return links;
}

/**
 * Verify that links in generated HTML are correct
 */
async function verifyGeneratedLinks() {
  console.log('🔍 Verifying generated HTML links...\n');
  
  // Build the site first
  await build();
  
  const testFiles = [
    {
      file: 'dist/docs/README.html',
      description: 'docs/README.html (root level)',
      expectedLinkPatterns: [
        { href: 'api-spec.html', description: 'Same directory link' },
        { href: 'setup/environment.html', description: 'Subdirectory link' },
        { href: 'api/authentication.html', description: 'Another subdirectory link' }
      ]
    },
    {
      file: 'dist/docs/setup/environment.html',
      description: 'docs/setup/environment.html (subdirectory)',
      expectedLinkPatterns: [
        { href: '../README.html', description: 'Parent directory link' },
        { href: '../api-spec.html', description: 'Parent directory file link' },
        { href: '../api/endpoints.html', description: 'Sibling subdirectory link' }
      ]
    }
  ];
  
  let allTestsPassed = true;
  
  for (const testFile of testFiles) {
    console.log(`Testing ${testFile.description}:`);
    
    if (!await fs.pathExists(testFile.file)) {
      console.log(`  ❌ File does not exist: ${testFile.file}`);
      allTestsPassed = false;
      continue;
    }
    
    const htmlContent = await fs.readFile(testFile.file, 'utf8');
    const sidebarLinks = extractSidebarLinks(htmlContent);
    
    console.log(`  Found ${sidebarLinks.length} sidebar links`);
    
    for (const expectedPattern of testFile.expectedLinkPatterns) {
      const foundLink = sidebarLinks.find(link => link.href === expectedPattern.href);
      
      if (foundLink) {
        console.log(`  ✅ ${expectedPattern.description}: ${expectedPattern.href}`);
      } else {
        console.log(`  ❌ Missing ${expectedPattern.description}: ${expectedPattern.href}`);
        console.log(`     Available links: ${sidebarLinks.map(l => l.href).join(', ')}`);
        allTestsPassed = false;
      }
    }
    
    console.log('');
  }
  
  return allTestsPassed;
}

/**
 * Verify breadcrumb links in generated HTML
 */
async function verifyBreadcrumbLinks() {
  console.log('🔍 Verifying breadcrumb links...\n');
  
  const testFiles = [
    {
      file: 'dist/docs/README.html',
      expectedIndexPath: '../index.html'
    },
    {
      file: 'dist/docs/setup/environment.html',
      expectedIndexPath: '../../index.html'
    }
  ];
  
  let allTestsPassed = true;
  
  for (const testFile of testFiles) {
    if (!await fs.pathExists(testFile.file)) {
      console.log(`  ❌ File does not exist: ${testFile.file}`);
      allTestsPassed = false;
      continue;
    }
    
    const htmlContent = await fs.readFile(testFile.file, 'utf8');
    const breadcrumbRegex = /<nav class="breadcrumb"[\s\S]*?<\/nav>/;
    const breadcrumbMatch = htmlContent.match(breadcrumbRegex);
    
    if (!breadcrumbMatch) {
      console.log(`  ❌ No breadcrumb found in ${testFile.file}`);
      allTestsPassed = false;
      continue;
    }
    
    const containsExpectedPath = breadcrumbMatch[0].includes(`href="${testFile.expectedIndexPath}"`);
    
    if (containsExpectedPath) {
      console.log(`  ✅ Correct breadcrumb in ${path.basename(testFile.file)}: ${testFile.expectedIndexPath}`);
    } else {
      console.log(`  ❌ Incorrect breadcrumb in ${path.basename(testFile.file)}`);
      console.log(`     Expected: ${testFile.expectedIndexPath}`);
      console.log(`     Breadcrumb HTML: ${breadcrumbMatch[0]}`);
      allTestsPassed = false;
    }
  }
  
  console.log('');
  return allTestsPassed;
}

/**
 * Main integration test runner
 */
async function runIntegrationTests() {
  console.log('🧪 Running integration tests...\n');
  
  try {
    const linkTestsPassed = await verifyGeneratedLinks();
    const breadcrumbTestsPassed = await verifyBreadcrumbLinks();
    
    const allPassed = linkTestsPassed && breadcrumbTestsPassed;
    
    console.log('📊 Integration Test Summary:');
    console.log(`  Sidebar Links: ${linkTestsPassed ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`  Breadcrumb Links: ${breadcrumbTestsPassed ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`\n${allPassed ? '🎉 All integration tests passed!' : '💥 Some integration tests failed!'}`);
    
    return allPassed;
    
  } catch (error) {
    console.error('❌ Integration tests failed:', error);
    return false;
  }
}

// Run tests if this script is executed directly
if (require.main === module) {
  runIntegrationTests().then(success => {
    process.exit(success ? 0 : 1);
  }).catch(error => {
    console.error('Integration test runner failed:', error);
    process.exit(1);
  });
}

module.exports = { runIntegrationTests, verifyGeneratedLinks, verifyBreadcrumbLinks };