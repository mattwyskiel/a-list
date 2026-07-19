export const DEFAULT_ALBUM_ART_URL_OLD =
  "https://assets.mattwyskiel.com/a-list/podcast-image.jpeg";
export const DEFAULT_ALBUM_ART_URL =
  "https://assets.mattwyskiel.com/a-list/podcast-image-2.jpeg";

export type AlbumArtSource = {
  albumArtUrl?: string | null;
};

export function getAlbumArtUrl(source: AlbumArtSource): string {
  const albumArtUrl = source.albumArtUrl?.trim();

  return albumArtUrl && albumArtUrl.length > 0
    ? albumArtUrl
    : DEFAULT_ALBUM_ART_URL;
}
