/**
 * Client-side Sidebar Functionality
 * Handles mobile navigation, search, and interactive features
 */

class SidebarManager {
  constructor() {
    this.sidebar = null;
    this.overlay = null;
    this.searchInput = null;
    this.searchResults = null;
    this.isOpen = false;
    this.searchData = [];
    
    this.init();
  }
  
  /**
   * Initialize sidebar functionality
   */
  init() {
    this.sidebar = document.getElementById('sidebar');
    this.searchInput = document.querySelector('.search-input');
    this.searchResults = document.querySelector('.search-results');
    
    if (!this.sidebar) return;
    
    this.createOverlay();
    this.bindEvents();
    this.initializeSearch();
    this.initializeCategoryToggles();
    this.handleInitialState();
    
    console.log('Sidebar initialized');
  }
  
  /**
   * Create mobile overlay element
   */
  createOverlay() {
    this.overlay = document.createElement('div');
    this.overlay.className = 'sidebar-overlay';
    this.overlay.setAttribute('aria-hidden', 'true');
    document.body.appendChild(this.overlay);
  }
  
  /**
   * Bind event listeners
   */
  bindEvents() {
    // Mobile menu toggle buttons
    const menuButtons = document.querySelectorAll('[onclick="toggleSidebar()"]');
    menuButtons.forEach(button => {
      button.removeAttribute('onclick');
      button.addEventListener('click', (e) => {
        e.preventDefault();
        this.toggle();
      });
    });
    
    // Close button
    const closeButton = document.querySelector('.sidebar-close');
    if (closeButton) {
      closeButton.addEventListener('click', () => this.close());
    }
    
    // Overlay click to close
    if (this.overlay) {
      this.overlay.addEventListener('click', () => this.close());
    }
    
    // Escape key to close
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.close();
      }
    });
    
    // Handle window resize
    window.addEventListener('resize', () => this.handleResize());
    
    // Prevent body scroll when sidebar is open on mobile
    document.addEventListener('touchmove', (e) => {
      if (this.isOpen && window.innerWidth <= 1024) {
        if (!this.sidebar.contains(e.target)) {
          e.preventDefault();
        }
      }
    }, { passive: false });
  }
  
  /**
   * Initialize search functionality
   */
  initializeSearch() {
    if (!this.searchInput) return;
    
    // Build search data from navigation links
    this.buildSearchData();
    
    // Search input event
    this.searchInput.addEventListener('input', (e) => {
      this.handleSearch(e.target.value);
    });
    
    // Clear search on focus
    this.searchInput.addEventListener('focus', () => {
      if (this.searchResults) {
        this.searchResults.innerHTML = '';
      }
    });
    
    // Handle search keyboard navigation
    this.searchInput.addEventListener('keydown', (e) => {
      this.handleSearchKeyboard(e);
    });
  }
  
  /**
   * Initialize category toggle functionality
   */
  initializeCategoryToggles() {
    const categoryToggles = this.sidebar.querySelectorAll('.nav-category-toggle');
    
    categoryToggles.forEach(toggle => {
      toggle.addEventListener('click', (e) => {
        e.preventDefault();
        this.toggleCategory(toggle);
      });
      
      // Handle keyboard navigation
      toggle.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.toggleCategory(toggle);
        }
      });
    });
  }
  
  /**
   * Toggle category expand/collapse
   * @param {HTMLElement} toggle - Toggle button element
   */
  toggleCategory(toggle) {
    const category = toggle.closest('.nav-category');
    const isExpanded = category.classList.contains('expanded');
    
    if (isExpanded) {
      category.classList.remove('expanded');
      toggle.setAttribute('aria-expanded', 'false');
    } else {
      category.classList.add('expanded');
      toggle.setAttribute('aria-expanded', 'true');
    }
    
    // Store state in sessionStorage for persistence during navigation
    const categoryId = category.getAttribute('data-category');
    if (categoryId) {
      const expandedCategories = this.getExpandedCategories();
      if (isExpanded) {
        expandedCategories.delete(categoryId);
      } else {
        expandedCategories.add(categoryId);
      }
      this.saveExpandedCategories(expandedCategories);
    }
  }
  
  /**
   * Get expanded categories from sessionStorage
   * @returns {Set} Set of expanded category IDs
   */
  getExpandedCategories() {
    const stored = sessionStorage.getItem('expandedCategories');
    return stored ? new Set(JSON.parse(stored)) : new Set();
  }
  
  /**
   * Save expanded categories to sessionStorage
   * @param {Set} expandedCategories - Set of expanded category IDs
   */
  saveExpandedCategories(expandedCategories) {
    sessionStorage.setItem('expandedCategories', JSON.stringify([...expandedCategories]));
  }
  
  /**
   * Restore expanded state from sessionStorage
   */
  restoreExpandedState() {
    const expandedCategories = this.getExpandedCategories();
    
    expandedCategories.forEach(categoryId => {
      const category = this.sidebar.querySelector(`[data-category="${categoryId}"]`);
      const toggle = category?.querySelector('.nav-category-toggle');
      
      if (category && toggle && !category.classList.contains('expanded')) {
        category.classList.add('expanded');
        toggle.setAttribute('aria-expanded', 'true');
      }
    });
  }
  
  /**
   * Build search data from navigation
   */
  buildSearchData() {
    const navLinks = this.sidebar.querySelectorAll('.nav-category-list a');
    this.searchData = Array.from(navLinks).map(link => ({
      title: link.textContent.trim(),
      url: link.getAttribute('href'),
      category: link.closest('.nav-category').querySelector('.nav-category-title').textContent.trim(),
      element: link
    }));
  }
  
  /**
   * Handle search input
   * @param {string} query - Search query
   */
  handleSearch(query) {
    if (!this.searchResults) return;
    
    const trimmedQuery = query.trim().toLowerCase();
    
    if (trimmedQuery.length < 2) {
      this.searchResults.innerHTML = '';
      this.restoreCategoriesAfterSearch();
      return;
    }
    
    // Filter search results
    const results = this.searchData.filter(item => 
      item.title.toLowerCase().includes(trimmedQuery) ||
      item.category.toLowerCase().includes(trimmedQuery)
    );
    
    this.displaySearchResults(results, trimmedQuery);
    this.hideAllCategories();
  }
  
  /**
   * Display search results
   * @param {Array} results - Search results
   * @param {string} query - Search query
   */
  displaySearchResults(results, query) {
    if (results.length === 0) {
      this.searchResults.innerHTML = `
        <div class="search-no-results">
          <p>「${query}」に一致するドキュメントが見つかりませんでした。</p>
        </div>
      `;
      return;
    }
    
    let html = '<div class="search-results-list">';
    html += `<div class="search-results-header">${results.length}件の結果</div>`;
    
    results.forEach(result => {
      const highlightedTitle = this.highlightText(result.title, query);
      html += `
        <div class="search-result-item">
          <a href="${result.url}" class="search-result-link">
            <div class="search-result-title">${highlightedTitle}</div>
            <div class="search-result-category">${result.category}</div>
          </a>
        </div>
      `;
    });
    
    html += '</div>';
    this.searchResults.innerHTML = html;
    
    // Add click handlers to search results
    this.searchResults.querySelectorAll('.search-result-link').forEach(link => {
      link.addEventListener('click', () => {
        if (window.innerWidth <= 1024) {
          this.close();
        }
      });
    });
  }
  
  /**
   * Highlight search terms in text
   * @param {string} text - Text to highlight
   * @param {string} query - Search query
   * @returns {string} Highlighted text
   */
  highlightText(text, query) {
    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
  }
  
  /**
   * Handle search keyboard navigation
   * @param {KeyboardEvent} e - Keyboard event
   */
  handleSearchKeyboard(e) {
    const results = this.searchResults.querySelectorAll('.search-result-link');
    if (results.length === 0) return;
    
    let currentIndex = -1;
    const currentActive = this.searchResults.querySelector('.search-result-link.keyboard-focus');
    
    if (currentActive) {
      currentIndex = Array.from(results).indexOf(currentActive);
      currentActive.classList.remove('keyboard-focus');
    }
    
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        currentIndex = Math.min(currentIndex + 1, results.length - 1);
        break;
      case 'ArrowUp':
        e.preventDefault();
        currentIndex = Math.max(currentIndex - 1, -1);
        break;
      case 'Enter':
        if (currentActive) {
          e.preventDefault();
          currentActive.click();
        }
        return;
      default:
        return;
    }
    
    if (currentIndex >= 0) {
      results[currentIndex].classList.add('keyboard-focus');
      results[currentIndex].scrollIntoView({ block: 'nearest' });
    }
  }
  
  /**
   * Show all navigation categories (expand for search)
   */
  showAllCategories() {
    const categories = this.sidebar.querySelectorAll('.nav-category');
    categories.forEach(category => {
      category.style.display = 'flex';
      // Temporarily expand all categories for search visibility
      if (!category.classList.contains('expanded')) {
        category.classList.add('search-expanded');
        category.classList.add('expanded');
        const toggle = category.querySelector('.nav-category-toggle');
        if (toggle) {
          toggle.setAttribute('aria-expanded', 'true');
        }
      }
    });
  }
  
  /**
   * Hide all navigation categories
   */
  hideAllCategories() {
    const categories = this.sidebar.querySelectorAll('.nav-category');
    categories.forEach(category => {
      category.style.display = 'none';
    });
  }
  
  /**
   * Restore categories to their original state after search
   */
  restoreCategoriesAfterSearch() {
    const categories = this.sidebar.querySelectorAll('.nav-category');
    categories.forEach(category => {
      category.style.display = 'flex';
      // Remove temporary search expansion
      if (category.classList.contains('search-expanded')) {
        category.classList.remove('search-expanded');
        category.classList.remove('expanded');
        const toggle = category.querySelector('.nav-category-toggle');
        if (toggle) {
          toggle.setAttribute('aria-expanded', 'false');
        }
      }
    });
    
    // Restore the actual expanded state
    this.restoreExpandedState();
  }
  
  /**
   * Toggle sidebar open/close
   */
  toggle() {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }
  
  /**
   * Open sidebar
   */
  open() {
    if (this.isOpen) return;
    
    this.sidebar.classList.add('sidebar-open');
    this.overlay.classList.add('active');
    this.overlay.setAttribute('aria-hidden', 'false');
    
    // Prevent body scroll on mobile
    if (window.innerWidth <= 1024) {
      document.body.style.overflow = 'hidden';
    }
    
    // Focus management
    const firstFocusable = this.sidebar.querySelector('a, button, input, [tabindex]:not([tabindex="-1"])');
    if (firstFocusable) {
      setTimeout(() => firstFocusable.focus(), 100);
    }
    
    this.isOpen = true;
    this.announceToScreenReader('サイドバーが開きました');
  }
  
  /**
   * Close sidebar
   */
  close() {
    if (!this.isOpen) return;
    
    this.sidebar.classList.remove('sidebar-open');
    this.overlay.classList.remove('active');
    this.overlay.setAttribute('aria-hidden', 'true');
    
    // Restore body scroll
    document.body.style.overflow = '';
    
    // Clear search
    if (this.searchInput) {
      this.searchInput.value = '';
      if (this.searchResults) {
        this.searchResults.innerHTML = '';
      }
      this.restoreCategoriesAfterSearch();
    }
    
    this.isOpen = false;
    this.announceToScreenReader('サイドバーが閉じました');
  }
  
  /**
   * Handle window resize
   */
  handleResize() {
    if (window.innerWidth > 1024 && this.isOpen) {
      // Desktop view - ensure sidebar is properly displayed
      this.sidebar.classList.remove('sidebar-open');
      this.overlay.classList.remove('active');
      document.body.style.overflow = '';
      this.isOpen = false;
    }
  }
  
  /**
   * Handle initial state based on screen size
   */
  handleInitialState() {
    if (window.innerWidth <= 1024) {
      this.close();
    }
    
    // Restore expanded state from sessionStorage
    this.restoreExpandedState();
  }
  
  /**
   * Announce changes to screen readers
   * @param {string} message - Message to announce
   */
  announceToScreenReader(message) {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  }
}

// Global function for backward compatibility
window.toggleSidebar = function() {
  if (window.sidebarManager) {
    window.sidebarManager.toggle();
  }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  window.sidebarManager = new SidebarManager();
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SidebarManager;
}