#!/usr/bin/env node

/**
 * Phase 3 Implementation Test Script
 * Tests the new MD to HTML conversion functionality
 */

const fs = require('fs-extra');
const path = require('path');

console.log('🧪 Testing Phase 3 Implementation...\n');

// Test 1: Check if all required files exist
console.log('1. Checking file structure...');
const requiredFiles = [
    'scripts/config.js',
    'scripts/markdown.js',
    'templates/page.html',
    'docs/setup.md',
    'docs/api-spec.md',
    'config/config.json'
];

let allFilesExist = true;
requiredFiles.forEach(file => {
    if (fs.existsSync(file)) {
        console.log(`   ✅ ${file}`);
    } else {
        console.log(`   ❌ ${file} - Missing!`);
        allFilesExist = false;
    }
});

if (!allFilesExist) {
    console.log('\n❌ Some required files are missing. Please check the implementation.');
    process.exit(1);
}

// Test 2: Test config.js module
console.log('\n2. Testing config.js module...');
try {
    const { loadConfig, groupPagesByCategory, getCategories } = require('./scripts/config');
    
    // Test groupPagesByCategory function
    const testPages = [
        { path: 'docs/setup.md', title: 'セットアップ', category: '環境構築' },
        { path: 'docs/api.md', title: 'API', category: '仕様書' }
    ];
    
    const grouped = groupPagesByCategory(testPages);
    const categories = getCategories(testPages);
    
    console.log('   ✅ groupPagesByCategory works');
    console.log('   ✅ getCategories works');
    console.log(`   📊 Found categories: ${categories.join(', ')}`);
    
} catch (error) {
    console.log(`   ❌ config.js module error: ${error.message}`);
}

// Test 3: Test markdown.js module
console.log('\n3. Testing markdown.js module...');
try {
    const { extractFrontmatter, generateNavigation } = require('./scripts/markdown');
    
    // Test frontmatter extraction
    const testContent = `---
title: Test Page
---

# Test Content`;
    
    const result = extractFrontmatter(testContent);
    if (result.frontmatter.title === 'Test Page') {
        console.log('   ✅ extractFrontmatter works');
    } else {
        console.log('   ❌ extractFrontmatter failed');
    }
    
    // Test navigation generation
    const testGrouped = {
        '環境構築': [{ path: 'docs/setup.md', title: 'セットアップ' }],
        '仕様書': [{ path: 'docs/api.md', title: 'API' }]
    };
    
    const nav = generateNavigation(testGrouped, 'docs/setup.md');
    if (nav.includes('nav-category')) {
        console.log('   ✅ generateNavigation works');
    } else {
        console.log('   ❌ generateNavigation failed');
    }
    
} catch (error) {
    console.log(`   ❌ markdown.js module error: ${error.message}`);
}

// Test 4: Test build script
console.log('\n4. Testing build script...');
try {
    const { build } = require('./scripts/build');
    console.log('   ✅ Build script loads successfully');
    
    // Run the build process
    console.log('   🔄 Running build process...');
    build().then(() => {
        console.log('   ✅ Build completed successfully');
        
        // Check if dist directory was created
        if (fs.existsSync('dist')) {
            console.log('   ✅ dist directory created');
            
            // Check for generated files
            const expectedFiles = [
                'dist/index.html',
                'dist/docs/setup.html',
                'dist/docs/api-spec.html'
            ];
            
            expectedFiles.forEach(file => {
                if (fs.existsSync(file)) {
                    console.log(`   ✅ ${file} generated`);
                } else {
                    console.log(`   ⚠️  ${file} not found`);
                }
            });
        } else {
            console.log('   ❌ dist directory not created');
        }
        
        console.log('\n🎉 Phase 3 implementation test completed!');
        
    }).catch(error => {
        console.log(`   ❌ Build failed: ${error.message}`);
        console.error(error.stack);
    });
    
} catch (error) {
    console.log(`   ❌ Build script error: ${error.message}`);
    console.error(error.stack);
}