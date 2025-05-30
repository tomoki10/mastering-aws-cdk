import * as cdk from 'aws-cdk-lib';
import { OAuthScope, UserPool } from 'aws-cdk-lib/aws-cognito';
import { Construct } from 'constructs';

export class Auth extends Construct {
  readonly userPool: UserPool;
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id);

    const userPool = new UserPool(this, "UserPool", {
      signInAliases: {
        email: true,
      },
      deletionProtection: true,
      selfSignUpEnabled: true,
    });
    userPool.addDomain("UserPoolDomain", {
      // 注意:
      // - domainPrefixには aws、amazon、または cognito というテキストは使用不可
      // - グローバルで一意な必要があるので、適宜変更
      cognitoDomain: { domainPrefix: "dev-mastering-cdk-chapter9" },
    });

    const userPoolClient = userPool.addClient("UserPoolClient", {
      generateSecret: false,
      oAuth: {
        callbackUrls: ["https://example.com/"],
        logoutUrls: ["https://example.com/"],
        flows: { authorizationCodeGrant: true },
        scopes: [
          OAuthScope.EMAIL,
          OAuthScope.PROFILE,
          OAuthScope.OPENID,
        ],
      },
      authFlows: { adminUserPassword: true }, // AWS CLIでユーザーの ID トークンを取得可能とするため有効化
    });
    this.userPool = userPool;

    new cdk.CfnOutput(this, 'UserPoolId', {
      value: userPool.userPoolId,
    });

    new cdk.CfnOutput(this, 'UserPoolClientId', {
      value: userPoolClient.userPoolClientId,
    });
  }
}
