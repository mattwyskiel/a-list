import {
  Card,
  CardFooter,
  CardHeader,
} from "@whiskey/web-ui/components/ui/card";
import { Skeleton } from "@whiskey/web-ui/components/ui/skeleton";
import { Suspense } from "react";
import { MixList } from "@/components/mix-list";
import type { MixDuration } from "@/lib/duration";

type Mix = {
  id: number;
  title: string;
  description: string;
  audioUrl: string;
  albumArtUrl?: string;
  publishDate: string;
  duration?: MixDuration;
  slug: string;
  archive: boolean;
  draft: boolean;
};

function getBaseUrl(): string {
  return process.env.A_LIST_URL ?? "http://a-list.localhost:3003";
}

async function getData(): Promise<Mix[]> {
  const res = await fetch(`${getBaseUrl()}/api/entries`);

  // The return value is *not* serialized
  // You can return Date, Map, Set, etc.

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(
      `Failed to fetch data (${res.status} ${res.statusText})${errorText ? `: ${errorText}` : ""}`,
    );
  }

  const mixes: Mix[] = await res.json();

  return mixes
    .sort((a, b) => (a.publishDate > b.publishDate ? -1 : 1))
    .filter((mix) => !mix.archive && !mix.draft);
}

async function Mixes() {
  const mixes = await getData();
  return <MixList mixes={mixes} />;
}

function MixCardFallback({ compact = false }: { compact?: boolean }) {
  return (
    <Card>
      <CardHeader className="grid gap-4 sm:grid-cols-[88px_1fr] sm:items-start">
        <Skeleton className="aspect-square w-full rounded-lg" />
        <div className="flex flex-col gap-3 py-1">
          <div className="flex items-center gap-2">
            <Skeleton className="h-6 w-48 max-w-3/4" />
            {compact ? null : <Skeleton className="h-5 w-14 rounded-full" />}
          </div>
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>
      </CardHeader>
      <CardFooter className="justify-between gap-3">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-5 w-16" />
      </CardFooter>
    </Card>
  );
}

function MixListFallback() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-10 md:py-14">
      <section className="mb-12 grid gap-7 md:grid-cols-[224px_1fr] md:items-start">
        <div className="rounded-xl border bg-card p-2 shadow-sm">
          <Skeleton className="aspect-square w-full rounded-lg" />
        </div>
        <div className="flex flex-col gap-4 pt-1">
          <Skeleton className="h-12 w-72 max-w-full md:h-14" />
          <div className="flex max-w-xl flex-col gap-2">
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-11/12" />
            <Skeleton className="h-5 w-2/3" />
          </div>
          <Skeleton className="h-4 w-48" />
        </div>
      </section>
      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="size-8 rounded-lg" />
        </div>
        <div className="flex flex-col gap-3">
          <MixCardFallback />
          <MixCardFallback compact />
          <MixCardFallback compact />
        </div>
      </section>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<MixListFallback />}>
      <Mixes />
    </Suspense>
  );
}
