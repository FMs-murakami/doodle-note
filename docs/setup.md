# 環境セットアップ手順

## 概要

このドキュメントでは、開発環境のセットアップ手順について説明します。

## 必要な環境

- Node.js 18.x以上
- npm 9.x以上
- Git

## セットアップ手順

### 1. リポジトリのクローン

```bash
git clone https://github.com/company/internal-docs.git
cd internal-docs
```

### 2. 依存関係のインストール

```bash
npm install
```

### 3. 開発サーバーの起動

```bash
npm run dev
```

### 4. ビルドの実行

```bash
npm run build
```

## トラブルシューティング

### Node.jsのバージョンが古い場合

```bash
# nvmを使用してNode.jsをアップデート
nvm install 18
nvm use 18
```

### 依存関係のインストールに失敗する場合

```bash
# キャッシュをクリアして再インストール
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

## 注意事項

- 本番環境へのデプロイ前には必ずテストを実行してください
- 設定ファイルの変更後は必ずビルドを実行してください