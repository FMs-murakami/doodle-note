---
title: デプロイメント手順
category: 環境構築
---

# デプロイメント手順

このドキュメントでは、内部ドキュメントサイトを本番環境にデプロイする手順を説明します。

## デプロイメント概要

本プロジェクトは GitHub Actions を使用した自動デプロイメントを採用しています。

### デプロイメントフロー

1. **開発** → `main` ブランチへのプッシュ
2. **CI/CD** → GitHub Actions による自動ビルド
3. **デプロイ** → GitHub Pages への自動デプロイ

## GitHub Actions 設定

### ワークフロー設定

`.github/workflows/deploy.yml` ファイルで自動デプロイを設定：

```yaml
name: Deploy Documentation

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout
      uses: actions/checkout@v3
      
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Build site
      run: npm run build
      
    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      if: github.ref == 'refs/heads/main'
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./dist
```

### 必要な設定

1. **GitHub Pages の有効化**
   - リポジトリ設定 → Pages
   - Source: GitHub Actions

2. **ブランチ保護ルール**
   - `main` ブランチの保護
   - プルリクエスト必須

## 手動デプロイ

緊急時やテスト目的で手動デプロイを行う場合：

### 1. ローカルビルド

```bash
# 依存関係のインストール
npm install

# 本番ビルド
npm run build

# ビルド結果の確認
ls -la dist/
```

### 2. デプロイ前チェック

```bash
# リンク切れチェック
npm run check-links

# HTML バリデーション
npm run validate-html

# パフォーマンステスト
npm run lighthouse
```

### 3. 手動デプロイ実行

```bash
# GitHub Pages へのデプロイ
npm run deploy
```

## 環境別設定

### 本番環境

```json
{
  "site": {
    "title": "社内手順書・仕様書",
    "description": "社内向け技術文書管理システム",
    "baseUrl": "https://your-org.github.io/internal-docs/"
  }
}
```

### ステージング環境

```json
{
  "site": {
    "title": "[STAGING] 社内手順書・仕様書",
    "description": "ステージング環境",
    "baseUrl": "https://staging.your-org.com/"
  }
}
```

## デプロイメント監視

### ヘルスチェック

デプロイ後の自動ヘルスチェック項目：

- [ ] サイトの応答性（200 OK）
- [ ] 主要ページの表示確認
- [ ] ナビゲーションの動作確認
- [ ] モバイル表示の確認
- [ ] 検索機能の動作確認

### 監視ツール

- **Uptime Robot**: サイトの稼働監視
- **Google Analytics**: アクセス解析
- **Lighthouse CI**: パフォーマンス監視

## ロールバック手順

問題が発生した場合のロールバック手順：

### 1. 緊急ロールバック

```bash
# 前回の安定版タグに戻す
git checkout v1.2.3
git push origin main --force
```

### 2. 段階的ロールバック

```bash
# 問題のあるコミットを特定
git log --oneline

# 特定のコミットを取り消し
git revert <commit-hash>
git push origin main
```

## セキュリティ考慮事項

### アクセス制御

- GitHub Pages は公開サイトのため、機密情報は含めない
- 社内限定情報は別の認証付きシステムを使用

### 依存関係管理

```bash
# セキュリティ監査
npm audit

# 脆弱性の修正
npm audit fix
```

## パフォーマンス最適化

### ビルド最適化

- 画像の圧縮
- CSS/JS の最小化
- 不要なファイルの除外

### CDN 設定

```html
<!-- 外部リソースの CDN 利用 -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/highlight.js@11.8.0/styles/github.min.css">
<script src="https://cdn.jsdelivr.net/npm/highlight.js@11.8.0/highlight.min.js"></script>
```

## トラブルシューティング

### よくある問題

**Q: デプロイが失敗する**
A: GitHub Actions のログを確認し、ビルドエラーの原因を特定してください。

**Q: サイトが更新されない**
A: GitHub Pages のキャッシュクリアを試してください（通常5-10分で反映）。

**Q: 404 エラーが発生する**
A: `config.json` のパス設定と実際のファイル構造を確認してください。

## 関連ドキュメント

- [開発環境セットアップ](environment.md)
- [トラブルシューティングガイド](../guides/troubleshooting.md)
- [ベストプラクティス](../guides/best-practices.md)