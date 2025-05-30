import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Vpc, IpAddresses, SubnetType, SecurityGroup, Peer, Port } from 'aws-cdk-lib/aws-ec2';
import { ApplicationLoadBalancer } from 'aws-cdk-lib/aws-elasticloadbalancingv2';
import { Role, ServicePrincipal, ManagedPolicy } from 'aws-cdk-lib/aws-iam';
import {
  FargateTaskDefinition,
  ContainerImage,
  LogDriver,
  Cluster,
  FargateService,
  Protocol,
} from 'aws-cdk-lib/aws-ecs';


export class Chapter5Stack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const sampleVpc = new Vpc(this, 'SampleVpc', {
      ipAddresses: IpAddresses.cidr('10.100.0.0/16'),
      maxAzs: 3,
      natGateways: 1,
      subnetConfiguration: [
        {
          cidrMask: 24,
          name: 'Public',
          subnetType: SubnetType.PUBLIC,
        },
        {
          cidrMask: 24,
          name: 'Private',
          subnetType: SubnetType.PRIVATE_WITH_EGRESS,
        },
      ],
    });

    const securityGroupForAlb = new SecurityGroup(this, 'SgAlb', {
      vpc: sampleVpc,
      allowAllOutbound: false,
    });
    securityGroupForAlb.addIngressRule(Peer.anyIpv4(), Port.tcp(80));
    // MEMO: 証明書作成後は以下に変更
    // securityGroupForAlb.addIngressRule(Peer.anyIpv4(), Port.tcp(443));
    securityGroupForAlb.addEgressRule(Peer.anyIpv4(), Port.allTcp());

    const albForApp = new ApplicationLoadBalancer(this, 'Alb', {
      vpc: sampleVpc,
      internetFacing: true,
      securityGroup: securityGroupForAlb,
      vpcSubnets: sampleVpc.selectSubnets({
        subnetGroupName: 'Public',
      }),
    });
    const securityGroupForFargate = new SecurityGroup(this, 'SgFargate',{
        vpc: sampleVpc,
        allowAllOutbound: false,
    });
    securityGroupForFargate.addIngressRule(securityGroupForAlb, Port.tcp(80));
    securityGroupForFargate.addEgressRule(Peer.anyIpv4(),Port.allTcp());

    const executionRole = new Role(this, 'EcsTaskExecutionRole', {
      assumedBy: new ServicePrincipal('ecs-tasks.amazonaws.com'),
      managedPolicies: [
        ManagedPolicy.fromAwsManagedPolicyName(
          'service-role/AmazonECSTaskExecutionRolePolicy'
        ),
      ],
    });
    const serviceTaskRole = new Role(this, 'EcsServiceTaskRole', {
      assumedBy: new ServicePrincipal('ecs-tasks.amazonaws.com'),
      managedPolicies: [
        ManagedPolicy.fromAwsManagedPolicyName('AmazonSSMFullAccess'),
      ],
    });

    const taskDefinition = new FargateTaskDefinition(this, `TaskDefinition`, {
        cpu: 256,
        memoryLimitMiB: 512,
        executionRole: executionRole,
        taskRole: serviceTaskRole,
      }
    );

    taskDefinition.addContainer('api', {
      image: ContainerImage.fromRegistry("amazon/amazon-ecs-sample"),
      logging: LogDriver.awsLogs({
        streamPrefix: `samplePrefixName`,
      })
    }).addPortMappings({
      containerPort: 80,
      hostPort: 80,
      protocol: Protocol.TCP,
    });

    const cluster = new Cluster(this, 'Cluster', {
      vpc: sampleVpc,
      containerInsights: true,
      // containerInsightsV2: ContainerInsights.ENABLED,
    });

    const fargateService = new FargateService(this,'FargateService',{
      cluster,
      vpcSubnets: sampleVpc.selectSubnets({ subnetGroupName: 'Private' }),
      securityGroups: [securityGroupForFargate],
      taskDefinition: taskDefinition,
      desiredCount: 1,
      maxHealthyPercent: 200,
      minHealthyPercent: 50,
      enableExecuteCommand: true,
    });

    const albListener = albForApp.addListener('AlbListener', {
      port: 80,
    });
    const fromAppTargetGroup = albListener.addTargets('FromAppTargetGroup',{
        port: 80,
        targets: [fargateService],
    });
    new cdk.CfnOutput(this, 'LoadBalancerDNS', {
      value: albForApp.loadBalancerDnsName,
    });
  }
}
