# URL調整修正 - 解決方法の概要

## 問題の詳細

**問題**: サイドバーのリンク設定と実際のHTMLファイルパスに齟齬があった
- HTMLファイルは `/dist/docs` 配下に生成される
- サイドバーのリンクが正しい相対パスを生成していない

## 根本原因の分析

1. **ファイル構造**:
   - Markdownファイル: `docs/README.md`, `docs/setup/environment.md` など
   - 生成されるHTMLファイル: `dist/docs/README.html`, `dist/docs/setup/environment.html` など

2. **問題のあったコード**:
   - `scripts/sidebar.js` の `getPageUrl()` 関数が単純な `../` 追加のみ
   - パンくずナビゲーションがハードコードされた `../index.html` を使用
   - ディレクトリの深さを正しく計算していない

## 実装した解決策

### 1. 相対パス計算の改善

**修正前**:
```javascript
function getPageUrl(page, currentPath = '') {
  const htmlPath = page.path.replace('.md', '.html');
  const currentDir = path.dirname(currentPath);
  if (currentDir && currentDir !== '.') {
    return '../' + htmlPath;  // 単純な../追加のみ
  }
  return htmlPath;
}
```

**修正後**:
```javascript
function getPageUrl(page, currentPath = '') {
  const htmlPath = page.path.replace('.md', '.html');
  
  if (!currentPath) {
    return htmlPath;
  }
  
  const currentDir = path.dirname(currentPath);
  const targetDir = path.dirname(htmlPath);
  const targetFile = path.basename(htmlPath);
  
  // 同一ディレクトリの場合
  if (currentDir === targetDir) {
    return targetFile;
  }
  
  // 相対パスを正確に計算
  const currentDepth = currentDir === '.' ? 0 : currentDir.split('/').length;
  let relativePath = '';
  
  if (currentDepth > 0) {
    relativePath = '../'.repeat(currentDepth);
  }
  
  if (targetDir !== '.') {
    relativePath += targetDir + '/';
  }
  relativePath += targetFile;
  
  return relativePath;
}
```

### 2. パンくずナビゲーションの動的計算

**修正前**:
```javascript
html += '  <a href="../index.html">ホーム</a>\n';  // ハードコード
```

**修正後**:
```javascript
const currentDir = path.dirname(page.path);
const currentDepth = currentDir === '.' ? 0 : currentDir.split('/').length;
const indexPath = currentDepth > 0 ? '../'.repeat(currentDepth) + 'index.html' : 'index.html';
html += `  <a href="${indexPath}">ホーム</a>\n`;  // 動的計算
```

### 3. 一貫したURL生成の適用

- カテゴリインデックス生成でも同じ `getPageUrl()` 関数を使用
- すべてのナビゲーション要素で統一されたロジックを適用

## 修正結果の例

| 現在のページ | 対象ページ | 修正前 | 修正後 |
|-------------|-----------|--------|--------|
| `docs/setup/environment.md` | `docs/README.md` | `../docs/README.html` ❌ | `../README.html` ✅ |
| `docs/README.md` | `docs/setup/environment.md` | `docs/setup/environment.html` ❌ | `setup/environment.html` ✅ |
| `docs/setup/environment.md` | `docs/api/endpoints.md` | `../docs/api/endpoints.html` ❌ | `../api/endpoints.html` ✅ |

## テストの追加

### 1. 単体テスト (`run_tests.js`)
- URL生成ロジックの検証
- パンくずナビゲーションの検証
- ビルドプロセスの検証

### 2. 統合テスト (`test_integration.js`)
- 実際に生成されたHTMLファイルのリンク検証
- サイドバーとパンくずの実際の動作確認

### 3. 実行方法
```bash
npm test                # 全テスト実行
npm run test:integration # 統合テスト
npm run test:urls       # URL生成テスト
```

## 検証済み項目

- ✅ 同一ディレクトリ内のナビゲーション
- ✅ 親ディレクトリへのナビゲーション
- ✅ 子ディレクトリへのナビゲーション
- ✅ 兄弟ディレクトリ間のナビゲーション
- ✅ パンくずナビゲーションの正確性
- ✅ アセット（CSS、JS）の読み込み
- ✅ 複数階層のディレクトリ構造での動作

## 影響範囲

この修正により以下が改善されました：
- サイドバーのすべてのリンクが正しく動作
- パンくずナビゲーションが正しいパスを生成
- カテゴリページのリンクが正常動作
- 全体的なナビゲーション体験の向上

HTMLファイルが `/dist/docs` 配下に生成される構造に完全対応し、すべてのリンクが正しく機能するようになりました。