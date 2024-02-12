import { DatabaseService } from "@a-list/core";
import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { Podcast, ItunesExplicit } from "podcast";
import { Api } from "sst/node/api";

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  const database = new DatabaseService();
  const entries = await database.retrieveAllEntries();

  const podcast = new Podcast({
    title: "The A-List Setlist",
    description: "DJ Mixes from A-List",
    feedUrl: "https://api.mattwyskiel.com/a-list/podcast-feed",
    siteUrl: "https://mattwyskiel.com",
    imageUrl: "https://assets.mattwyskiel.com/a-list/podcast-image.jpeg",
    author: "A-List",
    itunesExplicit: "yes",
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
      itunesExplicit: "yes",
      imageUrl: "https://assets.mattwyskiel.com/a-list/podcast-image.jpeg",
    });
  }

  return {
    statusCode: 200,
    body: podcast.buildXml(),
  };
};
