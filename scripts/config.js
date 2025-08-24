/**
 * Configuration management module
 * Handles loading, validation, and processing of config.json
 */

const fs = require('fs-extra');
const path = require('path');

/**
 * Load and validate configuration from config.json
 * @returns {Promise<Object>} Parsed configuration object
 */
async function loadConfig() {
  const configPath = path.join(process.cwd(), 'config', 'config.json');
  
  try {
    // Check if config file exists
    if (!await fs.pathExists(configPath)) {
      throw new Error(`Configuration file not found: ${configPath}`);
    }
    
    // Read and parse config file
    const configData = await fs.readJson(configPath);
    
    // Validate configuration structure
    validateConfig(configData);
    
    // Validate file paths
    await validateFilePaths(configData.pages);
    
    console.log('✅ Configuration loaded successfully');
    return configData;
    
  } catch (error) {
    if (error.code === 'ENOENT') {
      throw new Error(`Configuration file not found: ${configPath}`);
    } else if (error instanceof SyntaxError) {
      throw new Error(`Invalid JSON format in configuration file: ${error.message}`);
    } else {
      throw error;
    }
  }
}

/**
 * Validate configuration structure
 * @param {Object} config - Configuration object to validate
 */
function validateConfig(config) {
  // Check required top-level properties
  if (!config.site) {
    throw new Error('Configuration missing required "site" property');
  }
  
  if (!config.pages || !Array.isArray(config.pages)) {
    throw new Error('Configuration missing required "pages" array');
  }
  
  // Validate site configuration
  if (!config.site.title || !config.site.description) {
    throw new Error('Site configuration must include "title" and "description"');
  }
  
  // Validate pages configuration (hierarchical structure)
  validatePagesArray(config.pages, '');
}

/**
 * Recursively validate pages array (supports hierarchical structure)
 * @param {Array} pages - Array of page configurations or categories
 * @param {string} context - Context for error messages
 */
function validatePagesArray(pages, context) {
  pages.forEach((item, index) => {
    const itemContext = context ? `${context}[${index}]` : `pages[${index}]`;
    
    if (item.category && item.pages) {
      // This is a category with nested pages
      if (!item.category || !Array.isArray(item.pages)) {
        throw new Error(`Category at ${itemContext} missing required properties (category, pages)`);
      }
      validatePagesArray(item.pages, `${itemContext}.pages`);
    } else if (item.path && item.title) {
      // This is a regular page
      if (!item.path.endsWith('.md')) {
        throw new Error(`Page at ${itemContext} must have .md extension: ${item.path}`);
      }
    } else {
      throw new Error(`Item at ${itemContext} must be either a page (with path, title) or category (with category, pages)`);
    }
  });
}

/**
 * Validate that all referenced markdown files exist
 * @param {Array} pages - Array of page configurations (hierarchical)
 */
async function validateFilePaths(pages) {
  const warnings = [];
  const flatPages = flattenPages(pages);
  
  for (const page of flatPages) {
    const filePath = path.join(process.cwd(), page.path);
    
    if (!await fs.pathExists(filePath)) {
      warnings.push(`⚠️  Warning: Markdown file not found: ${page.path}`);
    }
  }
  
  // Display warnings
  if (warnings.length > 0) {
    console.warn('File validation warnings:');
    warnings.forEach(warning => console.warn(warning));
  }
}

/**
 * Flatten hierarchical pages structure into a flat array
 * @param {Array} pages - Hierarchical pages array
 * @returns {Array} Flat array of page objects
 */
function flattenPages(pages) {
  const flatPages = [];
  
  function processItem(item) {
    if (item.category && item.pages) {
      // This is a category, process its pages recursively
      item.pages.forEach(processItem);
    } else if (item.path && item.title) {
      // This is a regular page
      flatPages.push(item);
    }
  }
  
  pages.forEach(processItem);
  return flatPages;
}

/**
 * Group pages by category (updated for hierarchical structure)
 * @param {Array} pages - Array of page configurations (hierarchical)
 * @returns {Object} Pages grouped by category
 */
function groupPagesByCategory(pages) {
  const grouped = {};
  
  function processItem(item, parentCategory = null) {
    if (item.category && item.pages) {
      // This is a category
      const categoryName = parentCategory ? `${parentCategory} > ${item.category}` : item.category;
      
      if (!grouped[categoryName]) {
        grouped[categoryName] = [];
      }
      
      // Process pages in this category
      item.pages.forEach(subItem => processItem(subItem, categoryName));
    } else if (item.path && item.title) {
      // This is a regular page
      const categoryName = parentCategory || 'その他';
      
      if (!grouped[categoryName]) {
        grouped[categoryName] = [];
      }
      
      grouped[categoryName].push(item);
    }
  }
  
  pages.forEach(item => processItem(item));
  
  // Sort pages within each category
  Object.keys(grouped).forEach(category => {
    grouped[category].sort((a, b) => a.title.localeCompare(b.title, 'ja'));
  });
  
  return grouped;
}

/**
 * Get all unique categories from pages (updated for hierarchical structure)
 * @param {Array} pages - Array of page configurations (hierarchical)
 * @returns {Array} Array of category names
 */
function getCategories(pages) {
  const categories = new Set();
  
  function processItem(item, parentCategory = null) {
    if (item.category && item.pages) {
      const categoryName = parentCategory ? `${parentCategory} > ${item.category}` : item.category;
      categories.add(categoryName);
      
      // Process nested categories
      item.pages.forEach(subItem => processItem(subItem, categoryName));
    } else if (item.path && item.title && !parentCategory) {
      // Top-level pages without category
      categories.add('その他');
    }
  }
  
  pages.forEach(item => processItem(item));
  
  return Array.from(categories).sort((a, b) => a.localeCompare(b, 'ja'));
}

/**
 * Find page configuration by file path (updated for hierarchical structure)
 * @param {Array} pages - Array of page configurations (hierarchical)
 * @param {string} filePath - File path to search for
 * @returns {Object|null} Page configuration or null if not found
 */
function findPageByPath(pages, filePath) {
  const flatPages = flattenPages(pages);
  return flatPages.find(page => page.path === filePath) || null;
}

module.exports = {
  loadConfig,
  validateConfig,
  validateFilePaths,
  groupPagesByCategory,
  getCategories,
  findPageByPath,
  flattenPages,
  validatePagesArray
};