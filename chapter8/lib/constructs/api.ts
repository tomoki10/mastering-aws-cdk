import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Function } from 'aws-cdk-lib/aws-lambda';
import { LambdaRestApi } from 'aws-cdk-lib/aws-apigateway';

interface ApiProps extends cdk.StackProps {
  lambda: Function
}

export class Api extends Construct {
  constructor(scope: Construct, id: string, props: ApiProps) {
    super(scope, id);
    const restApi = new LambdaRestApi(this, "RestApi", {
      handler: props.lambda,
    });
  }
}
