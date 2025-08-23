---
title: ベストプラクティス
category: ガイド
---

# ベストプラクティス

このドキュメントでは、社内ドキュメントシステムを効果的に活用するためのベストプラクティスを説明します。

## ドキュメント作成のベストプラクティス

### 1. 構造化された文書作成

#### 見出し構造の統一
```markdown
# メインタイトル（H1）- ページに1つのみ
## セクション（H2）
### サブセクション（H3）
#### 詳細項目（H4）
```

#### フロントマターの活用
```markdown
---
title: ドキュメントタイトル
category: カテゴリ名
tags: [tag1, tag2, tag3]
author: 作成者名
created: 2024-01-15
updated: 2024-01-15
---
```

### 2. 読みやすい文書の作成

#### 適切な段落分け
```markdown
<!-- 良い例 -->
## 概要

このシステムは社内向けの文書管理システムです。
主な機能は以下の通りです。

- ドキュメントの作成・編集
- カテゴリ別の整理
- 全文検索機能

## 使用方法

システムの使用方法について説明します。

<!-- 悪い例 -->
## 概要
このシステムは社内向けの文書管理システムです。主な機能は以下の通りです。- ドキュメントの作成・編集- カテゴリ別の整理- 全文検索機能## 使用方法システムの使用方法について説明します。
```

#### コードブロックの適切な使用
```markdown
<!-- 言語指定を必ず行う -->
```javascript
function example() {
  console.log('Hello, World!');
}
```

```bash
npm install package-name
```

```json
{
  "name": "example",
  "version": "1.0.0"
}
```
```

### 3. 画像とメディアの活用

#### 画像の最適化
```markdown
<!-- 適切なalt属性を設定 -->
![システム構成図](../assets/images/system-architecture.png)

<!-- 画像サイズの指定 -->
<img src="../assets/images/screenshot.png" alt="画面キャプチャ" width="600">
```

#### 図表の活用
```markdown
| 項目 | 説明 | 必須 |
|------|------|------|
| ユーザー名 | ログイン用のユーザー名 | ✓ |
| パスワード | 8文字以上の英数字 | ✓ |
| メールアドレス | 通知用のメールアドレス | - |
```

## カテゴリとタグの管理

### 1. カテゴリの命名規則

#### 推奨カテゴリ
- **概要**: プロジェクトの概要や紹介
- **環境構築**: セットアップや環境設定
- **API**: API仕様や使用方法
- **ガイド**: 操作手順やハウツー
- **仕様書**: 技術仕様や設計書
- **トラブルシューティング**: 問題解決方法

#### カテゴリ設計の原則
```json
{
  "categories": {
    "概要": {
      "description": "プロジェクトの全体像",
      "order": 1
    },
    "環境構築": {
      "description": "開発・本番環境の構築",
      "order": 2
    },
    "API": {
      "description": "API仕様と使用方法",
      "order": 3
    }
  }
}
```

### 2. タグの効果的な使用

#### タグの命名規則
```markdown
<!-- 技術スタック -->
tags: [javascript, nodejs, react, vue]

<!-- 対象者 -->
tags: [beginner, intermediate, advanced]

<!-- 用途 -->
tags: [setup, configuration, deployment, troubleshooting]
```

#### タグの階層化
```markdown
<!-- 階層的なタグ -->
tags: [api, api-v1, api-authentication]
tags: [frontend, frontend-react, frontend-components]
```

## バージョン管理のベストプラクティス

### 1. Gitワークフロー

#### ブランチ戦略
```bash
# メインブランチ
main                    # 本番環境用

# 開発ブランチ
develop                 # 開発統合用
feature/new-document    # 新機能開発用
hotfix/urgent-fix       # 緊急修正用
```

#### コミットメッセージの規則
```bash
# 良い例
feat: 新しいAPI仕様書を追加
fix: サイドバーの表示問題を修正
docs: トラブルシューティングガイドを更新
style: コードフォーマットを統一

# 悪い例
update
fix bug
add file
```

### 2. プルリクエストのベストプラクティス

#### プルリクエストテンプレート
```markdown
## 変更内容
- [ ] 新しいドキュメントの追加
- [ ] 既存ドキュメントの更新
- [ ] 設定ファイルの変更

## チェックリスト
- [ ] Markdownの構文チェック完了
- [ ] リンク切れチェック完了
- [ ] ローカルでのビルド確認完了
- [ ] レスポンシブ表示確認完了

## 関連Issue
Closes #123
```

## パフォーマンス最適化

### 1. 画像最適化

#### 画像フォーマットの選択
```markdown
<!-- 写真: JPEG -->
![写真](photo.jpg)

<!-- アイコン・図表: PNG -->
![アイコン](icon.png)

<!-- ベクター画像: SVG -->
![ロゴ](logo.svg)

<!-- 次世代フォーマット: WebP -->
<picture>
  <source srcset="image.webp" type="image/webp">
  <img src="image.jpg" alt="画像">
</picture>
```

#### 画像サイズの最適化
```bash
# 画像圧縮ツールの使用
npm install -g imagemin-cli
imagemin assets/images/*.jpg --out-dir=assets/images/optimized --plugin=imagemin-mozjpeg
```

### 2. コンテンツ最適化

