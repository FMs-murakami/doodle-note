#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');

console.log('🚀 Running Phase 3 Verification and Build Test\n');

try {
    // Run verification
    console.log('1. Running verification script...');
    execSync('node verify_phase3.js', { stdio: 'inherit' });
    
    console.log('\n2. Running build process...');
    execSync('npm run build', { stdio: 'inherit' });
    
    console.log('\n3. Checking build output...');
    if (fs.existsSync('dist')) {
        console.log('✅ dist directory created');
        
        const files = fs.readdirSync('dist', { recursive: true });
        console.log(`📁 Generated ${files.length} files:`);
        files.slice(0, 10).forEach(file => {
            console.log(`   - ${file}`);
        });
        
        if (files.length > 10) {
            console.log(`   ... and ${files.length - 10} more files`);
        }
    } else {
        console.log('❌ dist directory not found');
    }
    
    console.log('\n🎉 Phase 3 implementation completed successfully!');
    
} catch (error) {
    console.error('❌ Error during verification/build:', error.message);
    process.exit(1);
}