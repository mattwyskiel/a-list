/// <reference types="bun-types" />

import { describe, expect, test } from "bun:test";
import { formatMixDuration } from "./duration";

describe("formatMixDuration", () => {
  test("formats numeric seconds in layman's terms", () => {
    expect(formatMixDuration(65)).toBe("1 min");
    expect(formatMixDuration(1860)).toBe("31 min");
    expect(formatMixDuration(4823)).toBe("1 hr 20 min");
    expect(formatMixDuration(7380)).toBe("2 hr 3 min");
  });

  test("formats numeric string seconds in layman's terms", () => {
    expect(formatMixDuration("3600")).toBe("1 hr");
  });

  test("keeps preformatted duration strings", () => {
    expect(formatMixDuration("1 hr 20 min")).toBe("1 hr 20 min");
  });

  test("omits empty or invalid numeric durations", () => {
    expect(formatMixDuration(undefined)).toBeUndefined();
    expect(formatMixDuration("   ")).toBeUndefined();
    expect(formatMixDuration(-1)).toBeUndefined();
    expect(formatMixDuration(Number.NaN)).toBeUndefined();
  });
});
