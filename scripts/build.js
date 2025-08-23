#!/usr/bin/env node

/**
 * Build script for internal documentation site
 * Processes Markdown files and generates static HTML pages
 */

const fs = require('fs-extra');
const path = require('path');
const { loadConfig, groupPagesByCategory, getCategories } = require('./config');
const { convertMarkdown } = require('./markdown');

/**
 * Copy static files to dist directory
 */
async function copyStaticFiles() {
  console.log('📁 Copying static assets...');
  
  // Copy assets directory
  if (await fs.pathExists('assets')) {
    await fs.copy('assets', 'dist/assets');
  }
  
  // Copy favicon if it exists
  if (await fs.pathExists('favicon.ico')) {
    await fs.copy('favicon.ico', 'dist/favicon.ico');
  }
  
  // Copy any additional static files
  const staticFiles = ['robots.txt', '.nojekyll'];
  for (const file of staticFiles) {
    if (await fs.pathExists(file)) {
      await fs.copy(file, path.join('dist', file));
    }
  }
}

/**
 * Generate index page HTML
 */
async function generateIndex(config) {
  console.log('📄 Generating index page...');
  
  const groupedPages = groupPagesByCategory(config.pages);
  const categories = getCategories(config.pages);
  
  let indexHtml = `<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${config.site.title}</title>
    <meta name="description" content="${config.site.description}">
    <link rel="stylesheet" href="assets/css/style.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@300;400;500;700&display=swap" rel="stylesheet">
    <link rel="icon" type="image/x-icon" href="assets/favicon.ico">
</head>
<body>
    <header class="site-header">
        <div class="container">
            <div class="header-content">
                <h1 class="site-title">${config.site.title}</h1>
                <p class="site-description">${config.site.description}</p>
            </div>
        </div>
    </header>

    <main class="main-content">
        <div class="container">
            <div class="index-content">
                <section class="welcome-section">
                    <h2>ドキュメント一覧</h2>
                    <p>カテゴリ別に整理された技術文書をご覧いただけます。</p>
                </section>

                <div class="categories-grid">`;

  // Generate category sections
  categories.forEach(category => {
    const pages = groupedPages[category];
    indexHtml += `
                    <div class="category-section">
                        <h3 class="category-title">${category}</h3>
                        <div class="category-pages">`;
    
    pages.forEach(page => {
      const htmlPath = page.path.replace('.md', '.html');
      indexHtml += `
                            <div class="page-card">
                                <h4 class="page-title">
                                    <a href="${htmlPath}">${page.title}</a>
                                </h4>
                                <p class="page-category">${page.category}</p>
                            </div>`;
    });
    
    indexHtml += `
                        </div>
                    </div>`;
  });

  indexHtml += `
                </div>
            </div>
        </div>
    </main>

    <footer class="site-footer">
        <div class="container">
            <div class="footer-content">
                <p>&copy; ${new Date().getFullYear()} ${config.site.title}. All rights reserved.</p>
                <p class="footer-note">社内向け技術文書管理システム</p>
            </div>
        </div>
    </footer>

    <script src="assets/js/main.js"></script>
</body>
</html>`;

  await fs.writeFile('dist/index.html', indexHtml);
}

/**
 * Generate category index pages
 */
async function generateCategoryIndexes(config) {
  console.log('📑 Generating category index pages...');
  
  const groupedPages = groupPagesByCategory(config.pages);
  const categories = getCategories(config.pages);
  
  // Ensure categories directory exists
  await fs.ensureDir('dist/categories');
  
  for (const category of categories) {
    const pages = groupedPages[category];
    const categorySlug = category.toLowerCase().replace(/\s+/g, '-');
    
    let categoryHtml = `<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${category} - ${config.site.title}</title>
    <meta name="description" content="${category}カテゴリのドキュメント一覧">
    <link rel="stylesheet" href="../assets/css/style.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@300;400;500;700&display=swap" rel="stylesheet">
</head>
<body>
    <header class="site-header">
        <div class="container">
            <div class="header-content">
                <h1 class="site-title">
                    <a href="../index.html">${config.site.title}</a>
                </h1>
                <p class="site-description">${config.site.description}</p>
            </div>
        </div>
    </header>

    <main class="main-content">
        <div class="container">
            <nav class="breadcrumb">
                <a href="../index.html">ホーム</a>
                <span class="breadcrumb-separator">/</span>
                <span class="breadcrumb-current">${category}</span>
            </nav>
            
            <div class="category-index">
                <h2>${category}</h2>
                <div class="page-list">`;

    pages.forEach(page => {
      const htmlPath = '../' + page.path.replace('.md', '.html');
      categoryHtml += `
                    <div class="page-item">
                        <h3><a href="${htmlPath}">${page.title}</a></h3>
                    </div>`;
    });

    categoryHtml += `
                </div>
            </div>
        </div>
    </main>

    <footer class="site-footer">
        <div class="container">
            <p>&copy; ${new Date().getFullYear()} ${config.site.title}. All rights reserved.</p>
        </div>
    </footer>
</body>
</html>`;

    await fs.writeFile(`dist/categories/${categorySlug}.html`, categoryHtml);
  }
}

/**
 * Main build function
 */
async function build() {
  console.log('🚀 Starting build process...');
  
  try {
    // 1. Clean up output directory
    console.log('🧹 Cleaning output directory...');
    await fs.emptyDir('dist');
    
    // 2. Load configuration
    console.log('⚙️  Loading configuration...');
    const config = await loadConfig();
    
    // 3. Group pages by category
    const groupedPages = groupPagesByCategory(config.pages);
    
    // 4. Process each page
    console.log('📝 Processing markdown files...');
    for (const page of config.pages) {
      try {
        const htmlContent = await convertMarkdown(page, config, groupedPages);
        
        // Save processed HTML
        const outputPath = path.join('dist', page.path.replace('.md', '.html'));
        await fs.ensureDir(path.dirname(outputPath));
        await fs.writeFile(outputPath, htmlContent);
        
        console.log(`✅ Processed: ${page.path} -> ${outputPath}`);
      } catch (error) {
        console.error(`❌ Failed to process ${page.path}:`, error.message);
      }
    }
    
    // 5. Copy static files
    await copyStaticFiles();
    
    // 6. Generate index page
    await generateIndex(config);
    
    // 7. Generate category index pages
    await generateCategoryIndexes(config);
    
    console.log('🎉 Build completed successfully!');
    console.log('📂 Output directory: ./dist');
    console.log(`📊 Processed ${config.pages.length} pages in ${getCategories(config.pages).length} categories`);
    
  } catch (error) {
    console.error('❌ Build failed:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

// Run build if this script is executed directly
if (require.main === module) {
  build();
}

module.exports = { build, copyStaticFiles, generateIndex, generateCategoryIndexes };