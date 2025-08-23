---
title: 開発環境セットアップ
category: 環境構築
---

# 開発環境セットアップ

このドキュメントでは、プロジェクトの開発環境をセットアップする手順を説明します。

## 前提条件

開発を始める前に、以下のソフトウェアがインストールされていることを確認してください：

- **Node.js** (v16.0.0以上)
- **npm** (v8.0.0以上)
- **Git** (v2.30.0以上)

## インストール手順

### 1. リポジトリのクローン

```bash
git clone https://github.com/your-org/internal-docs.git
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

開発サーバーが起動すると、`http://localhost:3000` でサイトにアクセスできます。

## 環境変数の設定

プロジェクトルートに `.env` ファイルを作成し、以下の環境変数を設定してください：

```env
NODE_ENV=development
PORT=3000
SITE_URL=http://localhost:3000
```

## ディレクトリ構造

```
internal-docs/
├── assets/           # 静的アセット
│   ├── css/         # スタイルシート
│   └── js/          # JavaScript
├── config/          # 設定ファイル
├── docs/            # ドキュメントファイル
├── scripts/         # ビルドスクリプト
└── templates/       # HTMLテンプレート
```

## 開発ワークフロー

1. **新しいドキュメントの作成**
   - `docs/` ディレクトリ内に Markdown ファイルを作成
   - `config/config.json` にページ情報を追加

2. **ローカルでの確認**
   - `npm run dev` で開発サーバーを起動
   - ブラウザで変更を確認

3. **ビルドとデプロイ**
   - `npm run build` で本番用ビルドを実行
   - GitHub Actions が自動的にデプロイを実行

## トラブルシューティング

### よくある問題

**Q: `npm install` でエラーが発生する**
A: Node.js のバージョンを確認し、v16.0.0以上であることを確認してください。

**Q: 開発サーバーが起動しない**
A: ポート3000が使用されていないか確認してください。別のポートを使用する場合は、`PORT` 環境変数を設定してください。

**Q: ビルドが失敗する**
A: `config/config.json` の構文エラーがないか確認してください。

## 次のステップ

環境セットアップが完了したら、以下のドキュメントを参照してください：

- [デプロイメント手順](deployment.md)
- [API仕様書](../api/endpoints.md)
- [トラブルシューティングガイド](../guides/troubleshooting.md)