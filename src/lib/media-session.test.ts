/// <reference types="bun-types" />

import { describe, expect, test } from "bun:test";
import { DEFAULT_ALBUM_ART_URL } from "./album-art";
import { getMediaSessionMetadata } from "./media-session";

describe("getMediaSessionMetadata", () => {
  test("describes the mix when no chapter is active", () => {
    expect(getMediaSessionMetadata({ title: "Uh Oh Mix Redux" })).toEqual({
      title: "Uh Oh Mix Redux",
      artist: "A-List",
      album: "The A-List Setlist",
      artwork: [{ src: DEFAULT_ALBUM_ART_URL }],
    });
  });

  test("uses parsed track metadata for the current chapter", () => {
    expect(
      getMediaSessionMetadata({
        title: "Uh Oh Mix Redux",
        activeChapterTitle:
          "  03 Rihanna - Where Have You Been (Remix) [Mixed]  ",
        albumArtUrl:
          "https://assets.mattwyskiel.com/a-list/uh-oh-mix-redux.jpg",
      }),
    ).toEqual({
      title: "Where Have You Been (Remix) [Mixed]",
      artist: "Rihanna",
      album: "Uh Oh Mix Redux",
      artwork: [
        {
          src: "https://assets.mattwyskiel.com/a-list/uh-oh-mix-redux.jpg",
        },
      ],
    });
  });

  test("preserves unstructured chapter labels as a fallback", () => {
    expect(
      getMediaSessionMetadata({
        title: "Uh Oh Mix Redux",
        activeChapterTitle: "Mixed Interlude",
      }),
    ).toEqual({
      title: "Mixed Interlude",
      artist: "A-List",
      album: "Uh Oh Mix Redux",
      artwork: [{ src: DEFAULT_ALBUM_ART_URL }],
    });
  });
});
