#!/usr/bin/env node

/**
 * Phase 3 Verification Script
 * Comprehensive testing of all Phase 3 requirements
 */

const fs = require('fs-extra');
const path = require('path');

console.log('🔍 Phase 3 Implementation Verification\n');
console.log('=' .repeat(50));

let testsPassed = 0;
let testsFailed = 0;

function test(name, testFn) {
    try {
        testFn();
        console.log(`✅ ${name}`);
        testsPassed++;
    } catch (error) {
        console.log(`❌ ${name}: ${error.message}`);
        testsFailed++;
    }
}

// Issue #3: Config.json structure and loading functionality
console.log('\n📋 Issue #3: Config.json structure and loading functionality');

test('Config.json has correct Phase 3 structure', () => {
    const config = JSON.parse(fs.readFileSync('config/config.json', 'utf8'));
    
    if (!config.site || !config.site.title || !config.site.description) {
        throw new Error('Missing site configuration');
    }
    
    if (!Array.isArray(config.pages) || config.pages.length === 0) {
        throw new Error('Pages array is missing or empty');
    }
    
    config.pages.forEach((page, index) => {
        if (!page.path || !page.title || !page.category) {
            throw new Error(`Page ${index} missing required properties`);
        }
    });
    
    if (config.site.title !== '社内手順書・仕様書') {
        throw new Error('Site title does not match Phase 3 requirements');
    }
});

test('Config.js module exists and exports required functions', () => {
    if (!fs.existsSync('scripts/config.js')) {
        throw new Error('config.js module not found');
    }
    
    const configContent = fs.readFileSync('scripts/config.js', 'utf8');
    const requiredFunctions = ['loadConfig', 'validateConfig', 'groupPagesByCategory', 'getCategories'];
    
    requiredFunctions.forEach(fn => {
        if (!configContent.includes(fn)) {
            throw new Error(`Missing function: ${fn}`);
        }
    });
});

test('Sample markdown files exist with correct content', () => {
    const files = ['docs/setup.md', 'docs/api-spec.md'];
    
    files.forEach(file => {
        if (!fs.existsSync(file)) {
            throw new Error(`Missing file: ${file}`);
        }
        
        const content = fs.readFileSync(file, 'utf8');
        if (!content.includes('#')) {
            throw new Error(`${file} missing markdown headers`);
        }
        
        if (!content.includes('```')) {
            throw new Error(`${file} missing code blocks`);
        }
    });
});

// Issue #4: Markdown → HTML conversion engine
console.log('\n🔄 Issue #4: Markdown → HTML conversion engine');

test('Markdown.js module exists and exports required functions', () => {
    if (!fs.existsSync('scripts/markdown.js')) {
        throw new Error('markdown.js module not found');
    }
    
    const markdownContent = fs.readFileSync('scripts/markdown.js', 'utf8');
    const requiredFunctions = ['convertMarkdown', 'extractFrontmatter', 'generateNavigation'];
    
    requiredFunctions.forEach(fn => {
        if (!markdownContent.includes(fn)) {
            throw new Error(`Missing function: ${fn}`);
        }
    });
    
    // Check for required libraries
    if (!markdownContent.includes('marked') || !markdownContent.includes('hljs')) {
        throw new Error('Missing required libraries (marked, hljs)');
    }
});

test('HTML template exists with required placeholders', () => {
    if (!fs.existsSync('templates/page.html')) {
        throw new Error('page.html template not found');
    }
    
    const template = fs.readFileSync('templates/page.html', 'utf8');
    const requiredPlaceholders = [
        '{{SITE_TITLE}}',
        '{{PAGE_TITLE}}',
        '{{CONTENT}}',
        '{{NAVIGATION}}',
        '{{PAGE_CATEGORY}}'
    ];
    
    requiredPlaceholders.forEach(placeholder => {
        if (!template.includes(placeholder)) {
            throw new Error(`Missing placeholder: ${placeholder}`);
        }
    });
});

test('Template includes syntax highlighting CSS', () => {
    const template = fs.readFileSync('templates/page.html', 'utf8');
    if (!template.includes('highlight.js') && !template.includes('hljs')) {
        throw new Error('Template missing syntax highlighting CSS');
    }
});

// Issue #5: Build script integration
console.log('\n🔧 Issue #5: Build script integration');

test('Build.js uses new modules', () => {
    const buildContent = fs.readFileSync('scripts/build.js', 'utf8');
    
    const requiredImports = ['loadConfig', 'convertMarkdown', 'groupPagesByCategory'];
    requiredImports.forEach(imp => {
        if (!buildContent.includes(imp)) {
            throw new Error(`Missing import: ${imp}`);
        }
    });
});

test('Build.js has required functions', () => {
    const buildContent = fs.readFileSync('scripts/build.js', 'utf8');
    
    const requiredFunctions = ['copyStaticFiles', 'generateIndex', 'generateCategoryIndexes'];
    requiredFunctions.forEach(fn => {
        if (!buildContent.includes(fn)) {
            throw new Error(`Missing function: ${fn}`);
        }
    });
});

// Functional tests
console.log('\n⚙️  Functional Tests');

test('Config loading works', async () => {
    try {
        const { loadConfig } = require('./scripts/config');
        const config = await loadConfig();
        
        if (!config.site || !config.pages) {
            throw new Error('Config loading returned invalid structure');
        }
    } catch (error) {
        throw new Error(`Config loading failed: ${error.message}`);
    }
});

test('Category grouping works', () => {
    const { groupPagesByCategory } = require('./scripts/config');
    
    const testPages = [
        { path: 'docs/setup.md', title: 'Setup', category: '環境構築' },
        { path: 'docs/api.md', title: 'API', category: '仕様書' }
    ];
    
    const grouped = groupPagesByCategory(testPages);
    
    if (!grouped['環境構築'] || !grouped['仕様書']) {
        throw new Error('Category grouping failed');
    }
    
    if (grouped['環境構築'].length !== 1 || grouped['仕様書'].length !== 1) {
        throw new Error('Category grouping counts incorrect');
    }
});

test('Frontmatter extraction works', () => {
    const { extractFrontmatter } = require('./scripts/markdown');
    
    const testContent = `---
title: Test Page
author: Test Author
---

# Content

Test content here.`;
    
    const result = extractFrontmatter(testContent);
    
    if (!result.frontmatter.title || result.frontmatter.title !== 'Test Page') {
        throw new Error('Frontmatter extraction failed');
    }
    
    if (!result.content.includes('# Content')) {
        throw new Error('Content extraction failed');
    }
});

// Summary
console.log('\n' + '='.repeat(50));
console.log(`📊 Test Results: ${testsPassed} passed, ${testsFailed} failed`);

if (testsFailed === 0) {
    console.log('🎉 All Phase 3 requirements verified successfully!');
    console.log('\n✅ Ready to run: npm run build');
} else {
    console.log('❌ Some tests failed. Please review the implementation.');
    process.exit(1);
}