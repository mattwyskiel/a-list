"use client";
/**
 * This code was generated by v0 by Vercel.
 * @see https://v0.dev/t/WCTh2OV7Pv9
 */
import { Button } from "@/components/ui/button";
import {
  CardHeader,
  CardContent,
  CardFooter,
  Card,
} from "@/components/ui/card";
import Image from "next/image";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";

export type PlayerProps = {
  mix: {
    id: number;
    title: string;
    description: string;
    audioUrl: string;
    publishDate: string;
  };
};

export function Player(props: PlayerProps) {
  return (
    <>
      <CardHeader className="pb-0">
        <div className="flex items-center gap-4">
          {/* <Button size="icon" variant="ghost">
            <ChevronLeftIcon className="w-5 h-5" />
          </Button> */}
          <div className="grid gap-1.5">
            <h2 className="text-lg font-bold leading-none">
              {props.mix.title}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              The A-List Setlist
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-4 p-6">
        <Image
          alt="Album cover"
          className="rounded-lg object-cover"
          height={200}
          src="https://assets.mattwyskiel.com/a-list/podcast-image.jpeg"
          width={200}
        />
        <div className="grid gap-2 text-center w-full">
          <p className="font-semibold">Playing now</p>
          <h3 className="font-bold text-xl">{props.mix.title}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {new Date(props.mix.publishDate).toDateString()}
          </p>
        </div>
        <AudioPlayer
          autoPlay
          src={props.mix.audioUrl}
          style={{
            backgroundColor: "transparent",
            color: "rgb(var(--foreground-rgb))",
          }}
          customAdditionalControls={[]}
          customVolumeControls={[]}
          // other props here
        />
        {/* <div className="grid gap-1 w-full">
          <input
            className="w-full slider-thumb-off-white"
            max="100"
            min="0"
            step="1"
            type="range"
            value="30"
          />
          <div className="flex items-center justify-between text-xs">
            <span>0:30</span>
            <span>1:00</span>
          </div>
        </div> */}
      </CardContent>
      {/* <CardFooter className="bg-gray-100 dark:bg-gray-800">
        <div className="grid grid-cols-3 items-center px-4">
          <Button className="place-self-start" size="icon" variant="ghost">
            <ShuffleIcon className="w-5 h-5" />
          </Button>
          <Button size="icon" variant="ghost">
            <StepBackIcon className="w-5 h-5" />
          </Button>
          <Button className="col-start-2" size="lg" variant="ghost">
            <PlayIcon className="w-8 h-8" />
          </Button>
          <Button size="icon" variant="ghost">
            <StepForwardIcon className="w-5 h-5" />
          </Button>
          <Button className="place-self-end" size="icon" variant="ghost">
            <RepeatIcon className="w-5 h-5" />
          </Button>
        </div>
      </CardFooter> */}
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

function ChevronRightIcon(props: any) {
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
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

function ShuffleIcon(props: any) {
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
      <path d="M2 18h1.4c1.3 0 2.5-.6 3.3-1.7l6.1-8.6c.7-1.1 2-1.7 3.3-1.7H22" />
      <path d="m18 2 4 4-4" />
      <path d="M2 6h1.9c1.5 0 2.9.9 3.6 2.2" />
      <path d="M22 18h-5.9c-1.3 0-2.6-.7-3.3-1.8l-.5-.8" />
      <path d="m18 14 4 4-4" />
    </svg>
  );
}

function StepBackIcon(props: any) {
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
      <line x1="18" x2="18" y1="20" y2="4" />
      <polygon points="14,20 4,12 14,4" />
    </svg>
  );
}

function PlayIcon(props: any) {
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
      <polygon points="5 3 19 12 21" />
    </svg>
  );
}

function StepForwardIcon(props: any) {
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
      <line x1="6" x2="6" y1="4" y2="20" />
      <polygon points="10,4 20,12 10,20" />
    </svg>
  );
}

function RepeatIcon(props: any) {
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
      <path d="m17 2 4 4-4" />
      <path d="M3 11v-1a4 4 0 1 4-4h14" />
      <path d="m7 22-4-4 4-4" />
      <path d="M21 13v1a4 4 0 1-4 4H3" />
    </svg>
  );
}
