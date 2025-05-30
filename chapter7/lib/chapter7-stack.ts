import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Function, InlineCode, Runtime } from 'aws-cdk-lib/aws-lambda';

interface Chapter7StackProps extends cdk.StackProps {
  lambdaMemorySize: number;
}

export class Chapter7Stack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: Chapter7StackProps) {
    super(scope, id, props);

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
      memorySize: props.lambdaMemorySize,
    });
  }
}
