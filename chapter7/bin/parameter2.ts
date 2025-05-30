import type { Environment } from 'aws-cdk-lib';

const ENV_NAMES = ['dev', 'stg', 'prd'] as const;
type EnvName = (typeof ENV_NAMES)[number];

export interface AppParameter {
  envName: EnvName;
  projectName: string;
  env: Environment;
}

const appParameters: { [key in EnvName]: AppParameter } = {
  dev: {
    envName: 'dev',
    projectName: 'dev-chapter7',
    env: {
      account: '111111111111',
      region: 'ap-northeast-1',
    },
  },
  stg: {
    envName: 'stg',
    projectName: 'stg-chapter7',
    env: {
      account: '222222222222',
      region: 'ap-northeast-1',
    },
  },
  prd: {
    envName: 'prd',
    projectName: 'prd-chapter7',
    env: {
      account: '333333333333',
      region: 'ap-northeast-1',
    },
  }
}

const isEnv = (value: string): value is EnvName => {
  return (ENV_NAMES as readonly string[]).includes(value);
};

export const getAppParameters = (envKey: string): AppParameter => {
  if (!isEnv(envKey)) {
    throw new Error(`Not found environment key: ${envKey}`);
  }

  const params = appParameters[envKey];
  if (params.env.account == null || params.env.region == null) {
    throw new Error(
      `Environment variables not found. Please set Account or Region in parameter.ts.`
    );
  }

  return params;
};