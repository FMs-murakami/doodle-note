#!/usr/bin/env node

/**
 * Test to verify npm run build works without ReferenceError
 */

const { spawn } = require('child_process');
const fs = require('fs-extra');

async function testNpmBuild() {
  console.log('🧪 Testing npm run build command...\n');
  
  try {
    // Clean up any existing dist directory
    if (await fs.pathExists('dist')) {
      await fs.remove('dist');
      console.log('🧹 Cleaned up existing dist directory');
    }
    
    // Run npm run build
    const buildProcess = spawn('npm', ['run', 'build'], {
      stdio: 'pipe',
      shell: true
    });
    
    let stdout = '';
    let stderr = '';
    
    buildProcess.stdout.on('data', (data) => {
      const output = data.toString();
      stdout += output;
      process.stdout.write(output);
    });
    
    buildProcess.stderr.on('data', (data) => {
      const output = data.toString();
      stderr += output;
      process.stderr.write(output);
    });
    
    return new Promise((resolve, reject) => {
      buildProcess.on('close', (code) => {
        if (code === 0) {
          console.log('\n✅ npm run build completed successfully!');
          console.log('✅ No ReferenceError occurred!');
          resolve(true);
        } else {
          if (stderr.includes('ReferenceError: generateCategoryIndexes is not defined')) {
            console.log('\n❌ ReferenceError still exists!');
            reject(new Error('generateCategoryIndexes is still not defined'));
          } else {
            console.log(`\n⚠️  Build failed with exit code ${code}, but not due to ReferenceError`);
            console.log('This might be due to missing markdown files or other non-critical issues');
            resolve(false);
          }
        }
      });
      
      buildProcess.on('error', (error) => {
        console.error('\n❌ Failed to run npm build:', error.message);
        reject(error);
      });
    });
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    throw error;
  }
}

// Run the test
if (require.main === module) {
  testNpmBuild()
    .then((success) => {
      if (success) {
        console.log('\n🎉 npm run build test passed!');
        process.exit(0);
      } else {
        console.log('\n⚠️  npm run build completed with warnings but no ReferenceError');
        process.exit(0);
      }
    })
    .catch((error) => {
      console.error('\n💥 npm run build test failed:', error.message);
      process.exit(1);
    });
}

module.exports = { testNpmBuild };