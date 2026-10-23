import { z } from "zod";

const chapterTimeSchema = z
  .string()
  .regex(/^\d+(?:\.\d+)?$/)
  .transform(Number)
  .pipe(z.number().nonnegative());

export function getChapterHash(startTime: number): string {
  return `#t=${startTime}`;
}

export function parseChapterHash(hash: string): number | null {
  if (!hash.startsWith("#t=")) {
    return null;
  }

  const result = chapterTimeSchema.safeParse(hash.slice(3));
  return result.success ? result.data : null;
}
