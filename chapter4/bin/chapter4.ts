#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { Chapter4Stack } from '../lib/chapter4-stack';

const app = new cdk.App();
new Chapter4Stack(app, 'Chapter4Stack', {});