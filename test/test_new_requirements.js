// 新しい要件に基づく社内ドキュメントサイト機能のユニットテスト

// テストスイート
class TestSuite {
    constructor() {
        this.tests = [];
        this.passed = 0;
        this.failed = 0;
    }
    
    test(name, testFunction) {
        this.tests.push({ name, testFunction });
    }
    
    run() {
        console.log('🧪 Running Tests for Updated Requirements\n');
        
        this.tests.forEach(({ name, testFunction }) => {
            try {
                testFunction();
                console.log(`✅ ${name}`);
                this.passed++;
            } catch (error) {
                console.log(`❌ ${name}: ${error.message}`);
                this.failed++;
            }
        });
        
        console.log(`\n📊 Test Results: ${this.passed} passed, ${this.failed} failed`);
        return this.failed === 0;
    }
    
    assert(condition, message) {
        if (!condition) {
            throw new Error(message);
        }
    }
    
    assertEqual(actual, expected, message) {
        if (actual !== expected) {
            throw new Error(`${message}: expected ${expected}, got ${actual}`);
        }
    }
}

// テストスイートを初期化
const testSuite = new TestSuite();

// テスト1: ホーム画面の削除とサイドバー・ヘッダーのみの表示
testSuite.test('ホーム画面が削除され、サイドバー・ヘッダーのみ表示される', () => {
    // Node.js環境でのみ実行
    if (typeof require !== 'undefined') {
        try {
            const fs = require('fs');
            const indexContent = fs.readFileSync('index.html', 'utf8');
            
            // サイドバーとヘッダーの存在確認
            testSuite.assert(indexContent.includes('<aside class="sidebar"'), 'Index should contain sidebar');
            testSuite.assert(indexContent.includes('<header class="site-header"'), 'Index should contain header');
            
            // 古いホーム画面コンテンツの削除確認
            testSuite.assert(!indexContent.includes('class="tag"'), 'Index should not contain tag elements');
            testSuite.assert(!indexContent.includes('filterByTag'), 'Index should not contain tag filtering');
            testSuite.assert(!indexContent.includes('clearFilters'), 'Index should not contain clear filters');
            
            // 新しい構造の確認
            testSuite.assert(indexContent.includes('main-layout'), 'Index should use new main-layout structure');
            testSuite.assert(indexContent.includes('sidebar-content'), 'Index should have sidebar-content');
            
        } catch (error) {
            throw new Error(`Failed to read index.html: ${error.message}`);
        }
    }
});

// テスト2: サイドバー・ヘッダーの共通コンポーネント化
testSuite.test('サイドバー・ヘッダーが共通コンポーネント化されている', () => {
    // Node.js環境でのみ実行
    if (typeof require !== 'undefined') {
        try {
            const fs = require('fs');
            const indexContent = fs.readFileSync('index.html', 'utf8');
            const templateContent = fs.readFileSync('templates/page.html', 'utf8');
            const buildScript = fs.readFileSync('scripts/build.js', 'utf8');
            
            // 両方のファイルで同じヘッダー構造を使用
            testSuite.assert(indexContent.includes('<header class="site-header"'), 'Index should have site-header');
            testSuite.assert(templateContent.includes('<header class="site-header"'), 'Template should have site-header');
            
            // 両方のファイルで同じサイドバー構造を使用
            testSuite.assert(indexContent.includes('<aside class="sidebar" id="sidebar">'), 'Index should have sidebar');
            testSuite.assert(templateContent.includes('<aside class="sidebar" id="sidebar">'), 'Template should have sidebar');
            
            // ビルドスクリプトでサイドバー生成を使用
            testSuite.assert(buildScript.includes('generateEnhancedSidebar'), 'Build script should use generateEnhancedSidebar');
            
        } catch (error) {
            throw new Error(`Failed to verify common components: ${error.message}`);
        }
    }
});

