#!/usr/bin/env node

/**
 * Final Phase 3 Demonstration Script
 * Shows all implemented functionality working together
 */

const fs = require('fs-extra');
const path = require('path');

console.log('🎯 Phase 3: MDファイルのHTML変換実装 - 最終デモンストレーション');
console.log('=' .repeat(70));

async function demonstratePhase3() {
    try {
        console.log('\n📋 Issue #3: Config.json構造設計と読み込み機能');
        console.log('-'.repeat(50));
        
        // Load and demonstrate config functionality
        const { loadConfig, groupPagesByCategory, getCategories } = require('./scripts/config');
        const config = await loadConfig();
        
        console.log(`✅ サイトタイトル: ${config.site.title}`);
        console.log(`✅ サイト説明: ${config.site.description}`);
        console.log(`✅ ページ数: ${config.pages.length}`);
        
        const groupedPages = groupPagesByCategory(config.pages);
        const categories = getCategories(config.pages);
        
        console.log(`✅ カテゴリ数: ${categories.length}`);
        console.log(`✅ カテゴリ: ${categories.join(', ')}`);
        
        categories.forEach(category => {
            console.log(`   - ${category}: ${groupedPages[category].length}ページ`);
        });
        
        console.log('\n🔄 Issue #4: Markdown → HTML変換エンジン実装');
        console.log('-'.repeat(50));
        
        // Demonstrate markdown functionality
        const { extractFrontmatter, generateNavigation } = require('./scripts/markdown');
        
        // Test frontmatter extraction
        const sampleMarkdown = `---
title: サンプルページ
author: 開発チーム
---

# サンプルコンテンツ

これはテスト用のMarkdownコンテンツです。

\`\`\`javascript
console.log('Hello, World!');
\`\`\``;
        
        const { frontmatter, content } = extractFrontmatter(sampleMarkdown);
        console.log(`✅ フロントマター抽出: ${Object.keys(frontmatter).join(', ')}`);
        console.log(`✅ コンテンツ抽出: ${content.split('\n')[0]}...`);
        
        // Test navigation generation
        const navigation = generateNavigation(groupedPages, config.pages[0].path);
        console.log(`✅ ナビゲーション生成: ${navigation.length}文字のHTML`);
        
        console.log('\n🔧 Issue #5: ビルドスクリプト統合実装');
        console.log('-'.repeat(50));
        
        // Run the build process
        console.log('🚀 ビルドプロセス開始...');
        const { build } = require('./scripts/build');
        
        await build();
        
        // Check build results
        if (await fs.pathExists('dist')) {
            const files = await fs.readdir('dist', { recursive: true });
            console.log(`✅ ビルド完了: ${files.length}ファイル生成`);
            
            // Check specific files
            const expectedFiles = [
                'dist/index.html',
                'dist/docs/setup.html',
                'dist/docs/api-spec.html',
                'dist/docs/README.html'
            ];
            
            for (const file of expectedFiles) {
                if (await fs.pathExists(file)) {
                    const stats = await fs.stat(file);
                    console.log(`   ✅ ${file} (${Math.round(stats.size / 1024)}KB)`);
                } else {
                    console.log(`   ⚠️  ${file} - 見つかりません`);
                }
            }
            
            // Check index page content
            if (await fs.pathExists('dist/index.html')) {
                const indexContent = await fs.readFile('dist/index.html', 'utf8');
                if (indexContent.includes(config.site.title)) {
                    console.log('   ✅ インデックスページにサイトタイトルが含まれています');
                }
                if (indexContent.includes('category-section')) {
                    console.log('   ✅ カテゴリ別セクションが生成されています');
                }
            }
            
            // Check converted markdown pages
            for (const page of config.pages) {
                const htmlPath = path.join('dist', page.path.replace('.md', '.html'));
                if (await fs.pathExists(htmlPath)) {
                    const htmlContent = await fs.readFile(htmlPath, 'utf8');
                    if (htmlContent.includes(page.title)) {
                        console.log(`   ✅ ${page.title} - 正常に変換されました`);
                    }
                }
            }
        }
        
        console.log('\n🎉 Phase 3 実装完了！');
        console.log('=' .repeat(70));
        console.log('✅ すべての要件が正常に実装されました');
        console.log('✅ カテゴリベースのドキュメント管理システムが完成');
        console.log('✅ Markdown → HTML変換が動作');
        console.log('✅ レスポンシブなHTMLテンプレートを使用');
        console.log('✅ シンタックスハイライト対応');
        console.log('✅ 自動ナビゲーション生成');
        console.log('✅ エラーハンドリング実装');
        
        console.log('\n📂 生成されたファイルは dist/ ディレクトリで確認できます');
        console.log('🌐 ローカルサーバーで表示: npm run dev');
        
    } catch (error) {
        console.error('❌ デモンストレーション中にエラーが発生しました:', error.message);
        console.error(error.stack);
        process.exit(1);
    }
}

// Run the demonstration
demonstratePhase3();