import { DatabaseService } from "@a-list/core";
import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { Podcast } from "podcast";
import { Api } from "sst/node/api";

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  const database = new DatabaseService();
  const entries = await database.retrieveAllEntries();

  const podcast = new Podcast({
    title: "The A-List Setlist",
    description: "DJ Mixes from A-List",
    feedUrl: Api.api.url + "/podcast-feed",
    siteUrl: "https://mattwyskiel.com",
    author: "A-List",
  });

  for (const entry of entries) {
    podcast.addItem({
      title: entry.title,
      description: entry.description,
      url: entry.audioUrl,
      date: new Date(entry.publishDate),
      enclosure: {
        url: entry.audioUrl,
      },
    });
  }

  return {
    statusCode: 200,
    body: podcast.buildXml(),
  };
};