// テスト3: タグ要素の削除とディレクトリ構造管理
testSuite.test('タグ要素が削除され、ディレクトリ構造管理のみ実施される', () => {
    // Node.js環境でのみ実行
    if (typeof require !== 'undefined') {
        try {
            const fs = require('fs');
            const mainJsContent = fs.readFileSync('assets/js/main.js', 'utf8');
            const indexContent = fs.readFileSync('index.html', 'utf8');
            
            // タグ関連機能の削除確認
            testSuite.assert(!mainJsContent.includes('filterByTag'), 'main.js should not contain filterByTag function');
            testSuite.assert(!mainJsContent.includes('clearFilters'), 'main.js should not contain clearFilters function');
            testSuite.assert(!indexContent.includes('class="tag"'), 'index.html should not contain tag elements');
            
            // ディレクトリ構造管理の確認
            testSuite.assert(mainJsContent.includes('siteConfig'), 'main.js should contain siteConfig');
            testSuite.assert(mainJsContent.includes('category'), 'main.js should use category-based organization');
            testSuite.assert(mainJsContent.includes('generateSidebarNavigation'), 'main.js should generate navigation from directory structure');
            testSuite.assert(mainJsContent.includes('generateCategoriesGrid'), 'main.js should generate categories grid');
            
        } catch (error) {
            throw new Error(`Failed to verify tag removal and directory structure: ${error.message}`);
        }
    }
});

// テスト4: サイドバーの検索バー追加とページタイトル部分一致
testSuite.test('サイドバーに検索バーが追加され、ページタイトル部分一致が可能', () => {
    // Node.js環境でのみ実行
    if (typeof require !== 'undefined') {
        try {
            const fs = require('fs');
            const indexContent = fs.readFileSync('index.html', 'utf8');
            const sidebarScript = fs.readFileSync('scripts/sidebar.js', 'utf8');
            const clientSidebar = fs.readFileSync('assets/js/sidebar.js', 'utf8');
            
            // 検索バーの存在確認
            testSuite.assert(indexContent.includes('placeholder="ページタイトルで検索..."'), 'Index should have search input with correct placeholder');
            testSuite.assert(indexContent.includes('class="search-input"'), 'Index should have search input element');
            testSuite.assert(indexContent.includes('class="search-results"'), 'Index should have search results container');
            
            // サーバーサイドでの検索プレースホルダー
            testSuite.assert(sidebarScript.includes('ページタイトルで検索...'), 'Sidebar script should use correct search placeholder');
            
            // クライアントサイドでの検索機能
            testSuite.assert(clientSidebar.includes('handleSearch'), 'Client sidebar should have handleSearch function');
            testSuite.assert(clientSidebar.includes('buildSearchData'), 'Client sidebar should build search data');
            testSuite.assert(clientSidebar.includes('title.toLowerCase().includes'), 'Client sidebar should support partial matching');
            
        } catch (error) {
            throw new Error(`Failed to verify search functionality: ${error.message}`);
        }
    }
});

// テスト5: 設定ファイルの構造確認
testSuite.test('設定ファイルがディレクトリ構造に基づいて構成されている', () => {
    // Node.js環境でのみ実行
    if (typeof require !== 'undefined') {
        try {
            const fs = require('fs');
            const configContent = fs.readFileSync('config/config.json', 'utf8');
            const config = JSON.parse(configContent);
            
            // 基本構造の確認
            testSuite.assert(config.site, 'Config should have site section');
            testSuite.assert(Array.isArray(config.pages), 'Config should have pages array');
            
            // ページにカテゴリが設定されていることを確認
            config.pages.forEach((page, index) => {
                testSuite.assert(page.category, `Page ${index} should have category`);
                testSuite.assert(page.title, `Page ${index} should have title`);
                testSuite.assert(page.path, `Page ${index} should have path`);
            });
            
            // カテゴリベースの組織化確認
            const categories = [...new Set(config.pages.map(page => page.category))];
            testSuite.assert(categories.length > 0, 'Should have at least one category');
            
        } catch (error) {
            throw new Error(`Failed to verify config structure: ${error.message}`);
        }
    }
});

