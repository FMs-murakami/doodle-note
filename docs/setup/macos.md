# macOS環境構築

macOS環境での開発環境セットアップ手順について説明します。

## 前提条件

- macOS 10.15 (Catalina) 以降
- Xcode Command Line Tools

## Command Line Tools のインストール

```bash
xcode-select --install
```

## Homebrew のインストール

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

## 必要なソフトウェア

### 1. Node.js のインストール

```bash
# Homebrewを使用してインストール
brew install node

# バージョン確認
node --version
npm --version
```

### 2. Git のインストール

```bash
# Homebrewを使用してインストール
brew install git

# Git設定
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

### 3. Visual Studio Code

```bash
# Homebrewを使用してインストール
brew install --cask visual-studio-code
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

## 便利なツール

### Oh My Zsh

```bash
sh -c "$(curl -fsSL https://raw.github.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
```

### 開発用エイリアス

`.zshrc` に以下を追加：

```bash
alias ll='ls -la'
alias gs='git status'
alias gp='git push'
alias gl='git pull'
```

## トラブルシューティング

### 権限エラー

```bash
sudo chown -R $(whoami) /usr/local/lib/node_modules
```

### Homebrew関連の問題

```bash
brew doctor
brew update
```

## 次のステップ

- [開発環境セットアップ](environment.md)
- [デプロイメント手順](deployment.md)