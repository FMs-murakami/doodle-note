#!/usr/bin/env node

const { build } = require('./scripts/build.js');
const fs = require('fs-extra');
const path = require('path');

async function testBuild() {
  console.log('🧪 Testing current build process...');
  
  try {
    // Run the build
    await build();
    
    // Check if dist directory exists
    const distExists = await fs.pathExists('dist');
    console.log(`📁 dist directory exists: ${distExists}`);
    
    if (distExists) {
      // Check for index.html
      const indexExists = await fs.pathExists('dist/index.html');
      console.log(`📄 index.html exists: ${indexExists}`);
      
      // Check for converted markdown files
      const readmeExists = await fs.pathExists('dist/docs/README.html');
      console.log(`📝 README.html exists: ${readmeExists}`);
      
      const setupExists = await fs.pathExists('dist/docs/setup.html');
      console.log(`📝 setup.html exists: ${setupExists}`);
      
      // List all HTML files
      const htmlFiles = [];
      const findHtmlFiles = async (dir) => {
        const items = await fs.readdir(dir);
        for (const item of items) {
          const fullPath = path.join(dir, item);
          const stat = await fs.stat(fullPath);
          if (stat.isDirectory()) {
            await findHtmlFiles(fullPath);
          } else if (item.endsWith('.html')) {
            htmlFiles.push(fullPath);
          }
        }
      };
      
      await findHtmlFiles('dist');
      console.log(`📊 Total HTML files generated: ${htmlFiles.length}`);
      htmlFiles.forEach(file => console.log(`  - ${file}`));
      
      // Check content of one HTML file
      if (readmeExists) {
        const content = await fs.readFile('dist/docs/README.html', 'utf8');
        const hasHeader = content.includes('<header class="site-header">');
        const hasSidebar = content.includes('<aside class="sidebar"');
        const hasContent = content.includes('ドキュメントディレクトリ');
        
        console.log(`🔍 README.html analysis:`);
        console.log(`  - Has header: ${hasHeader}`);
        console.log(`  - Has sidebar: ${hasSidebar}`);
        console.log(`  - Has markdown content: ${hasContent}`);
      }
    }
    
    console.log('✅ Build test completed');
    
  } catch (error) {
    console.error('❌ Build test failed:', error.message);
    console.error(error.stack);
  }
}

testBuild();