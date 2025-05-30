import * as cdk from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { Chapter6Stack } from '../lib/chapter6-stack';

test('Snapshot Test', () => {
  const app = new cdk.App();
  // WHEN
  const stack = new Chapter6Stack(app, 'MyTestStack', {
    env: { account: '123456789012', region: 'ap-northeast-1' }
  });
  // THEN
  const template = Template.fromStack(stack);

  // Snapshot Test
  expect(template.toJSON()).toMatchSnapshot();
});

test('Fine Grained Assertions Test', () => {
  const app = new cdk.App();
  // WHEN
  const stack = new Chapter6Stack(app, 'MyTestStack', {
    env: { account: '123456789012', region: 'ap-northeast-1' }
  });
  // THEN
  const template = Template.fromStack(stack);

  // SQS Queueが作成されていることを確認
  template.resourceCountIs('AWS::SQS::Queue', 1);

  // サブネットに設定された AvailabilityZone の値が3つある＝3AZに分散されていることを確認
  const subnetResources = template.findResources('AWS::EC2::Subnet');
  const azs = new Set();
  // サブネットに紐づくAZ数で確認
  Object.values(subnetResources).forEach(subnet => {
    azs.add(subnet.Properties.AvailabilityZone);
  });
  expect(azs.size).toBe(3);
});
