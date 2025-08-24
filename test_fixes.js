#!/usr/bin/env node

/**
 * Test script to verify the fixes work correctly
 */

const fs = require('fs-extra');
const path = require('path');

async function testFixes() {
  console.log('🧪 Testing fixes...');
  
  try {
    // Test 1: Check if config.json exists and has correct structure
    console.log('1. Testing config structure...');
    const configPath = path.join(__dirname, 'config', 'config.json');
    if (await fs.pathExists(configPath)) {
      const config = await fs.readJson(configPath);
      console.log('✅ Config loaded successfully');
      console.log('   - Site title:', config.site.title);
      console.log('   - Pages count:', config.pages.length);
      
      // Check hierarchical structure
      const hasCategories = config.pages.some(page => page.category && page.pages);
      console.log('   - Has hierarchical categories:', hasCategories ? '✅' : '❌');
    } else {
      console.log('❌ Config file not found');
    }
    
    // Test 2: Check if sample image exists
    console.log('\n2. Testing image assets...');
    const imagePath = path.join(__dirname, 'docs', 'sample01.png');
    if (await fs.pathExists(imagePath)) {
      console.log('✅ Sample image found at docs/sample01.png');
    } else {
      console.log('❌ Sample image not found');
    }
    
    // Test 3: Check markdown file with image reference
    console.log('\n3. Testing markdown with image reference...');
    const readmePath = path.join(__dirname, 'docs', 'README.md');
    if (await fs.pathExists(readmePath)) {
      const content = await fs.readFile(readmePath, 'utf8');
      if (content.includes('sample01.png')) {
        console.log('✅ README.md contains image reference');
        console.log('   - Image path in markdown:', content.match(/!\[.*?\]\((.*?)\)/)?.[1] || 'not found');
      } else {
        console.log('❌ No image reference found in README.md');
      }
    } else {
      console.log('❌ README.md not found');
    }
    
    // Test 4: Check table syntax in markdown
    console.log('\n4. Testing table alignment syntax...');
    if (await fs.pathExists(readmePath)) {
      const content = await fs.readFile(readmePath, 'utf8');
      const hasTableAlignment = content.includes(':--------') || content.includes(':---------:') || content.includes('--------:');
      console.log('✅ Table alignment syntax found:', hasTableAlignment ? '✅' : '❌');
    }
    
    // Test 5: Check if sidebar.js has correct structure
    console.log('\n5. Testing sidebar JavaScript...');
    const sidebarJsPath = path.join(__dirname, 'assets', 'js', 'sidebar.js');
    if (await fs.pathExists(sidebarJsPath)) {
      const content = await fs.readFile(sidebarJsPath, 'utf8');
      const hasToggleCategory = content.includes('toggleCategory');
      const hasSidebarManager = content.includes('SidebarManager');
      console.log('✅ Sidebar JS structure:');
      console.log('   - Has toggleCategory function:', hasToggleCategory ? '✅' : '❌');
      console.log('   - Has SidebarManager class:', hasSidebarManager ? '✅' : '❌');
    } else {
      console.log('❌ Sidebar JS not found');
    }
    
    // Test 6: Check CSS for table alignment
    console.log('\n6. Testing CSS table alignment...');
    const cssPath = path.join(__dirname, 'assets', 'css', 'style.css');
    if (await fs.pathExists(cssPath)) {
      const content = await fs.readFile(cssPath, 'utf8');
      const hasTextCenter = content.includes('text-center');
      const hasTextRight = content.includes('text-right');
      const hasTextLeft = content.includes('text-left');
      console.log('✅ CSS table alignment classes:');
      console.log('   - text-left:', hasTextLeft ? '✅' : '❌');
      console.log('   - text-center:', hasTextCenter ? '✅' : '❌');
      console.log('   - text-right:', hasTextRight ? '✅' : '❌');
    } else {
      console.log('❌ CSS file not found');
    }
    
    console.log('\n🎉 Test completed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run tests
testFixes();