export type MixDuration = number | string;

function formatDurationSeconds(seconds: number): string | undefined {
  if (!Number.isFinite(seconds) || seconds < 0) {
    return undefined;
  }

  const totalMinutes = Math.round(seconds / 60);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours > 0 && minutes > 0) {
    return `${hours} hr ${minutes} min`;
  }

  if (hours > 0) {
    return `${hours} hr`;
  }

  return `${totalMinutes} min`;
}

export function formatMixDuration(
  duration: MixDuration | undefined,
): string | undefined {
  if (duration === undefined) {
    return undefined;
  }

  if (typeof duration === "number") {
    return formatDurationSeconds(duration);
  }

  const trimmedDuration = duration.trim();
  if (trimmedDuration.length === 0) {
    return undefined;
  }

  const parsedDuration = Number(trimmedDuration);
  if (!Number.isFinite(parsedDuration)) {
    return trimmedDuration;
  }

  return formatDurationSeconds(parsedDuration);
}
