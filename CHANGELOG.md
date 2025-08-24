# Changelog

## URL調整修正 (URL Path Fix)

### 問題 (Issue)
サイドバーのリンク設定と実際のHTMLファイルパスに齟齬がありました。
- HTMLファイルは `/dist/docs` 配下に生成される
- サイドバーのリンクが正しい相対パスを生成していない

### 修正内容 (Changes Made)

#### 1. `scripts/sidebar.js` の修正
- **`getPageUrl()` 関数の改善**: 
  - 単純な `../` 追加から、適切な相対パス計算に変更
  - ディレクトリの深さを考慮した正確なパス生成
  - 同一ディレクトリ、親ディレクトリ、兄弟ディレクトリへのナビゲーションを正しく処理

- **`generateBreadcrumb()` 関数の修正**:
  - ハードコードされた `../index.html` を動的計算に変更
  - ページの深さに基づいて正しい相対パスを生成

- **`generatePageNavigation()` 関数の更新**:
  - 一貫した URL 生成ロジックを使用

#### 2. `scripts/build.js` の修正
- **カテゴリインデックス生成の修正**:
  - `page.path.replace('.md', '.html')` から `getPageUrl()` 使用に変更
  - 一貫したURL生成ロジックを適用

#### 3. テストの追加
- **`run_tests.js`**: 包括的なテストスイート
  - URL生成のテスト
  - パンくずナビゲーションのテスト
  - ビルドプロセスのテスト

- **`test_integration.js`**: 統合テスト
  - 生成されたHTMLファイルのリンク検証
  - サイドバーリンクの正確性確認
  - パンくずリンクの検証

- **`test_urls.js`**: URL生成の単体テスト

### 修正されたURL生成パターン

#### 修正前 (Before)
```
docs/setup/environment.md から docs/README.md へ: ../docs/README.html (不正)
docs/README.md から docs/setup/environment.md へ: docs/setup/environment.html (不正)
```

#### 修正後 (After)
```
docs/setup/environment.md から docs/README.md へ: ../README.html (正しい)
docs/README.md から docs/setup/environment.md へ: setup/environment.html (正しい)
docs/setup/environment.md から docs/api/endpoints.md へ: ../api/endpoints.html (正しい)
```

### テスト実行方法

```bash
# 全テスト実行
npm test

# 統合テスト実行
npm run test:integration

# URL生成テスト実行
npm run test:urls

# ビルド実行
npm run build
```

### 検証項目
- [x] サイドバーリンクが正しい相対パスを生成
- [x] パンくずナビゲーションが正しいindex.htmlへのパスを生成
- [x] カテゴリページのリンクが正しく動作
- [x] 全ディレクトリレベルでのナビゲーションが正常動作
- [x] アセット（CSS、JS）の読み込みが正常動作

### 影響範囲
- サイドバーナビゲーション
- パンくずナビゲーション
- カテゴリインデックスページ
- ページ間ナビゲーション

この修正により、HTMLファイルが `/dist/docs` 配下に生成される構造に対して、すべてのリンクが正しく動作するようになりました。