import { Player, PlayerProps } from "@/components/player";
import { Button } from "@/components/ui/button";
import { CardHeader } from "@/components/ui/card";
import { Metadata, ResolvingMetadata } from "next";
import Link from "next/link";

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

export async function generateMetadata(
  { params }: { params: { slug: string } },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const mix = await getData(params.slug);

  return {
    title: `${mix.title} - The A-List Setlist`,
    description: mix.description,
    openGraph: {
      type: "music.song",
      title: mix.title,
      musicians: ["DJ A-List"],
      albums: ["The A-List Setlist"],
      siteName: "The A-List Setlist",
      url: `https://a-list.mattwyskiel.com/mixes/${params.slug}`,
      images: [
        {
          url: "https://assets.mattwyskiel.com/a-list/podcast-image.jpeg",
          width: 1024,
          height: 1024,
          alt: "The A-List Setlist - podcast cover image",
        },
      ],
    },
  };
}

export default async function Page({ params }: { params: { slug: string } }) {
  const mix = await getData(params.slug);
  return (
    <>
      <CardHeader className="pb-0">
        <div className="flex items-center gap-4">
          <Button size="icon" variant="ghost">
            <Link href="/">
              <ChevronLeftIcon className="w-5 h-5" />
            </Link>
          </Button>
          <div className="grid gap-1.5">
            <h2 className="text-md font-bold leading-none">
              The A-List Setlist
            </h2>
            {/* <p className="text-sm text-gray-500 dark:text-gray-400"></p> */}
          </div>
        </div>
      </CardHeader>
      <Player mix={mix} />
    </>
  );
}

function ChevronLeftIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}
