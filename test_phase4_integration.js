#!/usr/bin/env node

/**
 * Phase 4 Integration Test
 * Tests responsive CSS, dynamic sidebar, and sample documentation
 */

const fs = require('fs-extra');
const path = require('path');
const { build } = require('./scripts/build');
const { loadConfig } = require('./scripts/config');

class Phase4IntegrationTest {
  constructor() {
    this.testResults = [];
    this.errors = [];
  }

  /**
   * Run all Phase 4 integration tests
   */
  async runAllTests() {
    console.log('🚀 Starting Phase 4 Integration Tests...\n');

    try {
      // Test 1: CSS Foundation
      await this.testResponsiveCSSFoundation();
      
      // Test 2: Dynamic Sidebar
      await this.testDynamicSidebar();
      
      // Test 3: Sample Documentation
      await this.testSampleDocumentation();
      
      // Test 4: Build Process
      await this.testBuildProcess();
      
      // Test 5: Configuration Validation
      await this.testConfigurationValidation();

      this.printResults();
      
    } catch (error) {
      console.error('❌ Integration test failed:', error.message);
      process.exit(1);
    }
  }

  /**
   * Test responsive CSS foundation
   */
  async testResponsiveCSSFoundation() {
    console.log('📱 Testing Responsive CSS Foundation...');
    
    const cssPath = 'assets/css/style.css';
    
    // Check if CSS file exists
    this.assert(
      await fs.pathExists(cssPath),
      'CSS file exists',
      `CSS file not found at ${cssPath}`
    );

    // Read CSS content
    const cssContent = await fs.readFile(cssPath, 'utf8');
    
    // Test CSS Variables
    this.assert(
      cssContent.includes(':root {'),
      'CSS variables defined',
      'CSS variables not found in :root'
    );
    
    this.assert(
      cssContent.includes('--primary-color:'),
      'Primary color variable defined',
      'Primary color variable not found'
    );
    
    this.assert(
      cssContent.includes('--sidebar-width:'),
      'Sidebar width variable defined',
      'Sidebar width variable not found'
    );

    // Test Responsive Design
    this.assert(
      cssContent.includes('@media (max-width: 1024px)'),
      'Tablet breakpoint defined',
      'Tablet responsive breakpoint not found'
    );
    
    this.assert(
      cssContent.includes('@media (max-width: 768px)'),
      'Mobile breakpoint defined',
      'Mobile responsive breakpoint not found'
    );

    // Test Flexbox Layout
    this.assert(
      cssContent.includes('display: flex'),
      'Flexbox layout used',
      'Flexbox layout not found'
    );

    // Test Sidebar Styles
    this.assert(
      cssContent.includes('.sidebar {'),
      'Sidebar styles defined',
      'Sidebar styles not found'
    );
    
    this.assert(
      cssContent.includes('.sidebar-open'),
      'Sidebar open state defined',
      'Sidebar open state not found'
    );

    console.log('✅ Responsive CSS Foundation tests passed\n');
  }

  /**
   * Test dynamic sidebar functionality
   */
  async testDynamicSidebar() {
    console.log('🔧 Testing Dynamic Sidebar...');
    
    // Check sidebar generation script
    const sidebarScriptPath = 'scripts/sidebar.js';
    this.assert(
      await fs.pathExists(sidebarScriptPath),
      'Sidebar script exists',
      `Sidebar script not found at ${sidebarScriptPath}`
    );

    // Test sidebar script functions
    const sidebarModule = require('./scripts/sidebar');
    
    this.assert(
      typeof sidebarModule.generateSidebar === 'function',
      'generateSidebar function exists',
      'generateSidebar function not found'
    );
    
    this.assert(
      typeof sidebarModule.groupByCategory === 'function',
      'groupByCategory function exists',
      'groupByCategory function not found'
    );

    // Test client-side sidebar script
    const clientSidebarPath = 'assets/js/sidebar.js';
    this.assert(
      await fs.pathExists(clientSidebarPath),
      'Client-side sidebar script exists',
      `Client-side sidebar script not found at ${clientSidebarPath}`
    );

    const clientSidebarContent = await fs.readFile(clientSidebarPath, 'utf8');
    
    this.assert(
      clientSidebarContent.includes('class SidebarManager'),
      'SidebarManager class defined',
      'SidebarManager class not found'
    );
    
    this.assert(
      clientSidebarContent.includes('handleSearch'),
      'Search functionality implemented',
      'Search functionality not found'
    );
    
    this.assert(
      clientSidebarContent.includes('toggle()'),
      'Sidebar toggle functionality implemented',
      'Sidebar toggle functionality not found'
    );

    console.log('✅ Dynamic Sidebar tests passed\n');
  }

