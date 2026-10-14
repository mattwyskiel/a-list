import { describe, expect, it } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import { Player, type PlayerProps } from "./player";

const mix: PlayerProps["mix"] = {
  id: 1,
  title: "Test mix",
  description: "A mix with chapters",
  audioUrl: "https://example.com/mix.mp3",
  publishDate: "2026-07-06T00:00:00.000Z",
};

function renderChapter(
  chapter: NonNullable<PlayerProps["mix"]["chapters"]>[number],
) {
  return renderToStaticMarkup(<Player mix={{ ...mix, chapters: [chapter] }} />);
}

describe("explicit chapter labels", () => {
  it("labels explicit structured tracks without changing their title", () => {
    const html = renderChapter({
      title: "01 Kim Petras - uh oh (Club Mix) [Mixed]",
      startTime: 0,
      explicit: true,
    });

    expect(html).toContain('title="Explicit"');
    expect(html).toMatch(/aria-hidden="true"[^>]*>E<\/span>/);
    expect(html).toContain('<span class="sr-only"> Explicit</span>');
    expect(html).toContain('aria-current="true"');
    expect(html).toContain("Kim Petras");
    expect(html).toContain("uh oh");
    expect(html).toContain("(Club Mix)");
    expect(html).toContain("[Mixed]");
  });

  it("labels explicit unstructured chapters too", () => {
    const html = renderChapter({
      title: "Encore",
      startTime: 12,
      explicit: true,
    });
    expect(html).toContain("Encore");
    expect(html).toContain('title="Explicit"');
    expect(html).toContain("0:12");
  });

  it.each([undefined, false])("does not label explicit=%s", (explicit) => {
    const html = renderChapter({
      title: "Legacy chapter",
      startTime: 0,
      explicit,
    });
    expect(html).not.toContain('title="Explicit"');
    expect(html).not.toContain('class="sr-only"> Explicit');
  });

  it("does not infer explicit content from a track title", () => {
    expect(
      renderChapter({ title: "Artist - Song [Explicit]", startTime: 0 }),
    ).not.toContain('title="Explicit"');
  });

  it("does not display labels for filtered-out chapters", () => {
    const html = renderToStaticMarkup(
      <Player
        mix={{
          ...mix,
          chapters: [
            { title: "", startTime: 0, explicit: true },
            { title: "Invalid time", startTime: -1, explicit: true },
          ],
        }}
      />,
    );
    expect(html).not.toContain('title="Explicit"');
  });
});
