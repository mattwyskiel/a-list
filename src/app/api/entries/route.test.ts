import { afterEach, describe, expect, it, spyOn } from "bun:test";
import { DatabaseService, type Entry } from "@a-list/core";
import { GET, POST } from "./route";

const entry: Entry = {
  id: 1,
  title: "Test mix",
  description: "Chapter flags",
  audioUrl: "https://example.com/mix.mp3",
  publishDate: "2026-07-06T00:00:00.000Z",
  slug: "test-mix",
  chapters: [
    { title: "Explicit track", startTime: 0, explicit: true },
    { title: "Clean track", startTime: 10, explicit: false },
    { title: "Legacy track", startTime: 20 },
  ],
};

const spies: { mockRestore(): void }[] = [];
afterEach(() => {
  for (const spy of spies.splice(0)) spy.mockRestore();
});

describe("entries API chapter flags", () => {
  it("passes explicit flags unchanged to storage", async () => {
    const addEntry = spyOn(
      DatabaseService.prototype,
      "addEntry",
    ).mockResolvedValue(undefined);
    spies.push(addEntry);
    const response = await POST(
      new Request("http://localhost/api/entries", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(entry),
      }),
    );

    expect(response.status).toBe(200);
    expect(addEntry).toHaveBeenCalledWith(entry);
  });

  it.each(
    ["true", "false", 1, 0, null, {}, []].map((explicit) => ({ explicit })),
  )(
    "rejects a non-boolean explicit flag (%j) before storage",
    async ({ explicit }) => {
      const addEntry = spyOn(
        DatabaseService.prototype,
        "addEntry",
      ).mockResolvedValue(undefined);
      spies.push(addEntry);
      const response = await POST(
        new Request("http://localhost/api/entries", {
          method: "POST",
          body: JSON.stringify({
            ...entry,
            chapters: [{ title: "Track", startTime: 0, explicit }],
          }),
        }),
      );
      expect(response.status).toBe(400);
      expect(addEntry).not.toHaveBeenCalled();
      const body = await response.json();
      expect(body.error).toBe("Invalid entry");
      expect(body.details[0].path).toEqual(["chapters", 0, "explicit"]);
    },
  );

  it.each([
    {},
    null,
    { ...entry, chapters: "invalid" },
    { ...entry, chapters: [null] },
    { ...entry, chapters: [{ title: "Track", startTime: -1 }] },
  ])("rejects malformed entries before storage (%j)", async (body) => {
    const addEntry = spyOn(
      DatabaseService.prototype,
      "addEntry",
    ).mockResolvedValue(undefined);
    spies.push(addEntry);
    const response = await POST(
      new Request("http://localhost/api/entries", {
        method: "POST",
        body: JSON.stringify(body),
      }),
    );
    expect(response.status).toBe(400);
    expect(addEntry).not.toHaveBeenCalled();
  });

  it("returns 400 for malformed JSON without writing to storage", async () => {
    const addEntry = spyOn(
      DatabaseService.prototype,
      "addEntry",
    ).mockResolvedValue(undefined);
    spies.push(addEntry);
    const response = await POST(
      new Request("http://localhost/api/entries", {
        method: "POST",
        body: "{",
      }),
    );
    expect(response.status).toBe(400);
    expect(addEntry).not.toHaveBeenCalled();
  });

  it("accepts entries without chapters and preserves extra metadata", async () => {
    const addEntry = spyOn(
      DatabaseService.prototype,
      "addEntry",
    ).mockResolvedValue(undefined);
    spies.push(addEntry);
    const legacyEntry = {
      ...entry,
      chapters: undefined,
      customMetadata: "keep me",
    };
    const response = await POST(
      new Request("http://localhost/api/entries", {
        method: "POST",
        body: JSON.stringify(legacyEntry),
      }),
    );
    expect(response.status).toBe(200);
    expect(addEntry).toHaveBeenCalledWith({
      ...entry,
      chapters: undefined,
      customMetadata: "keep me",
    });
  });

  it("returns flags and legacy chapters in the mix detail response", async () => {
    const getEntry = spyOn(
      DatabaseService.prototype,
      "getEntryBySlug",
    ).mockResolvedValue(entry);
    spies.push(getEntry);
    const response = await GET(
      new Request("http://localhost/api/entries?slug=test-mix"),
    );

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual(entry);
    expect(getEntry).toHaveBeenCalledWith("test-mix");
  });

  it("returns flags in the mix list response", async () => {
    const getEntries = spyOn(
      DatabaseService.prototype,
      "retrieveAllEntries",
    ).mockResolvedValue([entry]);
    spies.push(getEntries);
    const response = await GET(new Request("http://localhost/api/entries"));
    expect(await response.json()).toEqual([entry]);
  });
});
