import type { Environment } from 'aws-cdk-lib';

// 各環境で共通するアプリケーション全体の設定項目
export interface AppParameter {
  envName: string;
  projectName: string;
  env: Environment;
  lambdaMemorySize: number;
}

export const devParameter: AppParameter = {
  envName: 'dev',
  projectName: 'dev-chapter7',
  lambdaMemorySize: 512,
  env: {
    account: '111111111111', // ダミーのアカウントID（実環境では適切に置換）
    region: 'ap-northeast-1',
  }
}

export const stgParameter: AppParameter = {
  envName: 'stg',
  projectName: 'stg-chapter7',
  lambdaMemorySize: 1024,
  env: {
    account: '222222222222',
    region: 'ap-northeast-1',
  }
}

export const prdParameter: AppParameter = {
  envName: 'prd',
  projectName: 'prd-chapter7',
  lambdaMemorySize: 1024,
  env: {
    account: '333333333333',
    region: 'ap-northeast-1',
  }
}

// 環境名をキーにしてパラメータを設定
const appParameters: Record<string, AppParameter> = {
  dev: devParameter,
  stg: stgParameter,
  prd: prdParameter
};

export const getAppParameters = (envKey: string): AppParameter => {
  // 環境名が存在するか確認
  if(!appParameters[envKey]){
    throw new Error(`Not found environment key: ${envKey}`);
  }
  const params = appParameters[envKey];

  return params;
};