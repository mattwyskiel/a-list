import { describe, expect, it } from "bun:test";
import { getChapterHash, parseChapterHash } from "./chapter-links";

describe("chapter deep links", () => {
  it.each([0, 12, 412.5, 3600.125])("round-trips %s seconds", (seconds) => {
    expect(parseChapterHash(getChapterHash(seconds))).toBe(seconds);
  });

  it.each([
    "",
    "#",
    "#tracks",
    "#t=",
    "#t=-1",
    "#t=NaN",
    "#t=Infinity",
    "#t=1e3",
    "#t=0x10",
    "#t=12seconds",
    "#t=1:23",
    "#t= 12",
    "#t=12&other=1",
    "#t=%31",
    `#t=${"9".repeat(400)}`,
  ])("ignores invalid or unrelated fragment %s", (hash) => {
    expect(parseChapterHash(hash)).toBeNull();
  });

  it("preserves fractional chapter starts in shareable links", () => {
    expect(getChapterHash(412.5)).toBe("#t=412.5");
  });
});
