# プロジェクト概要と設計

## 1. 概要

本ドキュメントは、Go (Gin) と Angular (Angular Material) を組み合わせたモダンなWebアプリケーションの基本的な構造と設計について記述するものである。
開発環境はDockerを用いてコンテナ化し、ポータビリティと再現性を確保する。

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
  - コンテナ: Docker / Docker Compose

## 3. ディレクトリ構成案

プロジェクトのルートディレクトリは以下のような構成を想定する。

```
.
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
├── docker-compose.yml  # Docker Compose の設定ファイル
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

Dockerを利用した開発環境のセットアップ手順の概要は以下の通り。

1.  **リポジトリのクローン:**
    ```bash
    git clone <repository_url>
    cd <project_directory>
    ```
2.  **Dockerコンテナのビルドと起動:**
    ```bash
    docker-compose up -d --build
    ```
3.  **アクセス:**
    - フロントエンド (Angular): `http://localhost:4200`
    - バックエンド (Go API): `http://localhost:8080`

これにより、各開発者は依存関係を気にすることなく、統一された環境で開発を開始できる。