// テスト6: ビルドスクリプトの更新確認
testSuite.test('ビルドスクリプトが新しい要件に対応している', () => {
    // Node.js環境でのみ実行
    if (typeof require !== 'undefined') {
        try {
            const fs = require('fs');
            const buildScript = fs.readFileSync('scripts/build.js', 'utf8');
            
            // 新しいインデックス生成の確認
            testSuite.assert(buildScript.includes('generateEnhancedSidebar'), 'Build script should use enhanced sidebar generation');
            testSuite.assert(buildScript.includes('main-layout'), 'Build script should generate new layout structure');
            testSuite.assert(buildScript.includes('sidebar-content'), 'Build script should include sidebar content');
            
            // サイドバー統合の確認
            testSuite.assert(buildScript.includes('./sidebar'), 'Build script should import sidebar module');
            testSuite.assert(buildScript.includes('sidebarHtml'), 'Build script should generate sidebar HTML');
            
        } catch (error) {
            throw new Error(`Failed to verify build script updates: ${error.message}`);
        }
    }
});

// テスト7: CSSスタイルの整合性確認
testSuite.test('CSSスタイルが新しい構造に対応している', () => {
    // Node.js環境でのみ実行
    if (typeof require !== 'undefined') {
        try {
            const fs = require('fs');
            const cssContent = fs.readFileSync('assets/css/style.css', 'utf8');
            
            // 必要なCSSクラスの存在確認
            testSuite.assert(cssContent.includes('.sidebar'), 'CSS should have sidebar styles');
            testSuite.assert(cssContent.includes('.site-header'), 'CSS should have site-header styles');
            testSuite.assert(cssContent.includes('.main-layout'), 'CSS should have main-layout styles');
            testSuite.assert(cssContent.includes('.sidebar-search'), 'CSS should have sidebar-search styles');
            testSuite.assert(cssContent.includes('.search-input'), 'CSS should have search-input styles');
            testSuite.assert(cssContent.includes('.search-results'), 'CSS should have search-results styles');
            
            // レスポンシブデザインの確認
            testSuite.assert(cssContent.includes('@media'), 'CSS should have responsive design');
            testSuite.assert(cssContent.includes('sidebar-open'), 'CSS should have mobile sidebar functionality');
            
        } catch (error) {
            throw new Error(`Failed to verify CSS styles: ${error.message}`);
        }
    }
});

// テスト8: JavaScript機能の整合性確認
testSuite.test('JavaScript機能が新しい要件に対応している', () => {
    // Node.js環境でのみ実行
    if (typeof require !== 'undefined') {
        try {
            const fs = require('fs');
            const mainJs = fs.readFileSync('assets/js/main.js', 'utf8');
            const sidebarJs = fs.readFileSync('assets/js/sidebar.js', 'utf8');
            
            // main.jsの新機能確認
            testSuite.assert(mainJs.includes('generateSidebarNavigation'), 'main.js should have sidebar navigation generation');
            testSuite.assert(mainJs.includes('generateCategoriesGrid'), 'main.js should have categories grid generation');
            testSuite.assert(mainJs.includes('convertPathToUrl'), 'main.js should have path conversion utility');
            
            // sidebar.jsの検索機能確認
            testSuite.assert(sidebarJs.includes('SidebarManager'), 'sidebar.js should have SidebarManager class');
            testSuite.assert(sidebarJs.includes('initializeSearch'), 'sidebar.js should initialize search');
            testSuite.assert(sidebarJs.includes('handleSearch'), 'sidebar.js should handle search');
            testSuite.assert(sidebarJs.includes('buildSearchData'), 'sidebar.js should build search data');
            
        } catch (error) {
            throw new Error(`Failed to verify JavaScript functionality: ${error.message}`);
        }
    }
});

// すべてのテストを実行
if (typeof module !== 'undefined' && module.exports) {
    // Node.js環境
    module.exports = { TestSuite, testSuite };
    
    // テストを実行
    const success = testSuite.run();
    process.exit(success ? 0 : 1);
} else {
    // ブラウザ環境
    testSuite.run();
}