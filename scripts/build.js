#!/usr/bin/env node

/**
 * Build script for internal documentation site
 * Processes Markdown files and generates static HTML pages
 */

const fs = require('fs-extra');
const path = require('path');
const yaml = require('js-yaml');
const { loadConfig, groupPagesByCategory, getCategories, flattenPages } = require('./config');
const { convertMarkdown } = require('./markdown');
const outputDir = process.env.OUTPUT_DIR || 'dist';

/**
 * Load and process template components
 */
async function loadTemplate(templateName) {
  const templatePath = path.join('templates', `${templateName}.html`);
  if (await fs.pathExists(templatePath)) {
    return await fs.readFile(templatePath, 'utf8');
  }
  throw new Error(`Template not found: ${templatePath}`);
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
 * Generate config.json from config.yaml for client-side consumption
 */
async function generateConfigJson(config) {
  console.log('⚙️  Generating config.json from config.yaml...');
  
  // Ensure config directory exists in output
  const configDir = path.join(outputDir, 'config');
  await fs.ensureDir(configDir);
  
  // Write config.json with the loaded configuration
  const configJsonPath = path.join(configDir, 'config.json');
  await fs.writeJson(configJsonPath, config, { spaces: 2 });
  
  console.log('✅ Generated config.json for client-side consumption');
}

/**
 * Copy static files to dist directory
 */
async function copyStaticFiles() {
  console.log('📁 Copying static assets...');
  
  // Copy assets directory
  if (await fs.pathExists('assets')) {
    await fs.copy('assets', path.join(outputDir, 'assets'));
  }
  
  // Copy docs directory (for images and other assets, excluding .md)
  if (await fs.pathExists('docs')) {
    await fs.copy('docs', path.join(outputDir, 'docs'), {
      filter: (src) => !src.endsWith('.md')
    });
  }
  // Note: config directory is handled separately by generateConfigJson()
  // to convert YAML to JSON for client-side consumption
  
  // Copy favicon if it exists
  if (await fs.pathExists('favicon.ico')) {
    await fs.copy('favicon.ico', path.join(outputDir, 'favicon.ico'));
  }
  
  // Copy any additional static files
  const staticFiles = ['robots.txt', '.nojekyll'];
  for (const file of staticFiles) {
    if (await fs.pathExists(file)) {
      await fs.copy(file, path.join(outputDir, file));
    }
  }
}

/**
 * Generate index page HTML with sidebar and header layout using templates
 */
async function generateIndex(config) {
  console.log('📄 Generating index page...');
  
  const { generateEnhancedSidebar } = require('./sidebar');
  const sidebarHtml = generateEnhancedSidebar(config, null, true);
  
  // Load header and sidebar templates (use special index sidebar)
  const headerTemplate = await loadTemplate('header');
  const sidebarTemplate = await loadTemplate('sidebar-index');
  
  // Process templates with variables
  const headerHtml = processTemplate(headerTemplate, {
    RELATIVE_PATH: '',
    SITE_TITLE: config.site.title,
    SITE_DESCRIPTION: config.site.description
  });
  
  const sidebarHtmlProcessed = processTemplate(sidebarTemplate, {
    SIDEBAR_CONTENT: sidebarHtml
  });
  
  let indexHtml = `<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${config.site.title}</title>
    <meta name="description" content="${config.site.description}">
    
    <!-- CSS -->
    <link rel="stylesheet" href="assets/css/style.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.8.0/styles/github.min.css">
    
    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@300;400;500;700&display=swap" rel="stylesheet">
    
    <!-- Favicon -->
    <link rel="icon" type="image/x-icon" href="assets/favicon.ico">
</head>
<body>
    ${headerHtml}

    <!-- Main Layout -->
    <div class="main-layout">
        ${sidebarHtmlProcessed}

        <!-- Main Content -->
        <main class="main-content">
            <div class="content-wrapper">
                <!-- Page Content -->
                <article class="page-content">
                    <header class="page-header">
                        <h1 class="page-title">ドキュメント一覧</h1>
                    </header>
                    
                    <div class="content-area">
                        <div class="index-content">
                            <div class="welcome-section">
                                <h2>社内技術文書管理システム</h2>
                                <p>左側のサイドバーから各カテゴリのドキュメントにアクセスできます。検索機能を使用してページタイトルで絞り込むことも可能です。</p>
                            </div>
                            
                            <div class="page-addition-guide">
                                <h2>📝 新しいページの追加手順</h2>
                                <p>このサイトに新しいドキュメントページを追加する方法を説明します。</p>
                                
                                <h3>1. Markdownファイルの作成</h3>
                                <p>適切なディレクトリにMarkdownファイル（.md）を作成します：</p>
                                <ul>
                                    <li><strong>API関連:</strong> <code>docs/api/</code> ディレクトリ</li>
                                    <li><strong>ガイド:</strong> <code>docs/guides/</code> ディレクトリ</li>
                                    <li><strong>セットアップ:</strong> <code>docs/setup/</code> ディレクトリ</li>
                                </ul>
                                
                                <h3>2. ファイル形式</h3>
                                <p>Markdownファイルの先頭にフロントマターを追加してください：</p>
                                <pre><code>---
title: ページタイトル
category: カテゴリ名
---

# ページタイトル

ここにコンテンツを記述します。</code></pre>
                                
                                <h3>3. 設定ファイルの更新</h3>
                                <p><code>config/config.yaml</code> ファイルの <code>pages</code> 配列に新しいページを追加します：</p>
                                <pre><code>- title: "ページタイトル"
  path: "docs/category/filename.md"
  category: "カテゴリ名"</code></pre>
                                
                                <h3>4. ビルドとデプロイ</h3>
                                <p>変更をコミットしてプッシュすると、GitHub Actionsが自動的にサイトをビルド・デプロイします：</p>
                                <pre><code>git add .
git commit -m "新しいページを追加: ページタイトル"
git push origin main</code></pre>
                                
                                <h3>5. 確認事項</h3>
                                <ul>
                                    <li>ファイル名は英数字とハイフンのみ使用</li>
                                    <li>カテゴリ名は既存のものを使用するか、新規作成</li>
                                    <li>画像ファイルは <code>assets/images/</code> に配置</li>
                                    <li>コードブロックには適切な言語指定を追加</li>
                                </ul>
                                
                                <div class="note-box">
                                    <h4>💡 ヒント</h4>
                                    <p>既存のページを参考にして、同じ形式でファイルを作成することをお勧めします。</p>
                                </div>
                            </div>
                            
                            <div class="categories-grid" id="categories-grid">
                                <!-- Categories will be generated by JavaScript -->
                            </div>
                        </div>
                    </div>
                </article>
            </div>
        </main>
    </div>

    <!-- JavaScript -->
    <script src="assets/js/main.js"></script>
    <script src="assets/js/sidebar.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.8.0/highlight.min.js"></script>
    <script>
        // Initialize syntax highlighting
        hljs.highlightAll();
    </script>
</body>
</html>`;

  await fs.writeFile(path.join(outputDir, 'index.html'), indexHtml);
}

/**
 * Generate category-specific index pages
 */
async function generateCategoryIndexes(config) {
  console.log('📑 Generating category index pages...');
  
  const { generateEnhancedSidebar } = require('./sidebar');
  const groupedPages = groupPagesByCategory(config.pages);
  const categories = getCategories(config.pages);
  
  for (const category of categories) {
    // Skip the main "すべて" category as it's handled by the main index
    if (category === 'すべて') {
      continue;
    }
    
    const categoryPages = groupedPages[category] || [];
    const sidebarHtml = generateEnhancedSidebar(config, null, true);
    
    // Generate category-specific content
    const { getPageUrl } = require('./sidebar');
    const categoryContent = categoryPages.map(page => `
      <div class="page-card">
        <h3><a href="${getPageUrl(page, '', config)}">${page.title}</a></h3>
        <p class="page-path">${page.path}</p>
      </div>
    `).join('');
    
    const categoryIndexHtml = `<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${category} - ${config.site.title}</title>
    <meta name="description" content="${config.site.description}">
    
    <!-- CSS -->
    <link rel="stylesheet" href="assets/css/style.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.8.0/styles/github.min.css">
    
    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@300;400;500;700&display=swap" rel="stylesheet">
    
    <!-- Favicon -->
    <link rel="icon" type="image/x-icon" href="assets/favicon.ico">
</head>
<body>
    <!-- Header -->
    <header class="site-header">
        <div class="container">
            <div class="header-content">
                <h1 class="site-title">
                    <a href="index.html">${config.site.title}</a>
                </h1>
                <p class="site-description">${config.site.description}</p>
            </div>
            <nav class="header-nav">
                <a href="index.html" class="nav-link">ホーム</a>
                <a href="#" class="nav-link" onclick="toggleSidebar()">メニュー</a>
            </nav>
        </div>
    </header>

    <!-- Main Layout -->
    <div class="main-layout">
        <!-- Sidebar -->
        <aside class="sidebar" id="sidebar">
            <div class="sidebar-header">
                <h2>ドキュメント一覧</h2>
                <button class="sidebar-close" onclick="toggleSidebar()">&times;</button>
            </div>
            <div class="sidebar-content">
                ${sidebarHtml}
            </div>
        </aside>

        <!-- Main Content -->
        <main class="main-content">
            <div class="content-wrapper">
                <!-- Page Content -->
                <article class="page-content">
                    <div class="content-area">
                        <div class="category-content">
                            <div class="category-description">
                                <p>${category}カテゴリのドキュメント一覧です。</p>
                            </div>
                            
                            <div class="pages-grid">
                                ${categoryContent}
                            </div>
                        </div>
                    </div>
                </article>
            </div>
        </main>
    </div>

    <!-- Footer -->
    <footer class="site-footer">
        <div class="container">
            <div class="footer-content">
                <p>&copy; ${new Date().getFullYear()} ${config.site.title}. All rights reserved.</p>
                <p class="footer-note">社内向け技術文書管理システム</p>
            </div>
        </div>
    </footer>

    <!-- JavaScript -->
    <script src="assets/js/main.js"></script>
    <script src="assets/js/sidebar.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.8.0/highlight.min.js"></script>
    <script>
        // Initialize syntax highlighting
        hljs.highlightAll();
    </script>
</body>
</html>`;

    // Save category index page
    const categoryFileName = `category-${category.toLowerCase().replace(/[^a-z0-9]/g, '-')}.html`;
    await fs.writeFile(path.join(outputDir, categoryFileName), categoryIndexHtml);
    console.log(`✅ Generated category index: ${categoryFileName}`);
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
    await fs.emptyDir(outputDir);
    
    // 2. Load configuration
    console.log('⚙️  Loading configuration...');
    const config = await loadConfig();
    
    // 3. Generate config.json for client-side consumption
    await generateConfigJson(config);
    
    // 4. Flatten hierarchical pages structure
    const flatPages = flattenPages(config.pages);
    
    // 5. Group pages by category
    const groupedPages = groupPagesByCategory(config.pages);
    
    // 6. Process each page
    console.log('📝 Processing markdown files...');
    for (const page of flatPages) {
      try {
        const htmlContent = await convertMarkdown(page, config, groupedPages);
        
        // Save processed HTML
        const outputPath = path.join(outputDir, page.path.replace('.md', '.html'));
        await fs.ensureDir(path.dirname(outputPath));
        await fs.writeFile(outputPath, htmlContent);
        
        console.log(`✅ Processed: ${page.path} -> ${outputPath}`);
      } catch (error) {
        console.error(`❌ Failed to process ${page.path}:`, error.message);
      }
    }
    
    // 7. Copy static files
    await copyStaticFiles();
    
    // 8. Generate index page
    await generateIndex(config);
    
    // 9. Generate category index pages
    await generateCategoryIndexes(config);
    
    console.log('🎉 Build completed successfully!');
    console.log('📂 Output directory: ./dist');
    console.log(`📊 Processed ${flatPages.length} pages`);
    
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

module.exports = { build, copyStaticFiles, generateIndex, generateCategoryIndexes, generateConfigJson };