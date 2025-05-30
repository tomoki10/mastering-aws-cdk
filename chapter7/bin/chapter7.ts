#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { Chapter7Stack } from '../lib/chapter7-stack';
import * as ssm from 'aws-cdk-lib/aws-ssm';
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';
const app = new cdk.App();

// -- パラメータ管理サンプル --
const dummyStack = new cdk.Stack(app, 'DummyStack', {})

// 1. context valiable
// コマンド : cdk deploy --context ParameterName=parameterized
// コマンド2: cdk deploy -c ParameterName=parameterized
const parameter = app.node.tryGetContext('ParameterName');

// 2. 環境変数
// コマンド: export PARAMETER=parameterized
const parameter2 = process.env.PARAMETER;

// 3. TypeScript Object
interface Parameter {
  ParameterName: string;
}
const devParameters:Parameter = { ParameterName: 'parameterized' };
const parameter3 = devParameters.ParameterName;

// 4. SSM ParameterStore/Secret Manager
const parameter4 = ssm.StringParameter.valueForStringParameter(dummyStack, 'ParameterName');
const parameter5 = secretsmanager.Secret.fromSecretNameV2(dummyStack, 'Secret', 'SecretName');

// 5. CloudFormation Parameter
// コマンド: cdk deploy --parameters "MyStackName:ParameterName=parameterized"
const parameter6 = new cdk.CfnParameter(dummyStack, 'ParameterName').value.toString()

// -- マルチアカウント／パラメータ管理 --
import { getAppParameters } from './parameter';

const argContext = 'environment';
const envKey = app.node.tryGetContext(argContext);
const appParameter = getAppParameters(envKey);

new Chapter7Stack(app, 'Chapter7Stack', {
  env: appParameter.env,
  lambdaMemorySize: appParameter.lambdaMemorySize
});

// 別パターン(全パラメータを渡す場合)
// new Chapter7Stack(app, 'Chapter7Stack', {
//   ...appParameter,
// });

// -- シングルアカウント複数アプリケーション／パラメータ管理 --
new Chapter7Stack(app, `${appParameter.envName}Chapter7Stack`, {
  env: appParameter.env,
  lambdaMemorySize: appParameter.lambdaMemorySize
});
