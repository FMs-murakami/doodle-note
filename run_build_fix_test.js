#!/usr/bin/env node

/**
 * Runner for the build fix test
 */

const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Running build fix test...\n');

const testProcess = spawn('node', ['test/test_build_fix.js'], {
  cwd: process.cwd(),
  stdio: 'inherit'
});

testProcess.on('close', (code) => {
  if (code === 0) {
    console.log('\n✅ Build fix test completed successfully!');
  } else {
    console.log('\n❌ Build fix test failed!');
  }
  process.exit(code);
});

testProcess.on('error', (error) => {
  console.error('❌ Failed to run test:', error.message);
  process.exit(1);
});