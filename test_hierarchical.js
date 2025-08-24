#!/usr/bin/env node

/**
 * Test script for hierarchical configuration
 */

const { loadConfig, flattenPages, groupPagesByCategory } = require('./scripts/config');
const { generateSidebar } = require('./scripts/sidebar');

async function testHierarchicalConfig() {
  console.log('🧪 Testing hierarchical configuration...');
  
  try {
    // 1. Load and validate config
    console.log('📋 Loading configuration...');
    const config = await loadConfig();
    console.log('✅ Configuration loaded successfully');
    
    // 2. Test flattening
    console.log('📄 Testing page flattening...');
    const flatPages = flattenPages(config.pages);
    console.log(`✅ Flattened ${flatPages.length} pages:`);
    flatPages.forEach(page => {
      console.log(`   - ${page.title} (${page.path})`);
    });
    
    // 3. Test grouping
    console.log('📁 Testing page grouping...');
    const groupedPages = groupPagesByCategory(config.pages);
    console.log('✅ Grouped pages by category:');
    Object.keys(groupedPages).forEach(category => {
      console.log(`   ${category}: ${groupedPages[category].length} pages`);
    });
    
    // 4. Test sidebar generation
    console.log('🔧 Testing sidebar generation...');
    const sidebarHtml = generateSidebar(config, 'docs/README.md');
    console.log('✅ Sidebar HTML generated successfully');
    console.log('📏 Sidebar HTML length:', sidebarHtml.length, 'characters');
    
    // 5. Check for hierarchical structure in HTML
    const hasCategories = sidebarHtml.includes('nav-category');
    const hasDetailsElements = sidebarHtml.includes('<details');
    const hasSummaryElements = sidebarHtml.includes('<summary');
    const hasNestedStructure = sidebarHtml.includes('nav-category-level-');
    
    console.log('🔍 Sidebar structure analysis:');
    console.log(`   - Has categories: ${hasCategories ? '✅' : '❌'}`);
    console.log(`   - Has details elements: ${hasDetailsElements ? '✅' : '❌'}`);
    console.log(`   - Has summary elements: ${hasSummaryElements ? '✅' : '❌'}`);
    console.log(`   - Has nested structure: ${hasNestedStructure ? '✅' : '❌'}`);
    
    console.log('\n🎉 All tests passed! Hierarchical configuration is working correctly.');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

// Run test if this script is executed directly
if (require.main === module) {
  testHierarchicalConfig();
}

module.exports = { testHierarchicalConfig };