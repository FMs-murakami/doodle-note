/**
 * Markdown processing module
 * Handles conversion from Markdown to HTML with syntax highlighting
 */

const fs = require('fs-extra');
const path = require('path');
const { marked } = require('marked');
const hljs = require('highlight.js');

/**
 * Convert image path to proper relative path
 * @param {string} src - Original image src from markdown
 * @param {string} currentPagePath - Path of the current page being processed
 * @returns {string} Converted src for HTML output
 */
function convertImagePath(src, currentPagePath) {
  // If it's an absolute URL or data URL, return as-is
  if (src.startsWith('http://') || src.startsWith('https://') || src.startsWith('data:') || src.startsWith('/')) {
    return src;
  }
  
  // For relative paths, calculate the correct relative path from the output HTML location
  const currentDir = path.dirname(currentPagePath);
  const currentDepth = currentDir === '.' ? 0 : currentDir.split('/').length;
  
  // If the image path starts with '../', it's already relative to the markdown file
  // We need to adjust it for the HTML output location
  if (src.startsWith('../')) {
    // Remove the '../' and recalculate from the HTML location
    const cleanSrc = src.replace(/^\.\.\//, '');
    const relativePath = currentDepth > 0 ? '../'.repeat(currentDepth) : './';
    return relativePath + cleanSrc;
  }
  
  // If it's a simple relative path (no '../'), treat it as relative to the markdown file's directory
  const relativePath = currentDepth > 0 ? '../'.repeat(currentDepth) : './';
  return relativePath + currentDir + '/' + src;
}

/**
 * Convert markdown link to HTML link
 * @param {string} href - Original href from markdown link
 * @param {string} currentPagePath - Path of the current page being processed
 * @returns {string} Converted href for HTML output
 */
function convertMarkdownLinkToHtml(href, currentPagePath) {
  // Only process links that end with .md
  if (!href.endsWith('.md')) {
    return href;
  }
  
  // If it's an absolute path or external URL, just convert .md to .html
  if (href.startsWith('http://') || href.startsWith('https://') || href.startsWith('/')) {
    return href.replace(/\.md$/, '.html');
  }
  
  // For relative paths, simply convert .md to .html
  // The relative path structure should remain the same
  return href.replace(/\.md$/, '.html');
}

// Configure marked with syntax highlighting
marked.setOptions({
  highlight: function(code, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(code, { language: lang }).value;
      } catch (err) {
        console.warn(`Syntax highlighting failed for language "${lang}":`, err.message);
        return hljs.highlightAuto(code).value;
      }
    }
    return hljs.highlightAuto(code).value;
  },
  langPrefix: 'hljs language-',
  breaks: true,
  gfm: true,
  headerIds: true,
  mangle: false
});

/**
 * Load HTML template
 * @param {string} templateName - Name of the template file
 * @returns {Promise<string>} Template content
 */
async function loadTemplate(templateName = 'page.html') {
  const templatePath = path.join(process.cwd(), 'templates', templateName);
  
  if (!await fs.pathExists(templatePath)) {
    throw new Error(`Template not found: ${templatePath}`);
  }
  
  return await fs.readFile(templatePath, 'utf8');
}

/**
 * Extract frontmatter from markdown content
 * @param {string} content - Markdown content
 * @returns {Object} Object with frontmatter data and content
 */
