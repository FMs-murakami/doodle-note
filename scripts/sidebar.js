/**
 * Dynamic Sidebar Generation Module
 * Handles navigation generation without categories
 */

const fs = require('fs-extra');
const path = require('path');

/**
 * Get page URL for navigation
 * @param {Object} page - Page object
 * @param {string} currentPath - Current page path for relative URL calculation
 * @returns {string} Page URL
 */
function getPageUrl(page, currentPath = '') {
  const htmlPath = page.path.replace('.md', '.html');
  
  // If no current path, return the HTML path as-is
  if (!currentPath) {
    return htmlPath;
  }
  
  // Calculate relative path from current page to target page
  const currentDir = path.dirname(currentPath);
  const targetDir = path.dirname(htmlPath);
  const targetFile = path.basename(htmlPath);
  
  // If both pages are in the same directory
  if (currentDir === targetDir) {
    return targetFile;
  }
  
  // Calculate how many levels up we need to go from current directory
  const currentDepth = currentDir === '.' ? 0 : currentDir.split('/').length;
  const targetDepth = targetDir === '.' ? 0 : targetDir.split('/').length;
  
  // Build relative path
  let relativePath = '';
  
  // Go up from current directory to root
  if (currentDepth > 0) {
    relativePath = '../'.repeat(currentDepth);
  }
  
  // Navigate to target directory and file
  if (targetDir !== '.') {
    relativePath += targetDir + '/';
  }
  relativePath += targetFile;
  
  return relativePath;
}

/**
 * Generate enhanced sidebar navigation HTML without categories
 * @param {Object} config - Site configuration
 * @param {string} currentPage - Current page path for highlighting
 * @returns {string} Navigation HTML
 */
function generateSidebar(config, currentPage) {
  let html = '<nav class="sidebar-nav" role="navigation" aria-label="ドキュメントナビゲーション">\n';
  
  // Sort pages by title
  const sortedPages = config.pages.slice().sort((a, b) => a.title.localeCompare(b.title, 'ja'));
  
  html += '  <div class="nav-category expanded">\n';
  html += '    <div class="nav-category-header">\n';
  html += '      <span class="nav-category-title">ドキュメント一覧</span>\n';
  html += '    </div>\n';
  html += '    <ul class="nav-category-list" role="list">\n';
  
  sortedPages.forEach(page => {
    const isActive = page.path === currentPage;
    const pageUrl = getPageUrl(page, currentPage);
    const activeClass = isActive ? ' class="active"' : '';
    const ariaCurrent = isActive ? ' aria-current="page"' : '';
    
    html += '      <li role="listitem">\n';
    html += `        <a href="${pageUrl}"${activeClass}${ariaCurrent}>${page.title}</a>\n`;
    html += '      </li>\n';
  });
  
  html += '    </ul>\n';
  html += '  </div>\n';
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
 * Generate breadcrumb navigation without categories
 * @param {Object} page - Current page object
 * @param {Object} config - Site configuration
 * @returns {string} Breadcrumb HTML
 */
function generateBreadcrumb(page, config) {
  // Calculate relative path to index.html from current page
  const currentDir = path.dirname(page.path);
  const currentDepth = currentDir === '.' ? 0 : currentDir.split('/').length;
  const indexPath = currentDepth > 0 ? '../'.repeat(currentDepth) + 'index.html' : 'index.html';
  
  let html = '<nav class="breadcrumb" aria-label="パンくずナビゲーション">\n';
  html += `  <a href="${indexPath}">ホーム</a>\n`;
  html += '  <span class="breadcrumb-separator" aria-hidden="true">/</span>\n';
  html += `  <span class="breadcrumb-current" aria-current="page">${page.title}</span>\n`;
  html += '</nav>\n';
  
  return html;
}

/**
 * Generate page statistics for dashboard
 * @param {Object} config - Site configuration
 * @returns {Object} Page statistics
 */
function generateCategoryStats(config) {
  const stats = {
    totalPages: config.pages.length,
    totalCategories: 1, // No categories, just one group
    categories: {
      'すべて': {
        count: config.pages.length,
        pages: config.pages.map(page => ({
          title: page.title,
          path: page.path
        }))
      }
    }
  };
  
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
      url: getPageUrl(prevPage, currentPage.path)
    };
  }
  
  if (currentIndex < allPages.length - 1) {
    const nextPage = allPages[currentIndex + 1];
    navigation.next = {
      title: nextPage.title,
      url: getPageUrl(nextPage, currentPage.path)
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