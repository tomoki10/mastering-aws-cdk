import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Runtime, FunctionUrlAuthType } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { TableV2, AttributeType, Billing } from 'aws-cdk-lib/aws-dynamodb';
import { UserPool, OAuthScope } from 'aws-cdk-lib/aws-cognito';
import { CognitoUserPoolsAuthorizer, LambdaRestApi, Cors } from 'aws-cdk-lib/aws-apigateway';

export class Chapter4Stack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const table = new TableV2(this, 'SampleTable', {
      partitionKey: { name: 'id', type: AttributeType.STRING },
      billing: Billing.onDemand(),
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    const lambdaFunction = new NodejsFunction(this, 'SampleLambda', {
      entry: 'src/index.ts',
      handler: 'handler',
      runtime: Runtime.NODEJS_LATEST,
      environment: {
        TABLE_NAME: table.tableName,
      },
    });

    table.grantReadWriteData(lambdaFunction);

    const functionUrl = lambdaFunction.addFunctionUrl({
      authType: FunctionUrlAuthType.NONE,
    });

    new cdk.CfnOutput(this, 'SampleFunctionUrl', {
      value: functionUrl.url,
    });

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
      cognitoDomain: { domainPrefix: "dev-mastering-cdk" },
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

    const userPoolsAuthorizer = new CognitoUserPoolsAuthorizer(this, "UserPoolsAuthorizer", {
        cognitoUserPools: [userPool],
        
      },
    );

    new cdk.CfnOutput(this, 'UserPoolId', {
      value: userPool.userPoolId,
    });

    new cdk.CfnOutput(this, 'UserPoolClientId', {
      value: userPoolClient.userPoolClientId,
    });

    const restApi = new LambdaRestApi(this, "RestApi", {
      handler: lambdaFunction,
      defaultCorsPreflightOptions: {
        allowOrigins: Cors.ALL_ORIGINS, // 実際はOriginを制限する ["https://***"]
        allowMethods: Cors.ALL_METHODS,
        allowHeaders: Cors.DEFAULT_HEADERS,
        maxAge: cdk.Duration.minutes(5),
      },
      deployOptions: {
        stageName: "v1", // 既定は"prod"になるので設定。適切なステージ名に変更
      },
      defaultMethodOptions: { authorizer: userPoolsAuthorizer },
    });
  }
}
