---
title: トラブルシューティングガイド
category: ガイド
---

# トラブルシューティングガイド

このドキュメントでは、社内ドキュメントシステムでよく発生する問題とその解決方法を説明します。

## 一般的な問題

### 1. ページが表示されない

#### 症状
- ブラウザで404エラーが表示される
- ページが真っ白になる
- 「ページが見つかりません」と表示される

#### 原因と解決方法

**原因1: ファイルパスの間違い**
```bash
# 問題のあるパス例
docs/setup/enviroment.md  # スペルミス

# 正しいパス
docs/setup/environment.md
```

**解決方法:**
1. `config/config.json` でパスを確認
2. 実際のファイルが存在するか確認
3. ファイル名のスペルチェック

**原因2: config.json の構文エラー**
```json
// 問題のある例（末尾のカンマ）
{
  "site": {
    "title": "サイトタイトル",
  }
}

// 正しい例
{
  "site": {
    "title": "サイトタイトル"
  }
}
```

**解決方法:**
```bash
# JSON構文チェック
npm run validate-config

# または手動でチェック
node -e "console.log(JSON.parse(require('fs').readFileSync('config/config.json', 'utf8')))"
```

### 2. ビルドが失敗する

#### 症状
- `npm run build` でエラーが発生
- GitHub Actions でデプロイが失敗
- 「Build failed」メッセージが表示

#### 原因と解決方法

**原因1: 依存関係の問題**
```bash
# エラーメッセージ例
Error: Cannot find module 'marked'
```

**解決方法:**
```bash
# 依存関係の再インストール
rm -rf node_modules package-lock.json
npm install

# または特定のパッケージを再インストール
npm install marked --save
```

**原因2: Markdownの構文エラー**
```markdown
<!-- 問題のある例 -->
# タイトル
## サブタイトル
### サブサブタイトル
## 順序が間違っている見出し
```

**解決方法:**
```bash
# Markdownの構文チェック
npm run lint-markdown

# 手動でチェック
markdownlint docs/**/*.md
```

### 3. サイドバーが表示されない

#### 症状
- モバイルでハンバーガーメニューが動作しない
- サイドバーのナビゲーションが空白
- カテゴリが正しく表示されない

#### 原因と解決方法

**原因1: JavaScript エラー**

**解決方法:**
1. ブラウザの開発者ツールでコンソールエラーを確認
2. `assets/js/sidebar.js` が正しく読み込まれているか確認

```html
<!-- テンプレートで確認 -->
<script src="../assets/js/sidebar.js"></script>
```

**原因2: CSS の問題**

**解決方法:**
```css
/* モバイル表示の確認 */
@media (max-width: 1024px) {
  .sidebar {
    transform: translateX(-100%);
  }
  
  .sidebar.sidebar-open {
    transform: translateX(0);
  }
}
```

### 4. 検索機能が動作しない

#### 症状
- 検索ボックスに入力しても結果が表示されない
- 検索結果が正しくない
- 検索ボックスが表示されない

#### 原因と解決方法

**原因1: 検索データの構築エラー**

**解決方法:**
```javascript
// ブラウザのコンソールで確認
console.log(window.sidebarManager.searchData);

// 検索データが空の場合は再構築
window.sidebarManager.buildSearchData();
```

**原因2: 日本語検索の問題**

**解決方法:**
```javascript
// 検索ロジックの改善
const normalizeText = (text) => {
  return text.toLowerCase()
    .replace(/[ａ-ｚＡ-Ｚ０-９]/g, (s) => String.fromCharCode(s.charCodeAt(0) - 0xFEE0))
    .replace(/[‐－―]/g, '-');
};
```

## パフォーマンス問題

### 1. ページの読み込みが遅い

#### 診断方法
```bash
# Lighthouse でパフォーマンス測定
npm run lighthouse

# または手動で測定
npx lighthouse https://your-site.com --output html --output-path ./lighthouse-report.html
```

#### 改善方法

**画像の最適化:**
```bash
# 画像圧縮
npm install -g imagemin-cli
imagemin assets/images/* --out-dir=assets/images/optimized
```

**CSS/JS の最小化:**
```bash
# CSS最小化
npm run minify-css

# JavaScript最小化
npm run minify-js
```

### 2. モバイルでの表示問題

#### 診断方法
```bash
# モバイル表示テスト
npm run test-mobile

# または手動でテスト
# Chrome DevTools > Device Toolbar
```

#### 改善方法

**レスポンシブ画像:**
```html
<img src="image.jpg" 
     srcset="image-320w.jpg 320w, image-768w.jpg 768w, image-1200w.jpg 1200w"
     sizes="(max-width: 320px) 280px, (max-width: 768px) 720px, 1200px"
     alt="説明">
```

**タッチ操作の改善:**
```css
/* タッチターゲットのサイズ確保 */
.nav-link {
  min-height: 44px;
  min-width: 44px;
}
```

## セキュリティ問題

