#!/usr/bin/env node

/**
 * Development server for internal documentation site
 * Provides live reloading and development features
 */

const fs = require('fs-extra');
const path = require('path');
const { build } = require('./build.js');

async function dev() {
  console.log('🔧 Starting development mode...');
  
  try {
    // Initial build
    console.log('🏗️  Performing initial build...');
    await build();
    
    // Watch for file changes
    console.log('👀 Watching for file changes...');
    console.log('📁 Watching directories: docs/, config/, assets/');
    
    const watchDirs = ['docs', 'config', 'assets'];
    
    // Simple file watcher (basic implementation)
    watchDirs.forEach(dir => {
      if (fs.existsSync(dir)) {
        fs.watch(dir, { recursive: true }, async (eventType, filename) => {
          if (filename) {
            console.log(`📝 File changed: ${path.join(dir, filename)}`);
            console.log('🔄 Rebuilding...');
            try {
              await build();
              console.log('✅ Rebuild completed');
            } catch (error) {
              console.error('❌ Rebuild failed:', error.message);
            }
          }
        });
      }
    });
    
    console.log('🚀 Development server is running!');
    console.log('📂 Serving from: ./dist');
    console.log('💡 Tip: Use a local HTTP server to view the site:');
    console.log('   npx http-server dist -p 8080');
    console.log('   or');
    console.log('   python -m http.server 8080 --directory dist');
    console.log('');
    console.log('Press Ctrl+C to stop watching...');
    
    // Keep the process running
    process.stdin.resume();
    
  } catch (error) {
    console.error('❌ Development server failed to start:', error.message);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n👋 Development server stopped');
  process.exit(0);
});

// Run dev server if this script is executed directly
if (require.main === module) {
  dev();
}

module.exports = { dev };