#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { XCdkDevcontainerStack } from '../lib/x-cdk-devcontainer-stack';

const app = new cdk.App();
new XCdkDevcontainerStack(app, 'XCdkDevcontainerStack', {});
