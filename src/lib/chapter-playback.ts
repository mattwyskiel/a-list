type ChapterAudio = Pick<
  HTMLAudioElement,
  "play" | "readyState" | "duration" | "currentTime"
>;

// Return null when seeking must wait for loadedmetadata.
export function seekChapterAudio(
  audio: ChapterAudio,
  startTime: number,
  play: boolean,
): number | null {
  // Preserve the click's user gesture even if metadata is still loading.
  if (play) {
    void audio.play().catch(() => undefined);
  }
  if (audio.readyState < 1) {
    return null;
  }

  const nextTime = Number.isFinite(audio.duration)
    ? Math.min(startTime, audio.duration)
    : startTime;
  audio.currentTime = nextTime;
  return nextTime;
}
