const ARTIST_TITLE_PATTERN = /^(.+?)\s+[-\u2010-\u2015]\s+(.+)$/u;
const TRACK_PREFIX_PATTERN = /^(?:(\d{1,3})\s*[.)-]\s*|(0\d{1,2})\s+)(.+)$/u;
const TRAILING_ANNOTATION_PATTERN = /^(.+?)\s*\[([^[\]]+)\]$/u;
const TRAILING_MODIFICATION_PATTERN = /^(.+?)\s*\(([^()]+)\)$/u;

export type TrackMetadata = {
  artist: string;
  title: string;
  modification?: string;
  annotations: string[];
  trackNumber?: number;
};

function normalizeTrackText(value: string): string {
  return value.normalize("NFC").replace(/\s+/g, " ").trim();
}

function splitArtistAndTitle(value: string): RegExpExecArray | null {
  return ARTIST_TITLE_PATTERN.exec(value);
}

/**
 * Parse the listener-facing chapter convention:
 * `{artist} - {title} ({modification}) [{annotation}]`.
 *
 * A zero-padded or punctuated leading chapter number and common Unicode dash
 * separators are accepted. Requiring that signal preserves artists such as
 * `21 Savage` when no chapter number is present. Unstructured labels return
 * null so callers can preserve the original text.
 */
export function parseTrackMetadata(value: string): TrackMetadata | null {
  const normalized = normalizeTrackText(value);
  if (!normalized) {
    return null;
  }

  const prefixMatch = TRACK_PREFIX_PATTERN.exec(normalized);
  const titleWithPossiblePrefix = prefixMatch?.[3];
  const prefixedArtistTitle = titleWithPossiblePrefix
    ? splitArtistAndTitle(titleWithPossiblePrefix)
    : null;
  const artistTitle = prefixedArtistTitle ?? splitArtistAndTitle(normalized);

  if (!artistTitle) {
    return null;
  }

  const artist = artistTitle[1]?.trim();
  let title = artistTitle[2]?.trim();
  if (!artist || !title) {
    return null;
  }

  const annotations: string[] = [];
  let modification: string | undefined;
  let foundQualifier = true;

  // Accept both the preferred `(modification) [annotation]` order and older
  // chapter labels where a bracketed annotation precedes the modification.
  while (foundQualifier) {
    foundQualifier = false;

    const annotationMatch = TRAILING_ANNOTATION_PATTERN.exec(title);
    const annotation = annotationMatch?.[2]?.trim();
    if (annotationMatch && annotation) {
      title = annotationMatch[1]?.trim() ?? "";
      annotations.unshift(annotation);
      foundQualifier = true;
      continue;
    }

    const modificationMatch = modification
      ? null
      : TRAILING_MODIFICATION_PATTERN.exec(title);
    const matchedModification = modificationMatch?.[2]?.trim();
    if (modificationMatch && matchedModification) {
      title = modificationMatch[1]?.trim() ?? "";
      modification = matchedModification;
      foundQualifier = true;
    }
  }

  if (!title) {
    return null;
  }

  const trackNumber = prefixedArtistTitle
    ? Number(prefixMatch?.[1] ?? prefixMatch?.[2])
    : undefined;

  return {
    artist,
    title,
    ...(modification ? { modification } : {}),
    annotations,
    ...(trackNumber ? { trackNumber } : {}),
  };
}

/** Render the non-artist portion without losing modification or annotation text. */
export function formatTrackTitle(track: TrackMetadata): string {
  return [
    track.title,
    track.modification ? `(${track.modification})` : undefined,
    ...track.annotations.map((annotation) => `[${annotation}]`),
  ]
    .filter((part): part is string => Boolean(part))
    .join(" ");
}
