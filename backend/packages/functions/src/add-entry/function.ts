import { DatabaseService } from '@a-list/core';
import { APIGatewayProxyHandlerV2 } from 'aws-lambda';

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  const body = JSON.parse(event.body!);
  const database = new DatabaseService();
  await database.addEntry(body);
  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Success!' }),
  };
};
