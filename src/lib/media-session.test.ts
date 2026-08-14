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

  test("uses the current chapter as the title and the mix as the album", () => {
    expect(
      getMediaSessionMetadata({
        title: "Uh Oh Mix Redux",
        activeChapterTitle: "  Rihanna - Where Have You Been  ",
        albumArtUrl:
          "https://assets.mattwyskiel.com/a-list/uh-oh-mix-redux.jpg",
      }),
    ).toEqual({
      title: "Rihanna - Where Have You Been",
      artist: "A-List",
      album: "Uh Oh Mix Redux",
      artwork: [
        {
          src: "https://assets.mattwyskiel.com/a-list/uh-oh-mix-redux.jpg",
        },
      ],
    });
  });
});
