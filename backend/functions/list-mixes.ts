import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { db } from "../core/db";

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  const dbClient = await db();
  const mixes = await dbClient.query.mixes.findMany();
  return {
    statusCode: 200,
    body: JSON.stringify(mixes),
  };
};
