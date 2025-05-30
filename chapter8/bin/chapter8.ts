#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { LambdaStack } from '../lib/lambda-stack';
import { ApiStack } from '../lib/api-stack';
import { MainStack } from '../lib/main-stack';

const app = new cdk.App();

// スタック間参照のサンプル
const lambdaStack = new LambdaStack(app, 'LambdaStack', {});
new ApiStack(app, 'ApiStack', {
  lambda: lambdaStack.testLambda,
});

// シングルスタックのサンプル
new MainStack(app, 'MainStack', {});
