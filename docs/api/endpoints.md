---
title: APIエンドポイント仕様
category: API
---

# APIエンドポイント仕様

このドキュメントでは、社内APIシステムの各エンドポイントの詳細仕様を説明します。

## ベースURL

```
本番環境: https://api.company.com/v1
開発環境: https://dev-api.company.com/v1
```

## 共通仕様

### リクエストヘッダー

```http
Content-Type: application/json
Authorization: Bearer {token}
X-Request-ID: {unique-request-id}
```

### レスポンス形式

#### 成功レスポンス
```json
{
  "success": true,
  "data": {},
  "meta": {
    "timestamp": "2024-01-15T10:30:00Z",
    "request_id": "req_123456789"
  }
}
```

#### エラーレスポンス
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "入力データに問題があります",
    "details": []
  },
  "meta": {
    "timestamp": "2024-01-15T10:30:00Z",
    "request_id": "req_123456789"
  }
}
```

## ユーザー管理API

### ユーザー一覧取得

#### エンドポイント
```
GET /users
```

#### パラメータ
| パラメータ | 型 | 必須 | 説明 |
|-----------|---|------|------|
| page | integer | No | ページ番号（デフォルト: 1） |
| limit | integer | No | 1ページあたりの件数（デフォルト: 20） |
| search | string | No | 検索キーワード |
| department | string | No | 部署フィルター |
| status | string | No | ステータスフィルター（active/inactive） |

#### レスポンス例
```json
{
  "success": true,
  "data": {
    "users": [
      {
        "id": 1,
        "username": "tanaka.taro",
        "email": "tanaka@company.com",
        "full_name": "田中太郎",
        "department": "開発部",
        "role": "developer",
        "status": "active",
        "created_at": "2024-01-01T00:00:00Z",
        "updated_at": "2024-01-15T10:30:00Z"
      }
    ],
    "pagination": {
      "current_page": 1,
      "total_pages": 5,
      "total_count": 100,
      "per_page": 20
    }
  }
}
```

### ユーザー詳細取得

#### エンドポイント
```
GET /users/{id}
```

#### パラメータ
| パラメータ | 型 | 必須 | 説明 |
|-----------|---|------|------|
| id | integer | Yes | ユーザーID |

#### レスポンス例
```json
{
  "success": true,
  "data": {
    "id": 1,
    "username": "tanaka.taro",
    "email": "tanaka@company.com",
    "full_name": "田中太郎",
    "department": "開発部",
    "role": "developer",
    "status": "active",
    "profile": {
      "phone": "03-1234-5678",
      "extension": "1234",
      "bio": "フルスタック開発者"
    },
    "permissions": ["read", "write", "admin"],
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-15T10:30:00Z"
  }
}
```

### ユーザー作成

#### エンドポイント
```
POST /users
```

#### リクエストボディ
```json
{
  "username": "yamada.hanako",
  "email": "yamada@company.com",
  "full_name": "山田花子",
  "department": "営業部",
  "role": "sales",
  "password": "secure_password123"
}
```

#### レスポンス例
```json
{
  "success": true,
  "data": {
    "id": 101,
    "username": "yamada.hanako",
    "email": "yamada@company.com",
    "full_name": "山田花子",
    "department": "営業部",
    "role": "sales",
    "status": "active",
    "created_at": "2024-01-15T10:30:00Z"
  }
}
```

## プロジェクト管理API

### プロジェクト一覧取得

#### エンドポイント
```
GET /projects
```

#### パラメータ
| パラメータ | 型 | 必須 | 説明 |
|-----------|---|------|------|
| status | string | No | ステータスフィルター |
| owner_id | integer | No | オーナーIDフィルター |
| created_after | string | No | 作成日フィルター（ISO 8601） |

#### レスポンス例
```json
{
  "success": true,
  "data": {
    "projects": [
      {
        "id": 1,
        "name": "社内ドキュメントシステム",
        "description": "社内向け技術文書管理システムの開発",
        "status": "active",
        "owner": {
          "id": 1,
          "name": "田中太郎"
        },
        "members_count": 5,
        "created_at": "2024-01-01T00:00:00Z",
        "updated_at": "2024-01-15T10:30:00Z"
      }
    ]
  }
}
```

### プロジェクト詳細取得

#### エンドポイント
```
GET /projects/{id}
```

#### レスポンス例
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "社内ドキュメントシステム",
    "description": "社内向け技術文書管理システムの開発",
    "status": "active",
    "owner": {
      "id": 1,
      "name": "田中太郎",
      "email": "tanaka@company.com"
    },
    "members": [
      {
        "id": 1,
        "name": "田中太郎",
        "role": "owner"
      },
      {
        "id": 2,
        "name": "山田花子",
        "role": "member"
      }
    ],
    "tags": ["documentation", "internal", "web"],
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-15T10:30:00Z"
  }
}
```

