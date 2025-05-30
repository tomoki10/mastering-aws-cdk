import { DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb';

const dynamoDbClient = new DynamoDBClient({});
const tableName = process.env.TABLE_NAME; // 環境変数からテーブル名を取得

export const handler = async () => {

  const itemId = `${Date.now()}`;

  const command = new PutItemCommand({
    TableName: tableName,
    Item: {
      id: { S: itemId }
    },
  });

  await dynamoDbClient.send(command);

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: '書き込み成功',
    }),
  };
};
