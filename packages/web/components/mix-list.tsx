/**
 * This code was generated by v0 by Vercel.
 * @see https://v0.dev/t/AQLQsQEvRvn
 */
import Image from "next/image";
import Link from "next/link";

export type MixListProps = {
  mixes: {
    id: number;
    title: string;
    description: string;
    audioUrl: string;
    publishDate: string;
    slug: string;
  }[];
};

export function MixList(props: MixListProps) {
  let mixes = props.mixes.map((mix) => (
    <div className="divide-y" key={mix.id}>
      <div className="grid grid-cols-4 items-center justify-between py-4">
        <div className="flex flex-col space-y-1.5 col-span-3">
          <h3 className="font-semibold">{mix.title}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {mix.description}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-500">
            {new Date(mix.publishDate).toDateString()}
          </p>
        </div>
        <div className="flex items-center justify-end space-x-2 md:space-x-4">
          <Link
            className="flex h-8 items-center rounded-lg bg-gray-900 px-2 text-sm font-medium text-gray-50 shadow transition-colors hover:bg-gray-900/90 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90"
            href={`/mixes/${mix.slug}`}
          >
            Listen
          </Link>
        </div>
      </div>
    </div>
  ));
  return (
    <div>
      <div className="py-12 md:py-16 lg:py-20 xl:py-24">
        <div className="px-4 grid gap-4 md:px-6">
          <div className="space-y-4">
            <div className="flex flex-wrap gap-1.5 items-center lg:max-w-screen-lg mx-auto">
              <Image
                alt="Album cover"
                className="rounded-lg object-cover mx-auto p-[15px]"
                src="https://assets.mattwyskiel.com/a-list/podcast-image.jpeg"
                height={265}
                width={265}
              />
              <div className="grow">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                  The A-List Setlist
                </h1>
                <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed dark:text-gray-400">
                  Here you&apos;ll find a compilation of my favorite mixes
                  I&apos;ve created over the past few years. A treasure trove of
                  where I spend my creative energy. I hope you enjoy!
                </p>
              </div>
            </div>
            <div className="lg:max-w-screen-lg mx-auto">{mixes}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
