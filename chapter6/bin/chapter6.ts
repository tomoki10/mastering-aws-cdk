#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { Chapter6Stack } from '../lib/chapter6-stack';
import { AwsSolutionsChecks } from 'cdk-nag'
import { NagSuppressions } from 'cdk-nag';

const app = new cdk.App();
const chapter6Stack = new Chapter6Stack(app, 'Chapter6Stack', {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
});
cdk.Aspects.of(app).add(new AwsSolutionsChecks({ verbose: true }))
NagSuppressions.addStackSuppressions(chapter6Stack, [
  { id: 'AwsSolutions-VPC7', reason: 'Dev Environment' },
]);
// 特定のリソース名だけを除外する
NagSuppressions.addStackSuppressions(chapter6Stack, [
  {
    id: 'AwsSolutions-IAM4',
    reason: 'IAM policies are not scoped down to the least privilege',
    appliesTo: ["Policy::arn:<AWS::Partition>:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"],
  },
]);
// 正規表現で特定のポリシーだけを検出させる
NagSuppressions.addStackSuppressions(chapter6Stack, [
  {
    id: 'AwsSolutions-IAM4',
    reason: 'IAM policies are not scoped down to the least privilege',
    appliesTo: [{ regex: '/^(?!.*(FullAccess|Administrator)).+$/' }],
  },
]);
