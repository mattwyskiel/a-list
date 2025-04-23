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

export const revalidate = 60;

async function getData(): Promise<Mix[]> {
  const res = await fetch("https://api.mattwyskiel.com/a-list/");

  // The return value is *not* serialized
  // You can return Date, Map, Set, etc.

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to fetch data");
  }

  const mixes: Mix[] = await res.json();

  return mixes.sort((a, b) => (a.publishDate > b.publishDate ? -1 : 1)).filter((mix) => !mix.archive && !mix.draft);
}

export default async function Home() {
  let mixes = await getData();
  return <MixList mixes={mixes} />;
}
