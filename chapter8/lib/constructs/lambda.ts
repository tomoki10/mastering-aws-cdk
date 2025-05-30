import * as cdk from 'aws-cdk-lib';
import { InlineCode, Runtime, Function } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';

export class Lambda extends Construct {
  readonly testLambda: Function ;
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id);

    const sampleCode = new InlineCode(`
      exports.handler = async () => ({
        statusCode: 200,
        body: JSON.stringify('Success')
      });
    `);
    const testLambda = new NodejsFunction(this, 'TestLambda', {
      runtime: Runtime.NODEJS_22_X,
      handler: 'index.handler',
      code: sampleCode,
    });
    this.testLambda = testLambda;
  }
}
