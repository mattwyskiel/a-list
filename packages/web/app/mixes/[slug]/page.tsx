import { Player, PlayerProps } from "@/components/player";

type Mix = {
  id: number;
  title: string;
  description: string;
  audioUrl: string;
  publishDate: string;
};

async function getData(slug: string): Promise<Mix> {
  const res = await fetch("https://api.mattwyskiel.com/a-list/?slug=" + slug);

  // The return value is *not* serialized
  // You can return Date, Map, Set, etc.

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to fetch data");
  }

  return res.json();
}

export default async function Page({ params }: { params: { slug: string } }) {
  const mix = await getData(params.slug);
  return <Player mix={mix} />;
}
