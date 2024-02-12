import { DatabaseService } from '@a-list/core';
import { APIGatewayProxyHandlerV2 } from 'aws-lambda';

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  const database = new DatabaseService();
  return {
    statusCode: 200,
    body: JSON.stringify(await database.retrieveAllEntries()),
  };
};
