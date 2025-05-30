import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import { Function, Runtime, Code } from 'aws-cdk-lib/aws-lambda';
import { Table, AttributeType } from 'aws-cdk-lib/aws-dynamodb';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { table } from 'console';

export class MasteringAwsCdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const queue = new sqs.Queue(this, 'MasteringAwsCdkQueue', {
      visibilityTimeout: cdk.Duration.seconds(300)
    });

    const l1queue = new sqs.CfnQueue(this, 'CfnQueue', {
      visibilityTimeout: 300,
    });

    const ddbTable = new Table(this, 'DdbTable', {
      partitionKey: { name: 'id', type: AttributeType.STRING },
    });

    const lambdaFunc = new Function(this, 'MyFunction', {
      runtime: Runtime.NODEJS_LATEST,
      code: Code.fromInline('lambda'),
      handler: 'index.handler',
    });

    ddbTable.grantReadWriteData(lambdaFunc);

    const lambdaFunction = new NodejsFunction(this, 'SampleLambda', {
      entry: 'src/index.ts',
      handler: 'handler',
      runtime: Runtime.NODEJS_LATEST,
    });
  }
}
