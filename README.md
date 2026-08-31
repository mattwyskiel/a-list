# A-List

![A-List](https://assets.mattwyskiel.com/a-list/podcast-image.jpeg)

A home website for my DJ-style mixes.

- Production: <https://a-list.mattwyskiel.com>
- Dev: <https://dev.a-list.mattwyskiel.com>
- Podcast feed: <https://a-list.mattwyskiel.com/api/podcast-feed>

## Background

I grew up with a love for music. My parents raised me on James Taylor, John Mayer, Donald Fagen, and Van Halen. For many years, at least since college, I've been building my skills on the side as a DJ and mixer, most prominently putting them to use as host of my college radio show King Matt's A-List.

Post-college, I started creating mixes again, and I began hosting them on my asset server and sending links to my friends. As I did it more and more, I realized they would want an easier experience listening, and that I too would want an easier way to access my mixes when I want to listen to them.

See a need, fill a need!

## Features

- Public list of non-archived, non-draft mixes
- Individual mix pages with per-mix album art, audio playback, optional YouTube embeds, and clickable chapters
- Lock-screen, notification, and desktop media controls with mix artwork and current track titles
- Podcast RSS feed for podcast apps, including per-item artwork and Simple Chapters when present
- DynamoDB-backed mix metadata storage
- Seed endpoint that imports mix metadata from the external asset bucket

## Stack

- **App:** Next.js App Router, React, TypeScript, Tailwind CSS
- **Runtime:** OpenNext on AWS Lambda
- **CDN:** Amazon CloudFront
- **Database:** Amazon DynamoDB
- **Assets:** External S3-backed asset host at `assets.mattwyskiel.com`
- **Infrastructure:** Pulumi
- **Package manager:** Bun

## Repository Layout

This repository is published from a larger private monorepo. The app-specific source is included here; some private workspace packages and deployment helpers are referenced by the source but are not published in this repository.

- `index.ts` - Pulumi program for the A-List site and DynamoDB table
- `src/` - Next.js application source
- `src/app/api/podcast-feed/route.ts` - podcast RSS route
- `src/app/api/seed-db/route.ts` - imports metadata from `com.mattwyskiel.assets/a-list/` and matches album art files by basename
- `src/app/mixes/[slug]/page.tsx` - individual mix page
- `src/components/` - UI components for the mix list and player

## Local Development

This public repository is primarily a source mirror. Running the app exactly as deployed requires private workspace packages, AWS resources, and secrets from the private infrastructure repo.

If you have the full private workspace, run the app from this directory with:

```bash
bun run dev
```

The local dev script serves the app at <http://a-list.localhost:3003> and defaults to:

- `TABLE_NAME=a-list-entries-dev`
- `A_LIST_URL=http://a-list.localhost:3003`
- `NEXT_PUBLIC_STACK=dev`

## Build and Typecheck

Within the full private workspace:

```bash
bun run typecheck
bun run --cwd src build
```

The production build uses OpenNext and produces `.open-next/` artifacts consumed by Pulumi deploys.

## Deploy

Deployments are managed from the private infrastructure workspace with Pulumi and CI/CD. This public mirror does not include all deployment dependencies or secrets required to deploy the site.

## Data Model

Mix metadata lives in DynamoDB and is keyed by numeric `id`. A global secondary index named `bySlug` supports lookups for `/mixes/[slug]`.

Entries may include optional `albumArtUrl` for per-mix cover art, optional `youtubeUrl` for an associated YouTube video, and optional `chapters` generated from Logic Pro markers:

```json
{
  "id": 1,
  "title": "Uh Oh Mix Redux",
  "description": "Uh Oh Mix Redux",
  "audioUrl": "https://assets.mattwyskiel.com/a-list/uh-oh-mix-redux.mp3",
  "albumArtUrl": "https://assets.mattwyskiel.com/a-list/uh-oh-mix-redux.jpg",
  "youtubeUrl": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  "publishDate": "2026-07-06T00:00:00.000Z",
  "duration": 4823,
  "slug": "uh-oh-mix-redux",
  "archive": false,
  "draft": false,
  "chapters": [
    { "title": "01 Kim Petras - uh oh", "startTime": 0 },
    { "title": "03 Rihanna - Where Have You Been", "startTime": 412.5 }
  ]
}
```

`albumArtUrl` should point at square cover art for the mix. If omitted, A-List falls back to the podcast cover image. The browser Media Session API sends that artwork and the mix title to supported mobile lock screens, notification controls, and desktop browser media surfaces. During a chapter, the mix title becomes the album. Structured chapter names use `{artist} - {title} ({modification}) [{annotation}]`, with an optional zero-padded or punctuated leading track number. A-List emphasizes those fields separately in the track list and sends the parsed artist and title (including modification and annotations) to Media Session. Unstructured chapter names remain supported and are sent unchanged with `A-List` as their artist. Unsupported browsers continue to use the normal in-page audio player.

`youtubeUrl` can be a YouTube watch, short, embed, youtu.be URL, or raw video ID; valid values render as a privacy-enhanced embed on the mix page. `duration` is optional and can be seconds or a preformatted display string; the homepage shows it on each mix list item. `startTime` is seconds from the beginning of the published audio file. The mix page renders chapters as jump links, and the RSS feed emits them as Podlove Simple Chapters.

To generate the JSON, export markers from Logic Pro as a standard MIDI file and run:

```bash
bun --cwd apps/cli src/index.ts music logic-chapters path/to/exported.mid chapters.json
```

The deployed Lambda receives:

- `A_LIST_URL` - canonical base URL for server-side route fetches
- `TABLE_NAME` - DynamoDB table name
- `NEXT_PUBLIC_STACK` - deployment stack name