## ドキュメント管理API

### ドキュメント一覧取得

#### エンドポイント
```
GET /documents
```

#### パラメータ
| パラメータ | 型 | 必須 | 説明 |
|-----------|---|------|------|
| category | string | No | カテゴリフィルター |
| author_id | integer | No | 作成者IDフィルター |
| search | string | No | 全文検索キーワード |
| tags | string | No | タグフィルター（カンマ区切り） |

#### レスポンス例
```json
{
  "success": true,
  "data": {
    "documents": [
      {
        "id": 1,
        "title": "API仕様書",
        "category": "仕様書",
        "author": {
          "id": 1,
          "name": "田中太郎"
        },
        "status": "published",
        "tags": ["api", "specification"],
        "created_at": "2024-01-01T00:00:00Z",
        "updated_at": "2024-01-15T10:30:00Z"
      }
    ]
  }
}
```

### ドキュメント作成

#### エンドポイント
```
POST /documents
```

#### リクエストボディ
```json
{
  "title": "新しいAPI仕様書",
  "content": "# API仕様書\n\n## 概要\n...",
  "category": "仕様書",
  "tags": ["api", "specification", "v2"],
  "status": "draft"
}
```

## 通知API

### 通知一覧取得

#### エンドポイント
```
GET /notifications
```

#### パラメータ
| パラメータ | 型 | 必須 | 説明 |
|-----------|---|------|------|
| unread_only | boolean | No | 未読のみ取得 |
| type | string | No | 通知タイプフィルター |

#### レスポンス例
```json
{
  "success": true,
  "data": {
    "notifications": [
      {
        "id": 1,
        "type": "document_updated",
        "title": "ドキュメントが更新されました",
        "message": "「API仕様書」が田中太郎によって更新されました",
        "is_read": false,
        "created_at": "2024-01-15T10:30:00Z"
      }
    ],
    "unread_count": 5
  }
}
```

### 通知既読化

#### エンドポイント
```
PUT /notifications/{id}/read
```

#### レスポンス例
```json
{
  "success": true,
  "data": {
    "message": "通知を既読にしました"
  }
}
```

## エラーコード一覧

| コード | HTTPステータス | 説明 |
|--------|---------------|------|
| VALIDATION_ERROR | 400 | 入力データの検証エラー |
| UNAUTHORIZED | 401 | 認証が必要 |
| FORBIDDEN | 403 | アクセス権限なし |
| NOT_FOUND | 404 | リソースが見つからない |
| CONFLICT | 409 | データの競合 |
| RATE_LIMIT_EXCEEDED | 429 | レート制限超過 |
| INTERNAL_ERROR | 500 | サーバー内部エラー |

## レート制限

| エンドポイント | 制限 | 時間窓 |
|---------------|------|--------|
| GET /users | 100リクエスト | 1分 |
| POST /users | 10リクエスト | 1分 |
| GET /projects | 200リクエスト | 1分 |
| GET /documents | 500リクエスト | 1分 |

## SDKとライブラリ

### JavaScript SDK

```bash
npm install @company/api-client
```

```javascript
import { APIClient } from '@company/api-client';

const client = new APIClient({
  baseURL: 'https://api.company.com/v1',
  token: 'your-jwt-token'
});

// ユーザー一覧取得
const users = await client.users.list({ page: 1, limit: 20 });

// プロジェクト作成
const project = await client.projects.create({
  name: 'New Project',
  description: 'Project description'
});
```

### Python SDK

```bash
pip install company-api-client
```

```python
from company_api import APIClient

client = APIClient(
    base_url='https://api.company.com/v1',
    token='your-jwt-token'
)

# ユーザー一覧取得
users = client.users.list(page=1, limit=20)

# ドキュメント作成
document = client.documents.create(
    title='New Document',
    content='Document content',
    category='仕様書'
)
```

## 関連ドキュメント

- [API認証仕様](authentication.md)
- [開発環境セットアップ](../setup/environment.md)
- [トラブルシューティング](../guides/troubleshooting.md)