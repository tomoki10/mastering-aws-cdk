import * as cdk from 'aws-cdk-lib';
import { InlineCode, Runtime, Function, FunctionUrlAuthType } from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';

export class Chapter6LambdaStack extends cdk.Stack {
  readonly lambdaFunctionUrl: string;
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Lambda関数をデプロイし、そのURLを取得
    const sampleCode = new InlineCode(`
      exports.handler = async () => ({
        statusCode: 200,
        body: JSON.stringify('Success')
      });
    `);
    const testLambda = new Function(this, 'TestLambda', {
      runtime: Runtime.NODEJS_22_X,
      handler: 'index.handler',
      code: sampleCode,
    });
    const functionUrl = testLambda.addFunctionUrl({
      authType: FunctionUrlAuthType.NONE,
    });
    this.lambdaFunctionUrl = functionUrl.url;
    new cdk.CfnOutput(this, 'LambdaFunctionUrl', {
      value: functionUrl.url,
    });
  }
}
