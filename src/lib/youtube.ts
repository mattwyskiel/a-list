export type YouTubeVideoSource = {
  youtubeUrl?: string | null;
};

const YOUTUBE_VIDEO_ID_REGEX = /^[A-Za-z0-9_-]{11}$/;
const YOUTUBE_PATH_PREFIXES = new Set(["embed", "live", "shorts", "v"]);

function isValidYouTubeVideoId(value: string | undefined): value is string {
  return typeof value === "string" && YOUTUBE_VIDEO_ID_REGEX.test(value);
}

function isYouTubeHost(hostname: string): boolean {
  const host = hostname.toLowerCase();

  return (
    host === "youtube.com" ||
    host.endsWith(".youtube.com") ||
    host === "youtube-nocookie.com" ||
    host.endsWith(".youtube-nocookie.com") ||
    host === "youtu.be" ||
    host.endsWith(".youtu.be")
  );
}

function getUrl(value: string): URL | undefined {
  try {
    return new URL(value);
  } catch {
    return undefined;
  }
}

export function getYouTubeVideoId(
  source: YouTubeVideoSource,
): string | undefined {
  const youtubeUrl = source.youtubeUrl?.trim();
  if (!youtubeUrl) {
    return undefined;
  }

  if (isValidYouTubeVideoId(youtubeUrl)) {
    return youtubeUrl;
  }

  const url = getUrl(youtubeUrl);
  if (!url || !isYouTubeHost(url.hostname)) {
    return undefined;
  }

  const pathSegments = url.pathname.split("/").filter(Boolean);
  const host = url.hostname.toLowerCase();
  const videoId =
    host === "youtu.be" || host.endsWith(".youtu.be")
      ? pathSegments[0]
      : (url.searchParams.get("v") ??
        (YOUTUBE_PATH_PREFIXES.has(pathSegments[0] ?? "")
          ? pathSegments[1]
          : undefined));

  return isValidYouTubeVideoId(videoId) ? videoId : undefined;
}

export function getYouTubeEmbedUrl(
  source: YouTubeVideoSource,
): string | undefined {
  const videoId = getYouTubeVideoId(source);

  return videoId
    ? `https://www.youtube-nocookie.com/embed/${videoId}`
    : undefined;
}
