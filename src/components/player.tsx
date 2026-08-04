"use client";

import { Button } from "@whiskey/web-ui/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@whiskey/web-ui/components/ui/card";
import { Separator } from "@whiskey/web-ui/components/ui/separator";
import { cn } from "@whiskey/web-ui/lib/utils";
import Image from "next/image";
import { useCallback, useMemo, useRef, useState } from "react";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import { getAlbumArtUrl } from "@/lib/album-art";
import { getYouTubeEmbedUrl } from "@/lib/youtube";

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "long",
  day: "numeric",
  year: "numeric",
});

type Chapter = {
  title: string;
  startTime: number;
};

export type PlayerProps = {
  mix: {
    id: number;
    title: string;
    description: string;
    audioUrl: string;
    albumArtUrl?: string;
    youtubeUrl?: string;
    publishDate: string;
    chapters?: Chapter[];
  };
};

function formatChapterTime(seconds: number): string {
  const safeSeconds = Math.max(0, Math.floor(seconds));
  const hours = Math.floor(safeSeconds / 3600);
  const minutes = Math.floor((safeSeconds % 3600) / 60);
  const remainingSeconds = safeSeconds % 60;

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
  }

  return `${minutes}:${String(remainingSeconds).padStart(2, "0")}`;
}

function ChapterTitle({ title }: { title: string }) {
  const mixedTagMatch =
    /\[(Mixed(?: Interlude)?)\]|\((Mixed(?: Interlude)?)\)/.exec(title);
  if (!mixedTagMatch) {
    return title;
  }

  const mixedTag = mixedTagMatch[0];
  const beforeTag = title.slice(0, mixedTagMatch.index);
  const afterTag = title.slice(mixedTagMatch.index + mixedTag.length);

  return (
    <>
      {beforeTag}
      <span className="text-muted-foreground/65">{mixedTag}</span>
      {afterTag}
    </>
  );
}

function getActiveChapterIndex(
  chapters: readonly Chapter[],
  currentTime: number,
) {
  let activeIndex = -1;

  for (const [index, chapter] of chapters.entries()) {
    if (chapter.startTime > currentTime + 0.5) {
      break;
    }

    activeIndex = index;
  }

  return activeIndex;
}

export function Player({ mix }: PlayerProps) {
  const playerRef = useRef<AudioPlayer>(null);
  const chapters = useMemo(
    () =>
      [...(mix.chapters ?? [])]
        .filter(
          (chapter) =>
            chapter.title.trim().length > 0 &&
            Number.isFinite(chapter.startTime) &&
            chapter.startTime >= 0,
        )
        .sort((a, b) => a.startTime - b.startTime),
    [mix.chapters],
  );
  const [activeChapterIndex, setActiveChapterIndex] = useState(() =>
    getActiveChapterIndex(chapters, 0),
  );
  const youtubeEmbedUrl = useMemo(
    () => getYouTubeEmbedUrl({ youtubeUrl: mix.youtubeUrl }),
    [mix.youtubeUrl],
  );

  const seekToChapter = useCallback(
    (startTime: number) => {
      const audio = playerRef.current?.audio.current;
      if (!audio) {
        return;
      }

      audio.currentTime = Math.max(0, startTime);
      setActiveChapterIndex(getActiveChapterIndex(chapters, startTime));
      void audio.play().catch(() => undefined);
    },
    [chapters],
  );

  const handleListen = useCallback(
    (event: Event) => {
      setActiveChapterIndex(
        getActiveChapterIndex(
          chapters,
          (event.target as HTMLAudioElement).currentTime,
        ),
      );
    },
    [chapters],
  );

  return (
    <Card className="overflow-visible">
      <CardHeader>
        <div className="grid gap-6 md:grid-cols-[220px_1fr] md:items-center">
          <Image
            alt={`${mix.title} album art`}
            className="aspect-square rounded-lg object-cover shadow-sm"
            height={440}
            src={getAlbumArtUrl(mix)}
            width={440}
            priority
          />
          <div className="flex flex-col gap-3">
            <p className="font-mono text-muted-foreground text-xs uppercase tracking-[0.2em]">
              now playing
            </p>
            <CardTitle className="text-3xl tracking-tight md:text-4xl">
              {mix.title}
            </CardTitle>
            <CardDescription>
              <time dateTime={mix.publishDate}>
                {dateFormatter.format(new Date(mix.publishDate))}
              </time>
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <AudioPlayer
          autoPlay
          customAdditionalControls={[]}
          customVolumeControls={[]}
          listenInterval={1000}
          onListen={handleListen}
          ref={playerRef}
          showJumpControls={false}
          src={mix.audioUrl}
        />
        {youtubeEmbedUrl ? (
          <section className="flex flex-col gap-3">
            <div className="aspect-video overflow-hidden rounded-xl border bg-card shadow-sm">
              <iframe
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="size-full"
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
                src={youtubeEmbedUrl}
                title={`${mix.title} YouTube video`}
              />
            </div>
          </section>
        ) : null}
        <section>
          <p className="max-w-3xl text-muted-foreground leading-relaxed">
            {mix.description}
          </p>
        </section>
        <Separator />
        {chapters.length > 0 ? (
          <section className="flex flex-col gap-3">
            <div>
              <h2 className="font-medium">Tracks</h2>
            </div>
            <ol className="flex max-h-96 flex-col gap-2 overflow-y-auto pr-1">
              {chapters.map((chapter, index) => {
                const isActive = index === activeChapterIndex;

                return (
                  <li key={`${chapter.startTime}-${chapter.title}`}>
                    <Button
                      aria-current={isActive ? "true" : undefined}
                      className={cn(
                        "h-auto w-full justify-start whitespace-normal px-3 py-2 text-left",
                        isActive && "bg-brand/10 text-brand hover:bg-brand/15",
                      )}
                      onClick={() => seekToChapter(chapter.startTime)}
                      type="button"
                      variant="ghost"
                    >
                      <span className="grid w-full grid-cols-[4.5rem_1fr] items-start gap-3">
                        <span className="font-mono text-muted-foreground text-xs leading-6 tabular-nums">
                          {formatChapterTime(chapter.startTime)}
                        </span>
                        <span className="leading-6">
                          <ChapterTitle title={chapter.title} />
                        </span>
                      </span>
                    </Button>
                  </li>
                );
              })}
            </ol>
          </section>
        ) : null}
      </CardContent>
    </Card>
  );
}
