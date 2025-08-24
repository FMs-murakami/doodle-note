/**
 * Test sidebar features including triangle icons and active page highlighting
 */

const fs = require('fs-extra');
const path = require('path');

/**
 * Test CSS for triangle icon consistency
 */
function testTriangleIconCSS() {
  console.log('=== Testing Triangle Icon CSS ===\n');
  
  const cssPath = path.join(__dirname, '../assets/css/style.css');
  
  if (!fs.existsSync(cssPath)) {
    console.log('❌ CSS file not found');
    return false;
  }
  
  const cssContent = fs.readFileSync(cssPath, 'utf8');
  
  // Check for base triangle icon styles
  const hasBaseIconStyle = cssContent.includes('.nav-category-icon') && 
                          cssContent.includes('transform: rotate(-90deg)');
  
  // Check for open state styles
  const hasOpenIconStyle = cssContent.includes('.nav-category[open] .nav-category-icon') &&
                          cssContent.includes('transform: rotate(0deg)');
  
  // Check for level-specific styles
  const hasLevelStyles = cssContent.includes('.nav-category-level-1 .nav-category-icon') &&
                        cssContent.includes('.nav-category-level-2 .nav-category-icon');
  
  // Check for level-specific open states
  const hasLevelOpenStyles = cssContent.includes('.nav-category-level-1[open] .nav-category-icon') &&
                            cssContent.includes('.nav-category-level-2[open] .nav-category-icon');
  
  console.log(`Base icon style: ${hasBaseIconStyle ? '✅' : '❌'}`);
  console.log(`Open icon style: ${hasOpenIconStyle ? '✅' : '❌'}`);
  console.log(`Level-specific styles: ${hasLevelStyles ? '✅' : '❌'}`);
  console.log(`Level-specific open styles: ${hasLevelOpenStyles ? '✅' : '❌'}`);
  
  const allPassed = hasBaseIconStyle && hasOpenIconStyle && hasLevelStyles && hasLevelOpenStyles;
  console.log(`\nTriangle icon CSS: ${allPassed ? '✅ PASS' : '❌ FAIL'}\n`);
  
  return allPassed;
}

/**
 * Test CSS for active page highlighting
 */
function testActivePageCSS() {
  console.log('=== Testing Active Page CSS ===\n');
  
  const cssPath = path.join(__dirname, '../assets/css/style.css');
  
  if (!fs.existsSync(cssPath)) {
    console.log('❌ CSS file not found');
    return false;
  }
  
  const cssContent = fs.readFileSync(cssPath, 'utf8');
  
  // Check for active link styles
  const hasActiveStyles = cssContent.includes('.nav-category-list a.active') &&
                         cssContent.includes('.nav-item a.active');
  
  // Check for active indicator (::before pseudo-element)
  const hasActiveIndicator = cssContent.includes('a.active::before') &&
                            cssContent.includes('background-color: var(--accent-color)');
  
  // Check for proper positioning
  const hasProperPositioning = cssContent.includes('position: relative') &&
                              cssContent.includes('position: absolute');
  
  console.log(`Active link styles: ${hasActiveStyles ? '✅' : '❌'}`);
  console.log(`Active indicator: ${hasActiveIndicator ? '✅' : '❌'}`);
  console.log(`Proper positioning: ${hasProperPositioning ? '✅' : '❌'}`);
  
  const allPassed = hasActiveStyles && hasActiveIndicator && hasProperPositioning;
  console.log(`\nActive page CSS: ${allPassed ? '✅ PASS' : '❌ FAIL'}\n`);
  
  return allPassed;
}

/**
 * Test JavaScript for active page highlighting functionality
 */
