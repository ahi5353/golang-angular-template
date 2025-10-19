# プロジェクト概要と設計

## 1. 概要

本ドキュメントは、Go (Gin) と Angular (Angular Material) を組み合わせたモダンなWebアプリケーションの基本的な構造と設計について記述するものである。
開発環境はDev Containerを用いてコンテナ化し、ポータビリティと再現性を確保する。

## 2. 技術スタック

本プロジェクトで使用する主要な技術とバージョンは以下の通り。

- **バックエンド:**
  - 言語: Go 1.23.0
  - Webフレームワーク: Gin
  - データベース: SQLite
- **フロントエンド:**
  - フレームワーク: Angular 20.3.4
  - UIライブラリ: Angular Material
  - パッケージ管理: npm
- **開発・実行環境:**
  - コンテナ: Dev Container (Docker)

## 3. ディレクトリ構成案

プロジェクトのルートディレクトリは以下のような構成を想定する。

```
.
├── .devcontainer/      # Dev Container の設定ファイル
│   ├── devcontainer.json
│   └── docker-compose.yml
├── backend/            # Go (Gin) アプリケーション
│   ├── Dockerfile
│   ├── go.mod
│   ├── go.sum
│   ├── main.go         # アプリケーションのエントリーポイント
│   └── database/       # SQLiteデータベースファイル
├── frontend/           # Angular アプリケーション
│   ├── Dockerfile
│   ├── angular.json
│   ├── package.json
│   └── src/            # Angular のソースコード
└── DEVELOPMENT_DESIGN.md # このファイル
```

## 4. API設計案 (サンプル)

バックエンドとフロントエンド間の連携のため、以下のような基本的なREST APIを設計する。

- **ヘルスチェック**
  - `GET /api/v1/health`
  - レスポンス: `{"status": "ok"}`
- **データ取得 (サンプル)**
  - `GET /api/v1/items`
  - レスポンス: `[{"id": 1, "name": "Item 1"}, {"id": 2, "name": "Item 2"}]`

## 5. 開発環境構築フロー

Dev Containerを利用した開発環境のセットアップ手順の概要は以下の通り。開発時は、フロントエンドのホットリロードなどの恩恵を受けるため、バックエンドとフロントエンドを別々のサーバーで起動する。

1.  **前提条件:**
    - Docker Desktop がインストールされていること。
    - Visual Studio Code がインストールされ、"Dev Containers" および "Docker" 拡張機能が追加されていること。

2.  **リポジトリのクローン:**
    ```bash
    git clone <repository_url>
    ```

3.  **Dev Containerで開く:**
    - VS Codeでクローンしたリポジトリを `File > Open Folder...` から開く。
    - 右下に表示される "Reopen in Container" のトースト通知をクリックする。(表示されない場合は、`F1`キー > `Dev Containers: Reopen in Container` を実行)
    - これにより、VS Codeはバックエンド用の `backend` コンテナに接続します。統合ターミナル (`Ctrl+``) は、この `backend` コンテナ内で開きます。

4.  **コンテナ内での開発:**

    - **バックエンド (Go):**
      - VS Codeの統合ターミナルは既に `backend` コンテナに接続されています。
      - 以下のコマンドでバックエンドサーバーを起動します。
      ```bash
      cd /workspace/backend
      go run main.go
      ```

    - **フロントエンド (Angular):**
      - フロントエンドのコマンドは `frontend` コンテナ内で実行する必要があります。VS CodeのDocker拡張機能を使うのが簡単です。
      - 1. VS Codeの左側のアクティビティバーからDockerアイコンをクリックします。
      - 2. "CONTAINERS" ビューから、`..._frontend_1` のような名前のコンテナを探します。
      - 3. コンテナ名を右クリックし、"Attach Shell" を選択します。
      - 4. 新しいターミナルが `frontend` コンテナに接続された状態で開きます。
      - 5. 以下のコマンドでフロントエンド開発サーバーを起動します。
      ```bash
      # /workspace/frontend ディレクトリにいることを確認
      cd /workspace/frontend
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
    - これにより、`frontend/dist/` ディレクトリ内にビルド済みのアセットが生成される。

2.  **バックエンドによる配信:**
    - Go (Gin) サーバーが、APIエンドポイント (`/api/v1/*`) へのリクエストを処理する。
    - 上記以外のリクエスト（例: `/`, `/home` など）に対しては、`frontend/dist/` 内の静的ファイルを配信する。
    - 具体的には、Goの `embed` パッケージを使ってビルド済みフロントエンドをバイナリに埋め込むか、特定のディレクトリから静的ファイルを配信するようにGinフレームワークを設定する。

この構成により、ユーザーがブラウザでGoのサーバーにアクセスすると、Angularアプリケーションが読み込まれ、その後アプリケーションはバックエンドのAPIと通信して動作する。
