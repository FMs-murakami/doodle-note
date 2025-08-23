# API仕様書

## 概要

社内システムのAPI仕様について説明します。

## ベースURL

```
https://api.company.com/v1
```

## 認証

すべてのAPIエンドポイントはBearer認証が必要です。

```http
Authorization: Bearer YOUR_API_TOKEN
```

## エンドポイント一覧

### ユーザー管理

#### GET /users

ユーザー一覧を取得します。

**リクエスト例:**
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
     https://api.company.com/v1/users
```

**レスポンス例:**
```json
{
  "users": [
    {
      "id": 1,
      "name": "田中太郎",
      "email": "tanaka@company.com",
      "role": "admin"
    }
  ],
  "total": 1
}
```

#### POST /users

新しいユーザーを作成します。

**リクエスト例:**
```bash
curl -X POST \
     -H "Authorization: Bearer YOUR_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"name":"佐藤花子","email":"sato@company.com","role":"user"}' \
     https://api.company.com/v1/users
```

### ドキュメント管理

#### GET /documents

ドキュメント一覧を取得します。

**パラメータ:**
- `category` (optional): カテゴリでフィルタ
- `limit` (optional): 取得件数の上限（デフォルト: 20）

**レスポンス例:**
```json
{
  "documents": [
    {
      "id": 1,
      "title": "API仕様書",
      "category": "仕様書",
      "created_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

## エラーレスポンス

APIエラーは以下の形式で返されます：

```json
{
  "error": {
    "code": "INVALID_REQUEST",
    "message": "リクエストが無効です"
  }
}
```

## ステータスコード

- `200`: 成功
- `400`: リクエストエラー
- `401`: 認証エラー
- `403`: 権限エラー
- `404`: リソースが見つからない
- `500`: サーバーエラー