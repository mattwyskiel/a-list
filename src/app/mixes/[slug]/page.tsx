import { ArrowLeft } from "lucide-react";
import type { Metadata, ResolvingMetadata } from "next";
import Link from "next/link";
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

export const dynamic = "force-dynamic";
export const revalidate = 60;
export const dynamicParams = true;

export async function generateStaticParams() {
  return [];
}

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

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const mix = await getData(slug);

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
      <Player mix={mix} />
    </div>
  );
}
