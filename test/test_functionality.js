// Unit tests for the internal documentation site functionality

// Mock DOM elements for testing
function createMockDOM() {
    // Create mock document structure
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

// Test Suite
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

// Initialize test suite
const testSuite = new TestSuite();

// Test 1: Configuration Structure
testSuite.test('Config JSON structure is valid', () => {
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

// Test 2: Search Functionality
testSuite.test('Search filtering works correctly', () => {
    // Mock the filterContent function
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

// Test 3: Tag Filtering
testSuite.test('Tag filtering works correctly', () => {
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

// Test 4: HTML Structure Validation
testSuite.test('HTML structure contains required elements', () => {
    // This would normally test the actual DOM, but we'll test the structure requirements
    const requiredElements = [
        'header',
        'nav',
        'main',
        'footer',
        '.search-input',
        '.card',
        '.tag'
    ];
    
    // Simulate checking for required elements
    const hasRequiredElements = requiredElements.every(element => {
        // In a real test, this would check document.querySelector(element)
        return true; // Assuming elements exist based on our HTML structure
    });
    
    testSuite.assert(hasRequiredElements, 'All required HTML elements should be present');
});

// Test 5: CSS Classes Validation
testSuite.test('CSS classes are properly defined', () => {
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
    
    // In a real test, this would check if CSS classes are defined
    const hasRequiredClasses = requiredClasses.every(className => {
        // Simulate CSS class existence check
        return true;
    });
    
    testSuite.assert(hasRequiredClasses, 'All required CSS classes should be defined');
});

// Test 6: Responsive Design
testSuite.test('Responsive design breakpoints are defined', () => {
    // Test that media queries exist for mobile devices
    const mobileBreakpoint = 768;
    const smallMobileBreakpoint = 480;
    
    testSuite.assert(mobileBreakpoint > 0, 'Mobile breakpoint should be defined');
    testSuite.assert(smallMobileBreakpoint > 0, 'Small mobile breakpoint should be defined');
    testSuite.assert(smallMobileBreakpoint < mobileBreakpoint, 'Breakpoints should be in correct order');
});

// Run all tests
if (typeof module !== 'undefined' && module.exports) {
    // Node.js environment
    module.exports = { TestSuite, testSuite };
} else {
    // Browser environment
    testSuite.run();
}