/**
 * Dynamic Sidebar Generation Module
 * Handles category-based navigation generation with enhanced features
 */

const fs = require('fs-extra');
const path = require('path');

/**
 * Group pages by category with enhanced sorting
 * @param {Array} pages - Array of page objects
 * @returns {Object} Pages grouped by category
 */
function groupByCategory(pages) {
  const grouped = {};
  
  pages.forEach(page => {
    const category = page.category || '未分類';
    if (!grouped[category]) {
      grouped[category] = [];
    }
    grouped[category].push(page);
  });
  
  // Sort pages within each category by title
  Object.keys(grouped).forEach(category => {
    grouped[category].sort((a, b) => a.title.localeCompare(b.title, 'ja'));
  });
  
  return grouped;
}

/**
 * Get page URL for navigation
 * @param {Object} page - Page object
 * @param {string} currentPath - Current page path for relative URL calculation
 * @returns {string} Page URL
 */
function getPageUrl(page, currentPath = '') {
  const htmlPath = page.path.replace('.md', '.html');
  
  // If we're in a subdirectory, we need to go up
  const currentDir = path.dirname(currentPath);
  if (currentDir && currentDir !== '.') {
    return '../' + htmlPath;
  }
  
  return htmlPath;
}

/**
 * Generate enhanced sidebar navigation HTML with collapsible categories
 * @param {Object} config - Site configuration
 * @param {string} currentPage - Current page path for highlighting
 * @returns {string} Navigation HTML
 */
function generateSidebar(config, currentPage) {
  const categories = groupByCategory(config.pages);
  let html = '<nav class="sidebar-nav" role="navigation" aria-label="ドキュメントナビゲーション">\n';
  
  // Define category order (can be customized)
  const categoryOrder = ['概要', '環境構築', '仕様書', 'ガイド', 'API', 'トラブルシューティング'];
  const sortedCategories = Object.keys(categories).sort((a, b) => {
    const aIndex = categoryOrder.indexOf(a);
    const bIndex = categoryOrder.indexOf(b);
    
    // If both categories are in the order array, sort by their position
    if (aIndex !== -1 && bIndex !== -1) {
      return aIndex - bIndex;
    }
    
    // If only one is in the order array, prioritize it
    if (aIndex !== -1) return -1;
    if (bIndex !== -1) return 1;
    
    // If neither is in the order array, sort alphabetically
    return a.localeCompare(b, 'ja');
  });
  
  // Determine which category should be expanded (contains current page)
  let currentPageCategory = null;
  if (currentPage) {
    const currentPageObj = config.pages.find(page => page.path === currentPage);
    if (currentPageObj) {
      currentPageCategory = currentPageObj.category || '未分類';
    }
  }
  
  sortedCategories.forEach(category => {
    const pages = categories[category];
    const categoryId = category.toLowerCase().replace(/\s+/g, '-');
    const isExpanded = category === currentPageCategory;
    const expandedClass = isExpanded ? ' expanded' : '';
    const ariaExpanded = isExpanded ? 'true' : 'false';
    
    html += `  <div class="nav-category${expandedClass}" data-category="${categoryId}">\n`;
    html += `    <button class="nav-category-toggle" aria-expanded="${ariaExpanded}" aria-controls="category-${categoryId}">\n`;
    html += `      <span class="nav-category-title">${category}</span>\n`;
    html += `      <span class="nav-category-icon" aria-hidden="true">▼</span>\n`;
    html += `    </button>\n`;
    html += `    <ul class="nav-category-list" role="list" id="category-${categoryId}">\n`;
    
    pages.forEach(page => {
      const isActive = page.path === currentPage;
      const pageUrl = getPageUrl(page, currentPage);
      const activeClass = isActive ? ' class="active"' : '';
      const ariaCurrent = isActive ? ' aria-current="page"' : '';
      
      html += `      <li role="listitem">\n`;
      html += `        <a href="${pageUrl}"${activeClass}${ariaCurrent}>${page.title}</a>\n`;
      html += `      </li>\n`;
    });
    
    html += `    </ul>\n`;
    html += `  </div>\n`;
  });
  
  html += '</nav>\n';
  return html;
}

/**
 * Generate sidebar with search functionality
 * @param {Object} config - Site configuration
 * @param {string} currentPage - Current page path
 * @param {boolean} includeSearch - Whether to include search functionality
 * @returns {string} Enhanced sidebar HTML
 */
function generateEnhancedSidebar(config, currentPage, includeSearch = true) {
  let html = '';
  
  // Add search functionality if requested
  if (includeSearch) {
    html += `<div class="sidebar-search">\n`;
    html += `  <input type="text" class="search-input" placeholder="ページタイトルで検索..." aria-label="ページタイトル検索">\n`;
    html += `  <div class="search-results" role="region" aria-live="polite"></div>\n`;
    html += `</div>\n`;
  }
  
  // Add main navigation
  html += generateSidebar(config, currentPage);
  
  return html;
}

