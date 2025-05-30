import * as cdk from 'aws-cdk-lib';
import { TableV2, AttributeType, Billing } from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';

export class DataStore extends Construct {
  readonly sampleTable: TableV2;
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id);

    const sampleTable = new TableV2(this, 'SampleTable', {
      partitionKey: { name: 'id', type: AttributeType.STRING },
      billing: Billing.onDemand(),
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });
    this.sampleTable = sampleTable;
  }
}
