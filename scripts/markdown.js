/**
 * Markdown processing module
 * Handles conversion from Markdown to HTML with syntax highlighting
 */

const fs = require('fs-extra');
const path = require('path');
const { marked } = require('marked');
const hljs = require('highlight.js');

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
 * @returns {Promise<string>} Converted HTML content
 */
async function convertMarkdownToHtml(markdownContent) {
  const { frontmatter, content } = extractFrontmatter(markdownContent);
  
  try {
    const htmlContent = marked(content);
    return { html: htmlContent, frontmatter };
  } catch (error) {
    throw new Error(`Markdown conversion failed: ${error.message}`);
  }
}

/**
 * Generate navigation HTML for sidebar
 * @param {Object} groupedPages - Pages grouped by category
 * @param {string} currentPath - Current page path for highlighting
 * @returns {string} Navigation HTML
 */
function generateNavigation(groupedPages, currentPath) {
  let navHtml = '<nav class="sidebar-nav">\n';
  
  Object.keys(groupedPages).forEach(category => {
    navHtml += `  <div class="nav-category">\n`;
    navHtml += `    <h3 class="nav-category-title">${category}</h3>\n`;
    navHtml += `    <ul class="nav-category-list">\n`;
    
    groupedPages[category].forEach(page => {
      const isActive = page.path === currentPath ? ' class="active"' : '';
      const htmlPath = page.path.replace('.md', '.html');
      navHtml += `      <li><a href="../${htmlPath}"${isActive}>${page.title}</a></li>\n`;
    });
    
    navHtml += `    </ul>\n`;
    navHtml += `  </div>\n`;
  });
  
  navHtml += '</nav>';
  return navHtml;
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
    const { html, frontmatter } = await convertMarkdownToHtml(markdownContent);
    
    // Load template
    const template = await loadTemplate();
    
    // Generate navigation
    const navigation = generateNavigation(groupedPages, page.path);
    
    // Replace template variables
    const finalHtml = template
      .replace(/\{\{SITE_TITLE\}\}/g, config.site.title)
      .replace(/\{\{SITE_DESCRIPTION\}\}/g, config.site.description)
      .replace(/\{\{PAGE_TITLE\}\}/g, frontmatter.title || page.title)
      .replace(/\{\{PAGE_CATEGORY\}\}/g, page.category)
      .replace(/\{\{NAVIGATION\}\}/g, navigation)
      .replace(/\{\{CONTENT\}\}/g, html)
      .replace(/\{\{CURRENT_YEAR\}\}/g, new Date().getFullYear().toString());
    
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