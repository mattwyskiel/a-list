import { DatabaseService } from "@a-list/core";
import { Podcast } from "podcast";

export async function GET(_request: Request) {
  const database = new DatabaseService();
  const entries = await database.retrieveAllEntries();

  const podcast = new Podcast({
    title: "The A-List Setlist",
    description: "DJ Mixes from A-List",
    feedUrl: "https://a-list.mattwyskiel.com/api/podcast-feed",
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

  return new Response(podcast.buildXml(), { status: 200 });
}
