import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  PutCommand,
  QueryCommand,
  ScanCommand,
} from "@aws-sdk/lib-dynamodb";
import { Entry } from "../model/entry";
import { Table } from "sst/node/table";

const dynamodb = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(dynamodb);

export class DatabaseService {
  public async retrieveAllEntries(): Promise<Entry[]> {
    const request = new ScanCommand({
      TableName: Table.Table.tableName,
    });
    const response = await docClient.send(request);
    return response.Items as Entry[];
  }
  public async addEntry(entry: Entry) {
    const request = new PutCommand({
      Item: entry,
      TableName: Table.Table.tableName,
    });
    await docClient.send(request);
  }
  public async getEntry(id: number): Promise<Entry | undefined> {
    const request = new QueryCommand({
      TableName: Table.Table.tableName,
      KeyConditionExpression: "id = :id",
      ExpressionAttributeValues: {
        ":id": id,
      },
    });
    const response = await docClient.send(request);
    return response.Items?.[0] as Entry;
  }
  public async getEntryBySlug(slug: string): Promise<Entry | undefined> {
    const request = new QueryCommand({
      TableName: Table.Table.tableName,
      IndexName: "bySlug",
      KeyConditionExpression: "slug = :slug",
      ExpressionAttributeValues: {
        ":slug": slug,
      },
    });
    const response = await docClient.send(request);
    return response.Items?.[0] as Entry;
  }
}
