/// <reference types="bun-types" />

import { describe, expect, test } from "bun:test";
import { getYouTubeEmbedUrl, getYouTubeVideoId } from "./youtube";

const videoId = "dQw4w9WgXcQ";

describe("getYouTubeVideoId", () => {
  test("accepts a raw YouTube video ID", () => {
    expect(getYouTubeVideoId({ youtubeUrl: videoId })).toBe(videoId);
  });

  test("extracts video IDs from common YouTube URLs", () => {
    expect(
      getYouTubeVideoId({
        youtubeUrl: `https://www.youtube.com/watch?v=${videoId}`,
      }),
    ).toBe(videoId);
    expect(
      getYouTubeVideoId({ youtubeUrl: `https://youtu.be/${videoId}` }),
    ).toBe(videoId);
    expect(
      getYouTubeVideoId({
        youtubeUrl: `https://www.youtube.com/embed/${videoId}`,
      }),
    ).toBe(videoId);
    expect(
      getYouTubeVideoId({
        youtubeUrl: `https://www.youtube.com/shorts/${videoId}`,
      }),
    ).toBe(videoId);
  });

  test("rejects blank, malformed, and non-YouTube URLs", () => {
    expect(getYouTubeVideoId({})).toBeUndefined();
    expect(getYouTubeVideoId({ youtubeUrl: "   " })).toBeUndefined();
    expect(getYouTubeVideoId({ youtubeUrl: "not a video" })).toBeUndefined();
    expect(
      getYouTubeVideoId({
        youtubeUrl: `https://example.com/watch?v=${videoId}`,
      }),
    ).toBeUndefined();
  });
});

describe("getYouTubeEmbedUrl", () => {
  test("returns a privacy-enhanced embed URL", () => {
    expect(
      getYouTubeEmbedUrl({ youtubeUrl: `https://youtu.be/${videoId}` }),
    ).toBe(`https://www.youtube-nocookie.com/embed/${videoId}`);
  });
});
