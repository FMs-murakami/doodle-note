# Windows環境構築

Windows環境での開発環境セットアップ手順について説明します。

## 前提条件

- Windows 10 以降
- 管理者権限でのアクセス

## 必要なソフトウェア

### 1. Node.js のインストール

公式サイトからNode.jsをダウンロードしてインストールします。

```bash
# バージョン確認
node --version
npm --version
```

### 2. Git のインストール

Git for Windowsをインストールします。

```bash
# Git設定
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

### 3. Visual Studio Code

推奨エディタとしてVS Codeをインストールします。

```bash
# 拡張機能のインストール
code --install-extension ms-vscode.vscode-json
code --install-extension bradlc.vscode-tailwindcss
```

## プロジェクトセットアップ

### リポジトリのクローン

```bash
git clone https://github.com/your-org/project.git
cd project
```

### 依存関係のインストール

```bash
npm install
```

### 開発サーバーの起動

```bash
npm run dev
```

## トラブルシューティング

### PowerShell実行ポリシーエラー

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### パス関連の問題

環境変数PATHにNode.jsとnpmのパスが含まれていることを確認してください。

## 次のステップ

- [開発環境セットアップ](environment.md)
- [デプロイメント手順](deployment.md)