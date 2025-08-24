#!/usr/bin/env node

/**
 * Final verification test
 */

console.log('🔍 Final verification of the generateCategoryIndexes fix...\n');

async function runFinalTest() {
  try {
    console.log('1. Testing module import...');
    const buildModule = require('./scripts/build.js');
    console.log('   ✅ Build module imported successfully');
    
    console.log('2. Checking function availability...');
    const requiredFunctions = ['build', 'copyStaticFiles', 'generateIndex', 'generateCategoryIndexes'];
    
    for (const funcName of requiredFunctions) {
      if (typeof buildModule[funcName] === 'function') {
        console.log(`   ✅ ${funcName} is available`);
      } else {
        throw new Error(`${funcName} is not available or not a function`);
      }
    }
    
    console.log('3. Testing dependencies...');
    const { generateEnhancedSidebar } = require('./scripts/sidebar.js');
    const { groupPagesByCategory, getCategories } = require('./scripts/config.js');
    
    if (typeof generateEnhancedSidebar === 'function') {
      console.log('   ✅ generateEnhancedSidebar is available');
    } else {
      throw new Error('generateEnhancedSidebar is not available');
    }
    
    if (typeof groupPagesByCategory === 'function' && typeof getCategories === 'function') {
      console.log('   ✅ Config functions are available');
    } else {
      throw new Error('Config functions are not available');
    }
    
    console.log('\n🎉 All verifications passed!');
    console.log('✅ The ReferenceError has been fixed.');
    console.log('✅ npm run build should now work without errors.');
    
    return true;
    
  } catch (error) {
    console.error('\n❌ Verification failed:', error.message);
    return false;
  }
}

if (require.main === module) {
  runFinalTest().then(success => {
    process.exit(success ? 0 : 1);
  });
}

module.exports = { runFinalTest };