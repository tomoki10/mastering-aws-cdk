import * as cdk from 'aws-cdk-lib';
import { ExpectedResult, IntegTest } from '@aws-cdk/integ-tests-alpha';
import { Chapter6LambdaStack } from '../lib/chapter6-lambda-stack';

const app = new cdk.App();
const stack = new Chapter6LambdaStack(app, 'Chapter6LambdaStack');

// インテグレーションテストを作成
const integ = new IntegTest(app, 'LambdaUrlTest', {
  testCases: [stack],
  cdkCommandOptions: {
    deploy: {
      args: {
        rollback: false,
      },
    },
    destroy: {
      args: {
        force: true,
      },
    },
  },
});

// デプロイ後にURLをテストするカスタムアサーション
// Function URL にHTTPリクエストを送り、レスポンスを検証
integ.assertions.httpApiCall(stack.lambdaFunctionUrl).expect(
  ExpectedResult.objectLike({ body: 'Success' })
);