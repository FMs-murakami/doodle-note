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
  
  // Validate pages configuration
  config.pages.forEach((page, index) => {
    if (!page.path || !page.title) {
      throw new Error(`Page at index ${index} missing required properties (path, title)`);
    }
    
    if (!page.path.endsWith('.md')) {
      throw new Error(`Page at index ${index} must have .md extension: ${page.path}`);
    }
  });
}

/**
 * Validate that all referenced markdown files exist
 * @param {Array} pages - Array of page configurations
 */
async function validateFilePaths(pages) {
  const warnings = [];
  
  for (const page of pages) {
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
 * Group pages by category (fallback for compatibility)
 * @param {Array} pages - Array of page configurations
 * @returns {Object} Pages grouped by category (single "all" category)
 */
function groupPagesByCategory(pages) {
  // Since we no longer use categories, return all pages under a single group
  const grouped = {
    'すべて': pages.slice() // Create a copy of the pages array
  };
  
  // Sort pages by title
  grouped['すべて'].sort((a, b) => a.title.localeCompare(b.title, 'ja'));
  
  return grouped;
}

/**
 * Get all unique categories from pages (fallback for compatibility)
 * @param {Array} pages - Array of page configurations
 * @returns {Array} Array with single category
 */
function getCategories(pages) {
  // Since we no longer use categories, return a single category
  return ['すべて'];
}

/**
 * Find page configuration by file path
 * @param {Array} pages - Array of page configurations
 * @param {string} filePath - File path to search for
 * @returns {Object|null} Page configuration or null if not found
 */
function findPageByPath(pages, filePath) {
  return pages.find(page => page.path === filePath) || null;
}

module.exports = {
  loadConfig,
  validateConfig,
  validateFilePaths,
  groupPagesByCategory,
  getCategories,
  findPageByPath
};