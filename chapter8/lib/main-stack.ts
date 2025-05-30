import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';

import { Api } from './constructs/api';
import { Lambda } from './constructs/lambda';

export class MainStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: cdk.StackProps) {
    super(scope, id, props);
    const lambda = new Lambda(this, 'Lambda');
    const api = new Api(this, 'Api', {
      lambda: lambda.testLambda,
    });
  }
}
