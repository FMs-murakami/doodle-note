// Main JavaScript file for the internal documentation site

// Load configuration from server
let siteConfig = null;

// Initialize configuration loading
async function loadSiteConfig() {
    try {
        const response = await fetch('config/config.json');
        siteConfig = await response.json();
    } catch (error) {
        console.warn('Could not load config.json, using fallback configuration');
        // Fallback configuration matching the server-side structure
        siteConfig = {
            "site": {
                "title": "社内手順書・仕様書",
                "description": "社内向け技術文書管理システム",
                "baseUrl": "/"
            },
            "pages": [
                {
                    "path": "docs/README.md",
                    "title": "README"
                },
                {
                    "category": "開発関連",
                    "pages": [
                        {
                            "path": "docs/setup/environment.md",
                            "title": "開発環境セットアップ"
                        },
                        {
                            "path": "docs/setup/deployment.md",
                            "title": "デプロイメント手順"
                        },
                        {
                            "path": "docs/setup.md",
                            "title": "環境セットアップ手順"
                        },
                        {
                            "category": "sub",
                            "pages": [
                                {
                                    "path": "docs/setup/windows.md",
                                    "title": "Windows環境構築"
                                },
                                {
                                    "path": "docs/setup/macos.md",
                                    "title": "macOS環境構築"
                                }
                            ]
                        }
                    ]
                },
                {
                    "category": "API",
                    "pages": [
                        {
                            "path": "docs/api/authentication.md",
                            "title": "API認証仕様"
                        },
                        {
                            "path": "docs/api/endpoints.md",
                            "title": "APIエンドポイント仕様"
                        },
                        {
                            "path": "docs/api-spec.md",
                            "title": "API仕様書"
                        }
                    ]
                },
                {
                    "category": "ガイド",
                    "pages": [
                        {
                            "path": "docs/guides/troubleshooting.md",
                            "title": "トラブルシューティングガイド"
                        },
                        {
                            "path": "docs/guides/best-practices.md",
                            "title": "ベストプラクティス"
                        }
                    ]
                }
            ]
        };
    }
}

document.addEventListener('DOMContentLoaded', async function() {
    // Load configuration first
    await loadSiteConfig();
    
    // Initialize the site
    initializeNavigation();
    generateCategoriesGrid();
    
    console.log('社内ドキュメントサイト initialized');
});

// Navigation functionality
function initializeNavigation() {
    // Add active class to current page
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('nav a');
    
    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('active');
        }
    });
    
    // Generate sidebar navigation
    generateSidebarNavigation();
}

// Generate sidebar navigation based on hierarchical structure (matching server-side)
function generateSidebarNavigation() {
    const navigationContainer = document.getElementById('navigation');
    if (!navigationContainer || !siteConfig) return;
    
    // Generate navigation HTML using the same structure as server-side
    let navigationHTML = '';
    
    siteConfig.pages.forEach((item, index) => {
        if (item.path && item.title) {
            // This is a top-level page (no category)
            const pageUrl = convertPathToUrl(item.path);
            navigationHTML += `
                <div class="nav-item">
                    <a href="${pageUrl}">${item.title}</a>
                </div>
            `;
        } else if (item.category && item.pages) {
            // This is a category with pages
            navigationHTML += generateCategorySection(item, 0);
        }
    });
    
    navigationContainer.innerHTML = navigationHTML;
}

// Generate a category section with collapsible functionality using details/summary
function generateCategorySection(category, level = 0) {
    const categoryId = category.category.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const levelClass = level > 0 ? ` nav-category-level-${level}` : '';
    
    let html = `
        <details class="nav-category${levelClass}" data-category="${categoryId}" open>
            <summary class="nav-category-summary">
                <h3 class="nav-category-title">${category.category}</h3>
                <span class="nav-category-icon">▼</span>
            </summary>
            <ul class="nav-category-list">
    `;
    
    // Process pages in this category
    category.pages.forEach(item => {
        if (item.path && item.title) {
            // Regular page
            const pageUrl = convertPathToUrl(item.path);
            html += `
                <li>
                    <a href="${pageUrl}">${item.title}</a>
                </li>
            `;
        } else if (item.category && item.pages) {
            // Nested category
            html += generateCategorySection(item, level + 1);
        }
    });
    
    html += `
            </ul>
        </details>
    `;
    
    return html;
}

// Generate categories grid for the main content area
function generateCategoriesGrid() {
    const categoriesGrid = document.getElementById('categories-grid');
    if (!categoriesGrid || !siteConfig) return;
    
    // Generate categories grid HTML from hierarchical structure
    let gridHTML = '';
    
    // Helper function to collect all pages from hierarchical structure
    function collectPages(items, categoryName = null) {
        const pages = [];
        items.forEach(item => {
            if (item.path && item.title) {
                pages.push({
                    ...item,
                    category: categoryName || 'その他'
                });
            } else if (item.category && item.pages) {
                pages.push(...collectPages(item.pages, item.category));
            }
        });
        return pages;
    }
    
    // Collect all pages and group by category
    const allPages = collectPages(siteConfig.pages);
    const categories = {};
    
    allPages.forEach(page => {
        if (!categories[page.category]) {
            categories[page.category] = [];
        }
        categories[page.category].push(page);
    });
    
    // Generate grid HTML
    Object.keys(categories).forEach(categoryName => {
        gridHTML += `
            <div class="category-section">
                <h3 class="category-title">${categoryName}</h3>
                <div class="category-pages">
        `;
        
        categories[categoryName].forEach(page => {
            const pageUrl = convertPathToUrl(page.path);
            gridHTML += `
                <div class="page-card">
                    <h4 class="page-title">
                        <a href="${pageUrl}">${page.title}</a>
                    </h4>
                    <p class="page-category">${page.category}</p>
                </div>
            `;
        });
        
        gridHTML += `
                </div>
            </div>
        `;
    });
    
    categoriesGrid.innerHTML = gridHTML;
}

// Convert markdown file path to HTML URL
function convertPathToUrl(path) {
    // Convert docs/path/file.md to docs/path/file.html
    return path.replace(/\.md$/, '.html');
}

// Utility function to show loading state
function showLoading() {
    const main = document.querySelector('main');
    if (main) {
        main.innerHTML = '<div class="text-center"><p>読み込み中...</p></div>';
    }
}

// Utility function to hide loading state
function hideLoading() {
    // Implementation depends on the specific loading mechanism
    console.log('Loading hidden');
}