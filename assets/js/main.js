// Main JavaScript file for the internal documentation site

// Configuration data - in a real application, this would be loaded from config.json
const siteConfig = {
    "site": {
        "title": "社内手順書・仕様書",
        "description": "社内向け技術文書管理システム",
        "baseUrl": "/"
    },
    "pages": [
        {
            "path": "docs/README.md",
            "title": "ドキュメント一覧",
            "category": "概要"
        },
        {
            "path": "docs/setup/environment.md",
            "title": "開発環境セットアップ",
            "category": "環境構築"
        },
        {
            "path": "docs/setup/deployment.md",
            "title": "デプロイメント手順",
            "category": "環境構築"
        },
        {
            "path": "docs/setup.md",
            "title": "環境セットアップ手順",
            "category": "環境構築"
        },
        {
            "path": "docs/setup/windows.md",
            "title": "Windows環境構築",
            "category": "環境構築"
        },
        {
            "path": "docs/setup/macos.md",
            "title": "macOS環境構築",
            "category": "環境構築"
        },
        {
            "path": "docs/api/authentication.md",
            "title": "API認証仕様",
            "category": "API"
        },
        {
            "path": "docs/api/endpoints.md",
            "title": "APIエンドポイント仕様",
            "category": "API"
        },
        {
            "path": "docs/api-spec.md",
            "title": "API仕様書",
            "category": "API"
        },
        {
            "path": "docs/guides/troubleshooting.md",
            "title": "トラブルシューティングガイド",
            "category": "ガイド"
        },
        {
            "path": "docs/guides/best-practices.md",
            "title": "ベストプラクティス",
            "category": "ガイド"
        }
    ]
};

document.addEventListener('DOMContentLoaded', function() {
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

// Generate sidebar navigation based on directory structure
function generateSidebarNavigation() {
    const navigationContainer = document.getElementById('navigation');
    if (!navigationContainer) return;
    
    // Group pages by category
    const categories = {};
    siteConfig.pages.forEach(page => {
        if (!categories[page.category]) {
            categories[page.category] = [];
        }
        categories[page.category].push(page);
    });
    
    // Generate navigation HTML
    let navigationHTML = '';
    Object.keys(categories).forEach(categoryName => {
        const categoryId = categoryName.replace(/\s+/g, '-').toLowerCase();
        navigationHTML += `
            <div class="nav-category expanded" data-category="${categoryId}">
                <button class="nav-category-toggle" aria-expanded="true">
                    <h3 class="nav-category-title">${categoryName}</h3>
                    <span class="nav-category-icon">▼</span>
                </button>
                <ul class="nav-category-list">
        `;
        
        categories[categoryName].forEach(page => {
            const pageUrl = convertPathToUrl(page.path);
            navigationHTML += `
                <li>
                    <a href="${pageUrl}">${page.title}</a>
                </li>
            `;
        });
        
        navigationHTML += `
                </ul>
            </div>
        `;
    });
    
    navigationContainer.innerHTML = navigationHTML;
}

// Generate categories grid for the main content area
function generateCategoriesGrid() {
    const categoriesGrid = document.getElementById('categories-grid');
    if (!categoriesGrid) return;
    
    // Group pages by category
    const categories = {};
    siteConfig.pages.forEach(page => {
        if (!categories[page.category]) {
            categories[page.category] = [];
        }
        categories[page.category].push(page);
    });
    
    // Generate categories grid HTML
    let gridHTML = '';
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