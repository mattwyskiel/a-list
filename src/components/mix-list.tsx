import { Badge } from "@whiskey/web-ui/components/ui/badge";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@whiskey/web-ui/components/ui/card";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@whiskey/web-ui/components/ui/empty";
import { Disc3, Rss } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { DEFAULT_ALBUM_ART_URL, getAlbumArtUrl } from "@/lib/album-art";
import { formatMixDuration, type MixDuration } from "@/lib/duration";

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "long",
  day: "numeric",
  year: "numeric",
});

export type MixListProps = {
  mixes: {
    id: number;
    title: string;
    description: string;
    audioUrl: string;
    albumArtUrl?: string;
    publishDate: string;
    duration?: MixDuration;
    slug: string;
  }[];
};

function formatDate(date: string): string {
  return dateFormatter.format(new Date(date));
}

export function MixList({ mixes }: MixListProps) {
  const latestMix = mixes.at(0);

  return (
    <div className="container mx-auto max-w-4xl px-4 py-10 md:py-14">
      <section className="mb-12 grid gap-7 md:grid-cols-[224px_1fr] md:items-start">
        <div className="rounded-xl border bg-card p-2 shadow-sm">
          <Image
            alt="The A-List Setlist podcast cover"
            className="aspect-square rounded-lg object-cover"
            src={DEFAULT_ALBUM_ART_URL}
            height={416}
            width={416}
            priority
          />
        </div>
        <div className="flex flex-col gap-4 pt-1">
          <h1 className="text-balance font-bold text-4xl tracking-tight md:text-5xl">
            The A-List Setlist
          </h1>
          <p className="max-w-xl text-muted-foreground text-xl leading-relaxed">
            My favorite mixes, archived in one place: a record of where my
            creative energy has gone, and a standing invitation to press play.
          </p>
          <p className="font-mono text-muted-foreground text-sm uppercase tracking-[0.18em]">
            {mixes.length} mixes
            {latestMix ? ` · latest ${formatDate(latestMix.publishDate)}` : ""}
          </p>
        </div>
      </section>

      <section className="flex flex-col gap-4" aria-labelledby="mixes-heading">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <h2 id="mixes-heading" className="font-semibold text-2xl">
            Latest mixes
          </h2>
          <Link
            href="/api/podcast-feed"
            className="inline-flex size-8 items-center justify-center rounded-lg text-brand hover:bg-card hover:text-brand-hover"
            aria-label="Podcast RSS feed"
            title="Podcast RSS feed"
          >
            <Rss className="size-4" />
          </Link>
        </div>

        {mixes.length === 0 ? (
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <Disc3 />
              </EmptyMedia>
              <EmptyTitle>No mixes published yet</EmptyTitle>
              <EmptyDescription>
                Check back soon for the first A-List Setlist entry.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <div className="flex flex-col gap-3">
            {mixes.map((mix, index) => {
              const duration = formatMixDuration(mix.duration);
              const isLatest = index === 0;

              return (
                <Card
                  key={mix.id}
                  className="transition-shadow hover:shadow-sm"
                >
                  <CardHeader className="grid gap-4 sm:grid-cols-[88px_1fr] sm:items-start">
                    <Link
                      href={`/mixes/${mix.slug}`}
                      className="relative block aspect-square w-full overflow-hidden rounded-lg border bg-card shadow-sm"
                      aria-label={`Listen to ${mix.title}`}
                    >
                      <Image
                        alt={`${mix.title} album art`}
                        className="object-cover transition-transform hover:scale-105"
                        fill
                        sizes="(min-width: 640px) 88px, calc(100vw - 4rem)"
                        src={getAlbumArtUrl(mix)}
                      />
                    </Link>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex flex-col gap-2">
                        <CardTitle className="flex flex-wrap items-center gap-2">
                          <Link
                            href={`/mixes/${mix.slug}`}
                            className="hover:text-brand"
                          >
                            {mix.title}
                          </Link>
                          {isLatest ? (
                            <Badge variant="secondary">Latest</Badge>
                          ) : null}
                        </CardTitle>
                        <CardDescription>{mix.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardFooter className="justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-muted-foreground">
                      {duration ? (
                        <>
                          <span>
                            <span className="sr-only">Duration </span>
                            {duration}
                          </span>
                          <span aria-hidden="true">·</span>
                        </>
                      ) : null}
                      <time dateTime={mix.publishDate}>
                        {formatDate(mix.publishDate)}
                      </time>
                    </div>
                    <Link
                      href={`/mixes/${mix.slug}`}
                      className="font-medium text-brand hover:text-brand-hover"
                    >
                      Listen →
                    </Link>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
