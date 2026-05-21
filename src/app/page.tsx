import { MixList } from "@/components/mix-list";

type Mix = {
  id: number;
  title: string;
  description: string;
  audioUrl: string;
  publishDate: string;
  slug: string;
  archive: boolean;
  draft: boolean;
};

export const dynamic = "force-dynamic";
export const revalidate = 60;

function getBaseUrl(): string {
  return process.env.A_LIST_URL ?? "http://a-list.localhost:3003";
}

async function getData(): Promise<Mix[]> {
  const res = await fetch(`${getBaseUrl()}/api/entries`);

  // The return value is *not* serialized
  // You can return Date, Map, Set, etc.

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to fetch data");
  }

  const mixes: Mix[] = await res.json();

  return mixes
    .sort((a, b) => (a.publishDate > b.publishDate ? -1 : 1))
    .filter((mix) => !mix.archive && !mix.draft);
}

export default async function Home() {
  const mixes = await getData();
  return <MixList mixes={mixes} />;
}
