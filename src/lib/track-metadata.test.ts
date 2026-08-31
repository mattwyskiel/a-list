/// <reference types="bun-types" />

import { describe, expect, test } from "bun:test";
import { formatTrackTitle, parseTrackMetadata } from "./track-metadata";

describe("parseTrackMetadata", () => {
  test("parses the canonical artist, title, modification, and annotation", () => {
    expect(
      parseTrackMetadata("Kim Petras - uh oh (Emo Club Anthem mix-in) [Mixed]"),
    ).toEqual({
      artist: "Kim Petras",
      title: "uh oh",
      modification: "Emo Club Anthem mix-in",
      annotations: ["Mixed"],
    });
  });

  test("extracts a leading chapter number", () => {
    expect(parseTrackMetadata("03 Rihanna - Where Have You Been")).toEqual({
      artist: "Rihanna",
      title: "Where Have You Been",
      annotations: [],
      trackNumber: 3,
    });

    expect(parseTrackMetadata("04 - Troye Sivan – Rush [Mixed]")).toEqual({
      artist: "Troye Sivan",
      title: "Rush",
      annotations: ["Mixed"],
      trackNumber: 4,
    });
  });

  test("accepts multiple annotations and Unicode dash separators", () => {
    expect(
      parseTrackMetadata("  Fred again.. — Rumble (Remix) [Mixed] [Clean]  "),
    ).toEqual({
      artist: "Fred again..",
      title: "Rumble",
      modification: "Remix",
      annotations: ["Mixed", "Clean"],
    });
  });

  test("accepts legacy labels with an annotation before the modification", () => {
    expect(
      parseTrackMetadata("Anitta - Mil Veces [A-List Re-Shuffle] (Mixed)"),
    ).toEqual({
      artist: "Anitta",
      title: "Mil Veces",
      modification: "Mixed",
      annotations: ["A-List Re-Shuffle"],
    });
  });

  test("does not mistake numeric-leading artists for track numbers", () => {
    for (const [label, artist, title] of [
      ["21 Savage - a lot", "21 Savage", "a lot"],
      ["2 Chainz - No Lie", "2 Chainz", "No Lie"],
      ["3 Doors Down - Kryptonite", "3 Doors Down", "Kryptonite"],
      ["50 Cent - In Da Club", "50 Cent", "In Da Club"],
      ["1975 - Somebody Else", "1975", "Somebody Else"],
    ] as const) {
      expect(parseTrackMetadata(label)).toEqual({
        artist,
        title,
        annotations: [],
      });
    }
  });

  test("returns null for labels without an artist-title separator", () => {
    expect(parseTrackMetadata("Interlude")).toBeNull();
    expect(parseTrackMetadata("  ")).toBeNull();
  });
});

describe("formatTrackTitle", () => {
  test("preserves title qualifiers while omitting artist and track number", () => {
    const track = parseTrackMetadata(
      "01 Kim Petras - uh oh (Emo Club Anthem mix-in) [Mixed]",
    );

    if (!track) {
      throw new Error("Expected structured track metadata");
    }
    expect(formatTrackTitle(track)).toBe(
      "uh oh (Emo Club Anthem mix-in) [Mixed]",
    );
  });
});