### 1. XSS (Cross-Site Scripting) 対策

#### 問題の確認
```javascript
// 危険な例
document.innerHTML = userInput;

// 安全な例
document.textContent = userInput;
```

#### 解決方法
```javascript
// HTMLエスケープ関数
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
```

### 2. 機密情報の漏洩防止

#### チェック項目
- [ ] APIキーがコードに含まれていない
- [ ] パスワードがログに出力されていない
- [ ] 個人情報が適切に保護されている

#### 解決方法
```bash
# 機密情報のスキャン
npm audit
git-secrets --scan

# 環境変数の使用
echo "API_KEY=your-secret-key" > .env
echo ".env" >> .gitignore
```

## デプロイ問題

### 1. GitHub Actions の失敗

#### ログの確認方法
1. GitHub リポジトリの「Actions」タブを開く
2. 失敗したワークフローをクリック
3. エラーメッセージを確認

#### よくあるエラーと解決方法

**Node.js バージョンの不一致:**
```yaml
# .github/workflows/deploy.yml
- name: Setup Node.js
  uses: actions/setup-node@v3
  with:
    node-version: '18'  # プロジェクトで使用しているバージョンに合わせる
```

**権限エラー:**
```yaml
# GitHub Pages への書き込み権限を確認
permissions:
  contents: read
  pages: write
  id-token: write
```

### 2. GitHub Pages での表示問題

#### 相対パスの問題
```html
<!-- 問題のある例 -->
<link rel="stylesheet" href="/assets/css/style.css">

<!-- 正しい例 -->
<link rel="stylesheet" href="./assets/css/style.css">
```

#### ベースURLの設定
```json
// config.json
{
  "site": {
    "baseUrl": "https://username.github.io/repository-name/"
  }
}
```

## ログとモニタリング

### 1. エラーログの確認

#### ブラウザでの確認
```javascript
// コンソールエラーの監視
window.addEventListener('error', (event) => {
  console.error('JavaScript Error:', event.error);
});

// 未処理のPromise拒否の監視
window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled Promise Rejection:', event.reason);
});
```

#### サーバーログの確認
```bash
# 開発サーバーのログ
npm run dev -- --verbose

# ビルドログの詳細表示
npm run build -- --verbose
```

### 2. パフォーマンス監視

#### Core Web Vitals の測定
```javascript
// Web Vitals の測定
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

getCLS(console.log);
getFID(console.log);
getFCP(console.log);
getLCP(console.log);
getTTFB(console.log);
```

## 緊急時の対応

### 1. サイトダウン時の対応

#### 確認手順
1. **サイトの状態確認**
   ```bash
   curl -I https://your-site.com
   ```

2. **DNS の確認**
   ```bash
   nslookup your-site.com
   ```

3. **GitHub Pages の状態確認**
   - [GitHub Status](https://www.githubstatus.com/) を確認

#### 復旧手順
1. **ロールバック**
   ```bash
   git revert HEAD
   git push origin main
   ```

2. **緊急メンテナンスページ**
   ```html
   <!-- maintenance.html -->
   <!DOCTYPE html>
   <html>
   <head>
     <title>メンテナンス中</title>
   </head>
   <body>
     <h1>システムメンテナンス中</h1>
     <p>現在システムメンテナンスを実施しております。</p>
   </body>
   </html>
   ```

### 2. データ復旧

#### バックアップからの復旧
```bash
# Gitの履歴から復旧
git log --oneline
git checkout <commit-hash> -- config/config.json

# 特定のファイルの復旧
git show HEAD~1:docs/important-file.md > docs/important-file.md
```

## サポートとエスカレーション

### 1. 社内サポート

**レベル1: 基本的な問題**
- ページが表示されない
- 検索が動作しない
- モバイル表示の問題

**レベル2: 技術的な問題**
- ビルドエラー
- パフォーマンス問題
- セキュリティ問題

**レベル3: システム障害**
- サイト全体のダウン
- データ損失
- セキュリティインシデント

### 2. 外部サポート

**GitHub サポート:**
- GitHub Pages の問題
- Actions の制限事項

**CDN プロバイダー:**
- 配信の問題
- キャッシュの問題

## 予防策

### 1. 定期メンテナンス

```bash
# 週次チェックリスト
npm audit                    # セキュリティ監査
npm outdated                 # 依存関係の更新確認
npm run test                 # テスト実行
npm run build                # ビルドテスト
```

### 2. 監視設定

```yaml
# .github/workflows/health-check.yml
name: Health Check
on:
  schedule:
    - cron: '0 */6 * * *'  # 6時間ごと

jobs:
  health-check:
    runs-on: ubuntu-latest
    steps:
      - name: Check site availability
        run: |
          curl -f https://your-site.com || exit 1
```

## 関連ドキュメント

- [開発環境セットアップ](../setup/environment.md)
- [デプロイメント手順](../setup/deployment.md)
- [ベストプラクティス](best-practices.md)
- [API認証仕様](../api/authentication.md)