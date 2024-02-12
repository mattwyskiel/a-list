import { Handler } from "aws-lambda";
import { S3Client, ListObjectsCommand } from "@aws-sdk/client-s3";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { Table } from "sst/node/table";

export const handler: Handler = async (_event) => {
  // get all objects from the S3 bucket com.mattwyskiel.assets with the prefix a-list/
  const s3Client = new S3Client();
  const listObjectsCommand = new ListObjectsCommand({
    Bucket: "com.mattwyskiel.assets",
    Prefix: "a-list/",
  });
  const s3Response = await s3Client.send(listObjectsCommand);
  let s3Objects = s3Response.Contents!;
  // sort s3Objects by LastModified in ascending order
  s3Objects.sort((a, b) => {
    if (a.LastModified! < b.LastModified!) {
      return -1;
    } else if (a.LastModified! > b.LastModified!) {
      return 1;
    } else {
      return 0;
    }
  });

  // for each object, create an entry in the DynamoDB table
  const dynamoDBClient = new DynamoDBClient();
  const documentClient = DynamoDBDocumentClient.from(dynamoDBClient);
  let id = 1;
  for (const s3Object of s3Objects) {
    const title = s3Object.Key!.split("/").pop()!.split(".")[0]!;
    console.log(`Adding entry for ${title}`);
    const putItemCommand = new PutCommand({
      TableName: Table.Table.tableName,
      Item: {
        id,
        title: s3Object.Key!.split("/").pop()!.split(".")[0]!,
        description: s3Object.Key!.split("/").pop()!.split(".")[0]!,
        audioUrl: `https://assets.mattwyskiel.com/${s3Object.Key}`,
        publishDate: s3Object.LastModified!.toISOString(),
      },
    });
    await documentClient.send(putItemCommand);
    id++;
  }
};
