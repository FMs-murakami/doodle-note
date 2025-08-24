/**
 * Dynamic Sidebar Generation Module
 * Handles navigation generation without categories
 */

const fs = require('fs-extra');
const path = require('path');

/**
 * Get page URL for navigation (now generates absolute paths)
 * @param {Object} page - Page object
 * @param {string} currentPath - Current page path (unused in absolute path mode)
 * @param {Object} config - Site configuration containing baseUrl
 * @returns {string} Absolute page URL
 */
function getPageUrl(page, currentPath = '', config = null) {
  const htmlPath = page.path.replace('.md', '.html');
  
  // Get base URL from config, default to '/' if not provided
  let baseUrl = '/';
  if (config && config.site && config.site.baseUrl) {
    baseUrl = config.site.baseUrl;
  }
  
  // Ensure baseUrl ends with '/' for proper path joining
  if (!baseUrl.endsWith('/')) {
    baseUrl += '/';
  }
  
  // Normalize the HTML path
  const normalizedHtmlPath = htmlPath.replace(/\\/g, '/');
  
  // Create absolute path by combining baseUrl with the HTML path
  let absolutePath = baseUrl + normalizedHtmlPath;
  
  // Clean up any double slashes (except after protocol)
  absolutePath = absolutePath.replace(/([^:]\/)\/+/g, '$1');
  
  return absolutePath;
}

/**
 * Generate hierarchical sidebar navigation HTML with collapsible categories
 * @param {Object} config - Site configuration
 * @param {string} currentPage - Current page path for highlighting
 * @returns {string} Navigation HTML
 */
function generateSidebar(config, currentPage) {
  let html = '<nav class="sidebar-nav" role="navigation" aria-label="ドキュメントナビゲーション" id="navigation">\n';
  
  // Process each top-level item
  config.pages.forEach((item, index) => {
    if (item.path && item.title) {
      // This is a top-level page (no category)
      const isActive = item.path === currentPage;
      const pageUrl = getPageUrl(item, currentPage, config);
      const activeClass = isActive ? ' class="active"' : '';
      const ariaCurrent = isActive ? ' aria-current="page"' : '';
      
      html += '  <div class="nav-item">\n';
      html += `    <a href="${pageUrl}"${activeClass}${ariaCurrent}>${item.title}</a>\n`;
      html += '  </div>\n';
    } else if (item.category && item.pages) {
      // This is a category with pages
      html += generateCategorySection(item, currentPage, 0, config);
    }
  });
  
  html += '</nav>\n';
  return html;
}

/**
 * Generate a category section with collapsible functionality using details/summary
 * @param {Object} category - Category object with pages
 * @param {string} currentPage - Current page path
 * @param {number} level - Nesting level (0 = top level)
 * @param {Object} config - Site configuration
 * @returns {string} Category HTML
 */
function generateCategorySection(category, currentPage, level = 0, config) {
  const categoryId = category.category.toLowerCase().replace(/[^a-z0-9]/g, '-');
  const hasActiveChild = hasActivePage(category.pages, currentPage);
  const openAttribute = hasActiveChild ? ' open' : '';
  const levelClass = level > 0 ? ` nav-category-level-${level}` : '';
  
  let html = `  <details class="nav-category${levelClass}" data-category="${categoryId}"${openAttribute}>\n`;
  html += `    <summary class="nav-category-summary">\n`;
  html += `      <h3 class="nav-category-title">${category.category}</h3>\n`;
  html += '      <span class="nav-category-icon">▼</span>\n';
  html += '    </summary>\n';
  html += '    <ul class="nav-category-list">\n';
  
  // Process pages in this category
  category.pages.forEach(item => {
    if (item.path && item.title) {
      // Regular page
      const isActive = item.path === currentPage;
      const pageUrl = getPageUrl(item, currentPage, config);
      const activeClass = isActive ? ' class="active"' : '';
      const ariaCurrent = isActive ? ' aria-current="page"' : '';
      
      html += '      <li>\n';
      html += `        <a href="${pageUrl}"${activeClass}${ariaCurrent}>${item.title}</a>\n`;
      html += '      </li>\n';
    } else if (item.category && item.pages) {
      // Nested category
      html += generateCategorySection(item, currentPage, level + 1, config);
    }
  });
  
  html += '    </ul>\n';
  html += '  </details>\n';
  
  return html;
}

