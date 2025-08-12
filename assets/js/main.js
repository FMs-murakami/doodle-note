// Main JavaScript file for the internal documentation site

document.addEventListener('DOMContentLoaded', function() {
    // Initialize the site
    initializeSearch();
    initializeNavigation();
    
    console.log('社内ドキュメントサイト initialized');
});

// Search functionality
function initializeSearch() {
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            const query = e.target.value.toLowerCase();
            filterContent(query);
        });
    }
}

// Filter content based on search query
function filterContent(query) {
    const cards = document.querySelectorAll('.card');
    
    cards.forEach(card => {
        const title = card.querySelector('.card-title')?.textContent.toLowerCase() || '';
        const content = card.textContent.toLowerCase();
        
        if (title.includes(query) || content.includes(query)) {
            card.style.display = 'block';
        } else {
            card.style.display = query === '' ? 'block' : 'none';
        }
    });
}

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
}

// Tag filtering
function filterByTag(tag) {
    const cards = document.querySelectorAll('.card');
    
    cards.forEach(card => {
        const tags = card.querySelectorAll('.tag');
        let hasTag = false;
        
        tags.forEach(tagElement => {
            if (tagElement.textContent.toLowerCase() === tag.toLowerCase()) {
                hasTag = true;
            }
        });
        
        card.style.display = hasTag ? 'block' : 'none';
    });
}

// Clear all filters
function clearFilters() {
    const cards = document.querySelectorAll('.card');
    const searchInput = document.querySelector('.search-input');
    
    cards.forEach(card => {
        card.style.display = 'block';
    });
    
    if (searchInput) {
        searchInput.value = '';
    }
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