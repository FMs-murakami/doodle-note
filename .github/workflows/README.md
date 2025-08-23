# GitHub Actions ワークフロー

このディレクトリには、社内ドキュメントサイトの自動デプロイ用GitHub Actionsワークフローが含まれています。

## deploy.yml

GitHub Pagesへの自動デプロイを実行するワークフローです。

### トリガー条件
- `main`ブランチへのpush
- `main`ブランチへのPRのマージ

### 実行内容
1. **ビルドジョブ**
   - Node.js 18環境のセットアップ
   - 依存関係のインストール (`npm ci`)
   - サイトのビルド (`npm run build`)
   - GitHub Pagesアーティファクトのアップロード

2. **デプロイジョブ**
   - GitHub Pagesへのデプロイ実行
   - デプロイ完了後のURL提供

### 必要な設定

#### リポジトリ設定
1. リポジトリの Settings → Pages に移動
2. Build and deployment → Source を **GitHub Actions** に設定
3. GITHUB_TOKEN の権限が適切に設定されていることを確認

#### 権限設定
ワークフローには以下の権限が設定されています：
- `contents: read` - リポジトリ内容の読み取り
- `pages: write` - GitHub Pagesへの書き込み
- `id-token: write` - デプロイ用トークンの生成

### 出力ディレクトリ
ビルドされたサイトは `./dist` ディレクトリに出力され、GitHub Pagesにデプロイされます。

### トラブルシューティング
- ワークフローが失敗する場合は、Actions タブでログを確認してください
- Node.js の依存関係エラーの場合は、package.json の設定を確認してください
- デプロイエラーの場合は、リポジトリのPages設定を確認してください