/**
 * Generate breadcrumb navigation
 * @param {Object} page - Current page object
 * @param {Object} config - Site configuration
 * @returns {string} Breadcrumb HTML
 */
function generateBreadcrumb(page, config) {
  let html = '<nav class="breadcrumb" aria-label="パンくずナビゲーション">\n';
  html += '  <a href="../index.html">ホーム</a>\n';
  html += '  <span class="breadcrumb-separator" aria-hidden="true">/</span>\n';
  
  if (page.category) {
    const categorySlug = page.category.toLowerCase().replace(/\s+/g, '-');
    html += `  <a href="../categories/${categorySlug}.html">${page.category}</a>\n`;
    html += '  <span class="breadcrumb-separator" aria-hidden="true">/</span>\n';
  }
  
  html += `  <span class="breadcrumb-current" aria-current="page">${page.title}</span>\n`;
  html += '</nav>\n';
  
  return html;
}

/**
 * Generate category statistics for dashboard
 * @param {Object} config - Site configuration
 * @returns {Object} Category statistics
 */
function generateCategoryStats(config) {
  const categories = groupByCategory(config.pages);
  const stats = {
    totalPages: config.pages.length,
    totalCategories: Object.keys(categories).length,
    categories: {}
  };
  
  Object.keys(categories).forEach(category => {
    stats.categories[category] = {
      count: categories[category].length,
      pages: categories[category].map(page => ({
        title: page.title,
        path: page.path
      }))
    };
  });
  
  return stats;
}

/**
 * Generate table of contents from page content
 * @param {string} htmlContent - HTML content to analyze
 * @returns {string} Table of contents HTML
 */
function generateTableOfContents(htmlContent) {
  const headingRegex = /<h([1-6])[^>]*(?:id="([^"]*)")?[^>]*>(.*?)<\/h[1-6]>/gi;
  const headings = [];
  let match;
  let headingCounter = 0;
  
  while ((match = headingRegex.exec(htmlContent)) !== null) {
    const level = parseInt(match[1]);
    let id = match[2];
    const text = match[3].replace(/<[^>]*>/g, ''); // Remove HTML tags
    
    // Generate ID if not present
    if (!id) {
      id = `heading-${++headingCounter}`;
      // Update the original content with the generated ID
      const originalHeading = match[0];
      const updatedHeading = originalHeading.replace(
        /<h([1-6])([^>]*)>/,
        `<h$1$2 id="${id}">`
      );
      htmlContent = htmlContent.replace(originalHeading, updatedHeading);
    }
    
    headings.push({ level, id, text });
  }
  
  if (headings.length === 0) {
    return { toc: '', content: htmlContent };
  }
  
  let tocHtml = '<div class="table-of-contents">\n';
  tocHtml += '  <h3>目次</h3>\n';
  tocHtml += '  <ul class="toc-list">\n';
  
  headings.forEach(heading => {
    const indent = '    '.repeat(Math.max(0, heading.level - 2));
    tocHtml += `${indent}<li class="toc-level-${heading.level}">`;
    tocHtml += `<a href="#${heading.id}">${heading.text}</a></li>\n`;
  });
  
  tocHtml += '  </ul>\n';
  tocHtml += '</div>\n';
  
  return { toc: tocHtml, content: htmlContent };
}

/**
 * Generate next/previous navigation
 * @param {Object} currentPage - Current page object
 * @param {Object} config - Site configuration
 * @returns {Object} Navigation links
 */
function generatePageNavigation(currentPage, config) {
  const allPages = config.pages;
  const currentIndex = allPages.findIndex(page => page.path === currentPage.path);
  
  const navigation = {
    previous: null,
    next: null
  };
  
  if (currentIndex > 0) {
    const prevPage = allPages[currentIndex - 1];
    navigation.previous = {
      title: prevPage.title,
      url: getPageUrl(prevPage, currentPage.path),
      category: prevPage.category
    };
  }
  
  if (currentIndex < allPages.length - 1) {
    const nextPage = allPages[currentIndex + 1];
    navigation.next = {
      title: nextPage.title,
      url: getPageUrl(nextPage, currentPage.path),
      category: nextPage.category
    };
  }
  
  return navigation;
}

module.exports = {
  generateSidebar,
  generateEnhancedSidebar,
  generateBreadcrumb,
  generateCategoryStats,
  generateTableOfContents,
  generatePageNavigation,
  groupByCategory,
  getPageUrl
};