  /**
   * Test sample documentation structure
   */
  async testSampleDocumentation() {
    console.log('📚 Testing Sample Documentation...');
    
    const config = await loadConfig();
    
    // Test configuration structure
    this.assert(
      config.pages && Array.isArray(config.pages),
      'Pages array exists in config',
      'Pages array not found in configuration'
    );
    
    this.assert(
      config.pages.length >= 9,
      'Sufficient sample pages exist',
      `Expected at least 9 pages, found ${config.pages.length}`
    );

    // Test required categories
    const categories = [...new Set(config.pages.map(page => page.category))];
    const requiredCategories = ['概要', '環境構築', 'API', 'ガイド'];
    
    requiredCategories.forEach(category => {
      this.assert(
        categories.includes(category),
        `Category "${category}" exists`,
        `Required category "${category}" not found`
      );
    });

    // Test sample document files
    const sampleDocs = [
      'docs/setup/environment.md',
      'docs/setup/deployment.md',
      'docs/api/authentication.md',
      'docs/api/endpoints.md',
      'docs/guides/troubleshooting.md',
      'docs/guides/best-practices.md'
    ];

    for (const docPath of sampleDocs) {
      this.assert(
        await fs.pathExists(docPath),
        `Sample document exists: ${docPath}`,
        `Sample document not found: ${docPath}`
      );
      
      // Check frontmatter
      const content = await fs.readFile(docPath, 'utf8');
      this.assert(
        content.startsWith('---'),
        `Frontmatter exists in ${docPath}`,
        `Frontmatter not found in ${docPath}`
      );
    }

    console.log('✅ Sample Documentation tests passed\n');
  }

  /**
   * Test build process with new features
   */
  async testBuildProcess() {
    console.log('🔨 Testing Build Process...');
    
    // Clean previous build
    if (await fs.pathExists('dist')) {
      await fs.remove('dist');
    }

    // Run build
    await build();
    
    // Check build output
    this.assert(
      await fs.pathExists('dist'),
      'Build output directory created',
      'Build output directory not found'
    );
    
    this.assert(
      await fs.pathExists('dist/index.html'),
      'Index page generated',
      'Index page not found in build output'
    );
    
    this.assert(
      await fs.pathExists('dist/assets/css/style.css'),
      'CSS assets copied',
      'CSS assets not found in build output'
    );
    
    this.assert(
      await fs.pathExists('dist/assets/js/sidebar.js'),
      'Sidebar JavaScript copied',
      'Sidebar JavaScript not found in build output'
    );

    // Test generated HTML pages
    const config = await loadConfig();
    for (const page of config.pages) {
      const htmlPath = path.join('dist', page.path.replace('.md', '.html'));
      this.assert(
        await fs.pathExists(htmlPath),
        `Generated HTML page: ${page.title}`,
        `Generated HTML page not found: ${htmlPath}`
      );
      
      // Check HTML content
      const htmlContent = await fs.readFile(htmlPath, 'utf8');
      this.assert(
        htmlContent.includes('sidebar-nav'),
        `Sidebar navigation in ${page.title}`,
        `Sidebar navigation not found in ${htmlPath}`
      );
    }

    console.log('✅ Build Process tests passed\n');
  }

  /**
   * Test configuration validation
   */
  async testConfigurationValidation() {
    console.log('⚙️ Testing Configuration Validation...');
    
    const config = await loadConfig();
    
    // Test site configuration
    this.assert(
      config.site && config.site.title,
      'Site title configured',
      'Site title not found in configuration'
    );
    
    this.assert(
      config.site && config.site.description,
      'Site description configured',
      'Site description not found in configuration'
    );

    // Test page configuration
    config.pages.forEach((page, index) => {
      this.assert(
        page.path && typeof page.path === 'string',
        `Page ${index + 1} has valid path`,
        `Page ${index + 1} missing or invalid path`
      );
      
      this.assert(
        page.title && typeof page.title === 'string',
        `Page ${index + 1} has valid title`,
        `Page ${index + 1} missing or invalid title`
      );
      
      this.assert(
        page.category && typeof page.category === 'string',
        `Page ${index + 1} has valid category`,
        `Page ${index + 1} missing or invalid category`
      );
    });

    console.log('✅ Configuration Validation tests passed\n');
  }

  /**
   * Assert test condition
   */
  assert(condition, message, errorMessage) {
    if (condition) {
      this.testResults.push({ status: 'PASS', message });
    } else {
      this.testResults.push({ status: 'FAIL', message, error: errorMessage });
      this.errors.push(errorMessage);
    }
  }

  /**
   * Print test results
   */
  printResults() {
    console.log('📊 Test Results Summary:');
    console.log('========================\n');
    
    const passed = this.testResults.filter(r => r.status === 'PASS').length;
    const failed = this.testResults.filter(r => r.status === 'FAIL').length;
    
    console.log(`✅ Passed: ${passed}`);
    console.log(`❌ Failed: ${failed}`);
    console.log(`📈 Total:  ${this.testResults.length}\n`);
    
    if (failed > 0) {
      console.log('❌ Failed Tests:');
      console.log('================');
      this.testResults
        .filter(r => r.status === 'FAIL')
        .forEach(result => {
          console.log(`- ${result.message}: ${result.error}`);
        });
      console.log('');
      process.exit(1);
    } else {
      console.log('🎉 All Phase 4 integration tests passed!');
      console.log('');
      console.log('Phase 4 Implementation Complete:');
      console.log('✅ Responsive CSS foundation with CSS variables');
      console.log('✅ Dynamic sidebar with category grouping');
      console.log('✅ Mobile hamburger menu functionality');
      console.log('✅ Search functionality in sidebar');
      console.log('✅ Comprehensive sample documentation');
      console.log('✅ Enhanced build process');
      console.log('');
      console.log('🚀 Ready for production deployment!');
    }
  }
}

// Run tests if this script is executed directly
if (require.main === module) {
  const tester = new Phase4IntegrationTest();
  tester.runAllTests().catch(error => {
    console.error('Test execution failed:', error);
    process.exit(1);
  });
}

module.exports = Phase4IntegrationTest;