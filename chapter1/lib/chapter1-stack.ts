import * as cdk from 'aws-cdk-lib';
import { Vpc, IpAddresses, SubnetType } from 'aws-cdk-lib/aws-ec2';
import { Construct } from 'constructs';

export class Chapter1Stack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const sampleVpc = new Vpc(this, 'SampleVpc', {
      ipAddresses: IpAddresses.cidr('10.100.0.0/16'),
      maxAzs: 3,
      natGateways: 1,
      subnetConfiguration: [
        {
          cidrMask: 24,
          name: 'Public',
          subnetType: SubnetType.PUBLIC,
        },
        {
          cidrMask: 24,
          name: 'Private',
          subnetType: SubnetType.PRIVATE_WITH_EGRESS,
        },
      ],
    });
  }
}
