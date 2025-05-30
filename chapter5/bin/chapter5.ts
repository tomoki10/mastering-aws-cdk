#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { Chapter5Stack } from '../lib/chapter5-stack';

const app = new cdk.App();
new Chapter5Stack(app, 'Chapter5Stack', {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
});