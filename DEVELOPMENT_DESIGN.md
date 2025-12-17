# プロジェクト概要と設計

## 1. 概要

本ドキュメントは、Go (Gin) と Angular (Angular Material) を組み合わせたモダンなWebアプリケーションの基本的な構造と設計について記述するものである。
開発環境はDev Containerを用いてコンテナ化し、ポータビリティと再現性を確保する。

## 2. 技術スタック

本プロジェクトで使用する主要な技術とバージョンは以下の通り。

- **バックエンド:**
  - 言語: Go 1.24.3
  - Webフレームワーク: Gin
  - データベース: SQLite
- **フロントエンド:**
  - フレームワーク: Angular 21.0.1
  - UIライブラリ: Angular Material (v21.0.1)
  - パッケージ管理: npm
  
- **開発・実行環境:**
  - コンテナ: Dev Container (Docker)

## 3. ディレクトリ構成

プロジェクトのルートディレクトリは以下のような構成を想定する。

```
.
├── .devcontainer/      # Dev Container の設定ファイル
│   ├── Dockerfile
│   └── devcontainer.json
├── backend/            # Go (Gin) アプリケーション
│   ├── go.mod
│   ├── go.sum
│   ├── main.go         # アプリケーションのエントリーポイント
│   └── ...
├── frontend/           # Angular アプリケーション
│   ├── angular.json
│   ├── package.json
│   └── src/            # Angular のソースコード
└── DEVELOPMENT_DESIGN.md # このファイル
```

## 4. API設計 (サンプル)

バックエンドとフロントエンド間の連携のため、以下のような基本的なREST APIを設計する。

- **Ping**
  - `GET /api/ping`
  - レスポンス: `{"message": "pong"}`

## 5. 開発環境構築フロー

Dev Containerを利用した開発環境のセットアップ手順の概要は以下の通り。

1.  **前提条件:**
    - Docker Desktop がインストールされていること。
    - Visual Studio Code がインストールされ、"Dev Containers" 拡張機能が追加されていること。

2.  **リポジトリのクローン:**
    ```bash
    git clone <repository_url>
    ```

3.  **Dev Containerで開く:**
    - VS Codeでクローンしたリポジトリを `File > Open Folder...` から開く。
    - 右下に表示される "Reopen in Container" のトースト通知をクリックする。(表示されない場合は、`F1`キー > `Dev Containers: Reopen in Container` を実行)

4.  **コンテナ内での開発:**

    - **バックエンド (Go):**
      - VS Codeでターミナルを開く (`Ctrl+``)
      - 以下のコマンドでバックエンドサーバーを起動します。
      ```bash
      cd backend
      go run main.go
      ```

    - **フロントエンド (Angular):**
      - VS Codeで新しいターミナルを開く (`Ctrl+Shift+``)
      - 以下のコマンドでフロントエンド開発サーバーを起動します。
      ```bash
      cd frontend
      # 初回のみ実行
      npm install
      # 開発サーバーの起動
      npm start
      ```

5.  **アクセス:**
    - フロントエンド (Angular): `http://localhost:4200`
    - バックエンド (Go API): `http://localhost:8080`

## 6. 本番環境の構成

本番環境では、開発環境とは異なり、単一のGoアプリケーションとして動作させる。これにより、デプロイメントが簡素化され、管理が容易になる。

1.  **フロントエンドのビルド:**
    - Angularアプリケーションを静的なHTML, CSS, JavaScriptファイルにコンパイルする。
    - `frontend` ディレクトリで以下のコマンドを実行する。
      ```bash
      npm run build
      ```
    - これにより、`backend/dist/` ディレクトリ内にビルド済みのアセットが生成される。

2.  **バックエンドによる配信:**
    - Go (Gin) サーバーが、APIエンドポイント (`/api/*`) へのリクエストを処理する。
    - 上記以外のリクエスト（例: `/`, `/home` など）に対しては、`backend/dist/` 内の静的ファイルを配信する。
    - 具体的には、Goの `embed` パッケージを使ってビルド済みフロントエンドをバイナリに埋め込むか、特定のディレクトリから静的ファイルを配信するようにGinフレームワークを設定する。

この構成により、ユーザーがブラウザでGoのサーバーにアクセスすると、Angularアプリケーションが読み込まれ、その後アプリケーションはバックエンドのAPIと通信して動作する。

## 7. 本番ビルドと実行

このアプリケーションを単一の実行可能ファイルとしてビルドし、本番環境にデプロイする手順は以下の通りです。

1. **フロントエンドのビルド**
   まず、Angularアプリケーションをビルドします。ビルド成果物はGoバックエンドが直接参照できるように、`backend/dist`ディレクトリに出力されます。

   ```bash
   cd frontend
   npm install
   npx ng build
   cd ..
   ```

2. **バックエンドのビルド**
   次に、フロントエンドのビルド成果物を含んだGoアプリケーションをビルドします。

   ```bash
   cd backend
   go build -o webapp
   cd ..
   ```
   これにより、`backend` ディレクトリ内に `webapp` という名前の実行可能ファイルが生成されます。

3. **実行**
   生成された `webapp` ファイルを実行することで、フロントエンドとバックエンドの両方を提供するサーバーが起動します。

   ```bash
   ./backend/webapp
   ```
   サーバーは `http://localhost:8080` で起動します。
