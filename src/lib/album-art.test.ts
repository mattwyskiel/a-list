/// <reference types="bun-types" />

import { describe, expect, test } from "bun:test";
import { DEFAULT_ALBUM_ART_URL, getAlbumArtUrl } from "./album-art";

describe("getAlbumArtUrl", () => {
  test("uses the mix album art when present", () => {
    expect(
      getAlbumArtUrl({
        albumArtUrl: "https://assets.mattwyskiel.com/a-list/mix-cover.jpg",
      }),
    ).toBe("https://assets.mattwyskiel.com/a-list/mix-cover.jpg");
  });

  test("falls back to the podcast cover for missing or blank album art", () => {
    expect(getAlbumArtUrl({})).toBe(DEFAULT_ALBUM_ART_URL);
    expect(getAlbumArtUrl({ albumArtUrl: "   " })).toBe(DEFAULT_ALBUM_ART_URL);
  });
});
