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
  
  // Clean up the source path - remove redundant './' and normalize
  let cleanSrc = src.replace(/\/\.\//g, '/').replace(/^\.\//g, '');
  
  // For relative paths, calculate the correct relative path from the output HTML location
  const currentDir = path.dirname(currentPagePath);
  const currentDepth = currentDir === '.' ? 0 : currentDir.split('/').length;
  
  // Handle paths that start with '../' - these are relative to the markdown file
  if (src.startsWith('../')) {
    // For paths like '../docs/./sample01.png', we need to resolve them properly
    // First, clean up the path
    cleanSrc = src.replace(/\/\.\//g, '/').replace(/^\.\.\//g, '');
    
    // Calculate the relative path from the HTML output location to the root
    const relativePath = currentDepth > 0 ? '../'.repeat(currentDepth) : '';
    
    // Return the cleaned path with proper relative prefix
    return relativePath + cleanSrc;
  }
  
  // If it's a simple relative path (no '../'), treat it as relative to the markdown file's directory
  if (currentDepth > 0) {
    // For files in subdirectories, we need to go up to reach the root, then navigate to the image
    const relativePath = '../'.repeat(currentDepth);
    return relativePath + currentDir + '/' + cleanSrc;
  } else {
    // For files in the root directory
    return currentDir + '/' + cleanSrc;
  }
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
async function loadTemplate(templateName = 'page') {
  const templatePath = path.join(process.cwd(), 'templates', `${templateName}.html`);
  
  if (!await fs.pathExists(templatePath)) {
    throw new Error(`Template not found: ${templatePath}`);
  }
  
  return await fs.readFile(templatePath, 'utf8');
}

/**
 * Process template with variable substitution and component includes
 */
function processTemplate(template, variables = {}) {
  let processed = template;
  
  // Replace template variables
  Object.keys(variables).forEach(key => {
    const regex = new RegExp(`{{${key}}}`, 'g');
    processed = processed.replace(regex, variables[key] || '');
  });
  
  return processed;
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
    
    // Override the table renderer to handle alignment
    renderer.table = function(header, body) {
      return `<table>\n<thead>\n${header}</thead>\n<tbody>\n${body}</tbody>\n</table>\n`;
    };
    
    renderer.tablerow = function(content) {
      return `<tr>\n${content}</tr>\n`;
    };
    
    renderer.tablecell = function(content, flags) {
      const type = flags.header ? 'th' : 'td';
      let alignClass = '';
      
      if (flags.align) {
        switch (flags.align) {
          case 'center':
            alignClass = ' class="text-center"';
            break;
          case 'right':
            alignClass = ' class="text-right"';
            break;
          case 'left':
          default:
            alignClass = ' class="text-left"';
            break;
        }
      }
      
      return `<${type}${alignClass}>${content}</${type}>\n`;
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
 * @param {Object} config - Site configuration with hierarchical structure
 * @param {string} currentPath - Current page path for highlighting
 * @returns {string} Navigation HTML
 */
function generateNavigation(config, currentPath) {
  const { generateEnhancedSidebar } = require('./sidebar');
  return generateEnhancedSidebar(config, currentPath, true);
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
 * @param {Object} groupedPages - All pages grouped by category (legacy parameter)
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
    
    // Load main page template
    const template = await loadTemplate();
    
    // Load header and sidebar component templates
    const headerTemplate = await loadTemplate('header');
    const sidebarTemplate = await loadTemplate('sidebar');
    
    // Generate navigation using the full config
    const navigation = generateNavigation(config, page.path);
    
    // Calculate relative path to root for this page
    const relativePath = calculateRelativePath(page.path);
    
    // Process component templates with variables
    const headerHtml = processTemplate(headerTemplate, {
      RELATIVE_PATH: relativePath,
      SITE_TITLE: config.site.title,
      SITE_DESCRIPTION: config.site.description
    });
    
    const sidebarHtml = processTemplate(sidebarTemplate, {
      SIDEBAR_CONTENT: navigation
    });
    
    // Replace template variables in main template
    const finalHtml = processTemplate(template, {
      SITE_TITLE: config.site.title,
      SITE_DESCRIPTION: config.site.description,
      PAGE_TITLE: frontmatter.title || page.title,
      HEADER_COMPONENT: headerHtml,
      SIDEBAR_COMPONENT: sidebarHtml,
      NAVIGATION: navigation,
      CONTENT: html,
      CURRENT_YEAR: new Date().getFullYear().toString(),
      RELATIVE_PATH: relativePath
    });
    
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