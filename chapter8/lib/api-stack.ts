import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Function } from 'aws-cdk-lib/aws-lambda';
import { LambdaRestApi } from 'aws-cdk-lib/aws-apigateway';

interface ApiStackProps extends cdk.StackProps {
  lambda: Function
}

export class ApiStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: ApiStackProps) {
    super(scope, id, props);
    const restApi = new LambdaRestApi(this, "RestApi", {
      handler: props.lambda,
    });
  }
}
