import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { ListObjectsCommand, S3Client } from "@aws-sdk/client-s3";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";

export async function POST(_request: Request) {
  // get all objects from the S3 bucket com.mattwyskiel.assets with the prefix a-list/
  const s3Client = new S3Client();
  const listObjectsCommand = new ListObjectsCommand({
    Bucket: "com.mattwyskiel.assets",
    Prefix: "a-list/",
  });
  const s3Response = await s3Client.send(listObjectsCommand);
  const s3Objects = s3Response.Contents ?? [];
  s3Objects.sort(
    (a, b) =>
      (a.LastModified?.getTime() ?? 0) - (b.LastModified?.getTime() ?? 0),
  );

  const tableName = process.env.TABLE_NAME;
  if (!tableName) {
    return new Response("TABLE_NAME is required", { status: 500 });
  }

  // for each object, create an entry in the DynamoDB table
  const dynamoDBClient = new DynamoDBClient();
  const documentClient = DynamoDBDocumentClient.from(dynamoDBClient);
  let id = 1;
  for (const s3Object of s3Objects) {
    const objectKey = s3Object.Key;
    const title = objectKey?.split("/").pop()?.split(".")[0];
    if (!objectKey || !title) {
      continue;
    }

    console.log(`Adding entry for ${title}`);
    const putItemCommand = new PutCommand({
      TableName: tableName,
      Item: {
        id,
        title,
        description: title,
        audioUrl: `https://assets.mattwyskiel.com/${objectKey}`,
        publishDate: s3Object.LastModified?.toISOString(),
      },
    });
    await documentClient.send(putItemCommand);
    id++;
  }

  return new Response("Success!");
}
