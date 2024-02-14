import { MixList } from "@/components/mix-list";

type Mix = {
  id: number;
  title: string;
  description: string;
  audioUrl: string;
  publishDate: string;
  slug: string;
};

async function getData(): Promise<Mix[]> {
  const res = await fetch("https://api.mattwyskiel.com/a-list/");

  // The return value is *not* serialized
  // You can return Date, Map, Set, etc.

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to fetch data");
  }

  return res.json();
}

export default async function Home() {
  let mixes = await getData();
  // sort mixes by publishDate in descending order
  mixes.sort((a, b) => (a.publishDate > b.publishDate ? -1 : 1));
  return <MixList mixes={mixes} />;
}
