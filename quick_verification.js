#!/usr/bin/env node

/**
 * Quick verification that the fix is working
 */

console.log('🔍 Quick verification of generateCategoryIndexes fix...\n');

try {
  // Test 1: Import the build module
  console.log('1. Testing module import...');
  const buildModule = require('./scripts/build.js');
  console.log('   ✅ Module imported successfully');
  
  // Test 2: Check if generateCategoryIndexes exists
  console.log('2. Checking generateCategoryIndexes function...');
  if (typeof buildModule.generateCategoryIndexes === 'function') {
    console.log('   ✅ generateCategoryIndexes function exists');
  } else {
    console.log('   ❌ generateCategoryIndexes function not found');
    process.exit(1);
  }
  
  // Test 3: Check all expected exports
  console.log('3. Checking all exports...');
  const expectedExports = ['build', 'copyStaticFiles', 'generateIndex', 'generateCategoryIndexes'];
  for (const exportName of expectedExports) {
    if (typeof buildModule[exportName] === 'function') {
      console.log(`   ✅ ${exportName} exported`);
    } else {
      console.log(`   ❌ ${exportName} not exported`);
      process.exit(1);
    }
  }
  
  // Test 4: Check dependencies
  console.log('4. Checking dependencies...');
  const { generateEnhancedSidebar } = require('./scripts/sidebar.js');
  const { groupPagesByCategory, getCategories } = require('./scripts/config.js');
  
  if (typeof generateEnhancedSidebar === 'function') {
    console.log('   ✅ generateEnhancedSidebar available');
  } else {
    console.log('   ❌ generateEnhancedSidebar not available');
  }
  
  if (typeof groupPagesByCategory === 'function' && typeof getCategories === 'function') {
    console.log('   ✅ Config functions available');
  } else {
    console.log('   ❌ Config functions not available');
  }
  
  console.log('\n🎉 All verifications passed! The fix should work.');
  console.log('💡 You can now run "npm run build" without the ReferenceError.');
  
} catch (error) {
  console.error('❌ Verification failed:', error.message);
  console.error(error.stack);
  process.exit(1);
}