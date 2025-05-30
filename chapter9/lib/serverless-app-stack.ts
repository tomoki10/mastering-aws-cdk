import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';

import { Api } from './constructs/api';
import { Auth } from './constructs/auth';
import { DataStore } from './constructs/datastore';

export class ServerlessAppStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: cdk.StackProps) {
    super(scope, id, props);
    const auth = new Auth(this, 'Auth');

    const datastore = new DataStore(this, 'DataStore', {});

    new Api(this, 'Api', {
      userPool: auth.userPool,
      sampleTable: datastore.sampleTable,
    });
  }
}
