import { describe, expect, it, mock } from "bun:test";
import { seekChapterAudio } from "./chapter-playback";

function createAudio(readyState = 1, duration = 600) {
  return {
    readyState,
    duration,
    currentTime: 0,
    play: mock(() => Promise.resolve()),
  };
}

describe("chapter audio seeking", () => {
  it("requests playback synchronously during a click before metadata is ready", () => {
    const audio = createAudio(0);
    expect(seekChapterAudio(audio, 412.5, true)).toBeNull();
    expect(audio.play).toHaveBeenCalledTimes(1);
    expect(audio.currentTime).toBe(0);

    audio.readyState = 1;
    expect(seekChapterAudio(audio, 412.5, false)).toBe(412.5);
    expect(audio.currentTime).toBe(412.5);
    expect(audio.play).toHaveBeenCalledTimes(1);
  });

  it("seeks direct links without requesting playback", () => {
    const audio = createAudio();
    expect(seekChapterAudio(audio, 123.5, false)).toBe(123.5);
    expect(audio.currentTime).toBe(123.5);
    expect(audio.play).not.toHaveBeenCalled();
  });

  it("plays clicked chapters when metadata is ready", () => {
    const audio = createAudio();
    expect(seekChapterAudio(audio, 0, true)).toBe(0);
    expect(audio.play).toHaveBeenCalledTimes(1);
  });

  it("clamps a timestamp beyond the audio duration", () => {
    const audio = createAudio();
    expect(seekChapterAudio(audio, 999999, false)).toBe(600);
    expect(audio.currentTime).toBe(600);
  });

  it("handles an unknown audio duration", () => {
    const audio = createAudio(1, Number.NaN);
    expect(seekChapterAudio(audio, 12.5, false)).toBe(12.5);
  });

  it("handles autoplay rejection without losing the seek", async () => {
    const audio = {
      ...createAudio(),
      play: mock(() => Promise.reject(new Error("NotAllowedError"))),
    };
    expect(seekChapterAudio(audio, 12.5, true)).toBe(12.5);
    await Promise.resolve();
    expect(audio.currentTime).toBe(12.5);
  });
});
