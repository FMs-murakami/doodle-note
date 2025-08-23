#!/usr/bin/env node

/**
 * Test script to verify collapsible sidebar functionality
 */

const fs = require('fs-extra');
const path = require('path');
const { loadConfig } = require('./scripts/config');
const { generateSidebar } = require('./scripts/sidebar');

async function testCollapsibleSidebar() {
  console.log('🧪 Testing collapsible sidebar functionality...\n');
  
  try {
    // Load configuration
    const config = await loadConfig();
    console.log('✅ Configuration loaded successfully');
    console.log(`   - ${config.pages.length} pages found`);
    
    // Test sidebar generation for different pages
    const testPages = [
      'docs/setup/windows.md',
      'docs/setup/macos.md',
      'docs/api/authentication.md'
    ];
    
    for (const testPage of testPages) {
      console.log(`\n📄 Testing sidebar for: ${testPage}`);
      
      const sidebarHtml = generateSidebar(config, testPage);
      
      // Check if the HTML contains collapsible elements
      const hasToggleButtons = sidebarHtml.includes('nav-category-toggle');
      const hasExpandedClass = sidebarHtml.includes('expanded');
      const hasAriaExpanded = sidebarHtml.includes('aria-expanded');
      const hasIcons = sidebarHtml.includes('nav-category-icon');
      
      console.log(`   - Toggle buttons: ${hasToggleButtons ? '✅' : '❌'}`);
      console.log(`   - Expanded class: ${hasExpandedClass ? '✅' : '❌'}`);
      console.log(`   - ARIA attributes: ${hasAriaExpanded ? '✅' : '❌'}`);
      console.log(`   - Category icons: ${hasIcons ? '✅' : '❌'}`);
      
      // Check if current page's category is expanded
      if (testPage.includes('setup/')) {
        const hasEnvironmentExpanded = sidebarHtml.includes('data-category="環境構築"') && 
                                      sidebarHtml.includes('class="nav-category expanded"');
        console.log(`   - Environment category expanded: ${hasEnvironmentExpanded ? '✅' : '❌'}`);
      }
    }
    
    // Test HTML structure
    console.log('\n🔍 Analyzing HTML structure...');
    const sampleSidebar = generateSidebar(config, 'docs/setup/windows.md');
    
    // Write sample output for inspection
    await fs.ensureDir('test-output');
    await fs.writeFile('test-output/sample-sidebar.html', sampleSidebar);
    console.log('   - Sample sidebar HTML written to: test-output/sample-sidebar.html');
    
    // Count categories and pages
    const categoryMatches = sampleSidebar.match(/nav-category-toggle/g);
    const pageMatches = sampleSidebar.match(/<li role="listitem">/g);
    
    console.log(`   - Categories found: ${categoryMatches ? categoryMatches.length : 0}`);
    console.log(`   - Pages found: ${pageMatches ? pageMatches.length : 0}`);
    
    console.log('\n✅ Collapsible sidebar test completed successfully!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

// Run the test
testCollapsibleSidebar();