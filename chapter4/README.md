# Chapter4

```bash
npm install --save-dev esbuild@0
npm install @aws-sdk/client-dynamodb

npx cdk synth
npx cdk deploy
```

## 補足

`lib/lambda-ddb-chapter4-stack.ts`のファイルは書籍中のLambda+DynamoDB部分までの実装だけを抜き出しています。

## 参考図

以下は書籍内で利用したシーケンス図です。

```mermaid
sequenceDiagram
    participant Client as クライアント（SPAなど）
    participant Cognito as Cognito (User Pool)
    participant APIGW as API Gateway
    participant Authorizer as Cognitoオーソライザー
    participant Lambda as Lambda

    Client->>Cognito: ユーザーログイン <br>（ユーザ名＋パスワード）
    Cognito-->>Client: IDトークン（JWT）などを返却
    Client->>APIGW: APIリクエスト (Authorization: Bearer <IDトークン>)
    APIGW->>Authorizer: IDトークン検証（JWT）
    Authorizer-->>APIGW: 検証結果（許可/拒否）
    alt トークンが有効
        APIGW->>Lambda: リクエストを転送
        Lambda-->>APIGW: レスポンス返却
        APIGW-->>Client: 最終レスポンス返却
    else トークンが無効
        APIGW-->>Client: 401 Unauthorized
    end
```
