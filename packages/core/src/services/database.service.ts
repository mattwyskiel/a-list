import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  PutCommand,
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
}
