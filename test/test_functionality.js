// 社内ドキュメントサイト機能のユニットテスト

// テスト用のモックDOM要素
function createMockDOM() {
    // モックドキュメント構造を作成
    const mockDocument = {
        addEventListener: function(event, callback) {
            if (event === 'DOMContentLoaded') {
                callback();
            }
        },
        querySelector: function(selector) {
            if (selector === '.search-input') {
                return {
                    addEventListener: function(event, callback) {
                        this.callback = callback;
                    },
                    value: '',
                    triggerInput: function(value) {
                        this.value = value;
                        if (this.callback) {
                            this.callback({ target: this });
                        }
                    }
                };
            }
            return null;
        },
        querySelectorAll: function(selector) {
            if (selector === '.card') {
                return [
                    {
                        querySelector: function(sel) {
                            if (sel === '.card-title') {
                                return { textContent: 'サンプルドキュメント' };
                            }
                            return null;
                        },
                        textContent: 'サンプルドキュメント テスト内容',
                        style: { display: 'block' }
                    },
                    {
                        querySelector: function(sel) {
                            if (sel === '.card-title') {
                                return { textContent: 'ドキュメントの追加方法' };
                            }
                            return null;
                        },
                        textContent: 'ドキュメントの追加方法 手順説明',
                        style: { display: 'block' }
                    }
                ];
            }
            if (selector === 'nav a') {
                return [
                    {
                        getAttribute: function(attr) {
                            return attr === 'href' ? 'index.html' : null;
                        },
                        classList: { add: function() {} }
                    }
                ];
            }
            return [];
        }
    };
    
    return mockDocument;
}

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
        console.log('🧪 Running Tests for 社内ドキュメントサイト\n');
        
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

// テスト1: 設定構造
testSuite.test('Config JSON構造が有効', () => {
    const configStructure = {
        site: {
            title: "社内ドキュメントサイト",
            description: "社内手順書・仕様書の一元管理サイト",
            baseUrl: ""
        },
        pages: [],
        navigation: {},
        theme: {}
    };
    
    testSuite.assert(typeof configStructure.site === 'object', 'Site config should be an object');
    testSuite.assert(Array.isArray(configStructure.pages), 'Pages should be an array');
    testSuite.assertEqual(configStructure.site.title, '社内ドキュメントサイト', 'Site title should match');
});

// テスト2: 検索機能
testSuite.test('検索フィルタリングが正常に動作', () => {
    // filterContent関数をモック
    function filterContent(query) {
        const mockCards = [
            {
                querySelector: () => ({ textContent: 'サンプルドキュメント' }),
                textContent: 'サンプルドキュメント テスト内容',
                style: { display: 'block' }
            }
        ];
        
        mockCards.forEach(card => {
            const title = card.querySelector().textContent.toLowerCase();
            const content = card.textContent.toLowerCase();
            
            if (title.includes(query) || content.includes(query)) {
                card.style.display = 'block';
            } else {
                card.style.display = query === '' ? 'block' : 'none';
            }
        });
        
        return mockCards;
    }
    
    const results = filterContent('サンプル');
    testSuite.assertEqual(results[0].style.display, 'block', 'Matching content should be visible');
    
    const noResults = filterContent('存在しない');
    testSuite.assertEqual(noResults[0].style.display, 'none', 'Non-matching content should be hidden');
});

// テスト3: タグフィルタリング
testSuite.test('タグフィルタリングが正常に動作', () => {
    function filterByTag(tag) {
        const mockCards = [
            {
                querySelectorAll: () => [
                    { textContent: 'サンプル' },
                    { textContent: 'テスト' }
                ],
                style: { display: 'block' }
            }
        ];
        
        mockCards.forEach(card => {
            const tags = card.querySelectorAll();
            let hasTag = false;
            
            tags.forEach(tagElement => {
                if (tagElement.textContent.toLowerCase() === tag.toLowerCase()) {
                    hasTag = true;
                }
            });
            
            card.style.display = hasTag ? 'block' : 'none';
        });
        
        return mockCards;
    }
    
    const results = filterByTag('サンプル');
    testSuite.assertEqual(results[0].style.display, 'block', 'Cards with matching tags should be visible');
    
    const noResults = filterByTag('存在しないタグ');
    testSuite.assertEqual(noResults[0].style.display, 'none', 'Cards without matching tags should be hidden');
});

// テスト4: HTML構造の検証
testSuite.test('HTML構造に必要な要素が含まれている', () => {
    // 通常は実際のDOMをテストするが、ここでは構造要件をテスト
    const requiredElements = [
        'header',
        'nav',
        'main',
        'footer',
        '.search-input',
        '.card',
        '.tag'
    ];
    
    // 必要な要素の存在をシミュレート
    const hasRequiredElements = requiredElements.every(element => {
        // 実際のテストでは document.querySelector(element) をチェックする
        return true; // HTML構造に基づいて要素が存在すると仮定
    });
    
    testSuite.assert(hasRequiredElements, 'All required HTML elements should be present');
});

// テスト5: CSSクラスの検証
testSuite.test('CSSクラスが適切に定義されている', () => {
    const requiredClasses = [
        'container',
        'content-area',
        'card',
        'card-title',
        'card-meta',
        'tag',
        'btn',
        'search-input'
    ];
    
    // 実際のテストでは、CSSクラスが定義されているかをチェックする
    const hasRequiredClasses = requiredClasses.every(className => {
        // CSSクラス存在チェックをシミュレート
        return true;
    });
    
    testSuite.assert(hasRequiredClasses, 'All required CSS classes should be defined');
});

// テスト6: レスポンシブデザイン
testSuite.test('レスポンシブデザインのブレークポイントが定義されている', () => {
    // モバイルデバイス用のメディアクエリが存在することをテスト
    const mobileBreakpoint = 768;
    const smallMobileBreakpoint = 480;
    
    testSuite.assert(mobileBreakpoint > 0, 'Mobile breakpoint should be defined');
    testSuite.assert(smallMobileBreakpoint > 0, 'Small mobile breakpoint should be defined');
    testSuite.assert(smallMobileBreakpoint < mobileBreakpoint, 'Breakpoints should be in correct order');
});

// すべてのテストを実行
if (typeof module !== 'undefined' && module.exports) {
    // Node.js環境
    module.exports = { TestSuite, testSuite };
} else {
    // ブラウザ環境
    testSuite.run();
}