function testActivePageJS() {
  console.log('=== Testing Active Page JavaScript ===\n');
  
  const jsPath = path.join(__dirname, '../assets/js/sidebar.js');
  
  if (!fs.existsSync(jsPath)) {
    console.log('❌ JavaScript file not found');
    return false;
  }
  
  const jsContent = fs.readFileSync(jsPath, 'utf8');
  
  // Check for highlightCurrentPage method
  const hasHighlightMethod = jsContent.includes('highlightCurrentPage()');
  
  // Check for expandParentCategories method
  const hasExpandMethod = jsContent.includes('expandParentCategories(');
  
  // Check for active class management
  const hasActiveClassManagement = jsContent.includes('classList.add(\'active\')') &&
                                  jsContent.includes('classList.remove(\'active\')');
  
  // Check for aria-current attribute
  const hasAriaSupport = jsContent.includes('aria-current');
  
  // Check for initialization call
  const hasInitCall = jsContent.includes('this.highlightCurrentPage()');
  
  console.log(`Highlight method: ${hasHighlightMethod ? '✅' : '❌'}`);
  console.log(`Expand method: ${hasExpandMethod ? '✅' : '❌'}`);
  console.log(`Active class management: ${hasActiveClassManagement ? '✅' : '❌'}`);
  console.log(`ARIA support: ${hasAriaSupport ? '✅' : '❌'}`);
  console.log(`Initialization call: ${hasInitCall ? '✅' : '❌'}`);
  
  const allPassed = hasHighlightMethod && hasExpandMethod && hasActiveClassManagement && 
                   hasAriaSupport && hasInitCall;
  console.log(`\nActive page JavaScript: ${allPassed ? '✅ PASS' : '❌ FAIL'}\n`);
  
  return allPassed;
}

/**
 * Test sidebar HTML structure generation
 */
function testSidebarStructure() {
  console.log('=== Testing Sidebar Structure Generation ===\n');
  
  const sidebarPath = path.join(__dirname, '../scripts/sidebar.js');
  
  if (!fs.existsSync(sidebarPath)) {
    console.log('❌ Sidebar script not found');
    return false;
  }
  
  const sidebarContent = fs.readFileSync(sidebarPath, 'utf8');
  
  // Check for proper HTML structure generation
  const hasDetailsElement = sidebarContent.includes('<details class="nav-category');
  const hasSummaryElement = sidebarContent.includes('<summary class="nav-category-summary">');
  const hasIconElement = sidebarContent.includes('<span class="nav-category-icon">▼</span>');
  const hasLevelClasses = sidebarContent.includes('nav-category-level-');
  const hasDataCategory = sidebarContent.includes('data-category=');
  
  console.log(`Details element: ${hasDetailsElement ? '✅' : '❌'}`);
  console.log(`Summary element: ${hasSummaryElement ? '✅' : '❌'}`);
  console.log(`Icon element: ${hasIconElement ? '✅' : '❌'}`);
  console.log(`Level classes: ${hasLevelClasses ? '✅' : '❌'}`);
  console.log(`Data category: ${hasDataCategory ? '✅' : '❌'}`);
  
  const allPassed = hasDetailsElement && hasSummaryElement && hasIconElement && 
                   hasLevelClasses && hasDataCategory;
  console.log(`\nSidebar structure: ${allPassed ? '✅ PASS' : '❌ FAIL'}\n`);
  
  return allPassed;
}

/**
 * Run all sidebar feature tests
 */
function runAllTests() {
  console.log('🧪 Testing Sidebar Features...\n');
  
  const results = {
    triangleIconCSS: testTriangleIconCSS(),
    activePageCSS: testActivePageCSS(),
    activePageJS: testActivePageJS(),
    sidebarStructure: testSidebarStructure()
  };
  
  console.log('=== Test Results Summary ===');
  console.log(`Triangle Icon CSS: ${results.triangleIconCSS ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Active Page CSS: ${results.activePageCSS ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Active Page JavaScript: ${results.activePageJS ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Sidebar Structure: ${results.sidebarStructure ? '✅ PASS' : '❌ FAIL'}`);
  
  const allPassed = Object.values(results).every(result => result);
  
  console.log(`\nOverall: ${allPassed ? '🎉 ALL TESTS PASSED' : '❌ SOME TESTS FAILED'}`);
  
  return allPassed;
}

// Run tests if this script is executed directly
if (require.main === module) {
  const success = runAllTests();
  process.exit(success ? 0 : 1);
}

module.exports = {
  testTriangleIconCSS,
  testActivePageCSS,
  testActivePageJS,
  testSidebarStructure,
  runAllTests
};