#### 長いドキュメントの分割
```markdown
<!-- 悪い例: 1つの巨大なファイル -->
# 完全なAPIガイド（10,000行）

<!-- 良い例: 適切な分割 -->
# API概要
# API認証
# APIエンドポイント
# APIエラーハンドリング
```

#### 目次の活用
```markdown
# 長いドキュメントの例

## 目次
1. [概要](#概要)
2. [インストール](#インストール)
3. [設定](#設定)
4. [使用方法](#使用方法)

## 概要
...

## インストール
...
```

## アクセシビリティ

### 1. 読みやすさの向上

#### 適切な見出し構造
```markdown
# ページタイトル（H1）
## メインセクション（H2）
### サブセクション（H3）
#### 詳細項目（H4）

<!-- 見出しレベルを飛ばさない -->
# H1
### H3 ← 悪い例（H2を飛ばしている）

# H1
## H2
### H3 ← 良い例
```

#### 代替テキストの設定
```markdown
<!-- 良い例 -->
![システム構成図：ユーザー、API、データベースの関係を示す図](architecture.png)

<!-- 悪い例 -->
![画像](image.png)
```

### 2. ナビゲーションの改善

#### パンくずナビゲーション
```html
<nav aria-label="パンくずナビゲーション">
  <a href="/">ホーム</a> > 
  <a href="/api/">API</a> > 
  <span aria-current="page">認証</span>
</nav>
```

#### スキップリンク
```html
<a href="#main-content" class="skip-link">メインコンテンツへスキップ</a>
```

## SEO最適化

### 1. メタデータの設定

#### ページタイトルの最適化
```html
<!-- 良い例 -->
<title>API認証仕様 - 社内ドキュメントシステム</title>

<!-- 悪い例 -->
<title>ページ</title>
```

#### メタディスクリプション
```html
<meta name="description" content="社内APIシステムの認証方式（JWT、API Key、OAuth 2.0）について詳しく説明します。">
```

### 2. 構造化データ

#### JSON-LD の活用
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "TechnicalArticle",
  "headline": "API認証仕様",
  "author": {
    "@type": "Person",
    "name": "田中太郎"
  },
  "datePublished": "2024-01-15",
  "dateModified": "2024-01-15"
}
</script>
```

## セキュリティ

### 1. 機密情報の管理

#### 機密情報の除外
```markdown
<!-- 悪い例 -->
API_KEY=sk_live_1234567890abcdef

<!-- 良い例 -->
API_KEY=your_api_key_here
```

#### 環境変数の使用
```bash
# .env ファイル
API_KEY=actual_secret_key

# .gitignore に追加
echo ".env" >> .gitignore
```

### 2. リンクのセキュリティ

#### 外部リンクの安全性
```markdown
<!-- 外部リンクには rel="noopener" を追加 -->
[外部サイト](https://example.com){:target="_blank" rel="noopener"}
```

## 国際化（i18n）

### 1. 多言語対応の準備

#### 言語コードの設定
```html
<html lang="ja">
```

#### 文字エンコーディング
```html
<meta charset="UTF-8">
```

### 2. 翻訳可能な構造

#### 翻訳しやすい文書構造
```markdown
<!-- 良い例 -->
## インストール手順

以下の手順でインストールを行います：

1. リポジトリをクローンする
2. 依存関係をインストールする
3. 設定ファイルを作成する

<!-- 悪い例 -->
## インストール手順
リポジトリをクローンして依存関係をインストールし設定ファイルを作成します。
```

## 品質管理

### 1. レビュープロセス

#### レビューチェックリスト
- [ ] 内容の正確性
- [ ] 文法・表記の統一
- [ ] リンクの動作確認
- [ ] 画像の表示確認
- [ ] モバイル表示の確認

#### 定期的な更新
```markdown
<!-- ドキュメントヘッダーに更新日を記載 -->
---
title: ドキュメントタイトル
created: 2024-01-15
updated: 2024-01-20
review_date: 2024-04-15  # 次回レビュー予定日
---
```

### 2. 自動化ツール

#### リンクチェック
```bash
# package.json
{
  "scripts": {
    "check-links": "markdown-link-check docs/**/*.md"
  }
}
```

#### 文書校正
```bash
# textlint の設定
npm install textlint textlint-rule-preset-ja-technical-writing
```

## 運用・保守

### 1. 定期メンテナンス

#### 月次チェックリスト
- [ ] リンク切れチェック
- [ ] 画像の表示確認
- [ ] 依存関係の更新
- [ ] セキュリティ監査
- [ ] パフォーマンス測定

#### 四半期レビュー
- [ ] ドキュメント構造の見直し
- [ ] カテゴリ分類の最適化
- [ ] ユーザーフィードバックの反映
- [ ] アクセス解析の確認

### 2. バックアップ戦略

#### Gitによるバックアップ
```bash
# 定期的なバックアップ
git clone --mirror https://github.com/your-org/docs.git backup/
```

#### 外部バックアップ
```bash
# 重要なファイルの外部保存
rsync -av docs/ backup-server:/backup/docs/
```

## 関連ドキュメント

- [トラブルシューティングガイド](troubleshooting.md)
- [開発環境セットアップ](../setup/environment.md)
- [デプロイメント手順](../setup/deployment.md)
- [API仕様書](../api/endpoints.md)