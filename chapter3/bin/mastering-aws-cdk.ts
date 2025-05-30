#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { MasteringAwsCdkStack } from '../lib/mastering-aws-cdk-stack';

const app = new cdk.App();
new MasteringAwsCdkStack(app, 'MasteringAwsCdkStack', {});