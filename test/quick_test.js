#!/usr/bin/env node

// Quick test of Phase 3 modules
const fs = require('fs-extra');

console.log('🔍 Quick Phase 3 Module Test\n');

// Test config module
try {
    const config = require('../scripts/config');
    console.log('✅ config.js module loads');
    console.log('   Functions:', Object.keys(config));
} catch (error) {
    console.log('❌ config.js error:', error.message);
}

// Test markdown module  
try {
    const markdown = require('../scripts/markdown');
    console.log('✅ markdown.js module loads');
    console.log('   Functions:', Object.keys(markdown));
} catch (error) {
    console.log('❌ markdown.js error:', error.message);
}

// Test build module
try {
    const build = require('../scripts/build');
    console.log('✅ build.js module loads');
    console.log('   Functions:', Object.keys(build));
} catch (error) {
    console.log('❌ build.js error:', error.message);
}

// Test config loading
try {
    const { loadConfig } = require('../scripts/config');
    loadConfig().then(config => {
        console.log('✅ Config loaded successfully');
        console.log('   Site title:', config.site.title);
        console.log('   Pages count:', config.pages.length);
    }).catch(error => {
        console.log('❌ Config loading error:', error.message);
    });
} catch (error) {
    console.log('❌ Config test error:', error.message);
}