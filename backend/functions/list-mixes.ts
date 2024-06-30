import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { mixes, audioAssets } from "../core/db/schema";
import { db } from "../core/db";
import { eq } from "drizzle-orm";

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  const dbClient = await db();
  const allMixes = await dbClient.select().from(mixes);
  const mixesWithAssets = [];
  for (const mix of allMixes) {
    const mixWithAssets = {
      ...mix,
      assets: await dbClient
        .select()
        .from(audioAssets)
        .where(eq(audioAssets.mixId, mix.id)),
    };
    mixesWithAssets.push(mixWithAssets);
  }
  return {
    statusCode: 200,
    body: JSON.stringify(mixesWithAssets),
  };
};
