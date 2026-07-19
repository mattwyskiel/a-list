import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { ListObjectsCommand, S3Client } from "@aws-sdk/client-s3";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";

const ASSET_BASE_URL = "https://assets.mattwyskiel.com";
const AUDIO_EXTENSIONS = new Set(["aac", "aif", "aiff", "m4a", "mp3", "wav"]);
const ALBUM_ART_EXTENSIONS = new Set(["jpeg", "jpg", "png", "webp"]);

function getExtension(objectKey: string): string {
  return objectKey.split(".").pop()?.toLowerCase() ?? "";
}

function getBaseName(objectKey: string): string {
  const fileName = objectKey.split("/").pop() ?? objectKey;
  return fileName.replace(/\.[^.]+$/, "");
}

function getAssetUrl(objectKey: string): string {
  return `${ASSET_BASE_URL}/${objectKey}`;
}

export async function POST(_request: Request) {
  const s3Client = new S3Client();
  const listObjectsCommand = new ListObjectsCommand({
    Bucket: "com.mattwyskiel.assets",
    Prefix: "a-list/",
  });
  const s3Response = await s3Client.send(listObjectsCommand);
  const s3Objects = s3Response.Contents ?? [];
  const albumArtUrlsByBaseName = new Map<string, string>();

  for (const s3Object of s3Objects) {
    const objectKey = s3Object.Key;
    if (!objectKey || !ALBUM_ART_EXTENSIONS.has(getExtension(objectKey))) {
      continue;
    }

    albumArtUrlsByBaseName.set(getBaseName(objectKey), getAssetUrl(objectKey));
  }

  const audioObjects = s3Objects
    .filter((s3Object) => {
      const objectKey = s3Object.Key;
      return objectKey ? AUDIO_EXTENSIONS.has(getExtension(objectKey)) : false;
    })
    .sort(
      (a, b) =>
        (a.LastModified?.getTime() ?? 0) - (b.LastModified?.getTime() ?? 0),
    );

  const tableName = process.env.TABLE_NAME;
  if (!tableName) {
    return new Response("TABLE_NAME is required", { status: 500 });
  }

  const dynamoDBClient = new DynamoDBClient();
  const documentClient = DynamoDBDocumentClient.from(dynamoDBClient);
  let id = 1;
  for (const s3Object of audioObjects) {
    const objectKey = s3Object.Key;
    const title = objectKey ? getBaseName(objectKey) : undefined;
    if (!objectKey || !title) {
      continue;
    }

    const albumArtUrl = albumArtUrlsByBaseName.get(title);

    console.log(`Adding entry for ${title}`);
    const putItemCommand = new PutCommand({
      TableName: tableName,
      Item: {
        id,
        title,
        description: title,
        audioUrl: getAssetUrl(objectKey),
        ...(albumArtUrl ? { albumArtUrl } : {}),
        publishDate: s3Object.LastModified?.toISOString(),
      },
    });
    await documentClient.send(putItemCommand);
    id++;
  }

  return new Response("Success!");
}