function extractFrontmatter(content) {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
  const match = content.match(frontmatterRegex);
  
  if (match) {
    try {
      const frontmatter = {};
      const lines = match[1].split('\n');
      
      lines.forEach(line => {
        const colonIndex = line.indexOf(':');
        if (colonIndex > 0) {
          const key = line.substring(0, colonIndex).trim();
          const value = line.substring(colonIndex + 1).trim().replace(/^["']|["']$/g, '');
          frontmatter[key] = value;
        }
      });
      
      return {
        frontmatter,
        content: match[2]
      };
    } catch (error) {
      console.warn('Failed to parse frontmatter:', error.message);
      return { frontmatter: {}, content };
    }
  }
  
  return { frontmatter: {}, content };
}

/**
 * Convert markdown content to HTML
 * @param {string} markdownContent - Raw markdown content
 * @param {string} currentPagePath - Path of the current page being processed (for link conversion)
 * @returns {Promise<string>} Converted HTML content
 */
async function convertMarkdownToHtml(markdownContent, currentPagePath = '') {
  const { frontmatter, content } = extractFrontmatter(markdownContent);
  
  try {
    // Create a custom renderer for link and image processing
    const renderer = new marked.Renderer();
    
    // Override the link renderer to convert .md links to .html
    renderer.link = function(href, title, text) {
      const convertedHref = convertMarkdownLinkToHtml(href, currentPagePath);
      const titleAttr = title ? ` title="${title}"` : '';
      return `<a href="${convertedHref}"${titleAttr}>${text}</a>`;
    };
    
    // Override the image renderer to handle relative paths correctly
    renderer.image = function(src, title, alt) {
      const convertedSrc = convertImagePath(src, currentPagePath);
      const titleAttr = title ? ` title="${title}"` : '';
      const altAttr = alt ? ` alt="${alt}"` : ' alt=""';
      return `<img src="${convertedSrc}"${altAttr}${titleAttr} loading="lazy">`;
    };
    
    // Convert markdown to HTML with custom renderer
    const htmlContent = marked(content, { renderer });
    return { html: htmlContent, frontmatter };
  } catch (error) {
    throw new Error(`Markdown conversion failed: ${error.message}`);
  }
}

/**
 * Generate navigation HTML for sidebar
 * @param {Object} groupedPages - Pages grouped by category (not used anymore)
 * @param {string} currentPath - Current page path for highlighting
 * @returns {string} Navigation HTML
 */
function generateNavigation(groupedPages, currentPath) {
  const { generateSidebar } = require('./sidebar');
  
  // Create a mock config object for the sidebar generator
  const mockConfig = {
    pages: []
  };
  
  // Flatten grouped pages back to array format (for compatibility)
  Object.keys(groupedPages).forEach(category => {
    groupedPages[category].forEach(page => {
      mockConfig.pages.push(page);
    });
  });
  
  return generateSidebar(mockConfig, currentPath);
}

/**
 * Calculate relative path to root based on page depth
 * @param {string} pagePath - Path to the page (e.g., "docs/setup/macos.md")
 * @returns {string} Relative path to root (e.g., "../../")
 */
function calculateRelativePath(pagePath) {
  const depth = pagePath.split('/').length - 1;
  return depth > 0 ? '../'.repeat(depth) : './';
}

/**
 * Convert a single markdown page to HTML
 * @param {Object} page - Page configuration
 * @param {Object} config - Site configuration
 * @param {Object} groupedPages - All pages grouped by category
 * @returns {Promise<string>} Complete HTML page
 */
async function convertMarkdown(page, config, groupedPages) {
  try {
    // Read markdown file
    const markdownPath = path.join(process.cwd(), page.path);
    
    if (!await fs.pathExists(markdownPath)) {
      throw new Error(`Markdown file not found: ${markdownPath}`);
    }
    
    const markdownContent = await fs.readFile(markdownPath, 'utf8');
    
    // Convert markdown to HTML
    const { html, frontmatter } = await convertMarkdownToHtml(markdownContent, page.path);
    
    // Load template
    const template = await loadTemplate();
    
    // Generate navigation
    const navigation = generateNavigation(groupedPages, page.path);
    
    // Calculate relative path to root for this page
    const relativePath = calculateRelativePath(page.path);
    
    // Replace template variables
    const finalHtml = template
      .replace(/\{\{SITE_TITLE\}\}/g, config.site.title)
      .replace(/\{\{SITE_DESCRIPTION\}\}/g, config.site.description)
      .replace(/\{\{PAGE_TITLE\}\}/g, frontmatter.title || page.title)
      .replace(/\{\{NAVIGATION\}\}/g, navigation)
      .replace(/\{\{CONTENT\}\}/g, html)
      .replace(/\{\{CURRENT_YEAR\}\}/g, new Date().getFullYear().toString())
      .replace(/\{\{RELATIVE_PATH\}\}/g, relativePath);
    
    return finalHtml;
    
  } catch (error) {
    throw new Error(`Failed to convert ${page.path}: ${error.message}`);
  }
}

/**
 * Generate table of contents from HTML content
 * @param {string} htmlContent - HTML content to analyze
 * @returns {string} Table of contents HTML
 */
function generateTableOfContents(htmlContent) {
  const headingRegex = /<h([1-6])[^>]*id="([^"]*)"[^>]*>(.*?)<\/h[1-6]>/gi;
  const headings = [];
  let match;
  
  while ((match = headingRegex.exec(htmlContent)) !== null) {
    headings.push({
      level: parseInt(match[1]),
      id: match[2],
      text: match[3].replace(/<[^>]*>/g, '') // Remove HTML tags
    });
  }
  
  if (headings.length === 0) {
    return '';
  }
  
  let tocHtml = '<div class="table-of-contents">\n';
  tocHtml += '<h3>目次</h3>\n<ul>\n';
  
  headings.forEach(heading => {
    const indent = '  '.repeat(heading.level - 1);
    tocHtml += `${indent}<li><a href="#${heading.id}">${heading.text}</a></li>\n`;
  });
  
  tocHtml += '</ul>\n</div>';
  return tocHtml;
}

module.exports = {
  convertMarkdown,
  convertMarkdownToHtml,
  extractFrontmatter,
  generateNavigation,
  generateTableOfContents,
  loadTemplate
};