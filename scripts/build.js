#!/usr/bin/env node

/**
 * Build script for internal documentation site
 * Processes Markdown files and generates static HTML pages
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
        console.warn('Syntax highlighting failed:', err.message);
      }
    }
    return hljs.highlightAuto(code).value;
  },
  langPrefix: 'hljs language-',
  breaks: true,
  gfm: true
});

async function build() {
  console.log('🚀 Starting build process...');
  
  try {
    // Ensure dist directory exists
    await fs.ensureDir('dist');
    
    // Copy static assets
    console.log('📁 Copying static assets...');
    await fs.copy('assets', 'dist/assets');
    await fs.copy('index.html', 'dist/index.html');
    
    // Load configuration
    console.log('⚙️  Loading configuration...');
    const config = await fs.readJson('config/config.json');
    
    // Process markdown files
    console.log('📝 Processing markdown files...');
    for (const page of config.pages) {
      if (await fs.pathExists(page.path)) {
        const markdownContent = await fs.readFile(page.path, 'utf8');
        const htmlContent = marked(markdownContent);
        
        // Create HTML page (basic template for now)
        const htmlPage = `
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${page.title} - ${config.site.title}</title>
    <link rel="stylesheet" href="../assets/css/style.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.8.0/styles/default.min.css">
</head>
<body>
    <header>
        <div class="container">
            <h1><a href="../index.html">${config.site.title}</a></h1>
            <p class="subtitle">${config.site.description}</p>
        </div>
    </header>
    <main>
        <div class="container">
            <article class="content-area">
                ${htmlContent}
            </article>
        </div>
    </main>
    <footer>
        <div class="container">
            <p>&copy; 2024 社内ドキュメント管理サイト. All rights reserved.</p>
        </div>
    </footer>
</body>
</html>`;
        
        // Save processed HTML
        const outputPath = path.join('dist', page.path.replace('.md', '.html'));
        await fs.ensureDir(path.dirname(outputPath));
        await fs.writeFile(outputPath, htmlPage);
        
        console.log(`✅ Processed: ${page.path} -> ${outputPath}`);
      } else {
        console.warn(`⚠️  File not found: ${page.path}`);
      }
    }
    
    console.log('🎉 Build completed successfully!');
    console.log('📂 Output directory: ./dist');
    
  } catch (error) {
    console.error('❌ Build failed:', error.message);
    process.exit(1);
  }
}

// Run build if this script is executed directly
if (require.main === module) {
  build();
}

module.exports = { build };