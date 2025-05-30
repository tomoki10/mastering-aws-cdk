import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as lambdaNodeJs from 'aws-cdk-lib/aws-lambda-nodejs';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb'


// DDB+Lambda時点のソースコード
export class Chapter4Stack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    new lambdaNodeJs.NodejsFunction(this, 'SampleLambda', {
      entry: 'src/index.ts',
      handler: 'handler',
      runtime: lambda.Runtime.NODEJS_LATEST,
    });

    const table = new dynamodb.TableV2(this, 'SampleTable', {
      partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
      billing: dynamodb.Billing.onDemand(),
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    const lambdaFunction = new lambdaNodeJs.NodejsFunction(this, 'SampleLambda', {
      entry: 'src/index.ts',
      handler: 'handler',
      runtime: lambda.Runtime.NODEJS_LATEST,
      environment: {
        TABLE_NAME: table.tableName,
      },
    });

    table.grantReadWriteData(lambdaFunction);

    const functionUrl = lambdaFunction.addFunctionUrl({
      authType: lambda.FunctionUrlAuthType.NONE,
    });

    new cdk.CfnOutput(this, 'SampleFunctionUrl', {
      value: functionUrl.url,
    });

  }
}
