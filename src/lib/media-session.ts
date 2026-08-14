import { type AlbumArtSource, getAlbumArtUrl } from "./album-art";

const A_LIST_ARTIST = "A-List";
const A_LIST_ALBUM = "The A-List Setlist";

type MediaSessionMetadataSource = AlbumArtSource & {
  title: string;
  activeChapterTitle?: string;
};

export function getMediaSessionMetadata(
  source: MediaSessionMetadataSource,
): MediaMetadataInit {
  const activeChapterTitle = source.activeChapterTitle?.trim();

  return {
    title: activeChapterTitle || source.title,
    artist: A_LIST_ARTIST,
    album: activeChapterTitle ? source.title : A_LIST_ALBUM,
    artwork: [{ src: getAlbumArtUrl(source) }],
  };
}