/**
 * Check if a category or its subcategories contain the active page
 * @param {Array} pages - Array of pages to check
 * @param {string} currentPage - Current page path
 * @returns {boolean} True if contains active page
 */
function hasActivePage(pages, currentPage) {
  return pages.some(item => {
    if (item.path === currentPage) {
      return true;
    }
    if (item.category && item.pages) {
      return hasActivePage(item.pages, currentPage);
    }
    return false;
  });
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
 * Generate breadcrumb navigation without categories
 * @param {Object} page - Current page object
 * @param {Object} config - Site configuration
 * @returns {string} Breadcrumb HTML
 */
function generateBreadcrumb(page, config) {
  // Get base URL from config, default to '/' if not provided
  let baseUrl = '/';
  if (config && config.site && config.site.baseUrl) {
    baseUrl = config.site.baseUrl;
  }
  
  // Ensure baseUrl ends with '/' for proper path joining
  if (!baseUrl.endsWith('/')) {
    baseUrl += '/';
  }
  
  // Create absolute path to index.html
  const indexPath = baseUrl + 'index.html';
  
  let html = '<nav class="breadcrumb" aria-label="パンくずナビゲーション">\n';
  html += `  <a href="${indexPath}">ホーム</a>\n`;
  html += '  <span class="breadcrumb-separator" aria-hidden="true">/</span>\n';
  html += `  <span class="breadcrumb-current" aria-current="page">${page.title}</span>\n`;
  html += '</nav>\n';
  
  return html;
}

/**
 * Generate page statistics for dashboard (updated for hierarchical structure)
 * @param {Object} config - Site configuration
 * @returns {Object} Page statistics
 */
function generateCategoryStats(config) {
  const { flattenPages } = require('./config');
  const flatPages = flattenPages(config.pages);
  
  const stats = {
    totalPages: flatPages.length,
    totalCategories: 0,
    categories: {}
  };
  
  // Count categories and organize pages
  function processItem(item, parentCategory = null) {
    if (item.category && item.pages) {
      const categoryName = parentCategory ? `${parentCategory} > ${item.category}` : item.category;
      stats.totalCategories++;
      
      if (!stats.categories[categoryName]) {
        stats.categories[categoryName] = {
          count: 0,
          pages: []
        };
      }
      
      // Process pages in this category
      item.pages.forEach(subItem => {
        if (subItem.path && subItem.title) {
          stats.categories[categoryName].count++;
          stats.categories[categoryName].pages.push({
            title: subItem.title,
            path: subItem.path
          });
        } else if (subItem.category && subItem.pages) {
          processItem(subItem, categoryName);
        }
      });
    } else if (item.path && item.title && !parentCategory) {
      // Top-level pages without category
      if (!stats.categories['その他']) {
        stats.categories['その他'] = {
          count: 0,
          pages: []
        };
        stats.totalCategories++;
      }
      
      stats.categories['その他'].count++;
      stats.categories['その他'].pages.push({
        title: item.title,
        path: item.path
      });
    }
  }
  
  config.pages.forEach(item => processItem(item));
  
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
 * Generate next/previous navigation (updated for hierarchical structure)
 * @param {Object} currentPage - Current page object
 * @param {Object} config - Site configuration
 * @returns {Object} Navigation links
 */
function generatePageNavigation(currentPage, config) {
  const { flattenPages } = require('./config');
  const allPages = flattenPages(config.pages);
  const currentIndex = allPages.findIndex(page => page.path === currentPage.path);
  
  const navigation = {
    previous: null,
    next: null
  };
  
  if (currentIndex > 0) {
    const prevPage = allPages[currentIndex - 1];
    navigation.previous = {
      title: prevPage.title,
      url: getPageUrl(prevPage, currentPage.path, config)
    };
  }
  
  if (currentIndex < allPages.length - 1) {
    const nextPage = allPages[currentIndex + 1];
    navigation.next = {
      title: nextPage.title,
      url: getPageUrl(nextPage, currentPage.path, config)
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
  getPageUrl
};