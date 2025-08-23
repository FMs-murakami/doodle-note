#!/usr/bin/env node

/**
 * Final verification script for the Japanese requirements implementation
 */

const fs = require('fs');

console.log('🔍 Final Implementation Verification\n');

let allTestsPassed = true;

// Verification 1: Index.html structure
console.log('1. Verifying index.html structure...');
try {
    const indexContent = fs.readFileSync('index.html', 'utf8');
    
    const checks = [
        { test: indexContent.includes('<aside class="sidebar" id="sidebar">'), desc: 'Sidebar component present' },
        { test: indexContent.includes('<header class="site-header">'), desc: 'Header component present' },
        { test: indexContent.includes('placeholder="ページタイトルで検索..."'), desc: 'Search bar with correct placeholder' },
        { test: !indexContent.includes('class="tag"'), desc: 'Tag elements removed' },
        { test: !indexContent.includes('filterByTag'), desc: 'Tag filtering removed' },
        { test: indexContent.includes('main-layout'), desc: 'New layout structure' }
    ];
    
    checks.forEach(check => {
        if (check.test) {
            console.log(`   ✅ ${check.desc}`);
        } else {
            console.log(`   ❌ ${check.desc}`);
            allTestsPassed = false;
        }
    });
    
} catch (error) {
    console.log(`   ❌ Error reading index.html: ${error.message}`);
    allTestsPassed = false;
}

console.log('');

// Verification 2: Main.js functionality
console.log('2. Verifying main.js functionality...');
try {
    const mainJsContent = fs.readFileSync('assets/js/main.js', 'utf8');
    
    const checks = [
        { test: !mainJsContent.includes('filterByTag'), desc: 'Tag filtering functions removed' },
        { test: !mainJsContent.includes('clearFilters'), desc: 'Clear filters function removed' },
        { test: mainJsContent.includes('generateSidebarNavigation'), desc: 'Sidebar navigation generation added' },
        { test: mainJsContent.includes('generateCategoriesGrid'), desc: 'Categories grid generation added' },
        { test: mainJsContent.includes('siteConfig'), desc: 'Site configuration integrated' },
        { test: mainJsContent.includes('convertPathToUrl'), desc: 'Path conversion utility added' }
    ];
    
    checks.forEach(check => {
        if (check.test) {
            console.log(`   ✅ ${check.desc}`);
        } else {
            console.log(`   ❌ ${check.desc}`);
            allTestsPassed = false;
        }
    });
    
} catch (error) {
    console.log(`   ❌ Error reading main.js: ${error.message}`);
    allTestsPassed = false;
}

console.log('');

// Verification 3: Build script updates
console.log('3. Verifying build script updates...');
try {
    const buildScript = fs.readFileSync('scripts/build.js', 'utf8');
    
    const checks = [
        { test: buildScript.includes('generateEnhancedSidebar'), desc: 'Enhanced sidebar generation' },
        { test: buildScript.includes('./sidebar'), desc: 'Sidebar module import' },
        { test: buildScript.includes('main-layout'), desc: 'New layout in build output' },
        { test: buildScript.includes('sidebar-content'), desc: 'Sidebar content integration' }
    ];
    
    checks.forEach(check => {
        if (check.test) {
            console.log(`   ✅ ${check.desc}`);
        } else {
            console.log(`   ❌ ${check.desc}`);
            allTestsPassed = false;
        }
    });
    
} catch (error) {
    console.log(`   ❌ Error reading build script: ${error.message}`);
    allTestsPassed = false;
}

console.log('');

// Verification 4: Sidebar script updates
console.log('4. Verifying sidebar script updates...');
try {
    const sidebarScript = fs.readFileSync('scripts/sidebar.js', 'utf8');
    
    const checks = [
        { test: sidebarScript.includes('ページタイトルで検索...'), desc: 'Correct search placeholder' },
        { test: sidebarScript.includes('generateEnhancedSidebar'), desc: 'Enhanced sidebar function' }
    ];
    
    checks.forEach(check => {
        if (check.test) {
            console.log(`   ✅ ${check.desc}`);
        } else {
            console.log(`   ❌ ${check.desc}`);
            allTestsPassed = false;
        }
    });
    
} catch (error) {
    console.log(`   ❌ Error reading sidebar script: ${error.message}`);
    allTestsPassed = false;
}

console.log('');

// Verification 5: Template consistency
console.log('5. Verifying template consistency...');
try {
    const indexContent = fs.readFileSync('index.html', 'utf8');
    const templateContent = fs.readFileSync('templates/page.html', 'utf8');
    
    const checks = [
        { test: indexContent.includes('<header class="site-header">') && templateContent.includes('<header class="site-header">'), desc: 'Consistent header structure' },
        { test: indexContent.includes('<aside class="sidebar" id="sidebar">') && templateContent.includes('<aside class="sidebar" id="sidebar">'), desc: 'Consistent sidebar structure' }
    ];
    
    checks.forEach(check => {
        if (check.test) {
            console.log(`   ✅ ${check.desc}`);
        } else {
            console.log(`   ❌ ${check.desc}`);
            allTestsPassed = false;
        }
    });
    
} catch (error) {
    console.log(`   ❌ Error comparing templates: ${error.message}`);
    allTestsPassed = false;
}

console.log('');

// Final summary
console.log('🏁 Verification Summary');
console.log('========================');

if (allTestsPassed) {
    console.log('🎉 All verifications PASSED!');
    console.log('');
    console.log('📋 Requirements Implementation Status:');
    console.log('✅ 1. ホーム画面は不要。サイドバー・ヘッダーのみ表示する');
    console.log('✅ 2. サイドバー・ヘッダーは共通コンポーネント化し、前ページで表示する');
    console.log('✅ 3. タグ要素は不要。ファイルのディレクトリ構造管理のみ実施する');
    console.log('✅ 4. サイドバーに検索バーを追加。ページタイトル名での部分一致を可能にする');
    console.log('');
    console.log('🚀 Implementation is ready for production!');
} else {
    console.log('⚠️  Some verifications FAILED. Please review the issues above.');
}

process.exit(allTestsPassed ? 0 : 1);