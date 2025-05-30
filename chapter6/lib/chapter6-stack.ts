import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { NagSuppressions } from 'cdk-nag';
import { Queue } from 'aws-cdk-lib/aws-sqs';
import { InlineCode, Runtime, Function, FunctionUrlAuthType } from 'aws-cdk-lib/aws-lambda';
import { Vpc } from 'aws-cdk-lib/aws-ec2';

export class Chapter6Stack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const queue = new Queue(this, 'TestQueue', {});
    NagSuppressions.addResourceSuppressions(
      queue,
      [
        { id: 'AwsSolutions-SQS3',reason: 'cdk-nag test suppression' },
        { id: 'AwsSolutions-SQS4',reason: 'cdk-nag test suppression' },
      ]
    );

    const sampleVpc = new Vpc(this, 'TestVpc', {
      maxAzs: 3,
    });


    const sampleCode = new InlineCode(`
      exports.handler = async () => ({
        statusCode: 200,
        body: JSON.stringify('Success')
      });
    `);

    new Function(this, 'TestLambda2', {
      runtime: Runtime.NODEJS_22_X,
      handler: 'index.handler',
      code: sampleCode,
      memorySize: 512,
    });
  }
}
