import {
  Card,
  CardContent,
  CardHeader,
} from "@whiskey/web-ui/components/ui/card";
import { Separator } from "@whiskey/web-ui/components/ui/separator";
import { Skeleton } from "@whiskey/web-ui/components/ui/skeleton";
import { ArrowLeft } from "lucide-react";
import type { Metadata, ResolvingMetadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { Player } from "@/components/player";
import { getAlbumArtUrl } from "@/lib/album-art";

type Mix = {
  id: number;
  title: string;
  description: string;
  audioUrl: string;
  albumArtUrl?: string;
  youtubeUrl?: string;
  publishDate: string;
  slug: string;
  chapters?: {
    title: string;
    startTime: number;
  }[];
};

function getBaseUrl(): string {
  return process.env.A_LIST_URL ?? "http://a-list.localhost:3003";
}

async function getData(slug: string): Promise<Mix> {
  const res = await fetch(`${getBaseUrl()}/api/entries?slug=${slug}`);

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(
      `Failed to fetch data (${res.status} ${res.statusText})${errorText ? `: ${errorText}` : ""}`,
    );
  }

  return res.json();
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> },
  _parent: ResolvingMetadata,
): Promise<Metadata> {
  const { slug } = await params;
  const mix = await getData(slug);

  const albumArtUrl = getAlbumArtUrl(mix);

  return {
    title: `${mix.title} - The A-List Setlist`,
    description: mix.description,
    openGraph: {
      type: "music.song",
      title: mix.title,
      musicians: ["DJ A-List"],
      albums: ["The A-List Setlist"],
      siteName: "The A-List Setlist",
      url: `https://a-list.mattwyskiel.com/mixes/${slug}`,
      images: [
        {
          url: albumArtUrl,
          alt: `${mix.title} album art`,
        },
      ],
    },
  };
}

type PageParams = Promise<{ slug: string }>;

async function MixPlayer({ params }: { params: PageParams }) {
  const { slug } = await params;
  const mix = await getData(slug);
  return <Player mix={mix} />;
}

function TrackListFallback() {
  return (
    <div className="flex max-h-96 flex-col gap-2 overflow-hidden">
      {["w-4/5", "w-11/12", "w-3/4", "w-full", "w-5/6", "w-2/3"].map(
        (width) => (
          <div
            className="grid grid-cols-[4.5rem_1fr] items-center gap-3 px-3 py-2"
            key={width}
          >
            <Skeleton className="h-3 w-12" />
            <Skeleton className={`h-5 ${width}`} />
          </div>
        ),
      )}
    </div>
  );
}

function PlayerFallback() {
  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <div className="grid gap-6 md:grid-cols-[220px_1fr] md:items-center">
          <Skeleton className="aspect-square w-full rounded-lg" />
          <div className="flex flex-col gap-3">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-10 w-72 max-w-full md:h-12" />
            <Skeleton className="h-4 w-36" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <Skeleton className="h-3 w-12" />
            <Skeleton className="h-2 flex-1 rounded-full" />
            <Skeleton className="h-3 w-12" />
          </div>
          <div className="flex justify-center">
            <Skeleton className="size-12 rounded-full" />
          </div>
        </div>
        <div className="flex max-w-3xl flex-col gap-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-11/12" />
          <Skeleton className="h-4 w-3/4" />
        </div>
        <Separator />
        <section className="flex flex-col gap-3" aria-label="Loading tracks">
          <Skeleton className="h-6 w-20" />
          <TrackListFallback />
        </section>
      </CardContent>
    </Card>
  );
}

export default function Page({ params }: { params: PageParams }) {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-10 md:py-14">
      <div className="mb-6">
        <Link
          href="/"
          className="inline-flex w-fit items-center gap-2 font-medium text-muted-foreground text-sm hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Back to mixes
        </Link>
      </div>
      <Suspense fallback={<PlayerFallback />}>
        <MixPlayer params={params} />
      </Suspense>
    </div>
  );
}
