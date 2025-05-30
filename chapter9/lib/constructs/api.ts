import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Function, Runtime } from 'aws-cdk-lib/aws-lambda';
import { CognitoUserPoolsAuthorizer, Cors, LambdaRestApi } from 'aws-cdk-lib/aws-apigateway';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { UserPool } from 'aws-cdk-lib/aws-cognito';
import { TableV2 } from 'aws-cdk-lib/aws-dynamodb';

interface ApiProps extends cdk.StackProps {
  userPool: UserPool
  sampleTable: TableV2;
}

export class Api extends Construct {
  readonly testLambda: Function ;
  constructor(scope: Construct, id: string, props: ApiProps) {
    super(scope, id);

    const lambdaFunction = new NodejsFunction(this, 'SampleLambda', {
      entry: 'src/index.ts',
      handler: 'handler',
      runtime: Runtime.NODEJS_LATEST,
      environment: {
        TABLE_NAME: props.sampleTable.tableName,
      },
    });

    props.sampleTable.grantReadWriteData(lambdaFunction);

    const userPoolsAuthorizer = new CognitoUserPoolsAuthorizer(this, "UserPoolsAuthorizer", {
        cognitoUserPools: [props.userPool],
      },
    );

    const restApi = new LambdaRestApi(this, "RestApi", {
      handler: lambdaFunction,
      defaultCorsPreflightOptions: {
        allowOrigins: Cors.ALL_ORIGINS, // 実際はOriginを制限する ["https://***"]
        allowMethods: Cors.ALL_METHODS,
        allowHeaders: Cors.DEFAULT_HEADERS,
        maxAge: cdk.Duration.minutes(5),
      },
      deployOptions: {
        stageName: "v1", // 既定は"prod"になるので設定。適切なステージ名に変更
      },
      defaultMethodOptions: { authorizer: userPoolsAuthorizer },
    });
  }
}
