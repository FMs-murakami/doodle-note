#!/usr/bin/env node

/**
 * Quick test to verify the build process works
 */

const { build } = require('./scripts/build.js');

console.log('🧪 Testing build process...');

build()
  .then(() => {
    console.log('✅ Build test completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Build test failed:', error.message);
    console.error(error.stack);
    process.exit(1);
  });