---
title: API認証仕様
category: API
---

# API認証仕様

このドキュメントでは、社内APIシステムの認証方式について説明します。

## 認証方式概要

本システムでは以下の認証方式をサポートしています：

1. **JWT (JSON Web Token)** - 推奨方式
2. **API Key** - レガシーシステム用
3. **OAuth 2.0** - 外部連携用

## JWT認証

### 概要

JWT（JSON Web Token）を使用したステートレス認証を採用しています。

### トークン取得

#### エンドポイント
```
POST /api/v1/auth/login
```

#### リクエスト
```json
{
  "username": "user@company.com",
  "password": "secure_password"
}
```

#### レスポンス
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "Bearer",
  "expires_in": 3600
}
```

### トークン使用

APIリクエストのヘッダーにトークンを含めます：

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### トークン更新

#### エンドポイント
```
POST /api/v1/auth/refresh
```

#### リクエスト
```json
{
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

## API Key認証

### 概要

レガシーシステムとの互換性のため、API Key認証もサポートしています。

### API Key取得

1. 管理画面にログイン
2. 「API設定」→「新しいキーを生成」
3. 生成されたキーを安全に保管

### API Key使用

#### ヘッダー方式（推奨）
```http
X-API-Key: your-api-key-here
```

#### クエリパラメータ方式
```
GET /api/v1/users?api_key=your-api-key-here
```

## OAuth 2.0

### 概要

外部システムとの連携にはOAuth 2.0を使用します。

### 認可フロー

#### 1. 認可リクエスト
```
GET /oauth/authorize?
  response_type=code&
  client_id=your_client_id&
  redirect_uri=https://your-app.com/callback&
  scope=read write&
  state=random_state_string
```

#### 2. 認可コード取得

ユーザーが認可すると、リダイレクトURIにコードが送信されます：

```
https://your-app.com/callback?code=auth_code&state=random_state_string
```

#### 3. アクセストークン取得

```http
POST /oauth/token
Content-Type: application/x-www-form-urlencoded

grant_type=authorization_code&
code=auth_code&
client_id=your_client_id&
client_secret=your_client_secret&
redirect_uri=https://your-app.com/callback
```

## セキュリティ考慮事項

### トークン管理

- **有効期限**: アクセストークンは1時間、リフレッシュトークンは30日
- **保存場所**: セキュアなストレージに保存（localStorage は避ける）
- **送信**: HTTPS必須

### API Key管理

- **定期ローテーション**: 90日ごとにキーを更新
- **権限制限**: 必要最小限の権限のみ付与
- **監査ログ**: すべてのAPI使用を記録

### レート制限

| 認証方式 | 制限 | 時間窓 |
|---------|------|--------|
| JWT | 1000リクエスト | 1時間 |
| API Key | 500リクエスト | 1時間 |
| OAuth | 2000リクエスト | 1時間 |

## エラーハンドリング

### 認証エラー

#### 401 Unauthorized
```json
{
  "error": "unauthorized",
  "error_description": "Invalid or expired token",
  "error_code": "AUTH_001"
}
```

#### 403 Forbidden
```json
{
  "error": "forbidden",
  "error_description": "Insufficient permissions",
  "error_code": "AUTH_002"
}
```

#### 429 Too Many Requests
```json
{
  "error": "rate_limit_exceeded",
  "error_description": "Rate limit exceeded",
  "retry_after": 3600,
  "error_code": "AUTH_003"
}
```

## 実装例

### JavaScript (Node.js)

```javascript
const axios = require('axios');

class APIClient {
  constructor(baseURL) {
    this.client = axios.create({
      baseURL: baseURL,
      timeout: 10000
    });
    
    this.token = null;
    this.setupInterceptors();
  }
  
  async login(username, password) {
    try {
      const response = await this.client.post('/auth/login', {
        username,
        password
      });
      
      this.token = response.data.access_token;
      return response.data;
    } catch (error) {
      throw new Error(`Login failed: ${error.response.data.error_description}`);
    }
  }
  
  setupInterceptors() {
    // リクエストインターセプター
    this.client.interceptors.request.use(
      (config) => {
        if (this.token) {
          config.headers.Authorization = `Bearer ${this.token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );
    
    // レスポンスインターセプター
    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          // トークン更新ロジック
          await this.refreshToken();
          return this.client.request(error.config);
        }
        return Promise.reject(error);
      }
    );
  }
}
```

### Python

```python
import requests
import jwt
from datetime import datetime, timedelta

class APIClient:
    def __init__(self, base_url):
        self.base_url = base_url
        self.session = requests.Session()
        self.token = None
    
    def login(self, username, password):
        response = self.session.post(
            f"{self.base_url}/auth/login",
            json={"username": username, "password": password}
        )
        
        if response.status_code == 200:
            data = response.json()
            self.token = data["access_token"]
            self.session.headers.update({
                "Authorization": f"Bearer {self.token}"
            })
            return data
        else:
            raise Exception(f"Login failed: {response.json()}")
    
    def is_token_expired(self):
        if not self.token:
            return True
        
        try:
            decoded = jwt.decode(self.token, options={"verify_signature": False})
            exp = datetime.fromtimestamp(decoded['exp'])
            return datetime.now() >= exp
        except:
            return True
```

## テスト

### 認証テスト

```bash
# JWT認証テスト
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"test@company.com","password":"password"}'

# API Key認証テスト
curl -X GET http://localhost:3000/api/v1/users \
  -H "X-API-Key: your-api-key"

# 認証なしでのアクセステスト（401エラーを期待）
curl -X GET http://localhost:3000/api/v1/users
```

## 関連ドキュメント

- [APIエンドポイント仕様](endpoints.md)
- [セキュリティガイドライン](../guides/security.md)
- [トラブルシューティング](../guides/troubleshooting.md)