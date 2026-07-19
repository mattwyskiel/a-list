import { DatabaseService } from "@a-list/core";
import { Podcast } from "podcast";
import { DEFAULT_ALBUM_ART_URL, getAlbumArtUrl } from "@/lib/album-art";

function getPodcastChapters(
  chapters: { title: string; startTime: number }[] | undefined,
) {
  const validChapters = [...(chapters ?? [])]
    .filter(
      (chapter) =>
        chapter.title.trim().length > 0 &&
        Number.isFinite(chapter.startTime) &&
        chapter.startTime >= 0,
    )
    .sort((a, b) => a.startTime - b.startTime);

  if (validChapters.length === 0) {
    return undefined;
  }

  return {
    version: "1.2" as const,
    chapter: validChapters.map((chapter) => ({
      title: chapter.title,
      start: chapter.startTime,
    })),
  };
}

export async function GET(_request: Request) {
  const database = new DatabaseService();
  const entries = await database.retrieveAllEntries();

  const podcast = new Podcast({
    title: "The A-List Setlist",
    description: "DJ Mixes from A-List",
    feedUrl: "https://a-list.mattwyskiel.com/api/podcast-feed",
    siteUrl: "https://mattwyskiel.com",
    imageUrl: DEFAULT_ALBUM_ART_URL,
    author: "A-List",
    itunesExplicit: "yes",
  });

  for (const entry of entries) {
    const pscChapters = getPodcastChapters(entry.chapters);

    podcast.addItem({
      title: entry.title,
      description: entry.description,
      url: entry.audioUrl,
      date: new Date(entry.publishDate),
      enclosure: {
        url: entry.audioUrl,
      },
      itunesExplicit: "yes",
      imageUrl: getAlbumArtUrl(entry),
      ...(pscChapters ? { pscChapters } : {}),
    });
  }

  return new Response(podcast.buildXml(), { status: 200 });
}
